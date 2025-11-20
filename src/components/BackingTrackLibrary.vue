<template>
  <div class="backing-track-library">
    <div class="library-header">
      <h2>🎵 Unlimited Backing Track Library</h2>
      <p class="subtitle">Play along with any song - Choose your instrument, we handle the rest</p>
    </div>

    <!-- Search & Filter -->
    <div class="search-section">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @input="debouncedSearch"
          placeholder="Search for any song, artist, or genre..."
          class="search-input"
        />
        <button @click="searchTracks" class="search-btn">🔍 Search</button>
      </div>

      <div class="filters">
        <select v-model="selectedInstrument" @change="filterTracks" class="filter-select">
          <option value="">All Instruments</option>
          <option value="guitar">🎸 Guitar</option>
          <option value="bass">🎸 Bass</option>
          <option value="piano">🎹 Piano/Keys</option>
          <option value="drums">🥁 Drums</option>
          <option value="vocals">🎤 Vocals</option>
          <option value="violin">🎻 Violin</option>
          <option value="saxophone">🎷 Saxophone</option>
          <option value="trumpet">🎺 Trumpet</option>
        </select>

        <select v-model="selectedGenre" @change="filterTracks" class="filter-select">
          <option value="">All Genres</option>
          <option value="rock">🎸 Rock</option>
          <option value="pop">🎤 Pop</option>
          <option value="jazz">🎷 Jazz</option>
          <option value="blues">🎵 Blues</option>
          <option value="country">🤠 Country</option>
          <option value="classical">🎻 Classical</option>
          <option value="metal">🤘 Metal</option>
          <option value="funk">🕺 Funk</option>
          <option value="latin">💃 Latin</option>
          <option value="r&b">🎹 R&B/Soul</option>
        </select>

        <select v-model="selectedDifficulty" @change="filterTracks" class="filter-select">
          <option value="">All Levels</option>
          <option value="beginner">⭐ Beginner</option>
          <option value="intermediate">⭐⭐ Intermediate</option>
          <option value="advanced">⭐⭐⭐ Advanced</option>
        </select>

        <select v-model="selectedKey" @change="filterTracks" class="filter-select">
          <option value="">Any Key</option>
          <option v-for="key in keys" :key="key" :value="key">{{ key }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Searching music library...</p>
    </div>

    <!-- Results -->
    <div v-else-if="tracks.length > 0" class="tracks-grid">
      <div 
        v-for="track in tracks" 
        :key="track.id"
        class="track-card"
        :class="{ playing: currentTrack?.id === track.id }"
      >
        <div class="track-artwork">
          <img :src="track.artwork || '/images/default-album.svg'" :alt="track.title" />
          <div class="play-overlay" @click="playTrack(track)">
            <button class="play-btn-large">
              {{ currentTrack?.id === track.id && isPlaying ? '⏸️' : '▶️' }}
            </button>
          </div>
        </div>

        <div class="track-info">
          <h3>{{ track.title }}</h3>
          <p class="artist">{{ track.artist }}</p>
          <div class="track-meta">
            <span class="genre-tag">{{ track.genre }}</span>
            <span class="key-tag">{{ track.key }}</span>
            <span class="bpm-tag">{{ track.bpm }} BPM</span>
            <span class="difficulty-tag">{{ getDifficultyIcon(track.difficulty) }} {{ track.difficulty }}</span>
          </div>
        </div>

        <div class="track-actions">
          <button @click="selectTrack(track)" class="action-btn primary">
            🎵 Play Backing Track
          </button>
          <button @click="customizeTrack(track)" class="action-btn">
            🎛️ Customize Mix
          </button>
          <button @click="downloadTrack(track)" class="action-btn">
            💾 Download
          </button>
          <button @click="shareTrack(track)" class="action-btn">
            📤 Share
          </button>
          <button @click="sendToDevice(track)" class="action-btn">
            📱 Send to Device
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <h3>🎵 Search for any song</h3>
      <p>Our library includes millions of songs with backing tracks for every instrument</p>
      <div class="popular-searches">
        <h4>Popular Searches:</h4>
        <button @click="quickSearch('Hotel California')" class="quick-search-btn">Hotel California</button>
        <button @click="quickSearch('Sweet Child O Mine')" class="quick-search-btn">Sweet Child O' Mine</button>
        <button @click="quickSearch('Wonderwall')" class="quick-search-btn">Wonderwall</button>
        <button @click="quickSearch('Stairway to Heaven')" class="quick-search-btn">Stairway to Heaven</button>
        <button @click="quickSearch('All of Me')" class="quick-search-btn">All of Me (Piano)</button>
      </div>
    </div>

    <!-- Track Customization Modal -->
    <div v-if="showCustomizeModal" class="modal-overlay" @click="closeCustomizeModal">
      <div class="modal custom-modal" @click.stop>
        <div class="modal-header">
          <h2>🎛️ Customize: {{ selectedTrack?.title }}</h2>
          <button @click="closeCustomizeModal" class="close-btn">✕</button>
        </div>

        <div class="customize-content">
          <h3>Instrument Mix</h3>
          <p class="hint">Adjust which instruments you want in your backing track</p>

          <div class="instrument-mixer">
            <div v-for="inst in availableInstruments" :key="inst.id" class="mix-channel">
              <div class="channel-header">
                <button @click="toggleInstrument(inst)" :class="{ muted: inst.muted }" class="mute-toggle">
                  {{ inst.muted ? '🔇' : '🔊' }}
                </button>
                <span class="channel-name">{{ inst.icon }} {{ inst.name }}</span>
              </div>
              <input 
                type="range" 
                v-model="inst.volume" 
                min="0" 
                max="100" 
                :disabled="inst.muted"
                class="channel-slider"
              />
              <span class="volume-display">{{ inst.volume }}%</span>
            </div>
          </div>

          <div class="key-tempo-controls">
            <div class="control-group">
              <label>🎹 Change Key:</label>
              <select v-model="customKey" class="key-select">
                <option :value="selectedTrack?.key">Original ({{ selectedTrack?.key }})</option>
                <option v-for="key in keys" :key="key" :value="key">{{ key }}</option>
              </select>
            </div>

            <div class="control-group">
              <label>⏱️ Tempo:</label>
              <input 
                type="range" 
                v-model="customTempo" 
                min="50" 
                max="150" 
                class="tempo-slider"
              />
              <span class="tempo-display">{{ customTempo }}% ({{ Math.round(selectedTrack?.bpm * customTempo / 100) }} BPM)</span>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="applyCustomization" class="btn-primary">✅ Apply & Play</button>
            <button @click="savePreset" class="btn-secondary">💾 Save as Preset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeShareModal">
      <div class="modal share-modal" @click.stop>
        <div class="modal-header">
          <h2>📤 Share: {{ selectedTrack?.title }}</h2>
          <button @click="closeShareModal" class="close-btn">✕</button>
        </div>

        <div class="share-content">
          <h3>Share to Social Media</h3>
          <div class="social-buttons">
            <button @click="shareToSocial('facebook')" class="social-btn facebook">
              <span class="icon">📘</span> Facebook
            </button>
            <button @click="shareToSocial('twitter')" class="social-btn twitter">
              <span class="icon">🐦</span> Twitter/X
            </button>
            <button @click="shareToSocial('instagram')" class="social-btn instagram">
              <span class="icon">📷</span> Instagram
            </button>
            <button @click="shareToSocial('tiktok')" class="social-btn tiktok">
              <span class="icon">🎵</span> TikTok
            </button>
            <button @click="shareToSocial('youtube')" class="social-btn youtube">
              <span class="icon">📹</span> YouTube
            </button>
            <button @click="shareToSocial('whatsapp')" class="social-btn whatsapp">
              <span class="icon">💬</span> WhatsApp
            </button>
          </div>

          <h3>Copy Link</h3>
          <div class="link-share">
            <input 
              v-model="shareLink" 
              readonly 
              class="share-link-input"
              @click="selectShareLink"
            />
            <button @click="copyShareLink" class="copy-btn">
              {{ linkCopied ? '✅ Copied!' : '📋 Copy' }}
            </button>
          </div>

          <h3>Email</h3>
          <div class="email-share">
            <input 
              v-model="shareEmail" 
              placeholder="recipient@email.com"
              class="email-input"
            />
            <button @click="shareViaEmail" class="email-btn">📧 Send</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Send to Device Modal -->
    <div v-if="showDeviceModal" class="modal-overlay" @click="closeDeviceModal">
      <div class="modal device-modal" @click.stop>
        <div class="modal-header">
          <h2>📱 Send to Device</h2>
          <button @click="closeDeviceModal" class="close-btn">✕</button>
        </div>

        <div class="device-content">
          <h3>Available Devices</h3>
          <button @click="scanDevices" class="scan-btn" :disabled="scanningDevices">
            {{ scanningDevices ? '🔍 Scanning...' : '🔄 Refresh Devices' }}
          </button>

          <div class="device-list">
            <div 
              v-for="device in nearbyDevices" 
              :key="device.id"
              class="device-item"
              @click="sendToSelectedDevice(device)"
            >
              <span class="device-icon">{{ getDeviceIcon(device.type) }}</span>
              <div class="device-info">
                <strong>{{ device.name }}</strong>
                <span class="device-type">{{ device.type }}</span>
              </div>
              <button class="send-btn">Send →</button>
            </div>
          </div>

          <div v-if="nearbyDevices.length === 0" class="no-devices">
            <p>No devices found nearby</p>
            <p class="hint">Make sure Bluetooth is enabled and devices are discoverable</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Player Bar (Bottom) -->
    <div v-if="currentTrack" class="player-bar">
      <div class="player-info">
        <img :src="currentTrack.artwork" :alt="currentTrack.title" class="player-artwork" />
        <div class="player-details">
          <strong>{{ currentTrack.title }}</strong>
          <span>{{ currentTrack.artist }}</span>
        </div>
      </div>

      <div class="player-controls">
        <button @click="previousTrack" class="player-btn">⏮️</button>
        <button @click="togglePlayPause" class="player-btn play-pause">
          {{ isPlaying ? '⏸️' : '▶️' }}
        </button>
        <button @click="nextTrack" class="player-btn">⏭️</button>
        <button @click="toggleLoop" :class="{ active: loopEnabled }" class="player-btn">🔁</button>
      </div>

      <div class="player-progress">
        <span class="time">{{ formatTime(playbackTime) }}</span>
        <input 
          type="range" 
          v-model="playbackTime" 
          min="0" 
          :max="trackDuration" 
          class="progress-bar"
        />
        <span class="time">{{ formatTime(trackDuration) }}</span>
      </div>

      <div class="player-volume">
        <button @click="toggleMute" class="volume-btn">
          {{ isMuted ? '🔇' : '🔊' }}
        </button>
        <input 
          type="range" 
          v-model="volume" 
          min="0" 
          max="100" 
          class="volume-slider"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const searchQuery = ref('')
const loading = ref(false)
const tracks = ref([])
const selectedInstrument = ref('')
const selectedGenre = ref('')
const selectedDifficulty = ref('')
const selectedKey = ref('')
const currentTrack = ref(null)
const selectedTrack = ref(null)
const isPlaying = ref(false)
const playbackTime = ref(0)
const trackDuration = ref(0)
const volume = ref(80)
const isMuted = ref(false)
const loopEnabled = ref(false)

// Modals
const showCustomizeModal = ref(false)
const showShareModal = ref(false)
const showDeviceModal = ref(false)

// Customization
const availableInstruments = ref([
  { id: 1, name: 'Drums', icon: '🥁', volume: 80, muted: false },
  { id: 2, name: 'Bass', icon: '🎸', volume: 75, muted: false },
  { id: 3, name: 'Rhythm Guitar', icon: '🎸', volume: 70, muted: false },
  { id: 4, name: 'Lead Guitar', icon: '🎸', volume: 0, muted: true },
  { id: 5, name: 'Piano', icon: '🎹', volume: 60, muted: false },
  { id: 6, name: 'Strings', icon: '🎻', volume: 50, muted: false },
  { id: 7, name: 'Vocals', icon: '🎤', volume: 0, muted: true }
])

const customKey = ref('')
const customTempo = ref(100)

// Share
const shareLink = ref('')
const linkCopied = ref(false)
const shareEmail = ref('')

// Devices
const nearbyDevices = ref([])
const scanningDevices = ref(false)

// Keys
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Mock data generator
const generateMockTracks = (query) => {
  const mockTracks = [
    {
      id: 1,
      title: query || 'Hotel California',
      artist: 'Eagles',
      genre: 'rock',
      key: 'Bm',
      bpm: 74,
      difficulty: 'intermediate',
      artwork: '/images/default-album.svg',
      duration: 391
    },
    {
      id: 2,
      title: query || 'Sweet Child O\' Mine',
      artist: 'Guns N\' Roses',
      genre: 'rock',
      key: 'D',
      bpm: 125,
      difficulty: 'advanced',
      artwork: '/images/default-album.svg',
      duration: 356
    },
    {
      id: 3,
      title: query || 'All of Me',
      artist: 'John Legend',
      genre: 'pop',
      key: 'Ab',
      bpm: 126,
      difficulty: 'intermediate',
      artwork: '/images/default-album.svg',
      duration: 269
    }
  ]
  return mockTracks
}

// Search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      searchTracks()
    }
  }, 500)
}

