<template>
  <div class="multiplayer-jam">
    <AnimatedHero src="/images/band-stage.svg" alt="Multiplayer Jam" :float="true" :shimmer="true" :overlay="true" height="200px" />

    <div class="container">
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
        <FeatureIcons icon="multiplayer" :size="56" />
        <h1 style="margin: 0;">🎸🎤 Multiplayer Jam Sessions</h1>
      </div>
      <p class="subtitle">Play together with musicians worldwide in real-time</p>

      <!-- Connection Status -->
      <div class="connection-status" :class="{ connected: isConnected, connecting: isConnecting }">
        <span class="status-dot"></span>
        <span v-if="isConnected">Connected • {{ onlinePlayers }} players online</span>
        <span v-else-if="isConnecting">Connecting to jam server...</span>
        <span v-else>Offline • Click "Connect" to join</span>
      </div>

      <!-- Main View Tabs -->
      <div class="view-tabs">
        <button :class="{ active: currentView === 'browse' }" @click="currentView = 'browse'">
          🔍 Browse Sessions
        </button>
        <button :class="{ active: currentView === 'create' }" @click="currentView = 'create'">
          ➕ Create Session
        </button>
        <button :class="{ active: currentView === 'active' }" @click="currentView = 'active'" v-if="currentSession">
          🎵 Active Session
        </button>
        <button :class="{ active: currentView === 'band' }" @click="currentView = 'band'">
          🎸 My Bands
        </button>
      </div>

      <!-- Browse Sessions -->
      <div v-if="currentView === 'browse'" class="session-browser">
        <!-- Matched Sessions Section -->
        <div v-if="showMatchedSessions && matchedSessions.length > 0" class="matched-sessions">
          <h2>🎯 Recommended For You</h2>
          <div class="matched-grid">
            <div v-for="session in matchedSessions" :key="session.id" class="session-card matched">
              <div class="match-badge">{{ Math.round(session.matchScore) }}% Match</div>
              <div class="session-header">
                <div class="session-info">
                  <h3>{{ session.name }}</h3>
                  <p class="session-meta">
                    <span class="genre-badge">{{ session.genre }}</span>
                    <span class="skill-badge">{{ session.skillLevel }}</span>
                  </p>
                  <p class="match-reason">{{ session.matchReason }}</p>
                </div>
                <div class="session-status">
                  <span class="live-indicator" v-if="session.isLive">🔴 LIVE</span>
                  <span class="player-count">{{ session.players.length }}/{{ session.maxPlayers }} 👥</span>
                </div>
              </div>

              <p class="session-description">{{ session.description }}</p>

              <div class="session-players">
                <div v-for="player in session.players" :key="player.id" class="player-avatar" :title="player.name">
                  {{ player.instrument[0] }}
                </div>
              </div>

              <div class="session-details">
                <span>🎼 Key: {{ session.key }}</span>
                <span>⏱️ BPM: {{ session.bpm }}</span>
                <span>📍 {{ session.region }}</span>
              </div>

              <button 
                @click="joinSession(session)" 
                class="join-btn"
                :disabled="session.players.length >= session.maxPlayers || !isConnected"
              >
                {{ session.players.length >= session.maxPlayers ? '🔒 Full' : '🎸 Join Perfect Match!' }}
              </button>
            </div>
          </div>
          <button @click="showMatchedSessions = false" class="show-all-btn">Show All Sessions</button>
        </div>

        <div class="search-filters">
          <input v-model="searchQuery" placeholder="🔍 Search sessions..." />
          <select v-model="genreFilter">
            <option value="">All Genres</option>
            <option value="rock">Rock</option>
            <option value="blues">Blues</option>
            <option value="jazz">Jazz</option>
            <option value="metal">Metal</option>
            <option value="funk">Funk</option>
            <option value="pop">Pop</option>
            <option value="country">Country</option>
            <option value="classical">Classical</option>
          </select>
          <select v-model="skillFilter">
            <option value="">All Skill Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="pro">Professional</option>
          </select>
          <button v-if="!showMatchedSessions" @click="showMatchedSessions = true" class="match-btn">
            🎯 Show Matches
          </button>
        </div>

        <div class="sessions-grid">
          <div v-for="session in filteredSessions" :key="session.id" class="session-card">
            <div class="session-header">
              <div class="session-info">
                <h3>{{ session.name }}</h3>
                <p class="session-meta">
                  <span class="genre-badge">{{ session.genre }}</span>
                  <span class="skill-badge">{{ session.skillLevel }}</span>
                </p>
              </div>
              <div class="session-status">
                <span class="live-indicator" v-if="session.isLive">🔴 LIVE</span>
                <span class="player-count">{{ session.players.length }}/{{ session.maxPlayers }} 👥</span>
              </div>
            </div>

            <p class="session-description">{{ session.description }}</p>

            <div class="session-players">
              <div v-for="player in session.players" :key="player.id" class="player-avatar" :title="player.name">
                {{ player.instrument[0] }}
              </div>
            </div>

            <div class="session-details">
              <span>🎼 Key: {{ session.key }}</span>
              <span>⏱️ BPM: {{ session.bpm }}</span>
              <span>📍 {{ session.region }}</span>
            </div>

            <button 
              @click="joinSession(session)" 
              class="join-btn"
              :disabled="session.players.length >= session.maxPlayers || !isConnected"
            >
              {{ session.players.length >= session.maxPlayers ? '🔒 Full' : '🎸 Join Session' }}
            </button>
          </div>
        </div>

        <div v-if="filteredSessions.length === 0" class="empty-state">
          <h3>No sessions found</h3>
          <p>Be the first to create a jam session!</p>
          <button @click="currentView = 'create'" class="create-session-btn">Create Session</button>
        </div>
      </div>

      <!-- Create Session -->
      <div v-if="currentView === 'create'" class="create-session">
        <div class="form-card">
          <h2>Create New Jam Session</h2>
          
          <div class="form-group">
            <label>Session Name</label>
            <input v-model="newSession.name" placeholder="e.g., Blues Jam in E" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newSession.description" placeholder="What's this session about? Looking for specific instruments?"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Genre</label>
              <select v-model="newSession.genre">
                <option value="rock">Rock</option>
                <option value="blues">Blues</option>
                <option value="jazz">Jazz</option>
                <option value="metal">Metal</option>
                <option value="funk">Funk</option>
                <option value="pop">Pop</option>
                <option value="country">Country</option>
                <option value="classical">Classical</option>
              </select>
            </div>

            <div class="form-group">
              <label>Skill Level</label>
              <select v-model="newSession.skillLevel">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="pro">Professional</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Key</label>
              <select v-model="newSession.key">
                <option v-for="key in musicalKeys" :key="key">{{ key }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>BPM</label>
              <input type="number" v-model="newSession.bpm" min="40" max="200" />
            </div>

            <div class="form-group">
              <label>Max Players</label>
              <input type="number" v-model="newSession.maxPlayers" min="2" max="8" />
            </div>
          </div>

          <div class="form-group">
            <label>Your Instrument</label>
            <select v-model="newSession.myInstrument">
              <option value="Guitar">🎸 Guitar</option>
              <option value="Bass">🎸 Bass</option>
              <option value="Drums">🥁 Drums</option>
              <option value="Keys">🎹 Keyboard</option>
              <option value="Vocals">🎤 Vocals</option>
              <option value="Saxophone">🎷 Saxophone</option>
              <option value="Trumpet">🎺 Trumpet</option>
            </select>
          </div>

          <button @click="createSession" class="create-btn" :disabled="!isConnected || !newSession.name">
            🎵 Create & Start Session
          </button>
        </div>
      </div>

      <!-- Active Session -->
      <div v-if="currentView === 'active' && currentSession" class="active-session">
        <div class="session-controls">
          <div class="session-title">
            <h2>{{ currentSession.name }}</h2>
            <span class="live-indicator">🔴 LIVE</span>
          </div>

          <div class="session-params">
            <div class="param">
              <label>Key</label>
              <select v-model="currentSession.key" @change="broadcastSettings">
                <option v-for="key in musicalKeys" :key="key">{{ key }}</option>
              </select>
            </div>
            <div class="param">
              <label>BPM</label>
              <input type="number" v-model="currentSession.bpm" @change="broadcastSettings" min="40" max="200" />
            </div>
          </div>

          <div class="control-buttons">
            <button @click="toggleMetronome" :class="{ active: metronomeOn }">
              🎼 Metronome
            </button>
            <button @click="toggleMute" :class="{ active: isMuted }">
              {{ isMuted ? '🔇' : '🔊' }} {{ isMuted ? 'Unmute' : 'Mute' }}
            </button>
            <button v-if="!isRecording" @click="startRecording" class="record-btn">
              ⏺️ Record
            </button>
            <button v-else @click="stopRecording" class="recording-btn">
              ⏹️ Stop ({{ formatDuration(recordingDuration) }})
            </button>
            <button @click="leaveSession" class="leave-btn">
              🚪 Leave Session
            </button>
          </div>
        </div>

        <div class="players-stage">
          <div v-for="player in currentSession.players" :key="player.id" class="stage-player" :class="{ self: player.isSelf, talking: player.isPlaying }">
            <div class="player-avatar-large">
              {{ player.instrument[0] }}
            </div>
            <h4>{{ player.name }}</h4>
            <p class="player-instrument">{{ player.instrument }}</p>
            <div class="player-audio-meter" :style="{ width: player.audioLevel + '%' }"></div>
            <div class="player-latency">{{ player.latency }}ms</div>
          </div>
        </div>

        <div class="chat-section">
          <h3>💬 Chat</h3>
          <div class="chat-messages">
            <div v-for="msg in chatMessages" :key="msg.id" class="chat-message" :class="{ self: msg.isSelf }">
              <strong>{{ msg.playerName }}:</strong> {{ msg.text }}
            </div>
          </div>
          <div class="chat-input">
            <input v-model="chatText" @keyup.enter="sendChat" placeholder="Type a message..." />
            <button @click="sendChat">Send</button>
          </div>
        </div>
      </div>

      <!-- My Bands -->
      <div v-if="currentView === 'band'" class="my-bands">
        <!-- User Stats Card -->
        <div class="stats-card">
          <h3>📊 Your Stats</h3>
          <div class="stats-grid">
            <div class="stat">
              <div class="stat-value">{{ userStats.sessionsCompleted }}</div>
              <div class="stat-label">Sessions</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ formatDuration(userStats.practiceTime) }}</div>
              <div class="stat-label">Practice Time</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ userStats.achievementCount }}/6</div>
              <div class="stat-label">Achievements</div>
            </div>
            <div class="stat">
              <div class="stat-value">{{ userStats.favoriteGenre }}</div>
              <div class="stat-label">Favorite Genre</div>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="achievements-section">
          <h3>🏆 Achievements</h3>
          <div class="achievements-grid">
            <div v-for="achievement in achievements" :key="achievement.id" class="achievement-card" :class="{ unlocked: achievement.unlocked }">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h4>{{ achievement.name }}</h4>
                <p>{{ achievement.description }}</p>
              </div>
              <div v-if="achievement.unlocked" class="unlocked-badge">✓</div>
            </div>
          </div>
        </div>

        <div class="bands-header">
          <h2>My Bands</h2>
          <button @click="showCreateBand = true" class="create-band-btn">➕ Form New Band</button>
        </div>

        <div class="bands-grid">
          <div v-for="band in myBands" :key="band.id" class="band-card">
            <div class="band-cover" :style="{ background: band.color }">
              <h3>{{ band.name }}</h3>
            </div>
            <div class="band-info">
              <p class="band-genre">{{ band.genre }}</p>
              <div class="band-members">
                <div v-for="member in band.members" :key="member.id" class="member-chip">
                  {{ member.name }} ({{ member.instrument }})
                </div>
              </div>
              <div class="band-actions">
                <button @click="startBandSession(band)" class="practice-btn">
                  🎸 Start Practice
                </button>
                <button @click="viewBandDetails(band)" class="details-btn">
                  ⚙️ Manage
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="myBands.length === 0" class="empty-state">
          <h3>No bands yet</h3>
          <p>Form your first band and start rehearsing online!</p>
          <button @click="showCreateBand = true" class="create-band-btn">Form a Band</button>
        </div>
      </div>

      <!-- Create Band Modal -->
      <div v-if="showCreateBand" class="modal-overlay" @click="showCreateBand = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>Form a New Band</h2>
            <button @click="showCreateBand = false" class="close-btn">✕</button>
          </div>
          <div class="modal-content">
            <div class="form-group">
              <label>Band Name</label>
              <input v-model="newBand.name" placeholder="e.g., The Electric Legends" />
            </div>
            <div class="form-group">
              <label>Genre</label>
              <select v-model="newBand.genre">
                <option value="rock">Rock</option>
                <option value="blues">Blues</option>
                <option value="jazz">Jazz</option>
                <option value="metal">Metal</option>
                <option value="funk">Funk</option>
                <option value="pop">Pop</option>
              </select>
            </div>
            <div class="form-group">
              <label>Invite Members (usernames, comma-separated)</label>
              <input v-model="newBand.invites" placeholder="guitarplayer123, drummer456" />
            </div>
            <button @click="createBand" class="create-btn">🎸 Form Band</button>
          </div>
        </div>
      </div>

      <!-- Not Connected Overlay -->
      <div v-if="!isConnected && currentView !== 'browse'" class="not-connected-overlay">
        <h3>Not Connected</h3>
        <p>Connect to the jam server to access this feature</p>
        <button @click="connectToServer" class="connect-btn">Connect Now</button>
      </div>

      <!-- Achievement Notification -->
      <transition name="achievement">
        <div v-if="showAchievement && latestAchievement" class="achievement-notification">
          <div class="achievement-content">
            <div class="achievement-icon-large">{{ latestAchievement.icon }}</div>
            <div class="achievement-text">
              <h3>Achievement Unlocked!</h3>
              <p>{{ latestAchievement.name }}</p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AnimatedHero from './AnimatedHero.vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'
