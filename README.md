# Patchwork Intelligence

Build a complete, modern, professional frontend web application called PATCH X.

PROJECT NAME

PATCH X

Full Project Title

AI-Powered Cross-Source Digital Evidence Correlation and Contradiction Detection with Blockchain-Based Evidence Integrity and Chain-of-Custody Verification

---

PROJECT PURPOSE

PATCH X is an AI-powered digital forensics and evidence intelligence platform designed for authorized investigators.

The system collects digital evidence from multiple sources such as emails, chats, screenshots, images, documents, system logs, browser history, and transaction records.

The AI analyzes these different evidence sources, extracts important entities and events, correlates related information across sources, and identifies potential contradictions or inconsistencies.

The system also uses SHA-256 cryptographic hashing and blockchain to maintain evidence integrity and a tamper-evident record of evidence-related events.

The platform maintains a chain of custody, recording who collected, accessed, transferred, or examined each evidence item.

PATCH X can also compare permitted person/case information with an authorized external records source or synthetic/mock government dataset and identify possible matching records.

The system is an investigator-assistance tool. It must never automatically declare a person guilty or innocent.

Use terms such as:

- Potential Match

- Potential Contradiction

- Requires Verification

- Integrity Verified

- Integrity Mismatch

- Blockchain Record Verified

---

DESIGN STYLE

Create a premium, professional cybersecurity + digital-forensics interface.

Theme

- Dark black/charcoal background

- Emerald green primary accent

- Electric blue secondary accent

- White/light-gray text

- Red/orange only for warnings and alerts

- Subtle glassmorphism

- Subtle glowing borders

- Clean cards

- Soft shadows

- Professional typography

- Minimal animations

- High readability

- Modern cybersecurity aesthetic

Do NOT make it look like a gaming website.

Do NOT overuse neon effects.

The interface should look like a serious digital investigation platform that could be demonstrated to SIH/hackathon judges.

---

MAIN LAYOUT

Create:

Left Sidebar

Display PATCH X logo/name at the top.

Navigation:

- Dashboard

- Cases

- Evidence

- AI Analysis

- Cross-Source Correlation

- Contradictions

- External Records

- Chain of Custody

- Blockchain Ledger

- Verification

- Reports

- Settings

- Logout

At the bottom:

Investigator A

Authorized Investigator

● Online

---

1. LOGIN PAGE

Create a secure professional login screen.

Logo:

PATCH X

Subtitle:

Digital Evidence Intelligence & Integrity Platform

Fields:

- Email / Username

- Password

Buttons:

- Sign In

- Forgot Password

Display:

🔐 Authorized Personnel Only

After login, navigate to Dashboard.

---

2. DASHBOARD

Title:

Investigation Dashboard

Subtitle:

Monitor cases, evidence, AI findings and integrity status.

Top search bar:

Search cases, evidence or entities...

Statistics

Create six cards:

Active Cases

12

Total Evidence

248

Verified Evidence

231

Potential Contradictions

17

Integrity Alerts

3

External Matches

8

Use appropriate icons and status indicators.

---

ACTIVE CASES

Create a professional table:

Case ID| Case Name| Evidence| Contradictions| Integrity| Status| Last Updated

Example cases:

CASE-2026-001

Unauthorized System Access Investigation

CASE-2026-002

Suspicious Financial Activity

CASE-2026-003

Digital Identity Investigation

Use status badges:

- Active

- Under Review

- Closed

Add:

View Case

---

RECENT ACTIVITY

Create a timeline:

✓ Evidence E024 uploaded

✓ SHA-256 hash generated

✓ Evidence registered on blockchain

⚠ Potential contradiction detected

✓ Evidence transferred to Analyst B

✓ Evidence integrity verified

---

3. CASES PAGE

Title:

Cases

Button:

+ Create New Case

Add:

- Search

- Filter

- Sort

Display cases in cards/table.

Each case contains:

- Case ID

- Case name

- Description

- Investigator

- Evidence count

- Potential contradictions

- Integrity status

- Case status

- Created date

- Last updated

Clicking a case should open a detailed Case page.

---

4. CASE DETAILS

Example:

CASE-2026-001

Unauthorized System Access Investigation

Top summary cards:

Evidence: 24

Sources: 6

Potential Contradictions: 3

Integrity Alerts: 1

Create tabs:

- Overview

- Evidence

- AI Findings

- Contradictions

- External Matches

- Chain of Custody

- Blockchain

---

