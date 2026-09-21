import { Gamepad2, Briefcase, Globe, Plane, Film, BookOpen } from 'lucide-react';

const USAGE = [
  { key: 'gaming', icon: Gamepad2, label: 'Gaming', color: 'bg-purple-100 text-purple-700' },
  { key: 'office', icon: Briefcase, label: 'Office', color: 'bg-blue-100 text-blue-700' },
  { key: 'everyday', icon: Globe, label: 'Browsing', color: 'bg-green-100 text-green-700' },
  { key: 'ultrabook', icon: Plane, label: 'Travel', color: 'bg-cyan-100 text-cyan-700' },
  { key: 'workstation', icon: Film, label: 'Video', color: 'bg-orange-100 text-orange-700' },
  { key: 'everyday', icon: BookOpen, label: 'Study', color: 'bg-pink-100 text-pink-700' },
];

export default function IconGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {USAGE.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt.key)}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${opt.color}`}>
            <opt.icon className="h-7 w-7" />
          </div>
          <span className="text-sm font-bold text-gray-900">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
