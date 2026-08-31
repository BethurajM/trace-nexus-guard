import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, FileDown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { cases, contradictions, custodyEvents, blocks, evidence } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Investigation Reports — PATCH X" },
      {
        name: "description",
        content:
          "Generate structured investigation reports covering evidence, AI findings, contradictions, custody and integrity verification.",
      },
      { property: "og:title", content: "Investigation Reports — PATCH X" },
      { property: "og:description", content: "Structured, court-presentable investigation reporting." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const sections = [
    { label: "Case Summary", detail: `${cases.length} cases in workspace` },
    { label: "Evidence Inventory", detail: `${evidence.length} items with hashes` },
    { label: "AI Findings", detail: "Entities, summaries and confidence scores" },
    { label: "Contradiction Report", detail: `${contradictions.length} potential inconsistencies` },
    { label: "Chain of Custody", detail: `${custodyEvents.length} custody events` },
    { label: "Blockchain Verification", detail: `${blocks.length} ledger blocks` },
  ];

  return (
    <>
      <PageHeader
        title="Investigation Reports"
        subtitle="Compile a structured, presentable report from verified workspace data."
        actions={
          <Button onClick={() => toast.success("Report generated (demo export)")}>
            <FileDown className="size-4" /> Generate Report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <Panel key={s.label} title={s.label}>
            <div className="flex items-start gap-3">
              <FileBarChart className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">{s.detail}</p>
            </div>
            <div className="mt-3">
              <StatusBadge tone="primary">Included</StatusBadge>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Report Preview" className="mt-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          PATCH X compiles evidence records, AI-assisted findings, flagged contradictions, the full chain of
          custody and blockchain integrity confirmations into a single structured document. All AI output is
          marked as assistive and requires investigator verification before use.
        </p>
      </Panel>
    </>
  );
}
