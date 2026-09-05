/* Aither Cloud Sync — private per-account calculator data sync. */
(()=>{
  const APP_ID='calculator';
  const API_FALLBACK='https://aitherbackend.onrender.com';
  const BLOCKED=/(password|token|secret|api[_-]?key|client[_-]?secret|authorization|session)/i;
  let syncing=false,lastRemoteUpdated=null,dirty=false;

  const api=()=>String(window.AitherAccount?.getApiUrl?.()||localStorage.getItem('aither-backend-url')||API_FALLBACK).replace(/\/+$/,'');
  const safeSnapshot=()=>{
    const data={};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key&&!BLOCKED.test(key))data[key]=localStorage.getItem(key);
    }
    return data;
  };
  const restore=data=>{
    if(!data||typeof data!=='object')return;
    Object.entries(data).forEach(([key,value])=>{
      if(!BLOCKED.test(key)&&typeof value==='string'){
        try{localStorage.setItem(key,value)}catch{}
      }
    });
  };
  async function request(path,options={}){
    const response=await fetch(api()+path,{...options,credentials:'include',headers:{Accept:'application/json','Content-Type':'application/json',...(options.headers||{})},cache:'no-store'});
    let body={};try{body=await response.json()}catch{}
    if(!response.ok)throw new Error(body.detail||`Aither Backend request failed (${response.status})`);
    return body;
  }
  const isAuthenticated=async()=>{
    try{return !!(await request('/api/auth/session')).authenticated}catch{return false}
  };
  async function pull(){
    if(syncing||!(await isAuthenticated()))return false;
    syncing=true;
    try{
      const remote=await request('/api/data/'+APP_ID);
      if(remote.data&&remote.updated_at&&remote.updated_at!==lastRemoteUpdated){
        restore(remote.data);
        lastRemoteUpdated=remote.updated_at;
        dirty=false;
        window.dispatchEvent(new CustomEvent('aither:cloud-restored',{detail:{updatedAt:remote.updated_at}}));
        return true;
      }
      return false;
    }finally{syncing=false}
  }
  async function push(){
    if(syncing||!dirty||!(await isAuthenticated()))return false;
    syncing=true;
    try{
      const result=await request('/api/data/'+APP_ID,{method:'PUT',body:JSON.stringify({data:safeSnapshot()})});
      lastRemoteUpdated=result.updated_at||Date.now().toString();
      dirty=false;
      return true;
    }catch(error){
      console.warn('[Aither Cloud]',error);
      return false;
    }finally{syncing=false}
  }
  async function sync(){
    if(syncing)return;
    if(dirty){await push();return}
    await pull();
  }
  window.AitherCloud={sync,pull,push,snapshot:safeSnapshot,markDirty:()=>{dirty=true;sync()}};
  addEventListener('aither:user-changed',async event=>{
    if(event.detail?.user){
      dirty=false;
      lastRemoteUpdated=null;
      const restored=await pull();
      if(!restored){dirty=true;await push();}
    }else{
      dirty=false;lastRemoteUpdated=null;
    }
  });
  addEventListener('aither:local-data-changed',()=>{dirty=true;clearTimeout(window.__aitherCloudTimer);window.__aitherCloudTimer=setTimeout(sync,700)});
  setInterval(sync,15000);
  sync();
})();
