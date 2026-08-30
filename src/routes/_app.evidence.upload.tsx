import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type DragEvent } from "react";
import { CheckCircle2, FileUp, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { HashBlock } from "@/components/patchx/HashBlock";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cases, evidenceSources, evidenceTypes } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/evidence/upload")({
  head: () => ({
    meta: [
      { title: "Upload Digital Evidence — PATCH X" },
      {
        name: "description",
        content:
          "Register digital evidence: metadata extraction, SHA-256 hash generation, secure storage and blockchain record creation.",
      },
      { property: "og:title", content: "Upload Digital Evidence — PATCH X" },
      { property: "og:description", content: "Hash, store and register evidence on the ledger." },
    ],
  }),
  component: UploadPage,
});

const STEPS = [
  "Evidence received",
  "Metadata extracted",
  "SHA-256 hash generated",
  "Evidence securely stored",
  "Blockchain record created",
];

function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFileName(f.name);
  };

  const start = () => {
    if (!fileName) {
      toast.error("Attach an evidence file first");
      return;
    }
    setDone(false);
    setStep(0);
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setStep(i + 1);
        if (i === STEPS.length - 1) {
          setDone(true);
          toast.success("Evidence E001 registered — Blockchain Record Verified");
        }
      }, 700 * (i + 1));
    });
  };

  return (
    <>
      <PageHeader
        title="Upload Digital Evidence"
        subtitle="Evidence is fingerprinted with SHA-256 and registered on the permissioned ledger."
        actions={
          <Button asChild variant="outline">
            <Link to="/evidence">Back to Evidence</Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Panel title="Evidence File">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors " +
                (dragging ? "border-primary bg-primary/6" : "border-border-strong/70 hover:border-primary/50")
              }
            >
              <FileUp className="mb-3 size-7 text-primary" />
              <div className="text-sm font-medium">
                {fileName ?? "Drag & drop evidence file here"}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Images, screenshots, PDFs, emails, chats, CSV, system logs, transaction records
              </p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </Panel>

          <Panel title="Collection Metadata">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Case ID">
                <Select defaultValue={cases[0].id}>
                  <SelectTrigger className="bg-surface/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Evidence Type">
                <Select defaultValue={evidenceTypes[0]}>
                  <SelectTrigger className="bg-surface/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Evidence Source">
                <Select defaultValue={evidenceSources[0]}>
                  <SelectTrigger className="bg-surface/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {evidenceSources.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Collected By">
                <Input defaultValue="Investigator A" className="bg-surface/60" />
              </Field>
              <Field label="Collection Date">
                <Input type="date" defaultValue="2026-08-30" className="bg-surface/60" />
              </Field>
              <Field label="Collection Time">
                <Input type="time" defaultValue="10:30" className="bg-surface/60" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <Textarea rows={3} placeholder="Context of collection" className="bg-surface/60" />
                </Field>
              </div>
            </div>
            <Button className="mt-5 w-full" onClick={start}>
              Register Evidence
            </Button>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Processing Pipeline">
            <ol className="space-y-3">
              {STEPS.map((s, i) => {
                const active = step === i;
                const complete = step > i;
                return (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span
                      className={
                        "flex size-6 items-center justify-center rounded-md border " +
                        (complete
                          ? "border-primary/40 bg-primary/12 text-primary"
                          : active
                            ? "border-accent/40 bg-accent/12 text-accent"
                            : "border-border-strong/60 text-muted-foreground")
                      }
                    >
                      {complete ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : active ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <span className="font-mono text-[10px]">{i + 1}</span>
                      )}
                    </span>
                    <span className={complete ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                  </li>
                );
              })}
            </ol>
          </Panel>

          {done && (
            <Panel title="Registration Result">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] tracking-wider text-muted-foreground uppercase">Evidence ID</div>
                  <div className="font-mono text-lg text-primary">E001</div>
                </div>
                <StatusBadge tone="primary">Blockchain Record Verified</StatusBadge>
              </div>
              <HashBlock
                label="SHA-256 Hash"
                tone="primary"
                hash="8f14e45fceea167a5a36dedd4bea2543f4b1c9a7d2e6b0c9182ab77e5f6d31ac"
              />
            </Panel>
          )}

          <div className="glass rounded-xl border-accent/25 p-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-accent" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                The actual evidence file is stored separately in secure evidence storage. Only the
                evidence hash and relevant metadata are recorded on the ledger for integrity
                verification, so the ledger never holds the file contents itself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</Label>
      {children}
    </div>
  );
}
