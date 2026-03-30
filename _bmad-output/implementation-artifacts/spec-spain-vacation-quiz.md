---
title: 'Spain Vacation Quiz App'
type: 'feature'
created: '2026-03-30'
status: 'done'
baseline_commit: '140b0e2382fe3f8cbcf6be22e84af2454db4ee98'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Eine Reisegruppe möchte sich während eines Spanien-Urlaubs (18.–26. April) auf Autofahrten mit einem regionalen Quiz unterhalten und einen gemeinsamen Highscore über alle Geräte hinweg sehen.

**Approach:** React/TypeScript-Web-App (Netlify), die täglich neue Fragen freischaltet (Tag 1–8, 18.–25. April), Multiple-Choice und Schätzfragen unterstützt, Punkte und Spielernamen in Supabase speichert und einen jederzeit einsehbaren Highscore aller Spieler zeigt. Tag 9 (26. April) ist ein fragenloser Abschluss-Screen mit Gesamtwertung.

## Boundaries & Constraints

**Always:**
- Fragen in `src/data/questions.json` (lokal, kein CMS)
- Fragen für Tag 1–8 (18.–25. April); Tag 9 (26. April) = kein Quiz, nur Abschluss-Highscore
- Freischaltlogik basiert auf aktuallem Gerätedatum
- Punkte und Spielername werden in Supabase gespeichert (online-only)
- Beantwortete Fragen werden gesperrt (keine Doppel-Submission)
- TypeScript + React + Vite; statischer Build auf Netlify deploybar
- Schätzfragen: Wert innerhalb Toleranzbereich = 1 Punkt, sonst 0
- Kein Login / keine Authentifizierung — Spieler gibt einmalig einen Namen ein

**Ask First:**
- (keine offenen Punkte)

**Never:**
- Kein Backend-Server, keine eigene API
- Kein Echtzeit-Multiplayer (kein WebSocket) — Highscore wird bei Seitenaufruf/Refresh geladen
- Keine Offline-Unterstützung / kein Service Worker
- Keine Authentifizierung / kein Passwortschutz
- Fragen und Antworten bleiben in `questions.json` (nicht in DB)
- Spielernamen werden nicht als eigene Tabelle in Supabase gespeichert — nur als Label im `scores`-Eintrag

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Erster App-Start | Kein Spielername gespeichert | Name-Eingabe-Prompt erscheint | Leerer Name → kein Submit möglich |
| Tagesfragen laden | Gerätedatum 18.–25. April | Fragen des jeweiligen Tages (gesperrt falls beantwortet) | – |
| Tag 9 öffnen | Gerätedatum 26. April | Abschluss-Screen mit Highscore aller Spieler | Supabase-Fehler → Fehlermeldung |
| Multiple-Choice beantworten | Nutzer tippt Antwort-Option | Sofortiges Feedback, Punkt gutschreiben, Frage lokal sperren, Score zu Supabase schreiben | Supabase-Fehler → Fehlermeldung; Frage bleibt gesperrt |
| Schätzfrage beantworten | Nutzer gibt Zahl ein + Submit | Toleranzprüfung, Feedback, Punkt ggf. gutschreiben, Frage lokal sperren, Score zu Supabase | Leere/ungültige Eingabe → Validierungsfehler; Supabase-Fehler → Fehlermeldung; Frage bleibt gesperrt |
| Highscore anzeigen | Beliebiger Zeitpunkt | Tabelle aller Spieler mit Gesamtpunkten, absteigend sortiert | Supabase-Fehler → Fehlermeldung anzeigen |
| App vor Urlaubsbeginn | Datum < 18. April | Hinweis „Quiz startet am 18. April" | – |
| App nach Urlaubsende | Datum > 26. April | Abschluss-Screen mit Highscore | – |

</frozen-after-approval>

## Code Map

