import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { entities, entityCategories } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/ai-analysis")({
  head: () => ({
    meta: [
      { title: "AI Evidence Analysis — PATCH X" },
      {
        name: "description",
        content:
          "AI-assisted extraction of people, organizations, locations, timestamps and identifiers from digital evidence.",
      },
      { property: "og:title", content: "AI Evidence Analysis — PATCH X" },
      { property: "og:description", content: "Entity extraction and summaries across collected evidence." },
    ],
  }),
  component: AiAnalysis,
});

function AiAnalysis() {
  const [category, setCategory] = useState<string>("All");
  const filtered = category === "All" ? entities : entities.filter((e) => e.category === category);

  return (
    <>
      <PageHeader
        title="AI Evidence Analysis"
        subtitle="Extracted entities and AI-generated summaries. All findings require human verification."
        actions={<StatusBadge tone="info">Assistive output — not conclusive</StatusBadge>}
      />

      <Panel title="Case Summary" description="Generated from analyzed evidence" className="mb-6">
        <div className="flex gap-3">
          <BrainCircuit className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Multiple evidence sources reference the same individual and device within a narrow time window.
            Communication records, authentication logs and transaction exports share overlapping identifiers.
            Two potential contradictions were flagged in the timeline and require investigator verification.
          </p>
        </div>
      </Panel>

      <div className="mb-5 flex flex-wrap gap-2">
        {["All", ...entityCategories].map((c) => (
          <Button
            key={c}
            size="sm"
            variant={c === category ? "default" : "outline"}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e) => (
          <div key={e.category + e.value} className="glass rounded-xl p-4">
            <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{e.category}</div>
            <div className="mt-1 text-sm font-medium break-words">{e.value}</div>
            <div className="mt-3 h-1.5 rounded-full bg-muted">
              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${e.confidence}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Confidence {e.confidence}%</span>
              <span className="font-mono text-accent">{e.evidence.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
