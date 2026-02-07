import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerificationBadgeProps {
  verified: boolean;
  message?: string;
}

export function VerificationBadge({ verified, message }: VerificationBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={verified ? "default" : "destructive"}
        className={
          verified
            ? "bg-emerald-600 hover:bg-emerald-600 text-white"
            : ""
        }
      >
        {verified ? (
          <CheckCircle className="mr-1 size-3" />
        ) : (
          <XCircle className="mr-1 size-3" />
        )}
        {verified ? "Verified" : "Verification Failed"}
      </Badge>
      {message && (
        <span className="text-sm text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