import multiplayerService from '../services/multiplayerService'
import matchmaking from '../services/sessionMatchmaking'

const currentView = ref('browse')
const isConnected = ref(false)
const isConnecting = ref(false)
const onlinePlayers = ref(0)
const searchQuery = ref('')
const genreFilter = ref('')
const skillFilter = ref('')
const currentSession = ref(null)
const metronomeOn = ref(false)
const isMuted = ref(false)
const chatText = ref('')
const chatMessages = ref([])
const showCreateBand = ref(false)
const isRecording = ref(false)
const recordingDuration = ref(0)
const showAchievement = ref(false)
const latestAchievement = ref(null)
const audioPermissionGranted = ref(false)
const showMatchedSessions = ref(true)

const musicalKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
                     'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm']

const newSession = ref({
  name: '',
  description: '',
  genre: 'rock',
  skillLevel: 'intermediate',
  key: 'C',
  bpm: 120,
  maxPlayers: 4,
  myInstrument: 'Guitar'
})

const newBand = ref({
  name: '',
  genre: 'rock',
  invites: ''
})

// Demo sessions
const sessions = ref([
  {
    id: 1,
    name: 'Blues Jam in E',
    description: 'Slow blues in E, looking for bass and keys. Chill vibes.',
    genre: 'blues',
    skillLevel: 'intermediate',
    key: 'E',
    bpm: 90,
    maxPlayers: 4,
    isLive: true,
    region: 'US West',
    players: [
      { id: 1, name: 'BluesGuy92', instrument: 'Guitar', audioLevel: 75, latency: 23 },
      { id: 2, name: 'JazzDrummer', instrument: 'Drums', audioLevel: 60, latency: 28 }
    ]
  },
  {
    id: 2,
    name: 'Metal Shred Session',
    description: 'Fast metal riffs, drop tuning. Need a sick drummer!',
    genre: 'metal',
    skillLevel: 'advanced',
    key: 'D',
    bpm: 180,
    maxPlayers: 5,
    isLive: true,
    region: 'EU Central',
    players: [
      { id: 3, name: 'Shredder666', instrument: 'Guitar', audioLevel: 85, latency: 15 },
      { id: 4, name: 'BassDestroyer', instrument: 'Bass', audioLevel: 70, latency: 18 },
      { id: 5, name: 'MetalHead99', instrument: 'Guitar', audioLevel: 80, latency: 20 }
    ]
  },
  {
    id: 3,
    name: 'Jazz Standards Evening',
    description: 'Playing through the Real Book. All instruments welcome.',
    genre: 'jazz',
    skillLevel: 'pro',
    key: 'Bb',
    bpm: 140,
    maxPlayers: 6,
    isLive: false,
    region: 'US East',
    players: [
      { id: 6, name: 'JazzCat', instrument: 'Saxophone', audioLevel: 65, latency: 12 }
    ]
  },
  {
    id: 4,
    name: 'Beginner Jam - All Welcome',
    description: 'Learning together! Simple chord progressions and fun.',
    genre: 'pop',
    skillLevel: 'beginner',
    key: 'G',
    bpm: 100,
    maxPlayers: 8,
    isLive: true,
    region: 'Asia Pacific',
    players: [
      { id: 7, name: 'NewbiePicker', instrument: 'Guitar', audioLevel: 45, latency: 45 },
      { id: 8, name: 'LearningSinger', instrument: 'Vocals', audioLevel: 50, latency: 42 }
    ]
  }
])

