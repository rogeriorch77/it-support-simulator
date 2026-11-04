'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function runtime() {
  const ctx=vm.createContext({URL,console,SUPABASE_URL:'https://example.supabase.co'});
  vm.runInContext(read('js/safe-dom.js'),ctx);
  vm.runInContext(read('js/avatar-assets.js'),ctx);
  return ctx;
}
const evaluate=(c,x)=>vm.runInContext(x,c);
test('All twelve unique nonhuman mascots are available as static optimized images',()=>{
  const c=runtime();
  const names=evaluate(c,'AvatarAssets.ids');
  assert.equal(names.length,12);
  assert.equal(new Set(names).size,12);
  assert.equal(evaluate(c,"AvatarAssets.render({avatar_kind:'mascot',avatar_id:'nerdowl'}, 'rk-avatar')").includes('mascot-avatar--nerdowl'),true);
  const sprite=fs.readFileSync(path.join(root,'img/avatars-v11.webp'));
  assert.equal(sprite.toString('ascii',0,4),'RIFF');
  assert.equal(sprite.toString('ascii',8,12),'WEBP');
  assert.ok(sprite.length<15000,'Sprite should be below 15 KB');
});
test('Profile names escape markup, metadata is never interpreted as HTML',()=>{
  const c=runtime(),user={display_name:'<svg onload=alert(1)>'};
  const html=evaluate(c,'AvatarAssets.render('+JSON.stringify({...user,avatar_kind:'mascot',avatar_id:'bad" onclick="alert(1)'})+')');
  assert.ok(!html.includes('onclick'));
  assert.ok(html.includes('&lt;'));
  assert.ok(evaluate(c,'AvatarAssets.displayName({display_name:"Nerd Owl",github_username:"old"})')==='Nerd Owl');
});
test('Provider photos require HTTPS from approved hosts; custom photos are owner scoped',()=>{
  const c=runtime(),id='b0be55a1-1234-4fed-8210-7e744ddcc444';
  assert.equal(evaluate(c,"AvatarAssets.imageUrl({avatar_kind:'provider',github_avatar:'javascript:alert(1)'})"),'');
  assert.equal(evaluate(c,"AvatarAssets.uploadUrl('attacker/avatar.webp')"),'');
  assert.equal(evaluate(c,"AvatarAssets.uploadUrl('"+id+"/avatar.webp')"),
    'https://example.supabase.co/storage/v1/object/public/profile-avatars/'+id+'/avatar.webp');
  const html=evaluate(c,"AvatarAssets.render({avatar_kind:'upload', custom_avatar_path:'javascript:alert(1)'})");
  assert.ok(!html.includes('src="javascript:'));
});
test('Rankings and profile edit flow never set or alter XP',()=>{
  for(const file of ['js/profile.js','js/avatar-assets.js','docs/PROFILE-AVATARS-V11.sql']) {
    const code=read(file);
    assert.doesNotMatch(code,/\b(?:total_xp|quizzes_played|best_score|total_correct|total_answered)\s*:/i,file);
    assert.doesNotMatch(code,/\bupdate\s+public\.profiles\b/i,file);
  }
});
test('Avatar library and profile controller load after SafeDom on protected pages',()=>{
  for(const page of ['dashboard','tickets','quiz','terminal','simulation','knowledge','entretiens']){
    const html=read(page+'.html');
    const idx=part=>html.indexOf(part);
    assert.ok(idx('js/safe-dom.js')<idx('js/avatar-assets.js'));
    assert.ok(idx('js/avatar-assets.js')<idx('js/auth.js'));
    assert.ok(idx('js/auth.js')<idx('js/profile.js'));
    assert.ok(idx('css/avatars.css')>=0 && idx('css/profile.css')>=0);
  }
});

test('First dashboard visit shows all twelve options; saving only appearance fields preserves XP',async()=>{
  const c=runtime();
  let payload=null;
  const profile={
    github_username:'Tester',github_avatar:'',total_xp:700,best_score:92,
    display_name:null,avatar_kind:'provider',avatar_id:null,custom_avatar_path:null,
    profile_setup_completed:false
  };
  const selectChain={
    eq(){return this},
    maybeSingle:async()=>({data:{...profile},error:null})
  };
  const updateChain={
    eq(){return this},
    select(){return this},
    single:async()=>({data:{...profile,...payload},error:null})
  };
  const buttons=new Map();
  const makeButton=(dataset={})=>{
    const b={dataset,disabled:false,handlers:{},addEventListener(type,fn){this.handlers[type]=fn;},
      setAttribute(){}};
    return b;
  };
  const dialog={
    innerHTML:'',handlers:{},remove(){this.removed=true},addEventListener(t,fn){this.handlers[t]=fn},
    querySelectorAll(sel){
      if(sel==='[data-mascot]')return this.mascotButtons||(this.mascotButtons=evaluate(c,'AvatarAssets.ids').map(x=>makeButton({mascot:x})));
      if(sel==='[data-kind]')return this.kindButtons||(this.kindButtons=['provider','upload'].map(x=>makeButton({kind:x})));
      return [];
    },
    querySelector(sel){
      if(!buttons.has(sel))buttons.set(sel,makeButton());
      return buttons.get(sel);
    }
  };
  buttons.set('#profilePseudo',{value:'',focus(){}});
  const document={body:{append(el){this.last=el}},createElement(){return dialog}};
  c.document=document;c.sessionStorage={getItem(){return null},setItem(){}};
  c.sb={from(){return{
    select(){return selectChain;},
    update(data){payload=data;return updateChain;}
  }}};
  c.renderAuthTopbar=()=>{};
  vm.runInContext(read('js/profile.js'),c);
  const u={id:'b0be55a1-1234-4fed-8210-7e744ddcc444',user_metadata:{name:'Tester'}};
  await evaluate(c,'ProfileAppearance.initForUser('+JSON.stringify(u)+',true)');
  assert.ok(document.body.last===dialog);
  assert.equal(dialog.querySelectorAll('[data-mascot]').length,12);
  assert.ok(dialog.innerHTML.includes('Importer une photo'));
  assert.ok(dialog.innerHTML.includes('Photo Google / GitHub'));
  assert.ok(dialog.innerHTML.includes('Pseudonyme public'));
  dialog.querySelector('#profilePseudo').value='New Geek';
  await dialog.querySelectorAll('[data-mascot]')[11].handlers.click();
  await dialog.querySelector('[data-save]').handlers.click();
  assert.equal(payload.display_name,'New Geek');
  assert.equal(payload.avatar_kind,'mascot');
  assert.equal(payload.avatar_id,'nerdowl');
  assert.equal(payload.profile_setup_completed,true);
  assert.equal(payload.custom_avatar_path,null);
  for(const key of ['total_xp','quizzes_played','best_score','total_correct','total_answered']){
    assert.ok(!(key in payload),key+' must not be updated');
  }
  assert.ok(dialog.removed,'Profile dialog closes after success');
});
