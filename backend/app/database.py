"""PostgreSQL case repository. Never seeds data or falls back to local storage."""
import os
import hashlib
from datetime import datetime, timezone
from psycopg.rows import dict_row
from psycopg.types.json import Jsonb
from psycopg_pool import ConnectionPool

pool = ConnectionPool(os.environ.get('DATABASE_URL', ''), min_size=1, max_size=5,
                      timeout=8, open=False, kwargs={'row_factory': dict_row, 'connect_timeout': 5})

def init_db():
    if not os.environ.get('DATABASE_URL'):
        raise RuntimeError('DATABASE_URL is required')
    pool.open(wait=True, timeout=30)
    with pool.connection() as c:
        c.execute('''CREATE TABLE IF NOT EXISTS inventis_cases (
            id UUID PRIMARY KEY, workspace TEXT NOT NULL, request_id UUID NOT NULL,
            created_at TIMESTAMPTZ NOT NULL, channel TEXT NOT NULL,
            input_text TEXT NOT NULL, url TEXT, risk_score INTEGER NOT NULL CHECK(risk_score BETWEEN 0 AND 100),
            risk_level TEXT NOT NULL, brand TEXT, report JSONB NOT NULL,
            UNIQUE(workspace, request_id))''')
        c.execute('CREATE INDEX IF NOT EXISTS inventis_workspace_time ON inventis_cases(workspace, created_at DESC)')

def workspace_key(token):
    return hashlib.sha256(token.encode()).hexdigest()

def healthy():
    with pool.connection() as c:
        return c.execute('SELECT 1 AS ok').fetchone()['ok'] == 1

def existing(workspace, request_id):
    with pool.connection() as c:
        r = c.execute('SELECT report FROM inventis_cases WHERE workspace=%s AND request_id=%s', (workspace,request_id)).fetchone()
        return r['report'] if r else None

def save_case(workspace, request_id, report):
    with pool.connection() as c:
        c.execute('''INSERT INTO inventis_cases
          (id,workspace,request_id,created_at,channel,input_text,url,risk_score,risk_level,brand,report)
          VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ON CONFLICT(workspace,request_id) DO NOTHING''',
          (report['id'],workspace,request_id,report['timestamp'],report['channel'],report['input_text'],
           report['url_analysis']['url'] if report.get('url_analysis') else None,report['risk_score'],
           report['risk_level'],report.get('brand_impersonation'),Jsonb(report)))
        return c.execute('SELECT report FROM inventis_cases WHERE workspace=%s AND request_id=%s',(workspace,request_id)).fetchone()['report']

def history(workspace,query='',risk_level='ALL',channel='all',limit=20,offset=0):
    terms=['workspace=%s']; params=[workspace]
    if query:
        terms.append("(input_text ILIKE %s ESCAPE '\\' OR url ILIKE %s ESCAPE '\\' OR brand ILIKE %s ESCAPE '\\' OR id::text ILIKE %s ESCAPE '\\')")
        pattern='%'+query.replace('\\','\\\\').replace('%','\\%').replace('_','\\_')+'%';params.extend([pattern]*4)
    if risk_level!='ALL': terms.append('risk_level=%s');params.append(risk_level)
    if channel!='all': terms.append('channel=%s');params.append(channel)
    where=' AND '.join(terms)
    with pool.connection() as c:
        # A single statement keeps rows and total on the same snapshot.
        r=c.execute(f'''WITH filtered AS (SELECT * FROM inventis_cases WHERE {where}),
             page AS (SELECT id,created_at AS timestamp,channel,left(input_text,120) AS preview,
               url,risk_score,risk_level,brand AS brand_impersonation FROM filtered
               ORDER BY created_at DESC,id DESC LIMIT %s OFFSET %s)
             SELECT (SELECT count(*) FROM filtered) AS total,
               COALESCE((SELECT jsonb_agg(to_jsonb(page) ORDER BY page.timestamp DESC,page.id DESC) FROM page),'[]'::jsonb) AS items''',params+[limit,offset]).fetchone()
        return r

def get_case(workspace,case_id):
    with pool.connection() as c:
        r=c.execute('SELECT report FROM inventis_cases WHERE workspace=%s AND id=%s',(workspace,case_id)).fetchone()
        return r['report'] if r else None

def delete_case(workspace,case_id):
    with pool.connection() as c:
        return c.execute('DELETE FROM inventis_cases WHERE workspace=%s AND id=%s RETURNING id',(workspace,case_id)).fetchone() is not None

def metrics(workspace):
    with pool.connection() as c:
        rows=c.execute('SELECT risk_level,risk_score,channel,brand FROM inventis_cases WHERE workspace=%s',(workspace,)).fetchall()
    from collections import Counter
    levels=Counter(r['risk_level'] for r in rows)
    brands=Counter(r['brand'] for r in rows if r['brand'])
    return dict(total_analyzed=len(rows), critical_threats=levels['CRITICAL'],suspicious_cases=levels['SUSPICIOUS'],
      safe_cases=levels['SAFE'],avg_risk_score=round(sum(r['risk_score'] for r in rows)/len(rows),1) if rows else 0,
      threats_by_channel=dict(Counter(r['channel'] for r in rows)),
      top_impersonated_brands=[{'brand':b,'count':n} for b,n in brands.most_common(5)])
