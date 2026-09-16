import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

function Dashboard() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Inter' }}>
      <h1>Admin Panel</h1>
      <p>Full admin UI coming on Day 9.</p>
      <button
        onClick={() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('userRole');
          window.location.href = 'http://localhost:3004/login?redirect=admin';
        }}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ProtectedRoute requiredRole="admin">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
