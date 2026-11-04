/* IT Support Simulator v1.1 — text escaping and trusted profile image URLs.
   Encode untrusted data at the HTML insertion point, not at storage time. */
const SafeDom = (() => {
  const entities = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
  function escape(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, c => entities[c]);
  }
  function avatarUrl(value) {
    if (typeof value !== 'string' || value.length > 2048) return '';
    try {
      const url = new URL(value);
      const host = url.hostname.toLowerCase();
      const trusted = host === 'avatars.githubusercontent.com'
        || host === 'googleusercontent.com' || host.endsWith('.googleusercontent.com');
      if (url.protocol !== 'https:' || !trusted || url.username || url.password) return '';
      return url.href;
    } catch (_) { return ''; }
  }
  return Object.freeze({ escape, avatarUrl });
})();
