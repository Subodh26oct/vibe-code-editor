import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      // Short timeout in case Ollama is not running
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      const data = await response.json();
      const models = data.models || [];
      if (models.length > 0) {
        return NextResponse.json({
          models: models.map((m: any) => m.name),
        });
      }
    }
  } catch (error) {
    console.warn("Could not connect to Ollama to list models, using fallback.");
  }

  // Fallback coding models
  return NextResponse.json({
    models: ["codellama", "qwen2.5-coder", "deepseek-coder", "llama3"],
  });
}
