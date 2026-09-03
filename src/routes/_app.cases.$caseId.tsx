import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Blocks, Database, Layers, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { HashBlock } from "@/components/patchx/HashBlock";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  blocks,
  contradictions,
  custodyEvents,
  entities,
  evidenceForCase,
  getCase,
  shortHash,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/cases/$caseId")({
  loader: ({ params }) => {
    const record = getCase(params.caseId);
    if (!record) throw notFound();
    return { record };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Case unavailable — PATCH X" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.record.id} — ${loaderData.record.name} | PATCH X`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.record.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.record.description.slice(0, 155) },
      ],
    };
  },
  component: CaseDetails,
});

function CaseDetails() {
  const { record } = Route.useLoaderData();
  const items = evidenceForCase(record.id);
  const caseContradictions = contradictions.filter((c) => c.caseId === record.id);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground">
        <Link to="/cases">
          <ArrowLeft className="size-3.5" /> Back to cases
        </Link>
      </Button>

      <PageHeader
        title={record.name}
        subtitle={record.description}
        actions={
          <>
            <StatusBadge tone={toneForStatus(record.status)}>{record.status}</StatusBadge>
            <StatusBadge tone={toneForStatus(record.integrity)}>{record.integrity}</StatusBadge>
          </>
        }
      />
      <div className="-mt-4 mb-6 font-mono text-xs text-accent">{record.id}</div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Database} label="Evidence" value={record.evidenceCount} tone="primary" />
        <SummaryCard icon={Layers} label="Sources" value={record.sources} tone="info" />
        <SummaryCard
          icon={AlertTriangle}
          label="Potential Contradictions"
          value={record.contradictions}
          tone="warning"
        />
        <SummaryCard icon={ShieldAlert} label="Integrity Alerts" value={record.integrityAlerts} tone="destructive" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-surface/60 p-1">
          {["Overview", "Ask AI", "Evidence", "AI Findings", "Contradictions", "External Matches", "Chain of Custody", "Blockchain"].map(
            (t) => (
              <TabsTrigger key={t} value={t.toLowerCase().replace(/ /g, "-")} className="text-xs">
                {t}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <TabsContent value="overview" className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel title="Case Information">
            <dl className="space-y-3 text-sm">
              <Row label="Case ID" value={record.id} mono />
              <Row label="Lead Investigator" value={record.investigator} />
              <Row label="Created" value={record.created} />
              <Row label="Last Updated" value={record.updated} />
              <Row label="Evidence Sources" value={`${record.sources} distinct sources`} />
              <Row label="Integrity" value={record.integrity} />
            </dl>
          </Panel>
          <Panel title="Processing Pipeline" description="How PATCH X handles evidence in this case">
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[
                "Digital evidence intake",
                "Evidence ID assignment",
                "Metadata extraction",
                "SHA-256 hash generation",
                "Secure evidence storage",
                "Blockchain evidence record",
                "AI/NLP analysis & entity extraction",
                "Cross-source correlation",
                "Potential contradiction detection",
                "Authorized external record matching",
                "Chain-of-custody tracking",
                "Integrity verification & investigator review",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-mono text-[10px] text-primary">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </Panel>
        </TabsContent>

        <TabsContent value="ask-ai" className="mt-5">
          <Panel
            title="Case Assistant"
            description="Ask questions about this case. Answers are assistive and require investigator verification."
          >
            <CaseAssistant record={record} />
          </Panel>
        </TabsContent>

        <TabsContent value="evidence" className="mt-5">
          <Panel title={`Evidence (${items.length})`} bodyClassName="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Evidence ID</th>
                    <th className="px-5 py-3 font-medium">File Name</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Source</th>
                    <th className="px-5 py-3 font-medium">SHA-256</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((e) => (
                    <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-surface/50">
                      <td className="px-5 py-3">
                        <Link to="/evidence/$evidenceId" params={{ evidenceId: e.id }} className="font-mono text-xs text-accent hover:underline">
                          {e.id}
                        </Link>
                      </td>
                      <td className="px-5 py-3">{e.fileName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{e.type}</td>
                      <td className="px-5 py-3 text-muted-foreground">{e.source}</td>
                      <td className="px-5 py-3">
                        <StatusBadge tone={toneForStatus(e.hashStatus)}>{e.hashStatus}</StatusBadge>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ai-findings" className="mt-5">
          <Panel title="Extracted Entities" description="AI/NLP findings across this case's evidence">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entities.slice(0, 9).map((e) => (
                <div key={e.value} className="rounded-lg border bg-surface/60 p-4">
                  <div className="text-[10px] tracking-wider text-muted-foreground uppercase">{e.category}</div>
                  <div className="mt-1 text-sm font-medium">{e.value}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{e.evidence.join(", ")}</span>
                    <span className="text-primary">{e.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="contradictions" className="mt-5 space-y-4">
          {caseContradictions.length === 0 && (
            <Panel>
              <p className="text-sm text-muted-foreground">No potential contradictions detected for this case.</p>
            </Panel>
          )}
          {caseContradictions.map((c) => (
            <div key={c.id} className="glass rounded-xl border-warning/30 p-5">
              <div className="flex items-center justify-between">
                <StatusBadge tone="warning">⚠ POTENTIAL CONTRADICTION</StatusBadge>
                <span className="text-xs text-muted-foreground">AI confidence {c.confidence}%</span>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <Quote id={c.a.evidenceId} label={c.a.label} text={c.a.statement} />
                <div className="text-center text-xs font-semibold text-warning">VS</div>
                <Quote id={c.b.evidenceId} label={c.b.label} text={c.b.statement} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{c.explanation}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="external-matches" className="mt-5">
          <Panel title="Authorized External Record Matching">
            <div className="rounded-lg border border-accent/30 bg-accent/8 p-4">
              <div className="text-sm font-medium text-accent">POSSIBLE MATCH FOUND</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Source: Authorized External Records (Synthetic Dataset) · Match Confidence 91% · Status:
                Requires Human Verification
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/external-records">Open External Record Matching</Link>
            </Button>
          </Panel>
        </TabsContent>

        <TabsContent value="chain-of-custody" className="mt-5">
          <Panel title="Chain of Custody" bodyClassName="p-5">
            <ol className="relative space-y-6 border-l border-border pl-6">
              {custodyEvents.map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute top-1 -left-[30px] size-3.5 rounded-full border border-primary/50 bg-primary/25" />
                  <div className="text-sm text-foreground">✓ {ev.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {ev.person}
                    {ev.transferTo ? ` → ${ev.transferTo}` : ""} · {ev.date} {ev.time} · {ev.evidenceId}
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </TabsContent>

        <TabsContent value="blockchain" className="mt-5">
          <Panel title="Blockchain Records" description="Tamper-evident events recorded for this case">
            <div className="space-y-3">
              {blocks.slice(0, 4).map((b) => (
                <div key={b.number} className="rounded-lg border bg-surface/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Blocks className="size-4 text-primary" />
                      <span className="font-mono text-sm">BLOCK #{b.number}</span>
                      <span className="text-xs text-muted-foreground">{b.event}</span>
                    </div>
                    <StatusBadge tone={toneForStatus(b.status)}>{b.status}</StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <HashBlock label="Current Hash" hash={shortHash(b.hash, 40)} tone="primary" />
                    <HashBlock label="Previous Hash" hash={shortHash(b.prevHash, 40)} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "primary" | "info" | "warning" | "destructive";
}) {
  const color =
    tone === "destructive"
      ? "text-destructive bg-destructive/12"
      : tone === "warning"
        ? "text-warning bg-warning/12"
        : tone === "info"
          ? "text-accent bg-accent/12"
          : "text-primary bg-primary/12";
  return (
    <div className="glass flex items-center gap-4 rounded-xl p-5">
      <div className={"flex size-10 items-center justify-center rounded-lg " + color}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</div>
        <div className="font-display text-2xl font-semibold">{value}</div>
      </div>
    </div>
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

function Quote({ id, label, text }: { id: string; label: string; text: string }) {
  return (
    <div className="rounded-lg border bg-surface/60 p-4">
      <div className="font-mono text-[11px] text-accent">
        Evidence {id} — {label}
      </div>
      <p className="mt-1.5 text-sm">“{text}”</p>
    </div>
  );
}
