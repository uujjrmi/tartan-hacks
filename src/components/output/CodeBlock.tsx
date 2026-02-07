import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { ShikiHighlighter } from "react-shiki";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "csharp" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="group relative">
      <Button
        variant="ghost"
        size="icon-xs"
        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 z-10 bg-background/80 backdrop-blur-sm"
        onClick={handleCopy}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="size-3 text-emerald-500" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
      <ShikiHighlighter
        language={language}
        theme={{ light: "github-light", dark: "github-dark" }}
        showLanguage={false}
        className="rounded-lg border text-sm [&_pre]:!p-4"
      >
        {code}
      </ShikiHighlighter>
    </div>
  );
}
