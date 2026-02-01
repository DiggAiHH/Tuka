# Active Context

## Current Focus
Produkt-Iteration für Release: Datenschutz-Transparenz, Elternbereich (lokal passwortgeschützt), Personalisierung (Name/Geschlecht), Offline-Hybrid-Fallback sowie Branding-Update auf "Tukas Mathe-Welt".

## Recent Changes
- Entferntes doppeltes `index.tsx` Script in `index.html` und fehlenden `index.css` Link.
- Vereinheitlichte `UserProfile`-Quelle in `types.ts` und aktualisierte Persistenz/Profil-UI (Sprachcodes).
- Känguru-Start in `Home` korrekt verdrahtet.
- Bereinigung `LearningSession`-Props-Duplikat und Gemini SDK `config/response.text` vereinheitlicht.
- Jest/RTL + Playwright Infrastruktur hinzugefügt (Configs, Scripts).
- Erste Unit-Tests für Persistenz und Results-Komponente, sowie E2E-Smoke-Test.
- Typecheck getrennt: App (`tsconfig.json`) vs Tests (`tsconfig.test.json`).
- Playwright Browser-Install (Chromium/Firefox) und E2E-Smoke-Test laufen (lokal).
- Netlify CLI Production Deploy durchgeführt (URL enthält noch den alten Netlify Site-Namen; Branding in der App ist "Tukas"): `https://mathe-heldin-app.netlify.app`
- Playwright so erweitert, dass `PLAYWRIGHT_BASE_URL` den Testlauf gegen Deploy ohne lokalen Webserver erlaubt.

- Profil erweitert: Geschlecht (👧/👦) + Mindestalter ab 3 Jahren (Geburtstags-Validation).
- Hardcoded "Tuka" in UI-Flows dynamisch durch Profilname ersetzt (Quiz/Results/LevelMap/Loading).
- Datenschutz-Dialog als Gate beim ersten Start + Link im Footer.
- Elternbereich implementiert: lokaler Username/Passwort (salted SHA-256 Hash), Login-Gate, Dashboard (Lern-Score/Empfehlungen/Session-Stats), Reset-Funktion.
- Offline-Hybrid: lokale Bank mit 100 Aufgaben + Fallback bei Offline/Fehler + Cache von Gemini-Aufgaben.
- Branding: sichtbare Namen in `index.html`/`manifest.json`/`metadata.json` auf "Tukas"/"Tukas Mathe-Welt" umgestellt.

## Open Questions / Next Steps
- Git Remote fehlt aktuell (`git remote -v` leer) → Push/Synchronisation blockiert bis `origin` gesetzt ist.
- Netlify: `GEMINI_API_KEY` als Environment Variable setzen (wird jetzt serverseitig in Netlify Function verwendet).
- Testabdeckung erweitern (LearningSession-Flow, LevelMap, Gemini-Service-Mocking, Regression-Tests für Profile/Language).
- Größere Fix-Wellen: Accessibility-Showstopper, Lernmodi/Progression trennen.

- Security/Compliance: Gemini-Aufrufe laufen jetzt über eine Netlify Function (`/.netlify/functions/gemini`), kein API-Key mehr im Client-Bundle.
- Eltern-Dashboard: Optional Export (JSON/PDF) + feinere Skill-Analyse (Themen/Fehlerklassen) ausbauen.
