import { useTextToSpeech } from '../hooks/useTextToSpeech';

export default function ResultCard({ laptop }) {
  const { speak } = useTextToSpeech();

  const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(
    `Hi, I'm interested in the ${laptop.brand} ${laptop.model} listed at Rs. ${laptop.price_pkr.toLocaleString()}. Is it available?`
  )}`;

  const speakSummary = () => {
    const text = `${laptop.brand} ${laptop.model}. Price ${laptop.price_pkr} rupees. ${laptop.ram_gb} gigabytes RAM. ${laptop.storage_gb} gigabytes storage.`;
    speak(text);
  };

  return (
    <div className="laptop-card">
      <div className="score-badge">
        {Math.round(laptop.similarity_score * 100)}% match
      </div>

      <div>
        <div className="laptop-category">{laptop.category}</div>
        <h3>{laptop.brand} {laptop.model}</h3>
      </div>

      <div className="spec-list">
        <span className="spec-chip">{laptop.cpu_model}</span>
        <span className="spec-chip">{laptop.ram_gb}GB RAM</span>
        <span className="spec-chip">{laptop.storage_gb}GB {laptop.storage_type}</span>
        <span className="spec-chip">{laptop.display_size}"</span>
        <span className="spec-chip">{laptop.weight_kg}kg</span>
        <span className="spec-chip">{laptop.battery_wh}Wh</span>
      </div>

      <div className="laptop-price">
        Rs. {laptop.price_pkr.toLocaleString()}
      </div>

      <div className="card-actions">
        <button className="speak-btn" onClick={speakSummary} title="Listen">
          🔊 Listen
        </button>
        <a
          className="whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Contact Shop
        </a>
      </div>
    </div>
  );
}
