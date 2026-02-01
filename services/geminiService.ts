import { MathProblem, DifficultyLevel } from "../types";

async function callGemini<T>(action: string, payload: Record<string, any>): Promise<T> {
  const res = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, ...payload })
  });

  if (!res.ok) {
    throw new Error(`Gemini function failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function analyzeAndLevelUp(base64Image: string, profile: any): Promise<{ topic: string, initialProblems: MathProblem[] }> {
  return await callGemini<{ topic: string; initialProblems: MathProblem[] }>('analyzeAndLevelUp', { base64Image, profile });
}

export async function generateLevelProblems(topic: string, level: DifficultyLevel, profile: any): Promise<MathProblem[]> {
  return await callGemini<MathProblem[]>('generateLevelProblems', { topic, level, profile });
}

export async function generateKangarooProblems(profile: any): Promise<MathProblem[]> {
  return await callGemini<MathProblem[]>('generateKangarooProblems', { profile });
}

export async function translateProblem(problem: any, lang: string): Promise<any> {
  try {
    return await callGemini<any>('translateProblem', { problem, lang });
  } catch (e) {
    console.error('Translation failed', e);
    return problem;
  }
}
