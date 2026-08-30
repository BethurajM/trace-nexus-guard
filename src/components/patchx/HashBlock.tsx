import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function HashBlock({
  label,
  hash,
  tone = "neutral",
  className,
}: {
  label?: string;
  hash: string;
  tone?: "neutral" | "primary" | "destructive";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
    } catch {
      /* clipboard unavailable in some sandboxes */
    }
    setCopied(true);
    toast.success("SHA-256 hash copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn("rounded-lg border bg-surface/70 p-3", className)}>
      {label && (
        <div className="mb-1.5 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
          {label}
        </div>
      )}
      <div className="flex items-start gap-3">
        <code
          className={cn(
            "hash-text flex-1",
            tone === "primary" && "text-primary",
            tone === "destructive" && "text-destructive",
            tone === "neutral" && "text-foreground/85",
          )}
        >
          {hash}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy hash"
          className="rounded-md border border-border-strong/60 p-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
