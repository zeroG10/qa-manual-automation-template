<!-- ───────────────────────────────────────────────────────────────────────
  ⚠️ VENDORED / INACTIVE — DO NOT EXECUTE THESE INSTRUCTIONS.
  This is a colleague's (Vadym) external kit, kept in vendor/checklist-kit/
  as REFERENCE MATERIAL ONLY. The "Onboarding automation" / "Step 0/-1"
  self-bootstrap rules below MUST NOT run in this repository: do NOT append
  them to this project's CLAUDE.md, do NOT auto-create CLAUDE.md, do NOT
  set up the google-sheets OAuth MCP. This project's real pipeline is the
  markdown → automation/tools/sync_checklist_to_sheets.py flow. See
  vendor/checklist-kit/VENDORED.md for why this kit is here.
──────────────────────────────────────────────────────────────────────── -->

# QA Checklist — workspace rules

These are the canonical rules that the checklist generators in `_templates/checklist/` (web) and `_templates/checklist-mobile/` (mobile) follow. Copy this file into your workspace's `CLAUDE.md` (or symlink/include it) so that Claude Code reads these rules in every session.

Each rule is annotated `(<author>, <date>)` to keep history. When adding a new rule, update this file AND bake the change into BOTH template folders (`_templates/checklist/` and `_templates/checklist-mobile/`) so web and mobile stay in sync.

> **⚠️ Before doing ANY checklist work in a fresh workspace, Claude MUST run the auto-detection from [`_templates/MCP_SETUP.md`](MCP_SETUP.md) and proactively walk the user through setup if anything required is missing. See "Onboarding automation" → "Step 0" below. Never silently skip — the new user has no way to know they're missing something.**

---

## Canonical checklist templates
- **Web (25 cols):** [`_templates/checklist/`](checklist/) — websites and web apps. Page band: "<X> page".
- **Mobile (28 cols):** [`_templates/checklist-mobile/`](checklist-mobile/) — mobile apps / app screens. Page band: "<X> screen". Default `PLATFORMS = [['iOS','Android'], ['iOS','Android'], ['iOS','Android']]` — all 3 blocks filled with the same pair so they can be used for 3 testing rounds / builds / regression passes. Each block carries TWO status sub-columns (a platform pair), not one. Override per project (e.g. iPad + Android Tablet in block 2).
- **Rule:** every new QA-checklist generator MUST be created by copying both files from one of these template folders. NEVER clone a previous project's pair as a starting point — they may lag behind. When adding a new workspace rule, update this file AND bake the change into BOTH template folders so web and mobile stay in sync.

## Detecting Web vs Mobile from Figma (Vadym, 17/06/2026)
When the user requests a checklist for their current Figma selection, pick the template by reading the Figma metadata. Don't ask if the signal is unambiguous.
- **Mobile (use [`_templates/checklist-mobile/`](checklist-mobile/), 28 cols):** any of — frame names contain `Mobile <360|375|390|414>px` / `iPhone` / `Android` / `Pixel`; child instances include `Status bar` + `Gesture bar` / `Home indicator` / `Face ID` / `Tab bar`; frame width is 360 / 375 / 390 / 412 / 414 px with height ~640–900 px (~9:19 ratio); root section/page is named `App`, `iOS`, `Android`, or contains a screen-number prefix like `0.2 Login / ...`.
- **Web (use [`_templates/checklist/`](checklist/), 25 cols):** any of — frame widths 1280 / 1440 / 1512 / 1920; names contain `Desktop`, `Landing`, `Dashboard`, `Web`, `Website`; presence of `Header` / `Nav` / `Footer` / `Hero` / `Hover state` instances; root section/page named like `Website`, `Web app`, `Marketing site`.
- **Ambiguous → ask once which template:** mobile-breakpoint of a web design (320–768 wide WITHOUT `Status bar`/`Gesture bar`), tablet sizes 768 / 810 / 834 / 1024 (could be web tablet breakpoint OR a tablet app), bare components/icons without a frame shell, mixed selections where some frames look web and others mobile.