const myBands = ref([
  {
    id: 1,
    name: 'The Electric Legends',
    genre: 'rock',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    members: [
      { id: 1, name: 'You', instrument: 'Guitar' },
      { id: 2, name: 'DrummerBob', instrument: 'Drums' },
      { id: 3, name: 'BassistJane', instrument: 'Bass' }
    ]
  }
])

const filteredSessions = computed(() => {
  let filtered = sessions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.description.toLowerCase().includes(query)
    )
  }

  if (genreFilter.value) {
    filtered = filtered.filter(s => s.genre === genreFilter.value)
  }

  if (skillFilter.value) {
    filtered = filtered.filter(s => s.skillLevel === skillFilter.value)
  }

  return filtered
})

const matchedSessions = computed(() => {
  return matchmaking.findMatches(sessions.value, 3)
})

const userStats = computed(() => {
  return matchmaking.getUserStats()
})

const achievements = computed(() => {
  return matchmaking.getAchievements()
})

async function connectToServer() {
  isConnecting.value = true
  try {
    const result = await multiplayerService.connect()
    isConnected.value = true
    onlinePlayers.value = Math.floor(Math.random() * 500) + 100
    
    // Set up event listeners
    multiplayerService.on('sessionJoined', handleSessionJoined)
    multiplayerService.on('peerAudioReceived', handlePeerAudio)
    multiplayerService.on('peerLeft', handlePeerLeft)
    multiplayerService.on('chatMessage', handleChatMessage)
    multiplayerService.on('sessionUpdate', handleSessionUpdate)
    multiplayerService.on('audioLevel', handleAudioLevel)
    
    // Request audio permission
    await requestAudioPermission()
  } catch (error) {
    console.error('Connection failed:', error)
    alert('Failed to connect to multiplayer server')
  } finally {
    isConnecting.value = false
  }
}

