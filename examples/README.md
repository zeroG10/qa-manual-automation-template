# examples/ — filled-in artifacts from a real project (REFERENCE ONLY)

Everything here was produced for a past project ("Concert Technologies") and is
kept **only** as a living example of what a filled-in artifact looks like:

| Folder | Shows how to fill |
|---|---|
| `srs/` | `docs/srs/` — SRS docs (web + `mobile/`) |
| `checklists/web/`, `checklists/mobile/` | `qa/checklists/{web,mobile}/` — checklists with stable `[CHK-…]` IDs |
| `figma-sources/` | `docs/designs/{web,mobile}/figma-sources.md` — Figma design maps |
| `checklist-gen/` | one-off Sheets generator ported from `vendor/checklist-kit` (superseded by the Python sync `--scaffold` mode) |

Rules for AI agents:

- **Never treat this content as current project requirements.** Real artifacts
  live in `docs/` and `qa/` and start empty in a fresh clone.
- **Never run `checklist-gen/`** without an explicit user request and an
  explicitly configured `SPREADSHEET_ID` — it does a full sheet rebuild.
- When generating a new artifact, you may read the matching example here for
  format/tone, but the authoritative format spec is always the prompt template
  in `prompts/` and the `_TEMPLATE.md` files.
- This folder may be deleted entirely once the team no longer needs the examples.
