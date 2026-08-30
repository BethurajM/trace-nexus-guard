import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, Search, Upload } from "lucide-react";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cases, evidence, evidenceTypes } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/evidence/")({
  head: () => ({
    meta: [
      { title: "Digital Evidence — PATCH X" },
      {
        name: "description",
        content:
          "Registry of digital evidence items with SHA-256 integrity status, source, custody owner and case assignment.",
      },
      { property: "og:title", content: "Digital Evidence — PATCH X" },
      { property: "og:description", content: "Evidence registry with SHA-256 integrity status." },
    ],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [caseId, setCaseId] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return evidence.filter(
      (e) =>
        (type === "all" || e.type === type) &&
        (caseId === "all" || e.caseId === caseId) &&
        (!q || e.id.toLowerCase().includes(q) || e.fileName.toLowerCase().includes(q)),
    );
  }, [query, type, caseId]);

  return (
    <>
      <PageHeader
        title="Digital Evidence"
        subtitle="Images, screenshots, PDFs, emails, chats, CSV files, system logs and transaction records."
        actions={
          <Button asChild>
            <Link to="/evidence/upload">
              <Upload className="size-4" /> Upload Evidence
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search evidence ID or file name..."
            className="bg-surface/60 pl-10"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[190px] bg-surface/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All evidence types</SelectItem>
            {evidenceTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={caseId} onValueChange={setCaseId}>
          <SelectTrigger className="w-[200px] bg-surface/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cases</SelectItem>
            {cases.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-sm">
            <thead>
              <tr className="border-b border-border/70 text-left text-[11px] tracking-wider text-muted-foreground uppercase">
                {[
                  "Evidence ID",
                  "File Name",
                  "Type",
                  "Source",
                  "Case ID",
                  "SHA-256 Status",
                  "Uploaded By",
                  "Date",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-border/50 last:border-0 hover:bg-surface/50">
                  <td className="px-5 py-3 font-mono text-xs text-accent">{e.id}</td>
                  <td className="px-5 py-3">{e.fileName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{e.type}</td>
                  <td className="px-5 py-3 text-muted-foreground">{e.source}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{e.caseId}</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={toneForStatus(e.hashStatus)}>
                      {e.hashStatus === "Integrity Verified" ? "✓ Verified" : e.hashStatus}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.uploadedBy}</td>
                  <td className="px-5 py-3 text-xs whitespace-nowrap text-muted-foreground">
                    {e.date} {e.time}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={toneForStatus(e.status)}>{e.status}</StatusBadge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary">
                      <Link to="/evidence/$evidenceId" params={{ evidenceId: e.id }}>
                        <Eye className="size-3.5" /> View
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No evidence matches the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
