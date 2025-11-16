<template>
  <div class="video-platform">
    <header class="platform-header">
      <div class="header-content">
        <FeatureIcons icon="jam" :size="32" />
        <h1>FretPilot Video Lessons</h1>
        <input 
          v-model="searchQuery" 
          class="search-bar" 
          placeholder="Search lessons, techniques, songs..."
          @input="handleSearch"
        />
      </div>
      
      <div class="filters">
        <select v-model="filterSkill" @change="applyFilters">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="pro">Pro</option>
        </select>
        
        <select v-model="filterGenre" @change="applyFilters">
          <option value="">All Genres</option>
          <option value="rock">Rock</option>
          <option value="blues">Blues</option>
          <option value="jazz">Jazz</option>
          <option value="metal">Metal</option>
          <option value="classical">Classical</option>
          <option value="country">Country</option>
        </select>
        
        <select v-model="filterTechnique" @change="applyFilters">
          <option value="">All Techniques</option>
          <option value="chords">Chords</option>
          <option value="scales">Scales</option>
          <option value="fingerstyle">Fingerstyle</option>
          <option value="sweep">Sweep Picking</option>
          <option value="tapping">Tapping</option>
          <option value="bending">Bending</option>
        </select>
        
        <button 
          :class="{ active: showProgressOnly }" 
          @click="showProgressOnly = !showProgressOnly"
          class="filter-btn"
        >
          📊 My Progress
        </button>
      </div>
    </header>

    <!-- Current Video Player -->
    <div v-if="currentVideo" class="player-container">
      <div class="main-player">
        <video 
          ref="videoPlayer"
          :src="currentVideo.videoUrl"
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnd"
          controls
          class="video-element"
        ></video>
        
        <!-- Interactive Tab Overlay -->
        <div v-if="showTab && currentVideo.tabData" class="tab-overlay">
          <div class="tab-scroll" :style="{ transform: `translateY(-${tabScrollY}px)` }">
            <div v-for="(line, idx) in currentVideo.tabData.lines" :key="idx" class="tab-line">
              <span class="string-label">{{ line.string }}</span>
              <span class="tab-notation">{{ line.notation }}</span>
            </div>
          </div>
        </div>
        
        <!-- Practice Controls -->
        <div class="practice-controls">
          <button @click="togglePlayback" class="control-btn">
            {{ isPlaying ? '⏸️' : '▶️' }}
          </button>
          
          <div class="speed-control">
            <label>Speed:</label>
            <input 
              type="range" 
              v-model.number="playbackSpeed" 
              min="0.25" 
              max="2" 
              step="0.25"
              @input="updateSpeed"
            />
            <span>{{ playbackSpeed }}x</span>
          </div>
          
          <button @click="loopSection" :class="{ active: isLooping }" class="control-btn">
            🔁 Loop Section
          </button>
          
          <button @click="showTab = !showTab" :class="{ active: showTab }" class="control-btn">
            📝 Show Tab
          </button>
          
          <button @click="enableMistakeDetection = !enableMistakeDetection" 
                  :class="{ active: enableMistakeDetection }" 
                  class="control-btn">
            🎯 Detect Mistakes
          </button>
          
          <div v-if="isLooping" class="loop-markers">
            <input type="number" v-model.number="loopStart" @change="setLoopStart" placeholder="Start (s)" />
            <span>to</span>
            <input type="number" v-model.number="loopEnd" @change="setLoopEnd" placeholder="End (s)" />
          </div>
        </div>
        
        <!-- Live Feedback -->
        <div v-if="enableMistakeDetection && mistakeFeedback" class="mistake-feedback">
          <div :class="['feedback-badge', mistakeFeedback.type]">
            {{ mistakeFeedback.message }}
          </div>
        </div>
      </div>
      
      <!-- Video Details -->
      <div class="video-details">
        <h2>{{ currentVideo.title }}</h2>
        <div class="video-meta">
          <span class="instructor">🎸 {{ currentVideo.instructor }}</span>
          <span class="duration">⏱️ {{ formatDuration(currentVideo.duration) }}</span>
          <span class="skill-badge" :class="currentVideo.skill">{{ currentVideo.skill }}</span>
          <span class="views">👁️ {{ currentVideo.views }} views</span>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${videoProgress}%` }"></div>
        </div>
        <p class="progress-text">{{ videoProgress }}% Complete</p>
        
        <div class="video-description">
          <h3>What You'll Learn:</h3>
          <ul>
            <li v-for="(item, idx) in currentVideo.learningPoints" :key="idx">{{ item }}</li>
          </ul>
        </div>
        
        <div class="checkpoints">
          <h3>Lesson Checkpoints:</h3>
          <div v-for="checkpoint in currentVideo.checkpoints" :key="checkpoint.time" 
               class="checkpoint"
               :class="{ completed: checkpoint.completed }">
            <span class="checkpoint-time" @click="seekTo(checkpoint.time)">
              {{ formatTime(checkpoint.time) }}
            </span>
            <span class="checkpoint-title">{{ checkpoint.title }}</span>
            <button @click="markCheckpoint(checkpoint)" class="mark-btn">
              {{ checkpoint.completed ? '✓' : 'Mark Complete' }}
            </button>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="addToPlaylist" class="action-btn">
            ➕ Add to Playlist
          </button>
          <button @click="downloadTab" class="action-btn" v-if="currentVideo.tabData">
            📥 Download Tab
          </button>
          <button @click="practiceModeToggle" class="action-btn primary">
            🎯 Enter Practice Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="video-grid">
      <div class="section-header">
        <h2>{{ currentSection }}</h2>
        <span class="video-count">{{ filteredVideos.length }} lessons</span>
      </div>
      
      <div class="grid-container">
        <div 
          v-for="video in filteredVideos" 
          :key="video.id"
          class="video-card"
          @click="selectVideo(video)"
          :class="{ watching: currentVideo && currentVideo.id === video.id }"
        >
          <div class="thumbnail-container">
            <img :src="video.thumbnail" :alt="video.title" class="thumbnail" />
            <span class="duration-badge">{{ formatDuration(video.duration) }}</span>
            <div v-if="video.progress > 0" class="progress-overlay">
              <div class="progress-bar-mini" :style="{ width: `${video.progress}%` }"></div>
            </div>
          </div>
          
          <div class="video-info">
            <h3>{{ video.title }}</h3>
            <p class="instructor">{{ video.instructor }}</p>
            <div class="video-stats">
              <span class="skill-badge" :class="video.skill">{{ video.skill }}</span>
              <span class="genre">{{ video.genre }}</span>
              <span class="views">{{ video.views }} views</span>
            </div>
            
            <div v-if="video.progress > 0" class="completion-status">
              <span v-if="video.progress === 100" class="completed">✓ Completed</span>
              <span v-else class="in-progress">{{ video.progress }}% watched</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Next -->
    <div class="recommended-section">
      <h2>🎯 Recommended for Your Skill Level</h2>
      <div class="recommendation-grid">
        <div v-for="rec in recommendations" :key="rec.id" class="rec-card" @click="selectVideo(rec)">
          <img :src="rec.thumbnail" :alt="rec.title" />
          <div class="rec-info">
            <h4>{{ rec.title }}</h4>
            <p>{{ rec.reason }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'

const searchQuery = ref('')
const filterSkill = ref('')
const filterGenre = ref('')
const filterTechnique = ref('')
const showProgressOnly = ref(false)

const currentVideo = ref(null)
const videoPlayer = ref(null)
const isPlaying = ref(false)
const playbackSpeed = ref(1)
const showTab = ref(false)
const tabScrollY = ref(0)
const isLooping = ref(false)
const loopStart = ref(0)
const loopEnd = ref(30)
const enableMistakeDetection = ref(false)
const mistakeFeedback = ref(null)
const videoProgress = ref(0)

// Sample video library (in production, fetch from API)
const videos = ref([
  {
    id: 1,
    title: 'Master Pentatonic Scales in 15 Minutes',
    instructor: 'Alex Thompson',
    duration: 900,
    skill: 'intermediate',
    genre: 'rock',
    technique: 'scales',
    views: 12500,
    thumbnail: '/images/video-thumb-1.jpg',
    videoUrl: '/videos/pentatonic-lesson.mp4',
    progress: 45,
    learningPoints: [
      'All 5 pentatonic positions',
      'Pattern recognition',
      'Position shifting',
      'Practical licks and phrases'
    ],
    checkpoints: [
      { time: 0, title: 'Introduction', completed: true },
      { time: 180, title: 'Position 1', completed: true },
      { time: 360, title: 'Position 2', completed: false },
      { time: 540, title: 'Connecting Positions', completed: false },
      { time: 720, title: 'Practical Application', completed: false }
    ],
    tabData: {
      lines: [
        { string: 'e', notation: '------3-5-3---------' },
        { string: 'B', notation: '----3-------6-3----' },
        { string: 'G', notation: '--5-------------5--' },
        { string: 'D', notation: '5------------------' },
        { string: 'A', notation: '-------------------' },
        { string: 'E', notation: '-------------------' }
      ]
    }
  },
  {
    id: 2,
    title: 'Blues Shuffle Rhythm - Complete Guide',
    instructor: 'Maria Santos',
    duration: 720,
    skill: 'beginner',
    genre: 'blues',
    technique: 'chords',
    views: 8400,
    thumbnail: '/images/video-thumb-2.jpg',
    videoUrl: '/videos/blues-shuffle.mp4',
    progress: 0,
    learningPoints: [
      'Classic 12-bar progression',
      'Shuffle rhythm technique',
      'Dominant 7th chords',
      'Swing feel development'
    ],
    checkpoints: [
      { time: 0, title: 'Understanding the Shuffle', completed: false },
      { time: 120, title: 'Basic Pattern', completed: false },
      { time: 300, title: '12-Bar Blues', completed: false },
      { time: 540, title: 'Adding Variations', completed: false }
    ],
    tabData: null
  },
  {
    id: 3,
    title: 'Sweep Picking Fundamentals',
    instructor: 'Jordan Lee',
    duration: 1080,
    skill: 'advanced',
    genre: 'metal',
    technique: 'sweep',
    views: 15200,
    thumbnail: '/images/video-thumb-3.jpg',
    videoUrl: '/videos/sweep-picking.mp4',
    progress: 100,
    learningPoints: [
      'Economy of motion',
      '3-string sweeps',
      '5-string arpeggios',
      'Speed building exercises'
    ],
    checkpoints: [
      { time: 0, title: 'Technique Overview', completed: true },
      { time: 200, title: 'Hand Synchronization', completed: true },
      { time: 480, title: 'Simple Arpeggios', completed: true },
      { time: 780, title: 'Complex Patterns', completed: true }
    ],
    tabData: null
  }
])

const currentSection = computed(() => {
  if (showProgressOnly.value) return 'My In-Progress Lessons'
  if (searchQuery.value) return 'Search Results'
  return 'All Video Lessons'
})

const filteredVideos = computed(() => {
  let result = videos.value

  if (showProgressOnly.value) {
    result = result.filter(v => v.progress > 0 && v.progress < 100)
  }

  if (filterSkill.value) {
    result = result.filter(v => v.skill === filterSkill.value)
  }

  if (filterGenre.value) {
    result = result.filter(v => v.genre === filterGenre.value)
  }

  if (filterTechnique.value) {
    result = result.filter(v => v.technique === filterTechnique.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(v => 
      v.title.toLowerCase().includes(query) ||
      v.instructor.toLowerCase().includes(query) ||
      v.genre.toLowerCase().includes(query)
    )
  }

  return result
})

const recommendations = computed(() => {
  // Simple recommendation logic based on current video
  if (!currentVideo.value) return []
  
  return videos.value
    .filter(v => v.id !== currentVideo.value.id)
    .filter(v => v.skill === currentVideo.value.skill || v.genre === currentVideo.value.genre)
    .slice(0, 3)
    .map(v => ({
      ...v,
      reason: v.skill === currentVideo.value.skill 
        ? `Same skill level: ${v.skill}` 
        : `You enjoy ${v.genre}`
    }))
})

function selectVideo(video) {
  currentVideo.value = video
  isPlaying.value = false
  videoProgress.value = video.progress
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function togglePlayback() {
  if (!videoPlayer.value) return
  
  if (isPlaying.value) {
    videoPlayer.value.pause()
  } else {
    videoPlayer.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function updateSpeed() {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = playbackSpeed.value
  }
}

function loopSection() {
  isLooping.value = !isLooping.value
}

function setLoopStart() {
  if (videoPlayer.value) {
    loopStart.value = videoPlayer.value.currentTime
  }
}

function setLoopEnd() {
  if (videoPlayer.value) {
    loopEnd.value = videoPlayer.value.currentTime
  }
}

function handleTimeUpdate() {
  if (!videoPlayer.value) return
  
  const current = videoPlayer.value.currentTime
  const duration = videoPlayer.value.duration
  
  // Update progress
  videoProgress.value = Math.round((current / duration) * 100)
  
  // Sync tablature scroll
  if (showTab.value && currentVideo.value.tabData) {
    tabScrollY.value = (current / duration) * 500 // Adjust scroll speed
  }
  
  // Handle loop
  if (isLooping.value && current >= loopEnd.value) {
    videoPlayer.value.currentTime = loopStart.value
  }
  
  // Simulate mistake detection
  if (enableMistakeDetection.value && Math.random() < 0.1) {
    mistakeFeedback.value = {
      type: Math.random() > 0.7 ? 'error' : 'success',
      message: Math.random() > 0.7 ? 'Note slightly flat' : 'Perfect timing!'
    }
    setTimeout(() => { mistakeFeedback.value = null }, 2000)
  }
}

function handleVideoEnd() {
  isPlaying.value = false
  
  // Mark as complete
  if (currentVideo.value) {
    currentVideo.value.progress = 100
    saveProgress()
  }
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatTime(seconds) {
  return formatDuration(seconds)
}

function seekTo(time) {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime = time
  }
}

function markCheckpoint(checkpoint) {
  checkpoint.completed = !checkpoint.completed
  saveProgress()
}

function addToPlaylist() {
  alert('Added to playlist! (Feature pending)')
}

function downloadTab() {
  alert('Tab download started! (Feature pending)')
}

function practiceModeToggle() {
  showTab.value = true
  playbackSpeed.value = 0.75
  updateSpeed()
  alert('Practice mode activated: Speed reduced, tabs visible')
}

function handleSearch() {
  // Search debouncing could be added here
}

function applyFilters() {
  // Filters are reactive, auto-applied
}

function saveProgress() {
  // In production, save to backend
  localStorage.setItem('video-progress', JSON.stringify(
    videos.value.map(v => ({ id: v.id, progress: v.progress, checkpoints: v.checkpoints }))
  ))
}

function loadProgress() {
  const saved = localStorage.getItem('video-progress')
  if (saved) {
    const progress = JSON.parse(saved)
    progress.forEach(p => {
      const video = videos.value.find(v => v.id === p.id)
      if (video) {
        video.progress = p.progress
        if (p.checkpoints) video.checkpoints = p.checkpoints
      }
    })
  }
}

onMounted(() => {
  loadProgress()
})

onUnmounted(() => {
  saveProgress()
})
</script>

<style scoped>
.video-platform {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  padding: 20px;
}

.platform-header {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 28px;
  background: linear-gradient(135deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-bar {
  flex: 1;
  padding: 12px 20px;
  border-radius: 25px;
  border: 2px solid rgba(0,212,255,0.3);
  background: rgba(255,255,255,0.05);
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;
}

.search-bar:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 20px rgba(0,212,255,0.3);
}

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters select {
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
}

.filter-btn {
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  border-color: #00d4ff;
}

.player-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.main-player {
  position: relative;
  background: black;
  border-radius: 12px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  display: block;
}

.tab-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0,0,0,0.9);
  padding: 15px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  max-height: 200px;
  overflow: hidden;
  font-size: 14px;
}

.tab-line {
  display: flex;
  gap: 10px;
  margin: 3px 0;
  white-space: nowrap;
}

.string-label {
  color: #ffd700;
  font-weight: bold;
}

.practice-controls {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.control-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.control-btn.active {
  background: rgba(0,212,255,0.3);
  border-color: #00d4ff;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  padding: 5px 10px;
  border-radius: 6px;
}

.speed-control input {
  width: 80px;
}

.loop-markers {
  display: flex;
  gap: 5px;
  align-items: center;
}

.loop-markers input {
  width: 60px;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  text-align: center;
}

.mistake-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.feedback-badge {
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  animation: fadeInOut 2s;
}

.feedback-badge.success {
  background: rgba(0,255,0,0.9);
  color: black;
}

.feedback-badge.error {
  background: rgba(255,0,0,0.9);
  color: white;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

.video-details {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
}

.video-details h2 {
  margin-top: 0;
  font-size: 24px;
}

.video-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 15px 0;
  font-size: 14px;
}

.skill-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.skill-badge.beginner { background: #4caf50; }
.skill-badge.intermediate { background: #ff9800; }
.skill-badge.advanced { background: #f44336; }
.skill-badge.pro { background: #9c27b0; }

.progress-bar {
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 15px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #0066ff);
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #00d4ff;
  margin: 5px 0 15px;
}

.checkpoints {
  margin: 20px 0;
}

.checkpoint {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  margin: 8px 0;
  transition: all 0.3s;
}

.checkpoint.completed {
  background: rgba(0,255,0,0.1);
  border-left: 3px solid #4caf50;
}

.checkpoint-time {
  color: #00d4ff;
  cursor: pointer;
  font-weight: bold;
  min-width: 50px;
}

.checkpoint-time:hover {
  text-decoration: underline;
}

.checkpoint-title {
  flex: 1;
}

.mark-btn {
  padding: 5px 12px;
  border-radius: 6px;
  border: none;
  background: rgba(0,212,255,0.2);
  color: white;
  cursor: pointer;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  border: none;
}

.video-grid {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.video-count {
  color: #888;
  font-size: 14px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,212,255,0.3);
  border-color: #00d4ff;
}

.video-card.watching {
  border-color: #ff00ff;
  box-shadow: 0 0 30px rgba(255,0,255,0.5);
}

.thumbnail-container {
  position: relative;
  aspect-ratio: 16/9;
  background: #000;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255,255,255,0.2);
}

.progress-bar-mini {
  height: 100%;
  background: #00d4ff;
}

.video-info {
  padding: 15px;
}

.video-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.4;
}

.video-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  margin-top: 8px;
}

.completion-status {
  margin-top: 10px;
  font-size: 13px;
}

.completed {
  color: #4caf50;
}

.in-progress {
  color: #ff9800;
}

.recommended-section {
  margin-top: 40px;
  padding: 30px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.rec-card {
  display: flex;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.rec-card:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(5px);
}

.rec-card img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.rec-info h4 {
  margin: 0 0 5px;
  font-size: 14px;
}

.rec-info p {
  margin: 0;
  font-size: 12px;
  color: #888;
}

@media (max-width: 968px) {
  .player-container {
    grid-template-columns: 1fr;
  }
  
  .practice-controls {
    font-size: 12px;
  }
  
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>
