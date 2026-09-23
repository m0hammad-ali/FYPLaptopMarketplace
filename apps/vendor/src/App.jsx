import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Package, Store, LogOut, ShieldCheck } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import InventoryTab from './components/InventoryTab';
import ShopsTab from './components/ShopsTab';

function Dashboard() {
  const [tab, setTab] = useState('inventory');
  const email = localStorage.getItem('userEmail') || 'Vendor';

  const handleLogout = () => {
    ['customerToken', 'vendorToken', 'adminToken', 'userRole', 'userEmail'].forEach(
      (k) => localStorage.removeItem(k)
    );
    window.location.replace('http://localhost:3004/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-extrabold text-indigo-600">
            <Store className="h-5 w-5" />
            <span>Vendor Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">{email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Vendor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your laptop listings and shop locations.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verification: Pending
          </div>
        </div>

        <div className="mb-6 flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setTab('inventory')}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
              tab === 'inventory'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <Package className="h-4 w-4" />
            Inventory
          </button>
          <button
            onClick={() => setTab('shops')}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
              tab === 'shops'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            <Store className="h-4 w-4" />
            Shops
          </button>
        </div>

        {tab === 'inventory' ? <InventoryTab /> : <ShopsTab />}
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
