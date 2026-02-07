import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "./CodeBlock";
import { VerificationBadge } from "./VerificationBadge";
import { LoadingSkeleton } from "./LoadingSkeleton";
import type { GenerateResponse } from "@/lib/types";

interface OutputPanelProps {
  result: GenerateResponse | null;
  isLoading: boolean;
}

export function OutputPanel({ result, isLoading }: OutputPanelProps) {
  if (isLoading) {
    return (
      <div className="animate-fade-in space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="animate-fade-in space-y-4">
      <Tabs defaultValue="specification">
        <TabsList>
          <TabsTrigger value="specification">Specification</TabsTrigger>
          <TabsTrigger value="implementation">Verified Code</TabsTrigger>
        </TabsList>
        <TabsContent value="specification" className="mt-3">
          <CodeBlock code={result.specification} />
        </TabsContent>
        <TabsContent value="implementation" className="mt-3">
          <CodeBlock code={result.implementation} />
        </TabsContent>
      </Tabs>
      <VerificationBadge
        verified={result.verified}
        message={result.verificationMessage}
      />
    </div>
  );
}
