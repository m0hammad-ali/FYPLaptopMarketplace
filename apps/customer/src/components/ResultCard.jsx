import { Volume2, MessageCircle, Star } from 'lucide-react';
import client from '../api/client';

export default function ResultCard({ laptop }) {
  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const speakSummary = () => {
    speak(
      `${laptop.brand} ${laptop.model}. Price ${laptop.price_pkr} rupees. ${laptop.ram_gb} gigabytes RAM.`
    );
  };

  const contactShop = async () => {
    try {
      const res = await client.post('/api/notify/whatsapp-link', {
        phone: '923001234567',
        laptop_brand: laptop.brand,
        laptop_model: laptop.model,
        price_pkr: laptop.price_pkr,
      });
      window.open(res.data.url, '_blank', 'noopener,noreferrer');
    } catch {
      const fallback = `https://wa.me/923001234567?text=${encodeURIComponent(
        `Hi, I'm interested in the ${laptop.brand} ${laptop.model}.`
      )}`;
      window.open(fallback, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="mb-3 inline-flex items-center gap-1 self-start rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1 text-xs font-bold text-white">
        <Star className="h-3 w-3" />
        {Math.round(laptop.similarity_score * 100)}% match
      </div>

      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {laptop.category}
      </div>
      <h3 className="mb-3 text-lg font-bold text-gray-900">
        {laptop.brand} {laptop.model}
      </h3>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {[
          laptop.cpu_model,
          `${laptop.ram_gb}GB RAM`,
          `${laptop.storage_gb}GB ${laptop.storage_type}`,
          `${laptop.display_size}"`,
          `${laptop.weight_kg}kg`,
        ].map((spec, i) => (
          <span
            key={i}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
          >
            {spec}
          </span>
        ))}
      </div>

      <div className="mb-5 text-2xl font-extrabold text-indigo-600">
        Rs. {laptop.price_pkr.toLocaleString()}
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={speakSummary}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          <Volume2 className="h-4 w-4" /> Listen
        </button>
        <button
          onClick={contactShop}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#20BD5A]"
        >
          <MessageCircle className="h-4 w-4" /> Contact
        </button>
      </div>
    </div>
  );
}
