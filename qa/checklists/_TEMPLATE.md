# Checklist — [Feature / area name]

> Naming: `checklist-login.md`, `checklist-push-notifications.md`. Place under the right subfolder:
> - `qa/checklists/web/` — browser-specific
> - `qa/checklists/mobile/{ios,android,cross-platform}/` — mobile-specific
> - `qa/checklists/shared/` — a11y, security, perf, i18n

## Metadata

| Field | Value |
|---|---|
| Feature | |
| Platform | web / iOS / Android / cross-platform / shared |
| Owner | @username |
| Last reviewed | YYYY-MM-DD |
| Related requirements | [docs/requirements/.../REQ-XXX.md] |

## Functional

- [ ] Happy path works end-to-end
- [ ] All required fields validated
- [ ] Optional fields work and are truly optional
- [ ] Error messages are clear and actionable
- [ ] Success states are obvious to the user

## Edge cases

- [ ] Empty input
- [ ] Maximum length / payload
- [ ] Special characters / emoji / RTL text
- [ ] Duplicate submissions / double-tap
- [ ] Slow / no network

## UI / UX

- [ ] Matches Figma designs
- [ ] Responsive at all supported viewports (web) / device classes (mobile)
- [ ] Dark mode (if supported)
- [ ] Loading states present
- [ ] Empty states present
- [ ] Error states present

## Accessibility

- [ ] Keyboard navigation (web) / TalkBack / VoiceOver labels (mobile)
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] Dynamic Type / font scaling supported (mobile)

## Security

- [ ] No sensitive data in logs
- [ ] Auth required where expected
- [ ] Session timeout handled
- [ ] Input sanitized (XSS, SQLi where applicable)

## Performance

- [ ] Initial load < target (specify)
- [ ] No jank during interactions
- [ ] No memory leaks on repeated use

## Analytics

- [ ] Events fire correctly
- [ ] No duplicate events
- [ ] Properties match spec
