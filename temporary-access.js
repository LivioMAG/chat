// Account-free access uses a scoped server session, never a Supabase Auth user.
window.TemporaryAccess = (() => {
  const key = 'rapport-temporary-access:xflljuscywgxfhzdtaju';
  async function call(config, session, action, data = {}) {
    if (!config?.supabaseUrl) throw new Error('Die Verbindung wird noch geladen. Bitte erneut versuchen.');
    const response = await fetch(`${config.supabaseUrl}/functions/v1/temporary-reports`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: config.supabaseAnonKey, ...(session?.token ? { 'x-guest-token': session.token } : {}) },
      body: JSON.stringify({ action, ...data }), cache: 'no-store'
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Der temporäre Zugang konnte nicht geladen werden.');
    return result;
  }
  function remember(session) {
    try { localStorage.setItem(key, JSON.stringify({ token: session.token, expires_at: session.expires_at })); } catch { /* Access also works without browser storage. */ }
  }
  function forget() { try { localStorage.removeItem(key); } catch { /* Browser storage may be disabled. */ } }
  async function enter(config, identity) { const session = await call(config, null, 'enter', identity); remember(session); return session; }
  async function restore(config) {
    let saved; try { saved = JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
    if (!saved?.token || !saved.expires_at || Date.parse(saved.expires_at) <= Date.now()) { forget(); return null; }
    try { return { ...saved, ...await call(config, saved, 'restore') }; } catch { forget(); return null; }
  }
  async function upload(config, session, client, files, existing) {
    const uploaded = [...existing];
    for (const file of files) {
      const mimeType = file.type || (/\.pdf$/i.test(file.name) ? 'application/pdf' : '');
      const signed = await call(config, session, 'upload', { name: file.name, mimeType, size: file.size });
      const { error } = await client.storage.from(signed.bucket).uploadToSignedUrl(signed.path, signed.token, file, { contentType: mimeType });
      if (error) throw error;
      uploaded.push({ name: file.name, path: signed.path, bucket: signed.bucket, mimeType });
    }
    return uploaded;
  }
  return { call, enter, restore, upload, forget };
})();
