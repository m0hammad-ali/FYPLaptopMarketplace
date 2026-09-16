import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import './styles/globals.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLE_URLS = {
  customer: 'http://localhost:3001',
  vendor: 'http://localhost:3002',
  admin: 'http://localhost:3003',
};

function getRedirectParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('redirect') || 'customer';
}

export default function App() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);

  const redirectHint = getRedirectParam();

  useEffect(() => {
    // If user is already logged in, redirect
    const role = localStorage.getItem('userRole');
    if (role && ROLE_URLS[role]) {
      window.location.href = ROLE_URLS[role];
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { email, password, role };
      const res = await axios.post(`${API_URL}${endpoint}`, payload);

      const { token, user } = res.data;

      // Store token and role
      const tokenKey = `${user.role}Token`;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);

      toast.success(mode === 'login' ? 'Login successful' : 'Account created');

      setTimeout(() => {
        window.location.href = ROLE_URLS[user.role] || ROLE_URLS.customer;
      }, 600);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <Toaster position="top-right" />
      <div style={styles.card}>
        <h1 style={styles.title}>Laptop Marketplace</h1>
        <p style={styles.subtitle}>
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <div style={styles.tabs}>
          <button
            onClick={() => setMode('login')}
            style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
          >
            Register
          </button>
        </div>

        {redirectHint && mode === 'login' && (
          <p style={styles.hint}>
            Login as <strong>{redirectHint}</strong> to continue
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
              placeholder="At least 6 characters"
            />
          </label>

          {mode === 'register' && (
            <label style={styles.label}>
              I am a
              <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.submit, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <a href="http://localhost:3000" style={styles.backLink}>
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '420px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 800,
    color: '#111827',
    textAlign: 'center',
    marginBottom: '6px',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    background: '#f3f4f6',
    padding: '4px',
    borderRadius: '10px',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#6b7280',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#fff',
    color: '#4f46e5',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  hint: {
    fontSize: '13px',
    color: '#4f46e5',
    textAlign: 'center',
    marginBottom: '12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '11px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  submit: {
    marginTop: '8px',
    padding: '12px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    color: '#6b7280',
    fontSize: '13px',
    textDecoration: 'none',
  },
};
