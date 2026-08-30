import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/patchx/PageHeader";
import { StatusBadge, toneForStatus } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cases } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/cases/")({
  head: () => ({
    meta: [
      { title: "Cases — PATCH X Investigation Registry" },
      {
        name: "description",
        content:
          "Browse, filter and open digital forensics cases with evidence counts, potential contradictions and integrity status.",
      },
      { property: "og:title", content: "Cases — PATCH X" },
      { property: "og:description", content: "Investigation case registry with integrity status." },
    ],
  }),
  component: CasesPage,
});

function CasesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = cases.filter(
      (c) =>
        (status === "all" || c.status === status) &&
        (!q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)),
    );
    out = [...out].sort((a, b) => {
      if (sort === "evidence") return b.evidenceCount - a.evidenceCount;
      if (sort === "contradictions") return b.contradictions - a.contradictions;
      if (sort === "created") return b.created.localeCompare(a.created);
      return b.updated.localeCompare(a.updated);
    });
    return out;
  }, [query, status, sort]);

  return (
    <>
      <PageHeader
        title="Cases"
        subtitle="All investigations available to this authorized investigator account."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> Create New Case
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Case</DialogTitle>
                <DialogDescription>
                  A case record groups evidence, AI findings and custody events under one reference.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cname">Case Name</Label>
                  <Input id="cname" placeholder="e.g. Unauthorized System Access Investigation" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cdesc">Description</Label>
                  <Textarea id="cdesc" rows={3} placeholder="Scope of the investigation" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cinv">Lead Investigator</Label>
                  <Input id="cinv" defaultValue="Investigator A" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setOpen(false);
                    toast.success("Case created — reference CASE-2026-006 reserved");
                  }}
                >
                  Create Case
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases..."
            className="bg-surface/60 pl-10"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[170px] bg-surface/60">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[190px] bg-surface/60">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Sort: Last updated</SelectItem>
            <SelectItem value="created">Sort: Created date</SelectItem>
            <SelectItem value="evidence">Sort: Evidence count</SelectItem>
            <SelectItem value="contradictions">Sort: Contradictions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((c) => (
          <Link
            key={c.id}
            to="/cases/$caseId"
            params={{ caseId: c.id }}
            className="glass block rounded-xl p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-xs text-accent">{c.id}</div>
                <h3 className="mt-1 text-base font-semibold">{c.name}</h3>
              </div>
              <StatusBadge tone={toneForStatus(c.status)}>{c.status}</StatusBadge>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Evidence" value={String(c.evidenceCount)} />
              <Stat label="Contradictions" value={String(c.contradictions)} warn={c.contradictions > 0} />
              <Stat label="Investigator" value={c.investigator} />
              <Stat label="Created" value={c.created} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <StatusBadge tone={toneForStatus(c.integrity)}>{c.integrity}</StatusBadge>
              <span className="text-[11px] text-muted-foreground">Updated {c.updated}</span>
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="glass rounded-xl p-10 text-center text-sm text-muted-foreground lg:col-span-2">
            No cases match the current filters.
          </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <div className="text-[10px] tracking-wider text-muted-foreground uppercase">{label}</div>
      <div className={"mt-0.5 truncate text-sm " + (warn ? "text-warning" : "text-foreground")}>{value}</div>
    </div>
  );
}
