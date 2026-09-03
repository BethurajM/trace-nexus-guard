import { useMemo, useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  contradictions as allContradictions,
  custodyEvents,
  entities,
  evidenceForCase,
  shortHash,
  type CaseRecord,
} from "@/lib/mock-data";

interface Msg {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Summarise this case",
  "What contradictions were found?",
  "List the evidence items",
  "Is the integrity verified?",
  "Who handled the evidence?",
  "What entities were extracted?",
];

export function CaseAssistant({ record }: { record: CaseRecord }) {
  const items = useMemo(() => evidenceForCase(record.id), [record.id]);
  const caseContradictions = useMemo(
    () => allContradictions.filter((c) => c.caseId === record.id),
    [record.id],
  );

  const answer = (q: string): string => {
    const s = q.toLowerCase();

    if (/contradict|conflict|inconsist/.test(s)) {
      if (caseContradictions.length === 0)
        return `No potential contradictions have been detected for ${record.id} so far. AI correlation continues across ${record.sources} sources.`;
      return caseContradictions
        .map(
          (c) =>
            `${c.type} (${c.confidence}% confidence, ${c.reviewed ? "reviewed" : "pending review"}):\n• ${c.a.label} — "${c.a.statement}"\n• ${c.b.label} — "${c.b.statement}"\n${c.explanation}`,
        )
        .join("\n\n");
    }

    if (/integrity|tamper|hash|verif/.test(s)) {
      const mismatch = items.filter((e) => e.hashStatus !== "Integrity Verified");
      return `Case integrity status: ${record.integrity}. ${record.integrityAlerts} integrity alert(s) recorded. ${
        mismatch.length
          ? `Items needing attention: ${mismatch.map((e) => `${e.id} (${e.hashStatus})`).join(", ")}.`
          : "All SHA-256 hashes match their blockchain-anchored originals."
      }${items[0] ? ` Example anchor: ${shortHash(items[0].originalHash, 24)}.` : ""}`;
    }

    if (/evidence|file|item|upload/.test(s)) {
      if (items.length === 0) return `No evidence has been registered under ${record.id} yet.`;
      return `${items.length} evidence item(s) registered:\n${items
        .map((e) => `• ${e.id} — ${e.fileName} (${e.type}, source: ${e.source}, ${e.hashStatus})`)
        .join("\n")}`;
    }

    if (/custody|handled|transfer|who/.test(s)) {
      const evs = custodyEvents.slice(0, 5);
      return `Chain-of-custody trail (most recent entries):\n${evs
        .map(
          (e) =>
            `• ${e.date} ${e.time} — ${e.action} by ${e.person}${e.transferTo ? ` → ${e.transferTo}` : ""} (${e.evidenceId})`,
        )
        .join("\n")}\nLead investigator on record: ${record.investigator}.`;
    }

    if (/entit|person|name|extract|nlp/.test(s)) {
      return `Top AI/NLP extracted entities:\n${entities
        .slice(0, 6)
        .map((e) => `• ${e.category}: ${e.value} (${e.confidence}% confidence, seen in ${e.evidence.join(", ")})`)
        .join("\n")}`;
    }

    if (/blockchain|block|ledger|chain/.test(s)) {
      return `Every intake, hash and custody transfer for ${record.id} is anchored to the tamper-evident ledger. Open the Blockchain tab to inspect the linked block hashes.`;
    }

    if (/summar|overview|about|detail|status/.test(s)) {
      return `${record.id} — ${record.name}\n${record.description}\nStatus: ${record.status} · Integrity: ${record.integrity}\nLead investigator: ${record.investigator}\nCreated ${record.created}, last updated ${record.updated}\n${record.evidenceCount} evidence items across ${record.sources} sources, ${record.contradictions} potential contradiction(s) and ${record.integrityAlerts} integrity alert(s).`;
    }

    return `I can answer questions about ${record.id} using the case record, its ${items.length} evidence item(s), extracted entities, contradictions, custody trail and ledger anchors. Try asking about the summary, contradictions, integrity or chain of custody.`;
  };

  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "assistant",
      text: `Case assistant ready for ${record.id}. Ask about evidence, contradictions, integrity or chain of custody. Responses are assistive and require investigator verification.`,
    },
  ]);
  const [value, setValue] = useState("");
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [
      ...m,
      { id: idRef.current++, role: "user", text: q },
      { id: idRef.current++, role: "assistant", text: answer(q) },
    ]);
    setValue("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-[420px] min-h-[240px] space-y-4 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/70 bg-surface/60 text-foreground",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-border/70 bg-surface/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Ask about ${record.id}…`}
          aria-label="Ask about this case"
        />
        <Button type="submit" size="icon" aria-label="Send question">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