- `src/data/questions.json` -- Fragen gruppiert nach Tag (1–8), Typ mc/estimate, Antworten, Toleranz
- `src/types/quiz.ts` -- Typen: `Question`, `DayBundle`, `PlayerScore`
- `src/utils/dateUtils.ts` -- `getCurrentVacationDay()`: gibt 1–9 zurück, `'before'` oder `'after'`
- `src/utils/scoring.ts` -- `scoreMultipleChoice()`, `scoreEstimate(value, target, tolerance)`
- `src/lib/supabase.ts` -- Supabase-Client-Initialisierung (env vars)
- `src/hooks/usePlayer.ts` -- Spielername aus localStorage lesen/schreiben; einmaliger Name-Prompt
- `src/hooks/useQuizState.ts` -- Beantwortete Fragen aus localStorage (gesperrt-Status); Score-Writes zu Supabase
- `src/hooks/useHighscore.ts` -- Highscore-Daten von Supabase laden
- `src/components/NamePrompt.tsx` -- Einmaliger Name-Eingabe-Dialog beim ersten Start
- `src/components/QuestionCard.tsx` -- Rendert MC- oder Schätzfrage; Feedback nach Antwort; gesperrt wenn beantwortet
- `src/components/DayView.tsx` -- Tagesansicht: Tagestitel, Fortschritt, Liste QuestionCards
- `src/components/ScoreSummary.tsx` -- Tageszusammenfassung: X von Y Punkten
- `src/components/HighscoreView.tsx` -- Tabelle aller Spieler, Gesamtpunkte, absteigend; jederzeit aufrufbar
- `src/components/StatusScreen.tsx` -- Vor-Urlaubs-Hinweis oder Abschluss-Screen (Tag 9 / nach Urlaub)
- `src/App.tsx` -- Routing: NamePrompt → StatusScreen / DayView / HighscoreView
- `src/main.tsx` -- Vite-Einstiegspunkt
- `index.html` -- HTML-Shell
- `vite.config.ts` -- Vite React+TS Konfiguration
- `netlify.toml` -- SPA-Redirect + Env-Var-Hinweis
- `.env.example` -- `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY`

## Tasks & Acceptance

