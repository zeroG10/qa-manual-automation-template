<!-- ───────────────────────────────────────────────────────────────────────
  ⚠️ VENDORED / INACTIVE — DO NOT EXECUTE. Reference material only, kept in
  vendor/checklist-kit/. This file is a bootstrap template for a DIFFERENT
  workspace setup; it must NOT be copied or appended into this project's
  CLAUDE.md. See vendor/checklist-kit/VENDORED.md.
──────────────────────────────────────────────────────────────────────── -->

# Bootstrap CLAUDE.md — workspace root

> **What this file is:** the **template Claude uses to autonomously create `<workspace>/CLAUDE.md`** the first time a user asks anything checklist-related in a fresh workspace. The user does NOT copy this file manually. Claude reads this file + [`CHECKLIST_RULES.md`](CHECKLIST_RULES.md), concatenates them (replacing the `<!-- Append … -->` marker at the bottom of this file with the full rules content), and writes the result to `<workspace>/CLAUDE.md`. From the next session onward, Claude Code auto-loads it.
>
> See the "Autonomous bootstrap" rule in [`CHECKLIST_RULES.md`](CHECKLIST_RULES.md) for the exact trigger + write logic.

## Checklist kit — first thing Claude does in every session (CRITICAL)

This workspace uses the QA-checklist generator kit at [`_templates/`](_templates/).

Claude: BEFORE doing any checklist-related work, run the auto-detection from [`_templates/MCP_SETUP.md`](_templates/MCP_SETUP.md) "Before you start" / "Auto-detection". If anything required is missing (`.mcp.json` with `google-sheets` entry, `_templates/mcp-sheets/node_modules/`, `credentials.json`, `token.json`, or the full rules block from [`_templates/CHECKLIST_RULES.md`](_templates/CHECKLIST_RULES.md) inside THIS file) — STOP and walk the user through `_templates/MCP_SETUP.md`. Never silently fall back to asking for a Figma URL or generate code that will fail because MCP isn't configured.

If the user types something checklist-related but the kit isn't fully wired up yet, your first reply should be: "I see that <X> isn't configured yet — without it I can't <Y>. Want me to walk you through setting it up? Most of it I can automate; you'll only need to click through 2 browser screens." Then drive it from `MCP_SETUP.md`.

The Figma Dev Mode MCP and claude.ai connectors (Figma, Google Drive) are non-blocking — mention them ONCE if missing, then proceed with what's available (ask for a Figma URL if Dev Mode isn't on, etc.).

---

<!-- Append the contents of _templates/CHECKLIST_RULES.md below this line in Step 4 of setup -->
