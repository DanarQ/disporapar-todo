import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Loader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}