const searchTracks = async () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  tracks.value = generateMockTracks(searchQuery.value)
  loading.value = false
}

const quickSearch = (query) => {
  searchQuery.value = query
  searchTracks()
}

const filterTracks = () => {
  // Apply filters
  searchTracks()
}

// Track actions
const playTrack = (track) => {
  currentTrack.value = track
  isPlaying.value = !isPlaying.value
  trackDuration.value = track.duration
}

const selectTrack = (track) => {
  currentTrack.value = track
  isPlaying.value = true
  trackDuration.value = track.duration
}

const customizeTrack = (track) => {
  selectedTrack.value = track
  customKey.value = track.key
  customTempo.value = 100
  showCustomizeModal.value = true
}

const downloadTrack = async (track) => {
  alert(`Downloading "${track.title}"...\n\nYour backing track will be saved to your device.`)
}

const shareTrack = (track) => {
  selectedTrack.value = track
  shareLink.value = `https://fretpilotstudio.com/tracks/${track.id}`
  showShareModal.value = true
}

const sendToDevice = (track) => {
  selectedTrack.value = track
  showDeviceModal.value = true
  scanDevices()
}

// Customization
const toggleInstrument = (inst) => {
  inst.muted = !inst.muted
}

const applyCustomization = () => {
  alert('Custom mix applied! Playing with your settings.')
  showCustomizeModal.value = false
  selectTrack(selectedTrack.value)
}

