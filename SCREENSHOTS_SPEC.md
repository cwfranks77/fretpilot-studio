# FretPilot Studio Screenshots Specification

## Google Play Store Requirements

### Screenshots Needed
- **Minimum**: 2 screenshots
- **Recommended**: 4-8 screenshots
- **Format**: PNG or JPEG
- **Dimensions**: 
  - **Phone**: 1080x1920px to 1080x2340px (16:9 to 19.5:9 aspect ratio)
  - **Tablet (optional)**: 1536x2048px to 2048x2732px

### Content Guidelines
- Show actual app interface
- Highlight key features
- Add text overlays for context
- Keep text readable
- Show value proposition clearly

## Recommended Screenshot Sequence

### Screenshot 1: Home Screen / Welcome
**Scene**: Main dashboard with navigation
**Text Overlay**: "AI-Powered Guitar Learning Platform"
**What to show**:
- Navigation menu with all features
- Premium badge (if logged in)
- Modern dark theme UI
- FretPilot branding

### Screenshot 2: AI Lesson Generator
**Scene**: AI lesson generation interface
**Text Overlay**: "Personalized Lessons Created by AI"
**What to show**:
- Lesson input form
- AI-generated lesson preview
- Modern chat-like interface
- Example generated content

### Screenshot 3: FretPilot Trainer
**Scene**: Interactive fretboard trainer
**Text Overlay**: "Master the Fretboard with Interactive Practice"
**What to show**:
- Virtual fretboard display
- Note/chord highlighting
- Practice mode UI
- Score or progress indicator

### Screenshot 4: Video Lessons
**Scene**: Video lesson platform
**Text Overlay**: "Expert Video Lessons with Progress Tracking"
**What to show**:
- Video player interface
- Lesson library/catalog
- Progress indicators
- Skill level tags

### Screenshot 5: Practice Analyzer
**Scene**: Practice statistics dashboard
**Text Overlay**: "Track Your Progress with Detailed Analytics"
**What to show**:
- Practice time charts
- Skill improvement graphs
- Mistake heatmap visualization
- Achievement badges

### Screenshot 6: Jam Companion
**Scene**: Live jam session interface
**Text Overlay**: "Jam Along with AI-Generated Backing Tracks"
**What to show**:
- Chord progression display
- BPM/tempo controls
- Key selector
- Play/pause controls

### Screenshot 7: Pricing/Premium
**Scene**: Premium subscription tiers
**Text Overlay**: "Unlock Premium Features"
**What to show**:
- Subscription plans (Monthly/Yearly/Pro)
- Feature comparison
- Pricing clearly displayed
- "Subscribe Now" CTA

### Screenshot 8: Music Store (Optional)
**Scene**: Integrated music gear store
**Text Overlay**: "Shop Premium Gear & Accessories"
**What to show**:
- Product catalog
- Guitar/accessories
- Shopping cart
- TheFranksStandard branding

## Screenshot Creation Process

### Method 1: Actual App Screenshots
1. **Run app**: `npm run dev`
2. **Open in browser**: http://localhost:5173
3. **Login**: Use test account
4. **Navigate**: To each feature screen
5. **Screenshot**: Use browser DevTools device toolbar
   - Press F12 → Click device icon
   - Select "Pixel 5" (1080x2340px)
   - Take screenshots with Windows Snipping Tool or Ctrl+Shift+S

### Method 2: Enhanced Screenshots with Text Overlays
1. Take base screenshots (Method 1)
2. Open in design tool:
   - **Figma** (free, web-based)
   - **Canva** (easy templates)
   - **Photoshop** (professional)
3. Add text overlays:
   - Position: Top or bottom
   - Font: Bold, sans-serif (Roboto, Inter, Montserrat)
   - Color: White with dark shadow or gradient background
   - Size: 60-80px for readability
4. Add subtle gradients or highlights to important UI elements
5. Export at correct dimensions (1080x1920px or 1080x2340px)

### Method 3: Mockup Tool
Use **Previewed.app**, **Mockuphone.com**, or **Smartmockups** to:
- Upload screenshots
- Place in realistic phone frame
- Add backgrounds
- Export professional mockups

## Design Tips

### Visual Polish
- **Consistency**: Same device frame for all screenshots
- **Lighting**: Ensure UI is bright and visible
- **Contrast**: Dark text on light overlays, light text on dark overlays
- **Branding**: Keep color scheme consistent with app (blue gradient)

### Text Overlay Best Practices
```
┌────────────────────────────────┐
│  "AI-Powered Guitar Learning"  │ ← Short, impactful headline
│  ────────────────────────────  │
│                                │
│     [App Screenshot]           │ ← Clean screenshot
│                                │
│                                │
│                                │
└────────────────────────────────┘
```