**Execution:**
- [x] `src/data/questions.json` -- Erstellen mit Beispieldaten für Tag 1–8 (je 3–5 Fragen, Mix MC + Schätzfragen über Spanien)
- [x] `src/types/quiz.ts` -- Typen definieren: `Question` (mc/estimate), `DayBundle`, `PlayerScore`
- [x] `src/utils/dateUtils.ts` -- `getCurrentVacationDay()`: Tag 1–8 = Quiz, Tag 9 = Abschluss, before/after
- [x] `src/utils/scoring.ts` -- `scoreMultipleChoice()` und `scoreEstimate(value, target, tolerance)`
- [x] `src/lib/supabase.ts` -- Supabase-Client mit `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- [x] `src/hooks/usePlayer.ts` -- Spielername in localStorage; gibt `null` zurück wenn noch nicht gesetzt
- [x] `src/hooks/useQuizState.ts` -- Gesperrte Fragen in localStorage; Score-Writes zu Supabase-Tabelle `scores`
- [x] `src/hooks/useHighscore.ts` -- Lädt alle Einträge aus `scores`, aggregiert Gesamtpunkte pro Spieler
- [x] `src/components/NamePrompt.tsx` -- Eingabefeld + Submit; setzt Spielername via `usePlayer`
- [x] `src/components/QuestionCard.tsx` -- MC (Buttons) oder Schätzfrage (Input+Submit); Feedback; disabled wenn beantwortet
- [x] `src/components/DayView.tsx` -- Tagestitel, Fortschrittsbalken, QuestionCard-Liste, Link zu Highscore
- [x] `src/components/ScoreSummary.tsx` -- Tagespunkte, Gesamtpunkte, Link zu Highscore
- [x] `src/components/HighscoreView.tsx` -- Tabelle: Rang, Name, Gesamtpunkte; Refresh-Button
- [x] `src/components/StatusScreen.tsx` -- Vor-Urlaubs-Screen oder Abschluss-Screen mit HighscoreView
- [x] `src/App.tsx` -- Zeigt NamePrompt wenn kein Name; dann routing nach vacationDay
- [x] `vite.config.ts` -- Vite-Projekt (React+TS)
- [x] `netlify.toml` -- SPA-Redirect
- [x] `.env.example` -- Dokumentiert benötigte Env-Vars

**Acceptance Criteria:**
- Given erster App-Start ohne gespeicherten Namen, when App öffnet, then erscheint NamePrompt; Quiz startet erst nach Name-Eingabe
- Given Gerätedatum 20. April, when App öffnet, then werden Fragen von Tag 3 angezeigt
- Given Gerätedatum 26. April, when App öffnet, then erscheint Abschluss-Screen mit Highscore aller Spieler
- Given Nutzer beantwortet MC-Frage korrekt, when Antwort gewählt, then Feedback „Richtig", 1 Punkt, Frage gesperrt, Score in Supabase geschrieben
- Given Nutzer gibt Schätzwert innerhalb Toleranz ein, when Submit, then Feedback „Richtig" + 1 Punkt
- Given Nutzer gibt Schätzwert außerhalb Toleranz ein, when Submit, then Feedback „Falsch" + korrekte Antwort sichtbar
- Given Nutzer öffnet App erneut am selben Tag, when App lädt, then bereits beantwortete Fragen sind gesperrt
- Given Highscore-Ansicht geöffnet, when geladen, then alle Spieler mit Gesamtpunkten absteigend sortiert sichtbar

## Design Notes

**Supabase-Schema:** Eine Tabelle `scores` mit Spalten: `id`, `player_name` (text), `day` (int), `question_id` (text), `points` (int), `created_at`. Highscore = `SUM(points) GROUP BY player_name`.

**Spielername-Persistenz:** Name wird in localStorage gespeichert, nicht in Supabase — kein Login nötig. Derselbe Name kann theoretisch von mehreren Geräten genutzt werden (kein Schutz dagegen, bewusste Entscheidung).

**Schätzfragen-Toleranz:** Jede Schätzfrage hat `target` + `tolerance` in der JSON. Beispiel: `{ "target": 172, "tolerance": 20 }` → Eingabe 152–192 = 1 Punkt.

**Datums-Mapping:** Start = 18. April 2026. Tag 1–8 = Quiz-Tage, Tag 9 (26. April) = Abschluss. `getCurrentVacationDay()` gibt `9` für Abschluss-Tag zurück.

## Verification

**Commands:**
- `npm run build` -- expected: Build ohne Fehler, keine TypeScript-Errors
- `npm run dev` -- expected: App startet lokal (Supabase-Env-Vars in `.env` nötig)

**Manual checks:**
- Kein Name gesetzt → NamePrompt erscheint
- Gerätedatum 20. April → Tag-3-Fragen
- Gerätedatum 26. April → Abschluss-Screen mit Highscore
- Frage beantworten, App neu laden → Frage gesperrt
- Highscore-Ansicht → alle Spieler mit Punkten sichtbar

## Suggested Review Order

**Entry Point — App-Routing**

- Hauptsteuerung: welcher Screen wann angezeigt wird
  [`App.tsx:1`](../../spain-quiz/src/App.tsx#L1)

**Datums- & Urlaubslogik**

- Kernlogik: Gerätedatum → Urlaubstag, Sonderfälle before/after/finale
  [`dateUtils.ts:1`](../../spain-quiz/src/utils/dateUtils.ts#L1)

**Datenpersistenz & Supabase**

- Antworten lokal sperren + Score asynchron zu Supabase schreiben
  [`useQuizState.ts:1`](../../spain-quiz/src/hooks/useQuizState.ts#L1)

- Supabase-Client + saveScore + loadHighscores-Aggregation
  [`supabase.ts:1`](../../spain-quiz/src/lib/supabase.ts#L1)

- Spielername aus localStorage; null wenn noch nicht gesetzt
  [`usePlayer.ts:1`](../../spain-quiz/src/hooks/usePlayer.ts#L1)

**UI — Kernkomponenten**

- Rendert MC und Schätzfrage; Feedback + disabled-State
  [`QuestionCard.tsx:1`](../../spain-quiz/src/components/QuestionCard.tsx#L1)

- Tagesansicht mit Fortschritt, Highscore-Toggle, Error-Banner
  [`DayView.tsx:1`](../../spain-quiz/src/components/DayView.tsx#L1)

- Vor-Urlaubs, Abschluss und Nach-Urlaubs-Screen
  [`StatusScreen.tsx:1`](../../spain-quiz/src/components/StatusScreen.tsx#L1)

**UI — Unterstützende Komponenten**

- Highscore-Tabelle mit Refresh; Rang-Emoji für Top 3
  [`HighscoreView.tsx:1`](../../spain-quiz/src/components/HighscoreView.tsx#L1)

- Tageszusammenfassung nach allen beantworteten Fragen
  [`ScoreSummary.tsx:1`](../../spain-quiz/src/components/ScoreSummary.tsx#L1)

- Einmaliger Name-Eingabe-Dialog beim ersten Start
  [`NamePrompt.tsx:1`](../../spain-quiz/src/components/NamePrompt.tsx#L1)

**Punkte & Typen**

- Scoring-Funktionen: MC-Vergleich + Toleranzprüfung für Schätzfragen
  [`scoring.ts:1`](../../spain-quiz/src/utils/scoring.ts#L1)

- TypeScript-Typen: Question, DayBundle, PlayerScore, VacationDay
  [`quiz.ts:1`](../../spain-quiz/src/types/quiz.ts#L1)

**Daten & Config**

- Alle Fragen für Tag 1–8 (MC + Schätzfragen)
  [`questions.json:1`](../../spain-quiz/src/data/questions.json#L1)

- Netlify SPA-Redirect + Build-Konfiguration
  [`netlify.toml:1`](../../spain-quiz/netlify.toml#L1)

- Benötigte Env-Vars für Supabase
  [`.env.example:1`](../../spain-quiz/.env.example#L1)
