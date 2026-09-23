import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const params = new URLSearchParams(window.location.search);
const urlToken = params.get('token');
const urlRole = params.get('role');
const urlEmail = params.get('email');

if (urlToken && urlRole === 'vendor' && urlEmail) {
  localStorage.setItem('vendorToken', urlToken);
  localStorage.setItem('customerToken', '');
  localStorage.setItem('adminToken', '');
  localStorage.setItem('userRole', 'vendor');
  localStorage.setItem('userEmail', urlEmail);
  window.history.replaceState({}, '', window.location.pathname);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
