import { Image, BookOpen, Wrench } from 'lucide-react';

export default function ModeSelector({ onSelect }) {
  const modes = [
    {
      id: 'voice',
      icon: Image,
      title: 'Easy Mode',
      desc: 'Tap pictures. No reading needed.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      id: 'simple',
      icon: BookOpen,
      title: 'Simple',
      desc: 'Answer in plain language.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pro',
      icon: Wrench,
      title: 'Pro',
      desc: 'Full control over every spec.',
      gradient: 'from-indigo-500 to-violet-500',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="mb-3 text-3xl font-extrabold text-gray-900 md:text-4xl">
        How would you like to search?
      </h1>
      <p className="mb-12 text-gray-500">
        Choose the mode that suits you best. You can switch anytime.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
          >
            <div
              className={`mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.gradient} text-white shadow-lg`}
            >
              <m.icon className="h-7 w-7" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-gray-900">{m.title}</h3>
            <p className="text-sm text-gray-500">{m.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
