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
      question_second_lang: { type: Type.STRING },
      answer: {
        type: Type.STRING,
        description: "Das Ergebnis. NUR die Zahl (z.B. '42') oder NUR der Buchstabe bei Multiple-Choice (z.B. 'C')."
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Genau 5 Optionen für Känguru-Aufgaben. Sonst weglassen."
      },
      options_second_lang: { type: Type.ARRAY, items: { type: Type.STRING } },
      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
      steps_blocks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } },
          required: ["de", "second_lang"]
        }
      },
      explanation: { type: Type.STRING },
      explanation_blocks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            de: { type: Type.STRING },
            second_lang: { type: Type.STRING }
          },
          required: ["de", "second_lang"]
        }
      },
      hints: { type: Type.ARRAY, items: { type: Type.STRING } },
      hints_blocks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } },
          required: ["de", "second_lang"]
        }
      },
      feedback_correct: {
        type: Type.OBJECT,
        properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } },
        required: ["de", "second_lang"]
      },
      feedback_incorrect: {
        type: Type.OBJECT,
        properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } },
        required: ["de", "second_lang"]
      }
    },
    required: ["id", "question", "answer", "steps", "explanation", "hints"]
  }
};

// Helper to calculate age
function calculateAge(birthday: string): number {
  if (!birthday) return 8; // Default
  const birthDate = new Date(birthday);
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export async function analyzeAndLevelUp(base64Image: string, profile: any): Promise<{ topic: string, initialProblems: MathProblem[] }> {
  const age = calculateAge(profile?.birthday);
  const name = profile?.name || 'Mathe-Heldin';
  const lang = profile?.language;

  let systemPrompt = `Du bist ein freundlicher Mathe-Coach für ${name} (${age} Jahre alt).
          Analysiere diese Hausaufgaben und erstelle 3 passende Übungsaufgaben.
          Sprich sie motivierend an.
          Antwort 'answer' nur Zahl/Buchstabe.
          'explanation' auf Deutsch.`;

  if (lang) {
    systemPrompt += `\n--- ZWEISPRACHIGKEIT MODUS ---
    Du erstellst Aufgaben für ein Kind, das Deusch und ${lang} spricht.
    Fülle ALLE bilingualen Felder aus:
    1. 'question_second_lang': Die Frage auf ${lang}.
    2. 'steps_blocks': Array von Objekten. Jedes Objekt MUSS 'de' (Deutsch) und 'second_lang' (${lang}) haben.
    3. 'hints_blocks': Array von Objekten ({de, second_lang}).
    4. 'explanation_blocks': Array von Objekten ({de, second_lang}).
    5. 'feedback_correct': Lob ({de, second_lang}).
    6. 'feedback_incorrect': Aufmunterung ({de, second_lang}).

    WICHTIG:
    - Der Text in 'de' MUSS DEUTSCH sein.
    - Der Text in 'second_lang' MUSS ${lang} sein.
    - Vermische die Sprachen NICHT.`;
  }

  systemPrompt += `\nAntworte im JSON Format mit 'topic' und 'initialProblems'.`;

  const dynamicSchema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING },
      initialProblems: JSON.parse(JSON.stringify(problemSchema)) // clone
    },
    required: ["topic", "initialProblems"]
  };

  if (lang) {
    dynamicSchema.properties.initialProblems.items.required.push("question_second_lang", "steps_blocks", "explanation_blocks", "hints_blocks", "feedback_correct", "feedback_incorrect");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash', // Upgraded model for better bilingual support
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: systemPrompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: dynamicSchema
    }
  });
  const data = JSON.parse(response.text);
  return { topic: data.topic, initialProblems: data.initialProblems };
}

