import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import ModeSelector from './components/ModeSelector';
import VoiceModeForm from './components/voice-mode/VoiceModeForm';
import SimpleForm from './components/simple-mode/SimpleForm';
import ProForm from './components/pro-mode/ProForm';
import ResultCard from './components/ResultCard';
import client from './api/client';

function Dashboard() {
  const [mode, setMode] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (prefs) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await client.post('/api/recommend', prefs);
      setResults(res.data.recommendations || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMode(null);
    setResults([]);
    setSearched(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'http://localhost:3004/login?redirect=customer';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">LaptopMarket</div>
          <div className="app-user">
            <span>{localStorage.getItem('userEmail') || 'Customer'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {!mode && !searched && <ModeSelector onSelect={setMode} />}

        {mode === 'voice' && (
          <VoiceModeForm onSubmit={handleSubmit} onBack={reset} />
        )}

        {mode === 'simple' && (
          <SimpleForm onSubmit={handleSubmit} onBack={reset} />
        )}

        {mode === 'pro' && (
          <ProForm onSubmit={handleSubmit} onBack={reset} />
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Finding the best laptops for you...</p>
          </div>
        )}

        {!loading && searched && (
          <>
            <div className="results-header">
              <h2>Your Recommendations</h2>
              <p>
                {results.length > 0
                  ? `Found ${results.length} laptops matching your needs.`
                  : 'No laptops matched your criteria.'}
              </p>
              <button className="back-btn" onClick={reset} style={{ marginTop: 16 }}>
                ← Start Over
              </button>
            </div>

            {results.length > 0 ? (
              <div className="results-grid">
                {results.map((laptop) => (
                  <ResultCard key={laptop.id} laptop={laptop} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No matches found</h3>
                <p>Try increasing your budget or removing some filters.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ProtectedRoute requiredRole="customer">
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}
