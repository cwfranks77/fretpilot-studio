<template>
  <div class="ai-video-lessons">
    <!-- Teacher Introduction (when no lesson selected) -->
    <div v-if="!selectedLesson" class="teacher-intro">
      <div class="teacher-profile">
        <div class="teacher-avatar">
          <div class="avatar-image">
            <span class="avatar-initials">CF</span>
          </div>
          <div class="online-indicator"></div>
        </div>
        <div class="teacher-info">
          <h1>Learn with Coach Charles</h1>
          <p class="teacher-title">Professional Music Instructor • 15+ Years Experience</p>
          <div class="teacher-stats">
            <div class="stat">
              <span class="stat-value">12,000+</span>
              <span class="stat-label">Students Taught</span>
            </div>
            <div class="stat">
              <span class="stat-value">500+</span>
              <span class="stat-label">Lessons Created</span>
            </div>
            <div class="stat">
              <span class="stat-value">4.9★</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>
        </div>
      </div>
      <div class="teacher-message">
        <p>"Hey there! I'm Charles, and I'll be your personal music coach. I've been teaching guitar, piano, and bass for over 15 years, and I'm excited to help you on your musical journey. Let's make some music together!"</p>
      </div>
    </div>

    <!-- Instrument Selector -->
    <div v-if="!selectedLesson" class="instrument-selector">
      <h3>What instrument are you learning?</h3>
      <div class="instrument-buttons">
        <button 
          v-for="inst in instruments" 
          :key="inst.id"
          :class="['instrument-btn', { active: selectedInstrument === inst.id }]"
          @click="selectedInstrument = inst.id"
        >
          <span class="inst-icon">{{ inst.icon }}</span>
          <span class="inst-name">{{ inst.name }}</span>
        </button>
      </div>
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
            <div class="teacher-mini">CF</div>
            <span class="lesson-icon">{{ lesson.icon }}</span>
            <span class="lesson-duration">{{ lesson.duration }}</span>
            <div class="play-overlay">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.6)"/>
                <path d="M32 24L20 32V16L32 24Z" fill="white"/>
              </svg>
            </div>
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
      <button class="back-btn" @click="selectedLesson = null">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Back to Lessons
      </button>
      
      <div class="player-content">
        <!-- Video Area with Teacher -->
        <div class="video-container">
          <div class="video-area">
            <!-- Teacher Video Frame -->
            <div class="teacher-video">
              <div class="teacher-cam">
                <div class="cam-avatar">CF</div>
                <div class="speaking-indicator" :class="{ active: isSpeaking }"></div>
              </div>
              <div class="teacher-speech">
                <p class="speech-bubble">{{ currentStep.teacherSays || currentStep.description }}</p>
              </div>
            </div>

            <!-- Animation/Demo Area -->
            <div class="demo-area">
              <!-- Animated Fretboard for Guitar/Bass/Ukulele -->
              <div v-if="currentStep.type === 'chord' || currentStep.type === 'fretboard'" class="fretboard-demo">
                <div class="fretboard-visual">
                  <div class="fret-row" v-for="string in stringCount" :key="string">
                    <div class="string-label">{{ getStringLabel(string) }}</div>
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

              <!-- Piano Keys -->
              <div v-else-if="selectedInstrument === 'piano'" class="piano-demo">
                <div class="piano-keys">
                  <div 
                    v-for="(key, idx) in pianoKeys" 
                    :key="idx"
                    :class="['piano-key', key.type, { active: currentStep.pianoKeys?.includes(key.note) }]"
                  >
                    <span v-if="key.type === 'white'" class="key-label">{{ key.note }}</span>
                  </div>
                </div>
              </div>

              <!-- Technique Animation -->
              <div v-else class="technique-demo">
                <div class="technique-icon">{{ currentStep.icon || '🎵' }}</div>
                <h3>{{ currentStep.title }}</h3>
              </div>
            </div>
          </div>

          <!-- Step Info Overlay -->
          <div class="step-overlay">
            <div class="step-badge">Step {{ currentStepIndex + 1 }} of {{ selectedLesson.steps.length }}</div>
            <h2>{{ currentStep.title }}</h2>
          </div>
        </div>

        <!-- Instructor Notes -->
        <div class="instructor-notes">
          <div class="notes-header">
            <div class="instructor-mini">CF</div>
            <span>Coach Charles's Notes</span>
          </div>
          <p class="step-description">{{ currentStep.description }}</p>
          
          <div v-if="currentStep.tips?.length" class="tips-section">
            <h4>💡 Pro Tips</h4>
            <ul>
              <li v-for="tip in currentStep.tips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <div v-if="currentStep.common_mistakes?.length" class="mistakes-section">
            <h4>⚠️ Watch Out For</h4>
            <ul>
              <li v-for="mistake in currentStep.common_mistakes" :key="mistake">{{ mistake }}</li>
            </ul>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-section">
          <div class="progress-dots">
            <div 
              v-for="(step, i) in selectedLesson.steps" 
              :key="i"
              class="progress-dot"
              :class="{ 
                active: i === currentStepIndex, 
                completed: i < currentStepIndex
              }"
              @click="goToStep(i)"
            >
              {{ i + 1 }}
            </div>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill"
              :style="{ width: ((currentStepIndex + 1) / selectedLesson.steps.length * 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="player-controls">
          <button 
            class="control-btn"
            :disabled="currentStepIndex === 0"
            @click="previousStep"
          >
            ← Previous
          </button>
          
          <button class="play-sound-btn" @click="playCurrentSound">
            🔊 Play Sound
          </button>
          
          <button 
            class="control-btn primary"
            @click="nextStep"
          >
            {{ currentStepIndex === selectedLesson.steps.length - 1 ? 'Complete ✓' : 'Next →' }}
          </button>
        </div>

        <!-- Completion Message -->
        <div v-if="lessonComplete" class="completion-message">
          <div class="completion-content">
            <div class="completion-avatar">CF</div>
            <h3>🎉 Great job!</h3>
            <p>"You've completed this lesson! Keep practicing and you'll have this down in no time. I'm proud of your progress!"</p>
            <div class="completion-actions">
              <button @click="currentStepIndex = 0; lessonComplete = false">🔄 Review Lesson</button>
              <button class="primary" @click="selectedLesson = null; lessonComplete = false">📚 More Lessons</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Lesson Request -->
    <div v-if="!selectedLesson" class="custom-section">
      <div class="custom-card">
        <div class="custom-header">
          <div class="custom-avatar">CF</div>
          <div>
            <h3>Request a Custom Lesson</h3>
            <p>Tell me what you want to learn, and I'll create a personalized lesson just for you!</p>
          </div>
        </div>
        <div class="custom-form">
          <input 
            v-model="customTopic"
            type="text"
            placeholder="e.g., 'Teach me the F barre chord' or 'Blues licks for beginners'"
            class="custom-input"
          />
          <button class="custom-btn" @click="generateCustomLesson" :disabled="generating || !customTopic">
            {{ generating ? 'Creating lesson...' : 'Create My Lesson' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { initAudio, playChord, playChordNotes, setInstrument, disposeAudio } from '../services/audioService'

const selectedInstrument = ref('guitar')
const selectedCategory = ref('beginner')
const selectedLesson = ref(null)
const currentStepIndex = ref(0)
const isAnimating = ref(false)
const isSpeaking = ref(false)
const lessonComplete = ref(false)
const customTopic = ref('')
const generating = ref(false)

const instruments = [
  { id: 'guitar', name: 'Guitar', icon: '🎸' },
  { id: 'piano', name: 'Piano', icon: '🎹' },
  { id: 'bass', name: 'Bass', icon: '🎸' },
  { id: 'ukulele', name: 'Ukulele', icon: '🪕' },
  { id: 'drums', name: 'Drums', icon: '🥁' },
]

const categories = [
  { id: 'beginner', name: 'Getting Started', icon: '🌱' },
  { id: 'chords', name: 'Chords', icon: '🎵' },
  { id: 'scales', name: 'Scales', icon: '🎼' },
  { id: 'techniques', name: 'Techniques', icon: '⚡' },
  { id: 'songs', name: 'Songs', icon: '🎤' }
]

const pianoKeys = [
  { note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
  { note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
  { note: 'E', type: 'white' },
  { note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
  { note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
  { note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
  { note: 'B', type: 'white' }
]

const stringCount = computed(() => {
  if (selectedInstrument.value === 'ukulele') return 4
  if (selectedInstrument.value === 'bass') return 4
  return 6
})

function getStringLabel(string) {
  if (selectedInstrument.value === 'ukulele') {
    return ['G', 'C', 'E', 'A'][string - 1]
  }
  if (selectedInstrument.value === 'bass') {
    return ['G', 'D', 'A', 'E'][string - 1]
  }
  return ['e', 'B', 'G', 'D', 'A', 'E'][string - 1]
}

const lessons = ref([
  {
    id: 1,
    category: 'beginner',
    title: 'Your First Chord: G Major',
    description: 'Learn the G chord - one of the most essential chords in music',
    icon: '🎸',
    duration: '5 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'chord',
        title: 'Getting Your Hand Position Right',
        chord: 'G',
        teacherSays: "Alright, let's start with the G chord! This is probably the most useful chord you'll ever learn. First, I want you to relax your hand and place your thumb on the back of the neck - not over the top, but centered on the back.",
        description: 'Place your hand behind the fretboard with your thumb centered on the back of the neck. Keep your wrist straight and fingers curved, like you\'re holding a tennis ball.',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['Keep your thumb behind the neck, not wrapped over the top', 'Your palm should not touch the neck', 'Curve your fingers like you\'re holding an egg'],
        common_mistakes: ['Pressing way too hard - you need less pressure than you think', 'Flattening your fingers and muting other strings']
      },
      {
        type: 'chord',
        title: 'Place Your Ring Finger First',
        chord: 'G',
        teacherSays: "Here's a little trick I teach all my students - start with your ring finger. Put it on the 6th string (that's the thickest one) at the 3rd fret. Press firmly right behind the metal fret wire, not on top of it.",
        description: 'Your ring finger (finger 3) goes on the 6th string, 3rd fret. Press firmly just behind the fret wire for the clearest sound.',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 }
        ],
        tips: ['Press close to the fret wire, not in the middle of the fret', 'Use your fingertip, not the pad'],
        common_mistakes: ['Pressing directly on the fret wire causes buzzing', 'Using too much pressure - let the fret do the work']
      },
      {
        type: 'chord',
        title: 'Add Your Middle Finger',
        chord: 'G',
        teacherSays: "Now, without moving that ring finger, add your middle finger to the 5th string, 2nd fret. Keep both fingers arched - I call it the 'claw position'. Looking good!",
        description: 'Keep your ring finger in place and add your middle finger (finger 2) to the 5th string, 2nd fret.',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 }
        ],
        tips: ['Keep your fingers arched and on their tips', 'Make sure you can see light under your fingers'],
        common_mistakes: ['Letting your middle finger accidentally touch the 4th string']
      },
      {
        type: 'chord',
        title: 'Complete the G Chord',
        chord: 'G',
        teacherSays: "Last step! Add your pinky to the 1st string, 3rd fret. Now strum all 6 strings slowly and listen - every string should ring clearly. If something buzzes, adjust your fingers. You've got this!",
        description: 'Add your pinky (finger 4) to the 1st string, 3rd fret. Strum all 6 strings and make sure each one rings clearly.',
        fingerPositions: [
          { string: 6, fret: 3, finger: 3 },
          { string: 5, fret: 2, finger: 2 },
          { string: 1, fret: 3, finger: 4 }
        ],
        tips: ['Strum slowly and listen to each string individually', 'If a string buzzes, press a little harder or adjust the angle'],
        common_mistakes: ['Rushing the strum', 'Not pressing hard enough on all strings']
      },
      {
        type: 'technique',
        title: 'Practice Makes Permanent',
        icon: '🔄',
        teacherSays: "Here's what I want you to do: lift all your fingers off, shake out your hand, then put the G chord shape back. Do this 10 times. Speed isn't important right now - muscle memory is. I'll be right here when you're ready for the next lesson!",
        description: 'Practice forming the G chord shape repeatedly. Lift all fingers, relax, then form the shape again. Repeat 10 times.',
        tips: ['Focus on accuracy before speed', 'Take breaks if your hand gets tired', 'Speed will come naturally with practice'],
        common_mistakes: ['Practicing too fast before the shape is memorized', 'Getting frustrated - learning takes time!']
      }
    ]
  },
  {
    id: 2,
    category: 'beginner',
    title: 'The C Major Chord',
    description: 'Master C major - essential for countless songs',
    icon: '🎵',
    duration: '5 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'chord',
        title: 'The C Major Shape',
        chord: 'C',
        teacherSays: "The C chord is one of my favorites because it's in SO many songs. It uses 3 fingers in a diagonal pattern. Here's the cool part - once you learn this shape, you can slide it up the neck for other chords!",
        description: 'The C chord uses 3 fingers arranged diagonally. Only strum from the 5th string down.',
        fingerPositions: [
          { string: 5, fret: 3, finger: 3 },
          { string: 4, fret: 2, finger: 2 },
          { string: 2, fret: 1, finger: 1 }
        ],
        tips: ['Only strum strings 5 through 1 - skip the 6th string', 'Keep your fingers curved'],
        common_mistakes: ['Accidentally hitting the 6th string while strumming']
      }
    ]
  },
  {
    id: 3,
    category: 'chords',
    title: 'Conquering the F Barre Chord',
    description: 'Master the chord that stops most beginners',
    icon: '💪',
    duration: '10 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'technique',
        title: 'Why the F Chord Matters',
        icon: '📚',
        teacherSays: "Okay, real talk - the F chord is where a lot of guitarists give up. But I'm going to show you exactly how to nail it. Once you get this, you can play ANY barre chord anywhere on the neck. This is a game-changer!",
        description: 'The F chord is a barre chord that uses your index finger to press all 6 strings at once. This technique unlocks the entire fretboard.',
        tips: ['This takes time - be patient with yourself', 'Strength comes from practice, not force'],
        common_mistakes: ['Giving up too soon - this chord takes weeks to master, not days']
      },
      {
        type: 'chord',
        title: 'The Index Finger Barre',
        chord: 'F',
        teacherSays: "Here's the secret nobody tells you: use the SIDE of your index finger, not the flat part. Lay your finger across all 6 strings at the 1st fret, but roll it slightly towards the nut. The bony side presses better than the soft pad.",
        description: 'Lay your index finger flat across all 6 strings at the 1st fret. Roll your finger slightly toward the headstock to use the firmer side of your finger.',
        fingerPositions: [
          { string: 1, fret: 1, finger: 1 },
          { string: 2, fret: 1, finger: 1 },
          { string: 6, fret: 1, finger: 1 }
        ],
        tips: ['Roll your finger slightly toward the nut', 'Position close to the fret wire', 'Pull back with your arm, don\'t squeeze with your thumb'],
        common_mistakes: ['Using the flat, soft part of your finger', 'Squeezing too hard with your thumb']
      }
    ]
  },
  {
    id: 4,
    category: 'scales',
    title: 'The Minor Pentatonic Scale',
    description: 'The most important scale for rock and blues',
    icon: '🎸',
    duration: '8 min',
    difficulty: 'beginner',
    steps: [
      {
        type: 'fretboard',
        title: 'The Box Pattern',
        teacherSays: "This scale is responsible for like 90% of rock guitar solos. Seriously! Once you learn this pattern, you can solo over almost any rock or blues song. We're going to learn it in A minor, starting at the 5th fret.",
        description: 'The minor pentatonic "box 1" is the foundation of rock and blues guitar. Learn it starting at the 5th fret for A minor.',
        fingerPositions: [
          { string: 6, fret: 5, finger: 1 },
          { string: 6, fret: 8, finger: 4 }
        ],
        tips: ['One finger per fret in this position', 'Keep your hand relaxed', 'Let the notes ring out clearly'],
        common_mistakes: ['Tensing up your hand', 'Moving your whole hand instead of stretching']
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

// Watch instrument changes
watch(selectedInstrument, (newInstrument) => {
  setInstrument(newInstrument)
})

function selectLesson(lesson) {
  selectedLesson.value = lesson
  currentStepIndex.value = 0
  lessonComplete.value = false
  simulateSpeaking()
}

function nextStep() {
  if (currentStepIndex.value < selectedLesson.value.steps.length - 1) {
    currentStepIndex.value++
    simulateSpeaking()
  } else {
    lessonComplete.value = true
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    simulateSpeaking()
  }
}

function goToStep(index) {
  currentStepIndex.value = index
  simulateSpeaking()
}

function simulateSpeaking() {
  isSpeaking.value = true
  setTimeout(() => {
    isSpeaking.value = false
  }, 3000)
}

async function playCurrentSound() {
  try {
    setInstrument(selectedInstrument.value)
    
    if (currentStep.value.chord) {
      await playChord(currentStep.value.chord, 'medium', 'down')
    } else if (currentStep.value.notes) {
      await playChordNotes(currentStep.value.notes)
    }
    
    // Animate the fretboard
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1500)
  } catch (e) {
    console.log('Audio error:', e)
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

async function generateCustomLesson() {
  if (!customTopic.value.trim()) return
  
  generating.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const newLesson = {
    id: Date.now(),
    category: selectedCategory.value,
    title: `Custom: ${customTopic.value}`,
    description: `Personalized lesson created just for you`,
    icon: '✨',
    duration: '5 min',
    difficulty: 'intermediate',
    steps: [
      {
        type: 'technique',
        title: 'Let\'s Learn This Together',
        icon: '🎯',
        teacherSays: `Great question! You want to learn about ${customTopic.value}. I love teaching this - let me break it down for you step by step.`,
        description: `This custom lesson on "${customTopic.value}" was created based on your request. Let's work through this together!`,
        tips: ['Take your time with each concept', 'Practice slowly before speeding up'],
        common_mistakes: ['Rushing through without mastering the basics']
      }
    ]
  }
  
  lessons.value.unshift(newLesson)
  selectedLesson.value = newLesson
  currentStepIndex.value = 0
  customTopic.value = ''
  generating.value = false
  simulateSpeaking()
}

onMounted(async () => {
  await initAudio()
  setInstrument(selectedInstrument.value)
})

onUnmounted(() => {
  disposeAudio()
})
</script>

<style scoped>
.ai-video-lessons {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

/* Teacher Introduction */
.teacher-intro {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 32px;
}

.teacher-profile {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;
}

.teacher-avatar {
  position: relative;
}

.avatar-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
}

.online-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border: 3px solid #0f172a;
  border-radius: 50%;
}

.teacher-info h1 {
  font-size: 1.8rem;
  color: #fff;
  margin: 0 0 4px;
}

.teacher-title {
  color: #94a3b8;
  margin: 0 0 16px;
}

.teacher-stats {
  display: flex;
  gap: 24px;
}

.teacher-stats .stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: #22c55e;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.teacher-message {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  position: relative;
}

.teacher-message::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 4rem;
  color: rgba(34, 197, 94, 0.3);
  font-family: Georgia, serif;
}

.teacher-message p {
  color: #cbd5e1;
  line-height: 1.7;
  margin: 0;
  font-style: italic;
}

/* Instrument Selector */
.instrument-selector {
  margin-bottom: 32px;
}

.instrument-selector h3 {
  color: #fff;
  text-align: center;
  margin: 0 0 16px;
}

.instrument-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.instrument-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.instrument-btn:hover {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.1);
}

