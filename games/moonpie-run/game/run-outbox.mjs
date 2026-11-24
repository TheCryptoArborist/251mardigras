const KEY='moonpie-run-outbox-v2',LEGACY='moonpie-pending-run';
export class RunOutbox {
 constructor(storage){
  this.storage=storage;this.items=[];this.inFlight=null;
  try{
   const saved=JSON.parse(storage?.getItem(KEY)||'null');
   const legacy=JSON.parse(storage?.getItem(LEGACY)||'null');
   const items=Array.isArray(saved)?saved:legacy?[legacy]:[];
   for(const item of items)if(item?.payload?.runId&&!this.items.some(p=>p.payload.runId===item.payload.runId))this.items.push(item);
   if(legacy&&this.persist())storage.removeItem(LEGACY);
  }catch{}
 }
 persist(){try{this.storage?.setItem(KEY,JSON.stringify(this.items));return !!this.storage;}catch{return false;}}
 add(item){if(!this.items.some(p=>p.payload.runId===item.payload.runId)){this.items.push(item);this.persist();}return item;}
 dismiss(runId){const item=this.items.find(p=>p.payload.runId===runId);if(item?.blocked){this.items=this.items.filter(p=>p!==item);this.persist();}}
 drain(send,onSaved=()=>{},onError=()=>{}){
  if(this.inFlight)return this.inFlight;
  this.inFlight=(async()=>{
   // Also picks up new finished runs added while an earlier request is in flight.
   while(true){
    const item=this.items.find(p=>!p.blocked);if(!item)return;
    let result;
    try{result=await send(item.payload);}
    catch(error){
     item.error=error.message||'Please try saving again.';
     item.blocked=!error.needsUsername&&[400,404,409].includes(error.status);
     this.persist();onError(item,error);
     if(item.blocked)continue;return;
    }
    this.items=this.items.filter(p=>p!==item);this.persist();onSaved(item,result);
   }
  })().finally(()=>{this.inFlight=null;});
  return this.inFlight;
 }
}
