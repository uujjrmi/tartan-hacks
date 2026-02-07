import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { examplePrompts } from "@/lib/examples";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onGenerate, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    const trimmed = prompt.trim();
    if (trimmed) onGenerate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium" htmlFor="prompt-input">
        Describe the program you want to formally verify:
      </label>
      <Textarea
        id="prompt-input"
        placeholder="e.g. Write a method that finds the maximum element of a non-empty integer array"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        className="resize-none"
      />
      <div className="flex flex-wrap gap-2">
        {examplePrompts.map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => setPrompt(example.prompt)}
            className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {example.label}
          </button>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={!prompt.trim() || isLoading}>
        {isLoading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Generating...
          </>
        ) : (
          <>
            <Play className="size-4" />
            Generate
          </>
        )}
      </Button>
    </div>
  );
}
