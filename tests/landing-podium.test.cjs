'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const read=n=>fs.readFileSync(path.join(base,n),'utf8');
const src=read('index.html');
const script=src.slice(src.lastIndexOf('<script>')+8,src.lastIndexOf('</script>'));
const makeRows=count=>Array.from({length:count},(_,i)=>({
  github_username:'Player_'+(i+1),github_avatar:'',total_xp:12261-i*90,
  quizzes_played:5,best_score:85
}));
async function render(rows){
 const elements=new Map(),limits=[];
 const document={getElementById(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:''});return elements.get(id)},addEventListener(){}};
 const ctx=vm.createContext({document,console,URL,Auth:{getRanking:async limit=>{limits.push(limit);return rows.slice(0,limit)},getStats:async()=>({players:rows.length,totalXP:0,totalQuizzes:0})}});
 vm.runInContext(read('js/safe-dom.js'),ctx);
 vm.runInContext(read('js/avatar-assets.js'),ctx);
 vm.runInContext(read('js/xp-levels.js'),ctx);
 vm.runInContext(script,ctx);
 await vm.runInContext('loadRanking()',ctx);
 return {html:elements.get('lbBody').innerHTML,limits};
}
test('Homepage renders only 3 leaders with distinct prestige and medals',async()=>{
 const {html,limits}=await render(makeRows(20));
 assert.deepEqual(limits,[3],'Homepage should not request the other 17 profiles');
 assert.equal((html.match(/class="lb-podium-item\b/g)||[]).length,3);
 assert.equal((html.match(/class="lb-rest-row"/g)||[]).length,0);
 assert.ok(!html.includes('Player_4'));
 for(const medal of ['🥇','🥈','🥉'])assert.ok(html.includes(medal),medal);
 for(const label of ['LEADER','2E PLACE','3E PLACE','N° 01','N° 02','N° 03'])assert.ok(html.includes(label),label);
 for(const name of ['Player_1','Player_2','Player_3'])assert.ok(html.includes('@'+name),name);
 assert.ok(html.includes('lb-podium-item--leader'));
 assert.ok(html.includes('href="ranking.html"'));
});
test('Sparse rankings show only existing participants',async()=>{
 const one=await render(makeRows(1));
 assert.equal((one.html.match(/class="lb-podium-item\b/g)||[]).length,1);
 assert.ok(!one.html.includes('2E PLACE'));
 const none=await render([]);
 assert.ok(none.html.includes('Aucun joueur'));
});
test('All profile content is safely escaped, including attributes',async()=>{
 const rows=makeRows(3);
 rows[0].github_username='<img src=x onerror="alert(1)">';
 rows[1].github_username='<svg onload=alert(1)>';
 rows[2].github_avatar='javascript:alert(1)';
 const {html}=await render(rows);
 assert.ok(!html.includes('<img src=x onerror='));
 assert.ok(!html.includes('<svg onload='));
 assert.ok(!html.includes('src="javascript:'));
 assert.ok(html.includes('&lt;img'));
 assert.ok(html.includes('&quot;'));
 assert.ok(html.includes('&lt;svg'));
});
test('Podium has gold, silver, bronze presentation but level-based XP color',async()=>{
 const {html}=await render(makeRows(3));
 assert.ok(html.includes('--podium-accent:#F4C662'));
 assert.ok(html.includes('--podium-accent:#C1D0E2'));
 assert.ok(html.includes('--podium-accent:#DBA57F'));
 assert.ok(html.includes('style="color:#4ADE80"'),'Expert XP remains green for all top 3');
 assert.ok(src.includes('Voir le classement complet'));
 assert.ok(!src.includes('Places 4–'));
 assert.ok(!src.includes('class="lb-rest"'));
});
test('Desktop has three cards; mobile uses accessible vertical layout',()=>{
 assert.match(src,/\.lb-podium\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
 assert.match(src,/@media \(max-width:\s*740px\)/);
 assert.match(src,/\.lb-podium\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;/);
 assert.match(src,/\.lb-podium-item--leader\s*\{/);
});
