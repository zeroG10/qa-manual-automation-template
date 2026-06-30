# VENDORED — reference only, NOT an active part of this project

This is a colleague's (Vadym) standalone QA-checklist → Google-Sheets "Starter Kit",
kept here as **reference material**. It arrived in the repo as a folder named
`_templates 2/` (a Finder duplicate of `_templates/`) and was moved here, renamed to
`vendor/checklist-kit/`, on 2026-06-19.

## Why it is NOT wired into the workspace

This project already has a complete, different checklist pipeline:

- **Source of truth:** markdown in `qa/checklists/**/*.md` (stable `[CHK-…]` IDs)
- **Writer:** `automation/tools/sync_checklist_to_sheets.py` (Python + gspread, service
  account, **idempotent**, never touches status/comment columns, marks Obsolete)
- **Generation:** the `qa-checklist` skill + `prompts/` + project-local `figma` MCP

The kit, by contrast, is **Figma → `.gs` generator → full sheet rebuild each run**, with
OAuth-as-user auth. Running its full rebuild on our live team sheet would **wipe the
statuses and comments** our Python sync carefully preserves. So the two must not both
write to the same live sheet.

## ⚠️ Its self-bootstrap rules are DISABLED on purpose

`CHECKLIST_RULES.md` and `CLAUDE.starter.md` contain "onboarding automation" that, if
read as active instructions, would tell an agent to append ~24 KB of kit rules into this
project's `CLAUDE.md`, auto-create files, and set up an OAuth MCP. **Those instructions
must not run here.** Both files now carry a `VENDORED / INACTIVE` banner at the top.

## What we ARE adopting from it (see git history on `feat/adopt-checklist-kit`)

1. **Multi-user path resolve** — resolve config/credentials by walking up to a config
   file instead of hardcoding `/Users/<name>/…` paths.
2. **The rich Sheet layout** — page bands, COUNTIF/SUM formulas, conditional formatting,
   collapsible column/row groups, section-aware borders, autoResize. Being **re-implemented
   in our Python sync as a one-time `--scaffold` build mode** (not adopted as the Node
   generator), so we keep ONE writer and ONE auth (service account).

The kit's own files are left unmodified except for the banners — treat them as read-only.