### Avoid
- ❌ Cluttered screenshots with too much text
- ❌ Low resolution or blurry images
- ❌ Screenshots with personal info visible
- ❌ Inconsistent styling across screenshots
- ❌ Text that's too small to read

### Do
- ✅ Show actual features users will use
- ✅ Highlight unique selling points
- ✅ Use real content (not Lorem ipsum)
- ✅ Show premium features (with upgrade prompts)
- ✅ Display clear call-to-action

## Quick Capture Script

### PowerShell Script to Open App Screens
```powershell
# Save as capture-screenshots.ps1
# Run app first: npm run dev

# Wait for app to load
Start-Sleep -Seconds 3

# Open browser to each route
$routes = @(
    "http://localhost:5173",           # Home
    "http://localhost:5173/?view=ai",  # AI Lessons
    "http://localhost:5173/?view=trainer",  # Trainer
    "http://localhost:5173/?view=videolessons",  # Videos
    "http://localhost:5173/?view=practice",  # Practice
    "http://localhost:5173/?view=jam",  # Jam
    "http://localhost:5173/?view=pricing"  # Pricing
)

foreach ($route in $routes) {
    Start-Process "chrome" $route
    Start-Sleep -Seconds 2
}
```

## Screenshot Checklist
- [ ] Screenshot 1: Home/Dashboard
- [ ] Screenshot 2: AI Lesson Generator
- [ ] Screenshot 3: FretPilot Trainer
- [ ] Screenshot 4: Video Lessons
- [ ] Screenshot 5: Practice Analytics
- [ ] Screenshot 6: Jam Companion
- [ ] Screenshot 7: Pricing/Premium
- [ ] Screenshot 8: Music Store (optional)
- [ ] All images are 1080x1920px or 1080x2340px
- [ ] All images are PNG or JPEG format
- [ ] All images are under 8MB each
- [ ] Text overlays are readable
- [ ] No personal information visible
- [ ] Consistent styling across all screenshots
- [ ] Shows key features clearly

## Feature Highlight Text Suggestions

### Screenshot Text Overlays
```
1. "Master Guitar with AI-Powered Lessons"
2. "Personalized Learning Just for You"
3. "Interactive Fretboard Training"
4. "Expert Video Lessons Library"
5. "Track Your Progress & Improvement"
6. "Jam with AI-Generated Backing Tracks"
7. "Premium Features for Serious Players"
8. "Shop Premium Gear & Accessories"
```

## Google Play Store Listing Copy

### Short Description (80 chars max)
"AI-powered guitar learning: personalized lessons, interactive training & more!"

### Full Description (4000 chars max)
```
🎸 FretPilot Studio - Your Complete AI Guitar Learning Platform

Master guitar faster with AI-powered personalized lessons, interactive training tools, and comprehensive progress tracking. Whether you're a beginner or advanced player, FretPilot Studio adapts to your skill level.

✨ KEY FEATURES

🤖 AI Lesson Generator
• Get personalized lessons created by AI
• Tailored to your skill level and goals
• Learn music theory, techniques, and songs
• Unlimited lesson generation (Premium)

🎯 FretPilot Trainer
• Interactive fretboard visualization
• Practice notes, scales, and chords
• Real-time feedback on accuracy
• Gamified learning experience

📚 Video Lesson Library
• Professional instructor-led lessons
• Beginner to advanced skill levels
• Download for offline practice
• New lessons added regularly

📊 Practice Analyzer
• Track your daily practice time
• View improvement over time
• Identify weak areas with mistake heatmap
• Set and achieve goals

🎵 Jam Companion
• AI-generated backing tracks
• Practice with realistic band sound
• Adjust tempo and key
• Loop sections for focused practice

🎼 Chord Library & Tools
• Comprehensive chord dictionary
• Metronome & tuner built-in
• Scale explorer
• Rhythm trainer

🛒 Music Store Integration
• Shop premium guitars and accessories
• Curated gear recommendations
• Secure checkout with Stripe
• Fast shipping

💎 PREMIUM FEATURES
• Unlimited AI lesson generation
• Advanced analytics and insights
• Offline video downloads
• Priority support
• Ad-free experience

Starting at just $9.99/month or $99.99/year

📱 PERFECT FOR
• Beginners starting their guitar journey
• Intermediate players improving skills
• Advanced players refining technique
• Music teachers needing teaching resources
• Anyone passionate about guitar

🔒 SECURE & PRIVATE
• End-to-end encryption for your data
• Multiple authentication options
• GDPR compliant
• Your privacy is our priority

Download FretPilot Studio today and transform your guitar playing!

Support: cwfranks77@gmail.com
Website: fretpilotstudio.com
```

## Next Steps
1. Launch app: `npm run dev`
2. Navigate to each screen
3. Take screenshots at 1080x1920px resolution
4. Add text overlays in design tool
5. Export final images
6. Upload to Google Play Console
