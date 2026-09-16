import { useState } from 'react';

export default function SimpleForm({ onSubmit, onBack }) {
  const [usage, setUsage] = useState('everyday');
  const [budget, setBudget] = useState(150000);
  const [portable, setPortable] = useState('no');

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefs = {
      mode: 'simple',
      usage,
      budget,
      top_k: 5,
    };
    if (portable === 'yes') {
      prefs.weight_max_kg = 1.6;
      prefs.battery_min_wh = 55;
    }
    onSubmit(prefs);
  };

  return (
    <div className="form-wrapper">
      <button className="back-btn" onClick={onBack}>← Back to modes</button>

      <h2>Tell us what you need</h2>
      <p className="subtitle">Answer three simple questions and we'll find the best matches.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>What will you use the laptop for?</label>
          <select value={usage} onChange={(e) => setUsage(e.target.value)}>
            <option value="gaming">🎮 Gaming (PUBG, GTA, etc.)</option>
            <option value="office">💼 Office work (Word, Excel, Email)</option>
            <option value="everyday">🌐 Browsing (Facebook, YouTube)</option>
            <option value="ultrabook">✈️ Light and easy to carry</option>
            <option value="workstation">🎬 Video editing / design</option>
          </select>
        </div>

        <div className="form-group">
          <label>How much can you spend?</label>
          <select value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
            <option value={80000}>Under Rs. 80,000</option>
            <option value={150000}>Rs. 80,000 – 1,50,000</option>
            <option value={250000}>Rs. 1,50,000 – 2,50,000</option>
            <option value={400000}>Rs. 2,50,000 – 4,00,000</option>
            <option value={700000}>Rs. 4,00,000+</option>
          </select>
        </div>

        <div className="form-group">
          <label>Will you carry it around often?</label>
          <select value={portable} onChange={(e) => setPortable(e.target.value)}>
            <option value="no">No, it stays at home</option>
            <option value="yes">Yes, I carry it daily</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Show Me Laptops
        </button>
      </form>
    </div>
  );
}
