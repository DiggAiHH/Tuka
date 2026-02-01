import { DifficultyLevel, MathProblem } from '../types';
import { loadOfflineBank, saveOfflineBank, type OfflineProblemBank } from './persistence';

type OfflineTaggedProblem = MathProblem & { offlineLevel: DifficultyLevel };

function makeAddSub(a: number, b: number, op: '+' | '-'): { question: string; answer: number } {
  if (op === '+') return { question: `${a} + ${b} = ?`, answer: a + b };
  return { question: `${a} - ${b} = ?`, answer: a - b };
}

function makeMul(a: number, b: number): { question: string; answer: number } {
  return { question: `${a} × ${b} = ?`, answer: a * b };
}

function makeDiv(a: number, b: number): { question: string; answer: number } {
  // a divisible by b
  return { question: `${a} ÷ ${b} = ?`, answer: a / b };
}

function buildProblem(id: string, question: string, answer: number, steps: string[], hints: string[], explanation: string): MathProblem {
  return {
    id,
    question,
    answer: String(answer),
    steps,
    explanation,
    hints
  };
}

function generateBankProblems(): OfflineTaggedProblem[] {
  const problems: OfflineTaggedProblem[] = [];
  let i = 1;

  // LEICHT: kleine Plus/Minus im Zahlenraum bis 20
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 2; b++) {
      const { question, answer } = makeAddSub(a, b, '+');
      problems.push({
        ...buildProblem(
          `offline-leicht-${i++}`,
          question,
          answer,
          [`Zähle ${a} und ${b} zusammen.`, `Das Ergebnis ist ${answer}.`],
          ['Du kannst mit den Fingern zählen.', 'Erst ${a}, dann noch ${b} dazu.'],
          `Wenn du ${a} und ${b} zusammenzählst, bekommst du ${answer}.`
        ),
        offlineLevel: DifficultyLevel.LEICHT
      });
    }
  }
  for (let a = 10; a <= 20; a++) {
    const b = 1 + (a % 5);
    const { question, answer } = makeAddSub(a, b, '-');
    problems.push({
      ...buildProblem(
        `offline-leicht-${i++}`,
        question,
        answer,
        [`Starte bei ${a}.`, `Zähle ${b} rückwärts.`, `Du kommst bei ${answer} an.`],
        ['Rückwärts zählen hilft.', 'Du kannst kleine Schritte machen.'],
        `Von ${a} ${b} wegnehmen ergibt ${answer}.`
      ),
      offlineLevel: DifficultyLevel.LEICHT
    });
  }

  // MITTEL: Plus/Minus bis 100, einfache 1x1 Aufgaben
  for (let a = 12; a <= 30; a += 3) {
    const b = 17;
    const { question, answer } = makeAddSub(a, b, '+');
    problems.push({
      ...buildProblem(
        `offline-mittel-${i++}`,
        question,
        answer,
        [`Rechne erst ${a} + 10 = ${a + 10}.`, `Dann +7 = ${answer}.`],
        ['Zerlege 17 in 10 und 7.', 'Rechne in zwei Schritten.'],
        `${a} + 17 = ${answer} (10 dazu, dann 7 dazu).`
      ),
      offlineLevel: DifficultyLevel.MITTEL
    });
  }
  for (let a = 40; a <= 80; a += 5) {
    const b = 18;
    const { question, answer } = makeAddSub(a, b, '-');
    problems.push({
      ...buildProblem(
        `offline-mittel-${i++}`,
        question,
        answer,
        [`Ziehe zuerst 10 ab: ${a} - 10 = ${a - 10}.`, `Ziehe dann 8 ab: ${answer}.`],
        ['Zerlege 18 in 10 und 8.', 'Mach es Schritt für Schritt.'],
        `${a} - 18 = ${answer}.`
      ),
      offlineLevel: DifficultyLevel.MITTEL
    });
  }
  for (let a = 2; a <= 10; a++) {
    const b = 3;
    const { question, answer } = makeMul(a, b);
    problems.push({
      ...buildProblem(
        `offline-mittel-${i++}`,
        question,
        answer,
        [`${a} × ${b} bedeutet: ${a} + ${a} + ${a}.`, `Das ist ${answer}.`],
        ['Denk an wiederholtes Addieren.', '3 mal die gleiche Zahl.'],
        `${a} × 3 = ${answer}.`
      ),
      offlineLevel: DifficultyLevel.MITTEL
    });
  }

  // SCHWER: 1x1 / Division / gemischt
  for (let a = 6; a <= 12; a++) {
    const b = 7;
    const { question, answer } = makeMul(a, b);
    problems.push({
      ...buildProblem(
        `offline-schwer-${i++}`,
        question,
        answer,
        [`Merke dir: 7×${a} = ${answer}.`],
        ['Nutze bekannte Reihen (z.B. 7×10) und rechne weiter.', 'Du kannst auch 7×5 + 7×... nutzen.'],
        `${a} mal 7 ist ${answer}.`
      ),
      offlineLevel: DifficultyLevel.SCHWER
    });
  }
  for (let b = 2; b <= 6; b++) {
    const a = b * 12;
    const { question, answer } = makeDiv(a, b);
    problems.push({
      ...buildProblem(
        `offline-schwer-${i++}`,
        question,
        answer,
        [`Frage: Welche Zahl × ${b} = ${a}?`, `Das ist ${answer}.`],
        ['Division ist das Umkehren der Multiplikation.', 'Suche die passende 1x1 Aufgabe.'],
        `${a} geteilt durch ${b} ist ${answer}.`
      ),
      offlineLevel: DifficultyLevel.SCHWER
    });
  }

  // PRUEFUNG: gemischt (offline)
  const mixed: Array<{ q: string; a: number; steps: string[]; hints: string[]; exp: string }> = [
    {
      q: '25 + 37 = ?',
      a: 62,
      steps: ['25 + 30 = 55', '55 + 7 = 62'],
      hints: ['37 = 30 + 7', 'Erst die Zehner, dann die Einer.'],
      exp: 'Zuerst 30 dazu, dann 7.'
    },
    {
      q: '80 - 46 = ?',
      a: 34,
      steps: ['80 - 40 = 40', '40 - 6 = 34'],
      hints: ['46 = 40 + 6', 'In zwei Schritten abziehen.'],
      exp: 'Erst 40 abziehen, dann 6.'
    },
    {
      q: '9 × 6 = ?',
      a: 54,
      steps: ['9 × 6 = 54'],
      hints: ['6×10 = 60, dann 6 weniger.'],
      exp: '9×6 ist 54.'
    },
    {
      q: '56 ÷ 7 = ?',
      a: 8,
      steps: ['Welche Zahl × 7 = 56?', 'Das ist 8.'],
      hints: ['7×8 = 56'],
      exp: '56 geteilt durch 7 ergibt 8.'
    },
    {
      q: '(12 + 8) - 5 = ?',
      a: 15,
      steps: ['12 + 8 = 20', '20 - 5 = 15'],
      hints: ['Erst in der Klammer rechnen.', 'Dann minus 5.'],
      exp: 'Erst addieren, dann subtrahieren.'
    }
  ];

  for (const item of mixed) {
    problems.push({
      ...buildProblem(`offline-pruefung-${i++}`, item.q, item.a, item.steps, item.hints, item.exp),
      offlineLevel: DifficultyLevel.PRUEFUNG
    });
  }

  // Ensure exactly 100 by trimming or padding with easy variants.
  while (problems.length < 100) {
    const a = 1 + (problems.length % 10);
    const b = 1 + (problems.length % 3);
    const { question, answer } = makeAddSub(a, b, '+');
    problems.push({
      ...buildProblem(
        `offline-fill-${i++}`,
        question,
        answer,
        [`Zähle ${a} und ${b} zusammen.`, `Das Ergebnis ist ${answer}.`],
        ['Zähle langsam.', 'Du schaffst das!'],
        `${a} + ${b} = ${answer}.`
      ),
      offlineLevel: DifficultyLevel.LEICHT
    });
  }

  return problems.slice(0, 100);
}