5. EVIDENCE PAGE

Title:

Digital Evidence

Button:

+ Upload Evidence

Supported evidence types:

- Images

- Screenshots

- PDFs

- Emails

- Chats

- CSV files

- System logs

- Transaction records

Create evidence table:

- Evidence ID

- File Name

- Type

- Source

- Case ID

- SHA-256 Status

- Uploaded By

- Date

- Status

- Actions

Example:

E001

phone_image.jpg

Image

Mobile Device

CASE-2026-001

✓ Verified

---

6. UPLOAD EVIDENCE

Create a drag-and-drop upload interface.

Title:

Upload Digital Evidence

Fields:

- Case ID

- Evidence Type

- Evidence Source

- Description

- Collected By

- Collection Date

- Collection Time

After upload, show a processing animation:

1. Evidence received

2. Metadata extracted

3. SHA-256 hash generated

4. Evidence securely stored

5. Blockchain record created

Then show:

Evidence ID: E001

SHA-256 Hash:

"8f14e45fceea167a5a36dedd4bea2543..."

Add a copy button.

Clearly explain visually:

Actual evidence file is stored separately. Evidence hash and relevant metadata are recorded for integrity verification.

---

7. EVIDENCE DETAILS

When an evidence item is selected, show:

Evidence Information

- Evidence ID

- Case ID

- File name

- File type

- File size

- Source

- Collected by

- Collection timestamp

Integrity Verification

Show:

Original SHA-256

"8f14e45f..."

Current SHA-256

"8f14e45f..."

Status:

✓ INTEGRITY VERIFIED

Message:

“Current evidence matches the recorded evidence fingerprint.”

Also create a second mock state for:

⚠ INTEGRITY MISMATCH

“Current evidence does not match the previously recorded hash. Investigation required.”

---

8. AI ANALYSIS

Title:

AI Evidence Analysis

Allow the investigator to select:

- Single evidence

- Multiple evidence files

- Entire case

Button:

Run AI Analysis

Show simulated processing:

Analyzing evidence...

Extracting entities...

Normalizing information...

Correlating sources...

Checking for potential contradictions...

Then display:

Extracted Entities

Cards for:

- People

- Organizations

- Locations

- Dates

- Times

- IP Addresses

- URLs

- Devices

- Accounts

- Transactions

Example:

Person → Rahul Kumar

Location → Chennai

IP → 192.168.1.20

Device → Office-PC-04

Time → 08:42 PM

---

9. CROSS-SOURCE CORRELATION

This is one of the MOST IMPORTANT pages.

Title:

Cross-Source Evidence Correlation

Show a visual relationship/network graph.

Example central entity:

Rahul Kumar

Connections:

Rahul Kumar

↓

Email E001

↓

Chat E004

↓

Login Log E008

↓

Transaction E012

↓

Screenshot E015

Use nodes and connecting lines.

Show:

Detected Relationships

Person → Rahul Kumar

Account → rahul_01

Device → Office-PC-04

IP → 192.168.1.20

Show confidence:

Entity Match: 94%

Account Relationship: 89%

Clicking a relationship should display the supporting evidence.

---

10. CONTRADICTIONS

Title:

Potential Contradictions

Create professional warning cards.

Example:

⚠ POTENTIAL CONTRADICTION

Evidence E003 — Statement

“Rahul was at home at 8:00 PM.”

VS

Evidence E008 — Login Log

“Rahul's account logged into Office-PC at 8:42 PM.”

Show:

- Evidence involved

- Contradiction type

- Time

- AI confidence

- Explanation

- View Evidence

- Mark as Reviewed

Use confidence:

87%

Important:

Never use wording like:

“Rahul committed the crime.”

Instead use:

Potential Contradiction

Requires Investigator Verification

---

11. EXTERNAL RECORDS

Title:

Authorized External Record Matching

Subtitle:

“Compare permitted case/person information with an authorized external source or approved dataset.”

Create input fields:

- Name

- Case / Reference Number

- Location

- Date

- Other permitted identifier

Button:

Check External Records

Use mock/synthetic data for the frontend prototype.

Example result:

POSSIBLE MATCH FOUND

Matching fields:

✓ Name

✓ Location

✓ Reference Number

Match Confidence:

91%

Source:

Authorized External Records

Status:

Requires Human Verification

Also create a “No Matching Record Found” state.

Important:

Do NOT present this as an unrestricted public criminal-record search.

---

12. CHAIN OF CUSTODY

