import { useState } from 'react';

const STORAGE_KEY = 'spain_quiz_player';

export function usePlayer() {
  const [playerName, setPlayerNameState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );

  function setPlayerName(name: string) {
    localStorage.setItem(STORAGE_KEY, name);
    setPlayerNameState(name);
  }

  return { playerName, setPlayerName };
}