const savePreset = () => {
  alert('Mix preset saved! You can load this later.')
}

const closeCustomizeModal = () => {
  showCustomizeModal.value = false
}

// Share
const shareToSocial = (platform) => {
  const track = selectedTrack.value
  const text = `Check out "${track.title}" by ${track.artist} on FretPilot Studio!`
  const url = shareLink.value

  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    instagram: `instagram://share?url=${encodeURIComponent(url)}`,
    tiktok: `https://www.tiktok.com/share?url=${encodeURIComponent(url)}`,
    youtube: `https://www.youtube.com/upload`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
  }

  window.open(urls[platform], '_blank')
}

const selectShareLink = (e) => {
  e.target.select()
}

const copyShareLink = () => {
  navigator.clipboard.writeText(shareLink.value)
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}

const shareViaEmail = () => {
  const track = selectedTrack.value
  const subject = encodeURIComponent(`Check out ${track.title} on FretPilot Studio`)
  const body = encodeURIComponent(`I thought you'd enjoy this backing track:\n\n${track.title} by ${track.artist}\n\n${shareLink.value}`)
  
  window.location.href = `mailto:${shareEmail.value}?subject=${subject}&body=${body}`
  alert('Opening email client...')
}

const closeShareModal = () => {
  showShareModal.value = false
  linkCopied.value = false
}

