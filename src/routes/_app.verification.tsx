import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { HashBlock } from "@/components/patchx/HashBlock";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { evidence } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/verification")({
  head: () => ({
    meta: [
      { title: "Evidence Verification — PATCH X" },
      {
        name: "description",
        content:
          "Re-check any evidence item against its recorded SHA-256 fingerprint and ledger entry to confirm integrity.",
      },
      { property: "og:title", content: "Evidence Verification — PATCH X" },
      { property: "og:description", content: "Integrity re-verification against recorded hashes." },
    ],
  }),
  component: Verification,
});

function Verification() {
  const [selected, setSelected] = useState(evidence[0]?.id ?? "");
  const item = evidence.find((e) => e.id === selected) ?? evidence[0]!;
  const mismatch = item.hashStatus === "Integrity Mismatch";

  return (
    <>
      <PageHeader
        title="Evidence Verification"
        subtitle="Compare the current evidence fingerprint with the value recorded at collection."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Panel title="Select Evidence" bodyClassName="max-h-[520px] overflow-y-auto p-2">
          <ul className="space-y-1">
            {evidence.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setSelected(e.id)}
                  className={
                    "flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors " +
                    (e.id === selected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-surface/70")
                  }
                >
                  <span className="truncate">{e.fileName}</span>
                  <span className="font-mono text-[11px]">{e.id}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={item.fileName}
          description={`${item.type} · ${item.source} · ${item.caseId}`}
          actions={<StatusBadge tone={toneForStatus(item.hashStatus)}>{item.hashStatus}</StatusBadge>}
        >
          <div className="space-y-3">
            <HashBlock label="Recorded SHA-256" hash={item.originalHash} />
            <HashBlock
              label="Current SHA-256"
              hash={item.currentHash}
              tone={mismatch ? "destructive" : "primary"}
            />
          </div>

          <div
            className={
              "mt-4 rounded-lg border p-4 " +
              (mismatch ? "border-destructive/35 bg-destructive/8" : "border-primary/30 bg-primary/8")
            }
          >
            <div className="flex items-center gap-2">
              {mismatch ? (
                <AlertTriangle className="size-4 text-destructive" />
              ) : (
                <ShieldCheck className="size-4 text-primary" />
              )}
              <span className={mismatch ? "text-sm font-semibold text-destructive" : "text-sm font-semibold text-primary"}>
                {mismatch ? "INTEGRITY MISMATCH" : "INTEGRITY VERIFIED"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {mismatch
                ? "The current fingerprint does not match the ledger record. Escalate for investigation."
                : "The current fingerprint matches the ledger record for this evidence item."}
            </p>
          </div>

          <Button className="mt-4" variant="outline" onClick={() => setSelected(item.id)}>
            Re-run Verification
          </Button>
        </Panel>
      </div>
    </>
  );
}
