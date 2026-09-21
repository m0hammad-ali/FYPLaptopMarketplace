import { Wallet } from 'lucide-react';

const BUDGETS = [
  { value: 80000, label: 'Under Rs. 80,000' },
  { value: 150000, label: 'Under Rs. 1,50,000' },
  { value: 250000, label: 'Under Rs. 2,50,000' },
  { value: 400000, label: 'Under Rs. 4,00,000' },
  { value: 700000, label: 'Rs. 4,00,000+' },
];

export default function BudgetCoins({ onSelect }) {
  return (
    <div className="space-y-3">
      {BUDGETS.map((b) => (
        <button
          key={b.value}
          onClick={() => onSelect(b.value)}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Wallet className="h-6 w-6" />
          </div>
          <span className="text-base font-bold text-gray-900">{b.label}</span>
        </button>
      ))}
    </div>
  );
}
