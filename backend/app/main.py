import os,re,time,uuid,logging
from collections import deque
from threading import Lock
from contextlib import asynccontextmanager
from datetime import datetime,timezone
from pathlib import Path
from typing import Annotated,Literal
from fastapi import FastAPI,Header,HTTPException,Depends,Query
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from psycopg import Error as DatabaseError
from psycopg_pool import PoolTimeout
from . import database as db
from .models.schemas import AnalyzeRequest,FactorDetail
from .engine.url_analyzer import extract_urls,analyze_url
from .engine.brand_matcher import detect_brand_impersonation
from .engine.linguistic_analyzer import analyze_linguistic_patterns
from .engine.ml_classifier import classifier_instance
from .engine.risk_scorer import compute_composite_risk

@asynccontextmanager
async def lifespan(app):
    db.init_db()
    yield
    db.pool.close()
app=FastAPI(title='Inventis',version='2.0.0',lifespan=lifespan)
@app.exception_handler(DatabaseError)
@app.exception_handler(PoolTimeout)
async def database_error(request,exc):
    logging.error('Database operation failed: %s',type(exc).__name__)
    return JSONResponse(status_code=503,content={'detail':'Storage is temporarily unavailable. No report was fabricated. Please retry.'})
@app.middleware('http')
async def security_headers(request,call_next):
    if request.headers.get('content-length','').isdigit() and int(request.headers['content-length'])>100000:
        return JSONResponse(status_code=413,content={'detail':'Request too large'})
    response=await call_next(request)
    response.headers['X-Content-Type-Options']='nosniff'
    response.headers['Referrer-Policy']='no-referrer'
    response.headers['X-Frame-Options']='DENY'
    if request.url.path.startswith('/api/'): response.headers['Cache-Control']='no-store'
    return response

def workspace(x_workspace_token:Annotated[str,Header()]):
    if not re.fullmatch('[a-f0-9]{64}',x_workspace_token):raise HTTPException(401,'Invalid browser workspace token')
    return db.workspace_key(x_workspace_token)
rate_lock=Lock();rate_buckets={}
def limit_requests(key):
    now=time.monotonic()
    with rate_lock:
        if len(rate_buckets)>2000:
            for k in list(rate_buckets):
                if not rate_buckets[k] or now-rate_buckets[k][-1]>60:del rate_buckets[k]
            if len(rate_buckets)>2000:raise HTTPException(429,'Service busy. Try again shortly.')
        q=rate_buckets.setdefault(key,deque())
        while q and now-q[0]>60:q.popleft()
        if len(q)>=30:raise HTTPException(429,'Please wait a minute before submitting more analyses.')
        q.append(now)
@app.get('/api/health')
def health():
    db.healthy()
    return {'status':'online','database':'postgresql','models_loaded':classifier_instance.model is not None,
      'engine':'TF-IDF + Logistic Regression and rules','model_evaluation':'Not established; small bundled baseline corpus',
      'live_reputation':False,'vm_inspection':False,'version':'2.0.0'}