async function requestAudioPermission() {
  try {
    const result = await multiplayerService.initAudio()
    audioPermissionGranted.value = result.success
    if (!result.success) {
      alert('Microphone access required for multiplayer jam sessions')
    }
  } catch (error) {
    console.error('Audio permission denied:', error)
  }
}

async function joinSession(session) {
  if (!isConnected.value) {
    alert('Please connect to the server first')
    return
  }
  
  if (!audioPermissionGranted.value) {
    await requestAudioPermission()
    if (!audioPermissionGranted.value) return
  }
  
  try {
    const userInfo = {
      name: 'You',
      instrument: matchmaking.userProfile.instruments[0] || 'Guitar',
      skillLevel: matchmaking.userProfile.skillLevel
    }
    
    await multiplayerService.joinSession(session.id, userInfo)
    
    currentSession.value = {
      ...session,
      players: [
        ...session.players,
        {
          id: 'self',
          ...userInfo,
          audioLevel: 0,
          latency: 0,
          isSelf: true,
          isPlaying: false
        }
      ],
      startTime: Date.now()
    }
    currentView.value = 'active'
    
    // Start audio level monitoring
    startAudioMonitoring()
  } catch (error) {
    console.error('Failed to join session:', error)
    alert('Failed to join session')
  }
}

