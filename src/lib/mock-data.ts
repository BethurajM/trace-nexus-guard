/**
 * PATCH X mock data layer.
 *
 * Everything here is synthetic demo data for the frontend prototype.
 * A future backend (Flask/FastAPI + DB + AI/NLP + hashing + permissioned
 * blockchain + authorized external records API) can replace each exported
 * accessor below with a real network call without touching the UI.
 */

export type CaseStatus = "Active" | "Under Review" | "Closed";
export type IntegrityStatus = "Integrity Verified" | "Integrity Mismatch" | "Requires Verification";

export interface CaseRecord {
  id: string;
  name: string;
  description: string;
  investigator: string;
  evidenceCount: number;
  sources: number;
  contradictions: number;
  integrity: IntegrityStatus;
  integrityAlerts: number;
  status: CaseStatus;
  created: string;
  updated: string;
}

export interface EvidenceItem {
  id: string;
  fileName: string;
  type: string;
  source: string;
  caseId: string;
  hashStatus: IntegrityStatus;
  originalHash: string;
  currentHash: string;
  uploadedBy: string;
  date: string;
  time: string;
  size: string;
  status: "Analyzed" | "Pending Analysis" | "Under Review";
}

export interface EntityItem {
  category: string;
  value: string;
  confidence: number;
  evidence: string[];
}

export interface Contradiction {
  id: string;
  caseId: string;
  type: string;
  confidence: number;
  detectedAt: string;
  a: { evidenceId: string; label: string; statement: string };
  b: { evidenceId: string; label: string; statement: string };
  explanation: string;
  reviewed: boolean;
}

export interface CustodyEvent {
  id: string;
  evidenceId: string;
  evidenceName: string;
  action: string;
  person: string;
  transferTo?: string;
  date: string;
  time: string;
  location: string;
}

export interface Block {
  number: number;
  txId: string;
  evidenceId: string;
  event: string;
  timestamp: string;
  prevHash: string;
  hash: string;
  recordedBy: string;
  status: "Blockchain Record Verified" | "Requires Verification";
}

const HASHES = [
  "8f14e45fceea167a5a36dedd4bea2543f4b1c9a7d2e6b0c9182ab77e5f6d31ac",
  "c4ca4238a0b923820dcc509a6f75849b3d1e77a9b6c0f5a41d2b8e93c7a06f52",
  "a87ff679a2f3e71d9181a67b7542122c8bd9f0e4c3a1d6b25e7f8091ac34bd67",
  "e4da3b7fbbce2345d7772b0674a318d5991c7fa0b6d38e2149c05af7be31d2c8",
  "1679091c5a880faf6fb5e6087eb1b2dc70a4c3f19e8b2d605a17cf3e9b04d281",
  "8277e0910d750195b448797616e091ad2ce4b9f8dd310a5c66f0b71e9c8342da",
  "45c48cce2e2d7fbdea1afc51c7c6ad26b5f0a3e19d8c72b4106fae35d7c9018b",
  "d3d9446802a44259755d38e6d163e820c1f7ba5d0e934a6178c2b95e401df6ac",
  "6512bd43d9caa6e02c990b0a82652dca4b7e19d0c5a3f286b1704ce9df82a35d",
  "c20ad4d76fe97759aa27a0c99bff67109ad5e0b3c1f7284a6d90bce43f15a072",
];

export const investigator = {
  name: "Investigator A",
  role: "Authorized Investigator",
  badge: "INV-2026-0041",
  unit: "Cyber Forensics Division",
  email: "investigator.a@patchx.gov.in",
  status: "Online" as const,
};

