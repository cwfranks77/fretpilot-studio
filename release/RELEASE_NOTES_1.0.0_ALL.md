# FretPilot Studio & School – Release Notes v1.0.0 (Test Build)

Single consolidated document containing ALL formats (Markdown, Plain Text, JSON spec, Gradle snippet, Short Play Console blurb) so you can copy from one place.

---
## 1. Overview
Version: 1.0.0 (versionCode 2)
Package ID: `com.fretpilot.app`
Target: Internal / Closed Testing (Pre-Production)

FretPilot Studio & School combines AI-guided practice, real‑time performance analysis, and structured curricula into one guitar training environment.

---
## 2. Core Feature Set
1. AI Lesson Generator – Dynamically builds practice sequences from skill goals & recent performance gaps.
2. Mistake Heatmap – Visual fretboard overlay highlighting error density by string/fret over recent sessions.
3. Practice Analyzer – Aggregates timing accuracy, note clarity, consistency metrics into daily/weekly summaries.
4. Jam Companion – Backing tracks with adaptive tempo (auto-slowdown when error spike detected).
5. Metronome + Tuner Combo – Unified timing & pitch panel; tuner leverages microphone input with fast FFT.
6. Progress Service – Persists streaks, mastery percentages, and drill completion stats.
7. Chord Library – Structured chord explorer with fingerings and inversion suggestions.
8. Premium Gate – Feature-flag controlled gating for upcoming subscription modules.
9. Consent & Analytics Services – Privacy-first event flow; explicit consent gating before analytics activation.
10. Ad Service (Stub) – Placeholder integration for future non-intrusive educational ad units.

---
## 3. Modules / Components
- `AiLessonGenerator.vue`: Prompt-to-lesson assembly using internal rules + user progress.
- `MistakeHeatmap.vue`: Visual error mapping.
- `PracticeAnalyzer.vue`: Time-series performance metrics.
- `FretPilotTrainer.vue`: Central practice orchestration surface.
- `JamCompanion.vue`: Backing track & adaptive tempo logic.
- `MetronomeTuner.vue`: Timing + pitch utilities.
- `ChordLibrary.vue`: Chord exploration.
- `PremiumGate.vue`: Conditional unlock container.
- Services: `aiService.js`, `progressService.js`, `analyticsService.js`, `consentService.js`, `adService.js`, `featureFlags.js`, `config.js`.

---
## 4. Technical Stack Snapshot
- Frontend: Vue 3 + Vite.
- Runtime: Capacitor (Android/iOS), Electron (desktop), Web deployment (Vercel).
- Audio / Input: Microphone permission for tuner & performance capture.
- Data Layer: Local persistence + remote endpoints (future expansion). Currently minimal network usage besides analytics (if consented).

---
## 5. Data Safety & Privacy (Draft Declaration)
| Category | Data Collected | Purpose | Shared? | Retained Duration | User Control |
|----------|----------------|---------|--------|------------------|--------------|
| Diagnostics | Basic session events (feature usage) | Improve stability & UX | No third-party sharing | Rolling 90 days | Opt-in via consent screen |
| Performance Metrics | Timing accuracy, error density | Personalized training recommendations | No | Stored locally; anonymized aggregate (future) | Can clear in settings |
| Audio Input | Live microphone signal for tuning (not recorded) | Pitch detection | No | Not stored | Disable tuner / deny permission |
| Authentication (Future) | Account email (not yet active) | Sync & subscription | Not applicable yet | Planned | Voluntary signup when launched |

No sensitive categories (location, contacts, messages) are collected. Data collection only begins after explicit user consent.

---
## 6. Permissions (Android)
- `RECORD_AUDIO`: Needed exclusively for tuner and potential real-time note detection. No audio files saved.
- `INTERNET`: API calls (future lesson expansions) & analytics dispatch.
- `ACCESS_NETWORK_STATE`: Graceful handling of offline mode.

---
## 7. Known Issues (v1.0.0 Test)
| ID | Area | Symptom | Severity | Workaround |
|----|------|---------|----------|------------|
| KI-001 | Tuner | Occasional latency spike on very low frequencies (below 60Hz) | Low | Retune on higher string then octave adjust |
| KI-002 | Heatmap | Rare mismatch of fret offset after rapid tuning session | Medium | Reopen Mistake Heatmap component to force redraw |
| KI-003 | Jam Companion | Auto-tempo slowdown can trigger twice on clustered errors | Medium | Manual tempo reset in control panel |
| KI-004 | Electron Build | Splash screen lingers ~1s longer than intended | Low | None (cosmetic) |
| KI-005 | Mobile Resume | On Android coming back from background can briefly desync metronome click | Medium | Tap metronome start/stop once |

---
## 8. Upgrade Path / Roadmap
Planned next (1.1.x / 1.2.x):
- Cloud profile + cross-device sync.
- Advanced ear-training drills (interval ID, chord quality).
- Multiplayer session (TURN infra) pilot.
- Adaptive curriculum difficulty layers (reinforcement scheduling).
- Real product imagery and refined store branding integration.
- Subscription gateway (premium analytics overlays, extended AI model depth).

