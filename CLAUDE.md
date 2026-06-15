# CLAUDE.md — QA Automation Template

## Project Overview

This is a reusable QA automation template for web application testing.
Replace this section with the actual project name, URL, and short description when applied to a specific project.

- **Project:** [Project Name]
- **Web Base URL:** [https://your-app.com] — also update `automation/web/playwright.config.ts → use.baseURL`
- **Mobile app:** configure in `automation/mobile/.env` (app path, package/bundle id, device)
- **API base URL:** configure in `automation/api/.env` (`API_BASE_URL`)
- **Type:** Web + Mobile (Android / iOS / Flutter) + API

> ⚠️ **AI agents: do not assume web-only.** This project has THREE independent test stacks
> (Web / Mobile / API). Before generating any test code or QA artifact, identify the target
> platform from the user's prompt (or ask). See [Platform decision rules](#platform-decision-rules-for-ai-agents).

## Repository Structure

```
docs/                              # Source documentation (input for AI analysis)
  ├── srs/                         # SRS (shared — one product spec)
  ├── api/                         # API docs Swagger/OpenAPI/Postman (shared)
  ├── business-rules/              # Business logic (shared)
  ├── requirements/
  │   ├── shared/                  # Platform-agnostic requirements
  │   ├── web/                     # Web-only requirements
  │   └── mobile/                  # Mobile-only requirements
  ├── designs/
  │   ├── web/                     # Web Figma/mockups
  │   └── mobile/{ios,android,flutter}/
  └── platform-specs/              # Mobile platform guidelines
      ├── ios/                     # HIG notes, App Store constraints
      └── android/                 # Material, Play Store, fragmentation

qa/                                # Manual QA artifacts (human-authored)
  ├── analysis/{web,mobile}/       # Exploratory analysis notes
  ├── checklists/
  │   ├── shared/                  # a11y, security, performance, i18n
  │   ├── web/                     # browser compat, responsive
  │   └── mobile/{ios,android,cross-platform}/
  ├── test-scenarios/{web,mobile}/ # High-level scenarios
  ├── test-cases/{web,mobile}/     # Detailed test cases
  ├── traceability/{web,mobile}/   # Requirements traceability
  ├── bugs/{web,mobile}/           # Bug reports
  ├── reports/{web,mobile}/        # Test execution reports
  ├── exploratory-sessions/{web,mobile}/   # Exploratory test notes
  ├── device-matrix/               # Mobile device/OS coverage matrix
  ├── risks/                       # Risk register (shared — product-level)
  └── questions/                   # Open questions to the team (shared)

automation/
  ├── web/
  │   ├── playwright.config.ts     # Playwright config (web-scoped)
  │   └── playwright/tests/        # Playwright E2E tests (TypeScript)
  ├── api/                         # API tests (Python + pytest + httpx)
  │   ├── pyproject.toml           # uv-managed deps + pytest config
  │   ├── clients/                 # ApiClient (httpx wrapper)
  │   ├── tests/{smoke,contract}/
  │   ├── schemas/                 # JSON Schemas for contract tests
  │   ├── helpers/                 # schema_validator, retry helpers
  │   └── fixtures/                # static test data
  └── mobile/                      # Appium + Python (Android, iOS, Flutter)
      ├── pyproject.toml           # uv-managed deps + pytest config
      ├── config/                  # capabilities, pydantic settings
      ├── tests/{ios,android,flutter,shared}/
      ├── pages/                   # Page Object Model
      ├── helpers/                 # gestures, device, waits
      ├── fixtures/                # test data
      ├── builds/                  # .apk / .ipa (gitignored)
      └── scripts/                 # start_appium.sh, reset_simulator.sh

_bmad-output/                      # AI-generated artifacts (BMAD TEA output)
  └── test-artifacts/
      ├── test-design/{web,mobile}/
      ├── test-reviews/{web,mobile}/
      └── traceability/{web,mobile}/

exports/                     # Final deliverables
  ├── pdf/                   # PDF reports
  ├── google-sheets/         # Spreadsheet exports
  └── final/                 # Final approved artifacts

prompts/                     # Reusable AI prompt templates
_bmad/                       # BMAD TEA configuration (do not edit config.toml directly)
```

## Key Conventions

- **Manual QA artifacts** → `qa/`
- **AI-generated artifacts** → `_bmad-output/test-artifacts/`
- **Source docs for AI analysis** → `docs/`
- **Web test code** → `automation/web/playwright/tests/` (Playwright + TypeScript)
- **Mobile test code** → `automation/mobile/tests/` (Appium + Python)
- Do not commit `_bmad-output/` unless review and approval is complete

### Platform split (web vs mobile)

Most artifact folders are split into `web/` and `mobile/` subfolders. When creating
a new artifact (checklist, test case, bug report, etc.), place it under the matching
platform subfolder. Shared/cross-platform artifacts go in `shared/` where it exists,
or in the top-level folder when no split is used (e.g. `qa/risks/`, `docs/srs/`).

**Always platform-scoped:** requirements, designs, test-scenarios, test-cases,
analysis, checklists, traceability, bugs, reports, exploratory-sessions, `_bmad-output/test-artifacts/*`.

**Shared (no split):** `docs/srs/`, `docs/api/`, `docs/business-rules/`,
`qa/risks/`, `qa/questions/`, `prompts/`, `exports/`.

**Mobile-only:** `docs/platform-specs/`, `qa/device-matrix/`.

## Playwright Commands (Web)

```bash
npm run pw:test          # Run all tests
npm run pw:ui            # Run with interactive UI
npm run pw:debug         # Run in debug mode
npm run pw:codegen       # Record new test via browser
npm run pw:report        # Open last HTML report
```

## API Commands (Python + httpx)

Stack: httpx + pytest + Allure, deps via **uv**. Shared between Web and Mobile — same backend.

```bash
cd automation/api
uv sync
cp .env.example .env                          # set API_BASE_URL, tokens
uv run pytest -m smoke
allure serve allure-results
```

Pytest markers: `smoke`, `regression`, `contract`, `auth`, `slow`.
Full guide: [automation/api/README.md](automation/api/README.md).

## Mobile Commands (Appium + Python)

Stack: Appium 2 + Appium-Python-Client + pytest + Allure, deps via **uv**.
Supports Android (UiAutomator2), iOS (XCUITest), and Flutter (Flutter driver or native + Semantics).

```bash
cd automation/mobile
uv sync                                       # install deps
cp .env.example .env                          # configure device/app

bash scripts/start_appium.sh                  # terminal 1: Appium server
uv run pytest --platform=android -m smoke    # terminal 2: run tests
uv run pytest --platform=ios -m smoke
allure serve allure-results                   # open report
```

Pytest markers: `smoke`, `regression`, `ios`, `android`, `flutter`, `shared`.
Full setup guide: [automation/mobile/README.md](automation/mobile/README.md).

## AI Workflow (BMAD TEA)

1. Place documentation in `docs/` (SRS, designs, API, business rules)
2. Use `/bmad-agent-analyst` to analyze requirements
3. Use `/bmad-tea` (Murat) for test strategy and design
4. Use `/bmad-qa-generate-e2e-tests` to generate E2E tests
5. Use `/bmad-testarch-automate` to expand automation coverage
6. Use `/bmad-testarch-trace` to generate traceability matrix

Output lands in `_bmad-output/test-artifacts/{web,mobile}/`.

## Platform decision rules (for AI agents)

This project has **three independent test stacks**. AI agents (including Claude Code and BMAD skills) MUST identify the target platform before generating any test code, checklist, test case, bug report, or other artifact. **Never default to web.**

### Step 1 — Identify the platform from the user's request

| Signal in the user's prompt | Platform |
|---|---|
| "browser", "page", "URL", "responsive", "Chrome/Firefox/Safari", Figma desktop mockup | **Web** |
| "app", "device", "iOS", "Android", "Flutter", "screen", "tap", "swipe", "push", "permissions", "deep link", APK/IPA | **Mobile** |
| "endpoint", "API", "REST", "GraphQL", "POST/GET", "schema", "status code", OpenAPI | **API** |
| Ambiguous (e.g. "login flow") | **ASK the user**: web, mobile, or API? |

### Step 2 — Use the correct stack and output path

| Platform | Language | Framework | Tests live in | Artifacts live in |
|---|---|---|---|---|
| Web | TypeScript | Playwright | `automation/web/playwright/tests/` | `qa/*/web/`, `_bmad-output/test-artifacts/*/web/` |
| Mobile | Python | Appium + pytest | `automation/mobile/tests/{ios,android,flutter,shared}/` | `qa/*/mobile/`, `_bmad-output/test-artifacts/*/mobile/` |
| API | Python | httpx + pytest | `automation/api/tests/{smoke,contract}/` | `_bmad-output/test-artifacts/*/` (shared) |

### Step 3 — Cross-platform features

If a feature exists on multiple platforms (e.g. login works on web AND mobile):
- Generate **separate test files per stack** — don't try to share TypeScript and Python code.
- Mark cross-platform checklists in `qa/checklists/shared/` (a11y, security, performance).
- Document API contracts ONCE in `automation/api/` — both clients hit the same backend.

### Example prompts that work correctly

- ✅ "Generate Playwright tests for the web login flow"
- ✅ "Generate Appium tests for iOS login"
- ✅ "Generate API contract tests for POST /users"
- ❌ "Generate tests for login" → AI should ask which platform(s)

## BMAD Agents Available

These skills are platform-agnostic — you must specify Web / Mobile / API when invoking them.

| Skill | Agent | Purpose |
|---|---|---|
| `/bmad-tea` | Murat | Master Test Architect — strategy, risk, design |
| `/bmad-qa-generate-e2e-tests` | — | Generate E2E tests (specify platform: web/mobile/api) |
| `/bmad-testarch-automate` | — | Expand automation coverage (specify platform) |
| `/bmad-testarch-test-design` | — | Test design documents |
| `/bmad-testarch-atdd` | — | ATDD / BDD scenarios |
| `/bmad-testarch-trace` | — | Requirements traceability |
| `/bmad-testarch-ci` | — | CI/CD integration (web + mobile + api pipelines) |
| `/bmad-agent-analyst` | Mary | Requirements analysis |
| `/bmad-agent-tech-writer` | Paige | Documentation writing |

## CI/CD

GitHub Actions workflows live in `.github/workflows/`:
- `web-tests.yml` — Playwright on ubuntu-latest
- `api-tests.yml` — pytest+httpx on ubuntu-latest
- `mobile-android-tests.yml` — Appium + Android emulator on ubuntu-latest
- `mobile-ios-tests.yml` — Appium + iOS simulator on macos-14
- `lint.yml` — ruff (Python) + tsc (TS)

Each workflow uses **path filters** so editing one stack's files only triggers its own pipeline.
Setup details and required GitHub secrets: [.github/workflows/README.md](.github/workflows/README.md).

## Templates (use when creating new artifacts)

- Bug reports: [qa/bugs/web/_TEMPLATE.md](qa/bugs/web/_TEMPLATE.md), [qa/bugs/mobile/_TEMPLATE.md](qa/bugs/mobile/_TEMPLATE.md)
- Test cases: [qa/test-cases/web/_TEMPLATE.md](qa/test-cases/web/_TEMPLATE.md), [qa/test-cases/mobile/_TEMPLATE.md](qa/test-cases/mobile/_TEMPLATE.md)
- Checklist: [qa/checklists/_TEMPLATE.md](qa/checklists/_TEMPLATE.md)

## Prompt Templates (REQUIRED for QA artifact generation)

When generating any QA artifact (manually or via subagents), you MUST first read
the matching prompt template from `prompts/` and use it as the agent's instruction.
Do not improvise the prompt — these templates encode the project's required output
format, structure, and conventions.

**Web / shared prompts** ([prompts/](prompts/)):

| Task | Prompt file |
|---|---|
| Analyze SRS + design | [prompts/01-analyze-srs-and-design.md](prompts/01-analyze-srs-and-design.md) |
| Generate checklist | [prompts/02-generate-checklist.md](prompts/02-generate-checklist.md) |
| Generate test cases | [prompts/03-generate-test-cases.md](prompts/03-generate-test-cases.md) |
| Create traceability matrix | [prompts/04-create-traceability-matrix.md](prompts/04-create-traceability-matrix.md) |
| Review coverage | [prompts/05-review-coverage.md](prompts/05-review-coverage.md) |
| Select automation candidates | [prompts/06-select-automation-candidates.md](prompts/06-select-automation-candidates.md) |

**Mobile prompts** ([prompts/mobile/](prompts/mobile/)) — use these instead of the web prompts
when the target platform is Mobile (iOS / Android / Flutter):

| Task | Prompt file |
|---|---|
| Analyze mobile SRS + design | [prompts/mobile/01-analyze-mobile-srs-and-design.md](prompts/mobile/01-analyze-mobile-srs-and-design.md) |
| Generate mobile checklist | [prompts/mobile/02-generate-mobile-checklist.md](prompts/mobile/02-generate-mobile-checklist.md) |
| Generate mobile test cases | [prompts/mobile/03-generate-mobile-test-cases.md](prompts/mobile/03-generate-mobile-test-cases.md) |

When dispatching work to a subagent (Agent tool), pass the prompt template's
content as part of the agent's instructions, together with the specific input
file path (e.g. a section of the SRS) and the target output path.

## MCP Tools Available

- **Playwright MCP** — browser automation via natural language (configured in `.vscode/mcp.json`)

## When Starting a New Project

1. Update **Web Base URL** in `automation/web/playwright.config.ts`
2. Update **Mobile config** in `automation/mobile/.env` (device, app path, bundle id / package)
3. Update **API base URL** in `automation/api/.env`
4. Update **Project name** at the top of this file
5. Update [docs/platform-specs/supported-devices.md](docs/platform-specs/supported-devices.md) with real support policy
6. Update [qa/device-matrix/device-matrix.md](qa/device-matrix/device-matrix.md) with your QA coverage matrix
7. Place all source docs in `docs/` subdirectories (use `web/` vs `mobile/` splits where they exist)
8. Run `/bmad-agent-analyst` to analyze requirements
9. Run `/bmad-tea` to build test strategy
