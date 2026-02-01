# Active Context

## Current Focus
Stabilisierung der Codebasis: Quick-Fixes, Test-Infrastruktur (Jest/RTL + Playwright) und erste Kern-Tests.

## Recent Changes
- Entferntes doppeltes `index.tsx` Script in `index.html` und fehlenden `index.css` Link.
- Vereinheitlichte `UserProfile`-Quelle in `types.ts` und aktualisierte Persistenz/Profil-UI (Sprachcodes).
- Känguru-Start in `Home` korrekt verdrahtet.
- Bereinigung `LearningSession`-Props-Duplikat und Gemini SDK `config/response.text` vereinheitlicht.
- Jest/RTL + Playwright Infrastruktur hinzugefügt (Configs, Scripts).
- Erste Unit-Tests für Persistenz und Results-Komponente, sowie E2E-Smoke-Test.
- Typecheck getrennt: App (`tsconfig.json`) vs Tests (`tsconfig.test.json`).
- Playwright Browser-Install (Chromium/Firefox) und E2E-Smoke-Test laufen.

## Open Questions / Next Steps
- Netlify Deploy benötigt Zugang (Netlify Auth/Site ID/Token).
- Zusätzliche Tests für Learning/LevelMap/Gemini (Mocking) erweitern.
- Größere Fix-Wellen: KI-API-Key serverseitig kapseln, Accessibility-Showstopper, Lernmodi/Progression trennen.
