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
  _stateSubscription: null,

  async init() {
    const { data: { session } } = await sb.auth.getSession();
    this._session = session;
    if (!this._stateSubscription) {
      const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => { this._session = s; });
      this._stateSubscription = subscription;
    }
    return session;
  },

  async signInWithGitHub() {
    const base = window.location.href.replace(/[^/]*$/, '');
    await sb.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: base + 'dashboard.html' }
    });
  },

  async signInWithGoogle() {
    const base = window.location.href.replace(/[^/]*$/, '');
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: base + 'dashboard.html' }
    });
  },

  async signOut() {
    localStorage.removeItem('_authCache');
    await sb.auth.signOut();
    window.location.href = 'index.html';
  },

  async upsertProfile(user) {
    const displayName = user.user_metadata?.user_name
                     || user.user_metadata?.preferred_username
                     || user.user_metadata?.name
                     || user.email?.split('@')[0]
                     || '';
    await sb.from('profiles').upsert({
      id: user.id,
      github_username: displayName,
      github_avatar:   user.user_metadata?.avatar_url || '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  },

  async syncXP(userId) {
    try {
      const stats    = typeof Progress !== 'undefined' ? Progress.getStats() : null;
      const localXP  = stats?.xp || 0;
      const history  = stats?.history || [];
      const bestScore = history.length ? Math.max(...history.map(h => h.score)) : 0;

      const { data: p } = await sb.from('profiles').select('total_xp,quizzes_played,best_score').eq('id', userId).single();
      const remoteXP = p?.total_xp || 0;

      if (localXP > remoteXP) {
        await sb.from('profiles').update({
          total_xp:       localXP,
          quizzes_played: history.length,
          best_score:     bestScore,
          updated_at:     new Date().toISOString()
        }).eq('id', userId);
      }
    } catch(e) { console.warn('XP sync:', e); }
  },

  async guard() {
    const params = new URLSearchParams(window.location.search);
    const urlError = params.get('error');
    if (urlError) {
      console.error('[Auth] OAuth error na URL:', urlError, params.get('error_description'));
      window.location.href = 'index.html';
      return null;
    }

    return new Promise((resolve) => {
      const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
        if (event !== 'INITIAL_SESSION' && event !== 'SIGNED_IN') return;
        subscription.unsubscribe();
        console.log('[Auth] event:', event, '| session:', session ? session.user?.email : 'NULL');

        if (!session) {
          console.warn('[Auth] Sem sessão — redirecionando para index');
          window.location.href = 'index.html';
          resolve(null);
          return;
        }

        this._session = session;
        try {
          await this.upsertProfile(session.user);
          await this.syncXP(session.user.id);
        } catch(e) {
          console.error('[Auth] Erro no upsertProfile/syncXP:', e);
        }
        renderAuthTopbar(session.user);
        resolve(session);
      });
    });
  },

  async getRanking(limit = 20) {
    const { data, error } = await sb.from('profiles')
      .select('github_username,github_avatar,total_xp,quizzes_played,best_score')
      .gt('total_xp', 0)
      .not('github_username', 'eq', '')
      .order('total_xp', { ascending: false })
      .limit(limit);
    if (error) console.error('[Ranking] Supabase error:', error);
    return data || [];
  },

  async getStats() {
    const { data } = await sb.from('profiles').select('total_xp,quizzes_played').gte('total_xp', 150);
    const rows = data || [];
    const t = rows.reduce((a, p) => ({ xp: a.xp + (p.total_xp || 0), q: a.q + (p.quizzes_played || 0) }), { xp: 0, q: 0 });
    return { players: rows.length, totalXP: t.xp, totalQuizzes: t.q };
  }
};

// ── Render user in topbar ────────────────────────────────────────────────
function _topbarHTML(name, avatar) {
  const logoutBtn = `<button onclick="Auth.signOut()" title="Déconnexion" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px 6px;line-height:1;display:flex;align-items:center;border-radius:4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-muted)'"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>`;
  return `${avatar ? `<img src="${avatar}" alt="${name}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;flex-shrink:0;">` : `<div class="user-avatar">${name[0].toUpperCase()}</div>`}<span class="user-name">@${name}</span>${logoutBtn}`;
}

function renderAuthTopbar(user) {
  const el = document.querySelector('.user-info');
  if (!el) return;
  const name   = user.user_metadata?.user_name
              || user.user_metadata?.preferred_username
              || user.user_metadata?.name
              || user.email?.split('@')[0]
              || 'user';
  const avatar = user.user_metadata?.avatar_url || '';
  el.innerHTML = _topbarHTML(name, avatar);
  localStorage.setItem('_authCache', JSON.stringify({ name, avatar }));
}

// ── Pre-populate topbar from cache (evita flash ao navegar) ──────────────
(function() {
  const cached = JSON.parse(localStorage.getItem('_authCache') || 'null');
  if (!cached) return;
  const el = document.querySelector('.user-info');
  if (el) el.innerHTML = _topbarHTML(cached.name, cached.avatar);
})();

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
