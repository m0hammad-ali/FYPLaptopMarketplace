import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import IconGrid from './IconGrid';
import BudgetCoins from './BudgetCoins';

export default function VoiceModeForm({ onSubmit, onBack }) {
  const [step, setStep] = useState('usage');
  const [usage, setUsage] = useState('');

  const handleUsage = (u) => {
    setUsage(u);
    setStep('budget');
  };

  const handleBudget = (budget) => {
    onSubmit({ mode: 'voice', usage, budget, top_k: 3 });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to modes
      </button>

      <h2 className="mb-2 text-2xl font-extrabold text-gray-900">
        {step === 'usage' ? 'What will you use it for?' : 'What is your budget?'}
      </h2>
      <p className="mb-8 text-sm text-gray-500">
        {step === 'usage'
          ? 'Tap the icon that matches your needs.'
          : 'Choose a budget range.'}
      </p>

      {step === 'usage' ? (
        <IconGrid onSelect={handleUsage} />
      ) : (
        <BudgetCoins onSelect={handleBudget} />
      )}
    </div>
  );
}