export const cases: CaseRecord[] = [
  {
    id: "CASE-2026-001",
    name: "Unauthorized System Access Investigation",
    description:
      "Suspected unauthorized access to internal workstation Office-PC-04 outside working hours. Correlating access logs, chat records and statements.",
    investigator: "Investigator A",
    evidenceCount: 24,
    sources: 6,
    contradictions: 3,
    integrity: "Integrity Mismatch",
    integrityAlerts: 1,
    status: "Active",
    created: "2026-02-04",
    updated: "2026-08-29 18:42",
  },
  {
    id: "CASE-2026-002",
    name: "Suspicious Financial Activity",
    description:
      "Review of layered transaction records and email correspondence indicating possible structuring across three accounts.",
    investigator: "Investigator A",
    evidenceCount: 31,
    sources: 5,
    contradictions: 7,
    integrity: "Integrity Verified",
    integrityAlerts: 0,
    status: "Under Review",
    created: "2026-03-19",
    updated: "2026-08-28 09:05",
  },
  {
    id: "CASE-2026-003",
    name: "Digital Identity Investigation",
    description:
      "Examination of duplicated account identifiers and device fingerprints across chat platforms and browser history exports.",
    investigator: "Analyst B",
    evidenceCount: 18,
    sources: 4,
    contradictions: 2,
    integrity: "Requires Verification",
    integrityAlerts: 2,
    status: "Active",
    created: "2026-05-02",
    updated: "2026-08-27 16:20",
  },
  {
    id: "CASE-2026-004",
    name: "Internal Data Exfiltration Review",
    description:
      "Analysis of outbound file transfers, USB mount logs and screenshots submitted by the reporting department.",
    investigator: "Investigator A",
    evidenceCount: 12,
    sources: 3,
    contradictions: 1,
    integrity: "Integrity Verified",
    integrityAlerts: 0,
    status: "Under Review",
    created: "2026-06-11",
    updated: "2026-08-25 11:58",
  },
  {
    id: "CASE-2026-005",
    name: "Compromised Mailbox Assessment",
    description:
      "Closed assessment of phishing-driven mailbox compromise. All evidence hashes reconciled with the ledger.",
    investigator: "Analyst B",
    evidenceCount: 9,
    sources: 3,
    contradictions: 0,
    integrity: "Integrity Verified",
    integrityAlerts: 0,
    status: "Closed",
    created: "2026-01-21",
    updated: "2026-07-30 14:11",
  },
];

const evidenceSeed: Array<Partial<EvidenceItem> & { id: string; fileName: string; type: string; source: string; caseId: string }> = [
  { id: "E001", fileName: "phone_image.jpg", type: "Image", source: "Mobile Device", caseId: "CASE-2026-001" },
  { id: "E003", fileName: "witness_statement.pdf", type: "PDF", source: "Interview Record", caseId: "CASE-2026-001" },
  { id: "E004", fileName: "chat_export_rahul.json", type: "Chat", source: "Messaging App", caseId: "CASE-2026-001" },
  { id: "E008", fileName: "auth_login_events.log", type: "System Log", source: "Domain Controller", caseId: "CASE-2026-001" },
  { id: "E012", fileName: "transactions_q1.csv", type: "CSV", source: "Bank Statement Export", caseId: "CASE-2026-002" },
  { id: "E015", fileName: "desktop_screenshot.png", type: "Screenshot", source: "Office-PC-04", caseId: "CASE-2026-001" },
  { id: "E018", fileName: "mail_thread_finance.eml", type: "Email", source: "Mail Server", caseId: "CASE-2026-002" },
  { id: "E021", fileName: "browser_history.sqlite", type: "Browser History", source: "Office-PC-04", caseId: "CASE-2026-003" },
  { id: "E022", fileName: "usb_mount_events.log", type: "System Log", source: "Endpoint Agent", caseId: "CASE-2026-004" },
  { id: "E024", fileName: "cctv_frame_2042.jpg", type: "Image", source: "Facility CCTV", caseId: "CASE-2026-001" },
  { id: "E027", fileName: "wallet_ledger.csv", type: "Transaction Record", source: "Exchange Export", caseId: "CASE-2026-002" },
  { id: "E030", fileName: "device_profile.json", type: "Document", source: "Endpoint Agent", caseId: "CASE-2026-003" },
];

