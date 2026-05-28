# TC-WEB-XXX — [Test case title]

> Naming: `TC-WEB-0042-login-with-valid-credentials.md`

## Metadata

| Field | Value |
|---|---|
| ID | TC-WEB-XXX |
| Feature | Login / Checkout / etc. |
| Type | Functional / E2E / UI / Smoke / Regression |
| Priority | P0 / P1 / P2 |
| Automation | Yes (`automation/web/playwright/tests/...`) / No / Candidate |
| Requirement | [docs/requirements/web/REQ-001.md] |
| Author | @username |
| Last updated | YYYY-MM-DD |

## Preconditions

- User is logged out
- Browser cache cleared
- Test data: `qa+demo@example.com`

## Test data

```json
{
  "email": "qa+demo@example.com",
  "password": "Demo12345!"
}
```

## Steps

| # | Action | Expected result |
|---|---|---|
| 1 | Navigate to `/login` | Login page loads, email field is focused |
| 2 | Enter valid email | Email field shows green checkmark |
| 3 | Enter valid password | Password field accepts input (masked) |
| 4 | Click **Sign in** | Redirected to `/dashboard` within 3s, user menu shows email |

## Post-conditions

- User session cookie set
- `/dashboard` accessible on refresh

## Notes

- Cross-browser: must pass on Chrome, Firefox, Safari (see [supported-devices.md](../../../docs/platform-specs/supported-devices.md))
- a11y: form must be navigable with Tab key only