export async function generateLevelProblems(topic: string, level: DifficultyLevel, profile: any): Promise<MathProblem[]> {
  const age = calculateAge(profile?.birthday);
  const name = profile?.name || 'Mathe-Heldin';
  const lang = profile?.language;

  let prompt = `Erstelle 5 Mathe-Aufgaben für ${name} (${age} Jahre alt). Thema: ${topic}. Niveau: ${level}.
    Erkläre die Schritte so, dass ein ${age}-jähriges Kind sie versteht.
    Antwort 'answer' nur Zahl.
    'explanation' auf Deutsch.`;

  if (lang) {
    prompt += `\n--- ZWEISPRACHIGKEIT MODUS ---
    Du erstellst Aufgaben für ein Kind, das Deusch und ${lang} spricht.
    Fülle ALLE bilingualen Felder aus:
    1. 'question_second_lang': Die Frage auf ${lang}.
    2. 'steps_blocks': Array von Objekten. Jedes Objekt MUSS 'de' (Deutsch) und 'second_lang' (${lang}) haben.
    3. 'hints_blocks': Array von Objekten ({de, second_lang}).
    4. 'explanation_blocks': Array von Objekten ({de, second_lang}).
    5. 'feedback_correct': Lob ({de, second_lang}).
    6. 'feedback_incorrect': Aufmunterung ({de, second_lang}).

    WICHTIG:
    - Der Text in 'de' MUSS DEUTSCH sein. (Auch bei Rechenwegen!)
    - Der Text in 'second_lang' MUSS ${lang} sein.
    - Vermische die Sprachen NICHT.
    - FÜR 'steps_blocks': Schreibe den DE Schritt auf DEUTSCH (z.B. "Addiere 5 und 5"). Schreibe NICHT Türkisch/Englisch in das 'de' Feld!`;
  }

  // Clone and patch schema to require bilingual fields if lang is present
  const schema = JSON.parse(JSON.stringify(problemSchema));
  if (lang) {
    schema.items.required.push("question_second_lang", "steps_blocks", "explanation_blocks", "hints_blocks", "feedback_correct", "feedback_incorrect");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  return JSON.parse(response.text);
}

export async function generateKangarooProblems(profile: any): Promise<MathProblem[]> {
  const age = calculateAge(profile?.birthday);
  const lang = profile?.language;

  let prompt = `Suche nach originalen Aufgaben vom 'Känguru der Mathematik' Wettbewerb (passend für Alter ${age}) aus den letzten Jahren.
    Erstelle 5 Übungsaufgaben.
    Jede Aufgabe MUSS EINE MULTIPLE-CHOICE frage sein.
    ERZWINGE 5 Antwortmöglichkeiten (options array). Wenn unbekannt, erfinde plausible falsche Antworten.
    Antwort 'answer' nur Buchstabe (A-E).
    'explanation' auf Deutsch.`;

  if (lang) {
    prompt += `\n--- ZWEISPRACHIGKEIT MODUS ---
    Du erstellst Aufgaben für ein Kind, das Deusch und ${lang} spricht.
    Fülle ALLE bilingualen Felder aus:
    1. 'question_second_lang': Die Frage auf ${lang}.
    2. 'options_second_lang': Array. Die Optionen auf ${lang}.
    3. 'explanation_blocks': Array ({de, second_lang}).
    4. 'feedback_correct' / 'feedback_incorrect': ({de, second_lang}).

    WICHTIG:
    - Der Text in 'de' MUSS DEUTSCH sein.
    - Der Text in 'second_lang' MUSS ${lang} sein.`;
  }

  // Clone schema
  const schema = {
    type: Type.OBJECT,
    properties: {
      problems: { type: Type.ARRAY, items: JSON.parse(JSON.stringify(problemSchema.items)) }
    }
  };

  if (lang) {
    schema.properties.problems.items.required.push("question_second_lang", "options_second_lang", "explanation_blocks", "feedback_correct");
  }


  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: 'application/json',
      responseSchema: schema
    }
  });

  const data = JSON.parse(response.text);
  return data.problems;
}

export async function translateProblem(problem: any, lang: string): Promise<any> {
  if (!ai) return problem;

  const translateSchema = {
    type: Type.OBJECT,
    properties: {
      question_second_lang: { type: Type.STRING },
      steps_blocks: {
        type: Type.ARRAY,
        items: { type: Type.OBJECT, properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } }, required: ["de", "second_lang"] }
      },
      explanation_blocks: {
        type: Type.ARRAY,
        items: { type: Type.OBJECT, properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } }, required: ["de", "second_lang"] }
      },
      hints_blocks: {
        type: Type.ARRAY,
        items: { type: Type.OBJECT, properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } }, required: ["de", "second_lang"] }
      },
      feedback_correct: {
        type: Type.OBJECT, properties: { de: { type: Type.STRING }, second_lang: { type: Type.STRING } }, required: ["de", "second_lang"]
      }
    },
    required: ["question_second_lang", "steps_blocks", "explanation_blocks"]
  };

  const prompt = `
    Ich habe eine Mathe-Aufgabe:
    Frage: "${problem.question}"
    Erklärung: "${problem.explanation}"
    Schritte: ${JSON.stringify(problem.steps)}
    Hinweise: ${JSON.stringify(problem.hints)}

    Übersetze ALLES strukturiert für die Sprache: ${lang}.
    Erstelle:
    1. 'question_second_lang': Frage auf ${lang}.
    2. 'steps_blocks': Schritte auf Deutsch UND ${lang}.
    3. 'explanation_blocks': Erklärung auf Deutsch UND ${lang}.
    4. 'hints_blocks': Hinweise auf Deutsch UND ${lang}.
    5. 'feedback_correct': kurzes Lob auf Deutsch UND ${lang}.

    Antworte NUR mit dem JSON Objekt.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: translateSchema
      }
    });

    const partialData = JSON.parse(response.text);
    return { ...problem, ...partialData };
  } catch (e) {
    console.error("Translation failed", e);
    return problem;
  }
}
