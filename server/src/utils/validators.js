const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ['farmer', 'seller', 'buyer', 'expert', 'admin'];
const PUBLIC_ROLES = ['farmer', 'seller', 'buyer'];

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function normalizeRole(role) {
  if (typeof role !== 'string') return 'buyer';
  const lower = role.toLowerCase().trim();
  return PUBLIC_ROLES.includes(lower) ? lower : 'buyer';
}

export function isKnownRole(role) {
  return ALLOWED_ROLES.includes(role);
}
