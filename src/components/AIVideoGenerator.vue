<template>
  <div class="ai-video-generator">
    <AnimatedHero>
      <img src="/images/ai-lesson.svg" alt="AI Video" class="page-hero animate-float" />
    </AnimatedHero>

    <div class="container">
      <h1>🎬 AI Instructional Video Generator</h1>
      <p class="subtitle">Generate custom video lessons tailored to your learning goals</p>

      <div class="video-form" v-if="!generating && !videoReady">
        <div class="form-group">
          <label>What do you want to learn?</label>
          <textarea 
            v-model="prompt" 
            placeholder="e.g., 'Show me how to play a fingerstyle arrangement of Blackbird by The Beatles'"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Skill Level</label>
          <select v-model="skillLevel">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div class="form-group">
          <label>Instrument</label>
          <select v-model="instrument">
            <option value="guitar">Guitar</option>
            <option value="bass">Bass</option>
            <option value="ukulele">Ukulele</option>
            <option value="piano">Piano</option>
            <option value="drums">Drums</option>
          </select>
        </div>

        <div class="form-group">
          <label>Video Length</label>
          <select v-model="duration">
            <option value="short">Short (2-5 min)</option>
            <option value="medium">Medium (5-10 min)</option>
            <option value="long">Long (10-20 min)</option>
          </select>
        </div>

        <button class="generate-btn" @click="generateVideo" :disabled="!prompt.trim()">
          🎥 Generate Video Lesson
        </button>
      </div>

      <div class="generating" v-if="generating">
        <div class="spinner"></div>
        <h2>Creating Your Video...</h2>
        <p>{{ generationStatus }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>

      <div class="video-ready" v-if="videoReady">
        <h2>✅ Your Video is Ready!</h2>

        <div class="video-preview">
          <video class="native-player" :src="videoUrl" controls playsinline preload="metadata"></video>
        </div>

        <div class="video-actions">
          <button @click="downloadVideo" class="download-btn">
            📥 Download Video
          </button>
          <button @click="shareVideo" class="share-btn">
            🔗 Share
          </button>
          <button @click="resetGenerator" class="new-btn">
            ➕ Generate Another
          </button>
        </div>

        <div class="video-info">
          <h3>Lesson Details</h3>
          <p><strong>Topic:</strong> {{ prompt }}</p>
          <p><strong>Instrument:</strong> {{ instrument }}</p>
          <p><strong>Skill Level:</strong> {{ skillLevel }}</p>
          <p><strong>Duration:</strong> {{ actualDuration }}</p>
        </div>
      </div>

      <div class="recent-videos" v-if="recentVideos.length > 0">
        <h2>📚 Your Recent Lessons</h2>
        <div class="video-grid">
          <div 
            v-for="video in recentVideos" 
            :key="video.id"
            class="video-card"
            @click="loadVideo(video)"
          >
            <div class="video-thumb">
              <img :src="video.thumbnail || '/images/video-placeholder.png'" alt="Thumbnail" />
              <div class="play-overlay">▶</div>
            </div>
            <div class="video-meta">
              <h4>{{ video.title }}</h4>
              <span class="video-date">{{ formatDate(video.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AnimatedHero from './AnimatedHero.vue'
import { generateAIVideo } from '../services/aiService'

const prompt = ref('')
const skillLevel = ref('intermediate')
const instrument = ref('guitar')
const duration = ref('medium')
const generating = ref(false)
const videoReady = ref(false)
const videoUrl = ref('')
const actualDuration = ref('')
const progress = ref(0)
const generationStatus = ref('Initializing AI...')
const recentVideos = ref([])
const videoCanvas = ref(null)
const videoPlaying = ref(false)
const videoCurrentTime = ref(0)
const videoDuration = ref(180)
const videoProgress = ref(0)
let animationFrameId = null
let videoAnimationInterval = null

async function generateVideo() {
  generating.value = true
  videoReady.value = false
  progress.value = 0
  
  const statusMessages = [
    'Analyzing your request...',
    'Generating lesson script...',
    'Creating visual content...',
    'Rendering video frames...',
    'Adding audio narration...',
    'Compositing final video...',
    'Finalizing...'
  ]
  
  let messageIndex = 0
  const progressInterval = setInterval(() => {
    progress.value = Math.min(progress.value + Math.random() * 15, 95)
    if (messageIndex < statusMessages.length) {
      generationStatus.value = statusMessages[messageIndex]
      messageIndex++
    }
  }, 2000)
  
  try {
    const result = await generateAIVideo({
      prompt: prompt.value,
      skillLevel: skillLevel.value,
      instrument: instrument.value,
      duration: duration.value
    })
    
    clearInterval(progressInterval)
    progress.value = 100
    generationStatus.value = 'Complete!'
    
    setTimeout(() => {
      videoUrl.value = result.videoUrl
      actualDuration.value = result.duration
      generating.value = false
      videoReady.value = true
      videoDuration.value = (parseInt(result.duration) || 3) * 60
      
      // Save to recent
      const newVideo = {
        id: Date.now(),
        title: prompt.value.substring(0, 60),
        thumbnail: result.thumbnail,
        videoUrl: result.videoUrl,
        createdAt: new Date().toISOString()
      }
      recentVideos.value.unshift(newVideo)
      localStorage.setItem('fretpilot-videos', JSON.stringify(recentVideos.value))
    }, 500)
    
  } catch (error) {
    clearInterval(progressInterval)
    alert('Video generation failed. Please try again.')
    generating.value = false
  }
}

function downloadVideo() {
  const link = document.createElement('a')
  link.href = videoUrl.value
  link.download = `fretpilot-lesson-${Date.now()}.mp4`
  link.click()
}

function shareVideo() {
  if (navigator.share) {
    navigator.share({
      title: 'Check out my FretPilot lesson!',
      text: prompt.value,
      url: videoUrl.value
    })
  } else {
    navigator.clipboard.writeText(videoUrl.value)
    alert('Video link copied to clipboard!')
  }
}

function resetGenerator() {
  videoReady.value = false
  prompt.value = ''
}

function loadVideo(video) {
  videoUrl.value = video.videoUrl
  prompt.value = video.title
  videoReady.value = true
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function renderAnimatedLesson() {
  const canvas = videoCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = 1280
  canvas.height = 720
  
  let frame = 0
  const fps = 30
  
  function animate() {
    if (!videoPlaying.value) return
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Animated instructor avatar
    drawInstructor(ctx, frame)
    
    // Animated fretboard with highlighted notes
    drawFretboard(ctx, frame)
    
    // Animated hand positions
    drawHandPosition(ctx, frame)
    
    // Progress indicators and text
    drawLessonText(ctx, frame)
    
    frame++
    videoCurrentTime.value = frame / fps
    videoProgress.value = (videoCurrentTime.value / videoDuration.value) * 100
    
    if (videoCurrentTime.value < videoDuration.value) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      videoPlaying.value = false
    }
  }
  
  if (videoPlaying.value) {
    animate()
  }
}

function drawInstructor(ctx, frame) {
  const time = frame / 30
  
  // Instructor avatar (simplified animated person)
  const centerX = 200
  const centerY = 300
  
  // Head
  ctx.fillStyle = '#f0c6a0'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
  ctx.fill()
  
  // Eyes
  ctx.fillStyle = '#2a2a2a'
  ctx.beginPath()
  ctx.arc(centerX - 12, centerY - 5, 5, 0, Math.PI * 2)
  ctx.arc(centerX + 12, centerY - 5, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // Smile
  ctx.strokeStyle = '#2a2a2a'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY + 5, 20, 0.2, Math.PI - 0.2)
  ctx.stroke()
  
  // Body
  ctx.fillStyle = '#1e90ff'
  ctx.fillRect(centerX - 50, centerY + 40, 100, 120)
  
  // Arms (animated)
  const armSwing = Math.sin(time * 2) * 15
  ctx.strokeStyle = '#f0c6a0'
  ctx.lineWidth = 15
  ctx.beginPath()
  ctx.moveTo(centerX - 50, centerY + 60)
  ctx.lineTo(centerX - 90, centerY + 120 + armSwing)
  ctx.stroke()
  
  ctx.beginPath()
  ctx.moveTo(centerX + 50, centerY + 60)
  ctx.lineTo(centerX + 90, centerY + 120 - armSwing)
  ctx.stroke()
  
  // Speech bubble with tips
  ctx.fillStyle = '#fff'
  ctx.fillRect(centerX + 60, centerY - 60, 180, 60)
  ctx.fillStyle = '#2a2a2a'
  ctx.font = '14px Arial'
  ctx.fillText('Watch finger', centerX + 70, centerY - 35)
  ctx.fillText('placement closely!', centerX + 70, centerY - 15)
}

function drawFretboard(ctx, frame) {
  const startX = 450
  const startY = 150
  const fretWidth = 80
  const stringSpacing = 60
  const numFrets = 5
  const numStrings = 6
  
  // Fretboard background
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(startX, startY, fretWidth * numFrets, stringSpacing * (numStrings - 1))
  
  // Frets
  ctx.strokeStyle = '#d4d4d4'
  ctx.lineWidth = 3
  for (let i = 0; i <= numFrets; i++) {
    ctx.beginPath()
    ctx.moveTo(startX + i * fretWidth, startY)
    ctx.lineTo(startX + i * fretWidth, startY + stringSpacing * (numStrings - 1))
    ctx.stroke()
  }
  
  // Strings
  ctx.strokeStyle = '#c0c0c0'
  for (let i = 0; i < numStrings; i++) {
    ctx.lineWidth = 1 + i * 0.3
    ctx.beginPath()
    ctx.moveTo(startX, startY + i * stringSpacing)
    ctx.lineTo(startX + fretWidth * numFrets, startY + i * stringSpacing)
    ctx.stroke()
  }
  
  // Animated finger positions (highlight notes)
  const positions = [
    { string: 1, fret: 2 },
    { string: 2, fret: 3 },
    { string: 3, fret: 2 }
  ]
  
  const pulseSize = 15 + Math.sin(frame / 10) * 5
  positions.forEach((pos, idx) => {
    const delay = idx * 20
    if (frame > delay) {
      const x = startX + (pos.fret - 0.5) * fretWidth
      const y = startY + pos.string * stringSpacing
      
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize + 10)
      gradient.addColorStop(0, 'rgba(6, 193, 103, 0.8)')
      gradient.addColorStop(1, 'rgba(6, 193, 103, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, pulseSize + 10, 0, Math.PI * 2)
      ctx.fill()
      
      // Finger dot
      ctx.fillStyle = '#06c167'
      ctx.beginPath()
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Finger number
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText((idx + 1).toString(), x, y)
    }
  })
}

function drawHandPosition(ctx, frame) {
  const handX = 1000
  const handY = 400
  
  // Hand outline (simplified)
  ctx.fillStyle = '#f0c6a0'
  ctx.strokeStyle = '#2a2a2a'
  ctx.lineWidth = 2
  
  // Palm
  ctx.beginPath()
  ctx.ellipse(handX, handY, 60, 80, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  
  // Fingers (animated)
  const fingerBend = Math.sin(frame / 15) * 10
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(handX - 40 + i * 25, handY - 80)
    ctx.lineTo(handX - 40 + i * 25, handY - 130 + fingerBend)
    ctx.stroke()
    
    // Fingertip circles
    ctx.beginPath()
    ctx.arc(handX - 40 + i * 25, handY - 130 + fingerBend, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  
  // Thumb
  ctx.beginPath()
  ctx.moveTo(handX - 55, handY - 20)
  ctx.lineTo(handX - 90, handY - 40)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(handX - 90, handY - 40, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  
  // Label
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Proper Hand Position', handX, handY + 120)
}

function drawLessonText(ctx, frame) {
  const time = frame / 30
  const section = Math.floor(time / 10) % 4
  
  const tips = [
    'Step 1: Position your fingers',
    'Step 2: Press strings firmly',
    'Step 3: Strum downward',
    'Step 4: Practice slowly'
  ]
  
  // Title bar
  ctx.fillStyle = 'rgba(10, 10, 10, 0.9)'
  ctx.fillRect(0, 0, 1280, 80)
  
  ctx.fillStyle = '#06c167'
  ctx.font = 'bold 32px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('🎸 ' + prompt.value.substring(0, 40), 20, 50)
  
  // Current tip
  ctx.fillStyle = 'rgba(10, 10, 10, 0.9)'
  ctx.fillRect(0, 640, 1280, 80)
  
  ctx.fillStyle = '#fff'
  ctx.font = '24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(tips[section], 640, 685)
  
  // Progress bar
  const progressWidth = (time / (videoDuration.value / 30)) * 1200
  ctx.fillStyle = '#2a2a2a'
  ctx.fillRect(40, 50, 1200, 8)
  ctx.fillStyle = '#06c167'
  ctx.fillRect(40, 50, progressWidth, 8)
}

function toggleVideoPlay() {
  videoPlaying.value = !videoPlaying.value
  if (videoPlaying.value) {
    renderAnimatedLesson()
  }
}

function formatVideoTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  const saved = localStorage.getItem('fretpilot-videos')
  if (saved) {
    try {
      recentVideos.value = JSON.parse(saved)
    } catch (e) {
      recentVideos.value = []
    }
  }
})
</script>

<style scoped>
.ai-video-generator {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.page-hero {
  max-width: 400px;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(6, 193, 103, 0.3));
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #8892a6;
  font-size: 1.1em;
  margin-bottom: 40px;
}

.video-form {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #cfd6e6;
}

.form-group textarea,
.form-group select {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  font-size: 1em;
  font-family: inherit;
}

.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #06c167;
}

.generate-btn {
  width: 100%;
  background: #06c167;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover:not(:disabled) {
  background: #09a557;
  transform: translateY(-2px);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.generating {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 80px;
  height: 80px;
  border: 6px solid #2a2a2a;
  border-top-color: #06c167;
  border-radius: 50%;
  margin: 0 auto 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.generating h2 {
  margin-bottom: 10px;
}

.generating p {
  color: #8892a6;
  margin-bottom: 20px;
}

.progress-bar {
  max-width: 400px;
  height: 12px;
  background: #1a1a1a;
  border-radius: 999px;
  margin: 20px auto;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #06c167, #1e90ff);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #06c167;
  font-weight: 700;
  font-size: 1.2em;
}

.video-ready {
  text-align: center;
}

.video-ready h2 {
  margin-bottom: 30px;
}

.video-preview {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.video-preview video {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
}

.video-player {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.video-canvas {
  width: 100%;
  border-radius: 12px;
  background: #0a0a0a;
  display: block;
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px;
  background: #1a1a1a;
  border-radius: 10px;
}

.play-pause-btn {
  width: 50px;
  height: 50px;
  background: #06c167;
  border: none;
  border-radius: 50%;
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.play-pause-btn:hover {
  background: #09a557;
  transform: scale(1.1);
}

.progress-bar-video {
  flex: 1;
  height: 8px;
  background: #2a2a2a;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill-video {
  height: 100%;
  background: linear-gradient(90deg, #06c167, #1e90ff);
  border-radius: 999px;
  transition: width 0.1s linear;
}

.video-time {
  color: #8892a6;
  font-size: 0.95em;
  min-width: 100px;
  text-align: right;
}

.video-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.video-actions button {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.download-btn {
  background: #1e90ff;
  color: #fff;
}

.share-btn {
  background: #2a2a2a;
  color: #fff;
}

.new-btn {
  background: #06c167;
  color: #fff;
}

.video-actions button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.video-info {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}

.video-info h3 {
  margin-bottom: 16px;
}

.video-info p {
  color: #8892a6;
  margin-bottom: 8px;
}

.recent-videos {
  margin-top: 60px;
}

.recent-videos h2 {
  text-align: center;
  margin-bottom: 30px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.video-card {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.video-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.video-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #1a1a1a;
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: rgba(6, 193, 103, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  color: #fff;
}

.video-meta {
  padding: 12px;
}

.video-meta h4 {
  font-size: 0.95em;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-date {
  font-size: 0.85em;
  color: #8892a6;
}
</style>
