#!/usr/bin/env bash
# Start Appium server with default drivers. Install drivers once:
#   appium driver install uiautomator2
#   appium driver install xcuitest
#   appium driver install --source=npm appium-flutter-driver
set -euo pipefail
appium --address "${APPIUM_HOST:-127.0.0.1}" --port "${APPIUM_PORT:-4723}" --log-level info
