<template>
  <div class="ai-lesson-generator">
    <div class="lesson-header">
      <h1>🤖 AI Lesson Generator</h1>
      <p class="subtitle">Get a personalized lesson tailored to your goals</p>
      <div class="ai-status" :class="aiStatus.available ? 'online' : 'offline'">
        {{ aiStatus.mode === 'ai-powered' ? '✨ AI-Powered' : '📚 Curated Lessons' }}
      </div>
    </div>

    <!-- Step 1: Skill Level -->
    <div v-if="currentStep === 1" class="setup-step">
      <h2>What's your skill level?</h2>
      <div class="option-grid">
        <button 
          v-for="level in skillLevels" 
          :key="level.id"
          class="option-card"
          :class="{ selected: preferences.skillLevel === level.id }"
          @click="selectSkillLevel(level.id)"
        >
          <span class="option-icon">{{ level.icon }}</span>
          <span class="option-title">{{ level.title }}</span>
          <span class="option-desc">{{ level.description }}</span>
        </button>
      </div>
    </div>

    <!-- Step 2: Goals -->
    <div v-if="currentStep === 2" class="setup-step">
      <h2>What do you want to achieve?</h2>
      <p class="step-hint">Select all that apply</p>
      <div class="option-grid goals">
        <button 
          v-for="goal in goals" 
          :key="goal.id"
          class="option-card small"
          :class="{ selected: preferences.goals.includes(goal.id) }"
          @click="toggleGoal(goal.id)"
        >
          <span class="option-icon">{{ goal.icon }}</span>
          <span class="option-title">{{ goal.title }}</span>
        </button>
      </div>
      <div class="nav-buttons">
        <button class="btn-back" @click="currentStep--">← Back</button>
        <button class="btn-next" @click="currentStep++" :disabled="preferences.goals.length === 0">Next →</button>
      </div>
    </div>

    <!-- Step 3: Genre -->
    <div v-if="currentStep === 3" class="setup-step">
      <h2>What music style do you prefer?</h2>
      <div class="option-grid genres">
        <button 
          v-for="genre in genres" 
          :key="genre.id"
          class="option-card small"
          :class="{ selected: preferences.genre === genre.id }"
          @click="selectGenre(genre.id)"
        >
          <span class="option-icon">{{ genre.icon }}</span>
          <span class="option-title">{{ genre.title }}</span>
        </button>
      </div>
      <div class="nav-buttons">
        <button class="btn-back" @click="currentStep--">← Back</button>
      </div>
    </div>

    <!-- Step 4: Duration -->
    <div v-if="currentStep === 4" class="setup-step">
      <h2>How much time do you have?</h2>
      <div class="duration-selector">
        <button 
          v-for="d in durations" 
          :key="d.value"
          class="duration-btn"
          :class="{ selected: preferences.duration === d.value }"
          @click="selectDuration(d.value)"
        >
          <span class="duration-time">{{ d.value }}</span>
          <span class="duration-unit">minutes</span>
          <span class="duration-label">{{ d.label }}</span>
        </button>
      </div>
      <div class="nav-buttons">
        <button class="btn-back" @click="currentStep--">← Back</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="currentStep === 5 && loading" class="loading-state">
      <div class="loading-animation">
        <div class="loading-note">🎵</div>
        <div class="loading-note delay-1">🎶</div>
        <div class="loading-note delay-2">🎵</div>
      </div>
      <h2>Creating your personalized lesson...</h2>
      <p>{{ loadingMessage }}</p>
    </div>

    <!-- Generated Lesson -->
    <div v-if="currentStep === 5 && !loading && lesson" class="lesson-display">
      <div class="lesson-hero">
        <h2>{{ lesson.title }}</h2>
        <p>{{ lesson.description }}</p>
        <div class="lesson-meta">
          <span class="meta-item">⏱️ {{ lesson.duration }} minutes</span>
          <span class="meta-item">📚 {{ lesson.exercises?.length || 0 }} exercises</span>
          <span class="meta-item">🎸 {{ lesson.songs?.length || 0 }} songs</span>
        </div>
      </div>

      <!-- Exercises -->
      <div class="lesson-section">
        <h3>📝 Exercises</h3>
        <div class="exercise-list">
          <div 
            v-for="(exercise, index) in lesson.exercises" 
            :key="index"
            class="exercise-card"
            :class="{ completed: completedExercises.includes(index) }"
          >
            <div class="exercise-header">
              <span class="exercise-number">{{ index + 1 }}</span>
              <div class="exercise-info">
                <h4>{{ exercise.name }}</h4>
                <span class="exercise-duration">{{ exercise.duration }} min</span>
              </div>
              <button 
                class="complete-btn"
                @click="toggleExercise(index)"
              >
                {{ completedExercises.includes(index) ? '✓' : '○' }}
              </button>
            </div>
            <p class="exercise-desc">{{ exercise.description }}</p>
            <div v-if="exercise.chords?.length" class="exercise-chords">
              <span class="chord-tag" v-for="chord in exercise.chords" :key="chord">{{ chord }}</span>
            </div>
            <div v-if="exercise.tips?.length" class="exercise-tips">
              <div class="tip" v-for="(tip, i) in exercise.tips" :key="i">💡 {{ tip }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Songs to Practice -->
      <div v-if="lesson.songs?.length" class="lesson-section">
        <h3>🎵 Songs to Practice</h3>
        <div class="song-list">
          <div v-for="song in lesson.songs" :key="song.title" class="song-card">
            <div class="song-info">
              <h4>{{ song.title }}</h4>
              <span class="song-artist">{{ song.artist }}</span>
            </div>
            <span class="song-difficulty" :class="song.difficulty">{{ song.difficulty }}</span>
            <div class="song-chords">
              <span class="chord-mini" v-for="chord in song.chords" :key="chord">{{ chord }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Techniques -->
      <div v-if="lesson.techniques?.length" class="lesson-section techniques">
        <h3>🎯 Techniques You'll Learn</h3>
        <div class="technique-tags">
          <span class="technique-tag" v-for="tech in lesson.techniques" :key="tech">{{ tech }}</span>
        </div>
      </div>

      <!-- Next Steps -->
      <div v-if="lesson.nextSteps" class="lesson-section next-steps">
        <h3>🚀 What's Next?</h3>
        <p>{{ lesson.nextSteps }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="lesson-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <span class="progress-text">{{ completedExercises.length }} / {{ lesson.exercises?.length || 0 }} exercises completed</span>
      </div>

      <!-- Actions -->
      <div class="lesson-actions">
        <button class="btn-secondary" @click="resetGenerator">Generate New Lesson</button>
        <button class="btn-primary" @click="saveLesson" v-if="!saved">💾 Save Lesson</button>
        <span v-else class="saved-badge">✓ Saved!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { generateLessonPlan, getAIStatus } from '../services/aiService'

const currentStep = ref(1)
const loading = ref(false)
const loadingMessage = ref('Analyzing your preferences...')
const lesson = ref(null)
const saved = ref(false)
const completedExercises = ref([])
const aiStatus = ref(getAIStatus())

const preferences = ref({
  skillLevel: '',
  goals: [],
  genre: '',
  duration: 30
})

const skillLevels = [
  { id: 'beginner', icon: '🌱', title: 'Beginner', description: 'Just starting out or learning basics' },
  { id: 'intermediate', icon: '🌿', title: 'Intermediate', description: 'Know basics, working on songs' },
  { id: 'advanced', icon: '🌳', title: 'Advanced', description: 'Experienced, refining technique' }
]

const goals = [
  { id: 'learn chords', icon: '🎸', title: 'Learn Chords' },
  { id: 'play songs', icon: '🎵', title: 'Play Songs' },
  { id: 'improve speed', icon: '⚡', title: 'Improve Speed' },
  { id: 'learn scales', icon: '🎹', title: 'Learn Scales' },
  { id: 'music theory', icon: '📖', title: 'Music Theory' },
  { id: 'fingerpicking', icon: '🤌', title: 'Fingerpicking' },
  { id: 'soloing', icon: '🎤', title: 'Soloing' },
  { id: 'rhythm', icon: '🥁', title: 'Rhythm' }
]

const genres = [
  { id: 'rock', icon: '🎸', title: 'Rock' },
  { id: 'pop', icon: '🎤', title: 'Pop' },
  { id: 'blues', icon: '🎷', title: 'Blues' },
  { id: 'country', icon: '🤠', title: 'Country' },
  { id: 'jazz', icon: '🎺', title: 'Jazz' },
  { id: 'metal', icon: '🤘', title: 'Metal' },
  { id: 'folk', icon: '🪕', title: 'Folk' },
  { id: 'classical', icon: '🎻', title: 'Classical' }
]

const durations = [
  { value: 15, label: 'Quick session' },
  { value: 30, label: 'Standard practice' },
  { value: 45, label: 'Deep dive' },
  { value: 60, label: 'Full workout' }
]

const progressPercent = computed(() => {
  if (!lesson.value?.exercises?.length) return 0
  return (completedExercises.value.length / lesson.value.exercises.length) * 100
})

function selectSkillLevel(level) {
  preferences.value.skillLevel = level
  currentStep.value = 2
}

function toggleGoal(goal) {
  const index = preferences.value.goals.indexOf(goal)
  if (index === -1) {
    preferences.value.goals.push(goal)
  } else {
    preferences.value.goals.splice(index, 1)
  }
}

function selectGenre(genre) {
  preferences.value.genre = genre
  currentStep.value = 4
}

async function selectDuration(duration) {
  preferences.value.duration = duration
  currentStep.value = 5
  await generateLesson()
}

async function generateLesson() {
  loading.value = true
  const messages = [
    'Analyzing your preferences...',
    'Selecting exercises for your level...',
    'Finding songs in your style...',
    'Crafting your personalized lesson...'
  ]
  
  let i = 0
  const messageInterval = setInterval(() => {
    loadingMessage.value = messages[++i % messages.length]
  }, 1500)

  try {
    lesson.value = await generateLessonPlan({
      skillLevel: preferences.value.skillLevel,
      goals: preferences.value.goals,
      genre: preferences.value.genre,
      duration: preferences.value.duration
    })
  } catch (error) {
    console.error('Failed to generate lesson:', error)
  } finally {
    clearInterval(messageInterval)
    loading.value = false
  }
}

function toggleExercise(index) {
  const idx = completedExercises.value.indexOf(index)
  if (idx === -1) {
    completedExercises.value.push(index)
  } else {
    completedExercises.value.splice(idx, 1)
  }
}

function saveLesson() {
  try {
    const savedLessons = JSON.parse(localStorage.getItem('fp_saved_lessons') || '[]')
    savedLessons.push({
      ...lesson.value,
      savedAt: new Date().toISOString(),
      preferences: { ...preferences.value }
    })
    localStorage.setItem('fp_saved_lessons', JSON.stringify(savedLessons))
    saved.value = true
  } catch (e) {
    console.error('Failed to save lesson:', e)
  }
}

function resetGenerator() {
  currentStep.value = 1
  lesson.value = null
  saved.value = false
  completedExercises.value = []
  preferences.value = {
    skillLevel: '',
    goals: [],
    genre: '',
    duration: 30
  }
}

onMounted(() => {
  aiStatus.value = getAIStatus()
})
</script>

<style scoped>
.ai-lesson-generator {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.lesson-header {
  text-align: center;
  margin-bottom: 40px;
}

.lesson-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #8892a6;
  font-size: 1.1rem;
  margin: 0 0 16px;
}

.ai-status {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.ai-status.online {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.ai-status.offline {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Setup Steps */
.setup-step {
  text-align: center;
}

.setup-step h2 {
  font-size: 1.8rem;
  color: #fff;
  margin: 0 0 24px;
}

.step-hint {
  color: #8892a6;
  margin: -16px 0 24px;
  font-size: 0.95rem;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 700px;
  margin: 0 auto;
}

.option-grid.goals,
.option-grid.genres {
  grid-template-columns: repeat(4, 1fr);
}

.option-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.option-card:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
}

.option-card.selected {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #1a1f35, #252a45);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
}

.option-card.small {
  padding: 16px 12px;
}

.option-icon {
  font-size: 2rem;
}

.option-card.small .option-icon {
  font-size: 1.5rem;
}

.option-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.option-card.small .option-title {
  font-size: 0.9rem;
}

.option-desc {
  font-size: 0.85rem;
  color: #8892a6;
  text-align: center;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.btn-back, .btn-next {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-back {
  background: #1a1f35;
  color: #8892a6;
}

.btn-back:hover {
  background: #252a45;
  color: #fff;
}

.btn-next {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
}

.btn-next:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Duration Selector */
.duration-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 700px;
  margin: 0 auto;
}

.duration-btn {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.duration-btn:hover {
  border-color: #6366f1;
  transform: translateY(-4px);
}

.duration-btn.selected {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #1a1f35, #252a45);
}

.duration-time {
  font-size: 2.5rem;
  font-weight: 700;
  color: #8b5cf6;
}

.duration-unit {
  font-size: 0.85rem;
  color: #8892a6;
}

.duration-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 4px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-animation {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.loading-note {
  font-size: 3rem;
  animation: bounce 1s infinite;
}

.loading-note.delay-1 {
  animation-delay: 0.2s;
}

.loading-note.delay-2 {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.loading-state h2 {
  color: #fff;
  margin: 0 0 8px;
}

.loading-state p {
  color: #8892a6;
}

/* Lesson Display */
.lesson-display {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.lesson-hero {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
}

.lesson-hero h2 {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 12px;
}

.lesson-hero p {
  color: #a5b4fc;
  margin: 0 0 20px;
  font-size: 1.1rem;
}

.lesson-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  color: #8892a6;
  font-size: 0.95rem;
}

/* Lesson Sections */
.lesson-section {
  margin-bottom: 32px;
}

.lesson-section h3 {
  font-size: 1.4rem;
  color: #fff;
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #2a2a3e;
}

/* Exercise Cards */
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exercise-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.exercise-card.completed {
  border-color: #10b981;
  background: linear-gradient(135deg, #0f1424, #0f2922);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.exercise-number {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.exercise-card.completed .exercise-number {
  background: linear-gradient(135deg, #10b981, #059669);
}

.exercise-info {
  flex: 1;
}

.exercise-info h4 {
  margin: 0;
  color: #fff;
  font-size: 1.1rem;
}

.exercise-duration {
  color: #8892a6;
  font-size: 0.85rem;
}

.complete-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #3a3a4e;
  background: transparent;
  color: #8892a6;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.complete-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.exercise-card.completed .complete-btn {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
}

.exercise-desc {
  color: #a5b4fc;
  margin: 0 0 12px;
  line-height: 1.6;
}

.exercise-chords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.chord-tag {
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.exercise-tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tip {
  color: #fbbf24;
  font-size: 0.85rem;
}

/* Song List */
.song-list {
  display: grid;
  gap: 12px;
}

.song-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 16px;
}

.song-info h4 {
  margin: 0;
  color: #fff;
  font-size: 1rem;
}

.song-artist {
  color: #8892a6;
  font-size: 0.85rem;
}

.song-difficulty {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.song-difficulty.easy {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.song-difficulty.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.song-difficulty.hard {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.song-chords {
  display: flex;
  gap: 6px;
}

.chord-mini {
  background: #2a2a3e;
  color: #8892a6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Techniques */
.technique-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.technique-tag {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  color: #a5b4fc;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 500;
}

/* Next Steps */
.next-steps {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  padding: 24px;
}

.next-steps h3 {
  border: none;
  padding: 0;
  margin-bottom: 12px;
}

.next-steps p {
  color: #6ee7b7;
  margin: 0;
  line-height: 1.6;
}

/* Progress Bar */
.lesson-progress {
  margin: 32px 0;
}

.progress-bar {
  height: 8px;
  background: #1a1f35;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  display: block;
  text-align: center;
  color: #8892a6;
  margin-top: 8px;
  font-size: 0.9rem;
}

/* Actions */
.lesson-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: #1a1f35;
  color: #a5b4fc;
  border: 2px solid #2a2a3e;
}

.btn-secondary:hover {
  border-color: #6366f1;
  color: #fff;
}

.saved-badge {
  color: #10b981;
  font-weight: 600;
  padding: 14px 28px;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-lesson-generator {
    padding: 16px;
  }

  .lesson-header h1 {
    font-size: 2rem;
  }

  .option-grid {
    grid-template-columns: 1fr;
  }

  .option-grid.goals,
  .option-grid.genres {
    grid-template-columns: repeat(2, 1fr);
  }

  .duration-selector {
    grid-template-columns: repeat(2, 1fr);
  }

  .song-card {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>

