import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe2, Search } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/external-records")({
  head: () => ({
    meta: [
      { title: "Authorized External Records — PATCH X" },
      {
        name: "description",
        content:
          "Check permitted identifiers against an authorized external or synthetic dataset and review possible matches.",
      },
      { property: "og:title", content: "Authorized External Records — PATCH X" },
      { property: "og:description", content: "Possible matches requiring human verification." },
    ],
  }),
  component: ExternalRecords,
});

const matches = [
  { field: "Account Identifier", value: "rahul_01", confidence: 91, source: "Synthetic Registry A" },
  { field: "Device Fingerprint", value: "OFFICE-PC-04 / 8A:1F:22", confidence: 84, source: "Synthetic Registry B" },
  { field: "Transaction Reference", value: "TXN-88421", confidence: 77, source: "Synthetic Ledger Export" },
];

function ExternalRecords() {
  const [query, setQuery] = useState("rahul_01");
  const [checked, setChecked] = useState(true);

  return (
    <>
      <PageHeader
        title="Authorized External Records"
        subtitle="Permitted lookups against authorized or synthetic datasets. Matches are indicative only."
        actions={<StatusBadge tone="info">Human verification required</StatusBadge>}
      />

      <Panel title="Record Lookup" className="mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Identifier, account, reference..."
              className="h-11 bg-surface/60 pl-10"
            />
          </div>
          <Button className="h-11" onClick={() => setChecked(true)}>
            <Globe2 className="size-4" /> Check Authorized Records
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Only permitted information is checked. No unauthorized access or unlawful data collection is performed.
        </p>
      </Panel>

      {checked && (
        <Panel title="Possible Matches" description={`Results for “${query}”`} bodyClassName="p-0">
          <ul className="divide-y divide-border/50">
            {matches.map((m) => (
              <li key={m.field} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{m.field}</div>
                  <div className="mt-0.5 text-sm font-medium">{m.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{m.source}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={m.confidence >= 85 ? "info" : "warning"}>
                    {m.confidence}% match
                  </StatusBadge>
                  <StatusBadge tone="warning">Requires Human Verification</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
