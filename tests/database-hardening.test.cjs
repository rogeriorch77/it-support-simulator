'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const forward=read('docs/SUPABASE-HARDENING-REVIEW.sql');
const rollback=read('docs/SUPABASE-HARDENING-ROLLBACK-REVIEW.sql');
const verification=read('docs/SUPABASE-HARDENING-VERIFY.sql');

test('SQL drafts are transaction-scoped and do not manipulate user rows',()=>{
  for(const sql of [forward,rollback]) {
    assert.match(sql,/\bBEGIN\s*;/);
    assert.match(sql,/\bCOMMIT\s*;/);
    assert.match(sql,/SET LOCAL lock_timeout/);
    assert.doesNotMatch(sql,/\b(?:DELETE\s+FROM|UPDATE\s+public\.profiles\s+SET|TRUNCATE\s+TABLE|DROP\s+TABLE|DROP\s+SCHEMA)\b/i);
  }
  assert.doesNotMatch(forward,/\bDROP\s+(?:POLICY|FUNCTION|TRIGGER|EVENT\s+TRIGGER)\b/i);
});

test('Production XP update permission remains unchanged by phase 1A',()=>{
  assert.doesNotMatch(forward,/REVOKE\s+UPDATE\b/i);
  assert.doesNotMatch(forward,/GRANT\s+UPDATE\b/i);
  assert.doesNotMatch(forward,/SET\s+total_xp\b/i);
});

test('Public leaderboard fields exactly match restricted anon grant',()=>{
  const cols=['github_username','github_avatar','display_name','avatar_kind','avatar_id','custom_avatar_path','total_xp','quizzes_played','best_score'];
  const match=forward.match(/GRANT SELECT \(([^)]+)\)\s*ON TABLE public\.profiles TO anon;/);
  assert.ok(match,'missing column-level anon SELECT grant');
  const allowed=match[1].split(',').map(x=>x.trim());
  assert.deepEqual(allowed,cols);
  for(const page of ['ranking.html','js/auth.js']) {
    assert.ok(read(page).includes(".select('"+cols.join(',')+"')"),page);
  }
  assert.match(forward,/REVOKE SELECT ON TABLE public\.profiles FROM anon;/);
});

test('RLS update and insert changes are scoped to authenticated owner',()=>{
  assert.match(forward,/ALTER POLICY profiles_own_insert ON public\.profiles\s+TO authenticated\s+WITH CHECK \(\(SELECT auth\.uid\(\)\) = id\);/);
  assert.match(forward,/ALTER POLICY profiles_own_update ON public\.profiles\s+TO authenticated\s+USING \(\(SELECT auth\.uid\(\)\) = id\)\s+WITH CHECK \(\(SELECT auth\.uid\(\)\) = id\);/);
  assert.match(forward,/GRANT INSERT \(id, github_username, github_avatar, updated_at\)\s*ON TABLE public\.profiles TO authenticated;/);
  assert.doesNotMatch(forward,/GRANT INSERT \([^)]*total_xp/);
});

test('Privileged trigger functions are locked down without being dropped',()=>{
  assert.match(forward,/ALTER FUNCTION public\.handle_new_user\(\) SET search_path = '';/);
  assert.match(forward,/REVOKE EXECUTE ON FUNCTION public\.handle_new_user\(\)\s+FROM PUBLIC, anon, authenticated;/);
  assert.match(forward,/REVOKE EXECUTE ON FUNCTION public\.rls_auto_enable\(\)\s+FROM PUBLIC, anon, authenticated;/);
  assert.doesNotMatch(forward,/DROP\s+(?:TRIGGER|EVENT TRIGGER)/);
});

test('Emergency rollback documents reversion of permissions and policies',()=>{
  assert.match(rollback,/GRANT TRUNCATE, TRIGGER, REFERENCES/);
  assert.match(rollback,/GRANT SELECT ON TABLE public\.profiles TO anon;/);
  assert.match(rollback,/REVOKE INSERT \(id, github_username, github_avatar, updated_at\)/);
  assert.match(rollback,/ALTER FUNCTION public\.handle_new_user\(\) RESET search_path;/);
  assert.match(rollback,/CREATE POLICY profiles_own_update/);
});

test('Verification covers ID confidentiality, public ranking and trigger health',()=>{
  for(const field of ['anon_can_read_internal_id','anon_can_read_xp','auth_can_insert_name','auth_can_insert_xp','on_auth_user_created','ensure_rls']) {
    if(field==='on_auth_user_created') assert.match(verification,/tgrelid='auth\.users'::regclass/);
    else assert.ok(verification.includes(field),field);
  }
  assert.match(verification,/COUNT\(\*\) AS total_profiles/);
});
