import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  useEffect(() => {
    const token = localStorage.getItem(`${requiredRole}Token`);
    const role = localStorage.getItem('userRole');
    if (!token || role !== requiredRole) {
      window.location.href = `http://localhost:3004/login?redirect=${requiredRole}`;
    }
  }, [requiredRole]);

  const token = localStorage.getItem(`${requiredRole}Token`);
  const role = localStorage.getItem('userRole');

  if (!token || role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return children;
}