function startAudioMonitoring() {
  const monitorInterval = setInterval(() => {
    if (!currentSession.value) {
      clearInterval(monitorInterval)
      return
    }
    
    currentSession.value.players.forEach(p => {
      p.audioLevel = Math.random() * 100
      p.isPlaying = Math.random() > 0.7
    })
  }, 100)
}

function handleSessionJoined(data) {
  console.log('Session joined:', data)
}

function handlePeerAudio({ userId, stream, audio }) {
  console.log('Peer audio received:', userId)
  // Audio element is automatically created and played
}

function handlePeerLeft({ userId }) {
  if (currentSession.value) {
    currentSession.value.players = currentSession.value.players.filter(p => p.id !== userId)
  }
}

function handleChatMessage(message) {
  chatMessages.value.push({
    id: Date.now(),
    playerName: message.from,
    text: message.message,
    isSelf: false
  })
}

function handleSessionUpdate(data) {
  if (currentSession.value) {
    Object.assign(currentSession.value, data)
  }
}

function handleAudioLevel({ userId, level }) {
  if (currentSession.value) {
    const player = currentSession.value.players.find(p => p.id === userId)
    if (player) {
      player.audioLevel = level
      player.isPlaying = level > 20
    }
  }
}

async function createSession() {
  if (!newSession.value.name) {
    alert('Please enter a session name')
    return
  }

  if (!audioPermissionGranted.value) {
    await requestAudioPermission()
    if (!audioPermissionGranted.value) return
  }

  const session = {
    id: 'session-' + Date.now(),
    name: newSession.value.name,
    description: newSession.value.description,
    genre: newSession.value.genre,
    skillLevel: newSession.value.skillLevel,
    key: newSession.value.key,
    bpm: newSession.value.bpm,
    maxPlayers: newSession.value.maxPlayers,
    isLive: true,
    region: 'Your Region',
    players: [
      {
        id: 'self',
        name: 'You',
        instrument: newSession.value.myInstrument,
        audioLevel: 0,
        latency: 0,
        isSelf: true,
        isPlaying: false
      }
    ],
    startTime: Date.now()
  }

  sessions.value.unshift(session)
  
  try {
    await multiplayerService.joinSession(session.id, {
      name: 'You',
      instrument: newSession.value.myInstrument,
      skillLevel: newSession.value.skillLevel
    })
    
    currentSession.value = session
    currentView.value = 'active'
    startAudioMonitoring()
  } catch (error) {
    console.error('Failed to create session:', error)
    alert('Failed to create session')
  }
}

