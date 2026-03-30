import { useState } from 'react';
import { NamePrompt } from './components/NamePrompt';
import { DayView } from './components/DayView';
import { StatusScreen } from './components/StatusScreen';
import { AdminView } from './components/AdminView';
import { HistoryView } from './components/HistoryView';
import { usePlayer } from './hooks/usePlayer';
import { getCurrentVacationDay, isQuizDay, isFinaleDay, getMaxQuestionsPerDay } from './utils/dateUtils';
import questions from './data/questions.json';
import type { DayBundle } from './types/quiz';

const allBundles = questions as DayBundle[];

export default function App() {
  const { playerName, setPlayerName } = usePlayer();
  const [showHistory, setShowHistory] = useState(false);

  if (window.location.pathname === '/admin') {
    return <AdminView />;
  }

  const vacationDay = getCurrentVacationDay();

  if (!playerName) {
    return <NamePrompt onSubmit={setPlayerName} />;
  }

  if (showHistory) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
        <HistoryView playerName={playerName} onBack={() => setShowHistory(false)} />
      </div>
    );
  }

  if (vacationDay === 'before') {
    return <StatusScreen type="before" />;
  }

  if (isFinaleDay(vacationDay) || vacationDay === 'after') {
    return <StatusScreen type={vacationDay === 'after' ? 'after' : 'finale'} />;
  }

  if (isQuizDay(vacationDay)) {
    const bundle = allBundles.find(b => b.day === vacationDay);
    if (bundle) {
      const maxQuestions = getMaxQuestionsPerDay();
      const limitedBundle = maxQuestions
        ? { ...bundle, questions: bundle.questions.slice(0, maxQuestions) }
        : bundle;
      return (
        <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
          <DayView bundle={limitedBundle} playerName={playerName} onShowHistory={() => setShowHistory(true)} />
        </div>
      );
    }
  }

  return <StatusScreen type="after" />;
}
