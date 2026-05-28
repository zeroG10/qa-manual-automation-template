# Mobile Automation — Appium + Python

Стек: **Appium 2 + Appium-Python-Client + pytest + Allure**, менеджер залежностей — **uv**.

Підтримує: Android (UiAutomator2), iOS (XCUITest), Flutter (Flutter driver або native + Semantics).

## 1. Передумови

- Python 3.11+
- Node.js 18+ (для Appium server)
- Java 17+ (для Android)
- Xcode + Command Line Tools (для iOS, лише macOS)
- Android SDK + emulator або реальний девайс із увімкненим USB debugging
- Allure CLI: `brew install allure`

## 2. Встановлення Appium

```bash
npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest
appium driver install --source=npm appium-flutter-driver
```

Перевірити готовність оточення:

```bash
npm install -g appium-doctor
appium-doctor --android
appium-doctor --ios
```

## 3. Встановлення Python-залежностей

```bash
cd automation/mobile
uv sync
```

## 4. Налаштування

```bash
cp .env.example .env
# відредагувати під свій проєкт: device, app path, package/bundle id
```

Покласти build у `builds/`:
- Android: `app-debug.apk`
- iOS: `App.app` (для симулятора) або `.ipa` (для реального девайсу)

## 5. Запуск

Термінал 1 — Appium server:

```bash
bash scripts/start_appium.sh
```

Термінал 2 — тести:

```bash
# Android
uv run pytest --platform=android -m smoke

# iOS
uv run pytest --platform=ios -m smoke

# Конкретна папка
uv run pytest tests/android/

# Паралельно (різні платформи в різних інстансах Appium на різних портах)
uv run pytest -n 2
```

## 6. Звіти Allure

```bash
allure serve allure-results
```

## 7. Flutter-додатки

Два сценарії:

**A. Flutter driver** — точне керування widgets, але потрібен debug/profile build з `enableFlutterDriverExtension()`.
Встановити `FLUTTER_ENABLED=true` у `.env` — `automation_name` стане `Flutter`.
Локатори: `appium_flutter_finder` (ByValueKey, ByText, BySemanticsLabel).

**B. Native + Semantics** — production build, локатори через `AccessibilityId` (з `Semantics(label: ...)` у Flutter-коді).
Залишити `FLUTTER_ENABLED=false`. Працює як звичайний native-тест.

Рекомендація: **B** для smoke/E2E на release-білдах, **A** для глибоких сценаріїв на debug-білдах.

## 8. Структура

```
automation/mobile/
├── config/         # capabilities + settings (через pydantic-settings)
├── tests/
│   ├── ios/        # iOS-специфічні
│   ├── android/    # Android-специфічні
│   ├── flutter/    # Flutter driver сценарії
│   └── shared/     # кросплатформенні (параметризуються платформою)
├── pages/          # Page Object Model
├── helpers/        # gestures, waits, device commands
├── fixtures/       # тестові дані
├── builds/         # .apk / .ipa (gitignored)
└── scripts/        # утиліти (start_appium, reset_simulator)
```

## 9. Маркери pytest

- `@pytest.mark.smoke` — критичні smoke
- `@pytest.mark.regression` — повний регрес
- `@pytest.mark.ios` / `@pytest.mark.android` / `@pytest.mark.flutter` — платформо-специфічні
- `@pytest.mark.shared` — кросплатформенні

Приклад: `pytest -m "smoke and android"`.
