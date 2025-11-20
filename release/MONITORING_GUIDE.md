# Monitoring & Analytics Dashboard Setup Guide

## Overview
This guide establishes monitoring infrastructure for FretPilot Studio & School v1.0.0 post-launch. Focus areas: crash tracking, performance metrics (Android Vitals), user feedback collection, and analytics dashboard (opt-in consent flow).

---

## 1. Android Vitals (Google Play Console)

### Navigation
Play Console → Release → Android vitals

### Key Metrics to Monitor

#### 1.1 Crash Rate
**Definition:** Percentage of daily sessions with at least one crash.

**Thresholds:**
- **Good:** <0.47%
- **Bad:** >2.36%

**Action items if bad threshold exceeded:**
- Review top crash clusters (Play Console → Android vitals → Crashes & ANRs)
- Analyze stack traces for common patterns
- Prioritize fixes in next patch release

**FretPilot-specific watchpoints:**
- Audio subsystem crashes (tuner pitch detection)
- Heatmap rendering errors (Canvas OOM)
- Metronome timer thread crashes

#### 1.2 ANR (Application Not Responding) Rate
**Definition:** Percentage of sessions where app becomes unresponsive for >5 seconds.

**Thresholds:**
- **Good:** <0.24%
- **Bad:** >1.09%

**Common causes:**
- Main thread blocking (heavy UI updates, synchronous file I/O)
- Network calls on main thread
- Excessive GC pauses

**FretPilot-specific watchpoints:**
- Lesson generation algorithm blocking UI
- Heatmap recalculation on main thread
- Practice Analyzer chart rendering lag

#### 1.3 Slow Rendering
**Definition:** Percentage of frames taking >16ms to render (below 60fps).

**Thresholds:**
- **Good:** <50% of frames slow
- **Bad:** >70% of frames slow

**FretPilot-specific watchpoints:**
- Jam Companion waveform animation
- Heatmap color interpolation
- Metronome visual pulse

#### 1.4 Excessive Wakeups
**Definition:** Apps waking device excessively (battery drain).

**Threshold:** >10 wakeups per hour

**FretPilot mitigations:**
- Metronome uses AudioTrack (no WakeLock needed)
- Background analytics upload only on Wi-Fi + charging (if consent granted)

---

## 2. Crash Reporting (Firebase Crashlytics – Future Integration)

### Why Firebase Crashlytics?
- Real-time crash alerts
- Detailed stack traces with device metadata
- Crash-free users percentage tracking
- Integration with Firebase Analytics

### Setup Steps (When Implementing)
1. Add Firebase to project (Play Console can auto-provision)
2. Add Crashlytics SDK to `android/app/build.gradle`:
   ```gradle
   dependencies {
     implementation 'com.google.firebase:firebase-crashlytics:18.6.0'
   }
   ```
3. Initialize in `MainActivity.kt`:
   ```kotlin
   import com.google.firebase.crashlytics.FirebaseCrashlytics
   FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(userHasConsentedToAnalytics)
   ```
4. Test crash: `throw RuntimeException("Test Crash")`

### Key Features to Enable
- **Non-fatal exceptions:** Log handled errors that don't crash app
  ```kotlin
  try {
    riskyOperation()
  } catch (e: Exception) {
    FirebaseCrashlytics.getInstance().recordException(e)
  }
  ```
- **Custom keys:** Add context to crashes
  ```kotlin
  FirebaseCrashlytics.getInstance().setCustomKey("lesson_type", "alternate_picking")
  ```
- **User IDs:** Track crashes per user (if analytics consented)
  ```kotlin
  FirebaseCrashlytics.getInstance().setUserId(anonymousUserId)
  ```

---

## 3. Performance Monitoring (Firebase Performance – Future)

### Why Firebase Performance?
- App start time tracking
- Screen rendering time
- Network request latency
- Custom traces for specific operations

### Setup
1. Add Performance SDK:
   ```gradle
   implementation 'com.google.firebase:firebase-perf:20.5.0'
   ```