Title:

Chain of Custody

Create a highly visual vertical timeline.

Example:

E001 — Phone Image

10:30 AM

Investigator A

✓ Evidence Collected

↓

11:15 AM

Investigator A → Analyst B

✓ Evidence Transferred

↓

12:00 PM

Analyst B

✓ Evidence Accessed

↓

02:30 PM

Analyst B

✓ Analysis Completed

↓

04:00 PM

Analyst B → Investigator A

✓ Evidence Returned

Each event should show:

- Person

- Action

- Date

- Time

- Evidence ID

- Location if available

---

13. BLOCKCHAIN LEDGER

Title:

Blockchain Evidence Ledger

Create a visual blockchain interface.

Show connected blocks:

BLOCK #1021

Evidence Registered

Evidence ID: E001

Timestamp: 10:30 AM

Hash: ABC123...

↓

BLOCK #1022

Evidence Transferred

Evidence ID: E001

Timestamp: 11:15 AM

Previous Hash: ABC123...

↓

BLOCK #1023

Evidence Accessed

Evidence ID: E001

Timestamp: 12:00 PM

Show blockchain status:

✓ Blockchain Record Verified

Each block should be clickable and display:

- Block number

- Transaction ID

- Evidence ID

- Event

- Timestamp

- Previous block hash

- Current block hash

- Recorded by

- Status

---

14. VERIFICATION

Title:

Evidence Integrity Verification

Create an interface where an investigator can select evidence.

Show:

Original Recorded Hash

VS

Current Calculated Hash

If equal:

✓ INTEGRITY VERIFIED

“Current evidence matches the recorded hash.”

If different:

⚠ INTEGRITY MISMATCH

“Current evidence does not match the previously recorded hash.”

Also show:

- Evidence ID

- Blockchain transaction

- Timestamp

- Verification timestamp

- Verification result

---

15. REPORTS

Title:

Investigation Reports

Display:

- Case summary

- Evidence summary

- AI findings

- Cross-source relationships

- Potential contradictions

- External record matches

- Integrity verification

- Chain-of-custody history

- Blockchain verification

Buttons:

Generate Report

Export PDF

Use mock functionality for now.

---

16. SETTINGS

Create:

- Investigator Profile

- Security Settings

- Notifications

- Authorized Role

- System Information

---

INTERACTION REQUIREMENTS

Make the prototype feel functional.

Implement frontend interactions for:

- Sidebar navigation

- Search

- Filters

- Case selection

- Evidence selection

- Tabs

- Upload simulation

- AI analysis simulation

- Contradiction review

- External record matching simulation

- Hash verification simulation

- Blockchain block selection

- Chain-of-custody timeline

- Modal windows

- Notifications/toasts

Use realistic mock data.

No backend is required at this stage.

Structure the code so a future backend can be connected to:

- Python Flask/FastAPI

- Database

- AI/NLP services

- SHA-256 hashing service

- Permissioned blockchain

- Authorized external API

---

CORE SYSTEM WORKFLOW

The UI should clearly represent this overall process:

Digital Evidence

↓

Evidence ID

↓

Metadata Extraction

↓

SHA-256 Hash

↓

Secure Evidence Storage

↓

Blockchain Evidence Record

↓

AI/NLP Analysis

↓

Entity Extraction

↓

Cross-Source Correlation

↓

Potential Contradiction Detection

↓

Authorized External Record Matching

↓

Chain-of-Custody Tracking

↓

Evidence Integrity Verification

↓

Investigator Review

---

FINAL UI GOAL

The final product should immediately communicate these responsibilities:

AI

Understands and analyzes evidence.

Cross-Source Correlation

Connects related information across different evidence sources.

Contradiction Detection

Identifies potential conflicts between evidence.

SHA-256 Hashing

Creates a digital fingerprint for evidence integrity checking.

Blockchain

Maintains a tamper-evident record of evidence-related events, hashes, and custody information.

Chain of Custody

Records who handled the evidence, when, and what action was performed.

Verification

Checks whether current evidence is consistent with its recorded integrity information.

External Records

Checks permitted information against an authorized external source or synthetic dataset and reports possible matches requiring human verification.

Make the application polished enough for a hackathon/SIH project demonstration, with strong visual hierarchy, realistic data, intuitive navigation, and a professional digital-forensics identity.

Use the project name PATCH X consistently throughout the application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://trace-nexus-guard.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/29ae7417-5c55-4467-9910-514f82ba72a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