function leaveSession() {
  if (currentSession.value) {
    // Record session stats
    const duration = Math.floor((Date.now() - currentSession.value.startTime) / 1000)
    matchmaking.recordSessionCompletion(currentSession.value, {
      duration,
      rating: 5 // Could add rating UI
    })
    
    multiplayerService.leaveSession()
    
    if (isRecording.value) {
      stopRecording()
    }
  }
  
  currentSession.value = null
  currentView.value = 'browse'
}

function toggleMetronome() {
  metronomeOn.value = !metronomeOn.value
  
  if (metronomeOn.value && currentSession.value) {
    multiplayerService.startMetronome(currentSession.value.bpm)
  } else {
    multiplayerService.stopMetronome()
  }
}

function toggleMute() {
  isMuted.value = !isMuted.value
  multiplayerService.toggleMute('local')
}

function broadcastSettings() {
  if (currentSession.value) {
    multiplayerService.updateSessionSettings({
      key: currentSession.value.key,
      bpm: currentSession.value.bpm
    })
    
    // Restart metronome if active
    if (metronomeOn.value) {
      multiplayerService.stopMetronome()
      multiplayerService.startMetronome(currentSession.value.bpm)
    }
  }
}

function sendChat() {
  if (!chatText.value.trim()) return
  
  chatMessages.value.push({
    id: Date.now(),
    playerName: 'You',
    text: chatText.value,
    isSelf: true
  })
  
  multiplayerService.sendChat(chatText.value)
  chatText.value = ''
}

async function startRecording() {
  if (!currentSession.value) return
  
  try {
    await multiplayerService.startRecording()
    isRecording.value = true
    recordingDuration.value = 0
    
    const recordInterval = setInterval(() => {
      if (!isRecording.value) {
        clearInterval(recordInterval)
        return
      }
      recordingDuration.value++
    }, 1000)
  } catch (error) {
    console.error('Recording failed:', error)
    alert('Failed to start recording')
  }
}

