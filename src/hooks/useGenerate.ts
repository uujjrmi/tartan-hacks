import { useState, useCallback } from "react";
import type { GenerateResponse } from "@/lib/types";
import { generate } from "@/lib/api";

export function useGenerate() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const run = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generate({ prompt });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, result, run };
}
