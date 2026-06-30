# QA Checklist Generator — Canonical Mobile Template (28 cols)

Mobile sibling of `../checklist/` (the 25-col web variant). Same
Page → Section → Check hierarchy, same workspace rules — only differences:

- **NCOLS = 28** (A..AB) — each platform block carries TWO status
  sub-columns (a platform pair like iOS + Android in one block) instead
  of one + a comments-extension column.
- **Block layout (28 cols):** `A B | s1 s2 c1 c2 c3 spacer rA rB | between | …`
  Block 1 = `C D | E F G | H | I J`; Block 2 = `L M | N O P | Q | R S`;
  Block 3 = `U V | W X Y | Z | AA AB`.
- **Column groups: `C:H`, `L:Q`, `U:Z`** (6 cols each, vs 5 on web).
- **Page band terminology:** call screens "Home screen", "Login screen", …
  (instead of "Home page"). The API is still `addPage(name)` — only the
  label changes.
- **`PLATFORMS` constant** (2D array) in the `.gs`. Default
  `[['iOS','Android'], ['iOS','Android'], ['iOS','Android']]` — all three
  blocks filled with the same pair so they can be used for 3 testing
  rounds / builds / regression passes. Override per project (e.g.
  `[['iOS','Android'], ['iPad','Android Tablet'], ['','']]`).
- **Per-row result formula** scans the combined pair (`COUNTIF(s1:s2; "…")`)
  and is more elaborate than the web single-status form — see the
  template body.

Everything else (color palette, conditional formatting, +/- toggle right,
B4 hidden, group cleanup, page-name mirror, per-section row groups,
section-aware borders, autoResize) is identical to the web template.

> First-time setup of the kit (MCP server, OAuth, `.mcp.json`, rules) is
> covered in the top-level [`../README.md`](../README.md). Below assumes
> you've already finished that.

## How to create a new mobile checklist

```sh
PROJECT=<ProjectName>      # e.g. MyApp
slug=<project_snake>       # e.g. my_app
mkdir -p "$HOME/Projects/$PROJECT"
cp _templates/checklist-mobile/checklist_generator.template.gs \
   "$HOME/Projects/$PROJECT/${slug}_checklist.gs"
cp _templates/checklist-mobile/generate_via_api.template.mjs \
   "$HOME/Projects/$PROJECT/generate_via_api.mjs"
```

Then in the `.gs`:
1. Rename `createChecklist` → `create<Project>Checklist`
2. Set `FOLDER_PATH`, `FILE_NAME`, `AUTHOR`, `PLATFORMS`
3. Replace the example with real `addPage`/`addSection`/`item` calls
   (one `addPage` per screen — e.g. "Login screen", "Home screen")

In the `.mjs`:
1. Set `GS_PATH`, `GENERATOR_FN`, `FOLDER_PATH`, `FILE_NAME`

Then `node generate_via_api.mjs`. You'll see `Using MCP dir: …` and
`STEP 5 test: PASSED` if everything wires up correctly.

## When to use web vs mobile template

| Design under test | Template                       | Page band term |
|-------------------|--------------------------------|----------------|
| Website / web app | `_templates/checklist/`        | "<X> page"     |
| Mobile / app      | `_templates/checklist-mobile/` | "<X> screen"   |

Mix-and-match (e.g. a flow that includes both web and app screens) is not
supported by a single template; create two separate checklists.

## Updating this template

If you add a new workspace rule that affects checklists:
1. Update [`../CHECKLIST_RULES.md`](../CHECKLIST_RULES.md) with the rule + date + author.
2. Bake the change into BOTH `checklist/` and `checklist-mobile/` so web
   and mobile stay in sync.
