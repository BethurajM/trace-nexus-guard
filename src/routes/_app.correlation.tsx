import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { correlationNodes, relationships } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/correlation")({
  head: () => ({
    meta: [
      { title: "Cross-Source Correlation — PATCH X" },
      {
        name: "description",
        content:
          "Visualize relationships between people, devices, accounts and evidence items across multiple digital sources.",
      },
      { property: "og:title", content: "Cross-Source Correlation — PATCH X" },
      { property: "og:description", content: "Relationship graph across evidence sources." },
    ],
  }),
  component: Correlation,
});

function Correlation() {
  const center = correlationNodes[0]!;

  return (
    <>
      <PageHeader
        title="Cross-Source Correlation"
        subtitle="Relationships detected between entities and evidence across independent sources."
        actions={<StatusBadge tone="info">{relationships.length} relationships</StatusBadge>}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title="Relationship Graph" description="Entity-centric view" bodyClassName="p-5">
          <div className="relative aspect-square w-full">
            <svg className="absolute inset-0 size-full" aria-hidden>
              {correlationNodes.slice(1).map((n) => (
                <line
                  key={n.id}
                  x1={`${center.x}%`}
                  y1={`${center.y}%`}
                  x2={`${n.x}%`}
                  y2={`${n.y}%`}
                  stroke="currentColor"
                  className="text-primary/35"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
              ))}
            </svg>
            {correlationNodes.map((n, i) => (
              <div
                key={n.id}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                className={
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-2 text-center text-[11px] leading-tight " +
                  (i === 0
                    ? "glow-ring border-primary/50 bg-primary/15 text-primary"
                    : "border-accent/35 bg-surface/90 text-foreground")
                }
              >
                <div className="font-medium">{n.label}</div>
                <div className="text-[10px] text-muted-foreground">{n.kind}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Detected Relationships" bodyClassName="p-0">
          <ul className="divide-y divide-border/50">
            {relationships.map((r) => (
              <li key={r.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">
                    {r.from} <span className="text-muted-foreground">→</span> {r.to}
                  </div>
                  <StatusBadge tone={r.confidence >= 85 ? "primary" : "warning"}>
                    {r.confidence}% confidence
                  </StatusBadge>
                </div>
                <div className="mt-1 text-xs text-accent">{r.label}</div>
                <p className="mt-1.5 text-xs text-muted-foreground">{r.note}</p>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground">
                  Supporting: {r.supporting.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
