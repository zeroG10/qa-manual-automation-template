# TC-MOB-XXX — [Test case title]

> Naming: `TC-MOB-0042-login-with-biometrics-ios.md`

## Metadata

| Field | Value |
|---|---|
| ID | TC-MOB-XXX |
| Feature | Login / Push / Deep link / etc. |
| Platform | iOS / Android / Both / Flutter |
| Min OS | iOS 16 / Android 12 |
| Type | Functional / E2E / UI / Smoke / Regression / Exploratory |
| Priority | P0 / P1 / P2 |
| Automation | Yes (`automation/mobile/tests/...`) / No / Candidate |
| Requirement | [docs/requirements/mobile/REQ-MOB-001.md] |
| Author | @username |
| Last updated | YYYY-MM-DD |

## Preconditions

- App freshly installed (or specific state — describe)
- User account: `qa+demo@example.com`
- Permissions: Notifications **not yet requested**
- Network: Wi-Fi (or specify)
- Device: Pixel 7 (Android 14) — see [device matrix](../../device-matrix/device-matrix.md)

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
| 1 | Launch app (cold start) | Splash → onboarding screen 1, no crashes |
| 2 | Tap **Skip** in top-right | Login screen appears within 1s |
| 3 | Tap email field, type email | Keyboard appears (email type), no autocorrect underlines |
| 4 | Tap password field, type password | Keyboard switches to default, characters masked |
| 5 | Tap **Sign in** button | Loading indicator → home screen within 5s |

## Platform-specific expectations

### iOS
- Sign-in button uses `.systemBlue` color
- Biometric prompt appears if Face ID enrolled (see TC-MOB-0043)
- Status bar style: light content over blue header

### Android
- Material ripple effect on button press
- Back button on login screen exits app (with confirmation)
- Predictive back gesture works on Android 14+

## Post-conditions

- User authenticated; session token stored in Keychain (iOS) / EncryptedSharedPreferences (Android)
- Home screen tab bar visible

## Gestures / interactions to verify

- [ ] Tap
- [ ] Long press
- [ ] Swipe (specify direction)
- [ ] Pinch / zoom
- [ ] Pull-to-refresh
- [ ] Scroll (specify list)

## Edge cases to consider

- App backgrounded mid-flow → resume returns to same screen
- Airplane mode toggled mid-request → graceful error
- Low memory → no crash on resume
- Rotation portrait↔landscape (if supported)

## Notes

- Accessibility: VoiceOver / TalkBack labels on all interactive elements
- Tested on devices: see [device matrix P0 row](../../device-matrix/device-matrix.md)
