# Spread — Mobile App

Flutter port of the Spread design (`../app design`), wired to the same Next.js
backend as the website (`../src`). Same content, same accounts, same wallet —
two clients, one backend.

## Setup

1. Install the [Flutter SDK](https://docs.flutter.dev/get-started/install) if you haven't already.
2. From this `mobile/` folder:
   ```
   flutter pub get
   ```
3. **Point the app at your backend.** Open `lib/services/api_service.dart` and set `kApiBaseUrl`:
   - Android emulator → `http://10.0.2.2:3000` (already the default)
   - iOS simulator → `http://localhost:3000`
   - Physical device → `http://<your-computer's-LAN-IP>:3000` (same Wi-Fi network)
   - Production → your deployed domain, e.g. `https://spread.ng`
4. Make sure the Next.js site is running (`npm run dev` in the project root) so the app has something to talk to.
5. Run it:
   ```
   flutter run
   ```

## What's here

- `lib/theme/` — the "modern brutalist" mobile design tokens (colors, type scale, hard-shadow helpers) ported from the design file. Deliberately stark black/white/cream, distinct from the web app's warmer palette, but same DNA (hard borders, hard shadows, Bricolage Grotesque, TV-frame motifs, wavy dividers).
- `lib/models/` — Dart classes matching the JSON shapes returned by the backend's API routes.
- `lib/services/` — `api_service.dart` (cookie-based session HTTP client), `content_service.dart` (articles/facts/events/ticker), `auth_provider.dart` (login state, via `provider`), `submission_service.dart` (Spread & Earn submissions), `bookmarks_service.dart` (on-device saved articles — there's no bookmarking backend on the web app either, so this stays local).
- `lib/screens/` — Home, Article Detail, Confirmed Facts, Submit News (Earn), Profile, Saved Articles, Login/Signup.
- `lib/widgets/` — shared brutalist UI pieces (app bar, bottom nav, verified stamps, category chips, wavy divider, marquee ticker).

## Deviations from the design file, and why

- **Bottom nav standardized to 4 tabs** (News / Confirmed / Earn / Profile). The mockups actually disagreed with themselves screen-to-screen on what the tabs were — this picks one consistent set for the whole app. "Saved Articles" is reachable from Profile instead of being a 5th/alternate tab.
- **Drop-a-Tip screen rebuilt, not ported verbatim.** The original design branded it "Encrypted & Anonymous — your identity is stripped before submission." That directly contradicts Spread & Earn: a submission has to be tied to a real, logged-in, paying account so the AI can credit the right wallet and the byline is real. The brutalist form language carried over; the anonymity framing and mismatched fields (Category/When/Where) didn't — replaced with what the backend actually needs (headline, story, evidence note) plus the earning pitch.
- **Profile screen gained a wallet balance + verification-package status.** The original showed "Tips Dropped / Stories Verified / Impact Score," none of which map to real tracked data — replaced with the two numbers that actually matter now: wallet balance and subscription status.

## Known limitation

I wrote this without a Flutter SDK available to compile against, so it hasn't been run yet — I reviewed it carefully by hand, but the first `flutter run` may surface something (a typo, a package version mismatch) that a real compiler would have caught immediately. Treat the first build as a shakedown, not a guarantee.
