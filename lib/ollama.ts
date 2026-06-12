export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaTagsResponse {
  models: OllamaModel[];
}

/**
 * Dynamically resolves the best available Ollama model to use.
 * 1. Checks if the requested model (or its variant) is installed.
 * 2. Falls back to process.env.OLLAMA_MODEL if configured.
 * 3. Falls back to any coding-related model installed.
 * 4. Falls back to the first available model in Ollama.
 * 5. Defaults to the requested model or "codellama:latest" if Ollama is unreachable.
 */
export async function getOllamaModel(requestedModel?: string): Promise<string> {
  const defaultModel = requestedModel || process.env.OLLAMA_MODEL || "codellama:latest";

  try {
    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      method: "GET",
      // Set a short timeout so we don't hang the API response if Ollama is not running
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      console.warn(`Ollama tags API returned status: ${response.status}. Using default model: ${defaultModel}`);
      return defaultModel;
    }

    const data = (await response.json()) as OllamaTagsResponse;
    const models = data.models || [];

    if (models.length === 0) {
      console.warn("Ollama is running but no models are installed.");
      return defaultModel;
    }

    const installedModelNames = models.map((m) => m.name);

    // Helper to normalize model names for comparison (e.g. codellama vs codellama:latest)
    const normalize = (name: string) => name.toLowerCase().replace(/:latest$/, "");

    // 1. Check if the exact requested model is installed
    if (requestedModel) {
      const match = installedModelNames.find(
        (name) => normalize(name) === normalize(requestedModel)
      );
      if (match) return match;
    }

    // 2. Check if a model matching process.env.OLLAMA_MODEL is installed
    if (process.env.OLLAMA_MODEL) {
      const envModel = process.env.OLLAMA_MODEL;
      const match = installedModelNames.find(
        (name) => normalize(name) === normalize(envModel)
      );
      if (match) return match;
    }

    // 3. Check if any variation of the requested model is installed (e.g., prefix match)
    if (requestedModel) {
      const baseName = normalize(requestedModel).split(":")[0];
      const match = installedModelNames.find((name) =>
        normalize(name).startsWith(baseName)
      );
      if (match) return match;
    }

    // 4. Look for common coding models in the installed list
    const codingKeywords = ["coder", "code", "deepseek", "qwen", "llama"];
    for (const keyword of codingKeywords) {
      const match = installedModelNames.find((name) =>
        normalize(name).includes(keyword)
      );
      if (match) {
        console.info(`Default model not found. Automatically selected coding model: ${match}`);
        return match;
      }
    }

    // 5. Fallback to the first available model
    const fallbackModel = installedModelNames[0];
    console.info(`No preferred model found. Falling back to first available Ollama model: ${fallbackModel}`);
    return fallbackModel;

  } catch (error) {
    console.error("Could not connect to Ollama service to fetch models. Using default:", defaultModel, error);
    return defaultModel;
  }
}
