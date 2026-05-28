# CI Workflows

Each stack has its own workflow. **Path filters** ensure a workflow runs only when its stack's files change — so editing a mobile test never triggers Playwright, and vice-versa.

## Workflows

| Workflow | Trigger paths | Runner | What it does |
|---|---|---|---|
| [web-tests.yml](web-tests.yml) | `automation/web/**`, root `package*.json` | `ubuntu-latest` | Installs Playwright + browsers, runs all E2E tests |
| [api-tests.yml](api-tests.yml) | `automation/api/**` | `ubuntu-latest` | uv sync → pytest smoke against `API_BASE_URL` secret |
| [mobile-android-tests.yml](mobile-android-tests.yml) | `automation/mobile/**` | `ubuntu-latest` + KVM emulator | Boots Android emulator, runs Appium pytest |
| [mobile-ios-tests.yml](mobile-ios-tests.yml) | `automation/mobile/**` | `macos-14` | Boots iOS simulator, runs Appium pytest |
| [lint.yml](lint.yml) | all PRs | `ubuntu-latest` | ruff (Python) + tsc (TypeScript) |

All workflows also support `workflow_dispatch` (manual trigger from the Actions tab).

## Required GitHub Secrets

Set these under **Repo → Settings → Secrets and variables → Actions**:

| Secret | Used by | Purpose |
|---|---|---|
| `API_BASE_URL` | api-tests | API endpoint to test |
| `API_TOKEN` | api-tests | Auth token for API |

For mobile, you'll likely need additional secrets when wiring up real build artifacts:
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — if APKs/IPAs are in S3
- `FIREBASE_TOKEN` — if using Firebase App Distribution

## ⚠️ Before mobile workflows can pass

Both `mobile-android-tests.yml` and `mobile-ios-tests.yml` have a **TODO** step that downloads the build artifact (`.apk` / `.app`). It currently `exit 1`s by design — replace it with your real source:

```yaml
# Example: from another job in the same workflow run
- uses: actions/download-artifact@v4
  with:
    name: app-debug-apk
    path: automation/mobile/builds/

# Example: from S3
- run: aws s3 cp s3://artifacts/${{ github.sha }}/app-debug.apk builds/app-debug.apk
```

You also need to populate `.env` (or set capabilities via env vars) so `APP_PACKAGE` / `BUNDLE_ID` match the build you're testing.

## Cost note

- `ubuntu-latest` is the cheapest runner (free for public repos, billed for private).
- `macos-14` is **10× more expensive** per minute on private repos. Run iOS tests sparingly:
  - Consider scheduling iOS smoke nightly instead of on every PR.
  - Use path filters aggressively to avoid wasting macOS minutes on non-mobile PRs.

## How to test locally before pushing

Each workflow's commands map to local commands documented in:
- [automation/web/](../../automation/web/) — `npm run pw:test`
- [automation/api/README.md](../../automation/api/README.md) — `uv run pytest`
- [automation/mobile/README.md](../../automation/mobile/README.md) — `uv run pytest --platform=...`
