
# Prompt for Claude Design — Stanley Paden mobile app redesign

Copy everything below the line into Claude Design. Attach or link the website (https://stanleypaden.com) and, if possible, the website repo (`chris-malcom/stanleypaden-react`) so Claude can read the real CSS tokens instead of guessing from screenshots.

---

## Role

You are designing the visual redesign of **Stanley Paden**, a live iOS and Android app for an author's readers. The app already exists and works. Every screen, feature and data flow described below is already built and shipped. **Nothing about the product changes. Only the look changes.**

The author's website was just redesigned. The client wants the app to look like it belongs to the same brand as the website. Your job is to take the website's design language and translate it into native mobile screens.

Deliver high-fidelity mobile screen designs plus a design system that a React Native engineer can implement directly.

## Part 1 — The design language to inherit (the website)

The website is a React + Vite + Tailwind v4 app. Its design is dark, cinematic, science-fiction. Neon purple and cyan glow on near-black surfaces, glassmorphism panels, gradient text, animated reveals on scroll.

### Website color tokens (exact values from `src/index.css`)

Dark theme is the default. A light theme exists via `[data-theme="light"]`.

| Token | Dark | Light |
|---|---|---|
| `--bg-page` | `#020103` | `#f6f8fd` |
| `--bg-section` | `#03020a` | `#eef1f8` |
| `--bg-card` | `#070512` | `#ffffff` |
| `--bg-deep` | `#05010a` | `#e6eaf4` |
| `--text-primary` | `#ffffff` | `#0f172a` |
| `--text-secondary` | `#d1d5db` | `#334155` |
| `--text-muted` | `#9ca3af` | `#64748b` |
| `--text-faint` | `#6b7280` | `#94a3b8` |
| `--accent-purple` | `#d8b4fe` | `#6d28d9` |
| `--accent-purple-strong` | `#c084fc` | `#7c3aed` |
| `--accent-cyan` | `#67e8f9` | `#0e7490` |
| `--accent-cyan-strong` | `#22d3ee` | `#06b6d4` |
| `--purple-glow` | `#8736f7` | `#8736f7` |
| `--cyan-glow` | `#00f0ff` | `#00f0ff` |
| `--magenta-glow` | `#f2a8ff` | `#f2a8ff` |
| `--gold-accent` | `#f59e0b` | `#f59e0b` |
| `--border-soft` | `rgba(255,255,255,0.1)` | `rgba(15,23,42,0.12)` |
| `--border-accent` | `rgba(76,29,149,0.35)` | `rgba(124,58,237,0.28)` |

### Website glass panels

```css
.glass-panel      { background: rgba(15,12,35,0.6);  backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
.glass-panel-glow { background: rgba(18,14,42,0.7);  backdrop-filter: blur(20px); border: 1px solid rgba(135,54,247,0.3);  box-shadow: 0 0 30px rgba(135,54,247,0.25), inset 0 0 15px rgba(135,54,247,0.15); }
.glass-panel-cyan { background: rgba(10,25,45,0.7);  backdrop-filter: blur(20px); border: 1px solid rgba(0,240,255,0.3);   box-shadow: 0 0 30px rgba(0,240,255,0.2),  inset 0 0 15px rgba(0,240,255,0.1); }
.glass-panel-red  { background: rgba(45,10,10,0.7);  backdrop-filter: blur(20px); border: 1px solid rgba(255,60,60,0.3);   box-shadow: 0 0 30px rgba(255,60,60,0.2),  inset 0 0 15px rgba(255,60,60,0.1); }
```

### Website text gradients

```css
.text-gradient-purple { linear-gradient(135deg, #ffffff 0%, #f2a8ff 50%, #8736f7 100%) }
.text-gradient-cyan   { linear-gradient(135deg, #ffffff 0%, #a5f3fc 50%, #00f0ff 100%) }
.text-gradient-gold   { linear-gradient(135deg, #ffffff 0%, #fde047 50%, #f59e0b 100%) }
```

### Website typography

Four families, each with a fixed job:

| Family | Used for |
|---|---|
| **Orbitron** (500/700/900) | Headings, product titles, prices, primary button labels. Uppercase, extra bold, tight leading. |
| **Outfit** (400–900) | Subtitles, pull quotes, accent lines under a heading. |
| **Jura** (400–700) | Small uppercase meta: badges, category labels, table headers, format chips, letter-spaced. |
| **Inter** (300–700) | Body copy, navigation links, descriptions, long-form article text. |

### Website interaction patterns worth carrying over

- Pill-shaped nav items. Active state is `bg-purple-600/30`, cyan text, purple border, purple glow shadow.
- Primary CTA is a gradient pill: purple to cyan, uppercase Orbitron, glow shadow, scales up slightly on press.
- Cards are `rounded-3xl` glass panels that lift on hover and carry a colored glow matched to their category (purple default, cyan for audio, red for urgent/sale).
- Badges are small pill chips: uppercase Jura, translucent tinted background, 1px tinted border.
- Book covers are 2:3 aspect ratio, rounded, heavy drop shadow, dark gradient wash from the bottom.
- Star ratings use amber/gold.
- Content reveals on scroll. There is a sci-fi preloader and a custom glow cursor (neither applies on mobile).

### Website routes, for structural reference

`/` home, `/about`, `/books`, `/shop`, `/podcast`, `/blog`, `/blog/:slug`, `/contact`.

## Part 2 — The app as it exists today

### Platform and constraints (these are hard limits)

- **React Native 0.81 / Expo SDK 54**, styled with **Tamagui**. Navigation is **Expo Router**.
- Designs must be native-mobile, not a website in a phone frame. Design at **390 x 844** (iPhone 14/15 baseline) and state how each screen reflows at 360 width and on a tablet width if relevant.
- **There is no hover.** Every hover state on the website must become a press state, a selected state, or nothing.
- Safe areas matter. Top inset for the status bar and notch, bottom inset for the home indicator. Do not put content or a CTA under either.
- Touch targets are **44 x 44 minimum**.
- Heavy blur is expensive on Android. If a screen uses glass, say which surfaces genuinely blur and which are a flat translucent fill that only looks like glass. Give the fallback color.
- Text must pass **4.5:1** contrast on body copy and **3:1** on large text. Neon cyan on near-black is fine; the same cyan as small grey-adjacent body text is not.
- Icon set in use is **Ionicons** (outline style). Stay on it unless you have a strong reason and say so.
- The app has haptic feedback on most presses. Design for a tactile feel.

### Current app visual identity (what you are replacing)

The app today is **navy and crimson**, not the website's purple and cyan. Its core brand tokens:

```
brandCrimson #BF092F   brandNavy #132440   brandOcean #16476A   brandTeal #3B9797   brandGray #8E9BAE
```

Screens sit on a full-bleed background image (`innerScreenBg.png`) over navy. Headers use a "premium" variant with a **Playfair Display** serif title, a small caption subtitle, and an accent bar. Body text is **Inter**. There is also an unused warm cream/gold palette left in the theme file.

**Assume all of this is replaced.** Tell us explicitly which current elements you keep, if any.

### Navigation map

Bottom tab bar, 5 tabs. The active tab is currently a white icon on a crimson circle; the inactive icon is ocean blue. Tabs are icon-only today with accessibility labels.

| Tab | Icon | Purpose |
|---|---|---|
| Home | `home-outline` | Curated feed |
| Explore | `compass-outline` | Blogs, podcasts, videos, events, community |
| Library | `book-outline` | The reader's books |
| Profile | `person-outline` | The author's profile, not the user's |
| Settings | `settings-outline` | Account and preferences |

Screens pushed on top of the tabs: book detail, article detail, podcast detail, video detail, event detail, community detail and chat, checkout, ebook reader, audiobook player, subscription, edit profile, change password, notifications.

Auth stack (outside the tabs): onboarding, login, signup, forgot password, verification code, reset password.

### Screen inventory and content

Design these in this priority order. Everything listed under a screen is real content the screen already renders.

#### 1. Home (tab)

A vertically scrolling feed assembled from API-driven sections. Pull to refresh. Sections come back in any order and any of them can be absent.

- **Hero banner** — a horizontal auto-advancing carousel of promoted items with pagination dots. Each banner links to a book, an article or an event. It auto-scrolls every 4 seconds.
- **Continue Reading** — horizontally scrolling cards of books in progress, each with a progress bar and pages-left text (it says "Completed" on the last page).
- **Featured Books** — horizontal carousel of book cards: cover, title, author, rating.
- **Audiobooks** — same card shape as Featured Books, flagged as audio.
- **Featured Articles** — horizontal carousel of article cards: image, title, excerpt, date.
- Every section has a header with a title and an optional subtitle.
- States needed: loading, error with a retry button, and the case where a refresh fails while old content is still on screen.
- A welcome modal can appear on first launch.

#### 2. Book detail (pushed screen)

- Back button floating over the content.
- **Hero**: large cover, title, author, average rating with star display and total rating count.
- **Tags** row (genre, format).
- **Tabbed content** with an animated underline: **About** (description), **Synopsis**, **Reviews** (rating stats card with a distribution breakdown, plus review cards), **More Books** (related book carousel).
- A **fixed bottom action bar**. Its button changes by state: Buy with a price, Read Now, Listen Now, or a subscription upsell. It must clear the home indicator.
- A rating/review modal opens from the Reviews tab.
- States needed: loading, error with retry, purchasing/in-flight.

#### 3. Explore (tab)

- Premium header: title "Explore", subtitle "Discover amazing content".
- A search bar with a clear button.
- A horizontally scrolling filter tab row with icons: **Blogs, Podcasts, Videos, Events, Community**.
- A single vertical list whose card type changes with the active tab. Five distinct card designs are needed:
  - **Blog card** — image, title, excerpt, date, read time.
  - **Podcast card** — artwork, title, host, duration, play affordance.
  - **Video card** — thumbnail with a play overlay, title, duration.
  - **Event card** — date block, title, location, time.
  - **Community card** — group image, name, member count, and a Join / Joined toggle button with a pending state.
- States needed: loading, error with retry, empty ("No blogs found" etc.), refreshing.

#### 4. Blog / article detail (pushed screen)

- Full-bleed hero image with a gradient fade into the background.
- Back button over the image.
- Title, author, date, read time.
- Long-form body copy. This is the screen where reading comfort matters most: line length, line height, paragraph spacing, heading scale, blockquotes, inline images, lists, links.
- Pull to refresh. Loading and error states.

#### 5. Library (tab)

- Premium header.
- A horizontally scrolling filter row: **All Books, My Books, E-Books, Audiobooks, Hardcover, Paperback**.
- A **grid** of book cards (column count is responsive).
- Empty state, with different copy when a filter is active versus when the whole library is empty.
- Loading, error with retry, pull to refresh.

#### 6. Settings (tab)

- Premium header: "Settings" / "Manage your account".
- **User profile card** at the top: avatar, name, email. Handles its own error state with a retry.
- Grouped sections with dividers between rows. Each row has a label, a subtitle, a leading icon, and either a chevron or a control:
  - **Account** — Edit Profile ("Update your personal information"), Change Password ("Update your security credentials").
  - **Preferences** — Push Notifications ("Receive updates and alerts", with a toggle switch), Subscription ("Manage your premium plan").
  - **Support** — Report A Bug ("Help us improve the app").
  - **Danger Zone** — Logout ("Sign out of your account"), Delete Account ("Permanently remove your data"). This section needs a visually distinct destructive treatment.
- Two modals: **Delete Account** confirmation (warning icon, destructive copy, cancel/confirm) and **Report A Bug** (title field, description textarea, inline validation errors, submitting state). Both currently sit on a blurred backdrop.
- App version footer.

#### 7. Profile (tab) — the author's profile

- Header, author card (photo, name, title), social links row, About section (bio), Writing Process section (a description plus a list of points).

#### 8. Subscription (pushed screen)

- A monthly/annual billing toggle.
- Two plan cards: **Free** (Read limited books, Community Access, No offline downloads) and **Premium** (Access to all books, Ad-free experience, Exclusive author content, Early access to new releases, Premium community posts, Audio editions).
- Pricing: `$14.99` monthly, `$99.99` annually, with a "Save 44%" badge on annual.
- A subscribe CTA with a loading state.

#### 9. Auth screens

Onboarding, Login, Signup, Forgot Password, Verification Code, Reset Password. Each needs: brand presence, inputs with a label and an inline error state, a primary CTA, secondary links, and a keyboard-open layout that does not bury the primary button.

> Known problem to solve in the redesign: on the current Login screen the Sign In button sits outside the keyboard-avoiding container, so the keyboard covers it. The new design must keep the primary CTA reachable while the keyboard is open.

#### 10. Secondary screens (design after the above)

- **Checkout** — collapsible sections, quantity selector, shipping address form, order summary, Stripe payment. Real money, so hierarchy and error states matter.
- **Ebook reader** — header and footer chrome that hides on tap, page progress, reading surface. Needs a design that is comfortable in a dark room.
- **Audiobook player** — artwork, scrubber, play/pause, skip, speed.
- **Podcast detail** and **Video detail** — hero/player, description, related list.
- **Event detail** — hero, date/time/location info block, description, an action button.
- **Community detail** — about view plus a chat view: thread cards, self versus other message bubbles, avatars, a message input.
- **Edit Profile**, **Change Password**, **Notifications**.

### Shared components that need a spec

Everything here is used across many screens, so specify each once:

`UButton`, `UIconButton`, `UTextButton`, `UBackButton` (floats over content, needs a glass variant), `UInput`, `UTextArea`, `USearchbar` (with clear button and disabled state), `UButtonTabs` (horizontally scrolling icon+label filter pills), `TabBar` (animated underline tabs), `UStarRating` (display and interactive), `UProgressBar`, `USkeleton` loading placeholders, `UHeader` (screen header, currently has a "premium" variant with title + subtitle), `UScreenError` (message plus retry), empty states, toasts, modals, the bottom tab bar, and the app loader.

## Part 3 — What to deliver

1. **A design system first**, before any screen:
   - Color tokens with exact hex/rgba values, named semantically (surface, surface raised, text primary, accent, border, etc.), for **dark and light**. The website ships both. Say plainly whether the app should ship both or dark only, and why.
   - A type scale: family, size, weight, line height, letter spacing, and where each step is used. If Orbitron / Jura / Outfit come along from the website, say which is the body font and confirm long-form article text stays on a highly readable family.
   - Spacing scale, corner radii, border widths, elevation/shadow, and the glass recipe with its Android fallback.
   - Icon style and size steps.
   - Motion: durations, easings, and which transitions exist (screen push, tab change, card press, list item entrance).
2. **Screen designs** in the priority order above, each with its full state set: default, loading, empty, error, and any in-flight/disabled state named in the screen's description.
3. **Component specs** for the shared component list, including every interaction state: default, pressed, disabled, focused, error, selected.
4. **Annotations** on anything that is not obvious from the pixels: what scrolls, what is fixed, what respects a safe area, how a list reflows at a narrower width.
5. **A short mapping note** from website pattern to app pattern. Example: "website sticky glass navbar becomes the app's bottom tab bar, using the same active pill treatment".

## Part 4 — Rules

- **Do not invent features, screens, tabs or content.** If a screen seems to need something that does not exist, flag it as a question instead of designing it in.
- **Do not change navigation structure.** Five tabs, same order, same destinations.
- **Do not change copy** where copy is quoted above. It is real product copy.
- Translate, do not transplant. A website hero built on a WebGL canvas, a custom glow cursor and a sci-fi preloader does not become a mobile screen as-is. Keep the *feeling*: deep dark surfaces, purple and cyan glow, glass, uppercase technical type, cinematic covers.
- Keep it implementable in Tamagui and React Native. Each screen should note anything that will be expensive on device (large blurs, many shadows, gradient text, long animated lists) so engineering can plan for it.
- Stay accessible. Contrast ratios, touch targets, and a labeled role for every interactive element. The current app already fixed its bottom tab bar and back button for screen readers; do not design a regression.

## Part 5 — Questions to answer back before finalizing

State your assumption and keep going, but list these for the client:

1. Dark only, or dark and light like the website?
2. Does the sci-fi identity fit an author's reading app on all screens, or should long-form reading surfaces (article body, ebook reader) step down to a calmer treatment?
3. Do Orbitron and Jura ship in the app bundle, or is there a licensing/file-size reason to substitute?
4. Does the app adopt the website's shop/product visual language on the book detail and checkout screens, given that the store is WooCommerce on the web and Stripe in the app?
5. Should the tab bar keep its current filled-circle active state, or move to the website's glass pill with a glow?
