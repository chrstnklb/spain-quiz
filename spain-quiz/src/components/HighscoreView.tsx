import { useHighscore } from '../hooks/useHighscore';

export function HighscoreView() {
  const { scores, loading, error, refresh } = useHighscore();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Highscore</h2>
      {loading && <p style={styles.info}>Lade...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && scores.length === 0 && (
        <p style={styles.info}>Noch keine Punkte eingetragen.</p>
      )}
      {!loading && scores.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Punkte</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.player_name} style={i === 0 ? styles.firstRow : undefined}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{s.player_name}</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>{s.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button style={styles.refreshBtn} onClick={refresh} disabled={loading}>
        🔄 Aktualisieren
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '1rem 0' },
  title: { margin: '0 0 1rem', color: '#c60b1e' },
  info: { color: '#666' },
  error: { color: '#c60b1e', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' },
  th: { padding: '0.5rem', borderBottom: '2px solid #ddd', textAlign: 'left', color: '#888', fontSize: '0.85rem' },
  td: { padding: '0.6rem 0.5rem', borderBottom: '1px solid #f0f0f0' },
  firstRow: { background: '#fff8e1' },
  refreshBtn: {
    padding: '0.5rem 1rem',
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
};
