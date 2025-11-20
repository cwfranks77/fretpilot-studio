# Data Safety Form Responses – Google Play Console

## Navigation Path
Play Console → App content → Data safety → Start

---

## Question 1: Does your app collect or share any of the required user data types?
**Answer:** YES

---

## Data Collection Details

### Audio (Section 1)
**Q: Do you collect audio files or recordings from the user?**  
**A:** NO

**Justification:** The app uses `RECORD_AUDIO` permission exclusively for real-time pitch detection in the tuner feature. Audio is processed transiently in memory and immediately discarded. No audio data is ever recorded, stored, or transmitted.

---

### App Activity (Section 2)
**Q: Do you collect app interactions, in-app search history, or other user activity data?**  
**A:** YES (Conditional)

**Data Types:**
- App interactions (feature engagement metrics, session counts)
- Other user-generated content (drill completion, practice session durations)

**Usage:**
- Analytics – OPT-IN ONLY (disabled by default until user grants explicit consent via in-app prompt)

**Collection Details:**
- **Is this data collected?** YES
- **Is this data shared with third parties?** NO
- **Is this data used for app functionality?** NO (analytics only)
- **Is data collection required or optional?** OPTIONAL (consent-based)
- **Can users request deletion?** YES (revoke consent in Settings → Privacy)
- **Is data encrypted in transit?** YES (HTTPS)
- **Does your app provide a way for users to request their data be deleted?** YES (via support@fretpilotstudio.com or in-app Settings → Reset Progress when feature launches in v1.1)

---

### App Info and Performance (Section 3)
**Q: Do you collect crash logs, diagnostics, or performance data?**  
**A:** YES (Conditional)

**Data Types:**
- Crash logs
- Diagnostics
- Other app performance data (frame rates, render times)

**Usage:**
- Analytics – OPT-IN ONLY
- App performance monitoring

**Collection Details:**
- **Is this data collected?** YES (only after consent)
- **Is this data shared with third parties?** NO
- **Is data encrypted in transit?** YES
- **Can users request deletion?** YES

---

### Device or Other IDs (Section 4)
**Q: Do you collect device or other identifiers?**  
**A:** NO

**Justification:** The app does not collect Android ID, IMEI, MAC address, or other hardware identifiers.

---

### Location (Section 5)
**Q: Do you collect user location data?**  
**A:** NO

---

### Personal Info (Section 6)
**Q: Do you collect name, email, address, or other personal info?**  
**A:** NO (unless voluntarily provided for support inquiries)

**Note:** If users email support@fretpilotstudio.com, their email address and message content are retained only for support purposes and not used for marketing or shared with third parties.

---

### Photos and Videos (Section 7)
**Q: Do you collect photos, videos, or other visual media?**  
**A:** NO

---

### Files and Docs (Section 8)
**Q: Do you collect user files or documents?**  
**A:** NO

---

### Calendar (Section 9)
**Q: Do you collect calendar events?**  
**A:** NO

---

### Contacts (Section 10)
**Q: Do you collect user contacts?**  
**A:** NO

---

### Messages (Section 11)
**Q: Do you collect emails, SMS, or other messages?**  
**A:** NO

---

## Question 2: Data Usage & Handling
For each collected data type (App Activity, App Info and Performance):

### Is the data collected, shared, or both?
**Answer:** Collected only (not shared)

### Is data collection required for app functionality?
**Answer:** NO (the app's core features—tuner, metronome, heatmap, chord library—function fully without data collection)

### Why is the data collected?
**Answer:**
- Analytics (opt-in only)
- App functionality improvement (identifying performance bottlenecks)

### Is the data processed ephemerally?
**Answer:** NO (performance metrics stored locally; analytics logs retained for analysis if consented)

### Is the data encrypted in transit?
**Answer:** YES

### Can users request data deletion?
**Answer:** YES (via Settings → Privacy → Reset Progress or by emailing support@fretpilotstudio.com)

---

## Question 3: Privacy Policy
**Q: Does your app have a privacy policy?**  
**A:** YES

**Privacy Policy URL:** https://fretpilotstudio.com/privacy

---

## Question 4: Tracking / Advertising ID
**Q: Does your app use advertising ID for tracking or advertising purposes?**  
**A:** NO

**Justification:** The app does not integrate ad networks or use Google Advertising ID. No tracking pixels or third-party ad SDKs are included.

---

## Question 5: App Set ID
**Q: Does your app use App Set ID?**  
**A:** NO

---

## Question 6: Data Shared with Third Parties
**Q: Do you share data with third parties?**  
**A:** NO

**Justification:** All analytics data is processed internally. No third-party analytics services (e.g., Firebase Analytics, Amplitude) are currently integrated. Future integrations will require updated Data Safety declarations.

---

## Question 7: Safety Section Compliance
**Q: Are you complying with Google Play's User Data policy?**  
**A:** YES

- Prominent consent prompt before analytics activation
- Clear in-app privacy controls (Settings → Privacy)
- No deceptive data practices
- Privacy policy accessible at https://fretpilotstudio.com/privacy

---

## Final Summary for Play Console

### Data Collected:
1. **App Activity** (feature engagement, session counts) – OPT-IN ONLY
2. **App Performance** (crash logs, diagnostics) – OPT-IN ONLY

### Data NOT Collected:
- Audio (transient processing only)
- Location
- Personal info (unless support inquiry)
- Device IDs
- Photos/videos
- Files
- Contacts
- Messages

### User Controls:
- Revocable consent in Settings
- Data deletion via support email
- Local data cleared via Android Settings → Apps → Clear Data (full reset feature planned for v1.1)

### Encryption:
- In transit: YES (HTTPS)
- At rest: Device-level (Android default)

### Privacy Policy:
- https://fretpilotstudio.com/privacy

---

## Notes for Reviewers
- **Microphone permission** is used exclusively for tuner functionality; no audio is stored or transmitted.
- **Analytics disabled by default** – requires explicit user opt-in via consent prompt.
- **Local-first architecture** – performance metrics (timing accuracy, heatmap density) stored on device; no cloud sync yet.
- **No advertising** – app is free with planned premium features (not ad-supported).

---

## Review Checklist
- [ ] Privacy policy accessible and compliant
- [ ] Consent prompt implemented before analytics activation
- [ ] Data Safety form completed accurately
- [ ] No misleading claims about data usage
- [ ] User deletion pathway documented (support email + future in-app reset)

---

**Status:** Ready for submission ✅
