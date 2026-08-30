import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FolderKanban,
  Globe2,
  Search,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge, toneForStatus, type Tone } from "@/components/patchx/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cases, dashboardStats, recentActivity } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Investigation Dashboard — PATCH X" },
      {
        name: "description",
        content:
          "Monitor active cases, evidence volume, AI findings and integrity status across the PATCH X forensics workspace.",
      },
      { property: "og:title", content: "Investigation Dashboard — PATCH X" },
      {
        property: "og:description",
        content: "Cases, evidence, AI findings and integrity status at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const icons = [FolderKanban, Database, CheckCircle2, AlertTriangle, ShieldAlert, Globe2];

function Dashboard() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <PageHeader
        title="Investigation Dashboard"
        subtitle="Monitor cases, evidence, AI findings and integrity status."
      />

      <div className="relative mb-7">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cases, evidence or entities..."
          className="h-11 bg-surface/60 pl-10"
        />
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((s, i) => {
          const Icon = icons[i];
          const tone = s.tone as Tone;
          return (
            <div key={s.label} className="glass rounded-xl p-5 transition-colors hover:border-primary/30">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs tracking-wider text-muted-foreground uppercase">{s.label}</div>
                  <div className="mt-2 font-display text-3xl font-semibold">{s.value}</div>
                </div>
                <div
                  className={
                    "flex size-10 items-center justify-center rounded-lg " +
                    (tone === "destructive"
                      ? "bg-destructive/12 text-destructive"
                      : tone === "warning"
                        ? "bg-warning/12 text-warning"
                        : tone === "info"
                          ? "bg-accent/12 text-accent"
                          : "bg-primary/12 text-primary")
                  }
                >
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <StatusBadge tone={tone}>{s.hint}</StatusBadge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel title="Active Cases" description="Open investigations assigned to this workspace" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                  <th className="px-5 py-3 font-medium">Case ID</th>
                  <th className="px-5 py-3 font-medium">Case Name</th>
                  <th className="px-5 py-3 font-medium">Evidence</th>
                  <th className="px-5 py-3 font-medium">Contradictions</th>
                  <th className="px-5 py-3 font-medium">Integrity</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-surface/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-accent">{c.id}</td>
                    <td className="max-w-[260px] px-5 py-3.5">
                      <div className="truncate font-medium">{c.name}</div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.evidenceCount}</td>
                    <td className="px-5 py-3.5">
                      <span className={c.contradictions > 0 ? "text-warning" : "text-muted-foreground"}>
                        {c.contradictions}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={toneForStatus(c.integrity)}>{c.integrity}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={toneForStatus(c.status)}>{c.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap text-muted-foreground">{c.updated}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary">
                        <Link to="/cases/$caseId" params={{ caseId: c.id }}>
                          View Case <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                      No cases match “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Recent Activity" description="Evidence lifecycle events">
          <ol className="relative space-y-5 border-l border-border pl-5">
            {recentActivity.map((a, i) => (
              <li key={i} className="relative">
                <span
                  className={
                    "absolute top-1 -left-[26px] flex size-3.5 items-center justify-center rounded-full border " +
                    (a.tone === "warn"
                      ? "border-warning/50 bg-warning/25"
                      : "border-primary/50 bg-primary/25")
                  }
                />
                <div className={a.tone === "warn" ? "text-sm text-warning" : "text-sm text-foreground"}>
                  {a.tone === "warn" ? "⚠" : "✓"} {a.text}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{a.time}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