2. Auto-instrumentation enabled by default (app start, screen transitions)
3. Custom traces:
   ```kotlin
   val trace = FirebasePerformance.getInstance().newTrace("lesson_generation")
   trace.start()
   generateLesson()
   trace.stop()
   ```

### FretPilot-Specific Traces
- `tuner_pitch_detection_latency` (target: <50ms)
- `heatmap_render_time` (target: <200ms)
- `lesson_generation_duration` (target: <1s)
- `practice_analyzer_calculation` (target: <500ms)

---

## 4. User Feedback Collection

### 4.1 In-App Feedback Button (Planned v1.1)
**Implementation:**
- Settings → Send Feedback
- Opens modal with:
  - Feedback type: Bug / Feature Request / Praise
  - Text area (500 char limit)
  - Attach screenshot toggle
  - Auto-include device info + app version

**Backend:**
- Send to support@fretpilotstudio.com via SMTP relay (e.g., SendGrid)
- Or POST to simple Node.js endpoint (Vercel serverless function)

**Example Vercel serverless function (`api/feedback.js`):**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { type, message, deviceInfo, appVersion } = req.body;
  
  // Send email via SendGrid
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  await sgMail.send({
    to: 'support@fretpilotstudio.com',
    from: 'feedback@fretpilotstudio.com',
    subject: `FretPilot Feedback: ${type}`,
    text: `${message}\n\nDevice: ${deviceInfo}\nVersion: ${appVersion}`
  });
  
  res.status(200).json({ success: true });
}
```

### 4.2 Google Play Store Reviews Monitoring
**Manual process (until Firebase In-App Review integration):**
- Daily check: Play Console → Grow → Reviews
- Filter by rating: 1-2 stars (prioritize critical feedback)
- Respond to reviews (best practice: <48h response time)
- Tag reviews by category: Bug / Feature Request / UX / Performance

**Automated alerts (optional):**
- Use Play Console API + Zapier/Integromat to post new reviews to Slack/Discord

### 4.3 Tester Feedback Survey (Internal Test Phase)
**Google Form Template:**
1. Device model (text)
2. Android version (text)
3. Did you encounter crashes? (Yes/No + description)
4. Which feature did you use most? (Multiple choice: AI Lesson, Heatmap, Tuner, etc.)
5. What feature needs improvement? (Text)
6. Rate overall experience (1-5 stars)
7. Would you recommend FretPilot to a friend? (Yes/No/Maybe)

**Distribution:**
- Link in tester invitation email
- In-app prompt after 7 days of usage (v1.1 feature)

---

## 5. Analytics Dashboard (Opt-In Only)

### 5.1 Current State (v1.0.0)
**No analytics SDK integrated yet.** Consent prompt implemented but data collection not active.

### 5.2 Planned Integration (v1.1)
**Firebase Analytics (free tier):**
- Event tracking (feature usage, session duration)
- User properties (skill level, practice frequency)
- Funnels (onboarding → first lesson → progress check)

**Key Events to Track:**
- `app_open`
- `feature_used` (custom parameter: feature_name)
- `lesson_generated` (custom parameter: lesson_type)
- `practice_session_completed` (custom parameters: duration, accuracy)
- `consent_granted` / `consent_revoked`
- `tuner_calibrated` (custom parameter: reference_pitch)
- `heatmap_viewed`

**User Properties:**
- `practice_streak_days` (updated weekly)
- `skill_level` (beginner/intermediate/advanced – inferred from performance)
- `preferred_feature` (most-used feature)

### 5.3 Privacy-First Implementation
```kotlin
// Initialize only if consent granted
val analytics = if (userHasConsented) {
  FirebaseAnalytics.getInstance(this)
} else {
  null // No-op
}

