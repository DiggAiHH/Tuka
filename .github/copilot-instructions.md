# Tukas Mathe-Welt: AI Agent Instructions

**Purpose:** Guide AI coding agents to be immediately productive in this German-language educational math app for children (ages 3+).

---

## 🏗️ Architecture Overview

### Core Stack
- **Frontend:** React 18 + TypeScript + Vite (SPA)
- **Backend:** Netlify Serverless Functions (`netlify/functions/`)
- **AI Integration:** Google Gemini 2.0 Flash (server-side via `/.netlify/functions/gemini`)
- **Persistence:** Browser localStorage (no backend DB)
- **Testing:** Jest + React Testing Library (unit/integration), Playwright (E2E)
- **Deployment:** Netlify (static host + functions)

### State Machine (`AppState` in `types.ts`)
The app is built as a modal/screen router driven by `AppState` enum:
```
HOME → (Privacy Gate if first-run) → PROFILE/GUIDE/WHATS_NEW/LEARNING/EXAM/RESULTS/PARENT
```
Each state maps to a component; state changes happen in `App.tsx` via `setCurrentState()`.

### Key Data Flows

1. **Learning Flow:**
   - User selects difficulty (Leicht/Mittel/Schwer) → `App.tsx` calls `generateLevelProblems()` → Netlify function calls Gemini → `LearningSession` component renders problems → saves progress to localStorage.

2. **Offline Hybrid:**
   - No internet? → Fall back to `services/offlineProblems.ts` (100-problem seed bank by difficulty).
   - Gemini-generated problems are cached into offline bank via `cacheProblemsIntoOfflineBank()`.
   - Offline status detected via `navigator.onLine`; banner displayed in `App.tsx`.

3. **Parent Dashboard:**
   - Parent gate (username/password, salted SHA-256) in `components/ParentArea.tsx` → unlocks dashboard.
   - Dashboard loads progress events from localStorage → displays learning score, heuristic recommendations.
   - All parent data is **local-only** (no server sync).

---

## 🎯 Essential Patterns & Conventions

### Profile & Personalization
- **User Profile** stored in localStorage key `"tukas-profile"` (see `services/persistence.ts`).
- Profile includes: `name`, `gender` (👧=girl/👦=boy), `birthday`, `language` (de/en).
- **Dynamic pronouns & names:** Use `getPronouns()` + child name in AI prompts to personalize feedback.
- Example: Gemini prompt in `netlify/functions/gemini.ts` includes pronouns (subj/obj/poss) so feedback feels personal.

### Bilingual Content
- German (de) is primary; English translations available.
- Gemini responses have two-language fields: `{ de: "...", second_lang: "..." }` for steps, hints, feedback.
- **Important:** German text MUST be German; don't mix languages in the same `de` field.
- Language code passed to Gemini: `userProfile.language` or default `'de'`.

### Problem Structure (`MathProblem` in `types.ts`)
```typescript
{
  id: string;
  question: string;
  answer: string; // Always string, parsed client-side
  steps: string[]; // Step-by-step guide
  explanation: string;
  hints: string[]; // Help hints
  feedback_correct?: { de: string; second_lang?: string };
  feedback_incorrect?: { de: string; second_lang?: string };
}
```

### localStorage Keys
| Key | Purpose | Structure |
|-----|---------|-----------|
| `tukas-profile` | User profile | JSON: name, gender, birthday, language |
| `tukas-unlocked-levels` | Unlocked difficulty levels | JSON array |
| `tukas-history` | Past exam/session records | JSON array |
| `tukas-privacy-accepted` | Privacy consent gate | boolean string |
| `tukas-progress-events` | Learning score calculation | JSON array of progress events |
| `tukas-offline-problems` | Cached offline bank | JSON array (100 problems) |
| `tukas-parent-auth` | Parent credentials (hashed) | JSON: username, hashedPassword, salt |

---

## 🔐 Security & Compliance

### API Key Management
- **Gemini API Key is server-side only** (`GEMINI_API_KEY` env var in Netlify).
- Client calls `/.netlify/functions/gemini` via `fetch()` (no direct Gemini SDK in browser).
- See `services/geminiService.ts` for the client wrapper; see `netlify/functions/gemini.ts` for server handler.

### Privacy Gate
- On first run, user sees `PrivacyPolicy` modal (blocks all other access).
- Flag `tukas-privacy-accepted` stored after consent.
- Transparent disclosure: "Data sent to Gemini API via serverless function" (no API key on device).

### Parent Authentication
- Username/password stored locally with **salted SHA-256** (Web Crypto API).
- Functions in `services/parentAuth.ts`: `createParentAuthRecord()`, `verifyParentCredentials()`.
- No backend validation; parent controls device-local access only.

---

## 🧪 Testing Strategy

