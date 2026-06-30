# mcp-sheets — Google Sheets MCP server

Local MCP server that exposes Google Sheets / Drive operations to Claude
Code. The checklist generators (`_templates/checklist/` and
`_templates/checklist-mobile/`) reuse this server's OAuth client so they
can write spreadsheets to YOUR Google Drive.

**Important:** the OAuth token bound to this server determines whose Drive
the checklists land in. Each user MUST run their own first-time setup —
do not share `token.json` or `credentials.json`.

---

## First-time setup

> **Legend:** 🤖 = Claude can do this for you automatically. 👤 = you must do this yourself (browser / Cloud Console).

You'll need:
- **Node.js 18+** installed
- A **Google account** (the Drive where checklists will be created)
- A **Google Cloud project** with the Sheets + Drive APIs enabled

### 1. 🤖 Install dependencies

```sh
cd <path-to>/mcp-sheets
npm install
```

This creates `node_modules/` (~100 MB). It's `.gitignore`d. Claude can run it.

### 2. 👤 Get OAuth client credentials

This step is Cloud Console UI — Claude can't do it. You need an OAuth 2.0
Client ID of type "Desktop app".

1. Open <https://console.cloud.google.com/>
2. Create a new project (or pick an existing one). Free tier is fine.
3. Enable APIs:
   - **Google Sheets API**
   - **Google Drive API**
4. APIs & Services → OAuth consent screen:
   - User type: **External**
   - Fill the bare minimum (app name, your email, a support email)
   - Scopes: add `.../auth/spreadsheets` and `.../auth/drive.file`
   - Test users: add your own Google account email
5. APIs & Services → Credentials → **Create credentials** → **OAuth client ID**:
   - Application type: **Desktop app**
   - Name: anything (e.g. "mcp-sheets local")
   - Click **Create**, then **Download JSON**
6. Rename the downloaded file to `credentials.json` and place it in this
   `mcp-sheets/` directory (next to `server.mjs`).

`credentials.json` is `.gitignore`d — never commit it.

### 3. Authorize your Google account

🤖 Claude can run the command:

```sh
node server.mjs --auth
```

👤 A browser opens (`http://localhost:3456/...`). YOU sign in with the
Google account whose Drive should receive the checklists, and approve
Sheets + Drive permissions.

🤖 On success, the script writes `token.json` next to `server.mjs`. Claude
detects it and continues. This file is `.gitignore`d and is the
user-specific access/refresh token.

### 4. 🤖 Register the server in `.mcp.json`

At your workspace root (e.g. `~/Projects/.mcp.json`). Claude generates it
from `_templates/.mcp.json.example` with the right absolute path plugged
in. 👤 You then restart Claude Code (or open `/mcp` in Claude Code) — Claude
can't reload its own connection to MCP servers.

---

## Re-authorization

If your token expires or you want to switch the active Google account:

```sh
node server.mjs --auth
```

This overwrites `token.json` with a fresh one.

---

## Troubleshooting

- **"Cannot locate google-sheets MCP server" when running a generator** —
  the generator walks up from `cwd` to find `.mcp.json`. Make sure
  `.mcp.json` is at or above your project directory and points at THIS
  `server.mjs`.
- **"No token.json at …"** — run `node server.mjs --auth`.
- **403 from Google API** — your OAuth consent screen is still in "Testing"
  status and your account isn't in the test-users list. Add it under
  OAuth consent screen → Test users.
- **Token expires often / refresh fails** — the OAuth consent screen for
  testing-mode apps refreshes tokens for 7 days only. Either publish the
  app (Production) or re-run `--auth` periodically.

---

## What's safe to share / commit

| File | Share? | Commit? |
|------|--------|---------|
| `server.mjs`        | yes | yes |
| `package.json`      | yes | yes |
| `package-lock.json` | yes | yes |
| `.gitignore`        | yes | yes |
| `README.md`         | yes | yes |
| `node_modules/`     | no  | no (gitignored) |
| `credentials.json`  | **no** | **no** (gitignored) — issue your own |
| `token.json`        | **no** | **no** (gitignored) — generate your own |