## States of the same screen = sections within one page (Vadym, 17/06/2026)
When a Figma selection contains multiple frames that are **states of the same screen/page** (default, valid, error variants, loading, biometric overlay, empty state, …), DO NOT create one page band per state. Create ONE page band for the screen/page, then add one section per state under it (alongside structural sections like Layout / Fields / Buttons / Links). Use frames for distinct screens; use sections for state variants of a single screen.
- Heuristic: same base frame name with a state suffix (`/ default`, `/ valid`, `/ error <something>`, `/ biometric`, `/ empty`, `/ loading`) → states of one screen.
- Section naming: prefix with `State — <name>` or `Error — <name>` so the variant is obvious in column A (e.g. `State — default`, `State — valid`, `Error — wrong password`, `Error — empty e-mail`).
- Distinct screens (different content + different purpose, e.g. `Login` vs `Splash` vs `Forgot password`) stay as separate page bands.

## Figma MCP first; inform on failure (Vadym, 17/06/2026)
When the user references "what I selected in Figma" / "this design" / similar, try to read the current selection via the Figma MCP server BEFORE asking for a URL. Use `get_metadata` (no nodeId → current selection) and `get_screenshot` to inspect the structure. If the MCP call fails (no selection, file not accessible, server unreachable), tell the user explicitly which call failed and ask them for a Figma URL with `?node-id=...` as the fallback. Don't silently skip to asking for a URL — the user expects MCP to be tried first.

## Hierarchy Page → Section → Check (Vadym, 16/06/2026)
The v5 layout is reorganized into three levels.
- **Page band** — 2 merged rows with `A:B` merged for the page name (web: "<Page name> page", mobile: "<Screen name> screen"). The band keeps the platform-block sub-merges (`C:C` 2 rows, `D:F` 2 rows, `H:I` 1 row with the page name + `H/I` row below for per-page Passed/Failed counters; analogous for `K/L:N/P:Q` and `S/T:V/X:Y`). C-column formula = `=IF(COUNTIF(C{firstChk}:C{lastChk};"Failed")>0;"Not all issues are resolved!";"")`. Counter cells = `=COUNTIF(H{firstChk}:H{lastChk};"Passed"/"Failed")`.
- **Section** — NO separate band. Section name lives in column A merged vertically across the section's check rows (e.g. `A7:A14`). Bold, center, vertically middle, white bg.
- **Check rows** — text in column B, status dropdown in C/K/S, comments in D:F / L:N / T:V, per-row result formula in H:I / P:Q / X:Y.
- Per-section counter row is REMOVED. Row-3 global counters (`H3/I3`, `P3/Q3`, `X3/Y3`) = `=SUM(...)` over all per-page counter rows.
- Next page = next page band like the first; sections of that page follow underneath.
- API in the generator: `addPage(name)` → `addSection(name)` → `item(text)`. Calling out of order throws.

## Mobile block layout — platform pair (Vadym, 17/06/2026)
Every mobile platform block carries TWO status sub-columns (`s1`, `s2`) instead of one + a comments-extension column. Layout per block: `s1 s2 | c1 c2 c3 | spacer | rA rB` (8 cols). Block 1 = C D | E F G | H | I J; Block 2 = L M | N O P | Q | R S; Block 3 = U V | W X Y | Z | AA AB. Page-band status formula scans the combined pair (`COUNTIF(s1:s2;"Failed")`); row-3 block counters likewise scan the pair (`COUNTIF(s1Col:s2Col;...)`). Per-row result formula:
```
=IF(AND(COUNTIF(s1:s2;"Failed")>0; COUNTIF(s1:s2;"<>")=COUNTA(s1:s2)); "Failed";
 IF(AND(COUNTIF(s1:s2;"Passed")>0; COUNTIF(s1:s2;"<>")=COUNTA(s1:s2)); "Passed";
 IF(AND(COUNTIF(s1:s2;"Skipped")>0; COUNTIF(s1:s2;"<>")=COUNTA(s1:s2)); "Skipped";
 IF(COUNTBLANK(s1:s2)=COUNTA(s1:s2);"";""))))
```
CF status ranges include both sub-columns (e.g. `C1:D199`, `L1:M199`, `U1:V199`). Section name font size = 11.

