# Figma Sources — Web

Reference for AI agents and QA: which Figma file backs this project's web design,
and how each screen maps to its SRS section. With this file, agents do **not** need a
fresh link each time — just the `fileKey` + the `node-id` of the screen to analyze.

> Template note: fill the placeholders via `/setup-project` (values come from
> `setup/project.yaml → web.figma`). A filled-in example from a real project:
> [examples/figma-sources/web-figma-sources.md](../../../examples/figma-sources/web-figma-sources.md).

## File

- **Name:** <Figma file name>
- **Platform:** Web
- **fileKey:** `<FIGMA_FILE_KEY>`
- **URL:** https://www.figma.com/design/<FIGMA_FILE_KEY>/<file-name>
- **Main page (canvas):** `<page name>` — node `<0:1>`

## How agents read it

Read via the project-local Figma MCP server `figma` (PAT-based, see `.mcp.json`):
- Structure / content: `mcp__figma__get_figma_data` with `fileKey` + `nodeId`.
- Images / screenshots: `mcp__figma__download_figma_images`.

To focus on one screen, pass its `node-id` from the table below. A `node-id` is only
needed to scope quickly — agents can also traverse the whole file from `fileKey` alone.

## Screen map

Extend this table as screens are analyzed (one row per screen):

| Screen | node-id | Size (px) | SRS section |
|---|---|---|---|
| | | | |
