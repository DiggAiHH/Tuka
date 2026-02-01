
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem, DifficultyLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const problemSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      question: { type: Type.STRING },
      answer: { 
        type: Type.STRING,
        description: "Das Ergebnis. NUR die Zahl (z.B. '42') oder NUR der Buchstabe bei Multiple-Choice (z.B. 'C')."
      },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "Genau 5 Optionen für Känguru-Aufgaben. Sonst weglassen."
      },
      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      explanation: { type: Type.STRING },
      hints: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["id", "question", "answer", "steps", "explanation", "hints"]
  }
};

export async function analyzeAndLevelUp(base64Image: string): Promise<{ topic: string, initialProblems: MathProblem[] }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `Du bist ein freundlicher Mathe-Coach für Tuka (ein 8-jähriges Mädchen in der 3. Klasse).
          Analysiere diese Hausaufgaben und erstelle 3 passende Übungsaufgaben.
          Sprich sie motivierend an (z.B. 'Mathe-Heldin', 'Meisterin').
          WICHTIG: Die Lösung ('answer') darf NUR die Zahl sein, kein Text!
          Antworte im JSON Format mit 'topic' und 'initialProblems'.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          initialProblems: problemSchema
        },
        required: ["topic", "initialProblems"]
      }
    }
  });
  const data = JSON.parse(response.text);
  return { topic: data.topic, initialProblems: data.initialProblems };
}

export async function generateLevelProblems(topic: string, level: DifficultyLevel): Promise<MathProblem[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Erstelle 5 Mathe-Aufgaben für Tuka (ein Mädchen, 3. Klasse). Thema: ${topic}. Niveau: ${level}.
    Erkläre die Schritte so, dass ein 8-jähriges Mädchen sie versteht. Benutze motivierende Sprache für eine kleine Mathe-Heldin.
    WICHTIG: Erstelle Aufgaben, bei denen die Antwort IMMER nur eine Zahl ist. Keine Sätze in 'answer'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: problemSchema
    }
  });

  return JSON.parse(response.text);
}

export async function generateKangarooProblems(): Promise<MathProblem[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Suche nach originalen Aufgaben vom 'Känguru der Mathematik' Wettbewerb (Klasse 3/4) aus den Jahren 2021-2024.
    Erstelle 5 Übungsaufgaben für Tuka (8 Jahre alt).
    Jede Aufgabe MUSS Multiple-Choice sein mit 5 Optionen.
    WICHTIG: Das Feld 'answer' darf NUR der Buchstabe (A-E) sein.
    Erkläre Tuka (dem Mädchen) den Lösungsweg in einfachen Schritten.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: problemSchema
    }
  });

  return JSON.parse(response.text);
}