.instrument-btn.active {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.15);
}

.inst-icon {
  font-size: 2rem;
}

.inst-name {
  color: #fff;
  font-weight: 600;
}

/* Categories */
.category-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-tab {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: #94a3b8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  border-color: rgba(34, 197, 94, 0.5);
}

.category-tab.active {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

/* Lessons Grid */
.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.lesson-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.lesson-card:hover {
  border-color: #22c55e;
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.15);
}

.lesson-thumbnail {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05));
  padding: 48px;
  text-align: center;
  position: relative;
}

.teacher-mini {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.lesson-icon {
  font-size: 3rem;
}

.lesson-duration {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.lesson-card:hover .play-overlay {
  opacity: 1;
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
  color: #94a3b8;
  margin: 0 0 12px;
  font-size: 0.9rem;
}

.lesson-meta {
  display: flex;
  gap: 12px;
}

.difficulty {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty.beginner { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
.difficulty.intermediate { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.difficulty.advanced { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.steps {
  color: #64748b;
  font-size: 0.85rem;
}

/* Lesson Player */
.lesson-player {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #22c55e;
}

.player-content {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
}

/* Video Container */
.video-container {
  position: relative;
}

.video-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 300px;
}

@media (max-width: 768px) {
  .video-area {
    grid-template-columns: 1fr;
  }
}

.teacher-video {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.teacher-cam {
  position: relative;
  width: 80px;
  height: 80px;
}

.cam-avatar {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.speaking-indicator {
  position: absolute;
  inset: -4px;
  border: 3px solid transparent;
  border-radius: 50%;
  transition: all 0.3s;
}

.speaking-indicator.active {
  border-color: #22c55e;
  animation: speakPulse 1s infinite;
}

@keyframes speakPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

.teacher-speech {
  text-align: center;
}

.speech-bubble {
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}

.demo-area {
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Fretboard Demo */
.fretboard-demo {
  width: 100%;
}

.fretboard-visual {
  background: linear-gradient(180deg, #3a2a1a, #2a1a0a);
  border-radius: 8px;
  padding: 12px;
}

.fret-row {
  display: flex;
  align-items: center;
  height: 32px;
  position: relative;
}

.fret-row::after {
  content: '';
  position: absolute;
  left: 32px;
  right: 0;
  top: 50%;
  height: 2px;
  background: linear-gradient(90deg, #a08060, #8a7050);
}

.string-label {
  width: 28px;
  color: #94a3b8;
  font-weight: 600;
  text-align: center;
  font-size: 0.8rem;
  z-index: 1;
}

.fret-cell {
  width: 50px;
  height: 100%;
  border-right: 2px solid #5a5a5a;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.finger-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
  animation: fingerAppear 0.3s ease-out;
}

.fret-cell.animating .finger-dot {
  animation: fingerPulse 0.5s infinite;
}

@keyframes fingerAppear {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes fingerPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4); }
  50% { transform: scale(1.15); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.7); }
}

.chord-name-display {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #22c55e;
  margin-top: 12px;
}

/* Piano Demo */
.piano-demo {
  width: 100%;
}

.piano-keys {
  display: flex;
  justify-content: center;
  height: 140px;
  position: relative;
}

.piano-key {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  transition: all 0.2s;
}

.piano-key.white {
  width: 36px;
  height: 140px;
  background: linear-gradient(180deg, #f5f5f5, #e0e0e0);
  border: 1px solid #999;
  border-radius: 0 0 4px 4px;
  z-index: 1;
}

.piano-key.black {
  width: 24px;
  height: 90px;
  background: linear-gradient(180deg, #333, #111);
  border-radius: 0 0 3px 3px;
  margin: 0 -12px;
  z-index: 2;
}

.piano-key.active {
  background: linear-gradient(180deg, #22c55e, #16a34a) !important;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

.key-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #333;
}

/* Technique Demo */
.technique-demo {
  text-align: center;
}

.technique-demo .technique-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.technique-demo h3 {
  color: #fff;
  margin: 0;
}

/* Step Overlay */
.step-overlay {
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
  padding: 16px 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.step-badge {
  display: inline-block;
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.step-overlay h2 {
  color: #fff;
  margin: 0;
  font-size: 1.3rem;
}

/* Instructor Notes */
.instructor-notes {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.instructor-mini {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.notes-header span {
  color: #94a3b8;
  font-weight: 600;
}

.step-description {
  color: #cbd5e1;
  line-height: 1.7;
  margin: 0 0 20px;
}

.tips-section, .mistakes-section {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.tips-section h4, .mistakes-section h4 {
  color: #fff;
  margin: 0 0 12px;
  font-size: 0.95rem;
}

.tips-section ul, .mistakes-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-section li, .mistakes-section li {
  color: #94a3b8;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.tips-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22c55e;
}

.mistakes-section li::before {
  content: '✗';
  position: absolute;
  left: 0;
  color: #ef4444;
}

/* Progress Section */
.progress-section {
  padding: 0 24px 24px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.progress-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
}

.progress-dot.completed {
  background: #22c55e;
  color: #fff;
}

.progress-dot.active {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 2px;
  transition: width 0.3s;
}

/* Player Controls */
.player-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.control-btn {
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  border-color: #22c55e;
  color: #fff;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  color: #fff;
}

.control-btn.primary:hover {
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

.play-sound-btn {
  padding: 12px 28px;
  border-radius: 10px;
  border: 2px solid #22c55e;
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.play-sound-btn:hover {
  background: #22c55e;
  color: #fff;
}

/* Completion Message */
.completion-message {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.completion-content {
  text-align: center;
  padding: 40px;
}

.completion-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin: 0 auto 20px;
}

.completion-content h3 {
  color: #fff;
  font-size: 1.8rem;
  margin: 0 0 12px;
}

.completion-content p {
  color: #94a3b8;
  font-style: italic;
  max-width: 400px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.completion-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.completion-actions button {
  padding: 12px 24px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.completion-actions button:hover {
  border-color: #22c55e;
  color: #fff;
}

.completion-actions button.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  color: #fff;
}

/* Custom Section */
.custom-section {
  margin-top: 40px;
}

.custom-card {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(22, 163, 74, 0.02));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 20px;
  padding: 24px;
}

.custom-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.custom-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.custom-header h3 {
  color: #fff;
  margin: 0 0 4px;
}

.custom-header p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.9rem;
}

.custom-form {
  display: flex;
  gap: 12px;
}

.custom-input {
  flex: 1;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 1rem;
  outline: none;
}

.custom-input:focus {
  border-color: #22c55e;
}

.custom-input::placeholder {
  color: #64748b;
}

.custom-btn {
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.custom-btn:hover:not(:disabled) {
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

.custom-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-video-lessons { padding: 16px; }
  .teacher-profile { flex-direction: column; text-align: center; }
  .teacher-stats { justify-content: center; }
  .video-area { grid-template-columns: 1fr; }
  .player-controls { flex-wrap: wrap; }
  .custom-form { flex-direction: column; }
}
</style>
