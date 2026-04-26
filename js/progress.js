/* ============================================
   IT SUPPORT SIMULATOR — Progress System
   XP, Levels, Badges — all via localStorage.
   No fetch() — works on file://
   ============================================ */

const Progress = (() => {

  // XP awarded per difficulty (base)
  const XP_TABLE = { easy: 50, medium: 100, hard: 200 };

  // Level thresholds
  const LEVELS = [
    { id: 'rookie',    name: 'Débutant',        minXP: 0,    stars: 1 },
    { id: 'tech_n1',  name: 'Technicien N1',  minXP: 150,  stars: 2 },
    { id: 'spec_n1',  name: 'Spécialiste N1', minXP: 400,  stars: 3 },
    { id: 'tech_n2',  name: 'Technicien N2',  minXP: 800,  stars: 4 },
    { id: 'expert_n2',name: 'Expert N2',       minXP: 1500, stars: 5 },
    { id: 'senior',   name: 'N2 Confirmé',     minXP: 2500, stars: 6 },
  ];

  // Badge definitions
  const BADGE_DEFS = [
    {
      id: 'first_call',
      icon: '&#9742;', color: '#3b82f6',
      name: 'Premier Appel',
      desc: '1er scénario terminé',
      check: h => h.length >= 1
    },
    {
      id: 'perfect',
      icon: '&#10004;', color: '#22c55e',
      name: 'Perfectionniste',
      desc: 'Score 100% obtenu',
      check: h => h.some(s => s.score >= 100)
    },
    {
      id: 'streak_5',
      icon: '&#9889;', color: '#f59e0b',
      name: 'En Série',
      desc: '5 scénarios terminés',
      check: h => h.length >= 5
    },
    {
      id: 'ad_expert',
      icon: '&#128101;', color: '#8b5cf6',
      name: 'AD Expert',
      desc: '3 scénarios AD/GPO',
      check: h => h.filter(s => s.category === 'AD/GPO').length >= 3
    },
    {
      id: 'network_pro',
      icon: '&#127760;', color: '#06b6d4',
      name: 'Network Pro',
      desc: '3 scénarios réseau',
      check: h => h.filter(s => s.category === 'Réseau').length >= 3
    },
    {
      id: 'n2_ready',
      icon: '&#127947;', color: '#ef4444',
      name: 'Prêt N2',
      desc: '2 scénarios difficiles',
      check: h => h.filter(s => s.difficulty === 'hard').length >= 2
    },
    {
      id: 'polyvalent',
      icon: '&#127775;', color: '#f97316',
      name: 'Polyvalent',
      desc: '3 catégories différentes',
      check: h => new Set(h.map(s => s.category)).size >= 3
    },
    {
      id: 'speed',
      icon: '&#9200;', color: '#14b8a6',
      name: 'Quick Fix',
      desc: 'Appel terminé en < 2 min',
      check: h => h.some(s => s.duration <= 120)
    },
  ];

  // ---------- STORAGE ----------
  function getHistory() {
    try { return JSON.parse(localStorage.getItem('callHistory') || '[]'); }
    catch { return []; }
  }

  function saveHistory(h) {
    localStorage.setItem('callHistory', JSON.stringify(h));
  }

  function getEarnedBadgeIds() {
    try { return JSON.parse(localStorage.getItem('earnedBadges') || '[]'); }
    catch { return []; }
  }

  function saveEarnedBadgeIds(ids) {
    localStorage.setItem('earnedBadges', JSON.stringify(ids));
  }

  // ---------- XP ----------
  function calcXP(entry) {
    const base = XP_TABLE[entry.difficulty] || 50;
    const bonus = entry.score >= 80 ? Math.round(base * 0.25) : 0;
    return base + bonus;
  }

  function getTotalXP(history) {
    return history.reduce((sum, e) => sum + calcXP(e), 0);
  }

  // ---------- LEVELS ----------
  function getLevel(xp) {
    let lvl = LEVELS[0];
    for (const l of LEVELS) { if (xp >= l.minXP) lvl = l; }
    return lvl;
  }

  function getNextLevel(xp) {
    for (const l of LEVELS) { if (l.minXP > xp) return l; }
    return null; // max level
  }

  function getLevelProgress(xp) {
    const current = getLevel(xp);
    const next = getNextLevel(xp);
    if (!next) return 100;
    const range = next.minXP - current.minXP;
    const done  = xp - current.minXP;
    return Math.min(100, Math.round((done / range) * 100));
  }

  // ---------- BADGES ----------
  function checkAndUpdateBadges(history) {
    const previous = getEarnedBadgeIds();
    const earned   = BADGE_DEFS.filter(b => b.check(history)).map(b => b.id);
    const newIds   = earned.filter(id => !previous.includes(id));
    saveEarnedBadgeIds(earned);
    return newIds.map(id => BADGE_DEFS.find(b => b.id === id));
  }

  // ---------- ADD RESULT ----------
  // Returns { xpEarned, newBadges[] }
  function addResult({ id, category, difficulty, score, duration }) {
    const history = getHistory();
    history.push({ id, category, difficulty, score, duration, date: Date.now() });
    saveHistory(history);
    const newBadges = checkAndUpdateBadges(history);
    const xpEarned  = calcXP({ difficulty, score });
    return { xpEarned, newBadges };
  }

  // ---------- AGGREGATE STATS ----------
  function getStats() {
    const history  = getHistory();
    const xp       = getTotalXP(history);
    const level    = getLevel(xp);
    const nextLvl  = getNextLevel(xp);
    const levelPct = getLevelProgress(xp);
    const badgeIds = getEarnedBadgeIds();
    const badges   = BADGE_DEFS.filter(b => badgeIds.includes(b.id));
    const avgScore = history.length > 0
      ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
      : 0;
    const uniqueIds = [...new Set(history.map(h => h.id))];
    return {
      history,
      xp,
      level,
      nextLvl,
      levelPct,
      badges,
      avgScore,
      totalCalls: history.length,
      uniqueCompleted: uniqueIds.length
    };
  }

  // Public API
  return {
    addResult,
    getHistory,
    getTotalXP,
    getLevel,
    getNextLevel,
    getLevelProgress,
    checkAndUpdateBadges,
    getStats,
    calcXP,
    getEarnedBadgeIds,
    LEVELS,
    BADGE_DEFS
  };

})();
