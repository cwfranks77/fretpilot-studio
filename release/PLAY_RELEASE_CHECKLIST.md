# FretPilot Studio & School – Google Play Release 1.0.0

Artifacts generated:
- `release/FretPilot-1.0.0-release.aab` (Preferred for Play)
- `release/FretPilot-1.0.0-release.apk` (Optional / sideload)

## 1. Pre‑Upload Checklist
- VersionCode: 2  | VersionName: 1.0.0
- Package ID: `com.fretpilot.app`
- Signing: release keystore applied (verify in Play after upload)
- Min SDK: as defined (rootProject.ext.minSdkVersion)
- Icons: ensure adaptive icon (splash + main icon) – currently standard; consider adding adaptive XML if missing.
- Privacy Policy: link accessible at `/privacy.html` (confirm hosted HTTPS domain before production listing)
- Terms of Service: `/terms.html`
- About Page: `/about.html`

## 2. Google Play Console Steps
1. Login → Select App (create new if not exists) → Production → Create Release.
2. Upload `FretPilot-1.0.0-release.aab`.
3. Review warnings (e.g., ad identifiers, data safety forms) & resolve.
4. Add Release Notes:
   ```
   First public release (1.0.0)
   - Multiplayer jam sessions (demo mode)
   - AI Lesson Generator
   - Practice Analyzer with Mistake Heatmap
   - Metronome & Tuner tools
   - Jam Companion backing track prototype
   - Achievement & stats system
   ```
5. Data Safety Form:
   - Declared data: basic usage analytics (if enabled), microphone (for audio jam), optional ad identifiers.
   - Purpose: core functionality (audio), analytics (improvement), advertising (if AdMob retains).
6. App Content → Target Audience (13+ or appropriate) → Ads (declare AdMob) → Privacy Policy URL.
7. Pre-launch report: enable automatic tests (recommended).
8. Start rollout (you can do staged: e.g., 10%).

## 3. Permissions Audit
Search in merged manifest after build (Play will show):
- RECORD_AUDIO (required for jams & analyzer)
- INTERNET (network connections)
- ACCESS_NETWORK_STATE
No location / contacts / storage explicit requests. If any extras appear, audit plugin dependencies.

## 4. Post-Upload Verification
- Check signing certificate fingerprint matches your keystore (under Release > App Integrity).
- Confirm version code increments for next releases.
- Review Pre-launch Report (device screenshots, ANRs, crashes).
- Verify that adaptive icon rendering (if missing, schedule enhancement).

## 5. Future Hardening Before Real Multiplayer
- Deploy real signaling server & TURN → remove demo mode label.
- Server authoritative achievements & anti-tamper.
- Cloud sync (Supabase/Firebase) for cross-device continuity.
- Data retention & export tooling (GDPR compliance).

## 6. Preparing Next Release (1.1.0)
Increment:
- `versionCode` +1
- `versionName` to `1.1.0`
Run script:
```powershell
./prepare-release.ps1
```
Artifacts appear again under `release/`.

## 7. Adaptive Icon (Optional Upgrade)
Add in `android/app/src/main/res/mipmap-anydpi-v26/`:
- `ic_launcher.xml` using foreground & background layers.
Foreground: your gradient + fretboard SVG.
Background: solid dark (#1e1e2f) or subtle radial.

## 8. Security Notes
Do NOT commit keystore passwords to public repos. Rotate if exposed.
Use Play App Signing (recommended) then store upload keystore safely.

## 9. Manual Verification Commands
```powershell
# Validate artifacts exist
Get-ChildItem .\release

# Re-run build quickly (bundle only)
./prepare-release.ps1 -BundleOnly
```

## 10. Support Rollout Monitoring
- Crashes: Play Console > Android Vitals
- ANRs: Investigate heavy audio processing on low-end devices
- User feedback: Encourage via in-app link (add later)

---
Generated: 2025-11-15
