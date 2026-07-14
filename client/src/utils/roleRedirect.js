export function getRoleHomePath(role) {
  if (role === 'farmer' || role === 'seller') return '/farmer';
  if (role === 'admin') return '/admin';
  return '/buyer';
}
