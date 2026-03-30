import { useState } from 'react';
import type { DayBundle } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { useQuizState } from '../hooks/useQuizState';
import questions from '../data/questions.json';
import { getCurrentVacationDay, isQuizDay } from '../utils/dateUtils';

const allBundles = questions as DayBundle[];

interface Props {
  playerName: string;
  onBack: () => void;
}

export function HistoryView({ playerName, onBack }: Props) {
  const vacationDay = getCurrentVacationDay();
  const currentDay = isQuizDay(vacationDay) ? vacationDay : typeof vacationDay === 'number' ? vacationDay : 8;

  // Vergangene Tage = alle Tage bis einschließlich gestern (oder alle wenn nach Urlaub)
  const pastBundles = allBundles.filter(b => b.day < currentDay);

  const [selectedDay, setSelectedDay] = useState<number>(pastBundles[pastBundles.length - 1]?.day ?? 1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isAnswered, getPoints, submitAnswer, getDayScore, getDayAnsweredCount, saveError, setSaveError } =
    useQuizState(playerName);

  const bundle = allBundles.find(b => b.day === selectedDay);

  if (pastBundles.length === 0) {
    return (
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onBack}>← Zurück</button>
        <p style={styles.empty}>Noch keine vergangenen Tage vorhanden.</p>
      </div>
    );
  }

  if (!bundle) return null;

  const total = bundle.questions.length;
  const currentQuestion = bundle.questions[currentIndex];
  const answered = isAnswered(bundle.day, currentQuestion.id);
  const answeredCount = getDayAnsweredCount(bundle.day);

  function selectDay(day: number) {
    setSelectedDay(day);
    setCurrentIndex(0);
  }

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={onBack}>← Zurück zum heutigen Tag</button>

      <h2 style={styles.heading}>📅 Vergangene Tage</h2>

      <div style={styles.dayTabs}>
        {pastBundles.map(b => (
          <button
            key={b.day}
            style={{ ...styles.tab, ...(selectedDay === b.day ? styles.tabActive : {}) }}
            onClick={() => selectDay(b.day)}
          >
            Tag {b.day}
          </button>
        ))}
      </div>

      <div style={styles.dayHeader}>
        <div style={styles.dayLabel}>Tag {bundle.day} — {bundle.title}</div>
        <div style={styles.dayScore}>{getDayScore(bundle.day)} Punkte · {answeredCount}/{total} beantwortet</div>
      </div>

      <div style={styles.progressRow}>
        <span style={styles.progressText}>Frage {currentIndex + 1} von {total}</span>
      </div>
      <div style={styles.progress}>
        <div style={{ ...styles.progressBar, width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>

      {saveError && (
        <div style={styles.errorBanner}>
          {saveError}
          <button style={styles.errorClose} onClick={() => setSaveError(null)}>✕</button>
        </div>
      )}

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        answered={answered}
        earnedPoints={getPoints(bundle.day, currentQuestion.id)}
        onAnswer={pts => submitAnswer(bundle.day, currentQuestion.id, pts)}
      />

      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0}>
          ← Zurück
        </button>
        <button
          style={{ ...styles.navBtn, ...styles.navBtnPrimary }}
          onClick={() => setCurrentIndex(i => i + 1)}
          disabled={currentIndex === total - 1}
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '1rem' },
  backBtn: { background: 'none', border: 'none', color: '#c60b1e', cursor: 'pointer', fontSize: '0.95rem', marginBottom: '1rem', padding: 0 },
  heading: { margin: '0 0 1rem', color: '#333' },
  empty: { color: '#888' },
  dayTabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  tab: { padding: '0.4rem 0.8rem', border: '1px solid #ddd', borderRadius: '2rem', background: '#f5f5f5', cursor: 'pointer', fontSize: '0.85rem' },
  tabActive: { background: '#c60b1e', color: 'white', border: '1px solid #c60b1e' },
  dayHeader: { marginBottom: '0.5rem' },
  dayLabel: { fontWeight: 'bold', fontSize: '1rem', color: '#333' },
  dayScore: { fontSize: '0.85rem', color: '#888', marginTop: '0.15rem' },
  progressRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' },
  progress: { height: '6px', background: '#f0f0f0', borderRadius: '3px', marginBottom: '1.25rem' },
  progressBar: { height: '100%', background: '#c60b1e', borderRadius: '3px', transition: 'width 0.3s' },
  progressText: { fontSize: '0.85rem', color: '#888' },
  errorBanner: { background: '#f8d7da', color: '#721c24', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  nav: { display: 'flex', gap: '0.75rem', marginTop: '1rem' },
  navBtn: { flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem', background: '#f5f5f5', cursor: 'pointer', fontSize: '0.95rem' },
  navBtnPrimary: { background: '#c60b1e', color: 'white', border: 'none', fontWeight: 'bold' },
};
