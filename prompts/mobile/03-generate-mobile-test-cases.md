# Prompt M03 — Generate Mobile Test Cases

## Purpose
Generate detailed, executable mobile test cases with platform-specific expectations, gestures, and Appium-friendly locator hints (when automation is in scope).

## When to Use
- After analysis (M01) and checklist (M02) exist
- For features going into formal regression
- Before scaffolding Appium tests

## Input Required
- Analysis: `_bmad-output/test-artifacts/test-design/mobile/{feature}-analysis.md`
- Checklist: `qa/checklists/mobile/.../checklist-{feature}.md`
- Template: `qa/test-cases/mobile/_TEMPLATE.md`
- Device matrix: `qa/device-matrix/device-matrix.md`

---

## Prompt

```
You are a Senior Mobile QA Engineer. Generate detailed test cases for the feature below, ready for execution (manual or as a basis for Appium + Python automation).

Inputs:
- Analysis: [paste from _bmad-output/test-artifacts/test-design/mobile/{feature}-analysis.md]
- Checklist: [paste from qa/checklists/mobile/.../checklist-{feature}.md]

Target platforms: [iOS / Android / both]
Min OS: [from supported-devices.md]
Stack for automation: Appium + Python + pytest, Page Object Model in automation/mobile/pages/

For each test case, follow this format:

---

### TC-MOB-XXX — [short, action-oriented title]

| Field | Value |
|---|---|
| ID | TC-MOB-XXX |
| Feature | |
| Platform | iOS / Android / Both |
| Min OS | |
| Type | Functional / E2E / Smoke / Regression / Negative / Edge |
| Priority | P0 / P1 / P2 |
| Automation candidate | Yes / No / Manual-only (and why) |
| Requirement | [link] |

**Preconditions**
- App state, account, permissions, network, device, etc.

**Test data**
```json
{ ... }
```

**Steps**
| # | Action | Expected result |
|---|---|---|
| 1 | (use mobile verbs: tap, long-press, swipe left on, pull down on…) | (observable result, with platform note if it differs) |

**Platform-specific expectations**
- iOS: ...
- Android: ...

**Locator hints for automation** (only if `Automation candidate = Yes`)
- iOS: accessibility id `login_button` (XCUITest)
- Android: resource-id `com.example:id/btn_login` or accessibility id `login_button` (UiAutomator2)
- Flutter (if applicable): ByValueKey('login_button') or by Semantics label

**Edge cases to also cover** (optional sub-list)
- ...

---

Coverage requirements for the batch you produce:
- At least one **happy path** test case per platform.
- At least one **negative / validation** test case.
- At least one **permission-flow** test case if the feature touches permissions.
- At least one **lifecycle** test case (background → foreground, kill → resume) if state matters.
- At least one **offline / poor network** test case if the feature is network-dependent.
- At least one **deep link entry** test case if the feature has a deep link.
- At least one **a11y** test case (VoiceOver/TalkBack labels reachable).

Number test cases sequentially starting from a value the user provides. End with a summary table listing all generated IDs with title, priority, automation flag.
```

## Output Location
- Individual files: `qa/test-cases/mobile/TC-MOB-XXXX-{slug}.md`
- Or a single bundled file per feature: `qa/test-cases/mobile/{feature}-test-cases.md`
- AI-generated drafts: `_bmad-output/test-artifacts/test-design/mobile/{feature}-test-cases.md`

## Notes for the QA reviewer
- Verify locator hints with `appium inspector` before they go into Appium code.
- Confirm priority and automation flag with the team before committing.