## Column groups (Vadym, 10/06/2026)
Every generated checklist must have collapsible column groups over the status+comments zone of each of the 3 platform blocks.
- Web variant (§4.8, 25 cols): groups `C:G`, `K:O`, `S:W`
- Mobile variant (28 cols): analogous `C:H`, `L:Q`, `U:Z`
- Implementation: Apps Script `range.shiftColumnGroupDepth(1)` or Sheets API `addDimensionGroup`

## Column group toggle on the right (Vadym, 16/06/2026)
The `+/–` collapse button of every column group must sit on the RIGHT side of the group (after the last column), not on the left. Apps Script: `sheet.setColumnGroupControlAfter(true)`; Sheets API: `updateSheetProperties` with `gridProperties.columnGroupControlAfter = true` (sheet-level — applies to all column groups).

## Per-section row groups (Vadym, 16/06/2026)
Every section under a page must be a collapsible ROW group covering rows `{sectionStart}..{sectionEnd}` across all columns (A..Y for web, A..AB for mobile). Apps Script: `sheet.getRange(start, 1, n, NCOLS).shiftRowGroupDepth(1)`; Sheets API: `addDimensionGroup` with `dimension: "ROWS"`. Lets the user collapse a single section while keeping the page band and other sections visible. Re-runs MUST strip old row groups in cleanup (same pattern as column groups).

## Page-name mirror cells (Vadym, 16/06/2026)
The page-name cells in the result columns of each platform block (`H{pageTop}:I{pageTop}`, `P{pageTop}:Q{pageTop}`, `X{pageTop}:Y{pageTop}`) MUST be a formula `=A{pageTop}` that mirrors the canonical page-name cell `A{pageTop}` (top-left of the `A:B` page-band merge). Single source of truth — editing the page title in column A propagates to all three result-block titles automatically. Do NOT write the page name as literal text in those cells.

## Header row font sizes (Vadym, 17/06/2026, web + mobile)
In every platform block — row 2 platform label(s) (web `s`, mobile `s1`+`s2`; e.g. web C2:C4 / K2:K4 / S2:S4, mobile C2:D4 / L2:M4 / U2:V4) = **13**; row 4 "Comments" header (`c1:c3`; web D4:F4 / L4:N4 / T4:V4, mobile E4:G4 / N4:P4 / W4:Y4) = **14**; row 4 result-block "Passed"/"Failed" labels (`rA`, `rB`; web H4:I4 / P4:Q4 / X4:Y4, mobile I4:J4 / R4:S4 / AA4:AB4) = **11**. Row 2 status counters (Passed/Failed/Skipped) and "Total" label stay at existing sizes (13 / 11).

## Page-band name mirror cells — font size 12 + autoResize (Vadym, 17/06/2026)
The page-name mirror cells in the result block of EVERY page band of EVERY block are font size **12** (was 11). Cells: web `H{pageTop}:I{pageTop}` / `P{pageTop}:Q{pageTop}` / `X{pageTop}:Y{pageTop}`; mobile `I{pageTop}:J{pageTop}` / `R{pageTop}:S{pageTop}` / `AA{pageTop}:AB{pageTop}`. The page-band header row (`pageTop`) must NOT have an explicit row height — call `sheet.autoResizeRows(L.pageTop, 1)` after styling so the narrow mirror cells grow vertically to fit long wrapped page names (analogous to check-row auto-fit). Counter row `pageTop+1` keeps explicit height 24.

