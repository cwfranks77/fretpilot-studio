# Google Play Console - App Content Completion Checklist

Navigate to: **Grow users > App content**

All sections must be completed before Store Listing can save successfully.

## Required Sections

### 1. ✓ Advertising ID (IN PROGRESS - from screenshot)
- [x] Question displayed
- [ ] Select "Yes" (AdMob SDK present)
- [ ] Save

### 2. Privacy Policy
- [ ] Provide HTTPS URL to your privacy policy
- [ ] URL must return HTTP 200 (working link)
- Policy must describe data collection (advertising ID, analytics, crash reports)

Minimal compliant policy must include:
- What data collected: Advertising ID, app usage analytics, crash logs
- Why: Serve relevant ads, improve app performance
- Third parties: Google AdMob, Firebase (if used)
- User rights: Contact to request data deletion
- Contact email

### 3. Data Safety
- [ ] Complete questionnaire about data collection
- [ ] Declare collection: Device or other IDs (for ads)
- [ ] Declare purpose: Advertising
- [ ] Declare sharing: Yes (with ad networks)
- [ ] Security: Data encrypted in transit
- [ ] Submit form

### 4. Content Ratings
- [ ] Complete IARC questionnaire
- [ ] Declare content type: Music education app
- [ ] Violence: None
- [ ] Sexual content: None
- [ ] Language: None
- [ ] Substance use: None
- [ ] Submit for rating

### 5. Target Audience and Content
- [ ] Select target age groups (e.g., Ages 13+, All ages)
- [ ] Declare if app appeals to children: No (or Yes if intended for kids)
- [ ] Save

### 6. News Apps Declaration (if applicable)
- [ ] Only required if app delivers news content
- [ ] FretPilot Studio: Select "No" or skip

### 7. COVID-19 Contact Tracing and Status Apps
- [ ] Only required if app does contact tracing
- [ ] FretPilot Studio: Select "No" or skip

### 8. Data Collection and Security (Duplicate of Data Safety)
- [ ] Ensure consistency with Data Safety answers

### 9. Government Apps
- [ ] Only required if official government app
- [ ] FretPilot Studio: Skip

### 10. Financial Features
- [ ] Only required if app handles financial transactions
- [ ] FretPilot Studio: If premium purchases via Stripe, may need declaration

## Verification

After completing all sections:
1. Return to Publishing overview
2. All cards should show green checkmarks
3. Return to Store presence > Store listings
4. Try saving again
5. "Language error" banner should disappear

## Common Blocker Sequence

1. Incomplete Advertising ID → blocks save
2. Missing Privacy Policy → blocks save
3. Incomplete Data Safety → blocks save
4. Missing Content Rating → blocks production release (not draft save)

## Privacy Policy Quick Template

If you don't have one yet, create a simple HTML page:

**Privacy Policy for FretPilot Studio**

Last Updated: November 23, 2025

**Data Collection**
FretPilot Studio collects:
- Advertising ID (for personalized ads via Google AdMob)
- App usage analytics (anonymous performance metrics)
- Crash reports (anonymous error diagnostics)

**Purpose**
We use collected data to:
- Serve relevant advertisements
- Improve app performance and stability
- Understand feature usage

**Third-Party Services**
We share data with:
- Google AdMob (advertising)
- Firebase Crashlytics (crash reporting)
- Google Analytics (usage metrics)

**User Rights**
You can request data deletion by contacting: support@yourcompany.com

**Security**
Data transmitted is encrypted. We do not collect personally identifiable information.

**Contact**
Email: support@yourcompany.com

---

Host this on your domain (e.g., fretpilotstudio.com/privacy) or use GitHub Pages.

## Next Actions

1. Answer "Yes" to Advertising ID (screenshot page)
2. Navigate to Data safety, complete form
3. Add Privacy Policy URL
4. Complete Content ratings
5. Set Target audience
6. Return to Store listings → should save successfully
