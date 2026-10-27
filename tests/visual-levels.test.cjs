'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(base,n),'utf8');
function ctx(){
  const store=new Map();
  const localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
  const document={querySelector(){return null},addEventListener(){}};
  const window={location:{protocol:'file:',hostname:'localhost'},supabase:{createClient:()=>({})}};
  const sandbox=vm.createContext({window,document,localStorage,SUPABASE_URL:'https://placeholder.invalid',SUPABASE_ANON:'test',console,URL,URLSearchParams});
  vm.runInContext(read('js/xp-levels.js'),sandbox);
  return {sandbox,store};
}
test('XP thresholds preserve French level labels while assigning four colors',()=>{
  const {sandbox:s}=ctx();
  const cases=[
    [0,'Débutant','#CBD5E1'],[499,'Débutant','#CBD5E1'],
    [500,'Junior','#CBD5E1'],[1999,'Junior','#CBD5E1'],
    [2000,'Confirmé','#FDBA74'],[4999,'Confirmé','#FDBA74'],
    [5000,'Senior','#B197FC'],[9999,'Senior','#B197FC'],
    [10000,'Expert','#4ADE80'],[49999,'Expert','#4ADE80'],
    [50000,'Élite','#4ADE80']
  ];
  for(const [xp,name,color] of cases) {
    const result=vm.runInContext('XPLevels.getLevel('+xp+')',s);
    assert.equal(result.name,name,String(xp));
    assert.equal(result.color,color,String(xp));
  }
  const levels=vm.runInContext('XPLevels.levels',s);
  assert.deepEqual([...new Set(levels.map(l=>l.tone))],['silver','orange','purple','green']);
  assert.equal(levels.length,6);
});
test('Unknown, negative or infinite XP remains safe',()=>{
  const {sandbox:s}=ctx();
  for(const value of ['null','undefined','NaN','Infinity','-20','"junk"']) {
    assert.equal(vm.runInContext('XPLevels.getLevel('+value+').name',s),'Débutant',value);
    assert.equal(vm.runInContext('XPLevels.getProgress('+value+')',s),0,value);
  }
});
test('Progress always uses shared thresholds; no XP award formula changes',()=>{
  const {sandbox:s,store}=ctx();
  vm.runInContext(read('js/progress.js'),s);
  const lev=vm.runInContext('Progress.getLevel(2005)',s);
  assert.equal(lev.name,'Confirmé');
  assert.equal(lev.color,'#FDBA74');
  assert.equal(vm.runInContext("Progress.calcXP({difficulty:'easy',score:70})",s),50);
  store.set('callHistory',JSON.stringify(Array.from({length:80},(_,i)=>({
    id:'sample-'+i,category:'Windows',difficulty:'medium',score:80,duration:240
  }))));
  const actual=vm.runInContext('Progress.getStats()',s);
  assert.equal(actual.xp,10000);
  assert.equal(actual.level.name,'Expert');
  assert.equal(actual.level.color,'#4ADE80');
});
test('Auth level helper uses precisely the same level object',()=>{
  const {sandbox:s}=ctx();
  vm.runInContext(read('js/auth.js'),s);
  for(const xp of [0,499,500,1999,2000,4999,5000,9999,10000,12261,50000]) {
    assert.equal(vm.runInContext('getLevel('+xp+')===XPLevels.getLevel('+xp+')',s),true,String(xp));
  }
});
test('All entry points load the level system once and before auth/progress',()=>{
  for(const file of ['index','ranking','dashboard','simulation','tickets','terminal','quiz','knowledge','entretiens']){
    const html=read(file+'.html');
    const pos=html.indexOf('js/xp-levels.js');
    assert.ok(pos>=0,file);
    assert.equal(html.split('js/xp-levels.js').length-1,1,file);
    for(const src of ['js/auth.js','js/progress.js']){
      const script=html.indexOf(src);
      if(script>=0)assert.ok(pos<script,file+' dependency order '+src);
    }
  }
});
test('Ranking and dashboard use the same badge, XP number and bar color',()=>{
  const rank=read('ranking.html'),home=read('index.html'),dash=read('dashboard.html'),quiz=read('quiz.html');
  assert.ok(!rank.includes('const LB_LEVELS = ['),'duplicate level table in ranking');
  assert.ok(!home.includes('const LB_LEVELS = ['),'duplicate level table on home');
  assert.ok(rank.includes('XPLevels.getLevel(xp)'));
  assert.ok(rank.includes('XPLevels.getProgress(xp)'));
  assert.ok(rank.includes('color:${color}'));
  assert.ok(home.includes('border:1px solid ${l.border}'));
  assert.ok(home.includes('XPLevels.getProgress(xp)'));
  for(const el of ['xpBarFill','xpLevelName','xpTotal','xpRingFill','xpStars'])
    assert.ok(dash.includes("getElementById('"+el+"').style"),el);
  for(const el of ['levelLabel','rLvlLabel','resultXpTotal','lvlBar','rLvlBar'])
    assert.ok(quiz.includes("'"+el+"'"),el);
  assert.ok(quiz.includes('applyLevelTheme(state.totalXP)'));
});

test('Tier text colors meet WCAG AA contrast against the dark ranking background',()=>{
  const hex=x=>x.replace('#','').match(/../g).map(v=>parseInt(v,16)/255)
    .map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  const lum=x=>{const [r,g,b]=hex(x);return .2126*r+.7152*g+.0722*b};
  const dark=lum('#0F1419');
  for(const color of ['#CBD5E1','#FDBA74','#B197FC','#4ADE80']){
    const contrast=(lum(color)+.05)/(dark+.05);
    assert.ok(contrast>=4.5,color+' insufficient contrast: '+contrast.toFixed(2));
  }
});

test('First, second and third positions retain correct medal characters',()=>{
  const ranking=read('ranking.html');
  const landing=read('index.html');
  assert.ok(ranking.includes("'🥇', '🥈', '🥉'"));
  assert.ok(landing.includes("'🥇','🥈','🥉'"));
});
