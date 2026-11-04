/* IT Support Simulator v1.1 — profile customization, no XP writes. */
const ProfileAppearance = (() => {
  const empty = { display_name:null, avatar_kind:'provider', avatar_id:null, custom_avatar_path:null, profile_setup_completed:false };
  let user = null;
  let profile = { ...empty };
  let dialog = null;
  let draftKind = 'provider';
  let draftId = null;
  let draftFile = null;
  let previewUrl = null;
  const safeName = value => String(value || '').trim().replace(/\s+/g, ' ');
  const fallbackName = u => u?.user_metadata?.user_name ||
    u?.user_metadata?.preferred_username || u?.user_metadata?.name ||
    u?.email?.split('@')[0] || 'Technicien';

  async function load(authUser) {
    user = authUser;
    const { data, error } = await sb.from('profiles')
      .select('display_name,avatar_kind,avatar_id,custom_avatar_path,profile_setup_completed,github_avatar,github_username')
      .eq('id', user.id).maybeSingle();
    if (error) {
      console.warn('[Profile] Unable to load profile:', error.message);
      return false;
    }
    profile = { ...empty, ...(data || {}) };
    return true;
  }

  function current() { return profile; }
  function setStatus(message) {
    const el = dialog?.querySelector('.profile-status');
    if (el) el.textContent = message || '';
  }
  function refreshOptions() {
    dialog?.querySelectorAll('[data-mascot]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(draftKind === 'mascot' && btn.dataset.mascot === draftId));
    });
    dialog?.querySelectorAll('[data-kind]').forEach(btn =>
      btn.setAttribute('aria-pressed', String(btn.dataset.kind === draftKind)));
  }
  function disposePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
  }
  function close() {
    if (!dialog) return;
    disposePreview();
    dialog.remove();
    dialog = null;
  }

  async function initForUser(authUser, promptOnDashboard = false) {
    const ok = await load(authUser);
    if (!ok) return;
    if (typeof renderAuthTopbar === 'function') renderAuthTopbar(authUser, profile);
    if (promptOnDashboard && !profile.profile_setup_completed &&
        sessionStorage.getItem('profile-later-' + user.id) !== '1') open(true);
  }

  function open(firstTime = false) {
    if (!user || dialog) return;
    draftKind = profile.avatar_kind === 'mascot' || profile.avatar_kind === 'upload'
      ? profile.avatar_kind : 'provider';
    draftId = profile.avatar_id || AvatarAssets.ids[0];
    draftFile = null;
    dialog = document.createElement('div');
    dialog.className = 'profile-overlay';
    dialog.innerHTML = `
      <section class="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profileTitle">
        <h2 id="profileTitle">${firstTime ? 'Bienvenue ! Personnalise ton profil' : 'Personnaliser mon profil'}</h2>
        <p>Choisis un pseudonyme et une identité visuelle. Ton XP et ton classement ne changent pas.</p>
        <label class="profile-label" for="profilePseudo">Pseudonyme public</label>
        <input id="profilePseudo" type="text" minlength="3" maxlength="24" autocomplete="nickname" spellcheck="false">
        <div class="profile-caption">3–24 caractères, lettres, chiffres, espace, tiret, point ou underscore.</div>
        <label class="profile-label">Avatars de la communauté</label>
        <div class="profile-avatar-grid" role="group" aria-label="Choisir un avatar">
          ${AvatarAssets.ids.map((id, index) =>
            '<button type="button" class="profile-avatar-option" data-mascot="' + id +
            '" aria-label="' + AvatarAssets.names[index] + '" aria-pressed="false">' +
            AvatarAssets.render({avatar_kind:'mascot',avatar_id:id}, 'mascot-choice') +
            '</button>').join('')}
        </div>
        <div class="profile-avatar-other">
          <button class="profile-option-btn" type="button" data-kind="provider" aria-pressed="false">Photo Google / GitHub</button>
          <button class="profile-option-btn" type="button" data-kind="upload" aria-pressed="false">Importer une photo</button>
          <img class="profile-upload-preview" alt="Aperçu de la photo">
          <input type="file" id="profileFile" accept="image/jpeg,image/png,image/webp" hidden>
        </div>
        <div class="profile-caption">Photos personnelles : JPEG, PNG ou WebP, 5 Mo maximum. Recadrage carré automatique. La photo choisie sera visible publiquement dans le classement.</div>
        <div class="profile-status" role="status" aria-live="polite"></div>
        <div class="profile-footer">
          <button type="button" class="profile-secondary" data-cancel>Plus tard</button>
          <button type="button" class="profile-primary" data-save>Enregistrer</button>
        </div>
      </section>`;
    document.body.append(dialog);
    const input = dialog.querySelector('#profilePseudo');
    input.value = profile.display_name || fallbackName(user);
    dialog.querySelectorAll('[data-mascot]').forEach(btn => btn.addEventListener('click', () => {
      draftKind = 'mascot'; draftId = btn.dataset.mascot; setStatus(''); refreshOptions();
    }));
    dialog.querySelectorAll('[data-kind]').forEach(btn => btn.addEventListener('click', () => {
      if (btn.dataset.kind === 'upload') {
        dialog.querySelector('#profileFile').click();
      } else {
        draftKind = 'provider'; setStatus(''); refreshOptions();
      }
    }));
    dialog.querySelector('#profileFile').addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5*1024*1024) {
        setStatus('Image invalide : JPEG/PNG/WebP, 5 Mo maximum.'); e.target.value = ''; return;
      }
      disposePreview();
      previewUrl = URL.createObjectURL(file);
      draftFile = file;
      draftKind = 'upload';
      const img = dialog.querySelector('.profile-upload-preview');
      img.src = previewUrl; img.classList.add('visible');
      setStatus(''); refreshOptions();
    });
    dialog.querySelector('[data-cancel]').addEventListener('click', () => {
      sessionStorage.setItem('profile-later-' + user.id, '1');
      close();
    });
    dialog.querySelector('[data-save]').addEventListener('click', save);
    dialog.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    refreshOptions();
    input.focus();
  }

  async function prepareImage(file) {
    const url = URL.createObjectURL(file);
    try {
      const source = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Impossible de lire cette image.'));
        img.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const side = Math.min(source.naturalWidth, source.naturalHeight);
      if (!side || !ctx || source.naturalWidth > 8000 || source.naturalHeight > 8000)
        throw new Error('Image trop grande ou non valide.');
      ctx.drawImage(source,
        Math.floor((source.naturalWidth - side)/2),
        Math.floor((source.naturalHeight - side)/2),
        side,side,0,0,256,256);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.82));
      if (!blob) throw new Error('Conversion de l’image impossible.');
      if (!['image/webp','image/png'].includes(blob.type)) throw new Error('Format non pris en charge.');
      return blob;
    } finally { URL.revokeObjectURL(url); }
  }

  async function save() {
    if (!user || !dialog) return;
    const name = safeName(dialog.querySelector('#profilePseudo').value);
    if (name.length < 3 || name.length > 24 || !/^[\p{L}\p{N} _.-]+$/u.test(name)) {
      setStatus('Pseudonyme invalide (3 à 24 caractères).'); return;
    }
    if (draftKind === 'upload' && !draftFile && !profile.custom_avatar_path) {
      setStatus('Sélectionne une photo à importer.'); return;
    }
    const saveBtn = dialog.querySelector('[data-save]');
    saveBtn.disabled = true;
    setStatus('Enregistrement…');
    try {
      let avatarPath = draftKind === 'upload' ? profile.custom_avatar_path : null;
      if (draftKind === 'upload' && draftFile) {
        const blob = await prepareImage(draftFile);
        const ext = blob.type === 'image/webp' ? 'webp' : 'png';
        avatarPath = user.id + '/avatar.' + ext;
        const { error: uploadError } = await sb.storage.from('profile-avatars')
          .upload(avatarPath, blob, { upsert:true, contentType:blob.type, cacheControl:'0' });
        if (uploadError) throw uploadError;
      }
      const payload = {
        display_name:name, avatar_kind:draftKind,
        avatar_id:draftKind === 'mascot' ? draftId : null,
        custom_avatar_path:avatarPath,
        profile_setup_completed:true,
        updated_at:new Date().toISOString()
      };
      const { data, error } = await sb.from('profiles').update(payload)
        .eq('id', user.id)
        .select('display_name,avatar_kind,avatar_id,custom_avatar_path,profile_setup_completed,github_avatar,github_username')
        .single();
      if (error) throw error;
      const oldPath = profile.custom_avatar_path;
      profile = { ...profile, ...data };
      if (typeof renderAuthTopbar === 'function') renderAuthTopbar(user, profile);
      close();
      // Clean up an old image after a successful profile update.
      if (oldPath && oldPath !== avatarPath && oldPath.startsWith(user.id + '/')) {
        sb.storage.from('profile-avatars').remove([oldPath]).catch(console.warn);
      }
    } catch (e) {
      setStatus(e?.message || 'Impossible de sauvegarder le profil.');
      console.warn('[Profile] Save failed:', e);
      // Do not delete an upload on a failed save: it could have replaced the user's current image.
    } finally { if (dialog) saveBtn.disabled = false; }
  }
  return Object.freeze({ initForUser, load, open, close, current });
})();
