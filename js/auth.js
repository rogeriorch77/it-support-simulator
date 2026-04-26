// ── Supabase client ──────────────────────────────────────────────────────
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Levels (shared across all pages) ────────────────────────────────────
const LEVELS = [
  { name:'Débutant',    min:0,     max:499,      color:'#6b7280', bg:'rgba(107,114,128,.18)' },
  { name:'Technicien',  min:500,   max:1499,     color:'#3b82f6', bg:'rgba(59,130,246,.18)'  },
  { name:'Support N1',  min:1500,  max:3499,     color:'#22c55e', bg:'rgba(34,197,94,.18)'   },
  { name:'Support N2',  min:3500,  max:6999,     color:'#eab308', bg:'rgba(234,179,8,.18)'   },
  { name:'Spécialiste', min:7000,  max:13999,    color:'#f97316', bg:'rgba(249,115,22,.18)'  },
  { name:'Expert',      min:14000, max:24999,    color:'#ef4444', bg:'rgba(239,68,68,.18)'   },
  { name:'Architecte',  min:25000, max:49999,    color:'#8b5cf6', bg:'rgba(139,92,246,.18)'  },
  { name:'Elite',       min:50000, max:Infinity, color:'#f59e0b', bg:'rgba(245,158,11,.18)'  },
];

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

// ── Auth module ──────────────────────────────────────────────────────────
const Auth = {
  _session: null,

  async init() {
    const { data: { session } } = await sb.auth.getSession();
    this._session = session;
    sb.auth.onAuthStateChange((_, s) => { this._session = s; });
    return session;
  },

  async signInWithGitHub() {
    const base = window.location.href.replace(/[^/]*$/, '');
    await sb.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: base + 'dashboard.html' }
    });
  },

  async signOut() {
    await sb.auth.signOut();
    window.location.href = 'index.html';
  },

  async upsertProfile(user) {
    await sb.from('profiles').upsert({
      id: user.id,
      github_username: user.user_metadata?.user_name || user.user_metadata?.preferred_username || '',
      github_avatar:   user.user_metadata?.avatar_url || '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  },

  async syncXP(userId) {
    try {
      const local = JSON.parse(localStorage.getItem('it_quiz_state') || '{}');
      const localXP = local.totalXP || 0;
      const { data: p } = await sb.from('profiles').select('total_xp,quizzes_played,total_correct,total_answered,best_score').eq('id', userId).single();
      const remoteXP = p?.total_xp || 0;

      if (localXP > remoteXP) {
        await sb.from('profiles').update({
          total_xp:       localXP,
          quizzes_played: local.quizzes       || 0,
          total_correct:  local.totalCorrect  || 0,
          total_answered: local.totalAnswered || 0,
          best_score:     local.bestScore     || 0,
          updated_at: new Date().toISOString()
        }).eq('id', userId);
      } else if (remoteXP > localXP && p) {
        localStorage.setItem('it_quiz_state', JSON.stringify({
          totalXP:       p.total_xp,
          quizzes:       p.quizzes_played,
          totalCorrect:  p.total_correct,
          totalAnswered: p.total_answered,
          bestScore:     p.best_score
        }));
      }
    } catch(e) { console.warn('XP sync:', e); }
  },

  async guard() {
    const session = await this.init();
    if (!session) { window.location.href = 'index.html'; return null; }
    await this.upsertProfile(session.user);
    await this.syncXP(session.user.id);
    renderAuthTopbar(session.user);
    return session;
  },

  async getRanking(limit = 20) {
    const { data } = await sb.from('profiles')
      .select('github_username,github_avatar,total_xp,quizzes_played,best_score')
      .order('total_xp', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getStats() {
    const { count } = await sb.from('profiles').select('*', { count:'exact', head:true });
    const { data }  = await sb.from('profiles').select('total_xp,quizzes_played');
    const t = (data||[]).reduce((a,p) => ({ xp: a.xp+(p.total_xp||0), q: a.q+(p.quizzes_played||0) }), { xp:0, q:0 });
    return { players: count||0, totalXP: t.xp, totalQuizzes: t.q };
  }
};

// ── Render user in topbar ────────────────────────────────────────────────
function renderAuthTopbar(user) {
  const el = document.querySelector('.user-info');
  if (!el) return;
  const name   = user.user_metadata?.user_name || 'user';
  const avatar = user.user_metadata?.avatar_url || '';
  el.innerHTML = `
    ${avatar ? `<img src="${avatar}" alt="${name}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0;">` : `<div class="user-avatar">${name[0].toUpperCase()}</div>`}
    <span class="user-name">@${name}</span>
    <button onclick="Auth.signOut()" title="Déconnexion" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:1.1rem;padding:2px 6px;line-height:1;">⏻</button>
  `;
}

// ── Auto-guard: protege todas as páginas excepto index.html ──────────────
(function() {
  const isLocal = window.location.protocol === 'file:' ||
                  window.location.hostname === 'localhost' ||
                  window.location.hostname === '127.0.0.1';
  if (isLocal) return; // sem auth em desenvolvimento local

  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page !== 'index.html' && page !== '') {
    document.addEventListener('DOMContentLoaded', () => Auth.guard());
  }
})();
