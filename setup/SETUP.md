# SETUP.md — how to deploy this template for a new project

This file is the **map** an AI agent (or a human) follows when configuring a fresh
clone of this template. The values themselves live in [project.yaml](project.yaml)
— fill that first (or let `/setup-project` ask you). This file tells you **where
each value goes** and **which integrations to wire up**.

> Entry point: run the **`/setup-project`** skill. It reads `project.yaml`,
> asks for anything still `<PLACEHOLDER>`, propagates values using the tables
> below, and verifies each integration.

---

## 1. Value propagation map (manifest key → consumer files)

| `project.yaml` key | Consumer file(s) | What to change |
|---|---|---|
| `project.name` | `CLAUDE.md` (Project Overview) | Replace `[Project Name]` |
| `project.name`, `project.repo_name`, `project.description` | `package.json` | `name`, `description` |
| `project.name` | `_bmad/bmm/config.yaml` | `project_name:` |
| `web.base_url` | `automation/web/playwright.config.ts` | `use.baseURL` |
| `web.base_url` | `CLAUDE.md` (Project Overview) | Web Base URL line |
| `web.figma.*` | `docs/designs/web/figma-sources.md` | File section: name, fileKey, URL, main page node. Then extend the screen map as you analyze screens. |
| `mobile.kind` | `automation/mobile/.env` | `FLUTTER_ENABLED=true` if flutter |
| `mobile.android.*` | `automation/mobile/.env` | `ANDROID_APP_PACKAGE`, `ANDROID_APP_ACTIVITY` (+ `ANDROID_APP_PATH` once you have a build) |
| `mobile.ios.bundle_id` | `automation/mobile/.env` | `IOS_BUNDLE_ID` (+ `IOS_APP_PATH`) |
| `mobile.figma.*` | `docs/designs/mobile/figma-sources.md` | Same as web figma-sources |
| `api.base_url`, `api.env_label` | `automation/api/.env` | `API_BASE_URL`, `API_ENV` |
| `sheets.web.*` | `automation/tools/.env` | `WEB_SHEET_ID`, `WEB_WORKSHEET`, `WEB_ID_COL`, `WEB_OBSOLETE_COL` |
| `sheets.mobile.*` | `automation/tools/.env` | `MOBILE_SHEET_ID`, `MOBILE_WORKSHEET`, `MOBILE_ID_COL`, `MOBILE_OBSOLETE_COL` |

`.env` files are created by copying the matching `.env.example` in the same
directory (`automation/api/`, `automation/mobile/`, `automation/tools/`).
They are gitignored — never commit them.

## 2. Platform toggles

If `platforms.<stack>` is `false` in the manifest:

- **Skip** that stack's `.env` and config steps entirely.
- Optionally delete its CI workflow from `.github/workflows/`
  (`web-tests.yml` / `api-tests.yml` / `mobile-*-tests.yml`) — they are
  path-filtered, so leaving them is harmless but noisy.
- Leave the folder structure in place (it costs nothing and keeps the
  template's conventions intact).

## 3. Integrations checklist

### Figma MCP (design analysis)
- Project-local server `figma` is configured in [.mcp.json](../.mcp.json);
  it reads `FIGMA_PERSONAL_ACCESS_TOKEN` from the shell environment.
- Get a PAT: figma.com → Settings → Security → Personal access tokens
  (read scope for the design files is enough).
- Record the design files in `docs/designs/{web,mobile}/figma-sources.md` —
  agents read `fileKey` + `node-id` from there and never need fresh links.
- **Verify:** call `mcp__figma__get_figma_data` with the fileKey from the
  manifest; it should return the document tree.

### Google Sheets (checklist publishing)
- The ONLY live-sheet writer is
  [automation/tools/sync_checklist_to_sheets.py](../automation/tools/sync_checklist_to_sheets.py)
  (see CLAUDE.md "single writer" rule; `vendor/checklist-kit` is reference-only).
- Auth: Google Cloud service account with Sheets API enabled. Put its JSON key
  at `automation/tools/.secrets/credentials.json` (gitignored). Share each
  target spreadsheet with the service-account email as **Editor**.
- **Verify:** `cd automation/tools && uv sync && uv run python
  sync_checklist_to_sheets.py <any checklist .md> --target web --dry-run`
  → must print a plan and write nothing.

### Playwright (web E2E)
- `npm install` at repo root, then `npx playwright install`.
- **Verify:** `npm run pw:test` (the example spec runs against `baseURL`).

### API tests
- `cd automation/api && uv sync`, fill `.env`.
- **Verify:** `uv run pytest -m smoke` (example health test).

### Mobile (Appium)
- `cd automation/mobile && uv sync`, fill `.env`, drop the build into
  `automation/mobile/builds/`.
- Start server: `bash scripts/start_appium.sh`.
- **Verify:** `uv run pytest --platform=android -m smoke` (or ios).

## 4. Post-setup hygiene (what /setup-project also does)

- Reset `_bmad/bmm/config.yaml` → `project_name`, `user_name`.
- Confirm `examples/` content (sample SRS / checklists from a past project,
  if present) is understood to be **reference only** — new artifacts go into
  `docs/` and `qa/` per the platform rules in CLAUDE.md.
- Run through CLAUDE.md "When Starting a New Project" and confirm every step
  is done; update `docs/platform-specs/supported-devices.md` and
  `qa/device-matrix/device-matrix.md` with the real support policy.
- Leave `setup/project.yaml` filled-in and committed — it documents the
  project's wiring for every future agent session.

## 5. What must NEVER be auto-run

- `vendor/checklist-kit/**` — colleague's kit, REFERENCE ONLY. Its Node
  generator does a full sheet rebuild and would wipe manually-entered
  statuses on a live team sheet.
- `automation/checklist-gen/**` — scaffold-only generator; requires an
  explicitly configured `SPREADSHEET_ID` and an explicit user request.
