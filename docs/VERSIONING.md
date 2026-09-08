# App Versioning

## Sources of truth

- The user-facing app version is `expo.version` in [app.json](../app.json). It is currently `1.0.9`.
- Android also has `android.versionCode` in [app.json](../app.json). It is currently `10`.
- [eas.json](../eas.json) sets `appVersionSource` to `remote` and enables `autoIncrement` for the production profile.

## Version changes

Update `expo.version` for a store release:

- Patch: bug fixes and small changes, for example `1.0.9` to `1.0.10`.
- Minor: backward-compatible features, for example `1.0.8` to `1.1.0`.
- Major: breaking changes, for example `1.0.8` to `2.0.0`.

Do not reuse a version that has already been submitted to a store. Keep the version aligned across iOS and Android by changing the shared `expo.version` field.

## Build numbers

Build numbers are internal store identifiers and are separate from the user-facing version. Production EAS builds use:

```json
{
  "build": {
    "production": {
      "autoIncrement": true,
      "channel": "production"
    }
  }
}
```

Do not manually edit generated native build numbers unless the release workflow specifically requires it. EAS manages production increments according to the configuration in [eas.json](../eas.json).

## OTA updates

JavaScript and asset-only changes can use EAS Update when the compatible runtime version is already installed. Native dependency changes, native configuration changes, and Expo SDK changes require a new store build. The app uses `runtimeVersion.policy: "appVersion"` and checks for updates on load; see [app.json](../app.json) and [OTA_UPDATES.md](OTA_UPDATES.md).

## Release checklist

1. Decide whether the change is OTA-compatible or requires a native build.
2. For a store release, update `expo.version` in [app.json](../app.json).
3. Verify the production profile and channel in [eas.json](../eas.json).
4. Run the project checks defined in [README.md](../README.md) and [TESTING.md](TESTING.md).
5. Commit the version change with the release changes.
6. Build or publish through the appropriate EAS workflow under [.github/workflows](../.github/workflows).
7. Submit and promote the resulting build through the configured store workflow.
