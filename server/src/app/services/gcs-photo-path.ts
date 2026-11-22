/** Persistent image references are normalized to the one trusted bucket's assets root. */
export function gcsPhotoPath(value: string): string | null {
  let p = String(value || '').trim();
  // Never decode a URL into a path on an arbitrary bucket or origin.
  const gs = /^gs:\/\/([^/]+)\/(.+)$/i.exec(p);
  const web = /^https:\/\/storage\.googleapis\.com\/([^/]+)\/(.+)$/i.exec(p);
  if (gs || web) {
    const m = (gs || web)!;
    if (!['ailla-poc.appspot.com', 'adn_root'].includes(m[1])) return null;
    try { p = decodeURIComponent(m[2].split(/[?#]/)[0]); } catch { return null; }
  } else if (/^https?:|^\/\//i.test(p)) return null;
  p = p.replace(/^\//, '');
  // Documents can be JPEG/PNG too: never expose them through public media aliases.
  if (p.split('/').some(segment => segment.toLowerCase() === 'documents')) return null;
  if (p.includes('..') || !/^[a-zA-Z0-9._/-]+\.(avif|gif|jpe?g|png|svg|webp)$/i.test(p)) return null;
  const dirs: Record<string, string> = {
    boat: 'boats', boats: 'boats', car: 'cars', cars: 'cars',
    property: 'lodging', apartments: 'lodging', lodging: 'lodging', place: 'lodging',
    parking: 'parkings', parkings: 'parkings', pool: 'pools', pools: 'pools',
  };
  const local = /^assets\/img\/(boat|car|property|apartments|place|parking|pool)\/(.+)$/.exec(p);
  if (local) {
    if (local[1] === 'boat') {
      const category = /^(home|events)\/(.+)$/.exec(local[2]);
      p = category
        ? `assets/boats/alegria/${category[1] === 'home' ? 'homepage' : 'outings'}/${category[2]}`
        : `assets/boats/alegria/boat/${local[2].replace(/^bali4\.1\//, '')}`;
    } else p = `assets/${dirs[local[1]]}/${local[2]}`;
  } else if (p.startsWith('assets/img/')) {
    p = 'assets/' + p.slice('assets/img/'.length);
  }
  // Existing uploaded references and historical tenant wrappers.
  p = p.replace(/^(?:assets\/boats\/)?(?:tenants\/)?alegria_data\//, '');
  const legacy = /^(?:(boat|car|property|place|parking|pool)\/)?([a-zA-Z0-9_-]{1,80})\/img\/(.+)$/.exec(p);
  if (legacy) {
    const type = legacy[1] || 'boat', id = legacy[2];
    if (type === 'boat') {
      const parts = /^(boat|gallery|events|outings|home|homepage|content)\/(.+)$/.exec(legacy[3]);
      if (!parts) return null;
      const category = ['boat', 'gallery'].includes(parts[1]) ? 'boat'
        : ['events', 'outings'].includes(parts[1]) ? 'outings' : 'homepage';
      const tail = category === 'outings' ? parts[2] : parts[2].split('/').pop();
      p = `assets/boats/${id}/${category}/${tail}`;
    } else p = `assets/${dirs[type]}/${id}/${legacy[3]}`;
  }
  // Earlier GoDirect aliases (non-boat assets).
  p = p.replace(/^assets\/(parking|pool|property)\//, (_, type) => `assets/${dirs[type]}/`);
  // Earlier boat migration output, before the per-boat categories were introduced.
  p = p.replace(/^assets\/boats\/(?:events|home)\//, match =>
    `assets/boats/alegria/${match.includes('events') ? 'outings' : 'homepage'}/`);
  p = p.replace(/^assets\/boats\/bali4\.1\//, 'assets/boats/alegria/boat/');
  p = p.replace(/^(assets\/boats\/[a-zA-Z0-9_-]+\/boat\/)bali4\.1\//, '$1');
  if (p.split('/').some(segment => segment.toLowerCase() === 'documents')) return null;
  return p.startsWith('assets/') && p.length <= 512 ? p : null;
}
