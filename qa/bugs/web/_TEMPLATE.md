# BUG-WEB-XXX — [Short title]

> Replace `XXX` with a unique number. File name convention: `BUG-WEB-0042-short-title.md`.

## Summary

One sentence describing the problem.

## Severity / Priority

- **Severity:** S1 (blocker) / S2 (major) / S3 (minor) / S4 (cosmetic)
- **Priority:** P0 / P1 / P2 / P3

## Environment

| Field | Value |
|---|---|
| URL | https://staging.example.com/... |
| Environment | dev / staging / prod |
| Build / commit | `<git sha>` or release tag |
| Browser | Chrome 124.0.6367.91 |
| OS | macOS 14.4 / Windows 11 / Ubuntu 22.04 |
| Viewport / device | Desktop 1440×900 / iPhone 15 Safari (390×844) |
| User role | guest / authenticated / admin |
| Feature flags | flag-name=on |

## Steps to reproduce

1.
2.
3.

## Expected result

What should happen.

## Actual result

What actually happens.

## Frequency

- [ ] Always
- [ ] Intermittent (e.g. 2/5 attempts)
- [ ] One-time

## Evidence

- Screenshot: ![screenshot](path/to/screenshot.png)
- Video / GIF: [link]
- Console errors:
```
<paste relevant console output>
```
- Network failures (status codes, request/response):
```
<paste relevant network log>
```
- Playwright trace (if from automation): `automation/web/playwright/test-results/...`

## Workaround

If any.

## Related

- Requirement: [docs/requirements/web/...]
- Test case: [qa/test-cases/web/...]
- Linear / Jira: PROJ-123
