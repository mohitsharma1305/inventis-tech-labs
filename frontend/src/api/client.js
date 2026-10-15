const KEY='inventis-workspace-v2';
function token(){let v=localStorage.getItem(KEY);if(!/^[a-f0-9]{64}$/.test(v||'')){v=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem(KEY,v)}return v}
async function request(path,options={}){const res=await fetch('/api'+path,{...options,headers:{'Content-Type':'application/json','X-Workspace-Token':token(),...options.headers},signal:AbortSignal.timeout(25000)});let data;try{data=await res.json()}catch{throw new Error('Invalid service response. Please retry.')}if(!res.ok)throw new Error(Array.isArray(data.detail)?data.detail.map(x=>x.msg).join('; '):data.detail||'Request failed');return data}
export const checkBackendHealth=()=>request('/health');
export const analyzeContent=p=>request('/analyze',{method:'POST',body:JSON.stringify(p)});
export const fetchHistory=(query='',riskLevel='ALL',channel='all',offset=0)=>request('/history?'+new URLSearchParams({query,risk_level:riskLevel,channel,limit:20,offset}));
export const fetchCase=id=>request('/history/'+id);
export const deleteCase=id=>request('/history/'+id,{method:'DELETE'});
export const fetchDashboardStats=()=>request('/dashboard/stats');
