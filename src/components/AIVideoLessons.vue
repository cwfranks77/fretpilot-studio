<template>
  <div class="ai-video-lessons">
    <div class="lessons-header">
      <h1>🎬 AI Video Lessons</h1>
      <p class="subtitle">Interactive step-by-step tutorials powered by AI</p>
    </div>

    <!-- Lesson Categories -->
    <div v-if="!selectedLesson" class="categories-section">
      <div class="category-tabs">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="category-tab"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Lesson Grid -->
      <div class="lessons-grid">
        <div 
          v-for="lesson in filteredLessons" 
          :key="lesson.id"
          class="lesson-card"
          @click="selectLesson(lesson)"
        >
          <div class="lesson-thumbnail">
            <span class="lesson-icon">{{ lesson.icon }}</span>
            <span class="lesson-duration">{{ lesson.duration }}</span>
          </div>
          <div class="lesson-info">
            <h3>{{ lesson.title }}</h3>
            <p>{{ lesson.description }}</p>
            <div class="lesson-meta">
              <span class="difficulty" :class="lesson.difficulty">{{ lesson.difficulty }}</span>
              <span class="steps">{{ lesson.steps.length }} steps</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lesson Player -->
    <div v-if="selectedLesson" class="lesson-player">
      <button class="back-btn" @click="selectedLesson = null">← Back to Lessons</button>
      
      <div class="player-content">
        <div class="player-header">
          <h2>{{ selectedLesson.title }}</h2>
          <p>{{ selectedLesson.description }}</p>
        </div>

        <!-- Video/Animation Area -->
        <div class="video-area">
          <div class="animation-container">
            <!-- Animated Fretboard for Guitar Lessons -->
            <div v-if="currentStep.type === 'chord' || currentStep.type === 'fretboard'" class="fretboard-animation">
              <div class="animated-fretboard">
                <div class="fret-row" v-for="string in 6" :key="string">
                  <div class="string-label">{{ ['e', 'B', 'G', 'D', 'A', 'E'][string - 1] }}</div>
                  <div 
                    v-for="fret in 5" 
                    :key="fret"
                    class="fret-cell"
                    :class="{ 
                      'has-finger': isFingerPosition(string, fret),
                      'animating': isAnimating && isFingerPosition(string, fret)
                    }"
                  >
                    <span v-if="isFingerPosition(string, fret)" class="finger-dot">
                      {{ getFingerNumber(string, fret) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="chord-name-display">{{ currentStep.chord || 'Position' }}</div>
            </div>

            <!-- Hand Position Animation -->
            <div v-if="currentStep.type === 'technique'" class="technique-animation">
              <div class="technique-visual">
                <span class="technique-icon">{{ currentStep.icon || '🤚' }}</span>
              </div>
            </div>

            <!-- Tab Display -->
            <div v-if="currentStep.tab" class="tab-display">
              <pre class="tab-notation">{{ currentStep.tab }}</pre>
            </div>

            <!-- Instruction Overlay -->
            <div class="instruction-overlay">
              <span class="step-number">Step {{ currentStepIndex + 1 }}</span>
              <h3>{{ currentStep.title }}</h3>
            </div>
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content">
          <p class="step-description">{{ currentStep.description }}</p>
          
          <div v-if="currentStep.tips?.length" class="step-tips">
            <h4>💡 Tips</h4>
            <ul>
              <li v-for="tip in currentStep.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <div v-if="currentStep.common_mistakes?.length" class="common-mistakes">
            <h4>⚠️ Common Mistakes to Avoid</h4>
            <ul>
              <li v-for="mistake in currentStep.common_mistakes" :key="mistake">{{ mistake }}</li>
            </ul>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="lesson-progress">
          <div class="progress-steps">
            <div 
              v-for="(step, i) in selectedLesson.steps" 
              :key="i"
              class="progress-dot"
              :class="{ 
                active: i === currentStepIndex, 
                completed: i < currentStepIndex,
                clickable: true
              }"
              @click="goToStep(i)"
            >
              <span class="dot-inner"></span>
              <span class="step-label">{{ i + 1 }}</span>
            </div>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: ((currentStepIndex + 1) / selectedLesson.steps.length * 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Navigation Controls -->
        <div class="player-controls">
          <button 
            class="nav-btn prev"
            :disabled="currentStepIndex === 0"
            @click="previousStep"
          >
            ← Previous
          </button>
          
          <button class="play-btn" @click="toggleAnimation">
            {{ isAnimating ? '⏸️ Pause' : '▶️ Play' }}
          </button>
          
          <button 
            class="nav-btn next"
            :disabled="currentStepIndex === selectedLesson.steps.length - 1"
            @click="nextStep"
          >
            Next →
          </button>
        </div>

        <!-- Auto-play Toggle -->
        <div class="autoplay-toggle">
          <label class="toggle-label">
            <input type="checkbox" v-model="autoPlay" />
            <span class="toggle-switch"></span>
            Auto-advance steps
          </label>
        </div>

        <!-- Practice Section -->
        <div class="practice-section">
          <h3>🎸 Practice Along</h3>
          <div class="practice-controls">
            <div class="tempo-control">
              <label>Practice Tempo</label>
              <div class="tempo-slider">
                <button @click="practiceTempo = Math.max(40, practiceTempo - 5)">−</button>
                <span>{{ practiceTempo }} BPM</span>
                <button @click="practiceTempo = Math.min(180, practiceTempo + 5)">+</button>
              </div>
            </div>
            <button class="practice-btn" @click="togglePracticeMode">
              {{ practiceMode ? '⏹️ Stop Practice' : '▶️ Start Practice' }}
            </button>
          </div>
          
          <div v-if="practiceMode" class="practice-metronome">
            <div class="beat-indicators">
              <span 
                v-for="beat in 4" 
                :key="beat"
                class="beat-dot"
                :class="{ active: currentBeat === beat }"
              ></span>
            </div>
          </div>
        </div>

        <!-- Lesson Complete -->
        <div v-if="currentStepIndex === selectedLesson.steps.length - 1" class="lesson-complete">
          <h3>🎉 Great Progress!</h3>
          <p>You've completed all steps in this lesson.</p>
          <div class="complete-actions">
            <button @click="currentStepIndex = 0">🔄 Restart Lesson</button>
            <button @click="selectedLesson = null" class="primary">📚 More Lessons</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Custom Lesson -->
    <div v-if="!selectedLesson" class="custom-lesson-section">
      <h3>✨ Generate Custom Lesson</h3>
      <div class="custom-form">
        <input 
          v-model="customTopic"
          type="text"
          placeholder="What do you want to learn? (e.g., 'F barre chord', 'blues licks')"
          class="custom-input"
        />
        <button class="generate-btn" @click="generateCustomLesson" :disabled="generating || !customTopic">
          {{ generating ? '✨ Generating...' : '🤖 Generate Lesson' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const selectedCategory = ref('beginner')
const selectedLesson = ref(null)
const currentStepIndex = ref(0)
const isAnimating = ref(false)
const autoPlay = ref(false)
const practiceTempo = ref(60)
const practiceMode = ref(false)
const currentBeat = ref(0)
const customTopic = ref('')
const generating = ref(false)

let animationTimer = null
let practiceInterval = null
let audioContext = null

const categories = [
  { id: 'beginner', name: 'Beginner', icon: '🌱' },
  { id: 'chords', name: 'Chords', icon: '🎸' },
  { id: 'scales', name: 'Scales', icon: '🎹' },
  { id: 'techniques', name: 'Techniques', icon: '⚡' },
  { id: 'songs', name: 'Songs', icon: '🎵' }
]

const lessons = ref([
  {
    id: 1,
    category: 'beginner',
    title: 'Your First Chord: G Major',
    description: 'Learn the G major chord - one of the most useful chords in guitar',
    icon: '🎸',
    duration: '5 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'chord',
        title: 'Hand Position',
        description: 'Place your hand behind the fretboard with your thumb centered on the back of the neck. Keep your wrist straight and fingers curved.',
        chord: 'G',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['Thumb should be behind the neck, not over it', 'Keep your palm away from the neck'],
        common_mistakes: ['Pressing too hard', 'Muting adjacent strings']
      },
      {
        type: 'chord',
        title: 'Place Your Ring Finger',
        description: 'Start with your ring finger (3) on the 6th string, 3rd fret. Press firmly just behind the fret.',
        chord: 'G',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 }
        ],
        tips: ['Press close to the fret wire', 'Use your fingertip, not the pad'],
        common_mistakes: ['Pressing on top of the fret']
      },
      {
        type: 'chord',
        title: 'Add Your Middle Finger',
        description: 'Place your middle finger (2) on the 5th string, 2nd fret.',
        chord: 'G',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 }
        ],
        tips: ['Keep fingers arched', 'Don\'t flatten your fingers'],
        common_mistakes: ['Letting the middle finger touch the 4th string']
      },
      {
        type: 'chord',
        title: 'Complete the G Chord',
        description: 'Add your pinky (4) on the 1st string, 3rd fret. Now strum all 6 strings!',
        chord: 'G',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['Strum slowly and listen to each string', 'Adjust fingers if any string buzzes'],
        common_mistakes: ['Not pressing hard enough', 'Rushing the strum']
      },
      {
        type: 'technique',
        title: 'Practice the Shape',
        description: 'Practice forming the G chord shape. Lift all fingers, then place them back. Repeat 10 times.',
        icon: '🔄',
        tips: ['Speed will come with time', 'Focus on accuracy first'],
        common_mistakes: ['Moving too fast before the shape is memorized']
      }
    ]
  },
  {
    id: 2,
    category: 'beginner',
    title: 'C Major Chord',
    description: 'Master the C major chord - essential for countless songs',
    icon: '🎸',
    duration: '5 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'chord',
        title: 'C Major Shape',
        description: 'The C chord uses 3 fingers in a diagonal pattern.',
        chord: 'C',
        fingerPositions: [
          { string: 5, fret: 3, finger: 3 },
          { string: 4, fret: 2, finger: 2 },
          { string: 2, fret: 1, finger: 1 }
        ],
        tips: ['Only strum strings 5 through 1', 'Keep fingers curved'],
        common_mistakes: ['Accidentally hitting the 6th string']
      },
      {
        type: 'chord',
        title: 'Finger Placement',
        description: 'Ring finger on 5th string 3rd fret, middle on 4th string 2nd fret, index on 2nd string 1st fret.',
        chord: 'C',
        fingerPositions: [
          { string: 5, fret: 3, finger: 3 },
          { string: 4, fret: 2, finger: 2 },
          { string: 2, fret: 1, finger: 1 }
        ],
        tips: ['Arch your fingers well', 'Let the 3rd and 1st strings ring open'],
        common_mistakes: ['Index finger muting the 1st string']
      }
    ]
  },
  {
    id: 3,
    category: 'chords',
    title: 'F Barre Chord',
    description: 'Conquer the infamous F chord with this step-by-step guide',
    icon: '💪',
    duration: '10 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'technique',
        title: 'Understanding the Barre',
        description: 'A barre chord uses one finger to press multiple strings. The index finger acts as a "moveable nut".',
        icon: '📚',
        tips: ['This takes time - be patient!', 'Strength comes from practice'],
        common_mistakes: ['Giving up too soon']
      },
      {
        type: 'chord',
        title: 'The Index Finger Barre',
        description: 'Lay your index finger flat across all 6 strings at the 1st fret. Use the bony side of your finger, not the soft pad.',
        chord: 'F',
        fingerPositions: [
          { string: 1, fret: 1, finger: 1 },
          { string: 2, fret: 1, finger: 1 },
          { string: 6, fret: 1, finger: 1 }
        ],
        tips: ['Roll your finger slightly toward the nut', 'Position close to the fret wire'],
        common_mistakes: ['Using the flat/soft part of the finger']
      },
      {
        type: 'chord',
        title: 'Complete F Major',
        description: 'While maintaining the barre, add: ring finger on 5th string 3rd fret, pinky on 4th string 3rd fret, middle on 3rd string 2nd fret.',
        chord: 'F',
        fingerPositions: [
          { string: 1, fret: 1, finger: 1 },
          { string: 2, fret: 1, finger: 1 },
          { string: 6, fret: 1, finger: 1 },
          { string: 5, fret: 3, finger: 3 },
          { string: 4, fret: 3, finger: 4 },
          { string: 3, fret: 2, finger: 2 }
        ],
        tips: ['Pull back with your arm to add pressure', 'Keep thumb behind the neck'],
        common_mistakes: ['Squeezing too hard with thumb']
      }
    ]
  },
  {
    id: 4,
    category: 'scales',
    title: 'Minor Pentatonic Scale',
    description: 'Learn the most popular scale for rock and blues soloing',
    icon: '🎵',
    duration: '8 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'fretboard',
        title: 'The Box Pattern',
        description: 'The minor pentatonic "box 1" is the foundation of rock guitar soloing. We\'ll learn it in A minor (5th fret).',
        fingerPositions: [
          { string: 6, fret: 5, finger: 1 },
          { string: 6, fret: 8, finger: 4 },
          { string: 5, fret: 5, finger: 1 },
          { string: 5, fret: 7, finger: 3 }
        ],
        tips: ['One finger per fret in this position', 'Keep your hand relaxed'],
        common_mistakes: ['Tensing up the hand']
      },
      {
        type: 'fretboard',
        title: 'Ascending Pattern',
        description: 'Play the scale going up: 6th string (5, 8), 5th string (5, 7), 4th string (5, 7), 3rd string (5, 7), 2nd string (5, 8), 1st string (5, 8).',
        tab: `e|--5--8--|
B|--5--8--|
G|--5--7--|
D|--5--7--|
A|--5--7--|
E|--5--8--|`,
        tips: ['Use alternate picking', 'Start slow with a metronome'],
        common_mistakes: ['Rushing', 'Inconsistent picking']
      }
    ]
  },
  {
    id: 5,
    category: 'techniques',
    title: 'Hammer-Ons & Pull-Offs',
    description: 'Essential legato techniques for smoother playing',
    icon: '⚡',
    duration: '7 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'technique',
        title: 'What is a Hammer-On?',
        description: 'A hammer-on is when you "hammer" a finger onto a fret to sound a note WITHOUT picking. Pick the first note, then hammer your finger down hard to sound the second.',
        icon: '🔨',
        tips: ['Hit the string with force and accuracy', 'The hammering finger creates the sound'],
        common_mistakes: ['Not hammering hard enough', 'Picking both notes']
      },
      {
        type: 'fretboard',
        title: 'Practice Hammer-Ons',
        description: 'Pick the open 1st string, then hammer your index finger onto the 1st fret. The second note should ring clearly.',
        tab: `e|--0h1--|`,
        fingerPositions: [
          { string: 1, fret: 1, finger: 1 }
        ],
        tips: ['Use your fingertip', 'Hammer right behind the fret'],
        common_mistakes: ['Weak hammer', 'Lifting the first finger too early']
      },
      {
        type: 'technique',
        title: 'What is a Pull-Off?',
        description: 'A pull-off is the opposite - you "pull" your finger off the string to sound a lower note. It\'s like plucking the string with your fretting finger.',
        icon: '↩️',
        tips: ['Pull slightly downward, not straight up', 'The pulling motion creates the sound'],
        common_mistakes: ['Just lifting the finger instead of pulling']
      }
    ]
  },
  {
    id: 6,
    category: 'songs',
    title: 'Wonderwall Intro',
    description: 'Learn the iconic intro to Oasis\'s Wonderwall',
    icon: '🎵',
    duration: '10 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'chord',
        title: 'Em7 Chord',
        description: 'The song starts with Em7. This is like an Em but with your ring and pinky on the 3rd fret.',
        chord: 'Em7',
        fingerPositions: [
          { string: 5, fret: 2, finger: 2 },
          { string: 4, fret: 2, finger: 1 },
          { string: 2, fret: 3, finger: 3 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['These two fingers stay anchored throughout the song!', 'Strum strings 6 through 1'],
        common_mistakes: ['Moving the ring and pinky fingers']
      },
      {
        type: 'chord',
        title: 'G Chord (Wonderwall version)',
        description: 'Keep fingers 3 and 4 anchored, add finger 2 to the 6th string.',
        chord: 'G',
        fingerPositions: [
          { string: 6, fret: 3, finger: 2 },
          { string: 2, fret: 3, finger: 3 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['Ring and pinky never move!', 'This makes transitions much easier'],
        common_mistakes: ['Using the standard G fingering']
      }
    ]
  }
])

