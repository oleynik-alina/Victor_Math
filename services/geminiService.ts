import { GoogleGenAI } from "@google/genai";

// Helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const analyzeMathProblem = async (
  taskImage: File,
  workImage: File,
  userQuery: string,
  history: string[] = []
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-pro-preview for superior reasoning on handwriting and math
    const modelId = 'gemini-3-pro-preview';

    const taskPart = await fileToGenerativePart(taskImage);
    const workPart = await fileToGenerativePart(workImage);

    const systemPrompt = `
      You are an expert math tutor for a 13-year-old student named Vitya.
      
      CONTEXT:
      1. The first image is a sheet of math olympiad/advanced problems.
      2. The second image is Vitya's handwritten solutions for problems 1, 2, and 4.
      3. Vitya solves these inequalities using a specific "estimation" method: he manipulates the denominator to make it smaller (thereby making the fraction larger) to prove the inequality sums to 1. 
      
      YOUR GOAL:
      Vitya is stuck on Problem 3. 
      Do NOT give him the answer directly.
      Analyze his handwriting in the second image to confirm his style.
      Then, provide a HINT for Problem 3 that aligns with HIS thinking style.
      
      MATH HINT LOGIC FOR PROBLEM 3:
      Problem 3 is: x/(x^4+y^2) + y/(x^2+y^4) <= 1/xy.
      The method Vitya likes involves simplifying the denominator.
      Hint him to use the inequality (a^2 + b^2 >= 2ab) on the denominator (x^4 + y^2).
      
      OUTPUT FORMATTING RULES:
      - Speak in Russian.
      - Be encouraging and friendly.
      - Keep the response concise.
      - IMPORTANT: Use LaTeX for ALL math formulas.
      - Use single dollar signs for inline math (e.g., $x^2 + y^2$).
      - Use double dollar signs for block math (e.g., $$ \frac{a}{b} $$).
      - Do NOT use \\( \\) or \\[ \\].
    `;

    const contents = {
      parts: [
        taskPart,
        workPart,
        { text: systemPrompt },
        { text: `Current Conversation History:\n${history.join('\n')}` },
        { text: `User Question: ${userQuery}` }
      ]
    };

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        thinkingConfig: { thinkingBudget: 2048 } // Enable thinking for better math reasoning
      }
    });

    return response.text || "Извини, я не смог разобрать задачу. Попробуй еще раз.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка при обращении к учителю. Проверьте API ключ.";
  }
};