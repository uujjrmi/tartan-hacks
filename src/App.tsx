import { Toaster, toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { PromptInput } from "@/components/prompt/PromptInput";
import { OutputPanel } from "@/components/output/OutputPanel";
import { useGenerate } from "@/hooks/useGenerate";
import { useEffect } from "react";

export default function App() {
  const { isLoading, error, result, run } = useGenerate();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
        <PromptInput onGenerate={run} isLoading={isLoading} />
        <OutputPanel result={result} isLoading={isLoading} />
      </main>
      <Toaster richColors />
    </div>
  );
}