// Devices
const scanDevices = async () => {
  scanningDevices.value = true
  
  // Simulate device scan
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  nearbyDevices.value = [
    { id: 1, name: 'iPhone 13', type: 'smartphone' },
    { id: 2, name: 'iPad Pro', type: 'tablet' },
    { id: 3, name: 'MacBook Pro', type: 'computer' },
    { id: 4, name: 'JBL Speaker', type: 'speaker' },
    { id: 5, name: 'AirPods Pro', type: 'headphones' }
  ]
  
  scanningDevices.value = false
}

const sendToSelectedDevice = (device) => {
  alert(`Sending "${selectedTrack.value.title}" to ${device.name}...`)
  showDeviceModal.value = false
}

const getDeviceIcon = (type) => {
  const icons = {
    smartphone: '📱',
    tablet: '📱',
    computer: '💻',
    speaker: '🔊',
    headphones: '🎧'
  }
  return icons[type] || '📱'
}

const closeDeviceModal = () => {
  showDeviceModal.value = false
}

// Player
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value
}

const previousTrack = () => {
  const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value.id)
  if (currentIndex > 0) {
    selectTrack(tracks.value[currentIndex - 1])
  }
}

const nextTrack = () => {
  const currentIndex = tracks.value.findIndex(t => t.id === currentTrack.value.id)
  if (currentIndex < tracks.value.length - 1) {
    selectTrack(tracks.value[currentIndex + 1])
  }
}

