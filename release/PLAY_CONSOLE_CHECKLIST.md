# Google Play Console Upload Checklist – FretPilot Studio & School v1.0.0

## Pre-Upload Preparation

### 1. Build Artifacts
- [x] AAB generated: `android/app/build/outputs/bundle/release/app-release.aab`
- [x] Signed with release keystore
- [x] VersionName: 1.0.0
- [x] VersionCode: 2
- [x] Package ID: com.fretpilot.app

### 2. Store Listing Assets
Create and prepare:
- [ ] App icon: 512x512 PNG (high-res, no transparency)
- [ ] Feature graphic: 1024x500 JPEG/PNG (optional but recommended)
- [ ] Screenshots (minimum 2, recommended 5-8):
  - [ ] AI Lesson Generator screen
  - [ ] Mistake Heatmap visualization
  - [ ] Jam Companion interface
  - [ ] Tuner + Metronome panel
  - [ ] Practice Analyzer / Progress Dashboard
  - [ ] Chord Library explorer
  - [ ] Settings / Consent screen (optional)

### 3. Text Content
**Short Description (≤80 chars):**
```
AI-guided guitar practice: adaptive lessons, mistake heatmap & tuner.
```

**Full Description:**
```
FretPilot Studio & School provides adaptive AI-generated lessons, mistake heatmap visualization, jam companion tracks, an integrated tuner and metronome, and mastery analytics—engineered to accelerate deliberate guitar improvement.

Features:
• AI Lesson Generator – Curates evolving practice sequences from your performance gaps
• Mistake Heatmap – Precision fretboard visualization of error concentration
• Practice Analyzer – Timing, consistency, and clarity metrics
• Jam Companion – Adaptive backing tracks that respond to your error density
• Metronome + Tuner – Unified timing and pitch center
• Progress Engine – Tracks mastery velocity, streak continuity, drill completion
• Chord Library – Structured chord explorer with inversions
• Consent-First Privacy – Analytics disabled until you opt in

Designed for players serious about intentional improvement. Refine. Evolve. Own your craft.
```

**Release Notes (Internal Testing):**
```
FretPilot Studio & School v1.0.0 Internal Test

Core Features:
- AI Lesson Generator
- Mistake Heatmap
- Practice Analyzer
- Jam Companion adaptive tracks
- Metronome + Tuner hub
- Progress streak & mastery tracking
- Chord Library explorer
- Consent-based analytics

Known Issues (non-blocking):
- KI-001: Tuner latency on very low frequencies (<60Hz)
- KI-002: Heatmap rare fret offset after rapid tuning
- KI-003: Jam Companion double slowdown on clustered errors

Data Safety: Transient audio (no storage); metrics local; analytics opt-in.

Installation: Upload AAB to Internal Testing track.
```

### 4. App Information
- [ ] App name: **FretPilot Studio & School**
- [ ] Category: **Education** (or Music & Audio)
- [ ] Tags: music learning, guitar, practice, AI training
- [ ] Content rating: Complete questionnaire (likely PEGI 3 / Everyone)
- [ ] Target audience: Age 13+
- [ ] Contact email: **support@fretpilotstudio.com**
- [ ] Website: **https://fretpilotstudio.com**
- [ ] Privacy policy URL: **https://fretpilotstudio.com/privacy**
- [ ] Terms of service (optional): **https://fretpilotstudio.com/terms**

### 5. Data Safety Declaration
Navigate to: Play Console → App content → Data safety

**Data types collected:**
- **App activity**: Usage data (feature engagement) – **OPT-IN ONLY**
- **App info and performance**: Crash logs, diagnostics – **OPT-IN ONLY**

**Audio:**
- Collected: NO (transient processing only, not stored)

**Performance metrics:**
- Collected: YES
- Stored: Local device only
- Shared: NO
- User control: Can clear via app (future reset feature)

**Analytics:**
- Collected: YES (only after explicit consent)
- Purpose: App improvement, crash analysis
- Shared: NO
- User control: Revocable consent in Settings

**No sensitive data collected:**
- No location
- No contacts
- No messages
- No photos/media
- No personal identifiable information (unless voluntarily provided for support)

**Data security:**
- Encryption in transit: YES (for analytics, if consented)
- Encryption at rest: Device-level (Android default)
- User can request deletion: YES (via support email)

**Compliance:**
- [ ] Confirm adherence to Google Play Families Policy (if targeting children)
- [ ] Confirm no misleading claims about data usage

### 6. Permissions Justification
**RECORD_AUDIO:**
- Purpose: Real-time tuner pitch detection; no audio recorded or stored.

