import { useState } from 'react';

interface Props {
  onSubmit: (name: string) => void;
}

export function NamePrompt({ onSubmit }: Props) {
  const [name, setName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>🇪🇸</div>
        <h1 style={styles.title}>España Quiz</h1>
        <p style={styles.subtitle}>Willkommen! Gib deinen Namen ein um zu starten.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Dein Name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
            autoFocus
          />
          <button style={styles.button} type="submit" disabled={!name.trim()}>
            Los geht's!
          </button>
        </form>
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
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  emoji: { fontSize: '3rem', marginBottom: '0.5rem' },
  title: { margin: '0 0 0.5rem', fontSize: '1.8rem', color: '#c60b1e' },
  subtitle: { color: '#666', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid #ddd',
    borderRadius: '0.5rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    background: '#c60b1e',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
};
