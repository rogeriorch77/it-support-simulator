/* IT Support Simulator v1.1 — visual identities, independent from XP. */
const AvatarAssets = (() => {
  const ids = [
    'cloudbot','penguindev','cyberhusky','terminalcat',
    'rootbot','shadowbyte','redpanda','astrobot',
    'retrobyte','bluedragon','debugduck','nerdowl'
  ];
  const names = [
    'Cloud Bot','Penguin Dev','Cyber Husky','Terminal Cat',
    'Root Bot','Shadow Byte','Red Panda','Astro Bot',
    'Retro Byte','Blue Dragon','Debug Duck','Nerd Owl'
  ];
  const indexOf = id => ids.indexOf(String(id || ''));
  function displayName(profile) {
    return String(profile?.display_name || profile?.github_username || 'Anonyme');
  }
  function uploadUrl(path) {
    if (typeof path !== 'string' || !/^[0-9a-f-]{36}\/avatar\.(webp|png)$/i.test(path)) return '';
    try {
      const base = new URL(SUPABASE_URL);
      if (base.protocol !== 'https:') return '';
      return base.origin + '/storage/v1/object/public/profile-avatars/' + path;
    } catch (_) { return ''; }
  }
  function imageUrl(profile) {
    if (profile?.avatar_kind === 'upload') return uploadUrl(profile.custom_avatar_path);
    if (profile?.avatar_kind === 'provider') return SafeDom.avatarUrl(profile.github_avatar);
    if (!profile?.avatar_kind) return SafeDom.avatarUrl(profile?.github_avatar);
    return '';
  }
  function render(profile, className = 'profile-avatar') {
    const id = profile?.avatar_kind === 'mascot' ? profile.avatar_id : '';
    const index = indexOf(id);
    const cls = String(className).replace(/[^a-zA-Z0-9 _-]/g, '');
    if (index >= 0) {
      return '<span class="' + cls + ' mascot-avatar mascot-avatar--' + ids[index] +
        '" role="img" aria-label="' + names[index] + '"></span>';
    }
    const url = imageUrl(profile);
    if (url) return '<img class="' + cls + '" alt="" src="' + SafeDom.escape(url) + '">';
    return '<span class="' + cls + ' avatar-fallback" aria-hidden="true">' +
      SafeDom.escape(displayName(profile).slice(0, 1).toUpperCase()) + '</span>';
  }
  return Object.freeze({ ids, names, indexOf, displayName, uploadUrl, imageUrl, render });
})();
