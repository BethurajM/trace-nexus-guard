/**
 * Builds a full, structured investigation report for a case from the
 * synthetic workspace data. A future backend can replace this generator
 * with a server-side report service without changing the UI.
 */
import {
  blocks,
  contradictions,
  custodyEvents,
  entities,
  evidenceForCase,
  getCase,
  shortHash,
  type CaseRecord,
} from "@/lib/mock-data";

export const DEMO_CASE_ID = "CASE-2026-001";

export const PIPELINE_STAGES = [
  "Loading case record",
  "Indexing evidence items",
  "Recomputing SHA-256 hashes",
  "Verifying blockchain anchors",
  "Running AI/NLP entity extraction",
  "Cross-source correlation",
  "Contradiction detection",
  "Chain-of-custody reconstruction",
  "Compiling report",
] as const;

export interface CaseReport {
  record: CaseRecord;
  generatedAt: string;
  evidence: ReturnType<typeof evidenceForCase>;
  verified: number;
  mismatched: number;
  pending: number;
  integrityScore: number;
  entities: typeof entities;
  contradictions: typeof contradictions;
  custody: typeof custodyEvents;
  blocks: typeof blocks;
  keyFindings: string[];
  conclusions: string[];
}

export function buildCaseReport(caseId: string, now = new Date()): CaseReport | null {
  const record = getCase(caseId);
  if (!record) return null;

  const items = evidenceForCase(caseId);
  const ids = new Set(items.map((e) => e.id));
  const verified = items.filter((e) => e.hashStatus === "Integrity Verified").length;
  const mismatched = items.filter((e) => e.hashStatus === "Integrity Mismatch").length;
  const pending = items.filter((e) => e.hashStatus === "Requires Verification").length;
  const integrityScore = items.length ? Math.round((verified / items.length) * 100) : 0;

  const caseEntities = entities.filter((e) => e.evidence.some((id) => ids.has(id)));
  const caseContradictions = contradictions.filter((c) => c.caseId === caseId);
  const custody = custodyEvents.filter((c) => ids.has(c.evidenceId));
  const caseBlocks = blocks.filter((b) => ids.has(b.evidenceId));

  const sourceList = Array.from(new Set(items.map((e) => e.source)));

  const keyFindings = [
    `${items.length} evidence item(s) were correlated across ${sourceList.length || record.sources} distinct source(s): ${sourceList.join(", ") || "—"}.`,
    `${verified} of ${items.length} item(s) match their original blockchain-anchored SHA-256 hash (integrity score ${integrityScore}%).`,
    mismatched
      ? `${mismatched} item(s) show a hash mismatch and must be re-verified before evidentiary use.`
      : "No hash mismatches were detected in this case.",
    caseContradictions.length
      ? `${caseContradictions.length} potential contradiction(s) were flagged, the strongest at ${Math.max(...caseContradictions.map((c) => c.confidence))}% AI confidence.`
      : "No potential contradictions were detected between the correlated sources.",
    `${caseEntities.length} named entity/entities were extracted by AI/NLP analysis and linked back to source evidence.`,
    `${custody.length} chain-of-custody event(s) and ${caseBlocks.length} ledger block(s) document handling of this evidence.`,
  ];

  const conclusions = [
    caseContradictions.length
      ? "The flagged statements conflict with machine-generated records; investigator verification of the underlying sources is required before any conclusion is drawn."
      : "Correlated sources are consistent within the analysed interval.",
    mismatched
      ? "At least one artefact no longer matches its anchored hash. Treat that artefact as unverified and re-acquire it from the original source."
      : "All analysed artefacts remain byte-identical to their anchored originals.",
    "All AI output in this report is assistive only. Nothing here establishes guilt, intent or identity.",
  ];

  return {
    record,
    generatedAt: now.toISOString().slice(0, 16).replace("T", " ") + " UTC",
    evidence: items,
    verified,
    mismatched,
    pending,
    integrityScore,
    entities: caseEntities,
    contradictions: caseContradictions,
    custody,
    blocks: caseBlocks,
    keyFindings,
    conclusions,
  };
}

export function reportToText(r: CaseReport): string {
  const line = "=".repeat(72);
  return [
    line,
    "PATCH X — INVESTIGATION REPORT (SYNTHETIC DEMO DATA)",
    line,
    `Case ID           : ${r.record.id}`,
    `Case Name         : ${r.record.name}`,
    `Lead Investigator : ${r.record.investigator}`,
    `Status            : ${r.record.status}`,
    `Integrity         : ${r.record.integrity} (score ${r.integrityScore}%)`,
    `Created / Updated : ${r.record.created} / ${r.record.updated}`,
    `Generated         : ${r.generatedAt}`,
    "",
    "1. CASE SUMMARY",
    r.record.description,
    "",
    "2. KEY FINDINGS",
    ...r.keyFindings.map((f, i) => `  ${i + 1}. ${f}`),
    "",
    "3. EVIDENCE INVENTORY",
    ...r.evidence.map(
      (e) =>
        `  ${e.id} | ${e.fileName} | ${e.type} | ${e.source} | ${e.hashStatus} | ${e.date} ${e.time} | SHA-256 ${shortHash(e.originalHash, 32)}`,
    ),
    "",
    "4. AI / NLP EXTRACTED ENTITIES",
    ...(r.entities.length
      ? r.entities.map((e) => `  ${e.category}: ${e.value} (${e.confidence}% — ${e.evidence.join(", ")})`)
      : ["  None linked to this case."]),
    "",
    "5. POTENTIAL CONTRADICTIONS",
    ...(r.contradictions.length
      ? r.contradictions.flatMap((c) => [
          `  [${c.id}] ${c.type} — ${c.confidence}% confidence — ${c.reviewed ? "reviewed" : "pending review"}`,
          `      A (${c.a.evidenceId} ${c.a.label}): "${c.a.statement}"`,
          `      B (${c.b.evidenceId} ${c.b.label}): "${c.b.statement}"`,
          `      Note: ${c.explanation}`,
        ])
      : ["  None detected."]),
    "",
    "6. CHAIN OF CUSTODY",
    ...(r.custody.length
      ? r.custody.map(
          (c) =>
            `  ${c.date} ${c.time} | ${c.evidenceId} | ${c.action} | ${c.person}${c.transferTo ? ` -> ${c.transferTo}` : ""} | ${c.location}`,
        )
      : ["  No custody events recorded."]),
    "",
    "7. BLOCKCHAIN VERIFICATION",
    ...(r.blocks.length
      ? r.blocks.map(
          (b) => `  BLOCK #${b.number} | ${b.evidenceId} | ${b.event} | ${b.status} | hash ${shortHash(b.hash, 32)}`,
        )
      : ["  No ledger blocks for this case."]),
    "",
    "8. CONCLUSIONS",
    ...r.conclusions.map((c, i) => `  ${i + 1}. ${c}`),
    "",
    line,
    "AI-assisted output. Requires investigator verification.",
    line,
  ].join("\n");
}
