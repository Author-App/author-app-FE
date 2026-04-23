# CI/CD Automation Setup

Complete guide to our GitHub Actions CI/CD pipeline for automated testing, building, and deploying the Author App.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Workflows Explained](#workflows-explained)
3. [Triggers & Smart Filtering](#triggers--smart-filtering)
4. [Required Secrets](#required-secrets)
5. [EAS Configuration](#eas-configuration)
6. [Manual Workflows](#manual-workflows)
7. [Common Scenarios](#common-scenarios)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Our CI/CD pipeline automates:
- **Testing** - Jest unit tests run on every PR and push
- **Code Quality** - TypeScript checking and linting
- **Building** - Native iOS/Android builds via EAS
- **OTA Updates** - JavaScript updates without app store review
- **Store Submission** - Automatic submission to App Store/Play Store

**Three distinct phases:**
1. **PR/Merge Check** - Validates code before it reaches main
2. **Build & Release** - Creates production binaries
3. **Store Submission** - Deploys to app stores

---

## Workflows Explained

### 1. **Test Workflow** (`.github/workflows/test.yml`)

**Purpose:** Run Jest unit tests on every code push

**Triggers:**
- Push to `main` or `develop` branches
- All pull requests

**Jobs:**
- Install dependencies via pnpm
- Run `pnpm test:ci`
- Upload coverage reports as artifacts (7-day retention)

**When it runs:**
```
✅ You push code to main/develop
✅ You open a PR to any branch
```

**What it checks:**
- JavaScript/TypeScript unit tests
- Code coverage metrics

**Failure handling:**
- If tests fail, workflow stops (red X on commit)
- PR cannot be merged until tests pass

---

### 2. **PR Check Workflow** (`.github/workflows/pr-check.yml`)

**Purpose:** Comprehensive code quality gate for pull requests

**Triggers:**
- All pull requests
- Push to `main` or `develop`

**Concurrency:** 
- Cancels in-progress runs if a new push happens (saves CI credits)

**Jobs:**
1. TypeScript compilation check (`pnpm exec tsc --noEmit`)
2. Jest test suite (`pnpm test:ci`)
3. Coverage report upload

**When it runs:**
```
✅ PR opened/updated
✅ Push to main/develop while PR is open
```

**What it catches:**
- TypeScript errors that would break builds
- Failing unit tests
- Code quality issues

---

### 3. **EAS Build Workflow** (`.github/workflows/eas-build.yml`)

**Purpose:** Create production native binaries for iOS and Android

**Triggers:**

**Automatic (on push to main):**
- Changes to native config files:
  - `package.json`
  - `app.json`
  - `eas.json`
  - `ios/**`
  - `android/**`
  - `plugins/**`

**Manual trigger:**
- GitHub Actions UI → EAS Build → Run workflow
- Choose: platform (iOS/Android/all) + profile (development/preview/production)

**Jobs:**
1. Build iOS production binary
2. Build Android production binary
3. Both run in parallel on EAS cloud

**When it runs:**
```
✅ You modify native config or dependencies → Automatic production build
✅ You manually trigger with profile selection → Custom build
```

**Example scenarios:**
- You add a new native package → Automatic production build
- You change iOS deployment target in app.json → Automatic build
- You want a preview build → Manual trigger with "preview" profile

**Build profiles in eas.json:**
```json
{
  "build": {
    "development": { /* Local testing */ },
    "preview": { /* Internal testing track */ },
    "production": { /* App Store/Play Store */ }
  }
}
```

---

### 4. **EAS Update Workflow** (`.github/workflows/eas-update.yml`)

**Purpose:** Push JavaScript/app code updates without rebuilding native binaries

**Triggers:**

**Automatic (on any push):**
- Branch: `main` → publishes to `production` channel
- Branch: `develop` → publishes to `preview` channel
- Ignores: markdown files, .github folder, docs

**Manual trigger:**
- Choose channel: preview or production

**Why this matters:**
- Fix UI bugs without waiting for App Store review
- Deploy faster than native builds
- Fallback to production binary if update fails

**When it runs:**
```
✅ You fix a UI bug and push to main → Users get update in 2-3 minutes
✅ You deploy preview features to develop → Internal testers get update
```

**Limitations:**
- Cannot change native code (Java/Swift)
- Cannot add new native packages
- Cannot modify native config (app.json, eas.json)

---

### 5. **EAS Submit Workflow** (`.github/workflows/eas-submit.yml`)

**Purpose:** Automatically submit builds to App Store and Play Store

**Triggers:**

**Automatic:**
- Previous job: EAS Build completes successfully on main branch

**Manual trigger:**
- GitHub Actions UI → EAS Submit → Run workflow
- Choose platform: iOS, Android, or both

**Jobs:**
1. Submit latest iOS build to TestFlight (production profile)
2. Submit latest Android build to Play Store internal testing track
3. Credentials handled automatically from EAS

**When it runs:**
```
✅ EAS Build completes → Automatic submission to stores
✅ Manual trigger → Immediate submission (latest build)
```

**Post-submission:**
- App appears in TestFlight for iOS (internal testing)
- App appears in Play Store internal testing track for Android
- Can be manually promoted to production in App Store Connect / Play Console

---

## Triggers & Smart Filtering

### Path-Based Triggers

Smart filtering prevents unnecessary builds:

**EAS Build only triggers on native changes:**
```yaml
paths:
  - 'package.json'        # Dependencies
  - 'app.json'            # App config
  - 'eas.json'            # Build config
  - 'ios/**'              # iOS native code
  - 'android/**'          # Android native code
  - 'plugins/**'          # Native plugins
```

**Example:**
```
Push TypeScript UI fix → ❌ No build (uses OTA Update instead)
Push new native dependency → ✅ Full production build
```

**EAS Update ignores certain paths:**
```yaml
paths-ignore:
  - '**.md'              # Documentation changes
  - '.github/**'         # Workflow changes (avoid recursion)
  - 'docs/**'            # Docs folder
```

### Workflow Dependencies

Workflows can trigger other workflows:

```
PR opened
  ↓
Test + PR Check run in parallel
  ↓
If all pass and merged to main
  ↓
EAS Build triggers automatically
  ↓
On successful build
  ↓
EAS Submit triggers automatically
  ↓
Apps submitted to stores
```

---

## Required Secrets

All secrets are configured in GitHub repository settings: **Settings → Secrets and variables → Actions**

### `EXPO_TOKEN` (Required)

**Purpose:** Authenticate with Expo/EAS services

**Where to get it:**
1. Go to [expo.dev](https://expo.dev)
2. Login to your account
3. Account Settings → Access Tokens
4. Create new token (copy immediately, can't view again)
5. Add to GitHub: Settings → Secrets → New repository secret → Name: `EXPO_TOKEN`

**Used by:**
- EAS Build workflow
- EAS Update workflow
- EAS Submit workflow

**What happens without it:**
```
Error: "Unauthorized - EXPO_TOKEN is invalid or missing"
```

### `APPLE_ID_PASSWORD` (For iOS submissions)

**Purpose:** App Store Connect authentication

**Already configured in:**
- `eas.json` has appleid: `spadjo66@hotmail.com`
- Credentials stored securely in EAS

**Note:** EAS handles this internally after first manual setup

### `GOOGLE_SERVICE_ACCOUNT` (For Android submissions)

**Purpose:** Google Play Store authentication

**Configuration:**
```json
"android": {
  "serviceAccountKeyPath": "./google-service-account.json",
  "track": "internal"
}
```

**Status:** ✅ Configured and uploaded to EAS

**Note:** File is `.gitignore`d for security

---

## EAS Configuration

### Build Profiles (`eas.json`)

```json
{
  "build": {
    "development": {
      "developmentClient": true,    // Dev tools enabled
      "distribution": "internal",   // Only for testing
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",   // Internal testers
      "channel": "preview"
    },
    "production": {
      "autoIncrement": true,        // Auto-increment version
      "channel": "production"       // Production OTA channel
    }
  }
}
```

### Submit Profiles (`eas.json`)

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "spadjo66@hotmail.com",
        "ascAppId": "6761315194"     // Unique App Store ID
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"          // Can manually promote later
      }
    }
  }
}
```

**Tracks Explained:**
- `internal` - Private testing track
- `alpha` - Limited release
- `beta` - Wider testing
- `production` - Public release

---

## Manual Workflows

### Running a Build Manually

1. Go to GitHub repository → Actions
2. Click "EAS Build" workflow
3. Click "Run workflow" dropdown
4. Select platform: iOS / Android / All
5. Select profile: development / preview / production
6. Click "Run workflow"

**Example:**
```
Platform: iOS
Profile: preview
→ Builds iOS preview binary for internal testers
```

### Running a Submit Manually

1. Go to GitHub repository → Actions
2. Click "EAS Submit" workflow
3. Click "Run workflow" dropdown
4. Select platform: iOS / Android / All
5. Click "Run workflow"

**Example:**
```
Platform: Android
→ Submits latest Android build to Play Store internal testing track
```

### Running OTA Update Manually

1. Go to GitHub repository → Actions
2. Click "EAS Update" workflow
3. Click "Run workflow" dropdown
4. Select branch: preview / production
5. Click "Run workflow"

**Example:**
```
Branch: production
→ Publishes JavaScript updates to production channel immediately
```

---

## Common Scenarios

### Scenario 1: Fix UI Bug (TypeScript/UI Change)

**Flow:**
```
1. Fix bug in src/components/Button.tsx
2. Push to main
   ↓
3. PR Check passes ✅
   ↓
4. Test passes ✅
   ↓
5. Merge to main
   ↓
6. EAS Update runs automatically 🚀
   ↓
7. Users get fix in 2-3 minutes (no app rebuild needed!)
```

**Result:** ⚡ Fast deployment, no store review

---

### Scenario 2: Add New Native Package

**Flow:**
```
1. Add react-native-gesture-handler to package.json
2. Push to main
   ↓
3. PR Check passes ✅
   ↓
4. Test passes ✅
   ↓
5. Merge to main
   ↓
6. EAS Build triggers automatically (detected via package.json change)
   ↓
7. Builds iOS production binary
8. Builds Android production binary (parallel)
   ↓
9. EAS Submit triggers automatically on successful build
   ↓
10. Apps submitted to App Store/Play Store 📱
```

**Result:** 🔨 Full native rebuild + submission (1-2 hours total)

---

### Scenario 3: Bump Version Number

**Flow:**
```
1. Update app.json: "version": "1.2.0"
2. Push to main
   ↓
3. Detected as app.json change
   ↓
4. EAS Build starts (autoIncrement: true)
   ↓
5. Build completes with new version
   ↓
6. Submitted to stores ✅
```

**Result:** Production build with new version number

---

### Scenario 4: Deploy Preview Build

**Manually trigger on develop branch:**

```
1. Go to GitHub Actions → EAS Build
2. Run workflow:
   - Platform: All
   - Profile: preview
   ↓
3. Builds preview binary for both platforms
4. Testers get app from internal testing track
```

**Result:** Internal testers can test new features before production

---

## Troubleshooting

### Test Workflow Fails

**Problem:** Tests fail locally but pass in CI

**Solutions:**
1. Check Node version: `node --version` (should be 20)
2. Clear cache: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
3. Run locally: `pnpm test:ci`
4. Check for platform-specific imports

**Common causes:**
- Mocking issues
- Async test timeouts
- Different environment variables

---

### EAS Build Fails with "Unauthorized"

**Problem:** Build fails with auth error

**Check:**
1. Verify `EXPO_TOKEN` is set in GitHub secrets
2. Token isn't expired
3. Token hasn't been revoked

**Solution:**
1. Go to [expo.dev](https://expo.dev) → Account → Access Tokens
2. Create new token
3. Update GitHub secret: Settings → Secrets → `EXPO_TOKEN`

---

### EAS Build Fails: Native Code Issue

**Problem:** "Xcode build failed" or Android build error

**Common causes:**
- Native package compatibility
- CocoaPods/Gradle cache issues
- Build.gradle or Xcode version mismatch

**Solutions:**
1. Try local build first: `npx expo run:ios` or `npx expo run:android`
2. Check native error logs in EAS Build output
3. Clean and retry: `rm -rf ios android && npx expo prebuild --clean`

---

### EAS Submit Fails: App Store/Play Store Issues

**Problem:** Submission rejected or failed

**iOS (TestFlight):**
- Check App Store Connect for build processing
- Verify ascAppId is correct
- Check for compliance issues

**Android (Play Store):**
- Verify service account has correct permissions
- Check version code/number is higher than previous
- Review Play Console for policy violations

---

### OTA Update Doesn't Show for Users

**Problem:** Users don't get JavaScript update

**Cause:** Cached binary doesn't check for updates

**Solutions:**
1. Force app to check for updates on startup
2. Use `expo-updates` in code:
   ```typescript
   import * as Updates from 'expo-updates';
   
   Updates.checkForUpdateAsync().then(update => {
     if (update.isAvailable) {
       Updates.fetchUpdateAsync();
     }
   });
   ```

3. Wait for app restart (updates apply on next launch)

---

### Workflow Runs But Does Nothing

**Problem:** Workflow shows "skipped"

**Check:**
1. Path filters - did you actually change a file that triggers the workflow?
2. Branch conditions - are you on the right branch?
3. Concurrency - was this run cancelled by a newer run?

**Example:** Pushing markdown doc won't trigger EAS Build (by design)

---

### Workflow Hangs or Times Out

**Problem:** Workflow stays in "in progress" for hours

**Solutions:**
1. Check EAS CLI status: [status.expo.io](https://status.expo.io)
2. Cancel workflow manually: GitHub Actions → workflow → Cancel
3. Retry workflow: Re-run jobs
4. Check for system resource issues

---

## Next Steps

- [ ] Verify `EXPO_TOKEN` is configured
- [ ] Test manual EAS Build trigger
- [ ] Monitor first automated build
- [ ] Set up Slack notifications (optional)
- [ ] Review App Store/Play Store submission requirements

## Related Documentation

- [EAS Build Documentation](https://docs.expo.dev/build/setup/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
