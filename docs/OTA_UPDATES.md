# OTA (Over-The-Air) Updates Setup

This document describes how OTA updates are configured in the Author App using Expo's EAS Update service.

## Overview

OTA updates allow pushing JavaScript/TypeScript code changes to users without going through app store review. This is ideal for:
- Bug fixes
- UI changes
- New features (that don't require native code changes)

**Important:** OTA updates CANNOT change native code. Any changes to native modules, app.json native configurations, or Expo SDK version require a new app store build.

---

## Dependencies

### Primary Package

```json
{
  "expo-updates": "~29.0.16"
}
```

### Related Expo Packages

```json
{
  "expo": "~54.0.33",
  "expo-constants": "~18.0.13",
  "expo-router": "6.0.23"
}
```

### Full package.json Dependencies (for context)

```json
{
  "dependencies": {
    "@expo/vector-icons": "^15.0.2",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/slider": "^5.0.1",
    "@react-native-google-signin/google-signin": "^16.0.0",
    "@react-native-masked-view/masked-view": "^0.3.2",
    "@react-navigation/bottom-tabs": "^7.3.13",
    "@react-navigation/native": "^7.1.8",
    "@reduxjs/toolkit": "^2.9.1",
    "@sentry/react-native": "^7.2.0",
    "@shopify/flash-list": "2.0.2",
    "@stripe/stripe-react-native": "^0.50.3",
    "@tamagui/lucide-icons": "~1.126.1",
    "@tamagui/sheet": "~1.126.18",
    "expo": "~54.0.33",
    "expo-application": "^7.0.8",
    "expo-audio": "^1.1.1",
    "expo-av": "16.0.8",
    "expo-blur": "15.0.8",
    "expo-clipboard": "8.0.8",
    "expo-constants": "~18.0.13",
    "expo-dev-client": "~6.0.20",
    "expo-device": "~8.0.10",
    "expo-file-system": "~19.0.21",
    "expo-font": "14.0.11",
    "expo-image": "3.0.11",
    "expo-image-picker": "17.0.10",
    "expo-linear-gradient": "~15.0.8",
    "expo-linking": "8.0.11",
    "expo-notifications": "~0.32.16",
    "expo-router": "6.0.23",
    "expo-screen-orientation": "^9.0.8",
    "expo-secure-store": "^15.0.8",
    "expo-splash-screen": "31.0.13",
    "expo-status-bar": "3.0.9",
    "expo-updates": "~29.0.16",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

---

## Configuration

### app.json Configuration

```json
{
  "expo": {
    "name": "stanley-paden",
    "slug": "stanley-paden-staging",
    "version": "1.0.6",
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/7ed82ebb-1889-49c9-8925-9c793670c3f3",
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "plugins": [
      "expo-updates"
    ],
    "extra": {
      "eas": {
        "projectId": "7ed82ebb-1889-49c9-8925-9c793670c3f3"
      }
    }
  }
}
```

### Key Configuration Options Explained

| Option | Value | Description |
|--------|-------|-------------|
| `runtimeVersion.policy` | `"appVersion"` | Uses app version (1.0.6) to determine compatibility. Updates only work with matching app version. |
| `updates.url` | `https://u.expo.dev/...` | EAS Update server URL with project ID |
| `updates.checkAutomatically` | `"ON_LOAD"` | Automatically checks for updates when app loads |
| `updates.fallbackToCacheTimeout` | `0` | Don't wait for network; use cached bundle immediately |
| `projectId` | `7ed82ebb-1889-49c9-8925-9c793670c3f3` | Expo project identifier |

### eas.json Configuration

```json
{
  "cli": {
    "version": ">= 14.2.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    },
    "production": {
      "autoIncrement": true,
      "channel": "production"
    }
  }
}
```

### Update Channels

| Channel | Branch | Use Case |
|---------|--------|----------|
| `development` | - | Dev client builds (no OTA) |
| `preview` | `develop` | Internal testing builds |
| `production` | `main` | App store builds |

---

## How OTA Updates Work

### 1. Automatic Update Flow (Current Implementation)

```
App Launch
    ↓
checkAutomatically: "ON_LOAD"
    ↓
Expo checks https://u.expo.dev/[projectId]
    ↓
If update available for matching runtimeVersion + channel
    ↓
Download update in background
    ↓
Apply on NEXT app launch
```

**Important:** With current configuration, updates are applied on the NEXT app launch, not immediately.

### 2. Runtime Version Matching

The app uses `"policy": "appVersion"` which means:
- App version 1.0.6 can only receive updates published for 1.0.6
- If you publish an update for 1.0.7, users on 1.0.6 won't receive it
- This prevents incompatible JS bundles from loading on old native code

---

## Current Implementation in Code

### Location: `app/_layout.tsx`

The app currently has **diagnostic logging only** for updates:

```typescript
import * as Updates from 'expo-updates';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_UPDATE_ID_KEY = '@app/lastUpdateId';

export default function RootLayout() {
  useEffect(() => {
    async function logUpdateState() {
      try {
        const lastId = await AsyncStorage.getItem(LAST_UPDATE_ID_KEY);
        const currentId = Updates.updateId ?? 'embedded';
        const isNewBoot = currentId !== lastId;

        // Log to Sentry for debugging
        Sentry.addBreadcrumb({
          category: 'updates',
          message: `Boot state`,
          level: 'info',
          data: {
            currentUpdateId: currentId,
            lastUpdateId: lastId,
            channel: Updates.channel,
            runtimeVersion: Updates.runtimeVersion,
            createdAt: Updates.createdAt?.toISOString?.() ?? null,
            isEmbeddedLaunch: Updates.isEmbeddedLaunch,
            isEnabled: Updates.isEnabled,
            isNewBoot,
          },
        });

        Sentry.captureMessage(
          `App boot: updateId=${currentId} channel=${Updates.channel} newBoot=${isNewBoot}`,
          'info'
        );

        if (currentId !== lastId) {
          await AsyncStorage.setItem(LAST_UPDATE_ID_KEY, currentId);
        }
      } catch (e) {
        Sentry.captureException(e, { tags: { component: 'update-boot-log' } });
      }
    }

    logUpdateState();
  }, []);

  // ... rest of layout
}
```

### What This Code Does

1. **Logs boot marker** (`BOOT_MARKER_V2`) to console
2. **Tracks update ID** in AsyncStorage to detect new boots
3. **Sends breadcrumb to Sentry** with update state
4. **Captures Sentry message** on every boot for debugging

### What This Code Does NOT Do

- ❌ Does NOT manually check for updates
- ❌ Does NOT show alert/prompt to user
- ❌ Does NOT force immediate update application
- ❌ Does NOT call `reloadAsync()` to restart app

---

## CI/CD Workflow

### GitHub Actions: `.github/workflows/eas-update.yml`

The workflow includes **runtime version guards** that validate each platform independently before publishing OTA updates.

#### Safety Guards

The workflow validates that:
1. `eas build:list` command succeeds (fails on auth errors, network issues, etc.)
2. Returned JSON is valid
3. Local `app.json` version matches the `runtimeVersion` of the latest build for **each platform**

This prevents:
- Publishing updates that no users can receive (version mismatch)
- Silent failures when EAS CLI auth expires mid-run
- Cross-platform validation bugs (iOS ≠ Android build versions)

#### Workflow Steps

```
1. Setup (checkout, pnpm, node, expo)
2. Install dependencies
3. Validate Runtime Version (Preview - iOS)      ← only on develop/preview
4. Validate Runtime Version (Preview - Android)  ← only on develop/preview
5. Validate Runtime Version (Production - iOS)   ← only on main/production
6. Validate Runtime Version (Production - Android) ← only on main/production
7. Publish Update (per-platform, per-channel)
```

If **any** validation step fails, the workflow stops and no updates are published.

### Workflow Triggers

| Event | Branch | Channel | Platforms |
|-------|--------|---------|-----------|
| Push | `develop` | `preview` | iOS + Android |
| Push | `main` | `production` | iOS + Android |
| Manual | User choice | `preview` or `production` | iOS + Android |

### Workflow Failure Scenarios

#### (a) Normal JS-only fix (happy path)
```
app.json: 1.0.6 → Local version: 1.0.6
iOS build:       1.0.6 → ✅ matches
Android build:   1.0.6 → ✅ matches
→ OTA published to both platforms
```

#### (b) Bumped version without new builds
```
app.json: 1.0.7 → Local version: 1.0.7
iOS build:       1.0.6 → ❌ mismatch
Android build:   1.0.6 → ❌ mismatch
→ Workflow fails with "RUNTIME VERSION MISMATCH DETECTED!"
→ Fix: Run `eas build` first, or revert app.json to 1.0.6
```

#### (c) Cross-platform version skew
```
app.json: 1.0.6 → Local version: 1.0.6
iOS build:       1.0.6 → ✅ matches
Android build:   1.0.5 → ❌ mismatch (Android build lagging)
→ Workflow fails on Android validation
→ Fix: Run `eas build --platform android` first
```

#### (d) EAS CLI authentication failure
```
eas build:list exits with code 1 (expired token, network error, etc.)
→ Workflow fails with "EAS BUILD:LIST COMMAND FAILED!"
→ Does NOT fall back to "no builds yet" behavior
→ Fix: Check EXPO_TOKEN secret is valid, retry
```

---

## Manual Update Commands

### Publish Update

```bash
# Preview channel
eas update --branch preview --message "Fix: bug description"

# Production channel
eas update --branch production --message "Fix: bug description"

# Specific platform
eas update --platform ios --branch production --message "iOS fix"
```

### Check Update Status

```bash
# List recent updates
eas update:list

# View specific update
eas update:view [update-id]
```

---

## Debugging OTA Updates

### Check Sentry for Boot Logs

Search Sentry for messages containing:
- `App boot: updateId=`
- `BOOT_MARKER_V2`

### Key Fields to Check

| Field | Expected Value | Issue if Different |
|-------|---------------|-------------------|
| `isEnabled` | `true` | Updates disabled in build |
| `channel` | `production` or `preview` | Wrong channel |
| `runtimeVersion` | Matches app version | Version mismatch |
| `isEmbeddedLaunch` | `false` after update | Still using embedded bundle |
| `updateId` | Changes after update | Update not applied |

### Common Issues

#### 1. Updates Not Being Downloaded

**Symptoms:** `updateId` stays the same, `isEmbeddedLaunch` is `true`

**Check:**
- Is `checkAutomatically: "ON_LOAD"` in app.json?
- Is `expo-updates` in plugins array?
- Is the build from the correct channel?
- Does `runtimeVersion` match?

#### 2. Updates Downloaded But Not Applied

**Symptoms:** Update downloaded but `isNewBoot` never becomes `true`

**Cause:** User never fully closes and reopens the app

**Note:** With `checkAutomatically: "ON_LOAD"`, updates apply on NEXT launch, not immediately.

#### 3. Channel Mismatch

**Symptoms:** Production app not receiving updates

**Check:**
```bash
# What channel is the update on?
eas update:list

# What channel is the app built for?
# Check eas.json build profile
```

#### 4. Runtime Version Mismatch

**Symptoms:** Update published but users don't receive it

**Cause:** Update published for different app version

**Fix:** Ensure `runtimeVersion` in app.json matches what the update was published for.

---

## Adding Manual Update Prompts (Optional Enhancement)

If you want to add user-facing update prompts, here's the recommended implementation:

```typescript
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

function useOTAUpdates() {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!Updates.isEnabled) return;

    async function checkForUpdates() {
      setIsChecking(true);
      try {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          
          Alert.alert(
            'Update Available',
            'A new version has been downloaded. Restart to apply?',
            [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Restart',
                onPress: async () => {
                  try {
                    await Updates.reloadAsync();
                  } catch (e) {
                    // reloadAsync can crash on some devices
                    Alert.alert(
                      'Restart Required',
                      'Please close and reopen the app to apply the update.'
                    );
                  }
                },
              },
            ]
          );
        }
      } catch (e) {
        // Silent fail - don't block user
        console.error('Update check failed:', e);
      } finally {
        setIsChecking(false);
      }
    }

    checkForUpdates();
  }, []);

  return { isChecking };
}
```

**Important:** `Updates.reloadAsync()` can crash on some devices/OS versions. Always wrap in try-catch with fallback message.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│                                                                  │
│  Push to develop ─────────────────► Push to main                │
│        │                                   │                     │
│        ▼                                   ▼                     │
│  ┌──────────────┐                   ┌──────────────┐            │
│  │ EAS Update   │                   │ EAS Update   │            │
│  │ (preview)    │                   │ (production) │            │
│  └──────────────┘                   └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                │                             │
                ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EAS Update Server                            │
│                 https://u.expo.dev/[projectId]                   │
│                                                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐         │
│  │ preview channel     │       │ production channel  │         │
│  │ runtimeVersion: 1.0.6│       │ runtimeVersion: 1.0.6│        │
│  └─────────────────────┘       └─────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                │                             │
                ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        User Devices                              │
│                                                                  │
│  ┌─────────────────────┐       ┌─────────────────────┐         │
│  │ TestFlight/Internal │       │ App Store/Play Store│         │
│  │ channel: preview    │       │ channel: production │         │
│  └─────────────────────┘       └─────────────────────┘         │
│                                                                  │
│  App Launch → Check u.expo.dev → Download → Apply on Next Launch │
└─────────────────────────────────────────────────────────────────┘
```

---

## Checklist for Troubleshooting

- [ ] Is `expo-updates` in package.json dependencies?
- [ ] Is `expo-updates` in app.json plugins array?
- [ ] Is `checkAutomatically` set to `"ON_LOAD"`?
- [ ] Does `runtimeVersion.policy` match your versioning strategy?
- [ ] Is the correct `projectId` in app.json?
- [ ] Was the app built with the correct channel (preview/production)?
- [ ] Was the update published to the correct channel/branch?
- [ ] Does the update's runtimeVersion match the app's version?
- [ ] Has the user fully closed and reopened the app after update download?
- [ ] Check Sentry for `App boot:` messages to verify update state

---

## Related Documentation

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [expo-updates API Reference](https://docs.expo.dev/versions/latest/sdk/updates/)
- [Runtime Version Policies](https://docs.expo.dev/eas-update/runtime-versions/)
- [EAS Update Debugging](https://docs.expo.dev/eas-update/debug/)
