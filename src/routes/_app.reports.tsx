import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileDown, Loader2, Play, ShieldCheck, AlertTriangle, Blocks } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { HashBlock } from "@/components/patchx/HashBlock";
import { Button } from "@/components/ui/button";
import { cases, shortHash } from "@/lib/mock-data";
import { DEMO_CASE_ID, PIPELINE_STAGES, buildCaseReport, reportToText } from "@/lib/demo-report";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Investigation Reports — PATCH X" },
      {
        name: "description",
        content:
          "Run a full demo case analysis and generate a structured investigation report covering evidence, AI findings, contradictions, custody and blockchain integrity.",
      },
      { property: "og:title", content: "Investigation Reports — PATCH X" },
      { property: "og:description", content: "Run a demo case analysis and generate a court-presentable report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reports,
});

function Reports() {
  const [caseId, setCaseId] = useState<string>(DEMO_CASE_ID);
  const [stage, setStage] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const report = useMemo(() => buildCaseReport(caseId), [caseId]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDone(false);
    setStage(0);
    PIPELINE_STAGES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setStage(i + 1);
          if (i === PIPELINE_STAGES.length - 1) {
            setDone(true);
            toast.success(`Analysis complete for ${caseId}`);
          }
        }, 350 * (i + 1)),
      );
    });
  };

  const download = () => {
    if (!report) return;
    const blob = new Blob([reportToText(report)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.record.id}-patchx-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  return (
    <>
      <PageHeader
        title="Investigation Reports"
        subtitle="Run the full analysis pipeline on a demo case and compile a structured, presentable report."
        actions={
          <>
            <Button variant="outline" onClick={run}>
              {stage > -1 && !done ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
              Run Full Analysis
            </Button>
            <Button onClick={download} disabled={!done}>
              <FileDown className="size-4" /> Export Report
            </Button>
          </>
        }
      />

      <Panel title="Demo Case" description="Select the case to analyse. CASE-2026-001 is the guided demo.">
        <div className="flex flex-wrap gap-2">
          {cases.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCaseId(c.id);
                setStage(-1);
                setDone(false);
              }}
              className={
                "rounded-lg border px-3.5 py-2 text-left text-xs transition-colors " +
                (c.id === caseId
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/70 bg-surface/60 text-muted-foreground hover:border-primary/30 hover:text-foreground")
              }
            >
              <div className="font-mono text-[11px] text-accent">{c.id}</div>
              <div className="mt-0.5 max-w-[220px] truncate">{c.name}</div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Analysis Pipeline" className="mt-5">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STAGES.map((s, i) => {
            const state = stage > i ? "done" : stage === i ? "running" : "idle";
            return (
              <li
                key={s}
                className={
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs " +
                  (state === "done"
                    ? "border-primary/40 bg-primary/8 text-foreground"
                    : state === "running"
                      ? "border-accent/40 bg-accent/8 text-foreground"
                      : "border-border/60 bg-surface/50 text-muted-foreground")
                }
              >
                {state === "done" ? (
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                ) : state === "running" ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-accent" />
                ) : (
                  <span className="size-4 shrink-0 rounded-full border border-border" />
                )}
                {s}
              </li>
            );
          })}
        </ol>
        {stage === -1 && (
          <p className="mt-4 text-xs text-muted-foreground">
            Press “Run Full Analysis” to process {caseId} end to end and generate the report output below.
          </p>
        )}
      </Panel>

      {!report && (
        <Panel className="mt-5">
          <p className="text-sm text-muted-foreground">Case not found.</p>
        </Panel>
      )}

      {report && done && (
        <div className="mt-6 space-y-5">
          <Panel
            title={`Report Output — ${report.record.id}`}
            description={`Generated ${report.generatedAt} · AI-assisted, requires investigator verification`}
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric icon={ShieldCheck} label="Integrity Score" value={`${report.integrityScore}%`} tone="primary" />
              <Metric icon={Blocks} label="Evidence Items" value={String(report.evidence.length)} tone="info" />
              <Metric
                icon={AlertTriangle}
                label="Contradictions"
                value={String(report.contradictions.length)}
                tone="warning"
              />
              <Metric
                icon={AlertTriangle}
                label="Hash Mismatches"
                value={String(report.mismatched)}
                tone="destructive"
              />
            </div>

            <Section title="1. Case Summary">
              <p className="text-sm text-muted-foreground">{report.record.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge tone={toneForStatus(report.record.status)}>{report.record.status}</StatusBadge>
                <StatusBadge tone={toneForStatus(report.record.integrity)}>{report.record.integrity}</StatusBadge>
                <StatusBadge tone="primary">Lead: {report.record.investigator}</StatusBadge>
              </div>
            </Section>

            <Section title="2. Key Findings">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {report.keyFindings.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="3. Evidence Inventory">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                      <th className="py-2 pr-4 font-medium">ID</th>
                      <th className="py-2 pr-4 font-medium">File</th>
                      <th className="py-2 pr-4 font-medium">Source</th>
                      <th className="py-2 pr-4 font-medium">SHA-256</th>
                      <th className="py-2 pr-4 font-medium">Integrity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.evidence.map((e) => (
                      <tr key={e.id} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-4">
                          <Link
                            to="/evidence/$evidenceId"
                            params={{ evidenceId: e.id }}
                            className="font-mono text-xs text-accent hover:underline"
                          >
                            {e.id}
                          </Link>
                        </td>
                        <td className="py-2 pr-4">{e.fileName}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{e.source}</td>
                        <td className="py-2 pr-4 font-mono text-[11px] text-muted-foreground">
                          {shortHash(e.originalHash, 20)}
                        </td>
                        <td className="py-2 pr-4">
                          <StatusBadge tone={toneForStatus(e.hashStatus)}>{e.hashStatus}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. AI / NLP Extracted Entities">
              {report.entities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No entities linked to this case.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {report.entities.map((e) => (
                    <div key={e.value} className="rounded-lg border bg-surface/60 p-3.5">
                      <div className="text-[10px] tracking-wider text-muted-foreground uppercase">{e.category}</div>
                      <div className="mt-1 text-sm font-medium">{e.value}</div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{e.evidence.join(", ")}</span>
                        <span className="text-primary">{e.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="5. Potential Contradictions">
              {report.contradictions.length === 0 ? (
                <p className="text-sm text-muted-foreground">None detected for this case.</p>
              ) : (
                <div className="space-y-3">
                  {report.contradictions.map((c) => (
                    <div key={c.id} className="rounded-lg border border-warning/30 bg-warning/6 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StatusBadge tone="warning">⚠ {c.type}</StatusBadge>
                        <span className="text-xs text-muted-foreground">
                          {c.confidence}% confidence · {c.reviewed ? "reviewed" : "pending review"}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border bg-surface/60 p-3">
                          <div className="font-mono text-[11px] text-accent">
                            {c.a.evidenceId} — {c.a.label}
                          </div>
                          <p className="mt-1 text-sm">“{c.a.statement}”</p>
                        </div>
                        <div className="rounded-lg border bg-surface/60 p-3">
                          <div className="font-mono text-[11px] text-accent">
                            {c.b.evidenceId} — {c.b.label}
                          </div>
                          <p className="mt-1 text-sm">“{c.b.statement}”</p>
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs text-muted-foreground">{c.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="6. Chain of Custody">
              {report.custody.length === 0 ? (
                <p className="text-sm text-muted-foreground">No custody events recorded for this evidence.</p>
              ) : (
                <ol className="relative space-y-5 border-l border-border pl-6">
                  {report.custody.map((ev) => (
                    <li key={ev.id} className="relative">
                      <span className="absolute top-1 -left-[30px] size-3.5 rounded-full border border-primary/50 bg-primary/25" />
                      <div className="text-sm">✓ {ev.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {ev.person}
                        {ev.transferTo ? ` → ${ev.transferTo}` : ""} · {ev.date} {ev.time} · {ev.evidenceId} ·{" "}
                        {ev.location}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Section>

            <Section title="7. Blockchain Verification">
              {report.blocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No ledger blocks anchored for this case.</p>
              ) : (
                <div className="space-y-3">
                  {report.blocks.map((b) => (
                    <div key={b.number} className="rounded-lg border bg-surface/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Blocks className="size-4 text-primary" />
                          <span className="font-mono text-sm">BLOCK #{b.number}</span>
                          <span className="text-xs text-muted-foreground">
                            {b.event} · {b.evidenceId}
                          </span>
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
              )}
            </Section>

            <Section title="8. Conclusions">
              <ol className="space-y-2 text-sm text-muted-foreground">
                {report.conclusions.map((c, i) => (
                  <li key={c} className="flex gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md border border-primary/25 bg-primary/10 font-mono text-[10px] text-primary">
                      {i + 1}
                    </span>
                    {c}
                  </li>
                ))}
              </ol>
            </Section>
          </Panel>

          <Panel title="Plain-Text Export Preview" bodyClassName="p-0">
            <pre className="max-h-[420px] overflow-auto p-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
              {reportToText(report)}
            </pre>
          </Panel>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 border-t border-border/60 pt-5 first:mt-5">
      <h3 className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
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
    <div className="flex items-center gap-3 rounded-xl border bg-surface/60 p-4">
      <div className={"flex size-9 items-center justify-center rounded-lg " + color}>
        <Icon className="size-4.5" />
      </div>
      <div>
        <div className="text-[10px] tracking-wider text-muted-foreground uppercase">{label}</div>
        <div className="font-display text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
}
