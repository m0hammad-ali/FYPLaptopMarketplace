import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function SimpleForm({ onSubmit, onBack }) {
  const [usage, setUsage] = useState('everyday');
  const [budget, setBudget] = useState(150000);
  const [portable, setPortable] = useState('no');

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefs = { mode: 'simple', usage, budget, top_k: 5 };
    if (portable === 'yes') {
      prefs.weight_max_kg = 1.6;
      prefs.battery_min_wh = 55;
    }
    onSubmit(prefs);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to modes
      </button>

      <h2 className="mb-2 text-2xl font-extrabold text-gray-900">Tell us what you need</h2>
      <p className="mb-8 text-sm text-gray-500">
        Answer three simple questions and we'll find the best matches.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            What will you use the laptop for?
          </label>
          <select
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="gaming">🎮 Gaming (PUBG, GTA, etc.)</option>
            <option value="office">💼 Office work (Word, Excel, Email)</option>
            <option value="everyday">🌐 Browsing (Facebook, YouTube)</option>
            <option value="ultrabook">✈️ Light and easy to carry</option>
            <option value="workstation">🎬 Video editing / design</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            How much can you spend?
          </label>
          <select
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value={80000}>Under Rs. 80,000</option>
            <option value={150000}>Rs. 80,000 – 1,50,000</option>
            <option value={250000}>Rs. 1,50,000 – 2,50,000</option>
            <option value={400000}>Rs. 2,50,000 – 4,00,000</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Will you carry it around often?
          </label>
          <select
            value={portable}
            onChange={(e) => setPortable(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="no">No, it stays at home</option>
            <option value="yes">Yes, I carry it daily</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Show Me Laptops
        </button>
      </form>
    </div>
  );
}
