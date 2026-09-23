import { useEffect } from 'react';

function clearAllAuth() {
  ['customerToken', 'vendorToken', 'adminToken', 'userRole', 'userEmail'].forEach(
    (k) => localStorage.removeItem(k)
  );
}

function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children, requiredRole = 'customer' }) {
  useEffect(() => {
    const token = localStorage.getItem(`${requiredRole}Token`);
    const role = localStorage.getItem('userRole');

    if (!token || role !== requiredRole || !isTokenValid(token)) {
      clearAllAuth();
      window.location.href = `http://localhost:3004/login?redirect=${requiredRole}`;
    }
  }, [requiredRole]);

  const token = localStorage.getItem(`${requiredRole}Token`);
  const role = localStorage.getItem('userRole');

  if (!token || role !== requiredRole || !isTokenValid(token)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
}
