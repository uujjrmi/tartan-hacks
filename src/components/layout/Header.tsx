import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">TrueThat</h1>
          <p className="text-sm text-muted-foreground">
            Formally verified code from natural language
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
