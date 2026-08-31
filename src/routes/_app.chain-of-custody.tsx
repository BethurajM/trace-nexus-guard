import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { custodyEvents } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/chain-of-custody")({
  head: () => ({
    meta: [
      { title: "Chain of Custody — PATCH X" },
      {
        name: "description",
        content:
          "Complete custody trail for each evidence item: collection, transfer, access, analysis and return events.",
      },
      { property: "og:title", content: "Chain of Custody — PATCH X" },
      { property: "og:description", content: "Immutable custody trail for digital evidence." },
    ],
  }),
  component: ChainOfCustody,
});

function ChainOfCustody() {
  const groups = Array.from(new Set(custodyEvents.map((e) => e.evidenceId)));

  return (
    <>
      <PageHeader
        title="Chain of Custody"
        subtitle="Every custody action is recorded with actor, timestamp and location."
        actions={<StatusBadge tone="primary">Custody trail complete</StatusBadge>}
      />

      <div className="space-y-6">
        {groups.map((id) => {
          const events = custodyEvents.filter((e) => e.evidenceId === id);
          return (
            <Panel key={id} title={`${id} — ${events[0]?.evidenceName ?? ""}`} description={`${events.length} custody events`}>
              <ol className="relative space-y-6 border-l border-border pl-6">
                {events.map((ev) => (
                  <li key={ev.id} className="relative">
                    <span className="absolute top-1 -left-[30px] size-3.5 rounded-full border border-primary/50 bg-primary/25" />
                    <div className="text-sm font-medium">{ev.action}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {ev.person}
                      {ev.transferTo ? ` → ${ev.transferTo}` : ""} · {ev.location}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-accent">
                      {ev.date} {ev.time}
                    </div>
                  </li>
                ))}
              </ol>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
