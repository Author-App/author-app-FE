import * as Application from 'expo-application';
import * as Updates from 'expo-updates';

// The OTA id shows which JS is running: "built-in" until an update launches.
export const VERSION_LABEL = `Version ${Application.nativeApplicationVersion} (${
  Updates.isEmbeddedLaunch ? 'built-in' : Updates.updateId?.slice(0, 8)
})`;