const filteredLessons = computed(() => {
  return lessons.value.filter(l => l.category === selectedCategory.value)
})

const currentStep = computed(() => {
  if (!selectedLesson.value) return {}
  return selectedLesson.value.steps[currentStepIndex.value] || {}
})

function selectLesson(lesson) {
  selectedLesson.value = lesson
  currentStepIndex.value = 0
  isAnimating.value = false
}

function nextStep() {
  if (currentStepIndex.value < selectedLesson.value.steps.length - 1) {
    currentStepIndex.value++
    if (autoPlay.value) {
      startAnimation()
    }
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function goToStep(index) {
  currentStepIndex.value = index
}

function toggleAnimation() {
  if (isAnimating.value) {
    stopAnimation()
  } else {
    startAnimation()
  }
}

function startAnimation() {
  isAnimating.value = true
  
  // Auto-advance after animation
  if (autoPlay.value) {
    animationTimer = setTimeout(() => {
      if (currentStepIndex.value < selectedLesson.value.steps.length - 1) {
        nextStep()
      } else {
        stopAnimation()
      }
    }, 5000)
  }
}

function stopAnimation() {
  isAnimating.value = false
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
}

function isFingerPosition(string, fret) {
  if (!currentStep.value.fingerPositions) return false
  return currentStep.value.fingerPositions.some(p => p.string === string && p.fret === fret)
}

function getFingerNumber(string, fret) {
  if (!currentStep.value.fingerPositions) return ''
  const pos = currentStep.value.fingerPositions.find(p => p.string === string && p.fret === fret)
  return pos ? pos.finger : ''
}

function togglePracticeMode() {
  practiceMode.value = !practiceMode.value
  
  if (practiceMode.value) {
    startPracticeMetronome()
  } else {
    stopPracticeMetronome()
  }
}

function startPracticeMetronome() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  
  const beatDuration = 60000 / practiceTempo.value
  currentBeat.value = 0
  
  practiceInterval = setInterval(() => {
    currentBeat.value = (currentBeat.value % 4) + 1
    playMetronomeClick(currentBeat.value === 1)
  }, beatDuration)
}

function stopPracticeMetronome() {
  if (practiceInterval) {
    clearInterval(practiceInterval)
    practiceInterval = null
  }
  currentBeat.value = 0
}

function playMetronomeClick(accent) {
  if (!audioContext) return
  
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  
  osc.type = 'sine'
  osc.frequency.value = accent ? 1000 : 800
  
  gain.gain.setValueAtTime(accent ? 0.3 : 0.15, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
  
  osc.connect(gain)
  gain.connect(audioContext.destination)
  
  osc.start()
  osc.stop(audioContext.currentTime + 0.05)
}

async function generateCustomLesson() {
  if (!customTopic.value.trim()) return
  
  generating.value = true
  
  // Simulate AI generation (in production, this would call the AI service)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const newLesson = {
    id: Date.now(),
    category: 'custom',
    title: `Custom: ${customTopic.value}`,
    description: `AI-generated lesson for: ${customTopic.value}`,
    icon: '✨',
    duration: '5 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'technique',
        title: 'Introduction',
        description: `Let's learn about ${customTopic.value}. This custom lesson was generated based on your request.`,
        icon: '📚',
        tips: ['Take your time with each step', 'Practice slowly at first'],
        common_mistakes: ['Rushing through the material']
      },
      {
        type: 'technique',
        title: 'Practice Exercise',
        description: `Here's a practice exercise to help you master ${customTopic.value}. Repeat this exercise until it feels comfortable.`,
        icon: '🎯',
        tips: ['Use a metronome', 'Start at a slow tempo'],
        common_mistakes: ['Practicing too fast too soon']
      }
    ]
  }
  
  lessons.value.unshift(newLesson)
  selectedLesson.value = newLesson
  currentStepIndex.value = 0
  customTopic.value = ''
  generating.value = false
}

