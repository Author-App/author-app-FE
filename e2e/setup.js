// The E2E runner is plain Node, so nothing loads .env for it.
// EXPO_PUBLIC_* variables are inlined into the app at build time, but
// E2E_EMAIL and E2E_PASSWORD are read here, in the test process.
require('dotenv').config({ quiet: true });
