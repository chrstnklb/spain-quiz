import { HighscoreView } from './HighscoreView';

interface Props {
  type: 'before' | 'finale' | 'after';
}

export function StatusScreen({ type }: Props) {
  if (type === 'before') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.emoji}>⏳</div>
          <h1 style={styles.title}>Bald geht's los!</h1>
          <p style={styles.text}>Das España Quiz startet am <strong>18. April 2026</strong>.</p>
          <p style={styles.text}>Bis dahin schon mal auf gute Fahrt! 🚗</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, maxWidth: '600px' }}>
        <div style={styles.emoji}>{type === 'finale' ? '🎊' : '🏁'}</div>
        <h1 style={styles.title}>
          {type === 'finale' ? 'Letzter Urlaubstag!' : 'Urlaub vorbei!'}
        </h1>
        <p style={styles.text}>
          {type === 'finale'
            ? 'Kein neues Quiz heute — schaut wer gewonnen hat! 🥇'
            : 'Danke für eine tolle Reise durch Spanien. Hier das Endergebnis:'}
        </p>
        <HighscoreView />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #c60b1e 0%, #f1bf00 100%)',
    padding: '1rem',
  },
  card: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  emoji: { fontSize: '3rem', textAlign: 'center' },
  title: { textAlign: 'center', color: '#c60b1e', margin: '0.5rem 0' },
  text: { textAlign: 'center', color: '#555' },
};