---
## 9. Testing Focus Requests
Please emphasize validation of:
- Audio permission grant/deny flows.
- Heatmap accuracy after consecutive error-heavy sessions.
- Jam Companion tempo adaptation threshold correctness.
- Metronome drift on long (>20 min) practice runs.
- State persistence (streaks, mastery) across app restarts.

---
## 10. Changelog (Plain Text)
FretPilot Studio & School 1.0.0
- Initial public test build.
- Added AI Lesson Generator, Mistake Heatmap, Practice Analyzer, Jam Companion.
- Integrated tuner + metronome combo panel.
- Progress tracking & streak persistence.
- Privacy-first consent gating for analytics.
- Basic feature flag + premium gate scaffold.
- Performance metrics aggregation & summary panels.
- Initial Chord Library module.

---
## 11. Markdown (Play Console Detailed)
### FretPilot Studio & School v1.0.0 (Test)
**Highlights**
- AI-crafted lessons from real performance gaps.
- Visual mistake heatmap for targeted refinement.
- Adaptive jam tracks respond to your error density.
- Unified tuner + metronome panel.
- Detailed progress analytics & drill streak tracking.

**Stability / Privacy**
- Analytics disabled until explicit consent.
- Audio captured only transiently for pitch (never stored).

**Known Issues**
- See table: KI-001 through KI-005 (none are blocking release).

**Next**
- Cloud sync, multiplayer jam, advanced ear training, enhanced brand visuals.

---
## 12. JSON Specification
```json
{
  "versionName": "1.0.0",
  "versionCode": 2,
  "packageId": "com.fretpilot.app",
  "releaseType": "test",
  "features": [
    "AI Lesson Generator",
    "Mistake Heatmap",
    "Practice Analyzer",
    "Jam Companion adaptive backing tracks",
    "Metronome + Tuner integrated panel",
    "Progress tracking & streaks",
    "Chord Library",
    "Premium Gate scaffold",
    "Consent-based analytics"
  ],
  "permissions": ["RECORD_AUDIO", "INTERNET", "ACCESS_NETWORK_STATE"],
  "knownIssues": [
    {
      "id": "KI-001",
      "area": "Tuner",
      "symptom": "Latency spike on very low frequencies",
      "severity": "low",
      "workaround": "Retune higher string then octave adjust"
    },
    {
      "id": "KI-002",
      "area": "Heatmap",
      "symptom": "Rare fret offset mismatch",
      "severity": "medium",
      "workaround": "Reopen component"
    },
    {
      "id": "KI-003",
      "area": "Jam Companion",
      "symptom": "Double-trigger slowdown on clustered errors",
      "severity": "medium",
      "workaround": "Manual tempo reset"
    },
    {
      "id": "KI-004",
      "area": "Electron Build",
      "symptom": "Splash lingers longer",
      "severity": "low",
      "workaround": "None"
    },
    {
      "id": "KI-005",
      "area": "Mobile Resume",
      "symptom": "Metronome desync after resume",
      "severity": "medium",
      "workaround": "Toggle start/stop"
    }
  ],
  "dataSafety": {
    "audio": "Transient pitch processing only, no storage",
    "performanceMetrics": "Local only, user-resettable",
    "analytics": "Opt-in after consent",
    "sensitiveData": "None collected"
  },
  "roadmap": ["Cloud sync", "Multiplayer jam", "Ear training drills", "TURN infrastructure", "Subscription analytics overlays"],
  "testFocus": ["Audio permission flows", "Heatmap accuracy", "Adaptive tempo thresholds", "Metronome long-session stability", "Persistence across restart"]
}
```

---
## 13. Gradle / INTERNAL CHANGELOG Snippet
```gradle
// CHANGELOG 1.0.0
// Initial test release.
// Features: AI lessons, mistake heatmap, practice analyzer, jam companion, tuner+metronome, progress tracking, chord library, consent analytics, premium gate scaffold.
// Known Issues: KI-001..KI-005 (non-blocking).
```

---
## 14. Short Play Console Blurb
AI-guided guitar practice studio: adaptive lessons, mistake heatmap, jam tracks that respond to you, integrated tuner + metronome, and detailed progress analytics. Early test build – feedback welcome.

---
## 15. One-Line Summary
Adaptive AI guitar training with real-time error mapping and performance analytics (Test v1.0.0).

---
## 16. Internal QA Checklist (Condensed)
- [ ] Audio permission denial gracefully degrades tuner.
- [ ] Heatmap redraw consistency after 3+ rapid sessions.
- [ ] Jam Companion slowdown triggers only once per error cluster.
- [ ] Metronome drift < 5ms over 20 min session.
- [ ] Streak reset logic correct after gap day.
- [ ] Analytics fully disabled until consent flag true.

---
## 17. Distribution Notes
Not for external marketing. Use internal track (Closed Testing). Provide these notes verbatim for testers.

---
## 18. Submission Instructions (Reference)
1. Upload `.aab` to Google Play Console (Internal testing track).
2. Paste Short Blurb + Detailed Markdown section.
3. Fill Data Safety using table above (no storage of audio, performance metrics local, analytics opt-in).
4. Confirm permissions descriptions: Microphone for tuning only; Network for minimal usage.
5. Attach screenshots (Tuner, Heatmap, Jam Companion, Progress Dashboard).
6. Save & roll out to testers.

---
End of consolidated release notes.
