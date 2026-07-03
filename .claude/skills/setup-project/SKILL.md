---
name: setup-project
description: Deploy this QA template for a new project — read setup/project.yaml, ask for missing values, propagate them into all consumer files per setup/SETUP.md, wire integrations (Figma MCP, Google Sheets, Playwright, API, Appium) and verify each one. Use when the user says "setup the project", "налаштуй проект", "configure this template", "deploy the template", or right after cloning the template repo.
---

# Setup Project (template → working project)

Turns a fresh clone of this QA template into a configured project. The knowledge
lives in two files — this skill only orchestrates them:

- [setup/project.yaml](../../../setup/project.yaml) — the **manifest**: every
  project-specific value, one place.
- [setup/SETUP.md](../../../setup/SETUP.md) — the **map**: which file consumes
  each manifest key, and how to wire/verify each integration.

Do NOT improvise paths or invent config keys. If the map and reality disagree
(a consumer file moved, a key renamed), fix the map in the same session and tell
the user — the map must stay truthful.

## Step 0 — Read state

1. Read `setup/project.yaml` and `setup/SETUP.md` fully.
2. Collect every value still equal to a `<PLACEHOLDER>`.
3. Check which stacks are enabled (`platforms.web/mobile/api`).

## Step 1 — Gather missing values (ask, never guess)

Ask the user for all missing values in ONE batch (AskUserQuestion or a compact
list), grouped by: project meta → enabled platforms → sheets → figma.
Skip questions for disabled platforms entirely.

- If the user doesn't have a value yet (e.g. no mobile build, no sheet created),
  record it as still-placeholder and list it in the final report as TODO.
- Write the answers back into `setup/project.yaml` — the manifest must end the
  session up to date. It is committed; it holds no secrets.

## Step 2 — Propagate values

Apply the **value propagation map** (SETUP.md §1) mechanically:

- Edit tracked files in place (CLAUDE.md, playwright.config.ts, package.json,
  `_bmad/bmm/config.yaml`, figma-sources.md).
- Create `.env` files by copying `.env.example` in the same directory, then fill
  the mapped keys. Never commit `.env`.
- Respect platform toggles (SETUP.md §2): skip disabled stacks; offer (don't
  force) deleting their CI workflows.

## Step 3 — Wire integrations

Follow SETUP.md §3 in order: Figma MCP → Google Sheets → Playwright → API →
Mobile. For each one either complete it, or — if it needs something only the
user has (PAT, service-account JSON, app build) — give the exact instruction
from SETUP.md and mark it TODO.

Hard rules (SETUP.md §5): never run anything under `vendor/checklist-kit/` and
never run `automation/checklist-gen/` — the only permitted live-sheet writer is
`automation/tools/sync_checklist_to_sheets.py`, and during setup only with
`--dry-run`.

## Step 4 — Verify

Run each enabled stack's **Verify** command from SETUP.md §3. A verify step
that fails because a secret/build is missing is a TODO, not an error — report
it as such. A verify step that fails with the config present is an error — fix
or escalate.

## Step 5 — Report + commit

1. Summary table: value → propagated where; integration → OK / TODO (with the
   exact next action for each TODO).
2. Do the post-setup hygiene pass (SETUP.md §4).
3. Offer to commit the configuration as
   `chore: configure template for <project name>`.