### Unit Tests (`components/__tests__/`, `services/__tests__/`)
- Use Jest + React Testing Library.
- Mock Gemini calls (don't call real API in tests).
- Example: `persistence.test.ts` tests localStorage read/write with profile normalization.
- Example: `Results.test.tsx` tests result screen rendering with dynamic child name.

### TypeScript Configs
- **App code:** `tsconfig.json` (strict mode)
- **Tests:** `tsconfig.test.json` (includes Jest types, references test files only)
- Run separately: `npm run typecheck` vs `npm run typecheck:tests`

### E2E Tests (`e2e/*.spec.ts`)
- Playwright (Chromium + Firefox).
- Run locally: `npm run test:e2e` (starts dev server on port 4173).
- Run against production: `npm run test:e2e:prod` (uses `https://mathe-heldin-app.netlify.app`).
- **Critical:** E2E tests handle privacy gate (click "Verstanden & weiter" if modal appears).

### Build & Validation
```bash
npm run typecheck        # App code only
npm run typecheck:tests  # Test code only
npm test                 # All Jest suites
npm run build            # Vite build (validates bundles)
npm run test:e2e         # Local E2E (starts dev server)
```

---

## 📝 Key Files & Responsibilities

| File/Folder | Purpose |
|-------------|---------|
| `App.tsx` | Main state machine; orchestrates flows; saves progress events |
| `components/Home.tsx` | Landing page; level/mode selection; footer (privacy/parent/contact links) |
| `components/LearningSession.tsx` | Quiz/problem UI; handles user answers |
| `components/ExamSession.tsx` | Exam mode (timer, no hints) |
| `components/Results.tsx` | Score recap; next-level unlock logic |
| `components/ParentArea.tsx` | Parent login/setup/dashboard |
| `components/PrivacyPolicy.tsx` | First-run privacy gate; transparent disclosure |
| `services/geminiService.ts` | Client-side wrapper (calls Netlify function) |
| `netlify/functions/gemini.ts` | Server-side Gemini handler; schema validation; multi-language support |
| `services/offlineProblems.ts` | 100-problem seed bank; offline fallback; caching logic |
| `services/persistence.ts` | localStorage read/write helpers; profile/history/progress keys |
| `services/parentAuth.ts` | Salted SHA-256 hashing; credential validation |
| `memory-bank/` | Project docs: `projectbrief.md`, `handoff.md`, `activeContext.md`, `progress.md` |

---

## 🛠️ Developer Workflows

### Adding a New Feature
1. Define new `AppState` enum variant (if new screen) in `types.ts`.
2. Create new component in `components/` (follow naming: `ComponentName.tsx`).
3. Import & wire into `App.tsx` state routing.
4. Add localStorage keys to `services/persistence.ts` (if persisting data).
5. Write unit tests in `components/__tests__/YourComponent.test.tsx`.
6. Run `npm test` + `npm run typecheck` locally.
7. Update `memory-bank/activeContext.md` before committing.

### Modifying Gemini Prompts
1. Edit prompt in `netlify/functions/gemini.ts` (one of: `analyzeAndLevelUp`, `generateLevelProblems`, etc.).
2. Update response schema if fields change.
3. Redeploy Netlify: `netlify deploy --prod` (requires `GEMINI_API_KEY` env var set).
4. Test locally with `npm run dev` (if you have `.env.local` with `GEMINI_API_KEY`).

### Offline Bank Maintenance
- Seed bank defined in `services/offlineProblems.ts`, ~100 problems covering Leicht/Mittel/Schwer.
- Update `generateBankProblems()` to add more problems or change difficulty distribution.
- Problems tagged with `offlineLevel` (DifficultyLevel enum) for fallback selection.

---

## 🚀 Deployment & CI/CD

### Netlify Environment Variables
- `GEMINI_API_KEY` – Must be set in Netlify dashboard (Settings → Environment).
- Accessed server-side in `netlify/functions/gemini.ts` as `process.env.GEMINI_API_KEY`.

### Git Workflow
- **Branch:** `main` (only branch; no dev/staging separation yet).
- **Remote:** `https://github.com/DiggAiHH/Tuka` (after initial setup).
- **Commits:** Use conventional style (e.g., `chore:`, `feat:`, `fix:`).

### Build Process
- Vite bundles React + TypeScript → `dist/` folder.
- Netlify detects `netlify.toml` → runs `npm run build` → publishes `dist/`.
- Functions in `netlify/functions/` are auto-deployed.

---

## 🎓 German Language & Educational Tone

- **UI language:** German (de) is primary; English (en) optional second language.
- **Child-friendly:** Emojis, encouraging feedback, no jargon.
- **Math accuracy:** Gemini prompts require correct solutions; validate step-by-step reasoning.
- **Parent guidance:** Recommendations based on accuracy (e.g., "70% → practice more"; ">90% → next level").

---

## 🔍 Memory Bank (Critical for Agent Continuity)

**Always read these files before and after work:**
- `memory-bank/projectbrief.md` – Project goals, features, constraints.
- `memory-bank/activeContext.md` – Current focus, recent changes, open questions.
- `memory-bank/progress.md` – Milestones completed & pending.
- `memory-bank/handoff.md` – Last commit, deployment status, environment setup.

**Update them after implementing changes** (especially `activeContext.md` and `progress.md`).

---

## ⚡ Common Pitfalls & Best Practices

| Issue | Solution |
|-------|----------|
| Test fails for missing profile | Mock `loadProfile()` to return default gender in test setup |
| Gemini response has mixed languages in `de` field | Validate schema & prompt; regenerate if needed |
| Offline bank doesn't load | Check `services/offlineProblems.ts` exports & `getOfflineProblems()` call in `App.tsx` |
| E2E fails on privacy modal | Add gate-check in test: `if (await accept.count()) await accept.click()` |
| `GEMINI_API_KEY` undefined in function | Redeploy to Netlify; env vars require re-deploy (not just git push) |
| Hardcoded "Tukas" in AI prompts | Use `getChildName()` helper from `netlify/functions/gemini.ts` |

---

## 📞 Contact & Attribution

- **App Name:** Tukas Mathe-Welt
- **Made with ❤️ by Dad**
- **DiggAi 2026**
- **Contact:** [Email link in footer](mailto:laith.alshdaifat@hotmail.com)
- **Privacy:** First-run gate + transparent Gemini disclosure

---

**Last Updated:** 01. Februar 2026  
**Agent Audience:** AI coding agents (Copilot, Claude, etc.) working on this codebase.
