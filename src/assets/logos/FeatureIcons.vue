<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    xmlns="http://www.w3.org/2000/svg"
    class="feature-icon"
  >
    <defs>
      <!-- Multiplayer gradient - Electric Purple/Pink -->
      <linearGradient id="multiplayerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff00ff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b00ff;stop-opacity:1" />
      </linearGradient>
      
      <!-- Chord Library gradient - Ocean Blue -->
      <linearGradient id="chordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0066ff;stop-opacity:1" />
      </linearGradient>
      
      <!-- AI Lesson gradient - Neon Green -->
      <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00ff88;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#00cc66;stop-opacity:1" />
      </linearGradient>
      
      <!-- Practice Analyzer gradient - Orange/Red -->
      <linearGradient id="practiceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff6600;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff3300;stop-opacity:1" />
      </linearGradient>
      
      <!-- Metronome/Tuner gradient - Yellow/Gold -->
      <linearGradient id="metronomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
      </linearGradient>
      
      <!-- Jam Companion gradient - Cyan/Teal -->
      <linearGradient id="jamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#00ccaa;stop-opacity:1" />
      </linearGradient>
      
      <!-- Heatmap gradient - Red/Purple -->
      <linearGradient id="heatmapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff0066;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#cc00ff;stop-opacity:1" />
      </linearGradient>
      
      <filter id="iconGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- MULTIPLAYER JAM - Connected people jamming -->
    <g v-if="icon === 'multiplayer'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Three people icons connected -->
      <circle cx="-12" cy="-8" r="5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <path d="M -12,-3 L -12,5 M -16,1 L -8,1" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
      
      <circle cx="12" cy="-8" r="5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <path d="M 12,-3 L 12,5 M 8,1 L 16,1" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
      
      <circle cx="0" cy="6" r="5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <path d="M 0,11 L 0,19 M -4,15 L 4,15" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Connection lines -->
      <line x1="-8" y1="-5" x2="8" y2="-5" :stroke="gradientUrl" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>
      <line x1="-8" y1="2" x2="-2" y2="8" :stroke="gradientUrl" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>
      <line x1="8" y1="2" x2="2" y2="8" :stroke="gradientUrl" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>
      
      <!-- Musical notes -->
      <circle cx="18" cy="-15" r="2" :fill="gradientUrl"/>
      <line x1="20" y1="-15" x2="20" y2="-8" :stroke="gradientUrl" stroke-width="1.5"/>
    </g>
    
    <!-- CHORD LIBRARY - Chord diagram -->
    <g v-if="icon === 'chord'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Fretboard grid -->
      <rect x="-15" y="-18" width="30" height="36" rx="3" fill="#2a1810" opacity="0.8"/>
      <!-- Frets -->
      <line x1="-15" y1="-10" x2="15" y2="-10" stroke="#888" stroke-width="1.5"/>
      <line x1="-15" y1="-2" x2="15" y2="-2" stroke="#888" stroke-width="1.5"/>
      <line x1="-15" y1="6" x2="15" y2="6" stroke="#888" stroke-width="1.5"/>
      <line x1="-15" y1="14" x2="15" y2="14" stroke="#888" stroke-width="1.5"/>
      <!-- Strings -->
      <line x1="-10" y1="-18" x2="-10" y2="18" stroke="#ccc" stroke-width="1"/>
      <line x1="-5" y1="-18" x2="-5" y2="18" stroke="#ccc" stroke-width="1"/>
      <line x1="0" y1="-18" x2="0" y2="18" stroke="#ccc" stroke-width="1"/>
      <line x1="5" y1="-18" x2="5" y2="18" stroke="#ccc" stroke-width="1"/>
      <line x1="10" y1="-18" x2="10" y2="18" stroke="#ccc" stroke-width="1"/>
      <!-- Finger positions -->
      <circle cx="-10" cy="-14" r="3" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="0" cy="-6" r="3" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="10" cy="2" r="3" :fill="gradientUrl" filter="url(#iconGlow)"/>
    </g>
    
    <!-- AI LESSON GENERATOR - Brain with circuits -->
    <g v-if="icon === 'ai'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Brain shape -->
      <path d="M -12,-8 Q -18,-8 -18,0 Q -18,8 -12,12 Q -6,14 0,12 Q 6,14 12,12 Q 18,8 18,0 Q 18,-8 12,-8 Q 8,-10 0,-10 Q -8,-10 -12,-8" 
            :fill="gradientUrl" opacity="0.3" stroke="none"/>
      <!-- Circuit paths -->
      <path d="M -8,-4 L -4,-4 L -4,0 L 0,0" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 8,-4 L 4,-4 L 4,0 L 0,0" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M -6,4 L 0,4 L 0,8" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 6,4 L 0,4" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Circuit nodes -->
      <circle cx="-8" cy="-4" r="2.5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="8" cy="-4" r="2.5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="0" cy="0" r="3" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="-6" cy="4" r="2.5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="6" cy="4" r="2.5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <circle cx="0" cy="8" r="2.5" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <!-- Graduation cap -->
      <path d="M -10,-14 L 0,-18 L 10,-14 L 0,-10 Z" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <rect x="-1" y="-10" width="2" height="6" :fill="gradientUrl"/>
    </g>
    
    <!-- PRACTICE ANALYZER - Chart with rising arrow -->
    <g v-if="icon === 'practice'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Bar chart -->
      <rect x="-18" y="8" width="6" height="10" :fill="gradientUrl" opacity="0.6" rx="1"/>
      <rect x="-10" y="2" width="6" height="16" :fill="gradientUrl" opacity="0.7" rx="1"/>
      <rect x="-2" y="-4" width="6" height="22" :fill="gradientUrl" opacity="0.8" rx="1"/>
      <rect x="6" y="-10" width="6" height="28" :fill="gradientUrl" filter="url(#iconGlow)" rx="1"/>
      <!-- Rising arrow -->
      <path d="M -16,6 L 10,-12" :stroke="gradientUrl" stroke-width="3" stroke-linecap="round"/>
      <path d="M 10,-12 L 6,-10 L 8,-6 Z" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <!-- Target circle -->
      <circle cx="10" cy="-12" r="3" :stroke="gradientUrl" stroke-width="2" fill="none" filter="url(#iconGlow)"/>
    </g>
    
    <!-- METRONOME/TUNER - Pendulum + sound waves -->
    <g v-if="icon === 'metronome'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Metronome body (triangle) -->
      <path d="M -12,15 L 0,-15 L 12,15 Z" :fill="gradientUrl" opacity="0.3" stroke="none"/>
      <!-- Pendulum -->
      <line x1="0" y1="-12" x2="8" y2="8" :stroke="gradientUrl" stroke-width="3" stroke-linecap="round" filter="url(#iconGlow)"/>
      <circle cx="8" cy="8" r="4" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <!-- Sound waves -->
      <path d="M -16,-8 Q -14,-6 -16,-4" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M -19,-10 Q -16,-6 -19,-2" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M 16,-8 Q 14,-6 16,-4" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
      <path d="M 19,-10 Q 16,-6 19,-2" :stroke="gradientUrl" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <!-- Tuning fork prongs -->
      <line x1="-4" y1="-18" x2="-4" y2="-10" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="4" y1="-18" x2="4" y2="-10" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="-4" y1="-10" x2="4" y2="-10" :stroke="gradientUrl" stroke-width="2.5" stroke-linecap="round"/>
    </g>
    
    <!-- JAM COMPANION - Headphones + waveform -->
    <g v-if="icon === 'jam'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Headphones -->
      <path d="M -12,-8 Q -12,-18 0,-18 Q 12,-18 12,-8" :stroke="gradientUrl" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#iconGlow)"/>
      <rect x="-16" y="-8" width="8" height="12" rx="2" :fill="gradientUrl" opacity="0.8"/>
      <rect x="8" y="-8" width="8" height="12" rx="2" :fill="gradientUrl" opacity="0.8"/>
      <!-- Audio waveform -->
      <path d="M -10,10 L -8,14 L -6,6 L -4,16 L -2,8 L 0,12 L 2,8 L 4,16 L 6,6 L 8,14 L 10,10" 
            :stroke="gradientUrl" stroke-width="2.5" fill="none" stroke-linecap="round" filter="url(#iconGlow)"/>
      <!-- Play button -->
      <circle cx="0" cy="0" r="6" :fill="gradientUrl" opacity="0.3"/>
      <path d="M -2,-3 L 4,0 L -2,3 Z" :fill="gradientUrl" filter="url(#iconGlow)"/>
    </g>
    
    <!-- MISTAKE HEATMAP - Fretboard with heat zones -->
    <g v-if="icon === 'heatmap'" transform="translate(32, 32)">
      <circle cx="0" cy="0" r="28" :fill="gradientUrl" opacity="0.2"/>
      <!-- Fretboard -->
      <rect x="-18" y="-15" width="36" height="30" rx="3" fill="#2a1810" opacity="0.7"/>
      <!-- Strings -->
      <line x1="-18" y1="-9" x2="18" y2="-9" stroke="#666" stroke-width="1"/>
      <line x1="-18" y1="-3" x2="18" y2="-3" stroke="#666" stroke-width="1"/>
      <line x1="-18" y1="3" x2="18" y2="3" stroke="#666" stroke-width="1"/>
      <line x1="-18" y1="9" x2="18" y2="9" stroke="#666" stroke-width="1"/>
      <!-- Frets -->
      <line x1="-12" y1="-15" x2="-12" y2="15" stroke="#888" stroke-width="1.5"/>
      <line x1="-4" y1="-15" x2="-4" y2="15" stroke="#888" stroke-width="1.5"/>
      <line x1="4" y1="-15" x2="4" y2="15" stroke="#888" stroke-width="1.5"/>
      <line x1="12" y1="-15" x2="12" y2="15" stroke="#888" stroke-width="1.5"/>
      <!-- Heat spots (mistakes) -->
      <circle cx="-8" cy="-6" r="4" fill="#ff0000" opacity="0.7" filter="url(#iconGlow)"/>
      <circle cx="8" cy="0" r="5" fill="#ff6600" opacity="0.6" filter="url(#iconGlow)"/>
      <circle cx="0" cy="6" r="3" fill="#ffaa00" opacity="0.5" filter="url(#iconGlow)"/>
      <!-- Thermometer icon -->
      <rect x="16" y="-12" width="3" height="16" rx="1.5" :fill="gradientUrl" opacity="0.6"/>
      <circle cx="17.5" cy="6" r="4" :fill="gradientUrl" filter="url(#iconGlow)"/>
      <rect x="16.5" y="-10" width="2" height="14" :fill="gradientUrl" filter="url(#iconGlow)"/>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => [
      'multiplayer', 'chord', 'ai', 'practice', 
      'metronome', 'jam', 'heatmap'
    ].includes(value)
  },
  size: {
    type: [Number, String],
    default: 64
  }
})

const viewBox = '0 0 64 64'

const gradientUrl = computed(() => {
  const gradients = {
    multiplayer: 'url(#multiplayerGrad)',
    chord: 'url(#chordGrad)',
    ai: 'url(#aiGrad)',
    practice: 'url(#practiceGrad)',
    metronome: 'url(#metronomeGrad)',
    jam: 'url(#jamGrad)',
    heatmap: 'url(#heatmapGrad)'
  }
  return gradients[props.icon]
})
</script>

<style scoped>
.feature-icon {
  transition: transform 0.3s ease, filter 0.3s ease;
}

.feature-icon:hover {
  transform: scale(1.1) rotate(-5deg);
  filter: brightness(1.2);
}
</style>
