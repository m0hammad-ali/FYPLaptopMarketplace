import { Toaster } from 'react-hot-toast';
import { Shield, LogOut } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import VendorsTab from './components/VendorsTab';

function Dashboard() {
  const email = localStorage.getItem('userEmail') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    sessionStorage.clear();
    window.location.replace('http://localhost:3004/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-extrabold">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span>Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-400 sm:block">{email}</span>
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
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Verify vendors and monitor the marketplace.
          </p>
        </div>

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
