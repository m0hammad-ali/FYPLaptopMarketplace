import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Laptop, Mail, Lock, Loader2, ArrowLeft, Shield, ShoppingBag, Store,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLE_URLS = {
  customer: 'http://localhost:3001',
  vendor: 'http://localhost:3002',
  admin: 'http://localhost:3003',
};

function getPageType() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin-register')) return 'admin-register';
  if (path.includes('admin')) return 'admin-login';
  if (path.includes('register')) return 'register';
  return 'login';
}

function buildRedirectUrl(role, token, email) {
  const params = new URLSearchParams({ token, role, email });
  return `${ROLE_URLS[role]}?${params.toString()}`;
}

export default function App() {
  const [pageType] = useState(() => getPageType());
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const isAdminPage = pageType === 'admin-login' || pageType === 'admin-register';
  const mode = pageType === 'register' ? 'register' : 'login';

  // Show a loading spinner briefly so the page doesn't flash.
  useEffect(() => {
    setChecking(false);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint, payload;
      if (isAdminPage) {
        endpoint = pageType === 'admin-register' ? '/api/auth/register' : '/api/auth/login';
        payload = pageType === 'admin-register'
          ? { email, password, role: 'admin' }
          : { email, password };
      } else {
        endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
        payload = mode === 'register' ? { email, password, role } : { email, password };
      }

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      const { token, user } = res.data;

      if (isAdminPage && user.role !== 'admin') {
        toast.error('This login is for administrators only');
        setLoading(false);
        return;
      }
      if (!isAdminPage && user.role === 'admin') {
        toast.error('Please use the administrator portal');
        setLoading(false);
        return;
      }

      toast.success(
        mode === 'register' ? 'Account created!' : 'Welcome back!'
      );

      // Pass the token via URL — target app will save to its own localStorage
      const redirectUrl = buildRedirectUrl(user.role, token, user.email);
      window.location.replace(redirectUrl);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Authentication failed';
      toast.error(msg);
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ========== ADMIN PAGE ==========
  if (isAdminPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 p-4">
        <Toaster position="top-right" />
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Administrator Access</h1>
            <p className="mt-1 text-sm text-gray-500">
              {pageType === 'admin-register' ? 'Create admin account' : 'Restricted access'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required placeholder="admin@example.com"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  required minLength={6} placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Please wait...' : pageType === 'admin-register' ? 'Create Admin Account' : 'Sign In as Admin'}
            </button>
          </form>

          {pageType === 'admin-register' && (
            <a href="/admin-login" className="mt-6 block text-center text-xs text-gray-500 hover:text-gray-900">
              Already have an admin account? Sign in
            </a>
          )}
        </div>
      </div>
    );
  }

  // ========== PUBLIC (Customer + Vendor) ==========
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Laptop className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Laptop Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
          <a href="/login"
            className={`flex-1 rounded-md py-2 text-center text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}>
            Sign In
          </a>
          <a href="/register"
            className={`flex-1 rounded-md py-2 text-center text-sm font-semibold transition ${
              mode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
            }`}>
            Sign Up
          </a>
        </div>

        {mode === 'register' && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-700">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('customer')}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition ${
                  role === 'customer' ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <ShoppingBag className="h-5 w-5" />
                <span className="text-sm font-bold">Customer</span>
              </button>
              <button type="button" onClick={() => setRole('vendor')}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition ${
                  role === 'vendor' ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
                <Store className="h-5 w-5" />
                <span className="text-sm font-bold">Vendor</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required minLength={6} placeholder="At least 6 characters"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : `Create ${role === 'customer' ? 'Customer' : 'Vendor'} Account`}
          </button>
        </form>

        <a href="http://localhost:3000"
          className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-500 transition hover:text-indigo-600">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </a>
      </div>
    </div>
  );
}