const toggleLoop = () => {
  loopEnabled.value = !loopEnabled.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getDifficultyIcon = (difficulty) => {
  const icons = {
    beginner: '⭐',
    intermediate: '⭐⭐',
    advanced: '⭐⭐⭐'
  }
  return icons[difficulty] || '⭐'
}

// Playback simulation
let playbackInterval
onMounted(() => {
  playbackInterval = setInterval(() => {
    if (isPlaying.value && playbackTime.value < trackDuration.value) {
      playbackTime.value += 0.1
    } else if (playbackTime.value >= trackDuration.value && loopEnabled.value) {
      playbackTime.value = 0
    } else if (playbackTime.value >= trackDuration.value) {
      isPlaying.value = false
      playbackTime.value = 0
    }
  }, 100)
})

onUnmounted(() => {
  clearInterval(playbackInterval)
})
</script>

<style scoped>
.backing-track-library {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 120px; /* Space for player bar */
}

.library-header {
  text-align: center;
  margin-bottom: 3rem;
}

.library-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

/* Search */
.search-section {
  margin-bottom: 3rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tracks Grid */
.tracks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.track-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.track-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.track-card.playing {
  border-color: #764ba2;
  box-shadow: 0 8px 24px rgba(118, 75, 162, 0.4);
}

.track-artwork {
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
}

.track-artwork img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.track-card:hover .play-overlay {
  opacity: 1;
}

.play-btn-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 2rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn-large:hover {
  transform: scale(1.1);
}

.track-info {
  padding: 1.5rem;
}

.track-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.artist {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.track-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-tag, .key-tag, .bpm-tag, .difficulty-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 0.85rem;
}

.track-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #667eea;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-weight: 600;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.popular-searches {
  margin-top: 2rem;
}

.popular-searches h4 {
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

.quick-search-btn {
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-search-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  font-size: 1.5rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Customize Modal */
.customize-content {
  padding: 2rem;
}

.hint {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.instrument-mixer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.mix-channel {
  display: grid;
  grid-template-columns: 150px 1fr 60px;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.channel-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mute-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  cursor: pointer;
}

.mute-toggle.muted {
  background: rgba(255, 0, 0, 0.3);
}

.channel-slider {
  width: 100%;
}

.volume-display {
  text-align: right;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.key-tempo-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.key-select, .tempo-slider {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
}

.tempo-display {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-2px);
}

/* Share Modal */
.share-content {
  padding: 2rem;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-btn {
  padding: 1rem;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-btn .icon {
  font-size: 1.5rem;
}

.facebook { background: #1877f2; }
.twitter { background: #1da1f2; }
.instagram { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
.tiktok { background: #000; }
.youtube { background: #ff0000; }
.whatsapp { background: #25d366; }

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.link-share, .email-share {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.share-link-input, .email-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
}

.copy-btn, .email-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover, .email-btn:hover {
  transform: translateY(-2px);
}

/* Device Modal */
.device-content {
  padding: 2rem;
}

.scan-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.device-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.device-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.device-icon {
  font-size: 2rem;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.device-type {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.send-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.no-devices {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Player Bar */
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: 300px 1fr 200px;
  gap: 2rem;
  align-items: center;
  z-index: 999;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-artwork {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-details strong {
  font-size: 1rem;
}

.player-details span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.player-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.player-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.player-btn.play-pause {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 1.5rem;
}

.player-btn.active {
  background: rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.time {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
}

.progress-bar {
  flex: 1;
}

.player-volume {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volume-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
}

.volume-slider {
  width: 100px;
}

@media (max-width: 1024px) {
  .player-bar {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .player-progress {
    order: -1;
  }
}

@media (max-width: 768px) {
  .tracks-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .key-tempo-controls {
    grid-template-columns: 1fr;
  }

  .social-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
