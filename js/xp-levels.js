/* IT Support Simulator v1.1 — shared visual levels for ranking, quiz and dashboard.
 * This module does NOT modify XP, scoring, database values or rankings. */
const XPLevels = (() => {
  const LEVELS = Object.freeze([
    Object.freeze({ id:'debutant', name:'Débutant', min:0,     max:499,               stars:1, tone:'silver', color:'#CBD5E1', bg:'rgba(203,213,225,.09)', border:'rgba(203,213,225,.22)' }),
    Object.freeze({ id:'junior',   name:'Junior',   min:500,   max:1999,              stars:2, tone:'silver', color:'#CBD5E1', bg:'rgba(203,213,225,.09)', border:'rgba(203,213,225,.22)' }),
    Object.freeze({ id:'confirme', name:'Confirmé', min:2000,  max:4999,              stars:3, tone:'orange', color:'#FDBA74', bg:'rgba(253,186,116,.10)', border:'rgba(253,186,116,.24)' }),
    Object.freeze({ id:'senior',   name:'Senior',   min:5000,  max:9999,              stars:4, tone:'purple', color:'#B197FC', bg:'rgba(177,151,252,.11)', border:'rgba(177,151,252,.26)' }),
    Object.freeze({ id:'expert',   name:'Expert',   min:10000, max:49999,             stars:5, tone:'green', color:'#4ADE80', bg:'rgba(74,222,128,.10)', border:'rgba(74,222,128,.24)' }),
    Object.freeze({ id:'elite',    name:'Élite',    min:50000, max:Number.POSITIVE_INFINITY, stars:6, tone:'green', color:'#4ADE80', bg:'rgba(74,222,128,.10)', border:'rgba(74,222,128,.24)' })
  ]);

  const normalizedXP = xp => {
    const value = Number(xp);
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  };

  function getLevel(xp) {
    const value = normalizedXP(xp);
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (value >= LEVELS[i].min) return LEVELS[i];
    }
    return LEVELS[0];
  }

  function getNextLevel(xp) {
    const index = LEVELS.indexOf(getLevel(xp));
    return LEVELS[index + 1] || null;
  }

  function getProgress(xp) {
    const level = getLevel(xp);
    const next = getNextLevel(xp);
    if (!next) return 100;
    return Math.min(100, Math.max(0,
      Math.round((normalizedXP(xp) - level.min) / (next.min - level.min) * 100)));
  }

  return Object.freeze({ levels:LEVELS, getLevel, getNextLevel, getProgress });
})();
