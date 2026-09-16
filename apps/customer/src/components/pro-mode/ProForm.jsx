import { useState } from 'react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrefs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...prefs, mode: 'pro' });
  };

  return (
    <div className="form-wrapper">
      <button className="back-btn" onClick={onBack}>← Back to modes</button>

      <h2>Professional Mode</h2>
      <p className="subtitle">Full control over every specification.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usage Type</label>
          <select name="usage" value={prefs.usage} onChange={handleChange}>
            <option value="gaming">Gaming</option>
            <option value="office">Office</option>
            <option value="ultrabook">Ultrabook</option>
            <option value="workstation">Workstation</option>
            <option value="everyday">Everyday</option>
          </select>
        </div>

        <div className="form-group">
          <label>Budget (PKR)</label>
          <input
            type="number"
            name="budget"
            value={prefs.budget}
            onChange={handleChange}
            step="10000"
            min="40000"
          />
        </div>

        <div className="form-group">
          <label>Brand Preference</label>
          <input
            type="text"
            name="brand_preference"
            value={prefs.brand_preference}
            onChange={handleChange}
            placeholder="Any, HP, Dell, Lenovo..."
          />
        </div>

        <div className="form-group">
          <label>Min CPU Benchmark</label>
          <input
            type="number"
            name="cpu_min_benchmark"
            value={prefs.cpu_min_benchmark}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Min GPU Benchmark</label>
          <input
            type="number"
            name="gpu_min_benchmark"
            value={prefs.gpu_min_benchmark}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Min RAM (GB)</label>
          <input
            type="number"
            name="ram_min_gb"
            value={prefs.ram_min_gb}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Min Storage (GB)</label>
          <input
            type="number"
            name="storage_min_gb"
            value={prefs.storage_min_gb}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Max Weight (kg)</label>
          <input
            type="number"
            name="weight_max_kg"
            value={prefs.weight_max_kg}
            onChange={handleChange}
            step="0.1"
            min="0.5"
          />
        </div>

        <div className="form-group">
          <label>Min Battery (Wh)</label>
          <input
            type="number"
            name="battery_min_wh"
            value={prefs.battery_min_wh}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Number of Results</label>
          <input
            type="number"
            name="top_k"
            value={prefs.top_k}
            onChange={handleChange}
            min="1"
            max="10"
          />
        </div>

        <button type="submit" className="submit-btn">
          Get Recommendations
        </button>
      </form>
    </div>
  );
}
