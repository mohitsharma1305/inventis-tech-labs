import pytest
from pydantic import ValidationError
from backend.app.main import evaluate
from backend.app.models.schemas import AnalyzeRequest
from backend.app.engine.url_validation import normalize_url

@pytest.mark.parametrize('payload',[{}, {'text':'   '},{'text':'x','channel':'other'},{'url':'javascript:alert(1)'},{'url':'file:///etc/passwd'},{'url':'https://example.com:bad'},{'url':'https://user:pass@example.com'},{'text':'x'*10001}])
def test_invalid_input(payload):
    with pytest.raises(ValidationError):AnalyzeRequest(**payload)

@pytest.mark.parametrize('url,expected',[('example.com','https://example.com'),('https://Example.com/x','https://example.com/x'),('http://127.0.0.1','http://127.0.0.1'),('https://[::1]/','https://[::1]/')])
def test_normalize(url,expected):assert normalize_url(url)==expected

def test_no_disclaimer_bypass():
    r=evaluate(AnalyzeRequest(text='SBI account suspended. Enter your password immediately. Do not share OTP with anyone.'))
    assert any(f['category']=='Credential Harvesting' for f in r['factors'])
    assert r['risk_level']=='CRITICAL'

def test_multiple_links():
    r=evaluate(AnalyzeRequest(text='First https://google.com and then https://sbi-kyc.top/verify. SBI account suspended. Enter OTP immediately.'))
    assert len(r['url_analyses'])==2
    assert r['risk_level']=='CRITICAL'
    assert r['url_analysis']['domain']=='sbi-kyc.top'

def test_url_only_no_fake_ml():
    r=evaluate(AnalyzeRequest(url='https://example.com',channel='url'))
    assert r['ml_confidence'] is None
    assert r['input_text']==''
    assert len(r['url_analyses'])==1

def test_model_failure_is_error(monkeypatch):
    from backend.app.main import classifier_instance
    from fastapi import HTTPException
    monkeypatch.setattr(classifier_instance,'model',None)
    with pytest.raises(HTTPException) as error:evaluate(AnalyzeRequest(text='hello'))
    assert error.value.status_code==503

def test_no_fake_safety_claim():
    r=evaluate(AnalyzeRequest(text='The workshop is in Room 204 on Monday.'))
    assert 0<=r['risk_score']<=100
    assert 'does not verify' in r['summary']
    assert 'not enabled' in ' '.join(r['limitations'])