// Watch for auto-play changes
watch(autoPlay, (newVal) => {
  if (newVal && isAnimating.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
  stopPracticeMetronome()
})
</script>

<style scoped>
.ai-video-lessons {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.lessons-header {
  text-align: center;
  margin-bottom: 32px;
}

.lessons-header h1 {
  font-size: 2.5rem;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #8892a6;
  font-size: 1.1rem;
  margin: 0;
}

/* Categories */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 12px 24px;
  border-radius: 12px;
  border: 2px solid #2a2a3e;
  background: #0f1424;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  border-color: #ec4899;
  color: #fff;
}

.category-tab.active {
  border-color: #ec4899;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

/* Lesson Grid */
.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.lesson-card {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.lesson-card:hover {
  border-color: #ec4899;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.2);
}

.lesson-thumbnail {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2));
  padding: 40px;
  text-align: center;
  position: relative;
}

.lesson-icon {
  font-size: 3rem;
}

.lesson-duration {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.85rem;
}

.lesson-info {
  padding: 20px;
}

.lesson-info h3 {
  color: #fff;
  margin: 0 0 8px;
  font-size: 1.1rem;
}

.lesson-info p {
  color: #8892a6;
  margin: 0 0 12px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.lesson-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.difficulty {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty.beginner {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.difficulty.intermediate {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.difficulty.advanced {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.steps {
  color: #6b7280;
  font-size: 0.85rem;
}

/* Lesson Player */
.lesson-player {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.back-btn {
  background: none;
  border: none;
  color: #8892a6;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #ec4899;
}

.player-content {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 20px;
  padding: 32px;
}

.player-header {
  text-align: center;
  margin-bottom: 24px;
}

.player-header h2 {
  color: #fff;
  margin: 0 0 8px;
}

.player-header p {
  color: #8892a6;
  margin: 0;
}

/* Video/Animation Area */
.video-area {
  margin-bottom: 24px;
}

.animation-container {
  background: #0a0a14;
  border-radius: 16px;
  padding: 32px;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Animated Fretboard */
.fretboard-animation {
  width: 100%;
  max-width: 400px;
}

.animated-fretboard {
  background: linear-gradient(180deg, #2d1f0f, #1a1208);
  border-radius: 8px;
  padding: 16px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
}

.fret-row {
  display: flex;
  align-items: center;
  height: 36px;
  position: relative;
}

.fret-row::after {
  content: '';
  position: absolute;
  left: 40px;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, #8b7355, #a08060);
}

.string-label {
  width: 36px;
  color: #8892a6;
  font-weight: 600;
  text-align: center;
  font-size: 0.9rem;
  z-index: 1;
}

.fret-cell {
  width: 60px;
  height: 100%;
  border-right: 2px solid #4a4a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.finger-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.5);
  animation: fingerAppear 0.3s ease-out;
}

.fret-cell.animating .finger-dot {
  animation: fingerPulse 0.5s infinite;
}

@keyframes fingerAppear {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fingerPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(236, 72, 153, 0.5); }
  50% { transform: scale(1.1); box-shadow: 0 4px 25px rgba(236, 72, 153, 0.8); }
}

.chord-name-display {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #ec4899;
  margin-top: 16px;
}

/* Technique Animation */
.technique-animation {
  text-align: center;
}

.technique-visual {
  font-size: 5rem;
  animation: techniqueFloat 2s ease-in-out infinite;
}

@keyframes techniqueFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Tab Display */
.tab-display {
  width: 100%;
  margin-top: 20px;
}

.tab-notation {
  background: #0a0a14;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  color: #a5b4fc;
  font-size: 1rem;
  line-height: 1.6;
  overflow-x: auto;
}

/* Instruction Overlay */
.instruction-overlay {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: rgba(15, 20, 36, 0.9);
  border-radius: 10px;
  padding: 12px 16px;
}

.step-number {
  color: #ec4899;
  font-size: 0.85rem;
  font-weight: 600;
}

.instruction-overlay h3 {
  color: #fff;
  margin: 4px 0 0;
  font-size: 1.1rem;
}

/* Step Content */
.step-content {
  margin-bottom: 24px;
}

.step-description {
  color: #a5b4fc;
  line-height: 1.7;
  font-size: 1.05rem;
  margin: 0 0 20px;
}

.step-tips, .common-mistakes {
  background: #0a0a14;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.step-tips h4, .common-mistakes h4 {
  color: #fff;
  margin: 0 0 12px;
  font-size: 1rem;
}

.step-tips ul, .common-mistakes ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-tips li, .common-mistakes li {
  color: #8892a6;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.step-tips li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
}

.common-mistakes li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #ef4444;
}

/* Progress */
.lesson-progress {
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.progress-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.dot-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2a2a3e;
  transition: all 0.3s;
}

.progress-dot.completed .dot-inner {
  background: #10b981;
}

.progress-dot.active .dot-inner {
  background: #ec4899;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
  transform: scale(1.2);
}

.step-label {
  color: #6b7280;
  font-size: 0.8rem;
}

.progress-dot.active .step-label {
  color: #ec4899;
}

.progress-bar {
  height: 4px;
  background: #2a2a3e;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ec4899, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s;
}

/* Player Controls */
.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.nav-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 2px solid #2a2a3e;
  background: transparent;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover:not(:disabled) {
  border-color: #ec4899;
  color: #fff;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.play-btn {
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
}

/* Autoplay Toggle */
.autoplay-toggle {
  text-align: center;
  margin-bottom: 24px;
}

.toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #8892a6;
  cursor: pointer;
}

.toggle-label input {
  display: none;
}

.toggle-switch {
  width: 48px;
  height: 24px;
  background: #2a2a3e;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.toggle-label input:checked + .toggle-switch {
  background: #ec4899;
}

.toggle-label input:checked + .toggle-switch::after {
  transform: translateX(24px);
}

/* Practice Section */
.practice-section {
  background: #0a0a14;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.practice-section h3 {
  color: #fff;
  margin: 0 0 16px;
}

.practice-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.tempo-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tempo-control label {
  color: #8892a6;
}

.tempo-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tempo-slider button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #2a2a3e;
  background: transparent;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.tempo-slider button:hover {
  border-color: #ec4899;
}

.tempo-slider span {
  color: #ec4899;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
}

.practice-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 2px solid #ec4899;
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.practice-btn:hover {
  background: #ec4899;
  color: #fff;
}

.practice-metronome {
  margin-top: 20px;
  text-align: center;
}

.beat-indicators {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.beat-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2a2a3e;
  transition: all 0.1s;
}

.beat-dot.active {
  background: #ec4899;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
  transform: scale(1.2);
}

/* Lesson Complete */
.lesson-complete {
  text-align: center;
  padding: 32px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.3);
}

.lesson-complete h3 {
  color: #10b981;
  margin: 0 0 8px;
  font-size: 1.5rem;
}

.lesson-complete p {
  color: #8892a6;
  margin: 0 0 20px;
}

.complete-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.complete-actions button {
  padding: 12px 24px;
  border-radius: 10px;
  border: 2px solid #2a2a3e;
  background: transparent;
  color: #8892a6;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.complete-actions button:hover {
  border-color: #10b981;
  color: #fff;
}

.complete-actions button.primary {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  border: none;
  color: #fff;
}

/* Custom Lesson */
.custom-lesson-section {
  background: linear-gradient(135deg, #0f1424, #1a1f35);
  border: 2px solid #2a2a3e;
  border-radius: 16px;
  padding: 24px;
  margin-top: 32px;
}

.custom-lesson-section h3 {
  color: #fff;
  margin: 0 0 16px;
  text-align: center;
}

.custom-form {
  display: flex;
  gap: 12px;
}

.custom-input {
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  border: 2px solid #2a2a3e;
  background: #0a0a14;
  color: #fff;
  font-size: 1rem;
  outline: none;
}

.custom-input:focus {
  border-color: #ec4899;
}

.custom-input::placeholder {
  color: #6b7280;
}

.generate-btn {
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-video-lessons {
    padding: 16px;
  }

  .lessons-header h1 {
    font-size: 2rem;
  }

  .lessons-grid {
    grid-template-columns: 1fr;
  }

  .player-controls {
    flex-direction: column;
  }

  .practice-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .tempo-control {
    justify-content: center;
  }

  .custom-form {
    flex-direction: column;
  }
}
</style>

