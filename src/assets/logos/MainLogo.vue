<template>
  <svg 
    :width="size" 
    :height="size" 
    viewBox="0 0 200 200" 
    xmlns="http://www.w3.org/2000/svg"
    class="fretpilot-logo"
  >
    <defs>
      <!-- Main gradient - Electric Blue to Purple -->
      <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#0066ff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#6600ff;stop-opacity:1" />
      </linearGradient>
      
      <!-- Gold accent gradient -->
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
      </linearGradient>
      
      <!-- Shadow -->
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
      </filter>
      
      <!-- Glow effect -->
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Background circle -->
    <circle cx="100" cy="100" r="95" fill="url(#mainGradient)" filter="url(#shadow)"/>
    
    <!-- Fretboard design (stylized guitar neck) -->
    <g transform="translate(100, 100)">
      <!-- Neck -->
      <rect x="-50" y="-70" width="100" height="140" rx="8" fill="#2a1810" opacity="0.9"/>
      
      <!-- Frets (horizontal lines) -->
      <line x1="-50" y1="-50" x2="50" y2="-50" stroke="#c0c0c0" stroke-width="2"/>
      <line x1="-50" y1="-20" x2="50" y2="-20" stroke="#c0c0c0" stroke-width="2"/>
      <line x1="-50" y1="10" x2="50" y2="10" stroke="#c0c0c0" stroke-width="2"/>
      <line x1="-50" y1="40" x2="50" y2="40" stroke="#c0c0c0" stroke-width="2"/>
      
      <!-- Strings (vertical lines) -->
      <line x1="-35" y1="-70" x2="-35" y2="70" stroke="#e0e0e0" stroke-width="1.5" opacity="0.7"/>
      <line x1="-20" y1="-70" x2="-20" y2="70" stroke="#e0e0e0" stroke-width="1.5" opacity="0.7"/>
      <line x1="0" y1="-70" x2="0" y2="70" stroke="#e0e0e0" stroke-width="2" opacity="0.8"/>
      <line x1="20" y1="-70" x2="20" y2="70" stroke="#e0e0e0" stroke-width="1.5" opacity="0.7"/>
      <line x1="35" y1="-70" x2="35" y2="70" stroke="#e0e0e0" stroke-width="1.5" opacity="0.7"/>
      
      <!-- Fret markers (dots) -->
      <circle cx="0" cy="-35" r="5" fill="url(#goldGradient)" filter="url(#glow)"/>
      <circle cx="0" cy="25" r="5" fill="url(#goldGradient)" filter="url(#glow)"/>
      
      <!-- Center "play" button / pick -->
      <path 
        d="M -15,-5 L 20,0 L -15,5 Z" 
        fill="url(#goldGradient)" 
        filter="url(#glow)"
        stroke="#fff"
        stroke-width="2"
      />
    </g>
    
    <!-- Text: FP (if compact mode) -->
    <text 
      v-if="compact"
      x="100" 
      y="175" 
      text-anchor="middle" 
      fill="white" 
      font-family="'Arial Black', sans-serif" 
      font-size="24" 
      font-weight="900"
      filter="url(#shadow)"
    >
      FP
    </text>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 120
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.fretpilot-logo {
  transition: transform 0.3s ease;
}

.fretpilot-logo:hover {
  transform: scale(1.05) rotate(2deg);
}
</style>