async function stopRecording() {
  if (!isRecording.value) return
  
  try {
    const result = await multiplayerService.stopRecording()
    isRecording.value = false
    
    if (result) {
      // Create download link
      const a = document.createElement('a')
      a.href = result.url
      a.download = `fretpilot-jam-${Date.now()}.webm`
      a.click()
      
      alert('Recording saved! Check your downloads.')
    }
  } catch (error) {
    console.error('Stop recording failed:', error)
  }
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function startBandSession(band) {
  // Create private session for band members
  const session = {
    id: Date.now(),
    name: `${band.name} - Practice`,
    description: 'Private band practice session',
    genre: band.genre,
    skillLevel: 'intermediate',
    key: 'C',
    bpm: 120,
    maxPlayers: band.members.length,
    isLive: true,
    region: 'Private',
    players: band.members.map(m => ({
      id: m.id,
      name: m.name,
      instrument: m.instrument,
      audioLevel: 0,
      latency: 25,
      isSelf: m.name === 'You',
      isPlaying: false
    }))
  }
  
  currentSession.value = session
  currentView.value = 'active'
}

function viewBandDetails(band) {
  alert(`Band management coming soon!\n\nBand: ${band.name}\nMembers: ${band.members.length}`)
}

function createBand() {
  if (!newBand.value.name) {
    alert('Please enter a band name')
    return
  }

  const band = {
    id: Date.now(),
    name: newBand.value.name,
    genre: newBand.value.genre,
    color: `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)} 0%, #${Math.floor(Math.random()*16777215).toString(16)} 100%)`,
    members: [
      { id: 1, name: 'You', instrument: 'Guitar' }
    ]
  }

  myBands.value.push(band)
  showCreateBand.value = false
  alert(`Band "${band.name}" created! Invitations sent to members.`)
}

onMounted(() => {
  // Auto-connect in demo mode
  setTimeout(() => connectToServer(), 500)
  
  // Listen for achievements
  if (typeof window !== 'undefined') {
    window.addEventListener('achievement-unlocked', (event) => {
      latestAchievement.value = event.detail
      showAchievement.value = true
      setTimeout(() => {
        showAchievement.value = false
      }, 5000)
    })
  }
})

onUnmounted(() => {
  multiplayerService.disconnect()
})
</script>

<style scoped>
.multiplayer-jam {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1400px;
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
  margin-bottom: 30px;
}

.connection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 24px;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  border-radius: 999px;
  margin: 0 auto 30px;
  max-width: 400px;
  font-weight: 600;
}

.connection-status.connected {
  border-color: #06c167;
  background: rgba(6, 193, 103, 0.1);
  color: #06c167;
}

.connection-status.connecting {
  border-color: #ffa500;
  color: #ffa500;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
}

.connection-status.connected .status-dot {
  background: #06c167;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.view-tabs {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.view-tabs button {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s;
}

.view-tabs button.active {
  background: #06c167;
  border-color: #06c167;
  color: #fff;
}

.view-tabs button:hover:not(.active) {
  border-color: #06c167;
  color: #06c167;
}

.search-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-filters input,
.search-filters select {
  flex: 1;
  min-width: 200px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 1em;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.session-card {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.session-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.session-info h3 {
  margin: 0 0 8px;
  font-size: 1.3em;
}

.session-meta {
  display: flex;
  gap: 8px;
}

.genre-badge,
.skill-badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85em;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
}

.session-status {
  text-align: right;
}

.live-indicator {
  display: inline-block;
  padding: 4px 12px;
  background: #ff4444;
  color: #fff;
  border-radius: 999px;
  font-size: 0.85em;
  font-weight: 700;
  margin-bottom: 8px;
}

.player-count {
  color: #8892a6;
  font-size: 0.9em;
}

.session-description {
  color: #8892a6;
  margin-bottom: 16px;
  line-height: 1.5;
}

.session-players {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.player-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2em;
}

.session-details {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  color: #8892a6;
  font-size: 0.9em;
}

.join-btn {
  width: 100%;
  background: #06c167;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.join-btn:hover:not(:disabled) {
  background: #09a557;
  transform: translateY(-2px);
}

.join-btn:disabled {
  background: #2a2a2a;
  color: #666;
  cursor: not-allowed;
}

.create-session {
  max-width: 700px;
  margin: 0 auto;
}

.form-card {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 30px;
}

.form-card h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #cfd6e6;
  font-weight: 600;
}

.form-group input,
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

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.create-btn {
  width: 100%;
  background: #06c167;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.create-btn:hover:not(:disabled) {
  background: #09a557;
  transform: translateY(-2px);
}

.create-btn:disabled {
  background: #2a2a2a;
  color: #666;
  cursor: not-allowed;
}

.active-session {
  max-width: 1200px;
  margin: 0 auto;
}

