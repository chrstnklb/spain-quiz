interface Props {
  day: number;
  dayScore: number;
  totalQuestions: number;
  onShowHighscore: () => void;
}

export function ScoreSummary({ day, dayScore, totalQuestions, onShowHighscore }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.emoji}>🎉</div>
      <h2 style={styles.title}>Tag {day} abgeschlossen!</h2>
      <p style={styles.score}>
        Du hast <strong>{dayScore}</strong> von <strong>{totalQuestions}</strong> Punkten erreicht.
      </p>
      <button style={styles.btn} onClick={onShowHighscore}>
        🏆 Highscore anzeigen
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { textAlign: 'center', padding: '2rem 1rem' },
  emoji: { fontSize: '3rem' },
  title: { margin: '0.5rem 0', color: '#c60b1e' },
  score: { fontSize: '1.1rem', marginBottom: '1.5rem' },
  btn: {
    padding: '0.75rem 1.5rem',
    background: '#c60b1e',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
};
