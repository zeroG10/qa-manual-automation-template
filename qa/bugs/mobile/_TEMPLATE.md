# BUG-MOB-XXX — [Short title]

> Replace `XXX` with a unique number. File name convention: `BUG-MOB-0042-short-title.md`.

## Summary

One sentence describing the problem.

## Severity / Priority

- **Severity:** S1 (blocker / crash) / S2 (major) / S3 (minor) / S4 (cosmetic)
- **Priority:** P0 / P1 / P2 / P3

## Environment

| Field | Value |
|---|---|
| Platform | iOS / Android / Flutter (on iOS or Android) |
| OS version | iOS 17.4 / Android 14 (API 34) |
| Device | iPhone 15 Pro / Pixel 7 / Samsung Galaxy S23 |
| Form factor | phone / tablet / foldable |
| Device type | real device / simulator / emulator |
| App version | 2.4.1 (build 1234) |
| Build type | debug / release / TestFlight / internal track |
| Install method | App Store / TestFlight / Play Internal / sideload (.apk/.ipa) |
| Network | Wi-Fi / 4G / 5G / airplane mode / poor connection |
| Locale | en-US / uk-UA |
| Orientation | portrait / landscape |
| User role | guest / authenticated / admin |
| Feature flags | flag-name=on |
| Permissions state | camera=granted, location=denied, notifications=not-determined |

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
- [ ] First launch only
- [ ] After cold/warm restart
- [ ] One-time

## Crash? ANR?

- [ ] App crashed (attach crash log)
- [ ] App froze / ANR (Android)
- [ ] App backgrounded unexpectedly
- [ ] No crash

## Evidence

- Screenshot: ![screenshot](path/to/screenshot.png)
- Screen recording: [link]
- Crash log:
```
<paste from Xcode Devices or `adb logcat`>
```
- adb logcat (Android, last 100 lines):
```
adb logcat -d | tail -100
```
- iOS device logs (Console.app filtered by bundle id):
```
<paste relevant>
```
- Network capture: [Charles / Proxyman .chlsj or har]
- Appium server log (if from automation): `automation/mobile/...`

## Workaround

If any (e.g. "force-quit + reopen", "toggle airplane mode").

## Regression info

- Last known good version:
- First broken version:
- Related recent changes:

## Related

- Requirement: [docs/requirements/mobile/...]
- Test case: [qa/test-cases/mobile/...]
- Crashlytics / Sentry issue ID:
- Linear / Jira: PROJ-123
