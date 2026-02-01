# Handoff / Letzter Stand

## Repository-Zustand
- Branch: `main`
- Letzte Commits:
  - `4545f61` – `chore: Tukas rebranding, privacy & serverless Gemini proxy, offline/parent features`
  - `23486c8` – `test: allow e2e baseURL override`
- Git Remote: Bereit für GitHub (`https://github.com/DiggAiHH/Tuka`) - lokal mit `git remote add origin https://github.com/DiggAiHH/Tuka.git && git push -u origin main`

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
1. **Git Push**: Lokal ausführen (falls noch nicht):
  ```bash
  cd /Users/mm/Downloads/mathe-heldin
  git remote add origin https://github.com/DiggAiHH/Tuka.git
  git push -u origin main
  ```
2. **Codespace Setup** (nach Git Push):
   - GitHub: Repo öffnen → Code → Codespaces → Create codespace on main
   - Oder: `gh codespace create -r DiggAiHH/Tuka -b main && gh codespace code -r DiggAiHH/Tuka`
   - Hinweis: Ein `.devcontainer` wurde hinzugefügt (`.devcontainer/devcontainer.json`). Codespaces und Remote‑Containers erkennen die Definition automatisch und verwenden die definierte Node‑Image + `postCreateCommand`.
3. **Prod-Konfiguration**: In Netlify prüfen/setzen:
  - `GEMINI_API_KEY` als Environment Variable (wird serverseitig in `/.netlify/functions/gemini` genutzt)
4. **Qualität/Compliance (nächste Iteration)**:
   - Testabdeckung ausbauen (LearningSession/LevelMap/Gemini-Mocking)
  - Logging/Fehlerbehandlung, Accessibility-WCAG-Showstopper

## AI Agent Instructions
- `.github/copilot-instructions.md` erstellt: umfassende Dokumentation für AI-Agenten (Architecture, Patterns, Workflows, Testing, Deployment).
- Quellen: Codebase-Analyse + Memory-Bank + `.clinerules` Integration.

## Feature-Stand (01.02.2026)
- Datenschutz: Pflicht-Dialog beim ersten Start (ohne Zustimmung kein Zugang) + Link im Footer.
- Profil: Geschlecht (👧/👦) + Mindestalter 3 Jahre.
- Personalisierung: UI-Texte nutzen Profilname statt hardcoded "Tuka".
- Elternbereich: lokales Username/Passwort (salted SHA-256), Login-Gate, Dashboard (Lern-Score/Empfehlungen/Session-Stats), Reset.
- Offline-Hybrid: lokale 100-Aufgaben-Bank + Fallback bei Offline/Fehler; Gemini-Aufgaben werden zusätzlich lokal gecached.
- Branding: sichtbare Namen auf "Tukas"/"Tukas Mathe-Welt" umgestellt.
- Security: Gemini läuft über Netlify Function (kein API-Key im Client).

