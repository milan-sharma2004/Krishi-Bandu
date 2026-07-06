const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
const SERVER_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export function mediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${SERVER_ORIGIN}${url}`;
}
