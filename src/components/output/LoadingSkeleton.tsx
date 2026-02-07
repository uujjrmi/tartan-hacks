import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  );
}
