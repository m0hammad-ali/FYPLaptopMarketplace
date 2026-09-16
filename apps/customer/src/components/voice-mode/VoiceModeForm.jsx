import { useState } from 'react';
import IconGrid from './IconGrid';
import BudgetCoins from './BudgetCoins';

export default function VoiceModeForm({ onSubmit, onBack }) {
  const [step, setStep] = useState('usage');
  const [answers, setAnswers] = useState({});

  const handleUsage = (usage) => {
    setAnswers({ ...answers, usage });
    setStep('budget');
  };

  const handleBudget = (budget) => {
    onSubmit({
      mode: 'voice',
      usage: answers.usage,
      budget,
      top_k: 3,
    });
  };

  return (
    <div className="form-wrapper">
      <button className="back-btn" onClick={onBack}>← Back to modes</button>

      <h2>
        {step === 'usage' ? 'What will you use it for?' : 'What is your budget?'}
      </h2>
      <p className="subtitle">
        {step === 'usage'
          ? 'Tap the picture that matches your needs.'
          : 'Tap the coin pile that fits your budget.'}
      </p>

      {step === 'usage' ? (
        <IconGrid onSelect={handleUsage} />
      ) : (
        <BudgetCoins onSelect={handleBudget} />
      )}
    </div>
  );
}
