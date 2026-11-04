import {gcsPhotoPath} from './gcs-photo-path.js';

/** Alegria-compatible contract. All browser requests stay on the current origin. */
export const MEDIA_ROUTES = {
  urls: '/api/media/signed-urls',
  urlsAlias: '/api/media/urls',
  object: '/api/media/object',
  upload: '/api/admin/media/upload',
} as const;

export function mediaObjectPath(value: string): string | null {
  const raw = String(value || '').trim();
  if (/^(?:https?:\/\/[^/]+)?\/api\/media\/object\?/i.test(raw)) {
    try {
      const parsed = new URL(raw, 'https://media.invalid');
      if (parsed.pathname !== MEDIA_ROUTES.object) return null;
      return gcsPhotoPath(parsed.searchParams.get('path') || '');
    } catch { return null; }
  }
  return gcsPhotoPath(raw);
}

export function mediaObjectUrl(value: string): string {
  const path = mediaObjectPath(value);
  return path ? `${MEDIA_ROUTES.object}?path=${encodeURIComponent(path)}` : '';
}
