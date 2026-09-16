import { useTextToSpeech } from '../../hooks/useTextToSpeech';

const USAGE_OPTIONS = [
  { key: 'gaming', emoji: '🎮', label: 'Gaming' },
  { key: 'office', emoji: '💼', label: 'Office' },
  { key: 'everyday', emoji: '🌐', label: 'Browsing' },
  { key: 'ultrabook', emoji: '✈️', label: 'Light & Travel' },
  { key: 'workstation', emoji: '🎬', label: 'Video / Design' },
  { key: 'everyday', emoji: '📚', label: 'Studies' },
];

export default function IconGrid({ onSelect }) {
  const { speak } = useTextToSpeech();

  return (
    <div className="icon-grid">
      {USAGE_OPTIONS.map((opt, i) => (
        <button
          key={i}
          className="icon-tile"
          onClick={() => {
            speak(opt.label);
            onSelect(opt.key);
          }}
        >
          <span className="emoji">{opt.emoji}</span>
          <span className="label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
