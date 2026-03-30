import { NamePrompt } from './components/NamePrompt';
import { DayView } from './components/DayView';
import { StatusScreen } from './components/StatusScreen';
import { usePlayer } from './hooks/usePlayer';
import { getCurrentVacationDay, isQuizDay, isFinaleDay } from './utils/dateUtils';
import questions from './data/questions.json';
import type { DayBundle } from './types/quiz';

const allBundles = questions as DayBundle[];

export default function App() {
  const { playerName, setPlayerName } = usePlayer();
  const vacationDay = getCurrentVacationDay();

  if (!playerName) {
    return <NamePrompt onSubmit={setPlayerName} />;
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
      return (
        <div style={{ minHeight: '100vh', background: '#f8f8f8' }}>
          <DayView bundle={bundle} playerName={playerName} />
        </div>
      );
    }
  }

  return <StatusScreen type="after" />;
}