// Log event
analytics?.logEvent("lesson_generated") {
  param("lesson_type", "alternate_picking")
  param("difficulty", "intermediate")
}
```

### 5.4 Dashboard Visualization
**Firebase Console:**
- Navigate to: Firebase Console → Analytics → Dashboard
- Key reports:
  - **Events:** Top events by count
  - **User engagement:** Average session duration
  - **Retention:** Day 1, Day 7, Day 30 retention rates
  - **Funnels:** Onboarding completion rate

**Custom Looker Studio Dashboard (Advanced):**
- Export Firebase Analytics data to BigQuery (free tier: 10GB/month)
- Create Looker Studio (formerly Data Studio) dashboard:
  - Active users (DAU, MAU)
  - Feature adoption rates (% users engaging with each feature)
  - Practice session trends (avg duration, frequency)
  - Crash-free users percentage

---

## 6. Monitoring Checklist (Weekly)

### Week 1 (Post-Launch)
- [ ] Check Android Vitals crash rate daily
- [ ] Monitor Play Console pre-launch report for any missed issues
- [ ] Review first 10 user reviews
- [ ] Check Firebase Crashlytics for top crash clusters (if integrated)
- [ ] Verify analytics consent prompt triggered for test users

### Week 2-4 (Internal Test)
- [ ] Android Vitals: Crash rate, ANR rate trends
- [ ] Feedback survey responses from testers
- [ ] Identify top 3 reported bugs
- [ ] Measure average session duration (if analytics active)
- [ ] Track tester retention (% returning after 7 days)

### Monthly (Post-Public Launch)
- [ ] Review 1-star reviews → categorize issues
- [ ] Compare Android Vitals to previous month
- [ ] Analyze feature usage distribution (most/least used)
- [ ] Calculate NPS (Net Promoter Score) from surveys
- [ ] Prioritize roadmap based on feedback + usage data

---

## 7. Alert Thresholds & Escalation

### Critical Alerts (Immediate Action)
- Crash rate >5% (app unusable for significant users)
- ANR rate >3%
- Single crash cluster affecting >10% of users
- 5+ reviews mentioning same bug within 24h

**Action:** Hotfix release within 48h if possible.

### High Priority Alerts (Within 7 Days)
- Crash rate >2%
- ANR rate >1%
- Consistent 1-2 star reviews citing specific issue
- Feature adoption <20% (indicates discoverability problem)

**Action:** Plan fix for next minor release (v1.0.1, v1.0.2).

### Medium Priority (Next Major Release)
- Slow rendering >60% of frames
- Feature requests mentioned by >5 users
- Retention drop (e.g., Day 7 retention falls below 30%)

**Action:** Roadmap consideration for v1.1 or v1.2.

---

## 8. Dashboard Access & Roles

**Play Console:**
- Owner: [Your Google account]
- Admin access: [Add team members as needed]
- View-only access: [Marketing, QA testers – no release permissions]

**Firebase Console (Future):**
- Owner: Same Google account as Play Console
- Editor: Developers (can view data + modify SDK settings)
- Viewer: QA, product managers (read-only)

**Looker Studio (Future):**
- Share dashboard with: Product team, support team (read-only)

---

## 9. Tools & Resources

**Monitoring:**
- Play Console: https://play.google.com/console
- Firebase Console: https://console.firebase.google.com
- Looker Studio: https://lookerstudio.google.com

**Feedback Collection:**
- Google Forms: https://docs.google.com/forms
- SendGrid (SMTP relay): https://sendgrid.com (free tier: 100 emails/day)
- Vercel Serverless Functions: https://vercel.com/docs/functions

**Alert Automation:**
- Zapier: Connect Play Console API to Slack
- PagerDuty: Escalate critical crashes to on-call developer
- IFTTT: Simple alerts (e.g., new review → email notification)

**Analytics Visualization:**
- Firebase Analytics: Built-in dashboards
- Looker Studio: Custom dashboards (free)
- Amplitude/Mixpanel: Advanced product analytics (paid, overkill for v1.0)

---

## 10. Future Enhancements (v2.0+)

- **AI-Powered Feedback Analysis:** Classify reviews by sentiment + category using OpenAI API
- **Automated Regression Testing:** CI/CD pipeline runs UI tests before each release
- **Real-Time Alerts:** Slack bot posts critical crash clusters within 5 minutes of detection
- **User Journey Mapping:** Sankey diagrams showing navigation flows (Firebase + BigQuery)
- **A/B Testing:** Test UI variations (e.g., heatmap color schemes) with Firebase Remote Config

---

**Status:** Monitoring framework defined. Ready to implement Firebase integrations in v1.1 ✅
