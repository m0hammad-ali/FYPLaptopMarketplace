/**
 * Reads auth data from URL fragment on app startup.
 * Used to transfer session between different origins (different ports).
 *
 * Expected fragment format:
 *   #auth=token=XXX&role=customer&email=user@example.com
 */

export function bootstrapAuthFromFragment(expectedRole) {
  if (typeof window === 'undefined') return false;
  if (!window.location.hash) return false;

  const hash = window.location.hash.substring(1);
  if (!hash.startsWith('auth=')) return false;

  const params = new URLSearchParams(hash.substring(5));
  const token = params.get('token');
  const role = params.get('role');
  const email = params.get('email');

  if (!token || !role) return false;
  if (expectedRole && role !== expectedRole) return false;

  try {
    localStorage.setItem(`${role}Token`, token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email || '');
  } catch (e) {
    console.warn('Failed to save auth from fragment:', e);
    return false;
  }

  // Clear the fragment from the URL so it doesn't linger in history
  const cleanUrl = window.location.pathname + window.location.search;
  window.history.replaceState(null, '', cleanUrl);

  return true;
}
