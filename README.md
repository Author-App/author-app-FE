# Author App

A React Native app built with Expo, Tamagui, and TypeScript.

## 🛠️ Tech Stack

- **Framework**: Expo ~54.0
- **Router**: Expo Router v6
- **UI Library**: Tamagui
- **Language**: TypeScript
- **Package Manager**: pnpm

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v10+)
- [EAS CLI](https://docs.expo.dev/build/setup/): `npm install -g eas-cli`
- iOS: [Xcode](https://developer.apple.com/xcode/) (Mac only)
- Android: [Android Studio](https://developer.android.com/studio)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm start
```

- Press `i` for iOS simulator
- Press `a` for Android emulator

### 3. Clear Cache (if needed)

```bash
rm -rf node_modules/.cache .expo
pnpm expo start --clear
```

## 🔨 Build Commands

### Local Native Builds

```bash
# iOS (Mac only)
npx expo run:ios

# Android
npx expo run:android
```

### EAS Cloud Builds

```bash
eas build --platform android
eas build --platform ios
eas build --platform all
```

### Clean Rebuild

When adding new native packages or fixing build issues:

```bash
rm -rf ios android
npx expo prebuild --clean
npx expo run:ios   # or run:android
```

## ⚠️ iOS New Architecture Fix (Important!)

This app uses React Native's **New Architecture** with bridgeless mode (`"newArchEnabled": true`). After running `npx expo prebuild`, you **must** fix the AppDelegate.swift file.

### The Issue

The generated `AppDelegate.swift` includes a `sourceURL(for bridge:)` method that references `RCTBridge`, which doesn't exist in bridgeless mode.

### The Fix

Edit `ios/stanleypaden/AppDelegate.swift` and **remove** the `sourceURL` method:

**Before (broken):**
```swift
class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
    // ...
  }
}
```

**After (working):**
```swift
class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
```

## 📁 Project Structure

```
author-app/
├── app/                    # Expo Router screens
│   ├── (app)/             # Authenticated routes
│   │   └── (tabs)/        # Tab navigation (home, library, media, store, profile)
│   └── (public)/          # Public routes (login, signup, onboarding)
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── store/             # Redux store & slices
│   └── utils/             # Helper functions
├── assets/                # Fonts, icons, images
└── tamagui.config.ts      # Theme configuration
```

---

Built with Expo and Tamagui