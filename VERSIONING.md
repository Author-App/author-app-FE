Create a new file `VERSIONING.md` in the project root with this content:

````markdown
# App Versioning Guide

## Overview

Our app uses two types of version numbers:
1. **Version Number** (user-facing) - Manual, you control this
2. **Build Number** (internal) - Automatic, EAS handles this

---

## Version Number (Manual) - `app.json`

### What It Is
The version string that users see in the App Store and Play Store.

**Location:** `app.json`
```json
{
  "expo": {
    "version": "1.0.1"  // 👈 YOU update this manually
  }
}
```

### When to Update

Follow [Semantic Versioning](https://semver.org/):

**MAJOR.MINOR.PATCH** (e.g., `2.1.3`)

| Type | Example | When to Use |
|------|---------|-------------|
| **PATCH** | `1.0.1` → `1.0.2` | Bug fixes, small tweaks, no new features |
| **MINOR** | `1.0.2` → `1.1.0` | New features, backward-compatible changes |
| **MAJOR** | `1.1.0` → `2.0.0` | Breaking changes, major redesigns |

### ⚠️ Important Rules

1. **ALWAYS update version before pushing to main with native changes**
2. **NEVER reuse a version number** - once submitted to stores, it's permanent
3. **Keep iOS and Android versions in sync** - both use the same `version` field

---

## Build Number (Automatic) - EAS Handles This

### What It Is
An internal counter that increments with every build.

**iOS:** CFBundleVersion (shown as `1.0.1 (45)` in App Store Connect)  
**Android:** versionCode (shown as `versionCode: 45` in Play Console)

### How It Works

In `eas.json`:
```json
{
  "build": {
    "production": {
      "autoIncrement": true  // 👈 EAS auto-increments build numbers
    }
  }
}
```

**You don't touch these!** EAS increments them automatically on each build.

**Example progression:**
- Build 1: Version `1.0.0 (1)`
- Build 2: Version `1.0.0 (2)` ← Same version, different build
- Build 3: Version `1.0.1 (3)` ← New version, auto-incremented build

---

## Current Versions

**Version:** `1.0.1` (from `app.json`)  
**iOS Build:** Auto-managed by EAS  
**Android versionCode:** `3` → auto-increments to 4, 5, 6...

---

## Release Workflow

### 1. Before Releasing

**Decide what type of release:**
- Bug fix? → Bump PATCH: `1.0.1` → `1.0.2`
- New feature? → Bump MINOR: `1.0.2` → `1.1.0`
- Breaking change? → Bump MAJOR: `1.1.0` → `2.0.0`

### 2. Update app.json

```json
{
  "expo": {
    "version": "1.0.2"  // 👈 Update this
  }
}
```

### 3. Commit Version Bump

```bash
git add app.json
git commit -m "chore: bump version to 1.0.2"
```

### 4. Merge to Main

When you merge to `main`:
- ✅ EAS builds with version `1.0.2`
- ✅ EAS auto-increments build number
- ✅ Submits to App Store (TestFlight internal)
- ✅ Submits to Play Store (internal testing)

### 5. Promote to Production

**App Store Connect:**
1. Go to TestFlight
2. Find your build (version `1.0.2`)
3. Submit for review
4. Promote to App Store when approved

**Play Console:**
1. Go to Internal testing
2. Find your build (version `1.0.2`)
3. Promote to Production
4. Roll out gradually (10% → 50% → 100%)

---

## Common Scenarios

### Scenario 1: UI-Only Changes

**Question:** Do I need to update the version?

**Answer:** 
- If using **OTA updates** (eas-update): **NO** - users get updates instantly
- If forcing a **new build**: **YES** - bump PATCH version

### Scenario 2: Hotfix After Release

```bash
# Current production: 1.0.2
# Found critical bug after release

# In app.json:
"version": "1.0.2" → "1.0.3"

# Commit and push to main
git commit -m "chore: bump version to 1.0.3 (hotfix)"
git push origin main

# New build auto-submits to stores
# Promote 1.0.3 to production ASAP
```

### Scenario 3: Major Feature Release

```bash
# Current: 1.2.5
# Adding payment system, new UI, breaking API changes

# In app.json:
"version": "1.2.5" → "2.0.0"

# Commit
git commit -m "chore: bump version to 2.0.0 (major release)"
```

### Scenario 4: Forgot to Update Version

**If you already pushed to main:**

1. Build completes with old version (e.g., `1.0.1`)
2. Stores accept it (different build number: `1.0.1 (5)`)
3. **Problem:** Confusing for users and review teams

**Fix:**
```bash
# Immediately bump version
"version": "1.0.1" → "1.0.2"

# Push again to trigger new build
git commit -m "chore: bump version to 1.0.2 (missed in previous release)"
git push origin main
```

---

## Version History Template

Keep track of releases in `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.2] - 2024-04-20

### Fixed
- Fixed crash when loading audiobook player
- Improved error handling in payment flow

## [1.0.1] - 2024-04-15

### Added
- New podcast player controls
- Offline mode for ebooks

### Fixed
- Login screen keyboard overlap
```

---

## Quick Reference

| What | Where | Who Updates | Example |
|------|-------|-------------|---------|
| **Version** | `app.json` → `version` | **YOU** (manual) | `"1.0.2"` |
| **iOS Build** | Auto-managed | **EAS** (automatic) | `1.0.2 (45)` |
| **Android versionCode** | `app.json` → `android.versionCode` | **EAS** (automatic) | `45` |

---

## Checklist: Before Every Release

- [ ] Decide version bump type (PATCH/MINOR/MAJOR)
- [ ] Update `version` in `app.json`
- [ ] Update `CHANGELOG.md` with changes
- [ ] Commit: `git commit -m "chore: bump version to X.Y.Z"`
- [ ] Push to main
- [ ] Wait for builds to complete (~15-20 min)
- [ ] Verify submissions in App Store Connect + Play Console
- [ ] Promote to production when ready

---

## Resources

- [Semantic Versioning](https://semver.org/)
- [EAS Build Version Management](https://docs.expo.dev/build-reference/app-versions/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)
````