# qa-tools

Small Python utilities for QA template maintenance.

## sync_checklist_to_sheets.py

Pushes a checklist markdown file into a Google Sheet idempotently. The sheet's
status columns (Chrome/Firefox/Edge/Safari/iOS/etc.) and any manually entered
comments are **never touched** by this tool — only columns A (Task), B (Check
text), O (hidden ID) and P (hidden Obsolete flag) are written.

### Setup

```bash
cd automation/tools
cp .env.example .env                     # edit if needed
# Place service account JSON at:
#   automation/tools/.secrets/credentials.json
# and share the target Sheet with the service account email as Editor.
uv sync
```

### Usage

```bash
uv run python sync_checklist_to_sheets.py --target web ../../qa/checklists/web/authentication-checklist.md
uv run python sync_checklist_to_sheets.py --target web ../../qa/checklists/web/authentication-checklist.md --dry-run
```

### Multiple targets (web vs mobile)

The script supports two independent worksheet "targets", each with its own
column layout, selected via `--target {web,mobile}` (default `web`).

Configure both targets in `.env`:

```
# === Shared ===
SHEET_ID=...
CREDENTIALS_FILE=.secrets/credentials.json

# === Web target ===
WEB_WORKSHEET=Check-list
WEB_ID_COL=O
WEB_OBSOLETE_COL=P

# === Mobile target ===
MOBILE_WORKSHEET=Check-list Mobile
MOBILE_ID_COL=L
MOBILE_OBSOLETE_COL=M
```

The Obsolete column must be immediately to the right of the ID column.

Example commands:

```bash
# Web checklist → "Check-list" tab, IDs in col O, Obsolete flag in col P
uv run python sync_checklist_to_sheets.py --target web ../../qa/checklists/web/authentication-checklist.md

# Mobile checklist → "Check-list Mobile" tab, IDs in col L, Obsolete flag in col M
uv run python sync_checklist_to_sheets.py --target mobile ../../qa/checklists/mobile/cross-platform/checklist-authentication.md
```

Web and mobile checklists are written to **separate worksheet tabs** in the
same Google Sheet, so feature codes do NOT collide across targets — e.g.
`CHK-AUTH-001` in the web tab and `CHK-AUTH-001` in the mobile tab are
independent rows.

### Stable IDs

Each check line in the markdown gets a stable ID like `[CHK-AUTH-001]` after
its number, e.g.:

```
1. [CHK-AUTH-001] Check that the Set Password page is accessible only via …
```

The ID is what links the row in the Sheet (hidden column O) back to the
markdown source. Status columns belong to the row, so the tool uses the ID to
find the right row even if the check text is edited or sections are renamed.

When you add a new numbered item without an ID, the tool assigns the next
free `CHK-<FEATURE>-NNN` ID. Feature prefixes are derived from the filename
(`authentication-checklist.md` → `AUTH`); the explicit mapping lives at the
top of the script.

### Behavior

| Situation | Tool action |
|---|---|
| New check in .md (no row in Sheet) | Append a new row at the end (or end of section if new) |
| Check text edited in .md | Update col B; statuses untouched |
| Check removed from .md | Mark col P = `1` (Obsolete) on the row; row is not deleted so statuses are preserved |
| Section renamed/moved in .md | Logged as a warning; row stays in place |
| Duplicate IDs in .md | Hard error, sync aborts |
| Duplicate IDs in Sheet | Warning; first occurrence is used |

Cell **B1** is updated to `Checklist\nUp to date according to <DD Month YYYY>`
on each run.

### Hidden columns

Columns **O** (ID) and **P** (Obsolete) are hidden by the script. **Do not
unhide them manually** — they are bookkeeping for the sync and not meant to be
edited by QA reviewers. If you need to inspect them, use the Sheet's "View
hidden columns" temporarily.