**INTERNET:**
- Purpose: Future lesson expansion + optional analytics (consent-based).

**ACCESS_NETWORK_STATE:**
- Purpose: Graceful offline mode detection.

---

## Upload Process

### Step 1: Navigate to Internal Testing
1. Open Play Console: https://play.google.com/console
2. Select app: FretPilot Studio & School (or create new app if first time)
3. Sidebar: **Testing → Internal testing**

### Step 2: Create Release
1. Click **Create new release**
2. Upload AAB: `app-release.aab`
3. Play Console will analyze and generate APKs automatically
4. Review supported devices/ABIs

### Step 3: Add Release Notes
Paste the release notes from above (or use condensed version from `release_notes_1_0_0_apk.js text`)

### Step 4: Review & Save
1. Confirm version increments correctly (versionCode must be > previous)
2. Click **Save**
3. Click **Review release**

### Step 5: Roll Out
1. Review summary (countries, testers, rollout %)
2. Click **Start rollout to Internal testing**
3. Confirm

---

## Post-Upload Actions

### 7. Add Testers
Navigate to: **Testing → Internal testing → Testers tab**

**Option A: Email list**
- Enter individual email addresses (comma-separated or one per line)

**Option B: Google Group**
- Create a Google Group (e.g., fretpilot-testers@googlegroups.com)
- Add group email

**Tester Instructions:**
Send testers this message:
```
Subject: FretPilot Studio & School Internal Test Invitation

You've been invited to test FretPilot Studio & School v1.0.0.

Opt-in link: [Copy from Play Console after rollout]

After opting in, install via Play Store.

Test focus:
- Audio permission flows
- Mistake Heatmap accuracy
- Jam Companion tempo adaptation
- Metronome stability (long sessions)

Feedback: support@fretpilotstudio.com
```

### 8. Monitor Pre-Launch Report
- Play Console auto-generates a pre-launch report (crawl test on Firebase Test Lab devices)
- Review for crashes, accessibility issues, security vulnerabilities
- Typical wait: 1-2 hours after upload

### 9. Track Android Vitals
After initial usage:
- Crash rate
- ANR (Application Not Responding) rate
- Excessive wakeups
- Slow rendering

**Target thresholds (Google Play standards):**
- Crash rate: <0.47% (bad if >2.36%)
- ANR rate: <0.24% (bad if >1.09%)

### 10. Collect Feedback
- Dedicated email: support@fretpilotstudio.com
- Feedback page: https://fretpilotstudio.com/support
- Consider adding in-app feedback button (future enhancement)

---

## Rollout to Closed/Open Testing (Future)

### Closed Testing (Broader Audience)
- Repeat upload process under **Testing → Closed testing**
- Can have multiple tracks (e.g., Beta, Alpha)
- Useful for staged rollouts (e.g., 10% → 50% → 100%)

### Open Testing (Public Beta)
- **Testing → Open testing**
- Anyone can opt in via Play Store link
- Use for public betas before production

### Production
- **Release → Production**
- Full public availability
- Rollout can be staged (e.g., 5% → 20% → 50% → 100%)
- Requires completing all app content forms (privacy, content rating, store listing, etc.)

---

## Troubleshooting

**Upload fails: "Version code must be greater than X"**
- Increment versionCode in `android/app/build.gradle`, rebuild AAB

**"App not optimized for your device" in Play Store**
- Check supported ABIs (arm64-v8a, armeabi-v7a, x86, x86_64)
- Ensure minSdkVersion compatibility (currently 24 / Android 7.0)

**Pre-launch report shows crashes**
- Review stack traces
- Fix critical issues, increment versionCode, re-upload

**Testers can't find app**
- Confirm they accepted opt-in link
- Check their Google account matches invited email
- Ensure app is rolled out (not just saved as draft)

---

## Quick Reference URLs

- Play Console: https://play.google.com/console
- Privacy Policy: https://fretpilotstudio.com/privacy
- Terms of Service: https://fretpilotstudio.com/terms
- Support: https://fretpilotstudio.com/support
- Release notes script: `node scripts\release_notes_1_0_0_apk.js`

---

## Final Pre-Flight Check

Before clicking "Start rollout":
- [ ] AAB uploaded successfully
- [ ] Release notes pasted
- [ ] Privacy policy URL live and accessible
- [ ] Screenshots uploaded (minimum 2)
- [ ] Short + full description finalized
- [ ] Data safety form completed
- [ ] Content rating questionnaire submitted
- [ ] Tester emails/group configured
- [ ] Support email functional: support@fretpilotstudio.com

---

**Ready to launch!** 🚀
