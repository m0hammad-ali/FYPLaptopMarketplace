import { useTextToSpeech } from '../../hooks/useTextToSpeech';

const BUDGET_OPTIONS = [
  { value: 80000, emoji: '💰', label: 'Under Rs. 80,000' },
  { value: 150000, emoji: '💰💰', label: 'Under Rs. 1,50,000' },
  { value: 250000, emoji: '💰💰💰', label: 'Under Rs. 2,50,000' },
  { value: 400000, emoji: '💰💰💰💰', label: 'Under Rs. 4,00,000' },
  { value: 700000, emoji: '💰💰💰💰💰', label: 'Rs. 4,00,000+' },
];

export default function BudgetCoins({ onSelect }) {
  const { speak } = useTextToSpeech();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {BUDGET_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className="icon-tile"
          style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}
          onClick={() => {
            speak(opt.label);
            onSelect(opt.value);
          }}
        >
          <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
