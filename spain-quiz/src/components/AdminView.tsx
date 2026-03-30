import { useState } from 'react';
import questions from '../data/questions.json';
import type { DayBundle } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { HighscoreView } from './HighscoreView';
import { useQuizState } from '../hooks/useQuizState';
import { usePlayer } from '../hooks/usePlayer';

const allBundles = questions as DayBundle[];

export function AdminView() {
  const { playerName, setPlayerName } = usePlayer();
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHighscore, setShowHighscore] = useState(false);

  const name = playerName ?? 'admin';
  if (!playerName) setPlayerName('admin');

  const bundle = allBundles.find(b => b.day === selectedDay)!;
  const total = bundle.questions.length;
  const currentQuestion = bundle.questions[currentIndex];

  const { isAnswered, getPoints, submitAnswer, getDayScore, getDayAnsweredCount, saveError, setSaveError } =
    useQuizState(name);

  function selectDay(day: number) {
    setSelectedDay(day);
    setCurrentIndex(0);
  }

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>🛠 Admin</div>
        {allBundles.map(b => (
          <button
            key={b.day}
            style={{ ...styles.dayBtn, ...(selectedDay === b.day ? styles.dayBtnActive : {}) }}
            onClick={() => selectDay(b.day)}
          >
            Tag {b.day} — {b.title}
          </button>
        ))}
        <button
          style={{ ...styles.dayBtn, marginTop: '1rem', ...(showHighscore ? styles.dayBtnActive : {}) }}
          onClick={() => setShowHighscore(v => !v)}
        >
          🏆 Highscore
        </button>
      </div>

      <div style={styles.content}>
        {showHighscore ? (
          <HighscoreView />
        ) : (
          <>
            <div style={styles.header}>
              <div style={styles.dayLabel}>Tag {bundle.day}</div>
              <h1 style={styles.title}>{bundle.title}</h1>
              <p style={styles.subtitle}>{bundle.date}</p>
            </div>

            <div style={styles.progressRow}>
              <span style={styles.progressText}>Frage {currentIndex + 1} von {total}</span>
              <span style={styles.progressText}>{getDayAnsweredCount(bundle.day)} beantwortet · {getDayScore(bundle.day)} Punkte</span>
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
              answered={isAnswered(bundle.day, currentQuestion.id)}
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
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', background: '#f8f8f8' },
  sidebar: {
    width: '220px', background: '#1a1a2e', padding: '1.25rem 0.75rem',
    display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0,
  },
  sidebarTitle: { color: '#f1bf00', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.75rem', padding: '0 0.5rem' },
  dayBtn: {
    background: 'none', border: 'none', color: '#ccc', textAlign: 'left',
    padding: '0.5rem 0.75rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.85rem',
  },
  dayBtnActive: { background: '#c60b1e', color: 'white' },
  content: { flex: 1, padding: '1.5rem', maxWidth: '640px' },
  header: { marginBottom: '1rem' },
  dayLabel: { fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },
  title: { margin: '0.2rem 0 0', fontSize: '1.4rem', color: '#c60b1e' },
  subtitle: { color: '#aaa', fontSize: '0.85rem', margin: '0.25rem 0 0' },
  progressRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' },
  progress: { height: '6px', background: '#e0e0e0', borderRadius: '3px', marginBottom: '1.25rem' },
  progressBar: { height: '100%', background: '#c60b1e', borderRadius: '3px', transition: 'width 0.3s' },
  progressText: { fontSize: '0.82rem', color: '#888' },
  errorBanner: {
    background: '#f8d7da', color: '#721c24', padding: '0.75rem 1rem',
    borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between',
  },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  nav: { display: 'flex', gap: '0.75rem', marginTop: '1rem' },
  navBtn: {
    flex: 1, padding: '0.7rem', border: '1px solid #ddd', borderRadius: '0.5rem',
    background: '#f5f5f5', cursor: 'pointer', fontSize: '0.9rem',
  },
  navBtnPrimary: { background: '#c60b1e', color: 'white', border: 'none', fontWeight: 'bold' },
};
