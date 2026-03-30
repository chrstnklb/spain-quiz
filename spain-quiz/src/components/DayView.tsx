import { useState } from 'react';
import type { DayBundle } from '../types/quiz';
import { QuestionCard } from './QuestionCard';
import { ScoreSummary } from './ScoreSummary';
import { HighscoreView } from './HighscoreView';
import { useQuizState } from '../hooks/useQuizState';

interface Props {
  bundle: DayBundle;
  playerName: string;
}

export function DayView({ bundle, playerName }: Props) {
  const { isAnswered, getPoints, submitAnswer, getDayScore, getDayAnsweredCount, saveError, setSaveError } =
    useQuizState(playerName);

  const [showHighscore, setShowHighscore] = useState(false);

  // Finde den Index der ersten unbeantworteten Frage als Startpunkt
  const firstUnanswered = bundle.questions.findIndex(q => !isAnswered(bundle.day, q.id));
  const [currentIndex, setCurrentIndex] = useState(firstUnanswered === -1 ? 0 : firstUnanswered);

  const total = bundle.questions.length;
  const answeredCount = getDayAnsweredCount(bundle.day);
  const allDone = answeredCount >= total;
  const currentQuestion = bundle.questions[currentIndex];
  const currentAnswered = currentQuestion ? isAnswered(bundle.day, currentQuestion.id) : false;

  function goNext() {
    if (currentIndex < total - 1) setCurrentIndex(i => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  }

  if (showHighscore) {
    return (
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => setShowHighscore(false)}>← Zurück</button>
        <HighscoreView />
      </div>
    );
  }

  if (allDone) {
    return (
      <div style={styles.container}>
        <ScoreSummary
          day={bundle.day}
          dayScore={getDayScore(bundle.day)}
          totalQuestions={total}
          onShowHighscore={() => setShowHighscore(true)}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.dayLabel}>Tag {bundle.day}</div>
          <h1 style={styles.title}>{bundle.title}</h1>
        </div>
        <button style={styles.highscoreBtn} onClick={() => setShowHighscore(true)}>
          🏆
        </button>
      </div>

      <div style={styles.progressRow}>
        <span style={styles.progressText}>Frage {currentIndex + 1} von {total}</span>
        <span style={styles.progressText}>{answeredCount} beantwortet</span>
      </div>
      <div style={styles.progress}>
        <div style={{ ...styles.progressBar, width: `${(answeredCount / total) * 100}%` }} />
      </div>

      {saveError && (
        <div style={styles.errorBanner}>
          {saveError}
          <button style={styles.errorClose} onClick={() => setSaveError(null)}>✕</button>
        </div>
      )}

      <div style={styles.questionWrapper}>
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          answered={currentAnswered}
          earnedPoints={getPoints(bundle.day, currentQuestion.id)}
          onAnswer={pts => submitAnswer(bundle.day, currentQuestion.id, pts)}
        />
      </div>

      <div style={styles.nav}>
        <button style={styles.navBtn} onClick={goPrev} disabled={currentIndex === 0}>
          ← Zurück
        </button>
        <button
          style={{ ...styles.navBtn, ...styles.navBtnPrimary }}
          onClick={goNext}
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' },
  dayLabel: { fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },
  title: { margin: '0.25rem 0 0', fontSize: '1.5rem', color: '#c60b1e' },
  highscoreBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem', cursor: 'pointer', fontSize: '1.2rem',
  },
  progressRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' },
  progress: { height: '6px', background: '#f0f0f0', borderRadius: '3px', marginBottom: '1.25rem' },
  progressBar: { height: '100%', background: '#c60b1e', borderRadius: '3px', transition: 'width 0.3s' },
  progressText: { fontSize: '0.85rem', color: '#888' },
  errorBanner: {
    background: '#f8d7da', color: '#721c24', padding: '0.75rem 1rem',
    borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between',
  },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  questionWrapper: { marginBottom: '1.5rem' },
  nav: { display: 'flex', gap: '0.75rem', justifyContent: 'space-between' },
  navBtn: {
    flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '0.5rem',
    background: '#f5f5f5', cursor: 'pointer', fontSize: '0.95rem',
  },
  navBtnPrimary: { background: '#c60b1e', color: 'white', border: 'none', fontWeight: 'bold' },
  backBtn: {
    background: 'none', border: 'none', color: '#c60b1e', cursor: 'pointer',
    fontSize: '0.95rem', marginBottom: '1rem', padding: 0,
  },
};
