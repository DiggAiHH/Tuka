# Handoff / Letzter Stand

## Repository-Zustand
- Branch: `main`
- Letzte Commits:
  - `23486c8` – `test: allow e2e baseURL override`
  - `7697859` – `chore: stabilize build, add test + e2e setup`
- Git Remote: **nicht konfiguriert** (`git remote -v` ist leer) → Push/Synchronisation aktuell nicht möglich.

## Deployment (Netlify)
- Current Netlify URL (legacy site name, branding in-app is already "Tukas"): `https://mathe-heldin-app.netlify.app`
- Last deploy preview (legacy site name): `https://697f8bd6cb88ed025a234071--mathe-heldin-app.netlify.app`
- Site ID (lokal, `.netlify/state.json`): `eea3c75e-ff1e-4506-80de-8541eb540147`

## Reproduzierbare Checks
- Lokale Checks (alles grün):
  - `npm run typecheck`
  - `npm run typecheck:tests`
  - `npm test`
  - `npm run build`
  - `npm run test:e2e`
- E2E gegen Production (alles grün):
  - `npm run test:e2e:prod`

## Offene Punkte (Blocker + nächste Schritte)
1. **Git Push aktivieren**: Remote `origin` setzen (Repo-URL fehlt), dann `git push -u origin main`.
2. **Prod-Konfiguration**: In Netlify prüfen/setzen:
  - `GEMINI_API_KEY` als Environment Variable (wird serverseitig in `/.netlify/functions/gemini` genutzt)
3. **Qualität/Compliance (nächste Iteration)**:
   - Testabdeckung ausbauen (LearningSession/LevelMap/Gemini-Mocking)
  - Logging/Fehlerbehandlung, Accessibility-WCAG-Showstopper

## Feature-Stand (01.02.2026)
- Datenschutz: Pflicht-Dialog beim ersten Start (ohne Zustimmung kein Zugang) + Link im Footer.
- Profil: Geschlecht (👧/👦) + Mindestalter 3 Jahre.
- Personalisierung: UI-Texte nutzen Profilname statt hardcoded "Tuka".
- Elternbereich: lokales Username/Passwort (salted SHA-256), Login-Gate, Dashboard (Lern-Score/Empfehlungen/Session-Stats), Reset.
- Offline-Hybrid: lokale 100-Aufgaben-Bank + Fallback bei Offline/Fehler; Gemini-Aufgaben werden zusätzlich lokal gecached.
- Branding: sichtbare Namen auf "Tukas"/"Tukas Mathe-Welt" umgestellt.
- Security: Gemini läuft über Netlify Function (kein API-Key im Client).

