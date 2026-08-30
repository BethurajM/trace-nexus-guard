import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { HashBlock } from "@/components/patchx/HashBlock";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { evidence } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/evidence/$evidenceId")({
  loader: ({ params }) => {
    const item = evidence.find((e) => e.id === params.evidenceId);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Evidence unavailable — PATCH X" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.item.id} — ${loaderData.item.fileName} | PATCH X`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Evidence details and SHA-256 integrity verification for ${loaderData.item.fileName}.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Evidence details and integrity verification." },
      ],
    };
  },
  component: EvidenceDetails,
});

function EvidenceDetails() {
  const { item } = Route.useLoaderData();
  const [simulateMismatch, setSimulateMismatch] = useState(item.hashStatus === "Integrity Mismatch");
  const mismatch = simulateMismatch;
  const currentHash = mismatch ? item.currentHash.replace(/^.{6}/, "c9d41b") : item.originalHash;

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground">
        <Link to="/evidence">
          <ArrowLeft className="size-3.5" /> Back to evidence
        </Link>
      </Button>

      <PageHeader
        title={item.fileName}
        subtitle={`${item.type} collected from ${item.source}`}
        actions={<StatusBadge tone={toneForStatus(item.status)}>{item.status}</StatusBadge>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Evidence Information">
          <dl className="space-y-3 text-sm">
            <Row label="Evidence ID" value={item.id} mono />
            <Row label="Case ID" value={item.caseId} mono />
            <Row label="File Name" value={item.fileName} />
            <Row label="File Type" value={item.type} />
            <Row label="File Size" value={item.size} />
            <Row label="Source" value={item.source} />
            <Row label="Collected By" value={item.uploadedBy} />
            <Row label="Collection Timestamp" value={`${item.date} ${item.time}`} />
          </dl>
        </Panel>

        <Panel
          title="Integrity Verification"
          actions={
            <div className="flex items-center gap-2">
              <Label htmlFor="sim" className="text-[11px] text-muted-foreground">
                Simulate mismatch
              </Label>
              <Switch id="sim" checked={simulateMismatch} onCheckedChange={setSimulateMismatch} />
            </div>
          }
        >
          <div className="space-y-3">
            <HashBlock label="Original SHA-256" hash={item.originalHash} />
            <HashBlock
              label="Current SHA-256"
              hash={currentHash}
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
              <span
                className={
                  "text-sm font-semibold tracking-wide " +
                  (mismatch ? "text-destructive" : "text-primary")
                }
              >
                {mismatch ? "⚠ INTEGRITY MISMATCH" : "✓ INTEGRITY VERIFIED"}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {mismatch
                ? "Current evidence does not match the previously recorded hash. Investigation required."
                : "Current evidence matches the recorded evidence fingerprint."}
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/verification">Open Verification</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/chain-of-custody">Chain of Custody</Link>
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-2 last:border-0">
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-accent" : "text-sm"}>{value}</dd>
    </div>
  );
}
