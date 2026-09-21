import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProForm({ onSubmit, onBack }) {
  const [prefs, setPrefs] = useState({
    usage: 'gaming',
    budget: 250000,
    brand_preference: 'Any',
    cpu_min_benchmark: 0,
    gpu_min_benchmark: 0,
    ram_min_gb: 0,
    storage_min_gb: 0,
    weight_max_kg: 5,
    battery_min_wh: 0,
    top_k: 5,
  });

  const upd = (e) => setPrefs({ ...prefs, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ ...prefs, mode: 'pro' });
  };

  const fields = [
    { name: 'budget', label: 'Budget (PKR)', type: 'number', step: 10000 },
    { name: 'brand_preference', label: 'Brand', type: 'text', placeholder: 'Any, HP, Dell...' },
    { name: 'cpu_min_benchmark', label: 'Min CPU Benchmark', type: 'number' },
    { name: 'gpu_min_benchmark', label: 'Min GPU Benchmark', type: 'number' },
    { name: 'ram_min_gb', label: 'Min RAM (GB)', type: 'number' },
    { name: 'storage_min_gb', label: 'Min Storage (GB)', type: 'number' },
    { name: 'weight_max_kg', label: 'Max Weight (kg)', type: 'number', step: 0.1 },
    { name: 'battery_min_wh', label: 'Min Battery (Wh)', type: 'number' },
    { name: 'top_k', label: 'Number of Results', type: 'number', min: 1, max: 10 },
  ];

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to modes
      </button>

      <h2 className="mb-2 text-2xl font-extrabold text-gray-900">Professional Mode</h2>
      <p className="mb-8 text-sm text-gray-500">
        Full control over every specification.
      </p>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Usage Type</label>
          <select
            name="usage"
            value={prefs.usage}
            onChange={upd}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="gaming">Gaming</option>
            <option value="office">Office</option>
            <option value="ultrabook">Ultrabook</option>
            <option value="workstation">Workstation</option>
            <option value="everyday">Everyday</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type}
                step={f.step}
                min={f.min ?? 0}
                max={f.max}
                placeholder={f.placeholder}
                value={prefs[f.name]}
                onChange={upd}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Get Recommendations
        </button>
      </form>
    </div>
  );
}
