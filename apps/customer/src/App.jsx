import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LogOut, Sparkles, Wand2, Laptop as LaptopIcon, Store } from 'lucide-react';
import ProtectedRoute from './components/ProtectedRoute';
import ModeSelector from './components/ModeSelector';
import VoiceModeForm from './components/voice-mode/VoiceModeForm';
import SimpleForm from './components/simple-mode/SimpleForm';
import ProForm from './components/pro-mode/ProForm';
import ResultCard from './components/ResultCard';
import LaptopsTab from './components/LaptopsTab';
import LaptopDetail from './components/LaptopDetail';
import ShopsTab from './components/ShopsTab';
import client from './api/client';

const TABS = [
  { id: 'recommend', label: 'Recommendation', icon: Wand2 },
  { id: 'laptops', label: 'Laptops', icon: LaptopIcon },
  { id: 'shops', label: 'Shops', icon: Store },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('recommend');
  const [selectedLaptop, setSelectedLaptop] = useState(null);

  // Recommendation tab state
  const [mode, setMode] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(prefs) {
    setLoading(true);
    setSearched(true);
    try {
      const res = await client.post('/api/recommend', prefs);
      setResults(res.data.recommendations || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const resetRecommend = () => {
    setMode(null);
    setResults([]);
    setSearched(false);
  };

  const handleLogout = () => {
    ['customerToken', 'vendorToken', 'adminToken', 'userRole', 'userEmail'].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.href = 'http://localhost:3004/login?redirect=customer';
  };

  const handleSelectLaptop = (laptop) => {
    setSelectedLaptop(laptop);
  };

  const handleBackFromLaptop = () => {
    setSelectedLaptop(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedLaptop(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-extrabold text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <span>LaptopMarket</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">
              {localStorage.getItem('userEmail')}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-t border-gray-100">
          <div className="mx-auto flex max-w-7xl gap-1 px-4 sm:px-6">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* RECOMMENDATION TAB */}
        {activeTab === 'recommend' && (
          <>
            {!mode && !searched && <ModeSelector onSelect={setMode} />}
            {mode === 'voice' && <VoiceModeForm onSubmit={handleSubmit} onBack={resetRecommend} />}
            {mode === 'simple' && <SimpleForm onSubmit={handleSubmit} onBack={resetRecommend} />}
            {mode === 'pro' && <ProForm onSubmit={handleSubmit} onBack={resetRecommend} />}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
                <p className="mt-4 text-sm text-gray-500">Finding the best laptops...</p>
              </div>
            )}

            {!loading && searched && (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Your Recommendations
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {results.length > 0
                      ? `${results.length} laptops matched your needs`
                      : 'No laptops matched'}
                  </p>
                  <button
                    onClick={resetRecommend}
                    className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    ← Start over
                  </button>
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((l) => (
                      <ResultCard key={l.id} laptop={l} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-gray-500">
                      Try increasing your budget or removing filters.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* LAPTOPS TAB */}
        {activeTab === 'laptops' && (
          <>
            {selectedLaptop ? (
              <LaptopDetail laptop={selectedLaptop} onBack={handleBackFromLaptop} />
            ) : (
              <LaptopsTab onSelectLaptop={handleSelectLaptop} />
            )}
          </>
        )}

        {/* SHOPS TAB */}
        {activeTab === 'shops' && <ShopsTab />}
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
