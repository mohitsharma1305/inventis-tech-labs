import secrets
import pytest
from fastapi.testclient import TestClient
from psycopg import OperationalError
from backend.app.main import app
from backend.app import database as db

@pytest.fixture
def client():return TestClient(app)

def test_workspace_required(client):
    assert client.get('/api/history').status_code==422

def test_bad_workspace(client):
    assert client.get('/api/history',headers={'X-Workspace-Token':'bad'}).status_code==401

@pytest.mark.parametrize('path',['/api/history?limit=0','/api/history?offset=-1','/api/history?channel=other','/api/history?risk_level=other'])
def test_filters_validated(client,path):
    assert client.get(path,headers={'X-Workspace-Token':secrets.token_hex(32)}).status_code==422

def test_blank_analysis_rejected(client):
    assert client.post('/api/analyze',json={'text':' '},headers={'X-Workspace-Token':secrets.token_hex(32)}).status_code==422

def test_storage_failure_is_not_a_report(client,monkeypatch):
    def unavailable(*args):raise OperationalError('database down')
    monkeypatch.setattr(db,'existing',unavailable)
    r=client.post('/api/analyze',json={'text':'hello'},headers={'X-Workspace-Token':secrets.token_hex(32)})
    assert r.status_code==503
    assert 'risk_score' not in r.json()
    assert 'temporarily unavailable' in r.json()['detail']
