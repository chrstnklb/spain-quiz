# Malta Quiz – sieben Tage

Eigenständige Malta-Adaption des Spanien-Quiz auf Branch `malta-quiz-7-days`.

- Quiztage: 31.10. bis 06.11.2026 (7 × 8 Fragen = 56 Fragen).
- 07.11.2026: Finale/Highscore ohne neue Fragen.
- Tagesansicht, vergangene Tage, Admin, Multiple Choice, Schätzfragen und Punktewertung wie im Original.
- Test: `?day=1`, `?day=7` oder `/admin`.
- Lokale Entwicklung: im Unterordner `spain-quiz` `npm ci && npm run dev`.

## Wichtig vor eigenständigem Live-Betrieb

Die App nutzt Supabase mit `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`. Für Malta eine **separate Supabase-Datenbank / ein separates Projekt** und entsprechende Deployment-Variablen verwenden, damit Spanien- und Malta-Scores nicht vermischt werden. Die Quizantworten sind in `src/data/questions.json`, der Zeitraum in `src/utils/dateUtils.ts` gepflegt.

Dies ist ein separater Git-Branch **im Spanien-Repository**, noch kein separates GitHub-Repository und noch kein Live-Deployment. Für eine neue Repository-Kopie kann der Branch lokal exportiert oder in ein neues Repository gepusht werden.