export const evidence: EvidenceItem[] = evidenceSeed.map((e, i) => {
  const original = HASHES[i % HASHES.length];
  const mismatch = e.id === "E015";
  const pending = e.id === "E030" || e.id === "E022";
  return {
    hashStatus: mismatch ? "Integrity Mismatch" : pending ? "Requires Verification" : "Integrity Verified",
    originalHash: original,
    currentHash: mismatch ? HASHES[(i + 3) % HASHES.length] : original,
    uploadedBy: i % 3 === 0 ? "Investigator A" : "Analyst B",
    date: `2026-08-${String(10 + i).padStart(2, "0")}`,
    time: `${String(9 + (i % 9)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    size: `${(0.4 + i * 1.37).toFixed(1)} MB`,
    status: pending ? "Pending Analysis" : i % 4 === 1 ? "Under Review" : "Analyzed",
    ...e,
  } as EvidenceItem;
});

export const evidenceTypes = [
  "Image",
  "Screenshot",
  "PDF",
  "Email",
  "Chat",
  "CSV",
  "System Log",
  "Transaction Record",
  "Browser History",
  "Document",
];

export const evidenceSources = [
  "Mobile Device",
  "Office-PC-04",
  "Mail Server",
  "Messaging App",
  "Domain Controller",
  "Bank Statement Export",
  "Facility CCTV",
  "Endpoint Agent",
  "Interview Record",
];

export const entities: EntityItem[] = [
  { category: "People", value: "Rahul Kumar", confidence: 94, evidence: ["E001", "E004", "E008"] },
  { category: "People", value: "Anita Verma", confidence: 81, evidence: ["E003", "E018"] },
  { category: "Organizations", value: "Northline Systems Pvt Ltd", confidence: 88, evidence: ["E018", "E012"] },
  { category: "Locations", value: "Chennai", confidence: 92, evidence: ["E001", "E024"] },
  { category: "Locations", value: "Anna Salai Office Block", confidence: 76, evidence: ["E024"] },
  { category: "Dates", value: "2026-08-14", confidence: 97, evidence: ["E008", "E015"] },
  { category: "Times", value: "08:42 PM", confidence: 95, evidence: ["E008"] },
  { category: "Times", value: "08:00 PM", confidence: 90, evidence: ["E003"] },
  { category: "IP Addresses", value: "192.168.1.20", confidence: 96, evidence: ["E008", "E021"] },
  { category: "IP Addresses", value: "103.21.244.17", confidence: 72, evidence: ["E021"] },
  { category: "URLs", value: "https://portal.northline.internal/login", confidence: 84, evidence: ["E021"] },
  { category: "Devices", value: "Office-PC-04", confidence: 93, evidence: ["E008", "E015", "E022"] },
  { category: "Accounts", value: "rahul_01", confidence: 89, evidence: ["E004", "E008"] },
  { category: "Transactions", value: "TXN-88421 — ₹1,20,000", confidence: 79, evidence: ["E012", "E027"] },
];

export const entityCategories = [
  "People",
  "Organizations",
  "Locations",
  "Dates",
  "Times",
  "IP Addresses",
  "URLs",
  "Devices",
  "Accounts",
  "Transactions",
];

export interface Relationship {
  id: string;
  from: string;
  to: string;
  label: string;
  confidence: number;
  supporting: string[];
  note: string;
}

export const correlationNodes = [
  { id: "rahul", label: "Rahul Kumar", kind: "Person", x: 50, y: 50 },
  { id: "E001", label: "Email E001", kind: "Email", x: 50, y: 12 },
  { id: "E004", label: "Chat E004", kind: "Chat", x: 86, y: 32 },
  { id: "E008", label: "Login Log E008", kind: "System Log", x: 82, y: 78 },
  { id: "E012", label: "Transaction E012", kind: "Transaction", x: 32, y: 88 },
  { id: "E015", label: "Screenshot E015", kind: "Screenshot", x: 12, y: 34 },
] as const;

export const relationships: Relationship[] = [
  {
    id: "r1",
    from: "Rahul Kumar",
    to: "Email E001",
    label: "Entity Match",
    confidence: 94,
    supporting: ["E001", "E004"],
    note: "Sender display name and signature block match the extracted person entity across two sources.",
  },
  {
    id: "r2",
    from: "Account rahul_01",
    to: "Chat E004",
    label: "Account Relationship",
    confidence: 89,
    supporting: ["E004", "E008"],
    note: "Chat handle rahul_01 resolves to the same directory account referenced in the authentication log.",
  },
  {
    id: "r3",
    from: "Device Office-PC-04",
    to: "Login Log E008",
    label: "Device Correlation",
    confidence: 93,
    supporting: ["E008", "E015", "E022"],
    note: "Hostname appears in login events, screenshot metadata and USB mount records.",
  },
  {
    id: "r4",
    from: "IP 192.168.1.20",
    to: "Screenshot E015",
    label: "Network Correlation",
    confidence: 86,
    supporting: ["E008", "E015", "E021"],
    note: "Internal address recorded in session log matches the network overlay captured in the screenshot.",
  },
  {
    id: "r5",
    from: "Rahul Kumar",
    to: "Transaction E012",
    label: "Account to Transaction",
    confidence: 78,
    supporting: ["E012", "E027"],
    note: "Beneficiary reference partially matches the account identifier. Requires Verification.",
  },
];

export const contradictions: Contradiction[] = [
  {
    id: "C-001",
    caseId: "CASE-2026-001",
    type: "Temporal / Location Conflict",
    confidence: 87,
    detectedAt: "2026-08-29 18:05",
    a: { evidenceId: "E003", label: "Statement", statement: "Rahul was at home at 8:00 PM." },
    b: {
      evidenceId: "E008",
      label: "Login Log",
      statement: "Rahul's account logged into Office-PC-04 at 8:42 PM.",
    },
    explanation:
      "A recorded statement places the person at a residential location while an authentication log records an on-premise session 42 minutes later. This is a Potential Contradiction and Requires Investigator Verification.",
    reviewed: false,
  },
  {
    id: "C-002",
    caseId: "CASE-2026-001",
    type: "Device Attribution Conflict",
    confidence: 74,
    detectedAt: "2026-08-28 15:22",
    a: { evidenceId: "E004", label: "Chat Message", statement: "I don't have access to that workstation." },
    b: {
      evidenceId: "E022",
      label: "Endpoint Log",
      statement: "Account rahul_01 mounted an external device on Office-PC-04.",
    },
    explanation:
      "A chat message denies workstation access while an endpoint log records an interactive session under a correlated account. Potential Contradiction only.",
    reviewed: false,
  },
  {
    id: "C-003",
    caseId: "CASE-2026-002",
    type: "Financial Amount Conflict",
    confidence: 68,
    detectedAt: "2026-08-27 10:44",
    a: { evidenceId: "E018", label: "Email", statement: "The transfer was ₹40,000 in total." },
    b: { evidenceId: "E012", label: "Transaction Record", statement: "TXN-88421 recorded ₹1,20,000." },
    explanation:
      "Stated transfer value differs from the exported transaction record for the same reference window. Requires Verification against the originating institution.",
    reviewed: true,
  },
  {
    id: "C-004",
    caseId: "CASE-2026-003",
    type: "Identity Consistency Conflict",
    confidence: 81,
    detectedAt: "2026-08-26 12:09",
    a: { evidenceId: "E021", label: "Browser History", statement: "Session opened under profile 'a.verma'." },
    b: { evidenceId: "E030", label: "Device Profile", statement: "Device registered solely to 'rahul_01'." },
    explanation:
      "Two sources attribute the same device session to different account identifiers within the same interval.",
    reviewed: false,
  },
];

export const custodyEvents: CustodyEvent[] = [
  {
    id: "CC-1",
    evidenceId: "E001",
    evidenceName: "Phone Image",
    action: "Evidence Collected",
    person: "Investigator A",
    date: "2026-08-14",
    time: "10:30 AM",
    location: "Chennai — Field Site 2",
  },
  {
    id: "CC-2",
    evidenceId: "E001",
    evidenceName: "Phone Image",
    action: "Evidence Transferred",
    person: "Investigator A",
    transferTo: "Analyst B",
    date: "2026-08-14",
    time: "11:15 AM",
    location: "Forensics Lab — Intake Desk",
  },
  {
    id: "CC-3",
    evidenceId: "E001",
    evidenceName: "Phone Image",
    action: "Evidence Accessed",
    person: "Analyst B",
    date: "2026-08-14",
    time: "12:00 PM",
    location: "Forensics Lab — Bay 3",
  },
  {
    id: "CC-4",
    evidenceId: "E001",
    evidenceName: "Phone Image",
    action: "Analysis Completed",
    person: "Analyst B",
    date: "2026-08-14",
    time: "02:30 PM",
    location: "Forensics Lab — Bay 3",
  },
  {
    id: "CC-5",
    evidenceId: "E001",
    evidenceName: "Phone Image",
    action: "Evidence Returned",
    person: "Analyst B",
    transferTo: "Investigator A",
    date: "2026-08-14",
    time: "04:00 PM",
    location: "Forensics Lab — Intake Desk",
  },
  {
    id: "CC-6",
    evidenceId: "E008",
    evidenceName: "Auth Login Events",
    action: "Evidence Collected",
    person: "Analyst B",
    date: "2026-08-16",
    time: "09:05 AM",
    location: "Data Centre — Rack 12",
  },
  {
    id: "CC-7",
    evidenceId: "E008",
    evidenceName: "Auth Login Events",
    action: "Evidence Examined",
    person: "Investigator A",
    date: "2026-08-16",
    time: "01:40 PM",
    location: "Forensics Lab — Bay 1",
  },
];

export const blocks: Block[] = [
  {
    number: 1021,
    txId: "0xTX-9f21a7c4",
    evidenceId: "E001",
    event: "Evidence Registered",
    timestamp: "2026-08-14 10:30 AM",
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: HASHES[0]!,
    recordedBy: "Investigator A",
    status: "Blockchain Record Verified",
  },
  {
    number: 1022,
    txId: "0xTX-b7e30d19",
    evidenceId: "E001",
    event: "Evidence Transferred",
    timestamp: "2026-08-14 11:15 AM",
    prevHash: HASHES[0]!,
    hash: HASHES[1]!,
    recordedBy: "Investigator A",
    status: "Blockchain Record Verified",
  },
  {
    number: 1023,
    txId: "0xTX-4c8a1e62",
    evidenceId: "E001",
    event: "Evidence Accessed",
    timestamp: "2026-08-14 12:00 PM",
    prevHash: HASHES[1]!,
    hash: HASHES[2]!,
    recordedBy: "Analyst B",
    status: "Blockchain Record Verified",
  },
  {
    number: 1024,
    txId: "0xTX-2d5f90ab",
    evidenceId: "E008",
    event: "Evidence Registered",
    timestamp: "2026-08-16 09:05 AM",
    prevHash: HASHES[2]!,
    hash: HASHES[3]!,
    recordedBy: "Analyst B",
    status: "Blockchain Record Verified",
  },
  {
    number: 1025,
    txId: "0xTX-7a1c44de",
    evidenceId: "E015",
    event: "Integrity Check Recorded",
    timestamp: "2026-08-22 04:18 PM",
    prevHash: HASHES[3]!,
    hash: HASHES[4]!,
    recordedBy: "Investigator A",
    status: "Requires Verification",
  },
  {
    number: 1026,
    txId: "0xTX-e903b6f1",
    evidenceId: "E024",
    event: "Evidence Registered",
    timestamp: "2026-08-29 06:12 PM",
    prevHash: HASHES[4]!,
    hash: HASHES[5]!,
    recordedBy: "Investigator A",
    status: "Blockchain Record Verified",
  },
];

export const recentActivity = [
  { tone: "ok", text: "Evidence E024 uploaded", time: "18:12" },
  { tone: "ok", text: "SHA-256 hash generated", time: "18:12" },
  { tone: "ok", text: "Evidence registered on blockchain", time: "18:13" },
  { tone: "warn", text: "Potential contradiction detected", time: "18:05" },
  { tone: "ok", text: "Evidence transferred to Analyst B", time: "17:44" },
  { tone: "ok", text: "Evidence integrity verified", time: "17:20" },
] as const;

export const dashboardStats = [
  { label: "Active Cases", value: 12, tone: "primary", hint: "2 opened this week" },
  { label: "Total Evidence", value: 248, tone: "info", hint: "Across 6 source types" },
  { label: "Verified Evidence", value: 231, tone: "primary", hint: "93% integrity verified" },
  { label: "Potential Contradictions", value: 17, tone: "warning", hint: "Requires verification" },
  { label: "Integrity Alerts", value: 3, tone: "destructive", hint: "Hash mismatch detected" },
  { label: "External Matches", value: 8, tone: "info", hint: "Pending human review" },
] as const;

export interface ExternalMatch {
  matched: boolean;
  confidence: number;
  fields: { field: string; matched: boolean; value: string }[];
  source: string;
  reference: string;
}

export function mockExternalLookup(name: string): ExternalMatch {
  const matched = name.trim().toLowerCase().length > 0 && !name.trim().toLowerCase().startsWith("z");
  return matched
    ? {
        matched: true,
        confidence: 91,
        fields: [
          { field: "Name", matched: true, value: name.trim() },
          { field: "Location", matched: true, value: "Chennai, Tamil Nadu" },
          { field: "Reference Number", matched: true, value: "REF-IN-77219" },
          { field: "Date of Record", matched: false, value: "2026-04-12" },
        ],
        source: "Authorized External Records (Synthetic Dataset)",
        reference: "REF-IN-77219",
      }
    : {
        matched: false,
        confidence: 0,
        fields: [],
        source: "Authorized External Records (Synthetic Dataset)",
        reference: "—",
      };
}

export function getCase(id: string) {
  return cases.find((c) => c.id === id);
}

export function evidenceForCase(id: string) {
  return evidence.filter((e) => e.caseId === id);
}

export function shortHash(hash: string, n = 12) {
  return `${hash.slice(0, n)}...`;
}
