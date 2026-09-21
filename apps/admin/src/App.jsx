import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import VendorsTab from './components/VendorsTab';

function Dashboard() {
  const email = localStorage.getItem('userEmail') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'http://localhost:3004/login?redirect=admin';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">LaptopMarket · Admin</div>
          <div className="app-user">
            <span>{email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Verify vendors and monitor the marketplace.</p>

        <VendorsTab />
      </main>
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
