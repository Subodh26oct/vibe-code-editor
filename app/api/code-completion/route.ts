import { NextRequest, NextResponse } from "next/server";
import { CompletionCopilot, type CompletionRequestBody } from "monacopilot";
import { getOllamaModel } from "@/lib/ollama";

const copilot = new CompletionCopilot(undefined, {
  model: async (prompt) => {
    // 1. Fetch best available Ollama model
    const model = await getOllamaModel("codellama:latest");

    // 2. Construct an advanced system prompt for Fill-in-the-Middle (FIM) or inline suggestions.
    const systemPrompt = `You are a high-performance, context-aware AI code completion assistant.
Your goal is to provide the exact code completion to be inserted at the cursor position.

CRITICAL RULES:
1. Output ONLY the raw code to be inserted. Do NOT wrap the code in markdown code blocks (e.g. no \`\`\`), do NOT explain the code, and do NOT write any natural language comments or greetings.
2. Maintain the indentation, style, and syntax of the surrounding code exactly.
3. If no suggestion is contextually relevant, output absolutely nothing.
4. Keep completions focused: write only the current statement, expression, or block. Do not write entire files.

Context metadata:
${prompt.context}

Instruction:
${prompt.instruction}

Full file contents:
${prompt.fileContent}

Remember: Output only the code snippet to be inserted at the cursor.`;

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt: systemPrompt,
          stream: false,
          options: {
            temperature: 0.1,  // Very low temperature for high determinism and exact syntax matching
            num_predict: 128,  // Keep inline suggestions short and fast
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      let suggestion = data.response || "";

      // Clean up markdown blocks if the model ignored instructions
      if (suggestion.includes("```")) {
        const codeMatch = suggestion.match(/```[\w]*\n?([\s\S]*?)```/);
        suggestion = codeMatch ? codeMatch[1].trim() : suggestion;
      }

      return { text: suggestion };
    } catch (error) {
      console.error("Monacopilot Ollama model error:", error);
      return { text: null };
    }
  },
});

export async function POST(req: NextRequest) {
  try {
    const body: CompletionRequestBody = await req.json();
    const completion = await copilot.complete({ body });
    return NextResponse.json(completion, { status: 200 });
  } catch (error: any) {
    console.error("Code completion API error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
