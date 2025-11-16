# 🎨 FretPilot Logo System

## Overview
FretPilot Studio & School features a complete custom logo system with unique animated icons for each feature.

## 📁 Logo Files

### Main Logo
**Location:** `src/assets/logos/MainLogo.vue`

**Features:**
- Animated fretboard with guitar strings and frets
- Electric blue to purple gradient
- Gold accent dots and play button
- Hover effects (scale + rotate)
- Props:
  - `size` (default: 120) - Logo dimensions
  - `compact` (default: false) - Shows "FP" text when true

**Usage:**
```vue
<MainLogo :size="40" :compact="true" />
```

### Feature Icons
**Location:** `src/assets/logos/FeatureIcons.vue`

**Available Icons:**
1. **multiplayer** - Connected people with musical notes (Purple/Pink gradient)
2. **chord** - Fretboard chord diagram (Ocean Blue gradient)
3. **ai** - AI brain with circuit paths and graduation cap (Neon Green gradient)
4. **practice** - Rising bar chart with target arrow (Orange/Red gradient)
5. **metronome** - Pendulum metronome with sound waves (Yellow/Gold gradient)
6. **jam** - Headphones with audio waveform (Cyan/Teal gradient)
7. **heatmap** - Fretboard with heat spots and thermometer (Red/Purple gradient)

**Props:**
- `icon` (required) - Icon name from list above
- `size` (default: 64) - Icon dimensions

**Usage:**
```vue
<FeatureIcons icon="multiplayer" :size="48" />
```

## 🎯 Integration Points

### Header Navigation
The main logo appears in the app header alongside the branding:
```vue
<MainLogo :size="40" :compact="true" />
<span>FretPilot Studio & School</span>
```

Feature icons appear in navigation buttons:
```vue
<button>
  <FeatureIcons icon="ai" :size="18" /> AI Lessons
</button>
```

### Component Headers
Each feature component displays its icon prominently:
```vue
<div style="display: flex; align-items: center; gap: 12px;">
  <FeatureIcons icon="practice" :size="48" />
  <h2>Practice Analyzer</h2>
</div>
```

## 🎨 Design System

### Color Gradients
- **Main Brand:** `#00d4ff` → `#0066ff` → `#6600ff`
- **Multiplayer:** `#ff00ff` → `#8b00ff` (Electric Purple/Pink)
- **Chord Library:** `#00d4ff` → `#0066ff` (Ocean Blue)
- **AI Lessons:** `#00ff88` → `#00cc66` (Neon Green)
- **Practice Analyzer:** `#ff6600` → `#ff3300` (Orange/Red)
- **Metronome:** `#ffd700` → `#ff8c00` (Yellow/Gold)
- **Jam Companion:** `#00ffff` → `#00ccaa` (Cyan/Teal)
- **Mistake Heatmap:** `#ff0066` → `#cc00ff` (Red/Purple)

### Effects
- **Glow:** Gaussian blur with merge for luminous effect
- **Shadow:** Drop shadow with 4px offset
- **Hover:** Scale 1.1 + rotation + brightness increase

## 📱 App Icons (Native Platforms)

### Icon Generator
**File:** `icon-generator.html`

Open this file in a browser to generate all required app icon sizes:

**Sizes Generated:**
- **Android:** ldpi (36), mdpi (48), hdpi (72), xhdpi (96), xxhdpi (144), xxxhdpi (192)
- **iOS:** 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt (with @2x and @3x variants)
- **Web:** Favicon (32), Icon (192), Large (512)

**Features:**
- Live preview of all sizes
- Individual or batch download
- High-quality canvas rendering
- Gradient backgrounds with fretboard design

**Usage:**
1. Open `icon-generator.html` in a browser
2. Icons generate automatically
3. Click "Download All as ZIP" or download individually
4. Place icons in appropriate platform folders:
   - Android: `android/app/src/main/res/mipmap-*/`
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appasset/`

## 🚀 Implementation Guide

### Adding to New Components

1. Import the FeatureIcons component:
```vue
import FeatureIcons from '../assets/logos/FeatureIcons.vue'
```

2. Add icon to your template:
```vue
<div class="header">
  <FeatureIcons icon="yourfeature" :size="48" />
  <h2>Your Feature Name</h2>
</div>
```

3. Add styling:
```vue
<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}
h2 {
  margin: 0;
}
</style>
```

### Creating New Feature Icons

1. Open `src/assets/logos/FeatureIcons.vue`
2. Add gradient definition in `<defs>`:
```xml
<linearGradient id="yourfeatureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#yourcolor1;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#yourcolor2;stop-opacity:1" />
</linearGradient>
```

3. Add icon group:
```xml
<g v-if="icon === 'yourfeature'" transform="translate(32, 32)">
  <!-- Background circle -->
  <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
  
  <!-- Your icon graphics here -->
  <!-- Use paths, circles, rects, lines, etc. -->
</g>
```

4. Update validator in props:
```javascript
validator: (value) => [
  'multiplayer', 'chord', 'ai', 'practice', 
  'metronome', 'jam', 'heatmap', 'yourfeature'  // Add yours
].includes(value)
```

5. Add to gradient mapping:
```javascript
const gradients = {
  // ... existing
  yourfeature: 'url(#yourfeatureGrad)'
}
```

## 🎯 Best Practices

1. **Consistency:** Use the feature icon consistently across navigation, headers, and documentation
2. **Size:** Use 18px for nav buttons, 48-56px for headers, 36px for inline elements
3. **Colors:** Maintain gradient consistency with the design system
4. **Accessibility:** Ensure icons have proper aria-labels and alt text
5. **Performance:** SVGs are optimized for small file size and fast rendering

## 📊 Logo Specifications

### Main Logo
- **Base Size:** 120x120px
- **Viewbox:** 0 0 200 200
- **Format:** Vue Component (SVG)
- **Animation:** CSS hover transforms
- **File Size:** ~2KB

### Feature Icons
- **Base Size:** 64x64px
- **Viewbox:** 0 0 64 64
- **Format:** Vue Component (SVG)
- **Count:** 7 unique icons
- **Total Size:** ~8KB

### App Icons (Generated)
- **Format:** PNG (Canvas-rendered)
- **Sizes:** 21 variants (29px - 1024px)
- **Quality:** High DPI (no aliasing)
- **Background:** Full gradient with fretboard

## 🔧 Maintenance

### Updating Logo Colors
Edit gradients in `MainLogo.vue` and `FeatureIcons.vue`:
```javascript
<linearGradient id="mainGradient">
  <stop offset="0%" style="stop-color:#NEWCOLOR1" />
  <stop offset="100%" style="stop-color:#NEWCOLOR2" />
</linearGradient>
```

### Regenerating App Icons
If you update the main logo design:
1. Edit the `drawIcon()` function in `icon-generator.html`
2. Open in browser and regenerate all sizes
3. Replace icons in Android/iOS platform folders
4. Rebuild native apps

## 📄 License
All logos and icons are proprietary to FretPilot Studio & School © 2025.

---

**Created:** November 2025  
**Version:** 1.0  
**Designer:** GitHub Copilot AI  
**Implementation:** Vue 3 + SVG
