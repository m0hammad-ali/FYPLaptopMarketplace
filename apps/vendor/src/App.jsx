import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryTab from './components/InventoryTab';
import ShopsTab from './components/ShopsTab';

function Dashboard() {
  const [tab, setTab] = useState('inventory');

  const email = localStorage.getItem('userEmail') || 'Vendor';

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'http://localhost:3004/login?redirect=vendor';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">LaptopMarket · Vendor</div>
          <div className="app-user">
            <span>{email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <h1 className="page-title">Vendor Dashboard</h1>
        <p className="page-subtitle">
          Manage your laptop listings and shop locations.
        </p>

        <div style={{ marginBottom: 20 }}>
          <span className="unverified-badge">
            ⏳ Verification: Pending (admin will verify)
          </span>
        </div>

        <div className="tabs">
          <button
            className={`tab ${tab === 'inventory' ? 'active' : ''}`}
            onClick={() => setTab('inventory')}
          >
            📦 Inventory
          </button>
          <button
            className={`tab ${tab === 'shops' ? 'active' : ''}`}
            onClick={() => setTab('shops')}
          >
            🏪 Shops
          </button>
        </div>

        {tab === 'inventory' && <InventoryTab />}
        {tab === 'shops' && <ShopsTab />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ProtectedRoute requiredRole="vendor">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
