import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { contradictions } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/contradictions")({
  head: () => ({
    meta: [
      { title: "Contradiction Detection — PATCH X" },
      {
        name: "description",
        content:
          "Review potential inconsistencies detected between independent digital evidence sources before human verification.",
      },
      { property: "og:title", content: "Contradiction Detection — PATCH X" },
      { property: "og:description", content: "Potential inconsistencies flagged for investigator review." },
    ],
  }),
  component: Contradictions,
});

function Contradictions() {
  return (
    <>
      <PageHeader
        title="Contradiction Detection"
        subtitle="Potential inconsistencies across evidence sources. Findings are assistive and require verification."
        actions={<StatusBadge tone="warning">{contradictions.length} flagged</StatusBadge>}
      />

      <div className="space-y-5">
        {contradictions.map((c) => (
          <Panel
            key={c.id}
            title={c.type}
            description={`${c.id} · ${c.caseId} · detected ${c.detectedAt}`}
            actions={
              <>
                <StatusBadge tone="warning">{c.confidence}% confidence</StatusBadge>
                <StatusBadge tone={c.reviewed ? "primary" : "neutral"}>
                  {c.reviewed ? "Reviewed" : "Pending Review"}
                </StatusBadge>
              </>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[c.a, c.b].map((side, i) => (
                <div key={i} className="rounded-lg border border-border/70 bg-surface/60 p-4">
                  <div className="flex items-center justify-between text-[11px] tracking-wider uppercase">
                    <span className="text-muted-foreground">{side.label}</span>
                    <span className="font-mono text-accent">{side.evidenceId}</span>
                  </div>
                  <p className="mt-2 text-sm">{side.statement}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-3 rounded-lg border border-warning/35 bg-warning/8 p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <p className="text-xs text-muted-foreground">{c.explanation}</p>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
