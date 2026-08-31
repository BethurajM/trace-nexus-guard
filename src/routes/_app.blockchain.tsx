import { createFileRoute } from "@tanstack/react-router";
import { Blocks, Link2 } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { HashBlock } from "@/components/patchx/HashBlock";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { blocks } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/blockchain")({
  head: () => ({
    meta: [
      { title: "Blockchain Evidence Ledger — PATCH X" },
      {
        name: "description",
        content:
          "Append-only ledger of evidence registration, transfer and integrity events with linked block hashes.",
      },
      { property: "og:title", content: "Blockchain Evidence Ledger — PATCH X" },
      { property: "og:description", content: "Tamper-evident record of evidence lifecycle events." },
    ],
  }),
  component: BlockchainLedger,
});

function BlockchainLedger() {
  return (
    <>
      <PageHeader
        title="Blockchain Evidence Ledger"
        subtitle="Each evidence event is recorded as a linked, append-only ledger entry."
        actions={<StatusBadge tone="primary">{blocks.length} blocks recorded</StatusBadge>}
      />

      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={b.number}>
            {i > 0 && (
              <div className="ml-7 flex items-center gap-2 py-1 text-[11px] text-muted-foreground">
                <Link2 className="size-3.5 text-primary" /> linked to previous block hash
              </div>
            )}
            <Panel
              title={`Block #${b.number}`}
              description={`${b.event} · ${b.timestamp} · ${b.recordedBy}`}
              actions={<StatusBadge tone={toneForStatus(b.status)}>{b.status}</StatusBadge>}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 text-primary">
                  <Blocks className="size-3.5" /> {b.txId}
                </span>
                <span className="font-mono text-accent">Evidence {b.evidenceId}</span>
              </div>
              <div className="space-y-3">
                <HashBlock label="Previous Hash" hash={b.prevHash} />
                <HashBlock label="Block Hash" hash={b.hash} tone="primary" />
              </div>
            </Panel>
          </div>
        ))}
      </div>
    </>
  );
}
