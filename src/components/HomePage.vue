<template>
  <div class="home-page">
    <div class="hero">
      <img class="hero-image animate-float" src="/images/guitar-hero.svg" alt="FretPilot hero" />
      <h1 class="hero-title">🎸 FretPilot</h1>
      <p class="hero-tagline">AI-Powered Guitar Mastery Platform</p>
      <p class="hero-subtitle">Train smarter. Play better. Master faster.</p>
    </div>

    <div class="feature-grid">
      <div class="feature-card" @click="$emit('navigate', 'trainer')">
        <div class="feature-icon">🎯</div>
        <h3>Chord Trainer</h3>
        <p>Master chords with interactive training, progress tracking, and achievement certificates</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'ai')">
        <div class="feature-icon">🤖</div>
        <h3>AI Lesson Generator</h3>
        <p>Custom lessons tailored to your skill level, goals, and preferred music style</p>
        <div class="feature-badge" :class="quota > 0 ? 'free' : 'premium'">
          {{ quota > 0 ? `${quota} FREE TODAY` : 'PREMIUM' }}
        </div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'videolessons')">
        <div class="feature-icon">🎬</div>
        <h3>AI Video Lessons</h3>
        <p>Generate custom instructional videos with AI - perfect for visual learners</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'studio')">
        <div class="feature-icon">🎙️</div>
        <h3>Music Studio</h3>
        <p>Multi-track recording, Bluetooth instrument input, effects, and song creation</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'practice')">
        <div class="feature-icon">📊</div>
        <h3>Practice Analyzer</h3>
        <p>Record your practice, get AI feedback on timing, stability, and see mistake heatmaps</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'jam')">
        <div class="feature-icon">🎵</div>
        <h3>Jam Companion</h3>
        <p>Generate chord progressions in any key, tempo, and style for practice or songwriting</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'metronome')">
        <div class="feature-icon">⏱️</div>
        <h3>Metronome & Tuner</h3>
        <p>Built-in metronome with tempo tap, visual beats, and chromatic guitar tuner</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'library')">
        <div class="feature-icon">📚</div>
        <h3>Chord Library</h3>
        <p>Multi-instrument chord library: Guitar, Bass, Ukulele, Piano, and Drums</p>
        <div class="feature-badge free">FREE</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'scales')">
        <div class="feature-icon">🎼</div>
        <h3>Scale Explorer</h3>
        <p>Interactive scale patterns, modes, and positions across the entire fretboard</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>

      <div class="feature-card" @click="$emit('navigate', 'rhythm')">
        <div class="feature-icon">🥁</div>
        <h3>Rhythm Trainer</h3>
        <p>Master strumming patterns with visual guides and timing challenges</p>
        <div class="feature-badge premium">PREMIUM</div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Want Full Access?</h2>
      <p>Unlock all premium features including unlimited AI lessons, practice analysis, and more</p>
      <button @click="$emit('navigate', 'premium')" class="cta-button">
        ⭐ Go Premium - $9.99/month
      </button>
    </div>

    <div class="store-promo">
      <div class="promo-card">
        <div class="promo-left">
          <h2>Shop The Franks Standard</h2>
          <p>Premium guitars, pro audio, and musician gear. Quality is our standard.</p>
          <a class="promo-btn" href="https://thefranksstandard.com" target="_blank" rel="noopener">
            🛒 Visit Store
          </a>
        </div>
        <div class="promo-right">
          <img src="/images/guitar-hero.svg" alt="The Franks Standard" />
        </div>
      </div>
    </div>

    <div class="gallery">
      <img src="/images/practice-tips.svg" alt="Practice tips" />
      <img src="/images/jam-session.svg" alt="Jam session" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isPremium, getDailyLessonRemaining } from '../services/featureFlags'

defineEmits(['navigate'])

const premium = computed(() => isPremium())
const quota = computed(() => getDailyLessonRemaining())
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #000;
  min-height: 100%;
}

.hero {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 30px;
  position: relative;
}

.hero-image { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.22; pointer-events:none; border-radius:12px; transform:scale(1.015) }
.animate-float { animation: floatSlow 8s ease-in-out infinite }
@keyframes floatSlow { 0%{ transform:translateY(0) scale(1.015)} 50%{ transform:translateY(-8px) scale(1.02)} 100%{ transform:translateY(0) scale(1.015)} }

.hero-title {
  font-size: 3.5em;
  margin: 0;
  background: linear-gradient(135deg, #06c167 0%, #4a90e2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.hero-tagline {
  font-size: 1.5em;
  color: #cfd6e6;
  margin: 10px 0;
  font-weight: 600;
}

.hero-subtitle {
  color: #8892a6;
  font-size: 1.1em;
  margin: 5px 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.feature-card {
  background: #0a0a0a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #06c167;
  box-shadow: 0 8px 24px rgba(6, 193, 103, 0.2);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.feature-card h3 {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 1.3em;
}

.feature-card p {
  color: #b7c3d9;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 12px;
}

.feature-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-badge.free {
  background: #2a3142;
  color: #06c167;
  border: 1px solid #06c167;
}

.feature-badge.premium {
  background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
  color: #fff;
  border: none;
}

.cta-section {
  text-align: center;
  padding: 40px 20px;
  background: #0a0a0a;
  border-radius: 12px;
  border: 2px solid #1a1a1a;
  margin-top: 20px;
}

.cta-section h2 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 2em;
}

.cta-section p {
  color: #b7c3d9;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.cta-button {
  background: linear-gradient(135deg, #06c167 0%, #09a557 100%);
  color: #fff;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(6, 193, 103, 0.3);
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(6, 193, 103, 0.5);
}

.gallery { display:grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin:24px 0 }
.gallery img { width:100%; border-radius:12px; border:1px solid #1a1a1a; background:#0a0a0a }

/* Store promo */
.store-promo { margin: 30px 0 10px 0; }
.promo-card {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
  align-items: center;
  background: linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15));
  border: 1px solid rgba(255,255,255,0.08);
  padding: 24px;
  border-radius: 12px;
}
.promo-left h2 { margin: 0 0 8px 0; color: #fff; }
.promo-left p { margin: 0 0 16px 0; color: #cfd6e6 }
.promo-btn {
  display: inline-block;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 0;
}
.promo-right img { width: 100%; opacity: 0.8 }
@media (max-width: 800px) {
  .promo-card { grid-template-columns: 1fr; }
  .promo-right { display: none }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5em;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
