# Prompt 06 — Select Automation Candidates

## Purpose

Review available QA artifacts and select the best candidates for automation. Classify each scenario, identify blockers, define required test data, and produce a realistic Playwright automation plan.

This prompt helps avoid over-automation and focuses on high-value, stable, maintainable scenarios.

---

## When to Use

- After test cases are reviewed and approved using Prompt 05
- When planning a new automation sprint
- When deciding what to add to the regression suite
- Before implementing a Playwright automation suite
- When developers need a clear list of required test IDs and API support

---

## Input Required

### Required

- Test cases from `qa/test-cases/[feature-name]-test-cases.md`
- Risk analysis from `qa/analysis/[feature-name]-analysis.md`

### Optional but Recommended

- Coverage review from `qa/analysis/[feature-name]-coverage-review.md`
- Checklist from `qa/checklists/[feature-name]-checklist.md`
- Traceability matrix from `qa/traceability/[feature-name]-rtm.md`
- SRS or functional requirements from `docs/srs/` or `docs/requirements/`
- Design screenshots from `docs/designs/`
- API documentation from `docs/api/`
- Business rules from `docs/business-rules/`
- Known issues, previous QA notes, or bug reports

---

## Prompt

```text
You are a Senior QA Automation Engineer and Manual QA Strategist.

Your task is to review the provided QA artifacts and select realistic automation candidates for Playwright + TypeScript.

Your output will be used by:
- QA engineers planning the first automation sprint
- developers adding stable test IDs
- automation engineers implementing Playwright tests
- Prompt 07 or another automation prompt that generates Playwright code

Automation stack: Playwright + TypeScript
Test location: automation/web/playwright/tests/
Base URL: [project base URL]
Feature name: [feature-name]

Input:
[Paste content from qa/test-cases/[feature-name]-test-cases.md]
[Paste risk analysis from qa/analysis/[feature-name]-analysis.md]
[Paste additional materials if available: SRS, designs, checklist, coverage review, traceability matrix, API notes, known issues]

---

## Step 0: Input Quality Check

Before selecting automation candidates, assess whether the provided test cases and supporting materials are ready for automation planning.

Check whether the input contains:

- clear test case IDs
- clear scenario titles
- preconditions
- user roles
- test data requirements
- expected results
- environment assumptions
- dependencies on backend state
- dependencies on third-party services
- cleanup expectations
- known risks or open questions

Output:

### Input Quality Summary

- Overall input quality: High / Medium / Low
- Main gaps:
  - [Gap 1]
  - [Gap 2]
  - [Gap 3]

If important information is missing, continue with the available input but clearly mark assumptions and planning gaps.

Do not invent missing requirements, APIs, selectors, credentials, or test data.

---

## Step 1: Automation Readiness Rating

Assess overall readiness of this feature for automation.

Use one of these ratings:

- Ready for automation
- Partially ready for automation
- Not ready for automation yet

Briefly explain the rating in 2–3 sentences.

Consider:

- stability of requirements
- stability of UI
- availability of test data
- availability of stable selectors
- availability of API support
- environment readiness
- risk of flaky tests

---

## Step 2: Recommended Automation Approach

Choose the overall recommended approach before planning details:

- UI automation only
- API setup + UI validation
- API validation only
- Manual now, automate later
- Hybrid approach

Briefly justify the choice in 1–2 sentences.

Guidance:

- Prefer lower-level automation when possible.
- Do not recommend E2E UI automation for scenarios that can be reliably validated through API or backend checks.
- Use UI automation for critical user flows, permissions, validations visible to users, and business-critical paths.
- Use API setup to create predictable test data and reduce UI dependency.
- Use API validation to verify backend state after UI actions.
- Keep subjective visual checks, exploratory testing, hardware-dependent scenarios, and unstable flows manual unless a reliable automation strategy exists.

---

## Step 3: Score Each Test Case

For each test case, assign scores:

- ROI: High / Medium / Low
- Stability: High / Medium / Low
- Risk Coverage: High / Medium / Low

### ROI Guidance

High ROI:
- repetitive regression scenario
- business-critical flow
- time-consuming manual validation
- frequently executed in release cycles
- high chance of catching regressions

Medium ROI:
- useful regression scenario
- moderate manual effort
- important but not release-blocking

Low ROI:
- rarely executed
- very quick manual check
- low business impact
- high automation cost compared to value

### Stability Guidance

High Stability:
- predictable UI
- stable selectors available
- deterministic result
- reliable test data
- no dependency on external systems

Medium Stability:
- requires setup or cleanup
- depends on backend state
- has moderate async behavior
- needs stable test IDs before automation

Low Stability:
- depends on animations or transitions
- uses dynamic external content
- depends on third-party widgets or iframes
- depends on email or SMS verification
- depends on file uploads/downloads without stable test hooks
- depends on time-sensitive behavior
- requires subjective visual judgment
- requires hardware, GPS, camera, real payment, or real device-specific behavior

### Risk Coverage Guidance

High Risk:
- core business flow
- payment, subscription, publishing, permissions, authentication, or data integrity
- affects many users
- previously had defects
- release blocker if broken

Medium Risk:
- important secondary flow
- affects a specific role or configuration
- moderate business impact

Low Risk:
- cosmetic or low-impact behavior
- rarely used edge case
- minor validation

Use the scores as input for classification in Step 4. Do not make a binary Automate/Skip decision in this step.

---

## Step 4: Automation Candidate Matrix

Create a matrix for all provided test cases.

| TC ID | Scenario / Test Area | Automation Level | ROI | Stability | Risk Coverage | Automation Status | Priority | Suggested Tags | Reason | Blockers / Requirements |
|------|----------------------|------------------|-----|-----------|---------------|-------------------|----------|----------------|--------|--------------------------|

### Automation Level values

- E2E UI
- API
- API setup + UI assertion
- Component / UI-level
- Manual only
- Not applicable yet

### Priority levels

- P1 — smoke / business-critical, should pass in every CI run
- P2 — regression, should run before release
- P3 — edge case, should run in full suite or scheduled runs

### Automation Status values

- Good Candidate — stable, repetitive, business-critical, predictable data, suitable for regression
- Medium Candidate — useful but needs setup, partially stable, or dependent on backend state
- Manual Only — requires visual judgment, exploratory testing, subjective UX, real payments, hardware, or real device behavior
- Needs API Support — requires API to create data, reset state, trigger events, or verify backend
- Needs Stable Selectors — missing test IDs, unstable CSS, dynamic structure, or generated class names
- Needs Test Data Setup — requires specific users, roles, statuses, permissions, or preconfigured records
- Not Recommended Now — requirements unclear, UI unstable, feature changing, or maintenance cost too high

### Suggested Tags

- `@smoke` — must pass before any release
- `@regression` — full regression suite
- `@critical` — business-critical path
- `@flaky` — known instability, should run separately
- `@wip` — not ready, placeholder only
- `@api` — API-level validation
- `@e2e` — end-to-end UI scenario
- `@manual-only` — should remain manual

### Classification guidance

Use this logic when assigning Automation Status:

- Good Candidate: ROI = High or Medium, Stability = High, Risk Coverage = High or Medium
- Medium Candidate: ROI = High or Medium, Stability = Medium, or the test requires setup/support before automation
- Needs API Support: scenario is valuable but cannot be automated reliably without API setup, cleanup, state reset, or backend verification
- Needs Stable Selectors: scenario is valuable but current UI selectors are unstable or unavailable
- Manual Only: Stability = Low and scenario requires human judgment, hardware, real payment, real device behavior, exploratory testing, or subjective UX evaluation
- Not Recommended Now: ROI = Low and Stability = Low, or requirements/UI are unclear or changing

For Manual Only or Not Recommended Now, clearly explain why automation is not recommended now.

---

## Step 5: Best First Automation Candidates

List the best first scenarios to automate.

Include 3–10 scenarios depending on suite size and candidate quality.

Format:

1. [TC ID] [Scenario name] — [Reason]

Selection criteria:

- highest ROI
- high stability
- high or medium risk coverage
- suitable for smoke or core regression
- independent or easy to isolate
- can be implemented without major blockers

If fewer than 3 suitable candidates exist, list only the realistic candidates and explain why the number is limited.

---

## Step 6: Manual-Only Scenarios

List scenarios that should remain manual for now.

| TC ID | Scenario | Reason to Keep Manual | Revisit Later? |
|------|----------|-----------------------|----------------|

Common reasons:

- requires visual or subjective judgment
- requires exploratory testing
- requires real payment, real subscription, or production-only flow
- requires hardware, GPS, camera, biometric, or device-specific behavior
- depends on email/SMS without test hooks
- depends on third-party systems that are not stable in test environments
- automation cost is higher than value
- requirements are unclear or changing

Do not recommend destructive, payment, subscription, or production-only flows for regular CI automation unless a dedicated safe test environment and safe test accounts are available.

---

## Step 7: Scenarios Requiring API Support

List scenarios that need API support before automation.

| TC ID | Scenario | API Action Needed | Endpoint if Known | Priority | Notes |
|------|----------|-------------------|-------------------|----------|-------|

API action types:

- Create test user or record
- Reset status or state
- Delete created data after test
- Trigger notification or callback
- Verify backend state
- Prepare user roles or permissions
- Simulate external service response
- Mock email or SMS verification
- Prepare payment/subscription test state
- Clean up test data

Rules:

- Do not invent missing endpoints.
- If endpoint is unknown, write `Unknown — needs dev confirmation`.
- Clearly mark API support that blocks automation.

---

## Step 8: Scenarios Requiring Stable Selectors

List UI areas where stable selectors are needed.

Suggest test IDs using this format:

| TC ID | UI Element | Suggested testId | Reason |
|------|------------|------------------|--------|

Test ID naming convention:

- Use readable kebab-case.
- Use feature-scoped names.
- Do not base test IDs on visual position, styling, or generated classes.
- Prefer format: `[feature]-[element]-[type]`.

Examples:

| TC ID | UI Element | Suggested testId | Reason |
|------|------------|------------------|--------|
| TC-003 | Save button | survey-save-button | Needed for stable save action |
| TC-003 | Title field | survey-title-input | Needed for stable form input |
| TC-005 | Publish button | survey-publish-button | Needed for stable publish action |
| TC-006 | Status filter | survey-status-filter | Needed for reliable filtering |

Do not invent existing selectors. Only suggest new test IDs needed for reliable automation.

---

## Step 9: Required Test Data

List required test data per test case.

| TC ID | Data Type | Description | Source | Reusable? | Cleanup Needed? |
|------|-----------|-------------|--------|-----------|-----------------|

Source options:

- API fixture
- DB seed
- Manual setup
- Existing test account
- Generated at runtime
- Mocked service
- Unknown — needs clarification

Data categories to cover:

- user accounts and roles
- prepared records and statuses
- specific dates
- permissions
- feature configurations
- preconfigured backend state
- files or images for upload
- payment/subscription test data if applicable
- external service test data if applicable

Prefer generated runtime data or API fixtures when possible.

Avoid tests depending on fragile shared data unless there is no realistic alternative.

---

## Step 10: Authentication & Session Handling

Identify authentication requirements for automation.

Create a role matrix:

| Role | Required For TC IDs | Login Method | Test Account Needed | Notes |
|------|---------------------|--------------|---------------------|-------|

Login method options:

- `storageState`
- `beforeAll` login flow
- `beforeEach` login flow
- custom auth fixture
- API login/token setup
- manual only

Assess:

- which user roles are needed
- whether multi-role scenarios require session switching
- whether tests need separate browser contexts
- whether token expiry can affect execution
- whether session timeout creates flakiness
- whether accounts can be reused safely in parallel runs

Recommend the safest authentication strategy for Playwright.

---

## Step 11: Test Isolation Assessment

For each Good Candidate or Medium Candidate, assess whether the test can run independently.

| TC ID | Independent? | Creates Data? | Cleanup Needed? | Parallel-Safe? | Shared-State Risk | Setup/Teardown Recommendation |
|------|--------------|---------------|-----------------|----------------|-------------------|-------------------------------|

Assess:

- Can the test run independently in any order?
- Does it create data that must be cleaned up after?
- Does it depend on state left by another test?
- Does it modify shared records?
- Could it fail when tests run in parallel?
- Does it require unique generated data?
- Does it need API cleanup after execution?

Recommended setup/teardown options:

- `beforeAll` suite setup
- `beforeEach` data setup
- `afterEach` cleanup
- `afterAll` cleanup
- API cleanup helper
- isolated test account per worker
- unique generated test data
- manual cleanup only

Every Good Candidate must have a defined isolation assessment.

---

## Step 12: Automation Plan

Create a practical implementation plan.

### Test Files to Create

Recommended structure:

automation/web/playwright/tests/
  [feature-name]/
    [feature-name].spec.ts              — P1 smoke + core flows using @smoke @critical
    [feature-name]-regression.spec.ts   — P2 regression cases using @regression
    [feature-name]-edge.spec.ts         — P3 edge cases if needed

### Suggested Page Objects

automation/web/playwright/pages/
  [FeatureName]Page.ts

For each Page Object, briefly describe responsibility:

| Page Object | Responsibility |
|------------|----------------|
| [FeatureName]Page.ts | [Description] |

### Suggested Fixtures / Helpers

automation/web/playwright/fixtures/
automation/web/playwright/helpers/

Identify what should be implemented as:

| Type | Name | Responsibility |
|------|------|----------------|
| Fixture | [fixture-name] | [Purpose] |
| Helper | [helper-name] | [Purpose] |
| API Helper | [api-helper-name] | [Purpose] |
| Data Builder | [data-builder-name] | [Purpose] |

Guidance:

- Page Objects should contain UI interactions and locators.
- Fixtures should manage authentication, browser context, and reusable setup.
- API helpers should create, reset, verify, or delete backend data.
- Data builders should generate unique and reusable test data.

### Execution Order

List TC IDs in recommended implementation order:

1. [TC ID] [Title] — [Reason for priority]
2. [TC ID] [Title] — [Reason for priority]

Start with:

- smoke tests
- stable happy paths
- high-risk regression scenarios
- scenarios with available data and selectors
- scenarios that can run independently

### Estimated Effort

Estimate:

- Total test cases reviewed: X
- Good Candidates: X
- Medium Candidates: X
- Manual Only: X
- Not Recommended Now: X
- Total test cases recommended for first automation sprint: X
- Estimated development time: X hours
- Maintenance risk: Low / Medium / High

Use rough effort estimation:

- Simple UI validation: 1–2 hours
- Standard form flow with setup/cleanup: 3–5 hours
- API setup + UI validation: 4–6 hours
- Multi-role scenario: 5–8 hours
- Complex external dependency, file upload, notification, payment, or subscription flow: 8+ hours
- Scenario requiring missing test IDs or missing API support: do not include in active estimate until blocker is resolved

Maintenance risk guidance:

High maintenance risk if:

- many dynamic elements
- frequent UI changes
- complex data setup
- third-party dependencies
- unstable selectors
- time-dependent behavior
- no API cleanup
- parallel execution risks

Low maintenance risk if:

- stable UI
- predictable data
- simple flows
- reusable Page Objects
- API setup/cleanup available
- stable selectors available

---

## Step 13: Playwright Runtime Notes

Provide runtime behavior notes, not code.

Cover:

- stable locator strategy
- recommended use of `data-testid`
- use of ARIA roles where appropriate
- when visible text locators are acceptable
- `beforeAll` setup
- `beforeEach` setup
- `afterEach` teardown
- `afterAll` teardown
- browser/context strategy
- retries policy if relevant
- handling of async operations
- handling of loading states
- handling of network requests
- handling of test data uniqueness
- recommended tags for fast and full test runs

Locator strategy priority:

1. `data-testid`
2. ARIA role and accessible name
3. stable visible text
4. stable form labels
5. CSS selectors only if stable and unavoidable

Do not recommend selectors based on:

- generated class names
- visual position
- CSS styling
- fragile DOM hierarchy
- dynamic text that changes frequently

Do not generate Playwright code unless the user explicitly asks.

---

## Step 14: CI/CD Readiness

Assess whether automated tests can run in CI.

| Area | Status | Notes / Requirements |
|------|--------|----------------------|
| Headless execution | Ready / Not Ready / Partial | [Notes] |
| Environment variables | Ready / Not Ready / Partial | [Notes] |
| Credentials | Ready / Not Ready / Partial | [Notes] |
| Test data | Ready / Not Ready / Partial | [Notes] |
| API setup/cleanup | Ready / Not Ready / Partial | [Notes] |
| External services | Ready / Not Ready / Partial | [Notes] |
| Parallel execution | Ready / Not Ready / Partial | [Notes] |
| Runtime duration | Acceptable / Too long / Unknown | [Notes] |

Assess:

- Can tests run in headless mode without manual intervention?
- Are environment variables required?
- Are credentials required?
- Are API keys or service tokens required?
- Are there dependencies on external services?
- Is test data environment-specific?
- Are tests staging-only or production-only?
- Are there long-running tests that should be excluded from fast CI runs?
- Which tests are safe for CI?
- Which tests require special setup?

Recommend:

- tests safe for every PR run
- tests safe for nightly runs
- tests safe only before release
- tests that should not run in CI yet

---

## Step 15: Risks and Blockers

Categorize all identified risks and blockers.

### Technical Risks

Include risks such as:

- flaky behavior
- dynamic content
- timing issues
- animation dependencies
- unstable selectors
- iframe or third-party widget dependency
- file upload/download instability
- browser-specific behavior

### Data Risks

Include risks such as:

- missing fixtures
- production-only data
- shared test data
- data cleanup challenges
- test account conflicts
- environment-specific records
- inability to reset state

### Environment Risks

Include risks such as:

- no staging environment
- staging not matching production
- third-party service dependencies
- unstable test environment
- missing environment variables
- missing credentials
- unavailable API endpoints

### Process Blockers

Include blockers such as:

- missing test IDs
- unclear requirements
- changing requirements
- missing API endpoints for setup or cleanup
- no backend reset mechanism
- no ownership for test data
- no agreement on automation scope
- team capacity or knowledge gaps

Output format:

| Category | Risk / Blocker | Impact | Recommended Action | Owner |
|----------|----------------|--------|--------------------|-------|

Owner options:

- QA
- Automation QA
- Developer
- DevOps
- Product Owner
- Design
- Unknown

---

## Step 16: Final Recommendation

Provide a concise final recommendation.

Include:

- whether automation should start now
- what should be automated first
- what must be resolved before implementation
- what should remain manual
- recommended first sprint scope
- expected benefit of the first automation sprint

Format:

### Final Recommendation

[Clear summary in 3–6 sentences]

### First Sprint Scope

- [TC ID] [Scenario]
- [TC ID] [Scenario]
- [TC ID] [Scenario]

### Must Be Resolved Before Automation Starts

- [Blocker 1]
- [Blocker 2]
- [Blocker 3]

---

## Rules

- Do not automate everything.
- Prioritize high-value, stable, independent scenarios.
- Prefer lower-level automation when possible.
- Do not recommend E2E UI automation for scenarios that can be reliably covered by API-level tests.
- Do not recommend automation for unclear or unstable functionality.
- Do not generate automation code in this prompt.
- Do not invent missing APIs.
- Do not invent existing selectors.
- Do not invent credentials, test accounts, or test data.
- Clearly mark assumptions.
- Clearly mark what must be resolved before automation can start.
- Keep the plan realistic for a QA engineer building the suite incrementally.
- Every Good Candidate must have a defined tag, priority, and isolation assessment.
- Every Medium Candidate must have a clear blocker or condition before implementation.
- Every Manual Only scenario must have a reason why it should remain manual.
- Avoid production, payment, subscription, destructive, or real-user-data automation unless a dedicated safe test environment and safe test accounts are available.

Save output to:

_bmad-output/test-artifacts/test-design/[feature-name]-automation-plan.md
```

---

## Tips
- Use BMAD skill `/bmad-qa-generate-e2e-tests` to generate Playwright test code from this plan
- Use `/bmad-testarch-automate` to expand coverage after the initial suite is built
- Prioritize P1 test cases first — build the regression suite incrementally
- Unstable selectors → review BMAD TEA knowledge: `selector-resilience.md`
- API support gaps → align with the dev team before starting automation
- storageState for auth → see Playwright docs on authentication reuse across tests
