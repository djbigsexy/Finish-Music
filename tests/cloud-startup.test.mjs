import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import vm from 'node:vm';

const source = stripTypeScriptTypes(readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8').replace(/^import .*;\n/gm, ''));
async function boot({ signedIn = true, fail = false, remote = [] } = {}) {
  const elements = new Map(), timers = new Map(), writes = [];
  let nextTimer = 0, inAuthCallback = false;
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      textContent: '', value: '', style: {}, dataset: {}, innerHTML: '', listeners: {},
      classList: { add(){}, remove(){}, toggle(){} },
      addEventListener(name, fn){ this.listeners[name] = fn; },
      querySelector(){ return element('query-child'); }, querySelectorAll(){return []},
      removeAttribute(){}, setAttribute(){}, focus(){}, pause(){}, load(){},
      click(){ return this.listeners.click?.({ target: this }); }
    });
    return elements.get(id);
  };
  const cached = { activeId: 'local-track', projects: [{ id:'local-track', title:'My saved track', stage:0, releaseDate:'', stageTasks:[], todos:[], notes:'Keep my notes', timestampNotes:[], arrangementVersion:'3', mixVersion:'2', masteredVersion:'1', trackType:'Original', releaseType:'Single', bpm:124, key:'Fm', genre:'House' }] };
  const storage = new Map([['finish-room-v1', JSON.stringify(cached)]]);
  const request = result => { const req = { result }; queueMicrotask(() => req.onsuccess?.()); return req; };
  const db = { transaction: () => ({ objectStore: () => ({ get: () => request(undefined) }) }) };
  const cloud = {
    auth: { onAuthStateChange(callback){ inAuthCallback=true;callback('INITIAL_SESSION', signedIn ? {user:{id:'user-1',email:'owner@example.com'}} : null);inAuthCallback=false; } },
    from(table){
      assert.equal(inAuthCallback, false, 'Database operations must run outside the auth callback');
      assert.equal(table, 'tracks');
      return {
        select: () => ({ eq: () => ({ order: async () => ({data:remote,error:null}) }) }),
        upsert: async rows => {writes.push(structuredClone(rows));return {error:fail ? new Error('Network unavailable') : null};}
      };
    }
  };
  const context = { cloud, isCloudConfigured:true, template:'',
    document:{getElementById:element,querySelector:element,querySelectorAll:()=>[],addEventListener(){}},
    localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    indexedDB:{open:()=>request(db)},
    window:{setTimeout:(fn,delay)=>{const id=++nextTimer;timers.set(id,{fn,delay});return id},clearTimeout:id=>timers.delete(id)},
    clearTimeout:id=>timers.delete(id),console:{error(){},warn(){}},CSS:{escape:x=>x},URL,Blob,File,crypto,
  };
  vm.runInNewContext(source,context);
  async function flush(){
    for(let round=0;round<30;round++){
      for(const [id,timer] of [...timers]) if(timer.delay<1000){timers.delete(id);timer.fn();}
      await new Promise(resolve=>setImmediate(resolve));
    }
  }
  await flush();
  return {elements,writes,storage,flush,setFailure:value=>{fail=value}};
}

test('signed-in app startup copies cached tracks into Supabase', async()=>{
  const app=await boot();
  assert.ok(app.writes.length>0,'startup must initialize cloud sync');
  const track=app.writes.at(-1)[0];
  assert.equal(track.id,'local-track');assert.equal(track.user_id,'user-1');
  assert.equal(track.notes,'Keep my notes');assert.equal(track.arrangement_version,'3');assert.equal(track.bpm,124);
  assert.equal(app.elements.get('saveState').textContent,'Saved to Supabase');
});
test('signed-out startup preserves local tracks without cloud writes',async()=>{
  const app=await boot({signedIn:false});assert.equal(app.writes.length,0);
  assert.equal(JSON.parse(app.storage.get('finish-room-v1')).projects[0].title,'My saved track');
});
test('failed sync stays visible, preserves local data, and manual retry succeeds',async()=>{
  const app=await boot({fail:true});
  assert.match(app.elements.get('saveState').textContent,/cloud sync failed/);
  assert.equal(JSON.parse(app.storage.get('finish-room-v1')).projects[0].notes,'Keep my notes');
  app.setFailure(false);await app.elements.get('syncCloudBtn').click();await app.flush();
  assert.equal(app.elements.get('saveState').textContent,'Saved to Supabase');
});
test('existing cloud tracks do not discard a newly created local track',async()=>{
  const app=await boot({remote:[{id:'remote-track',title:'Cloud track',user_id:'user-1',stage:0,stage_tasks:[],todos:[],timestamp_notes:[]}]});
  assert.deepEqual(app.writes.at(-1).map(row=>row.id).sort(),['local-track','remote-track']);
});