def evaluate(req):
    candidates=list(dict.fromkeys(([req.url] if req.url else [])+extract_urls(req.text)))
    if len(candidates)>20:raise HTTPException(422,'A maximum of 20 URLs can be inspected per request')
    urls=[]
    for candidate in candidates:
        try:urls.append(analyze_url(candidate))
        except ValueError:raise HTTPException(422,'One of the extracted links is invalid. Check the message or URL.')
    ling,triggers,factors=analyze_linguistic_patterns(req.text)
    if req.text:
        try:ml_prob,ml_meta=classifier_instance.predict_phishing_probability(req.text)
        except RuntimeError:raise HTTPException(503,'Text classifier unavailable. Please retry later.')
    else:ml_prob,ml_meta=None,{'status':'not_applicable'}
    assessments=[]
    for result in urls or [None]:
        brand,bs,reasons=detect_brand_impersonation(req.text,result.domain if result else None)
        if bs>0 and brand:factors.append(FactorDetail(category='Brand consistency',name='Unverified brand claim',description='; '.join(reasons),severity='warning',points=bs))
        if result:
            for reason in result.reasons:factors.append(FactorDetail(category='URL structure',name=result.domain,description=reason,severity='warning',points=result.lexical_score))
        score,level,breakdown=compute_composite_risk(text_prob=ml_prob or 0,linguistic_score=ling,url_score=result.lexical_score if result else None,brand_score=bs,has_critical_credential_harvesting=any(f.category=='Credential Harvesting' for f in factors))
        if not req.text and result:
            score=max(score,round(100*(0.65*result.lexical_score+0.35*bs)))
            level='CRITICAL' if score>=70 else 'SUSPICIOUS' if score>=30 else 'SAFE'
        assessments.append((score,level,brand if bs>0 else None,result,breakdown))
    score,level,brand,primary,breakdown=max(assessments,key=lambda r:r[0])
    summary={'SAFE':'Few configured risk indicators detected. This does not verify the sender or website.','SUSPICIOUS':'Some suspicious indicators were detected. Verify the request independently.','CRITICAL':'Multiple strong risk indicators were detected. Avoid interacting until independently verified.'}[level]
    return {'id':str(uuid.uuid4()),'timestamp':datetime.now(timezone.utc).isoformat(),'channel':req.channel,'input_text':req.text,'input_url':req.url,'risk_score':score,'risk_level':level,'is_phishing':level=='CRITICAL','summary':summary,'recommended_action':'Use the organisation’s independently verified official app or contact channel. Do not provide passwords, OTPs or payments through an unverified request.','factors':[f.model_dump() for f in factors],'triggers':[t.model_dump() for t in triggers],'url_analysis':primary.model_dump() if primary else None,'url_analyses':[u.model_dump() for u in urls],'brand_impersonation':brand,'ml_confidence':ml_prob,'ml_metadata':ml_meta,'score_breakdown':breakdown,'interstitial_warning_needed':bool(urls),'limitations':['Submitted-content analysis only. Websites were not visited.','Live reputation and VM inspection are not enabled.','The bundled text model is a small baseline without measured accuracy.']}
@app.post('/api/analyze')
def analyze(req:AnalyzeRequest,key=Depends(workspace)):
    limit_requests(key)
    previous=db.existing(key,req.request_id)
    if previous:
        if any(previous.get(k)!=v for k,v in [('input_text',req.text),('input_url',req.url),('channel',req.channel)]):raise HTTPException(409,'Request ID was already used for different content')
        return previous
    report=db.save_case(key,req.request_id,evaluate(req))
    if any(report.get(k)!=v for k,v in [('input_text',req.text),('input_url',req.url),('channel',req.channel)]):raise HTTPException(409,'Request ID was already used for different content')
    return report
@app.get('/api/history')
def history(query:str=Query('',max_length=200),risk_level:Literal['ALL','SAFE','SUSPICIOUS','CRITICAL']='ALL',channel:Literal['all','sms','email','social','url']='all',limit:int=Query(20,ge=1,le=100),offset:int=Query(0,ge=0),key=Depends(workspace)):
    return db.history(key,query,risk_level,channel,limit,offset)
@app.get('/api/history/{case_id}')
def case(case_id:uuid.UUID,key=Depends(workspace)):
    r=db.get_case(key,case_id)
    if not r:raise HTTPException(404,'Case not found in this workspace')
    return r
@app.delete('/api/history/{case_id}')
def delete(case_id:uuid.UUID,key=Depends(workspace)):
    if not db.delete_case(key,case_id):raise HTTPException(404,'Case not found in this workspace')
    return {'deleted':True}
@app.get('/api/dashboard/stats')
def stats(key=Depends(workspace)):return db.metrics(key)
static=Path(__file__).resolve().parents[2]/'frontend'/'dist'
if static.is_dir():app.mount('/',StaticFiles(directory=static,html=True),name='frontend')
