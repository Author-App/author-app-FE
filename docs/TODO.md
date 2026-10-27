# TODO

Things deliberately left for later during the UI redesign (`feat/ui-redesign`).

## Verify on a device

These were built and typechecked, but not yet checked on the simulator.

- [ ] **Community chat**
  - In a long chat, scroll up and wait 30s for a poll. The list must not jump to the bottom.
  - Send a message. The list scrolls to it.
  - Tap the chat header to open About, then press back. It returns to the chat, not out of the community.
  - Fail a send (airplane mode). A toast shows and the text stays in the box.
  - Not joined: Join Community works, then the chat opens.
- [ ] **Event detail**
  - An online event opened 15 min early: the Join button turns on by itself at 10 min.
  - An ended event, online or in person: grey "Event has ended" button.
- [ ] **Video detail** (float, float tap and X checked in the simulator with Mobile MCP on 2026-10-26)
  - Fullscreen, then back out.
- [ ] **Podcast and audiobook**
  - Opens at the saved position and autoplays.
  - Mini player slides in once the controls scroll away, and play/pause stays in sync with the big button.
- [ ] **Checkout** (use Stripe test mode)
  - Leave a required field: its error shows once you leave the field, and Pay stays grey.
  - Tap quantity up three times fast. The total settles on the last quantity, and the Stripe sheet charges that amount.
  - Enter an address Lulu rejects. The error shows above the button and Pay is disabled.
  - Change the address back and forth. The total always matches the address on screen.
- [ ] **Edit Profile and Change Password**
  - Type a new name, then change the photo. The typed name stays.
  - Save Changes is grey until the name differs from the saved one.
  - Upload a photo in airplane mode: a toast shows.
  - The keyboard never covers the button, on a small phone too.
- [ ] **Ebook reader**
  - Read a few pages, swipe back, open again: same page. Check Continue Reading on Home shows it too.
  - Airplane mode halfway through a first download: an error with Retry. Retry with network: it downloads fresh.
  - Tap the page: header, footer and status bar hide. Tap again: back. With VoiceOver on, they never hide.
- [ ] **Notification sheet** (real device only, it skips simulators)
  - Fresh install: the sheet shows once. Not Now, kill the app, reopen: it does not show again.
  - Deny in the system popup, relaunch: no sheet for 7 days. Settings toggle still opens system Settings.
  - On a small phone the sheet fits its content and nothing is cut off.
- [ ] **Splash and boot** (needs a native rebuild: `npx expo prebuild --clean` then `pnpm ios`, or an EAS build; app.json changes do not ship over OTA)
  - Cold start: the gradient wordmark on near-black, then the boot screen with the wordmark in the same place and a spinner. No jump, no navy flash.
  - Push and pop a few screens: no navy behind the transition.
- [ ] **Double tap**: tap Read Now, a book card, and a video card twice quickly. Each opens once, and one back press returns. Watch Metro for a "No route named" warning, which would mean a name in `SINGULAR_SCREENS` is wrong.
- [ ] **Detox E2E** before merging. The looping animations on onboarding and login may block synchronisation (see CLAUDE.md).

## CI/CD first run

- [ ] Run **Actions > EAS Build**, profile `preview`, for the current version. Install it on your phone (`eas device:create` first for iOS). Until it exists, `eas-update.yml` fails on every merge.
- [ ] Open a test PR that changes `app.json` plugins without a version bump: Native Check comments and fails. Bump the version: it passes.
- [ ] Merge a JS-only change: the update lands on the preview phone only. Run **EAS Promote**: it reaches a production install.
- [ ] Next release: `git tag vX.Y.Z && git push --tags`, confirm both stores receive the build and a matching preview build appears.

## Features deferred

- [ ] **App-wide mini player.** Keep audio and video playing after leaving the screen, docked above the tab bar, reusable for every media type. Needs the player owned at the app root, not the screen. Progress saving in `useSaveMediaProgress` currently relies on the screen unmounting, so that has to move too. Design it before building it.
- [ ] **Subscription plans go live with RevenueCat.** `SubscriptionPlansScreen` is redesigned to the artboard but not routed. `app/(app)/subscription` still renders the teaser. When RevenueCat is in, wire `handleSubscribe` and `handleManageSubscription` in `useSubscription` (both only `console.log` now) and point the route at the plans screen. To preview it before then, temporarily swap the import in the route.
- [ ] **Play/pause on the floating video.** Needs `isPlaying` back in `useVideoPlayer` (for example with `useEvent(player, 'playingChange')`).

## Open questions from the perf baseline

- [ ] **Taps on Home cards sometimes do nothing.** Twice a Mobile MCP tap on a Home card produced 0 commits and no navigation; the retry worked. The same happened on video detail right after two swipes. Most likely normal iOS behaviour: the first tap during momentum scrolling only stops the scroll. Check with a finger before treating it as a bug.
- [ ] **Does a podcast keep playing after you leave it?** Once, a podcast saved at 9:39 came back at 23:34 about 14 minutes later, as if it had kept playing. It may just have been a missed pause tap. Check by ear: play, press back without pausing, and listen.
- [ ] **Mini player on a short podcast.** The test episode is too short to scroll its controls away, so the mini player could not be checked.

## Accessibility pass (whole app, one go)

It is a content app, so every screen must work with VoiceOver and TalkBack. Collect findings in the CLAUDE.md debt list while testing each screen, then fix them together. Check each screen with Mobile MCP's element list, which is the same tree VoiceOver reads.

## Known gaps

- [ ] Inter Italic is not bundled.
- [ ] Article blockquotes are not 19/30 yet.
- [ ] Remove the Underline button from the CMS editor. The app strips `<u>` tags in `ArticleContent`.
- [ ] `UIconButton` does not forward `disabled` as `accessibilityState` (see CLAUDE.md).
- [ ] Community detail polls every 30s even while the app is in the background or on the About view.

## Perf automation

Find problems by hand (Perf Monitor, React DevTools Profiler). Automate only the guard once fixed.

- [ ] `PerfProbe` (`src/components/core/dev/PerfProbe.tsx`) wraps every signed-in screen in `app/(app)/_layout.tsx` and logs `[perf] app js= ui= commits=` once a second in dev. Mobile MCP drives the taps, Metro shows the numbers. Take a baseline per screen.
- [ ] Reassure render-count tests for the fixed bugs (HeroBanner dots, tab switch), after the seven steps.

## Tests worth writing

Go through the seven steps in CLAUDE.md first.

- [ ] Home banner routing: an `article` banner opens the article, not the book.
- [ ] Audiobook "minutes left" on the Continue Reading card.
- [ ] `useEventDetail`: the join status changes as the clock moves (fake timers).
- [ ] `usePrintCheckout`: an older quote response that arrives after a newer one is ignored, and a failed quote clears the payable quote. This is the money path, so it is the most valuable test on this list.
