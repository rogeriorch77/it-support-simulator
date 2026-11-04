'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
function scope(){
  const window={supabase:{createClient:()=>({})},location:{protocol:'file:',hostname:'localhost',pathname:'/index.html'}};
  const document={querySelector:()=>null,addEventListener(){}};
  const localStorage={getItem:()=>null,setItem(){}};
  const ctx=vm.createContext({URL,window,document,localStorage,console,SUPABASE_URL:'https://example.supabase.co',SUPABASE_ANON:'test'});
  vm.runInContext(read('js/safe-dom.js'),ctx);
  vm.runInContext(read('js/xp-levels.js'),ctx);
  return ctx;
}
test('HTML text and attribute quotes are escaped',()=>{
  const c=scope(),raw='<img src=x onerror="alert(1)">\'&';
  assert.equal(vm.runInContext('SafeDom.escape('+JSON.stringify(raw)+')',c),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&#39;&amp;');
  assert.equal(vm.runInContext('SafeDom.escape(null)',c),'');
});
test('Avatar images allow only trusted HTTPS identity provider URLs',()=>{
  const c=scope(),check=v=>vm.runInContext('SafeDom.avatarUrl('+JSON.stringify(v)+')',c);
  assert.equal(check('https://avatars.githubusercontent.com/u/123?v=4'),'https://avatars.githubusercontent.com/u/123?v=4');
  assert.equal(check('https://lh3.googleusercontent.com/a/xyz'),'https://lh3.googleusercontent.com/a/xyz');
  for(const u of ['javascript:alert(1)','data:image/svg+xml,<svg/>','http://avatars.githubusercontent.com/u/1','//avatars.githubusercontent.com/u/1','https://avatars.githubusercontent.com.evil.com/u/1','https://avatars.githubusercontent.com@evil.example/x','https://evil.example/','https://user:pass@avatars.githubusercontent.com/u/1']) assert.equal(check(u),'',u);
});
test('Every HTML page loads SafeDom once before authentication',()=>{
  for(const name of ['index','ranking','dashboard','simulation','tickets','terminal','quiz','knowledge','entretiens']){
    const html=read(name+'.html'),i=html.indexOf('js/safe-dom.js'),a=html.indexOf('js/auth.js');
    assert.ok(i>=0,name);assert.equal(html.split('js/safe-dom.js').length-1,1);
    if(a>=0) assert.ok(i<a,name);
  }
});
test('Authentication topbar encodes profile and cached names',()=>{
  const c=scope();
  vm.runInContext(read('js/auth.js'),c);
  const name='<img src=x onerror=alert(1)>';
  const html=vm.runInContext('_topbarHTML('+JSON.stringify(name)+',"javascript:alert(1)")',c);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('src="javascript:'));
  assert.ok(!html.includes('<img src=x onerror=alert(1)>'));
});
test('Ranking, notes, search and bubbles encode browser-controlled text',()=>{
  for(const [file,text] of [
    ['ranking.html','SafeDom.escape(name)'],
    ['index.html',"SafeDom.escape(AvatarAssets.displayName(profile))"],
    ['tickets.html','SafeDom.escape(n.text)'],
    ['tickets.html','SafeDom.escape(t.issue)'],
    ['dashboard.html','SafeDom.escape(query)'],
    ['dashboard.html','SafeDom.escape(label)'],
    ['simulation.html',"document.createTextNode(String(text ?? ''))"],
    ['terminal.html','SafeDom.escape(ticket.issue)'],
    ['quiz.html','SafeDom.escape(r.q)']
  ])assert.ok(read(file).includes(text),file+': '+text);
});
test('Simulated terminal echo escapes user commands',()=>{
  const out=[],output={appendChild(x){out.push(x)},scrollTop:0,parentElement:{addEventListener(){}}};
  const input={value:'',addEventListener(){}};
  const document={querySelector:id=>id==='#out'?output:id==='#in'?input:{textContent:''},createElement:()=>({innerHTML:'',className:''})};
  const c=vm.createContext({document,console,Date,Math});
  vm.runInContext(read('js/terminal.js'),c);
  vm.runInContext("Terminal.init('#out','#in','#prompt'); Terminal.execute('echo <img src=x onerror=alert(1)>');",c);
  assert.ok(out.some(x=>x.innerHTML.includes('&lt;img')));
  assert.ok(!out.some(x=>x.innerHTML.includes('<img src=x onerror')));
});

test('All inline HTML scripts have valid JavaScript syntax',()=>{
  for(const page of ['index','ranking','dashboard','simulation','tickets','terminal','quiz','knowledge','entretiens']) {
    const html=read(page+'.html');
    for(const chunk of html.split('<script').slice(1)) {
      const endOfTag=chunk.indexOf('>');
      if(endOfTag < 0 || chunk.slice(0,endOfTag).includes('src=')) continue;
      const endOfScript=chunk.indexOf('</script>',endOfTag);
      if(endOfScript < 0) throw Error('Unterminated script in '+page);
      const body=chunk.slice(endOfTag+1,endOfScript);
      assert.doesNotThrow(()=>new vm.Script(body),'Inline script syntax: '+page);
    }
  }
});

test('Google Analytics is not auto-loaded before consent',()=>{
  for(const file of ['index.html','ranking.html']){
    const html=read(file);
    assert.ok(!html.includes('googletagmanager.com/gtag/js'),file);
    assert.ok(!html.includes("gtag('config'"),file);
  }
});