.session-controls {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.session-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.session-title h2 {
  margin: 0;
}

.session-params {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.param {
  flex: 1;
}

.param label {
  display: block;
  margin-bottom: 8px;
  color: #8892a6;
  font-size: 0.9em;
}

.param select,
.param input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
}

.control-buttons {
  display: flex;
  gap: 12px;
}

.control-buttons button {
  flex: 1;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.control-buttons button.active {
  border-color: #06c167;
  color: #06c167;
}

.control-buttons button:hover {
  border-color: #06c167;
}

.leave-btn {
  border-color: #ff4444 !important;
  color: #ff4444 !important;
}

.leave-btn:hover {
  background: #ff4444 !important;
  color: #fff !important;
}

.players-stage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stage-player {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.stage-player.talking {
  border-color: #06c167;
  box-shadow: 0 0 20px rgba(6, 193, 103, 0.3);
}

.stage-player.self {
  border-color: #667eea;
}

.player-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  font-weight: 700;
  margin: 0 auto 12px;
}

.stage-player h4 {
  margin: 0 0 6px;
}

.player-instrument {
  color: #8892a6;
  margin: 0 0 12px;
  font-size: 0.9em;
}

.player-audio-meter {
  height: 6px;
  background: #06c167;
  border-radius: 3px;
  margin-bottom: 8px;
  transition: width 0.1s;
}

.player-latency {
  color: #8892a6;
  font-size: 0.85em;
}

.chat-section {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 20px;
}

.chat-section h3 {
  margin-top: 0;
}

.chat-messages {
  height: 200px;
  overflow-y: auto;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.chat-message {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #0a0a0a;
  border-radius: 8px;
}

.chat-message.self {
  background: rgba(6, 193, 103, 0.1);
  border-left: 3px solid #06c167;
}

.chat-input {
  display: flex;
  gap: 12px;
}

.chat-input input {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
}

.chat-input button {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.bands-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.bands-header h2 {
  margin: 0;
}

.create-band-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.bands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.band-card {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.band-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.band-cover {
  padding: 40px 20px;
  text-align: center;
}

.band-cover h3 {
  margin: 0;
  font-size: 1.5em;
}

.band-info {
  padding: 20px;
}

.band-genre {
  color: #8892a6;
  margin: 0 0 16px;
}

.band-members {
  margin-bottom: 16px;
}

.member-chip {
  display: inline-block;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  padding: 6px 12px;
  border-radius: 999px;
  margin: 4px;
  font-size: 0.9em;
}

.band-actions {
  display: flex;
  gap: 12px;
}

.practice-btn,
.details-btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.practice-btn {
  background: #06c167;
  color: #fff;
  border: none;
}

.details-btn {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #8892a6;
}

.empty-state h3 {
  color: #fff;
  margin-bottom: 12px;
}

.create-session-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #2a2a2a;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: #2a2a2a;
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5em;
  cursor: pointer;
}

.modal-content {
  padding: 24px;
}

.not-connected-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  z-index: 100;
}

.connect-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
}

.matched-sessions {
  margin-bottom: 40px;
}

.matched-sessions h2 {
  margin-bottom: 20px;
}

.matched-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 20px;
}

.session-card.matched {
  border-color: #06c167;
  background: rgba(6, 193, 103, 0.05);
  position: relative;
}

.match-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #06c167;
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.85em;
  font-weight: 700;
  z-index: 10;
}

.match-reason {
  color: #06c167;
  font-size: 0.9em;
  margin-top: 6px;
}

.show-all-btn,
.match-btn {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.show-all-btn:hover,
.match-btn:hover {
  border-color: #06c167;
  color: #06c167;
}

.record-btn {
  background: #ff4444;
  border-color: #ff4444 !important;
  color: #fff !important;
}

.recording-btn {
  background: #ff4444;
  border-color: #ff4444 !important;
  color: #fff !important;
  animation: pulse-record 1.5s infinite;
}

@keyframes pulse-record {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.stats-card {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.stats-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat {
  text-align: center;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 12px;
}

.stat-value {
  font-size: 2em;
  font-weight: 700;
  color: #06c167;
  margin-bottom: 8px;
}

.stat-label {
  color: #8892a6;
  font-size: 0.9em;
}

.achievements-section {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
}

.achievements-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  border-radius: 12px;
  position: relative;
  opacity: 0.5;
  transition: all 0.3s;
}

.achievement-card.unlocked {
  opacity: 1;
  border-color: #06c167;
  background: rgba(6, 193, 103, 0.05);
}

.achievement-icon {
  font-size: 2.5em;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  border-radius: 50%;
}

.achievement-card.unlocked .achievement-icon {
  background: #06c167;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 6px;
  font-size: 1.1em;
}

.achievement-info p {
  margin: 0;
  color: #8892a6;
  font-size: 0.9em;
}

.unlocked-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #06c167;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.achievement-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 3px solid #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  max-width: 350px;
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.achievement-icon-large {
  font-size: 3em;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.achievement-text h3 {
  margin: 0 0 6px;
  font-size: 1.2em;
}

.achievement-text p {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}

.achievement-enter-active,
.achievement-leave-active {
  transition: all 0.5s;
}

.achievement-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.achievement-leave-to {
  transform: translateY(-100px);
  opacity: 0;
}
</style>
