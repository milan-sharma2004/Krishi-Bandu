const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ['farmer', 'seller', 'buyer', 'expert', 'admin'];
const PUBLIC_ROLES = ['farmer', 'seller', 'buyer'];

export function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  return /^[^\s@]+@(gmail\.com|krishibandu\.com)$/i.test(
    email.trim()
  );
}

export function isValidPassword(password) {
  if (typeof password !== 'string') {
    return false;
  }

  return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])(?=\S+$).{8,}$/.test(
    password
  );
}

export function normalizeRole(role) {
  if (typeof role !== 'string') return 'buyer';
  const lower = role.toLowerCase().trim();
  return PUBLIC_ROLES.includes(lower) ? lower : 'buyer';
}

export function isKnownRole(role) {
  return ALLOWED_ROLES.includes(role);
}
