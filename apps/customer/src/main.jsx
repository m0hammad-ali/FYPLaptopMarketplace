import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// IMPORTANT: Read token from URL BEFORE rendering.
// This handles cross-origin token handoff from the auth app.
const params = new URLSearchParams(window.location.search);
const urlToken = params.get('token');
const urlRole = params.get('role');
const urlEmail = params.get('email');

if (urlToken && urlRole === 'customer' && urlEmail) {
  localStorage.setItem('customerToken', urlToken);
  localStorage.setItem('vendorToken', '');
  localStorage.setItem('adminToken', '');
  localStorage.setItem('userRole', 'customer');
  localStorage.setItem('userEmail', urlEmail);
  window.history.replaceState({}, '', window.location.pathname);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
