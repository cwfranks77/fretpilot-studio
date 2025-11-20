# Asset Preparation Guide – Google Play Console

## Required Assets for Internal Testing

### 1. App Icon (512x512 PNG)
**Purpose:** High-resolution icon displayed in Play Store listing and Play Console.

**Specifications:**
- **Dimensions:** 512x512 pixels
- **Format:** 32-bit PNG (with alpha/transparency support)
- **Design guidelines:**
  - Full-bleed (no internal padding or safe zone)
  - No transparency (solid background recommended for visibility)
  - Recognizable at small sizes (48x48 phone icon derived from this)
  - Avoid fine text (icon should communicate visually)

**Design tips for FretPilot:**
- Fretboard graphic with stylized "FP" monogram
- Guitar headstock silhouette with waveform overlay
- Circular badge design with tuning peg iconography
- Color palette: Blues/teals (precision, clarity) + accent orange/yellow (warmth, creativity)

**Export from design tool:**
- Figma: File → Export → PNG @ 2x → 512x512
- Photoshop: File → Export → Export As → PNG, 512x512, no transparency
- Canva: Download → PNG → Custom size 512x512

**Filename:** `app_icon_512.png`  
**Path:** Save to `c:\Users\ninja\Fretquest\release\assets\app_icon_512.png`

---

### 2. Feature Graphic (1024x500 JPEG/PNG)
**Purpose:** Banner displayed at top of Play Store listing (optional for internal testing but recommended).

**Specifications:**
- **Dimensions:** 1024x500 pixels
- **Format:** JPEG or 24-bit PNG
- **Design guidelines:**
  - Avoid placing critical text/logo near edges (safe zone: 924x420)
  - Should complement icon design (consistent color palette)
  - Can include app name/tagline

**Design tips for FretPilot:**
- Fretboard panorama with heatmap overlay gradient
- Stylized waveform with "Refine. Evolve. Own Your Craft." tagline
- Split-screen: left side = traditional tuner, right side = AI lesson interface
- Guitar neck close-up with floating metronome/progress icons

**Filename:** `feature_graphic_1024x500.png`  
**Path:** Save to `c:\Users\ninja\Fretquest\release\assets\feature_graphic_1024x500.png`

---

### 3. Screenshots (Minimum 2, Recommended 5-8)
**Purpose:** Showcase key features in Play Store listing.

**Specifications:**
- **Minimum dimensions:** 320px shortest side
- **Maximum dimensions:** 3840px longest side
- **Aspect ratio:** 16:9 (1920x1080), 9:16 (1080x1920), or device-native (e.g., 1440x3120 for modern phones)
- **Format:** JPEG or 24-bit PNG
- **Quantity:** 2 minimum, 8 maximum per form factor (phone, tablet, TV, Wear OS)

**Recommended screenshots for FretPilot v1.0.0:**

#### Screenshot 1: AI Lesson Generator
- **Feature:** Adaptive practice sequences
- **Callout text (overlay):** "AI-Curated Lessons Tailored to Your Mistakes"
- **Visual:** AI Lesson Generator screen showing generated drill list (e.g., "Alternate Picking", "String Skipping")
- **Filename:** `screenshot_01_ai_lessons.png`

#### Screenshot 2: Mistake Heatmap
- **Feature:** Fretboard error density visualization
- **Callout text:** "Precision Mistake Mapping – See Exactly Where You Struggle"
- **Visual:** Mistake Heatmap with color-coded frets (red = high error, green = clean)
- **Filename:** `screenshot_02_heatmap.png`

#### Screenshot 3: Jam Companion
- **Feature:** Adaptive backing tracks
- **Callout text:** "Jam Along with Tempo-Responsive Tracks"
- **Visual:** Jam Companion interface with tempo slider, genre selector, adaptive slowdown indicator
- **Filename:** `screenshot_03_jam_companion.png`

#### Screenshot 4: Metronome + Tuner
- **Feature:** Unified timing and pitch tools
- **Callout text:** "Integrated Tuner & Metronome – One Tap Away"
- **Visual:** Metronome/Tuner screen with BPM control and pitch visualization
- **Filename:** `screenshot_04_tuner_metronome.png`

#### Screenshot 5: Practice Analyzer
- **Feature:** Performance metrics dashboard
- **Callout text:** "Track Mastery Velocity and Consistency Over Time"
- **Visual:** Practice Analyzer showing charts (timing accuracy, streak continuity)
- **Filename:** `screenshot_05_practice_analyzer.png`

#### Screenshot 6: Chord Library
- **Feature:** Structured chord explorer
- **Callout text:** "Explore 500+ Chords with Inversions & Fingerings"
- **Visual:** Chord Library grid with chord diagrams
- **Filename:** `screenshot_06_chord_library.png`

#### Screenshot 7: Progress Dashboard
- **Feature:** Streak tracking, mastery progress
- **Callout text:** "Celebrate Your Progress – Streaks, Milestones, Mastery"
- **Visual:** Progress screen with streak counter, completion percentage
- **Filename:** `screenshot_07_progress.png`

