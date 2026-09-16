export default function ModeSelector({ onSelect }) {
  const modes = [
    {
      id: 'voice',
      emoji: '🖼',
      title: 'Easy Mode',
      desc: 'Tap pictures. No reading needed.',
    },
    {
      id: 'simple',
      emoji: '📖',
      title: 'Simple',
      desc: 'Answer in plain language.',
    },
    {
      id: 'pro',
      emoji: '🔧',
      title: 'Pro',
      desc: 'Full control over every spec.',
    },
  ];

  return (
    <div className="mode-selector">
      <h1>How would you like to search?</h1>
      <p>Choose the mode that suits you best. You can switch anytime.</p>

      <div className="mode-grid">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className="mode-card"
            onClick={() => onSelect(mode.id)}
            role="button"
            tabIndex={0}
          >
            <div className="mode-emoji">{mode.emoji}</div>
            <div className="mode-title">{mode.title}</div>
            <div className="mode-desc">{mode.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
