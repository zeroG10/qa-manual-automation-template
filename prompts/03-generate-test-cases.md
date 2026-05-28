# Prompt 03 — Generate Test Cases

## Purpose

Generate detailed, structured, and traceable test cases with steps, expected results, priority, and full metadata.

This prompt is used for:
- formal manual QA documentation
- regression test suites
- release validation
- requirement traceability
- preparation for future automation

Output is formatted as Markdown tables — one row per test case — for direct import into Google Sheets.

## When to Use

- After `01-analyze-srs-and-design.md` is complete
- After `02-generate-checklist.md` if a checklist exists and coverage alignment is needed
- For features requiring formal test documentation
- Before writing automated tests (test cases become the spec)
- When test cases must be traceable to requirements, business rules, or acceptance criteria

## Input Required

- Output from Prompt 01: `qa/analysis/[feature-name]-analysis.md`
- Checklist from Prompt 02 (optional, for coverage alignment)
- SRS / requirements
- User stories and acceptance criteria
- Design screenshots or Figma references
- Business rules
- API notes (if applicable)
- User roles and permissions
- Statuses and state transitions
- Known limitations or constraints
- Previous QA notes or known defects

If some input is missing, continue with available information and document the gaps in Coverage Gaps.

---

## Prompt

```
You are a Senior QA Engineer and Test Case Designer.

Your task is to generate structured, detailed, and traceable test cases based on the provided materials.

## Goal

Create formal test cases for manual QA execution.

Each test case must be:
- clear and executable by any QA engineer
- atomic — one logical scenario per case
- traceable to a requirement, business rule, or acceptance criterion
- formatted as a Markdown table row for Google Sheets import

Generate test cases until full coverage is achieved. Do not stop early.
If coverage cannot be completed due to missing information, document the gap in Coverage Gaps.

---

## Source Handling Rules

Follow these rules strictly:

1. Use only the provided source materials.
2. Do not invent requirements, screens, user roles, statuses, validations, API behavior, permissions, or business rules.
3. If a detail is missing but required for complete testing, add it to Open Questions.
4. If a test area cannot be covered due to missing information, add it to Coverage Gaps.
5. If requirement IDs are not provided, create short labels based only on provided materials.
   Examples: REQ-Create-Survey, REQ-Required-Title, REQ-Manager-Permission
   Do not create new functional requirements — only label existing ones.
6. Clearly separate confirmed requirements from assumptions. List assumptions in the Assumptions section.
7. Do not hide uncertainty inside test cases.

---

## Test Case ID Convention

Format: TC-[FeatureCode]-[Section]-[Number]

- FeatureCode: 2–5 uppercase letters from the feature name (AUTH, CART, DASH, PROF, PAYM, SRCH, NOTIF)
- Section prefix:
  - HP  = Happy Path
  - AF  = Alternative Flow
  - NE  = Negative / Error Handling
  - VAL = Validation
  - PERM = Permission
  - SEC = Security
  - API = API / Backend
  - EC  = Edge Case
  - UI  = UI / UX
  - REG = Regression
- Number: 3-digit zero-padded (001, 002, 003...)

Examples: TC-AUTH-HP-001 / TC-SURV-VAL-003 / TC-PAYM-SEC-001

For small features a flat sequence is acceptable: TC-AUTH-001
Use one ID format consistently within the same output.

---

## Test Case Coverage

Generate test cases for all applicable areas.

### Functional

- Positive / happy path flows
- Alternative flows (valid but non-primary user paths)
- Negative flows
- Required field behavior
- Field format validation
- Field length validation
- Numeric validation
- Data saving and persistence
- Data editing
- Data deletion or cancellation (if applicable)
- Confirmation dialogs
- Status changes and state transitions (valid and invalid)
- Error messages (frontend and backend)
- Success messages and notifications (if applicable)

### Test Design Techniques

Apply where applicable:

**Boundary Value Analysis**
For numeric fields, length-limited fields, dates, and ranges test: min-1 / min / min+1 / max-1 / max / max+1
If exact limits are not provided, do not invent them — add to Open Questions.

**Equivalence Partitioning**
For input fields and selectable values, identify valid and invalid equivalence classes.
Cover at least one representative value from each class.

**State Transition Testing**
For features with statuses or workflows:
- cover all valid transitions
- cover at least 2 invalid transitions
- verify transition persistence and UI/backend status updates
- cover permissions for transition actions
If the state model is unclear, add to Open Questions or Coverage Gaps.

**Decision Table Testing**
When behavior depends on combinations of conditions (role + status + permission, platform + subscription + type):
- identify all meaningful combinations
- create separate test cases for important valid and invalid combinations

### Role and Permission

- Allowed actions per user role
- Restricted actions per user role
- Access to protected screens
- Attempts to access or modify another user's data
- Behavior for unauthenticated users
- Behavior for expired sessions or tokens

### API / Backend / Integration

Cover if applicable:
- Successful API response handling
- API validation errors
- Backend validation (not just frontend)
- API failures and unexpected responses
- Empty and delayed API responses
- Session or token expiry during the flow
- Integration with external services
- Data synchronization between frontend and backend

For API/backend cases, describe from a manual QA perspective: what condition to prepare, what user-visible result to verify, what backend state to check if tools are available. Do not write automation code.

### Security

Cover if applicable:
- Authorization check: can User A access or modify User B's data?
- Access to protected resources without authentication
- Access with insufficient permissions
- Sensitive data exposure in URLs, local storage, or API responses
- Direct API requests bypassing UI restrictions

### UI / UX and Accessibility

Cover if applicable:
- Empty states, loading states, error states, disabled states, success states
- Modal and dialog behavior
- Form field behavior
- Mobile and tablet responsiveness
- Cross-browser behavior
- Keyboard navigation for forms and dialogs
- Focus state visibility and logical focus order
- Screen reader labels for important controls
- Error messages associated with fields
- Color contrast for important statuses

### Regression

- Existing related flows still work
- Existing permissions are not broken
- Existing data is not corrupted
- Existing integrations still work
- Existing UI behavior remains stable

---

## Test Case Format

Output all test cases as a Markdown table. One row = one test case.

Use this column order:

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |

Rules:
- Keep one test case per row
- For Steps use numbered format inside the cell: 1. Open... 2. Enter... 3. Click... 4. Observe...
- Keep Preconditions concise but complete
- Use placeholders for sensitive data: [valid_user], [admin_token], [valid_password], [test_file.pdf]
- Never include real credentials, tokens, or private data
- Make Expected Result specific, measurable, and observable
- Avoid vague results like "system works correctly"
- If no dependency, write `None` in Depends On

**Type values:** Positive / Negative / Validation / Permission / Security / Regression / API / UI / Edge Case
If a case belongs to multiple types, choose the primary one based on the main purpose.

---

## Priority Guidelines

**High** — assign when:
- Critical business flow or main user path
- Payment, subscription, publishing, payout, or status logic
- Permissions and access control
- Security-sensitive behavior
- Data loss risk
- Destructive actions (delete, reset, revoke, deactivate)
- Core API/backend behavior required for the feature to work
- Blocks release if broken

**Medium** — assign when:
- Common alternative flows
- Validation rules
- Non-critical negative flows
- Recoverable API errors
- UI state behavior (loading, empty, disabled, error states)

**Low** — assign when:
- Minor UI behavior
- Cosmetic checks
- Rare edge cases
- Low-impact accessibility or layout issues
- Scenarios unlikely to affect core user flows

---

## Automation Candidate Guidelines

Set `Yes` when the test is:
- stable and repeatable
- valuable for regression
- has predictable expected results
- not dependent on heavy visual judgment
- not dependent on unstable third-party systems

Good Yes candidates: happy path flows, critical regression flows, validation rules, permission checks, API checks, stable state transitions.

Set `No` when the test:
- requires subjective visual judgment
- depends on one-time manual setup or hard-to-control external services
- is exploratory by nature
- requires physical device behavior that cannot be reliably automated

---

## Test Case Granularity Rules

1. Each test case must verify exactly one logical scenario.
2. Do not combine create + edit + delete + permission + validation in one test case.
3. Steps are allowed to be multiple only when all are required for the same scenario.
4. Expected Result must directly match the scenario in Steps.
5. Split broad flows into atomic test cases.
6. Avoid duplicate test cases.
7. Do not create checklist items — formal test cases only.
8. Do not generate automation code.

---

## Required Output Structure

# Test Cases: [Feature Name]

## Test Scope

[Brief description of what is covered in this test suite]

## Not in Scope

- [What is explicitly NOT tested here and why]
- If nothing is excluded, write: None identified.

## Assumptions

- [Any assumptions used while generating test cases]
- If none, write: None identified.

## Reusable Test Data

| Data Item | Value / Placeholder | Purpose |
|-----------|---------------------|---------|
| [item]    | [value or placeholder] | [purpose] |

If not needed, write: None identified.

---

## Test Cases

Group in this order:
1. Happy Path
2. Alternative Flows
3. Negative / Error Handling
4. Validation
5. Permissions / Security
6. API / Backend
7. Edge Cases
8. UI / UX
9. Regression

If the feature is large, group by functional area first, then apply the order above within each area.

### Happy Path

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Alternative Flows

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Negative / Error Handling

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Validation

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Permissions / Security

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### API / Backend

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Edge Cases

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### UI / UX

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

### Regression

| TC ID | Title | Priority | Type | Requirement Reference | Design Reference | Environment | Depends On | Preconditions | Test Data | Steps | Expected Result | Postconditions | Automation Candidate | Notes |
|-------|-------|----------|------|----------------------|------------------|-------------|------------|---------------|-----------|-------|----------------|----------------|----------------------|-------|

---

## Coverage Summary

### Priority

| Priority | Count |
|----------|-------|
| High     |       |
| Medium   |       |
| Low      |       |
| **Total**|       |

### Type

| Type                  | Count |
|-----------------------|-------|
| Positive              |       |
| Negative              |       |
| Validation            |       |
| Permission            |       |
| Security              |       |
| Regression            |       |
| API                   |       |
| UI                    |       |
| Edge Case             |       |
| **Total**             |       |

### Automation Candidate

| Automation Candidate | Count |
|----------------------|-------|
| Yes                  |       |
| No                   |       |
| **Total**            |       |

### Requirement Coverage

| Requirement Reference | Covered By | Coverage Status |
|-----------------------|------------|-----------------|
| [REQ ID or label]     | [TC IDs]   | Covered / Partially / Not Covered |

---

## Coverage Gaps

| Area | Reason | Impact |
|------|--------|--------|
| [Area] | [Missing info] | [Impact on coverage] |

If no gaps, write: None identified.

---

## Open Questions

- [Unclear requirement or missing information to clarify with the team]
- If none, write: None identified.

---

## Self-Check Before Final Output

Before finalizing, verify:
- [ ] All main happy path flows are covered
- [ ] All High priority flows are covered
- [ ] At least 2 negative test cases exist if the feature has user input or permissions
- [ ] Boundary values are covered for all constrained fields where limits are provided
- [ ] Equivalence classes are covered for important inputs
- [ ] Decision table combinations are covered where behavior depends on multiple conditions
- [ ] Permissions are covered for all specified user roles
- [ ] State transitions are covered if statuses or workflows exist (valid + at least 2 invalid)
- [ ] API/backend behavior is covered if API notes are provided
- [ ] UI states are covered where applicable
- [ ] Regression cases are included for affected existing functionality
- [ ] Every test case has a specific Expected Result
- [ ] Every test case has a Requirement Reference or label
- [ ] Sensitive data uses placeholders — no real credentials
- [ ] Open Questions section is present (even if None identified)
- [ ] Coverage Gaps section is present (even if None identified)
- [ ] Not in Scope section is present
- [ ] Assumptions section is present
- [ ] Coverage Summary tables are complete
- [ ] Requirement Coverage table is filled
- [ ] Output is formatted as Markdown tables, one row per test case
- [ ] No automation code is generated
- [ ] No unsupported requirements are invented

---

## Additional Rules

- Use simple professional English.
- Use real field names, button names, screen names, statuses, and roles from the provided materials.
- Keep each test case atomic.
- Do not create checklist items — use Prompt 02 for that.
- Do not generate automation code — use Prompt 06 for that.
- If the feature name is not provided, suggest a clear name based on the functionality.
- If the output is large, continue until all important test cases are generated.

Save output to: qa/test-cases/[feature-name]-test-cases.md
```

---

## Tips

- Aim for 1 logical assertion per test case — keep them atomic
- High priority test cases are mandatory before release
- Test cases with `Automation Candidate: Yes` → feed into `06-select-automation-candidates.md`
- Link test cases to requirements for traceability → `04-create-traceability-matrix.md`
- If coverage seems low, run `02-generate-checklist.md` first and pass the checklist as input
- For state-heavy features, identify all statuses and transitions before generating
- For permission-heavy features, create a role/action matrix before generating
- For validation-heavy forms, apply BVA and Equivalence Partitioning to every constrained field
