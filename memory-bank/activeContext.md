# Active Context

## Current Focus
Stabilisierung der Codebasis: Quick-Fixes, Test-Infrastruktur (Jest/RTL + Playwright), Netlify-Deploy und Smoke-Tests (lokal + prod).

## Recent Changes
- Entferntes doppeltes `index.tsx` Script in `index.html` und fehlenden `index.css` Link.
- Vereinheitlichte `UserProfile`-Quelle in `types.ts` und aktualisierte Persistenz/Profil-UI (Sprachcodes).
- Känguru-Start in `Home` korrekt verdrahtet.
- Bereinigung `LearningSession`-Props-Duplikat und Gemini SDK `config/response.text` vereinheitlicht.
- Jest/RTL + Playwright Infrastruktur hinzugefügt (Configs, Scripts).
- Erste Unit-Tests für Persistenz und Results-Komponente, sowie E2E-Smoke-Test.
- Typecheck getrennt: App (`tsconfig.json`) vs Tests (`tsconfig.test.json`).
- Playwright Browser-Install (Chromium/Firefox) und E2E-Smoke-Test laufen (lokal).
- Netlify CLI Production Deploy durchgeführt: `https://mathe-heldin-app.netlify.app`
- Playwright so erweitert, dass `PLAYWRIGHT_BASE_URL` den Testlauf gegen Deploy ohne lokalen Webserver erlaubt.

## Open Questions / Next Steps
- Git Remote fehlt aktuell (`git remote -v` leer) → Push/Synchronisation blockiert bis `origin` gesetzt ist.
- Netlify: prüfen, ob `GEMINI_API_KEY` als Netlify Environment Variable gesetzt ist (Prod-Funktionalität ohne lokale `.env.local`).
- Testabdeckung erweitern (LearningSession-Flow, LevelMap, Gemini-Service-Mocking, Regression-Tests für Profile/Language).
- Größere Fix-Wellen: KI-API-Key serverseitig kapseln, Accessibility-Showstopper, Lernmodi/Progression trennen.