export function ensureOfflineBank(): OfflineProblemBank {
  const existing = loadOfflineBank();
  if (existing && existing.version === 1 && Array.isArray(existing.problems) && existing.problems.length >= 50) {
    return existing;
  }

  const problems = generateBankProblems();
  const bank: OfflineProblemBank = {
    createdAt: new Date().toISOString(),
    version: 1,
    problems
  };
  saveOfflineBank(bank);
  return bank;
}

export function getOfflineProblems(level: DifficultyLevel, count = 5): MathProblem[] {
  const bank = ensureOfflineBank();
  const all = (bank.problems || []) as OfflineTaggedProblem[];
  const pool = all.filter((p) => p.offlineLevel === level);
  const source = pool.length > 0 ? pool : all;

  // Simple deterministic selection based on current day
  const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const start = daySeed % Math.max(1, source.length);

  const picked: MathProblem[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(source[(start + i) % source.length]);
  }
  return picked;
}

export function cacheProblemsIntoOfflineBank(problems: MathProblem[]): void {
  if (!problems || problems.length === 0) return;
  const bank = ensureOfflineBank();

  const existingIds = new Set(
    ((bank.problems || []) as any[])
      .map((p) => p?.id)
      .filter(Boolean)
  );

  const toAdd = problems.filter((p) => p?.id && !existingIds.has(p.id));
  if (toAdd.length === 0) return;

  const merged = [...toAdd, ...(bank.problems || [])];
  // Keep seeded + some cached. Cap to prevent localStorage bloat.
  const trimmed = merged.slice(0, 200);
  saveOfflineBank({ ...bank, problems: trimmed });
}
