import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap",
  {
    variants: {
      tone: {
        primary: "border-primary/35 bg-primary/12 text-primary",
        info: "border-accent/35 bg-accent/12 text-accent",
        warning: "border-warning/35 bg-warning/12 text-warning",
        destructive: "border-destructive/40 bg-destructive/12 text-destructive",
        neutral: "border-border-strong/60 bg-muted/60 text-muted-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type Tone = NonNullable<VariantProps<typeof badge>["tone"]>;

export function StatusBadge({
  children,
  tone,
  className,
  dot = true,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span className={cn(badge({ tone }), className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function toneForStatus(status: string): Tone {
  switch (status) {
    case "Active":
    case "Integrity Verified":
    case "Analyzed":
    case "Blockchain Record Verified":
      return "primary";
    case "Under Review":
    case "Pending Analysis":
      return "info";
    case "Requires Verification":
      return "warning";
    case "Integrity Mismatch":
      return "destructive";
    default:
      return "neutral";
  }
}
