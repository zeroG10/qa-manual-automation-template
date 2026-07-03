# checklist-gen — Vadym's rich-layout checklist generator (service-account variant)

Generates a QA checklist directly into a Google Sheet using **Vadym's v5 layout**
(page bands → sections → checks, 3 platform blocks with COUNTIF/SUM roll-ups,
conditional formatting, collapsible column/row groups, section-aware borders).

This is the **service-account** adaptation of the vendored kit
(`vendor/checklist-kit/`): it reuses `automation/tools/.secrets/credentials.json`
and writes into an **existing** spreadsheet by ID (no OAuth, no 7-day token).

> ⚠️ This generator does a **full rebuild** of the target sheet's `Checklist` tab.
> Point it ONLY at a dedicated sheet — never at a live team sheet maintained by
> `automation/tools/sync_checklist_to_sheets.py`, or manually-entered statuses are lost.
> See [vendor/checklist-kit/VENDORED.md](../../vendor/checklist-kit/VENDORED.md).

## web/

- `checklist_generator.gs` — the `.gs` generator (Authentication, Variant A:
  1 screen = 1 page band). Content mirrors
  `qa/checklists/web/authentication-checklist.md` with CHK-AUTH IDs preserved in col B.
- `generate_via_api.mjs` — service-account adapter that executes the `.gs` via the
  Sheets REST API. Edit `SPREADSHEET_ID` / `GENERATOR_FN` at the top per run.

## Run

```sh
# one-time: install googleapis into the vendored kit
npm install --prefix vendor/checklist-kit/mcp-sheets

# generate (writes into the configured SPREADSHEET_ID)
node automation/checklist-gen/web/generate_via_api.mjs
```

Expected output: `Auth: service account …`, batch progress, `Done: 4 pages …`,
`STEP 5 test: PASSED`, and the sheet URL.

## Prerequisites

- The target Google Sheet must be shared with
  `qa-checklist-sync@concert-qa-automation.iam.gserviceaccount.com` as **Editor**.
- `vendor/checklist-kit/mcp-sheets/node_modules/googleapis` present (npm install above).
