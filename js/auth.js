// ── Supabase client ──────────────────────────────────────────────────────
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Levels (shared across all pages) ────────────────────────────────────
const LEVELS = XPLevels.levels;

function getLevel(xp) {
  return XPLevels.getLevel(xp);
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
                     || user.user_metadata?.full_name
                     || user.user_metadata?.name
                     || user.email?.split('@')[0]
                     || '';
    const payload = {
      id: user.id,
      github_avatar: user.user_metadata?.avatar_url
                  || user.user_metadata?.picture
                  || '',
      updated_at: new Date().toISOString()
    };
    if (displayName) payload.github_username = displayName;
    await sb.from('profiles').upsert(payload, { onConflict: 'id' });
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

    // Do not perform database queries inside onAuthStateChange callbacks:
    // Supabase Auth can hold its session lock until the callback returns.
    const { data: { session }, error } = await sb.auth.getSession();
    if (error) console.error('[Auth] Erro ao consultar sessão:', error);
    if (!session) {
      console.warn('[Auth] Sem sessão — redirecionando para index');
      window.location.href = 'index.html';
      return null;
    }

    this._session = session;
    try {
      await this.upsertProfile(session.user);
      await this.syncXP(session.user.id);
    } catch(e) {
      console.error('[Auth] Erro no upsertProfile/syncXP:', e);
    }
    renderAuthTopbar(session.user);
    if (typeof ProfileAppearance !== 'undefined') {
      try {
        await ProfileAppearance.initForUser(session.user,
          window.location.pathname.endsWith('/dashboard.html'));
      } catch(e) {
        console.error('[Profile] Erro ao iniciar personalização:', e);
      }
    }
    return session;
  },

  async getRanking(limit = 20) {
    const { data, error } = await sb.from('profiles')
      .select('github_username,github_avatar,display_name,avatar_kind,avatar_id,custom_avatar_path,total_xp,quizzes_played,best_score')
      .gte('total_xp', 150)
      .order('total_xp', { ascending: false })
      .limit(limit);
    if (error) console.error('[Ranking] Supabase error:', error);
    return data || [];
  },

  async getStats() {
    const { data } = await sb.from('profiles').select('total_xp,quizzes_played').gte('total_xp', 1);
    const rows = data || [];
    const t = rows.reduce((a, p) => ({ xp: a.xp + (p.total_xp || 0), q: a.q + (p.quizzes_played || 0) }), { xp: 0, q: 0 });
    return { players: rows.length, totalXP: t.xp, totalQuizzes: t.q };
  }
};

// ── Render user in topbar ────────────────────────────────────────────────
function _topbarHTML(name, avatar, profile = null) {
  const avatarUrl = SafeDom.avatarUrl(avatar);
  const escapedName = SafeDom.escape(name);
  const logoutBtn = `<button onclick="Auth.signOut()" title="Déconnexion" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px 6px;line-height:1;display:flex;align-items:center;border-radius:4px;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='var(--text-muted)'"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>`;
  const pic = typeof AvatarAssets !== 'undefined' && profile
    ? AvatarAssets.render(profile, 'profile-top-avatar')
    : (avatarUrl ? '<img class="profile-top-avatar" alt="" src="' + SafeDom.escape(avatarUrl) + '">'
      : '<span class="profile-top-avatar avatar-fallback" aria-hidden="true">' +
        SafeDom.escape((String(name || 'A')[0] || 'A').toUpperCase()) + '</span>');
  const editBtn = typeof ProfileAppearance !== 'undefined'
    ? '<button type="button" class="profile-edit" title="Personnaliser mon profil" aria-label="Personnaliser mon profil" onclick="ProfileAppearance.open()">✎</button>'
    : '';
  return pic + '<span class="user-name">@' + escapedName + '</span>' + editBtn + logoutBtn;
}

function renderAuthTopbar(user, profile = null) {
  const el = document.querySelector('.user-info');
  if (!el) return;
  const name   = profile?.display_name || user.user_metadata?.user_name
              || user.user_metadata?.preferred_username
              || user.user_metadata?.name
              || user.email?.split('@')[0]
              || 'user';
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
  el.innerHTML = _topbarHTML(name, avatar, profile);
  localStorage.setItem('_authCache', JSON.stringify({ name, avatar }));
}

// ── Pre-populate topbar from cache (evita flash ao navegar) ──────────────
(function() {
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem('_authCache') || 'null'); } catch (_) { /* invalid old cache */ }
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
  if (page !== 'index.html' && page !== '' && page !== 'ranking.html') {
    document.addEventListener('DOMContentLoaded', () => Auth.guard());
  }
})();
