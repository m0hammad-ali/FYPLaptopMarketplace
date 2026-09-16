import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole = 'customer' }) {
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
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter' }}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return children;
}
