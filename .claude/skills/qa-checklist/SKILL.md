---
name: qa-checklist
description: Generate a manual QA checklist for a feature (web OR mobile), with this template's conventions baked in (platform routing, stable CHK- IDs, no [AUTO] markers, live Figma design pull, design-wins-over-SRS). Use when the user says "generate a checklist", "QA checklist for [feature]", or "create a checklist for [feature] (web/mobile)".
---

# QA Checklist Generator

Thin wrapper around the project's checklist prompts. The prompt is the **authoring spec**
(sections, style rules, examples, output format) — read it and follow it. This skill only
governs *which platform/prompt/folder*, *which inputs*, *which IDs*, and *which overrides win*.
Do NOT duplicate the prompt body here.

## Step 1 — Identify the platform (never default to web)

Decide the target using [CLAUDE.md → Platform decision rules](../../../CLAUDE.md):

- "browser", "page", "URL", "responsive", desktop Figma → **web**
- "app", "device", "iOS", "Android", "Flutter", "tap", "swipe", "push" → **mobile**
  (then resolve the sub-target: `ios`, `android`, `flutter`, or `cross-platform`)
- Cross-cutting only (a11y, security, perf, i18n), no platform → **shared** (use web prompt)

If ambiguous (e.g. "checklist for login"), **ask**: web or mobile? Do not guess.
**One run = one platform = one file.** To cover both web and mobile, run the skill twice.

## Step 2 — Pick the right prompt + inputs for that platform

### If WEB (or shared)
- **Prompt (authoring spec):** [prompts/02-generate-checklist.md](../../../prompts/02-generate-checklist.md)
- **Primary input:** `qa/analysis/web/<feature>-analysis.md` if it exists.
- **Else source docs:** `docs/srs/`, `docs/requirements/{web,shared}/`,
  `docs/business-rules/`, `docs/api/`, acceptance criteria.
- **Design map:** [docs/designs/web/figma-sources.md](../../../docs/designs/web/figma-sources.md)

### If MOBILE
- **Prompt (authoring spec):** [prompts/mobile/02-generate-mobile-checklist.md](../../../prompts/mobile/02-generate-mobile-checklist.md)
- **Primary input:** `_bmad-output/test-artifacts/test-design/mobile/<feature>-analysis.md`
  (the M01 output); fall back to `qa/analysis/mobile/<feature>-analysis.md` if present.
- **Else source docs:** `docs/srs/mobile/`, `docs/requirements/{mobile,shared}/`,
  `docs/business-rules/`, `docs/api/`.
- **Mobile-only extra inputs (required):** `docs/platform-specs/{ios,android}/` and
  `qa/device-matrix/device-matrix.md` — feed lifecycle, permissions, and device-class checks.
- **Design map:** [docs/designs/mobile/figma-sources.md](../../../docs/designs/mobile/figma-sources.md)
  (do NOT use the web map)

Resolve the **feature name** from the user's prompt; if missing, infer from the inputs and
confirm the slug before writing.

## Step 3 — Pull the design (required input, live from Figma)

Use the **platform-correct** design map from Step 2 to find the `fileKey` + `node-id` for the
feature's screen(s), via the **project-local `figma` MCP server** (its own PAT — NOT the
shared claude.ai Figma connector):

- `mcp__figma__get_figma_data` → structure
- `mcp__figma__download_figma_images` → rendered screen
  (mobile: save under `docs/designs/mobile/screens/`)

Generate checks from **SRS + design together**: cover UI elements, labels, states, and
placement visible in the design even if the SRS omits them — never invent behavior absent
from both. If a design resource is missing, note exactly what and from where in Open Questions.

## Step 4 — Apply project overrides (these win over the prompt body)

1. **No `[AUTO]` markers.** Ignore the prompt's automation-candidate guidance. No `[AUTO]`
   on any item; drop the "AUTO candidates" line from the Coverage summary. Automation
   selection is a separate step (`prompts/06`).
2. **Stable IDs on every item** — format `[CHK-<FEATURE>-<NNN>]`:
   - `<FEATURE>` = uppercased code from the slug. Mapping (same web & mobile):
     `authentication→AUTH`, `managers→MGR`, `field-technicians→FT`, `surveys→SURV`,
     `templates→TMPL`, `responses→RESP`, `photo-tags→PTAG`. Otherwise first 4 letters uppercase.
   - `<NNN>` = zero-padded 3-digit, monotonic across the **whole file** (not per section).
   - Item format: `1. [CHK-AUTH-001] Check that ...`
   - **Regeneration:** read the existing file first and PRESERVE existing IDs; new IDs only
     for new checks, numbered above the current max. IDs are the contract for
     `automation/tools/sync_checklist_to_sheets.py` — never change or reuse one.
3. **Design wins over SRS on conflict.** Write checks to match the **design**; park only
   genuinely-undefined items in Open Questions.

## Step 5 — Write to the correct platform folder

Naming `<feature>-checklist.md` (matches existing files on disk, e.g.
`authentication-checklist.md`, `managers-checklist.md`):

- web → `qa/checklists/web/<feature>-checklist.md`
- shared → `qa/checklists/shared/<feature>-checklist.md`
- mobile → `qa/checklists/mobile/{ios,android,cross-platform}/<feature>-checklist.md`
  (use the sub-target resolved in Step 1)

Follow the chosen prompt for section structure and the Coverage summary line, with the
override edits above.

## Step 6 — Report

State the file path written, item count, and any Open Questions. Suggest `prompts/06`
(automation candidates) or `/qa-test-cases` as the next step if relevant.