#### Screenshot 8: Settings / Consent (Optional)
- **Feature:** Privacy-first consent prompt
- **Callout text:** "Your Privacy, Your Control – Analytics Opt-In Only"
- **Visual:** Settings → Privacy screen with consent toggle
- **Filename:** `screenshot_08_consent.png`

**Design tips:**
- **Add overlays:** Use Figma/Photoshop to add text callouts with semi-transparent backgrounds for readability.
- **Use device frames:** Tools like Mockup Studio, Previewed, or Figma plugins (Device Mockups) add professional device bezels.
- **Show actual app screens:** Avoid mockups that don't match the real app.
- **Localize if needed:** For multi-language launches, prepare screenshot sets per language.

**Export process:**
1. Open app on Android device/emulator
2. Navigate to target screen
3. Press Power + Volume Down (screenshot on Android)
4. Transfer to PC: `adb pull /sdcard/Pictures/Screenshots`
5. Add overlays in design tool
6. Export as PNG (1080x1920 or device-native resolution)

**Path:** Save all screenshots to `c:\Users\ninja\Fretquest\release\assets\screenshots\`

---

### 4. Promotional Video (Optional)
**Purpose:** 30-second to 2-minute video showcasing app in action.

**Specifications:**
- **Duration:** 30 seconds to 2 minutes
- **Format:** MOV, MP4, or AVI
- **Resolution:** 1920x1080 or higher
- **Aspect ratio:** 16:9 or 9:16 (vertical video)

**Content ideas:**
- Screen recording with voiceover explaining features
- Split-screen: user playing guitar + app interface reacting
- Time-lapse of heatmap evolving over practice session
- Testimonial clips (future testers)

**Tools:**
- Screen recording: Android Studio Emulator screen record, scrcpy, ADB (`adb shell screenrecord`)
- Editing: DaVinci Resolve (free), CapCut, Adobe Premiere
- Voiceover: Audacity, Adobe Audition

**Filename:** `promo_video_30s.mp4`  
**Path:** Save to `c:\Users\ninja\Fretquest\release\assets\promo_video_30s.mp4`

**Note:** Internal testing doesn't require video, but it's valuable for open testing and production.

---

## Asset Upload Checklist

- [ ] App icon 512x512 PNG prepared
- [ ] Feature graphic 1024x500 PNG/JPEG prepared
- [ ] Minimum 2 screenshots (5-8 recommended) prepared
- [ ] Screenshots include device frames + callout text
- [ ] All assets saved to `release\assets\` directory
- [ ] Assets reviewed on multiple screen sizes (phone, tablet)
- [ ] Text overlays readable at thumbnail size
- [ ] Color palette consistent across all assets
- [ ] No copyrighted imagery used without license
- [ ] Assets exported at correct dimensions (no upscaling/distortion)

---

## Asset Upload Process (Play Console)

1. **Navigate to Store Listing:**  
   Play Console → Grow → Store presence → Main store listing

2. **Upload App Icon:**  
   Scroll to **App icon** → Click **Upload** → Select `app_icon_512.png`

3. **Upload Feature Graphic:**  
   Scroll to **Feature graphic** → Click **Upload** → Select `feature_graphic_1024x500.png`

4. **Upload Screenshots:**  
   Scroll to **Screenshots** → **Phone** tab  
   Click **Add images** → Select all 5-8 screenshot files  
   Drag to reorder (first screenshot is primary display)

5. **Upload Promotional Video (Optional):**  
   Scroll to **Video** → Paste YouTube URL (must upload to YouTube first)

6. **Preview Listing:**  
   Click **View on Google Play** (draft preview) to see how assets appear

7. **Save & Continue:**  
   Click **Save** at bottom of page

---

## Design Resources

**Icon Design:**
- Flaticon: https://www.flaticon.com (free icon packs)
- Figma Community: Search "app icon template"
- Canva: App Icon templates (Pro required for export without watermark)

**Screenshot Mockups:**
- Mockup Studio: https://mockup.studio
- Previewed: https://previewed.app
- Figma Plugin: Device Mockups

**Color Palettes for FretPilot:**
- Primary: #1E3A8A (deep blue – precision)
- Secondary: #0EA5E9 (sky blue – clarity)
- Accent: #F59E0B (amber – warmth)
- Background: #F8FAFC (light gray)
- Error: #EF4444 (red – heatmap high density)
- Success: #10B981 (green – heatmap clean zones)

---

## Quality Assurance

Before uploading:
- [ ] View icon at 48x48 (phone home screen size) – still recognizable?
- [ ] View screenshots on 5" phone screen – text readable?
- [ ] Check feature graphic doesn't cut off text on mobile
- [ ] Verify no placeholder text (e.g., "Lorem ipsum") in screenshots
- [ ] Confirm screenshots show latest app version (no outdated UI)
- [ ] Test color contrast (accessibility: WCAG AA 4.5:1 for text)

---

## Future Enhancements (v1.1+)

- Localized screenshots (Spanish, Japanese, German)
- 30-second promo video with user testimonials
- Tablet-optimized screenshots (10" layout)
- TV/Android Auto screenshots (if expanding to those form factors)
- Animated GIFs for key features (usable in app description, not Play Console directly)

---

**Status:** Asset specifications defined. Ready to create/upload ✅
