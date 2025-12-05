# Audio Doctor · Google Play Console Ready

Audio Doctor is your lightweight, privacy-first audio engineering companion. The CLI + dashboard combo lets musicians tune virtual rigs, explore EQ/compressor presets, and monitor meters without leaving user space. This guide walks through the release-ready checklist so we can ship to the Play Console without delays.

## Current quick status

- Build pipeline: ✅ `npm run build` (Vite assets compile cleanly)
- Target platform: Android Package Bundle (AAB)
- App ID: `com.audio.doctor`
- Store name: **Audio Doctor**
- Keystore: ⚠️ needs to be created (see Step 1)

## Step 1: Prepare the Android project + signing key

1. If you haven’t yet added the Android shell, run: `npx cap add android`. This generates the `android/` tree you can open with Android Studio.
2. Sync the latest web bundle into Capacitor: `npm run build && npx cap sync android`.
3. Create a release keystore if you don’t already have one:

    ```powershell
    cd C:\Users\ninja\fretPilot Studio\android\app
    mkdir -Force keystore
    keytool -genkeypair -v -keystore keystore/audio-doctor.keystore \
       -alias audio-doctor -keyalg RSA -keysize 2048 -validity 10000
    ```

    Save the password/alias, then create `keystore/keystore.properties` with:

    ```properties
    storeFile=keystore/audio-doctor.keystore
    storePassword=YOUR_STRONG_PASSWORD
    keyAlias=audio-doctor
    keyPassword=YOUR_STRONG_PASSWORD
    ```

## Step 2: Build the release bundle (AAB)

From the repo root:

```powershell
npm run build
cd android
.\gradlew clean bundleRelease -PkeystoreProperties=app/keystore/keystore.properties
```

Output will appear under `android/app/build/outputs/bundle/release/app-release.aab`. That is what you upload to Play.

## Step 3: Create the Play Console listing

1. Sign in at [Google Play Console](https://play.google.com/console) and create an app named **Audio Doctor**.
2. Default language English (US). App or Game → App. Free → Free (audio tool). Accept developer distribution agreement.
3. Provide a privacy policy (e.g., `https://fretpilotstudio.com/privacy.html`) — adapt wording to reference Audio Doctor.
4. Content rating: choose **Music & Audio** → answer as “No” for disallowed content to reach E rating.
5. Ads: select “No” if the app stays ad-free; otherwise declare the ad tech used.
6. Target audience: 13+, not designed for children.
7. Data safety: declare only the data your audio diagnostics collect (e.g., usage metrics, crash logs). No personal data is harvested beyond telemetry.

## Step 4: Internal testing track + release notes

1. Under **Testing → Internal testing**, create a release and upload `app-release.aab`.
2. Release name: `Audio Doctor v1.0 Internal`.
3. Release notes idea:

   > Audio Doctor v1.0 — Dash into the audio lab.
   >
   > • Live audio meter monitoring
   > • EQ, gain, and compressor presets saved to JSON
   > • Responsive CLI dashboard for Mac/PC

4. Add yourself and teammates as testers and share the opt-in link.

## Step 5: Store listing assets

- App icon: update `android/app/src/main/res/mipmap-*/ic_launcher.png` to match the Audio Doctor mark.
- Feature graphic (1024x500) with tagline “Tame your tone in minutes.”
- Screenshots (1080×1920) showing the dashboard, settings, and EQ meters.
- Short description: “Real-time audio diagnostics for musicians.”
- Full description: describe the Audio Doctor experience and mention the CLI + dashboard synergy.
- Support URL: `https://fretpilotstudio.com/support` (or set up a dedicated landing).

## Step 6: Monetization & policies (optional for internal)

- If you plan premium unlocks, configure them under **Monetize → Products**.
- For an initial launch, you can keep everything unlocked and add purchases later once the base experience is stable.

## Step 7: What we already tested

- ✅ `npm run build` to compile the Vite SPA and inline assets.
- ✅ `npx cap sync` (implicit as part of the build script) to keep Capacitor up to date.
- Manual CLI/dash run: existing `main.py` works with the config file.

## Next steps before hitting Submit

- [ ] Generate keystore and store the password securely.
- [ ] Build the `app-release.aab` and verify it installs locally via `adb install-multiple ...`.
- [ ] Capture final screenshots and a feature graphic for the store listing.
- [ ] Fill Play Console data safety, content rating, and privacy policy.
- [ ] Roll out to internal testing → monitor crashlytics once live.

Need me to help script the Gradle keystore step or craft release notes for Play? Just say the word.