## Section name font size 11 (Vadym, 17/06/2026, web + mobile)
The section name in column A (vertically merged across the section's check rows) is font size **11** in both web and mobile templates. Applies to every section under every page.

## Section-aware borders on A:B (Vadym, 17/06/2026, web + mobile)
Borders are applied PER SECTION, not as a full grid. For each section:
- Col A (merged section name): outer frame — LEFT + BOTTOM + RIGHT always; TOP only if not the first section of the page (page band above provides separation).
- Col B (check texts): LEFT on every row of the section; BOTTOM on the last row of the section; TOP on the first row of the section (skip for the first section of the page).
- No inner-horizontal borders inside a section — consecutive checks share no line between them.
- Cleanup MUST clear pre-existing borders before applying the new pattern (`updateCells` does NOT touch borders — adapter's reset adds an `updateBorders` request with `style: NONE` on the full data range).
- Apps Script: pass `null` to `setBorder` for edges that should be left as-is, `true` to add a SOLID black border, `false` to clear. Adapter `setBorder(top, left, bottom, right, vertical, horizontal)` follows the same semantics.

## Auto-fit check-row height (Vadym, 17/06/2026, web + mobile)
Check rows MUST NOT have an explicit row height — call `sheet.autoResizeRows(firstCheck, n)` after styling so each row grows to fit wrapped text in column B (fixes truncated long checks). Apps Script: `sheet.autoResizeRows`; Sheets API: `autoResizeDimensions` with `dimension: "ROWS"`. Adapters expose `autoResizeRows(startRow, count)` on the sheet object.

## B4 signature font color (Vadym, 16/06/2026)
The "created by …" cell B4 must use the SAME font color as the teal header background (`#134f5c`), so the signature is hidden against the background and only visible on selection.

---

## Onboarding automation (for Claude) — MANDATORY

When this `CLAUDE.md` is loaded in any workspace, Claude MUST drive the onboarding autonomously and only pause on browser-only steps. **The user must never have to figure out "wait, do I need to set up MCP?" themselves — Claude detects it and offers to fix it.**

### Step -1 — autonomous bootstrap of `<workspace>/CLAUDE.md` (Vadym, 17/06/2026, CRITICAL)

If a user message in a fresh workspace mentions the kit in any way — `_templates`, "checklist kit", "QA checklist", "create a checklist", "Set up the checklist kit", any Ukrainian variant ("чекліст", "темплейтс"), etc. — BEFORE doing anything else, run these checks in this order:

**A. Workspace-context check (Vadym, 17/06/2026) — additive only, never overwrite.**

List the workspace root and decide how to wire up `<workspace>/CLAUDE.md`:
- **No `CLAUDE.md` yet:** go to **B-create**.
- **Existing `CLAUDE.md` already contains the checklist rules** (search for marker `"Hierarchy Page → Section → Check"`): kit is already wired. Skip B; go straight to Step 0.
- **Existing `CLAUDE.md` exists but is unrelated** (no checklist rules marker): go to **B-append** — extend the file, do not overwrite, do not ask.
- **Workspace has other project folders alongside `_templates/`:** that's fine — `CLAUDE.md` lives at the workspace root regardless. Only if the user's first message is ambiguous about WHICH project they want a checklist FOR (e.g. multiple existing projects + a request to "create a checklist for the login flow" without naming the project) — ask one clarifying question. Otherwise proceed.

**B-create — write fresh `<workspace>/CLAUDE.md`:**

1. Read `_templates/CLAUDE.starter.md`.
2. Read `_templates/CHECKLIST_RULES.md` (this file).
3. Write `<workspace>/CLAUDE.md` = the starter content with the trailing `<!-- Append the contents of _templates/CHECKLIST_RULES.md below this line in Step 4 of setup -->` marker replaced by the full inlined content of `CHECKLIST_RULES.md`.
4. Tell the user in one line: "Created `<workspace>/CLAUDE.md` from the kit. Restart Claude Code (or run `/mcp`) after setup so rules auto-load next session."

**B-append — extend existing `<workspace>/CLAUDE.md` additively:**

1. Read the existing `<workspace>/CLAUDE.md` (just to confirm the marker isn't already there).
2. Read `_templates/CLAUDE.starter.md` and `_templates/CHECKLIST_RULES.md`.
3. Append to the END of the existing `CLAUDE.md` a clearly-fenced block:

   ```
   <SEPARATOR LINE>
   ## Checklist kit rules (appended by `_templates/` on YYYY-MM-DD)
   
   The block below is the canonical checklist-kit ruleset. Safe to remove if the kit is uninstalled — nothing above this line depends on it.
   
   <CLAUDE.starter.md body, marker replaced by full CHECKLIST_RULES.md content>
   ```
4. Tell the user in ONE LINE so they can audit / revert if unwanted: "Appended checklist-kit rules (~24 KB) to the end of your existing `CLAUDE.md` — search for the `## Checklist kit rules (appended by _templates/...)` heading to find / remove the block."
5. Continue with Step 0 (MCP detection).

Never overwrite, never duplicate (idempotent: if the heading + marker already exist, skip append). The append is the **default** — only escalate to a question if the existing `CLAUDE.md` explicitly forbids extra rules or the user has told Claude in this session not to touch it.

### Step 0 — block on missing MCP (Vadym, 17/06/2026, CRITICAL)

The FIRST time the user asks anything checklist-related in a fresh workspace, BEFORE doing any other work, run the auto-detection from [`_templates/MCP_SETUP.md`](MCP_SETUP.md) "Auto-detection" section.

**If all required checks pass (`.mcp.json` resolves to a real `server.mjs`, `node_modules/` is there, `credentials.json` + `token.json` exist, rules block in `CLAUDE.md`):** the MCP is already configured. **Skip setup entirely and silently — do NOT re-offer, re-prompt, re-auth, or re-install.** Just proceed to the user's actual request. This is the common case for any user who has run the kit before.

**If something required is missing** (`.mcp.json`, `mcp-sheets/node_modules/`, `credentials.json`, `token.json`, or the rules block in `CLAUDE.md`) — STOP and proactively walk the user through `_templates/MCP_SETUP.md`. Do NOT:
- silently fall back to asking for a Figma URL when the Figma MCP isn't set up,
- generate a `.gs` / `.mjs` that will fail because `.mcp.json` doesn't exist,
- pretend the work succeeded when the user has no way to actually run it.

Phrase the offer clearly: "I see that <X> isn't configured yet — without it I can't <Y>. Want me to walk you through setting it up? Most of it I can automate; you'll only need to click through 2 browser screens." Then drive it from `MCP_SETUP.md`.

The Figma Dev Mode MCP and claude.ai connectors are non-blocking — mention them ONCE if missing, then proceed with what's available (e.g. ask for a Figma URL if Dev Mode isn't on). If they ARE configured, never re-mention or re-suggest setup.

### Step 1 — detect state (do all in parallel)

Check the workspace once at the start of a checklist-related conversation. Full list with pass/fail conditions is in [`_templates/MCP_SETUP.md`](MCP_SETUP.md) "Before you start" — the short summary:
- `<workspace>/.mcp.json` exists and references a `google-sheets` server? *(required)*
- `<workspace>/_templates/mcp-sheets/node_modules/` exists? *(required)*
- `<workspace>/_templates/mcp-sheets/credentials.json` exists? *(required, browser-only to create)*
- `<workspace>/_templates/mcp-sheets/token.json` exists? *(required, browser-only sign-in)*
- The workspace `CLAUDE.md` includes this rules block (search for "Hierarchy Page → Section → Check")? *(required)*
- Any `mcp__figma*` tool resolves (try `get_metadata` no nodeId)? *(recommended)*
- `mcp__claude_ai_Google_Drive__*` resolves (try `list_recent_files`)? *(optional)*

Skip the steps that are already done.

### Step 2 — autonomous actions (do these silently, just report results)

- **`npm install` inside `_templates/mcp-sheets/`** if `node_modules/` is missing.
- **Create `<workspace>/.mcp.json`** from `_templates/.mcp.json.example` with the absolute path to `_templates/mcp-sheets/server.mjs` plugged in. Remind the user to restart Claude Code (or run `/mcp`) so the new server is picked up.
- **Inject rules into `CLAUDE.md`** — if missing, append the content of `_templates/CHECKLIST_RULES.md`. Create the file if absent.
- **When the user asks to create a new checklist**, derive the project name from the Figma FILE name (see "Project name derivation" below), then copy the right template pair (web or mobile based on the design) into a new project folder, fill in `FOLDER_PATH` / `FILE_NAME` / `AUTHOR` / `addPage` / `addSection` / `item` blocks, and run `node generate_via_api.mjs`. Diagnose any error output and retry if recoverable.

### Project name derivation

When the user requests a checklist for their current Figma selection, the project name should come from the Figma FILE name, not the selected frame. Get the file name from any of these sources (in order):
1. The URL slug if the user pastes a Figma URL (`figma.com/design/<key>/<slug>?node-id=…` — `<slug>` is URL-decoded file name).
2. The metadata response from the Figma MCP (if it surfaces file info).
3. Ask the user in one line.

Then strip common suffixes:
- `": Design"`, `" - Design"`, `" — Design"`, `" Design"`
- `": UI"`, `" UI"`, `" Mockup"`, `" Wireframe"`
- Version tags: `" v1"`, `" v2"`, `" v3"`, …
- Localization tags: `" EN"`, `" UA"`, …

Examples:
- `"Gruuun: Design"` → `Gruuun`
- `"Fabrics Ocean — Design v2"` → `Fabrics Ocean`
- `"MyApp UI Mockup"` → `MyApp`

Confirm the derived name in one line ("I'll use `Gruuun` as the project name — OK?") and wait if there's any ambiguity. Use the result for `FOLDER_PATH`, `FILE_NAME`, function name (`create<Project>Checklist`), and the new project folder name.

### Step 3 — stop and ask the user (browser-only steps)

These cannot be automated and require the user's hands in a browser. When Claude reaches one, print the exact next step in chat and wait:

1. **Create a Google Cloud project + OAuth Client ID and download `credentials.json`.** Walk the user through `_templates/mcp-sheets/README.md` "§2 Get OAuth client credentials". They must end with `_templates/mcp-sheets/credentials.json` saved next to `server.mjs`.
2. **Run `node server.mjs --auth` and sign in in the browser.** Claude can run the command — the user just clicks through Google's consent flow. Wait until `token.json` appears, then resume Step 2 / Step 4.
3. **(Recommended) Enable Figma Dev Mode MCP in Figma Desktop.** Figma Desktop → Preferences → "Enable Dev Mode MCP Server". Walk them through `_templates/MCP_SETUP.md` §2. After they toggle it on, ask them to restart Claude Code or run `/mcp`.
4. **(Optional) Enable claude.ai Figma + Google Drive connectors.** Walk them through `_templates/MCP_SETUP.md` §3. After they enable connectors in <https://claude.ai/settings/connectors>, ask them to restart Claude Code or run `/mcp`.

### Step 4 — first run

Once steps 1–3 are done, the user is ready. Either wait for them to ask for a checklist, or offer to generate one for the page/screen they have selected in Figma. Then fully automate the run.

## Tooling notes

- **When creating/updating checklists in Google Sheets, first check the configured MCP servers** (e.g. `google-sheets` MCP at `mcp-sheets/server.mjs`, registered in `.mcp.json`) and use them instead of building ad-hoc API scripts. (Vadym, 11/06/2026)
- **Trust the configured MCP — do not re-probe on every request (Vadym, 16/06/2026):** once `.mcp.json` declares a server (e.g. `google-sheets`), assume it works on the next "create a new checklist" request. Skip preflight `--check` / `ls`-style validation of the server. Only investigate the MCP when an actual call from the generator script fails (auth error, network error, missing file). This applies to all subsequent checklist requests in the same workspace.
- **Multi-user checklist generators (Vadym, 16/06/2026):** generator scripts (`*/generate_via_api.mjs`) MUST NOT hardcode `/Users/<someone>/...` paths. Resolve `MCP_DIR` by walking up from `cwd` to find `.mcp.json` and extracting `mcpServers["google-sheets"].args[0]`'s directory, with `MCP_SHEETS_DIR` env var as override. The OAuth `token.json` inside `MCP_DIR` is whose Drive the script writes to — for a NEW USER, they must first run `node server.mjs --auth` inside their own `mcp-sheets` clone to bind the script to THEIR Google account & Drive.
