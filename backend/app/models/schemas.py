from typing import Literal, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel, Field, model_validator, field_validator
from ..engine.url_validation import normalize_url

class AnalyzeRequest(BaseModel):
    text: str = Field('',max_length=10000)
    url: Optional[str] = Field(None,max_length=2048)
    channel: Literal['sms','email','social','url'] = 'sms'
    request_id: UUID = Field(default_factory=uuid4)

    @field_validator('url')
    @classmethod
    def valid_url(cls,v):
        return normalize_url(v.strip()) if v and v.strip() else None

    @model_validator(mode='after')
    def content(self):
        self.text=self.text.strip()
        if not self.text and not self.url: raise ValueError('Enter a message or URL')
        return self

class FactorDetail(BaseModel):
    category: str
    name: str
    description: str
    severity: str
    points: float

class TriggerSpan(BaseModel):
    text: str
    start: int
    end: int
    category: str

class UrlAnalysisResult(BaseModel):
    url: str
    domain: str
    is_ip_host: bool
    is_shortener: bool
    suspicious_tld: bool
    entropy: float
    lexical_score: float
    subdomain_count: int
    reasons: list[str] = Field(default_factory=list)
