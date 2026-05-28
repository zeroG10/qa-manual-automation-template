# CLAUDE.md — QA Automation Template

## Project Overview

This is a reusable QA automation template for web application testing.
Replace this section with the actual project name, URL, and short description when applied to a specific project.

- **Project:** [Project Name]
- **Base URL:** [https://your-app.com] — also update `playwright.config.ts → use.baseURL`
- **Type:** Web application

## Repository Structure

```
docs/                        # Source documentation (input for AI analysis)
  ├── srs/                   # Software Requirements Specification
  ├── requirements/          # Functional & non-functional requirements
  ├── designs/               # Figma designs and UI mockups
  ├── api/                   # API documentation (Swagger / OpenAPI / Postman)
  └── business-rules/        # Business logic and rules

qa/                          # Manual QA artifacts (human-authored)
  ├── analysis/              # Exploratory analysis notes
  ├── checklists/            # Test checklists
  ├── test-scenarios/        # High-level test scenarios
  ├── test-cases/            # Detailed test cases
  ├── traceability/          # Requirements traceability
  ├── bugs/                  # Bug reports
  ├── reports/               # Test execution reports
  ├── risks/                 # Risk register
  └── questions/             # Open questions to the team

automation/
  ├── web/playwright/tests/  # Playwright E2E tests
  ├── api/                   # API tests (future)
  └── mobile/                # Mobile tests (future)

_bmad-output/                # AI-generated artifacts (BMAD TEA output)
  └── test-artifacts/
      ├── test-design/       # AI-generated test design documents
      ├── test-reviews/      # AI-generated test reviews
      └── traceability/      # AI-generated traceability matrix

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
- **Test code** → `automation/web/playwright/tests/`
- Do not commit `_bmad-output/` unless review and approval is complete

## Playwright Commands

```bash
npm run pw:test          # Run all tests
npm run pw:ui            # Run with interactive UI
npm run pw:debug         # Run in debug mode
npm run pw:codegen       # Record new test via browser
npm run pw:report        # Open last HTML report
```

## AI Workflow (BMAD TEA)

1. Place documentation in `docs/` (SRS, designs, API, business rules)
2. Use `/bmad-agent-analyst` to analyze requirements
3. Use `/bmad-tea` (Murat) for test strategy and design
4. Use `/bmad-qa-generate-e2e-tests` to generate Playwright tests
5. Use `/bmad-testarch-automate` to expand automation coverage
6. Use `/bmad-testarch-trace` to generate traceability matrix

Output lands in `_bmad-output/test-artifacts/`.

## BMAD Agents Available

| Skill | Agent | Purpose |
|---|---|---|
| `/bmad-tea` | Murat | Master Test Architect — strategy, risk, design |
| `/bmad-qa-generate-e2e-tests` | — | Generate E2E Playwright tests |
| `/bmad-testarch-automate` | — | Expand automation coverage |
| `/bmad-testarch-test-design` | — | Test design documents |
| `/bmad-testarch-atdd` | — | ATDD / BDD scenarios |
| `/bmad-testarch-trace` | — | Requirements traceability |
| `/bmad-testarch-ci` | — | CI/CD integration |
| `/bmad-agent-analyst` | Mary | Requirements analysis |
| `/bmad-agent-tech-writer` | Paige | Documentation writing |

## MCP Tools Available

- **Playwright MCP** — browser automation via natural language (configured in `.vscode/mcp.json`)

## When Starting a New Project

1. Update **Base URL** above and in `playwright.config.ts`
2. Update **Project name and description** above
3. Place all source docs in `docs/` subdirectories
4. Run `/bmad-agent-analyst` to analyze requirements
5. Run `/bmad-tea` to build test strategy
