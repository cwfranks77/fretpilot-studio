<template>
  <div class="ai-video-lessons">
    <!-- Header -->
    <div class="header">
      <h1>🎵 AI Music Lessons</h1>
      <p class="subtitle">Learn any instrument with AI-powered guidance</p>
      <div class="subscription-badge" :class="subscriptionTier">
        {{ tierLimits.name }}
        <span v-if="subscriptionTier === 'free'" class="upgrade-hint">
          {{ dailyRemaining }}/{{ tierLimits.videosPerDay }} lessons today
        </span>
      </div>
    </div>

    <!-- Instrument Selector -->
    <div class="instrument-selector">
      <h2>Choose Your Instrument</h2>
      <div class="search-box">
        <input 
          v-model="instrumentSearch" 
          @input="filterInstruments"
          placeholder="Search for any instrument (guitar, piano, drums, violin, etc.)"
          class="search-input"
        />
      </div>
      
      <div class="instruments-grid">
        <div 
          v-for="instrument in filteredInstruments" 
          :key="instrument.id"
          class="instrument-card"
          :class="{ active: selectedInstrument?.id === instrument.id }"
          @click="selectInstrument(instrument)"
        >
          <div class="instrument-icon">{{ instrument.icon }}</div>
          <div class="instrument-name">{{ instrument.name }}</div>
          <div class="instrument-lessons">{{ instrument.lessonCount }} lessons</div>
        </div>
      </div>
    </div>

    <!-- Tier Gate / Upgrade Prompt -->
    <div v-if="showUpgradePrompt" class="upgrade-prompt">
      <div class="prompt-content">
        <h2>🚀 Unlock Premium Features</h2>
        <p v-if="upgradeReason === 'daily_limit_reached'">
          You've reached your daily limit of {{ tierLimits.videosPerDay }} lessons.
        </p>
        <p v-else-if="upgradeReason === 'feature_locked'">
          {{ lockedFeatureMessage }}
        </p>
        <button @click="showPricing = true" class="btn-upgrade">
          View Plans & Upgrade
        </button>
        <button @click="showUpgradePrompt = false" class="btn-close">Maybe Later</button>
      </div>
    </div>

    <!-- Pricing Modal -->
    <div v-if="showPricing" class="pricing-modal" @click.self="showPricing = false">
      <div class="pricing-content">
        <button @click="showPricing = false" class="close-btn">✕</button>
        <h2>Choose Your Plan</h2>
        
        <div class="pricing-tiers">
          <div 
            v-for="(limits, tier) in allTierLimits" 
            :key="tier"
            class="tier-card"
            :class="{ current: tier === subscriptionTier, recommended: tier === 'premium' }"
          >
            <div v-if="tier === 'premium'" class="recommended-badge">Most Popular</div>
            <h3>{{ limits.name }}</h3>
            <div class="price">
              <span class="amount">${{ limits.price }}</span>
              <span v-if="limits.price > 0" class="period">/month</span>
            </div>
            
            <ul class="features">
              <li v-for="(feature, idx) in limits.features" :key="idx">
                ✓ {{ feature }}
              </li>
            </ul>
            
            <button 
              v-if="tier !== subscriptionTier"
              @click="selectTier(tier, limits)"
              class="btn-select"
            >
              {{ tier === 'free' ? 'Current Plan' : 'Subscribe' }}
            </button>
            <div v-else class="current-badge">Current Plan</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player -->
    <div v-if="!selectedInstrument" class="no-selection">
      <div class="empty-state">
        <div class="empty-icon">🎼</div>
        <h3>Select an instrument to get started</h3>
        <p>Choose from popular instruments above or search for any instrument you'd like to learn</p>
      </div>
    </div>

    <div v-if="currentLesson" class="video-player-container">
      <div class="video-wrapper">
        <!-- AI-Generated Canvas Lesson -->
        <div v-if="currentLesson.videoUrl === 'ai-generated'" class="ai-lesson-canvas">
          <canvas ref="lessonCanvas" class="lesson-canvas"></canvas>
          
          <!-- Real-time Monitoring Overlay -->
          <div class="ai-monitoring-overlay">
            <div class="monitoring-status" :class="{ active: isMonitoring }">
              <div class="status-indicator"></div>
              <span>{{ isMonitoring ? '🎸 AI Monitoring Active' : '⏸ Paused' }}</span>
            </div>
            
            <!-- Mistake Detection Alerts -->
            <div v-if="currentMistake" class="mistake-alert">
              <div class="alert-header">
                <span class="icon">⚠️</span>
                <strong>Detected Issue</strong>
              </div>
              <p>{{ currentMistake.description }}</p>
              <button @click="showCorrection(currentMistake)" class="btn-correction">Show How to Fix</button>
            </div>
            
            <!-- Real-time Metrics -->
            <div class="realtime-metrics">
              <div class="metric">
                <span class="label">Accuracy</span>
                <div class="meter">
                  <div class="meter-fill" :style="{ width: accuracy + '%' }"></div>
                </div>
                <span class="value">{{ accuracy }}%</span>
              </div>
              <div class="metric">
                <span class="label">Timing</span>
                <div class="meter">
                  <div class="meter-fill timing" :style="{ width: timingScore + '%' }"></div>
                </div>
                <span class="value">{{ timingScore }}%</span>
              </div>
            </div>
            
            <!-- Current Exercise Info -->
            <div v-if="currentExercise" class="exercise-info">
              <h4>{{ currentExercise.chord || currentExercise.pattern || currentExercise.technique }}</h4>
              <p>{{ currentExercise.instruction }}</p>
            </div>
          </div>
          
          <!-- Play/Pause Controls -->
          <div class="ai-lesson-controls">
            <button @click="toggleAILesson" class="btn-play-pause">
              {{ aiLessonPlaying ? '⏸ Pause' : '▶️ Start Lesson' }}
            </button>
            <button @click="requestMicPermission" class="btn-mic" :class="{ active: micEnabled }">
              {{ micEnabled ? '🎤 Listening...' : '🎤 Enable Mic' }}
            </button>
            <button @click="resetLesson" class="btn-reset">🔄 Restart</button>
          </div>
        </div>
        
        <!-- No video players for AI-generated lessons -->
        <div v-else class="no-video-message">
          <p>⚠️ This lesson type is not yet available. Please select an AI-generated lesson.</p>
        </div>
      </div>

      <!-- Lesson Info -->
      <div class="lesson-info">
        <h2>{{ currentLesson.title }}</h2>
        <div class="lesson-meta">
          <span class="difficulty" :class="currentLesson.difficulty">
            {{ currentLesson.difficulty }}
          </span>
          <span class="duration">⏱ {{ currentLesson.duration }}</span>
          <span class="instructor">👤 {{ currentLesson.instructor }}</span>
        </div>
        <p class="description">{{ currentLesson.description }}</p>
      </div>

      <!-- AI Feedback Panel (Premium+) -->
      <div v-if="hasFeature('aiAnalysis')" class="ai-feedback-panel">
        <h3>🤖 AI Coach Feedback</h3>
        
        <!-- Real-time Technique Analysis -->
        <div v-if="realtimeFeedback" class="feedback-item realtime">
          <div class="feedback-header">
            <span class="icon">👁️</span>
            <strong>Live Analysis</strong>
          </div>
          <p>{{ realtimeFeedback }}</p>
        </div>

        <!-- Pose Detection (Pro) -->
        <div v-if="hasFeature('poseDetection') && poseAnalysis" class="feedback-item pose">
          <div class="feedback-header">
            <span class="icon">🎯</span>
            <strong>Hand Position</strong>
            <span class="score" :class="poseAnalysis.scoreClass">
              {{ poseAnalysis.score }}%
            </span>
          </div>
          <ul>
            <li v-for="(tip, idx) in poseAnalysis.tips" :key="idx">{{ tip }}</li>
          </ul>
        </div>

        <!-- Practice Tips -->
        <div class="feedback-item tips">
          <div class="feedback-header">
            <span class="icon">💡</span>
            <strong>Pro Tips</strong>
          </div>
          <ul>
            <li v-for="(tip, idx) in currentTips" :key="idx">{{ tip }}</li>
          </ul>
        </div>

        <!-- Adaptive Difficulty (Premium+) -->
        <div v-if="hasFeature('adaptiveDifficulty')" class="adaptive-controls">
          <h4>⚡ Adaptive Difficulty</h4>
          <p class="adaptive-status">{{ adaptiveStatus }}</p>
          <div class="difficulty-slider">
            <button @click="adjustDifficulty(-1)" :disabled="currentDifficulty === 1">-</button>
            <div class="difficulty-bar">
              <div 
                class="difficulty-fill" 
                :style="{ width: (currentDifficulty * 20) + '%' }"
              ></div>
            </div>
            <button @click="adjustDifficulty(1)" :disabled="currentDifficulty === 5">+</button>
          </div>
          <span class="difficulty-label">Level {{ currentDifficulty }}/5</span>
        </div>
      </div>

      <!-- Progress Tracking -->
      <div class="progress-section">
        <h3>📊 Your Progress</h3>
        <div class="progress-stats">
          <div class="stat">
            <span class="value">{{ lessonProgress }}%</span>
            <span class="label">Completed</span>
          </div>
          <div class="stat">
            <span class="value">{{ practiceTime }}</span>
            <span class="label">Practice Time</span>
          </div>
          <div class="stat">
            <span class="value">{{ masteryScore }}</span>
            <span class="label">Mastery</span>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: lessonProgress + '%' }"></div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="markComplete" class="btn-complete" :disabled="lessonProgress < 80">
          ✓ Mark Complete
        </button>
        <button 
          v-if="hasFeature('downloadVideos')" 
          @click="downloadLesson"
          class="btn-download"
        >
          ⬇ Download for Offline
        </button>
        <button @click="addToPlaylist" class="btn-playlist">
          + Add to Playlist
        </button>
      </div>
    </div>

    <!-- Lesson Library -->
    <div v-else class="lesson-library">
      <!-- AI Video Generation Prompt -->
      <div class="ai-generation-prompt">
        <div class="prompt-icon">🤖</div>
        <div class="prompt-content">
          <h3>Generate Custom {{ selectedInstrument ? selectedInstrument.name : '' }} Lessons</h3>
          <p>Create personalized video lessons with AI, or connect with a live instructor for 1-on-1 sessions.</p>
          <div class="action-buttons-row">
            <button @click="showAIGenerator = true" class="btn-generate-ai">
              🎬 Generate AI Video Lesson
            </button>
            <button @click="showInstructorConnect = true" class="btn-connect-instructor">
              👤 Connect with Instructor
            </button>
          </div>
        </div>
      </div>

      <div class="filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="🔍 Search lessons..."
          class="search-input"
        />
        <select v-model="filterDifficulty" class="filter-select">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="technique">Technique</option>
          <option value="theory">Theory</option>
          <option value="songs">Songs</option>
          <option value="improvisation">Improvisation</option>
          <option value="ear-training">Ear Training</option>
        </select>
      </div>

      <!-- Personalized Recommendations (Premium+) -->
      <div v-if="hasFeature('personalizedRecommendations')" class="recommendations">
        <h2>🎯 Recommended for You</h2>
        <div class="lesson-grid">
          <div 
            v-for="lesson in recommendedLessons" 
            :key="lesson.id"
            class="lesson-card recommended"
            @click="selectLesson(lesson)"
          >
            <div class="lesson-thumbnail">
              <img :src="lesson.thumbnail" :alt="lesson.title" />
              <div class="duration-badge">{{ lesson.duration }}</div>
              <div class="ai-badge">🤖 AI Recommended</div>
            </div>
            <div class="lesson-details">
              <h3>{{ lesson.title }}</h3>
              <p class="instructor">{{ lesson.instructor }}</p>
              <div class="lesson-meta">
                <span class="difficulty" :class="lesson.difficulty">
                  {{ lesson.difficulty }}
                </span>
                <span class="match">{{ lesson.matchScore }}% match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Lessons -->
      <div class="all-lessons">
        <h2>📚 {{ selectedInstrument ? selectedInstrument.name : 'All' }} Lessons</h2>
        <div v-if="selectedInstrument && selectedInstrument.id !== 'guitar' && filteredLessons.length === 0" class="coming-soon-notice">
          <div class="empty-icon">🎬</div>
          <p>{{ selectedInstrument.name }} lessons are coming soon! We're currently building out our {{ selectedInstrument.name }} curriculum.</p>
          <button @click="showAIGenerator = true" class="btn-generate">Generate Custom AI Lesson</button>
        </div>
        <div v-else class="lesson-grid">
          <div 
            v-for="lesson in filteredLessons" 
            :key="lesson.id"
            class="lesson-card"
            @click="selectLesson(lesson)"
          >
            <div class="lesson-thumbnail">
              <img :src="lesson.thumbnail" :alt="lesson.title" />
              <div class="duration-badge">{{ lesson.duration }}</div>
              <div v-if="lesson.isPremium && subscriptionTier === 'free'" class="premium-lock">
                🔒 Premium
              </div>
              <div v-if="lesson.completed" class="completed-badge">✓</div>
            </div>
            <div class="lesson-details">
              <h3>{{ lesson.title }}</h3>
              <p class="instructor">{{ lesson.instructor }}</p>
              <div class="lesson-meta">
                <span class="difficulty" :class="lesson.difficulty">
                  {{ lesson.difficulty }}
                </span>
                <span class="category">{{ lesson.category }}</span>
              </div>
              <div v-if="lesson.progress > 0" class="lesson-progress">
                <div class="progress-bar mini">
                  <div class="progress-fill" :style="{ width: lesson.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ lesson.progress }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Video Generator Modal -->
    <div v-if="showAIGenerator" class="modal-overlay" @click.self="showAIGenerator = false">
      <div class="modal-content ai-generator-modal">
        <button @click="showAIGenerator = false" class="close-btn">✕</button>
        <h2>🎬 Generate AI Video Lesson</h2>
        <p class="modal-subtitle">Describe what you want to learn and AI will create a custom instructional video</p>
        
        <div class="form-group">
          <label>What do you want to learn?</label>
          <textarea 
            v-model="aiVideoPrompt" 
            placeholder="e.g., 'Show me how to play basic G, C, and D chord progressions' or 'Teach me blues scale improvisation'"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Skill Level</label>
            <select v-model="aiSkillLevel">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Video Length</label>
            <select v-model="aiVideoDuration">
              <option value="short">Short (2-5 min)</option>
              <option value="medium">Medium (5-10 min)</option>
              <option value="long">Long (10-20 min)</option>
            </select>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="generateAIVideo" class="btn-primary" :disabled="!aiVideoPrompt.trim() || generatingVideo">
            {{ generatingVideo ? '🎬 Generating...' : '✨ Generate Video' }}
          </button>
          <button @click="showAIGenerator = false" class="btn-secondary">Cancel</button>
        </div>
        
        <div v-if="generatingVideo" class="generation-progress">
          <div class="progress-spinner"></div>
          <p>AI is creating your custom video lesson... This may take 30-60 seconds.</p>
        </div>
      </div>
    </div>

    <!-- Instructor Connect Modal -->
    <div v-if="showInstructorConnect" class="modal-overlay" @click.self="showInstructorConnect = false">
      <div class="modal-content instructor-modal">
        <button @click="showInstructorConnect = false" class="close-btn">✕</button>
        <h2>👤 Connect with Live Instructor</h2>
        <p class="modal-subtitle">Get personalized 1-on-1 lessons from experienced {{ selectedInstrument ? selectedInstrument.name.toLowerCase() : 'music' }} teachers</p>
        
        <div class="instructor-info">
          <div class="info-card">
            <div class="info-icon">📅</div>
            <h4>Flexible Scheduling</h4>
            <p>Book lessons at times that work for you</p>
          </div>
          <div class="info-card">
            <div class="info-icon">💻</div>
            <h4>Video Sessions</h4>
            <p>Live video calls with screen sharing</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎯</div>
            <h4>Personalized Path</h4>
            <p>Custom curriculum based on your goals</p>
          </div>
        </div>
        
        <div class="form-group">
          <label>Your Name</label>
          <input v-model="instructorName" type="text" placeholder="Enter your name" />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="instructorEmail" type="email" placeholder="your.email@example.com" />
        </div>
        
        <div class="form-group">
          <label>Tell us about your goals and experience</label>
          <textarea 
            v-model="instructorMessage" 
            placeholder="What do you want to learn? What's your current skill level?"
            rows="4"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="submitInstructorRequest" class="btn-primary" :disabled="!instructorName || !instructorEmail || submittingRequest">
            {{ submittingRequest ? 'Sending...' : 'Request Instructor' }}
          </button>
          <button @click="showInstructorConnect = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- AI Video Generator Modal -->
    <div v-if="showAIGenerator" class="modal-overlay" @click.self="showAIGenerator = false">
      <div class="modal-content ai-generator-modal">
        <button @click="showAIGenerator = false" class="close-btn">✕</button>
        <h2>🎬 Generate AI Video Lesson</h2>
        <p class="modal-subtitle">Describe what you want to learn and AI will create a custom instructional video</p>
        
        <div class="form-group">
          <label>What do you want to learn?</label>
          <textarea 
            v-model="aiVideoPrompt" 
            placeholder="e.g., 'Show me how to play basic G, C, and D chord progressions' or 'Teach me blues scale improvisation'"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Skill Level</label>
            <select v-model="aiSkillLevel">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Video Length</label>
            <select v-model="aiVideoDuration">
              <option value="short">Short (2-5 min)</option>
              <option value="medium">Medium (5-10 min)</option>
              <option value="long">Long (10-20 min)</option>
            </select>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="generateAIVideo" class="btn-primary" :disabled="!aiVideoPrompt.trim() || generatingVideo">
            {{ generatingVideo ? '🎬 Generating...' : '✨ Generate Video' }}
          </button>
          <button @click="showAIGenerator = false" class="btn-secondary">Cancel</button>
        </div>
        
        <div v-if="generatingVideo" class="generation-progress">
          <div class="progress-spinner"></div>
          <p>AI is creating your custom video lesson... This may take 30-60 seconds.</p>
        </div>
      </div>
    </div>

    <!-- Instructor Connect Modal -->
    <div v-if="showInstructorConnect" class="modal-overlay" @click.self="showInstructorConnect = false">
      <div class="modal-content instructor-modal">
        <button @click="showInstructorConnect = false" class="close-btn">✕</button>
        <h2>👤 Connect with Live Instructor</h2>
        <p class="modal-subtitle">Get personalized 1-on-1 lessons from experienced {{ selectedInstrument ? selectedInstrument.name.toLowerCase() : 'music' }} teachers</p>
        
        <div class="instructor-info">
          <div class="info-card">
            <div class="info-icon">📅</div>
            <h4>Flexible Scheduling</h4>
            <p>Book lessons at times that work for you</p>
          </div>
          <div class="info-card">
            <div class="info-icon">💻</div>
            <h4>Video Sessions</h4>
            <p>Live video calls with screen sharing</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎯</div>
            <h4>Personalized Path</h4>
            <p>Custom curriculum based on your goals</p>
          </div>
        </div>
        
        <div class="form-group">
          <label>Your Name</label>
          <input v-model="instructorName" type="text" placeholder="Enter your name" />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input v-model="instructorEmail" type="email" placeholder="your.email@example.com" />
        </div>
        
        <div class="form-group">
          <label>Tell us about your goals and experience</label>
          <textarea 
            v-model="instructorMessage" 
            placeholder="What do you want to learn? What's your current skill level?"
            rows="4"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="submitInstructorRequest" class="btn-primary" :disabled="!instructorName || !instructorEmail || submittingRequest">
            {{ submittingRequest ? 'Sending...' : 'Request Instructor' }}
          </button>
          <button @click="showInstructorConnect = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Custom Lesson Plans (Pro) -->
    <div v-if="hasFeature('customLessonPlans')" class="custom-plans">
      <button @click="generateCustomPlan" class="btn-generate-plan">
        🤖 Generate Custom Lesson Plan
      </button>
    </div>
  </div>
</template>

<script>
import subscriptionService, { TIERS } from '../services/subscriptionService';
import * as aiService from '../services/aiService';
import * as progressService from '../services/progressService';

export default {
  name: 'AIVideoLessons',
  data() {
    return {
      // Instruments
      instrumentSearch: '',
      selectedInstrument: null,
      allInstruments: [],
      filteredInstruments: [],
      
      // Subscription
      subscriptionTier: 'free',
      tierLimits: {},
      allTierLimits: {},
      dailyRemaining: 3,
      showUpgradePrompt: false,
      upgradeReason: null,
      lockedFeatureMessage: '',
      showPricing: false,

      // Current Lesson
      currentLesson: null,
      lessonProgress: 0,
      practiceTime: '0m',
      masteryScore: 0,
      
      // AI Features
      showAIOverlay: true,
      realtimeFeedback: null,
      poseAnalysis: null,
      currentTips: [],
      currentHotspots: [],
      
      // Adaptive Difficulty
      currentDifficulty: 3,
      adaptiveStatus: 'Analyzing your performance...',
      
      // Library
      searchQuery: '',
      filterDifficulty: '',
      filterCategory: '',
      lessons: [],
      recommendedLessons: [],
      
      // Playback
      currentTime: 0,
      videoDuration: 0,
      
      // AI Video Generator
      showAIGenerator: false,
      aiVideoPrompt: '',
      aiSkillLevel: 'beginner',
      aiVideoDuration: 'medium',
      generatingVideo: false,
      
      // Instructor Connect
      showInstructorConnect: false,
      instructorName: '',
      instructorEmail: '',
      instructorMessage: '',
      submittingRequest: false,
      
      // AI Lesson Monitoring
      aiLessonPlaying: false,
      isMonitoring: false,
      micEnabled: false,
      audioContext: null,
      audioStream: null,
      currentExercise: null,
      currentMistake: null,
      accuracy: 0,
      timingScore: 0,
      lessonStartTime: 0,
      animationFrame: null
    };
  },
  computed: {
    filteredLessons() {
      return this.lessons.filter(lesson => {
        const matchesSearch = !this.searchQuery || 
          lesson.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesDifficulty = !this.filterDifficulty || 
          lesson.difficulty === this.filterDifficulty;
        
        const matchesCategory = !this.filterCategory || 
          lesson.category === this.filterCategory;
        
        return matchesSearch && matchesDifficulty && matchesCategory;
      });
    }
  },
  mounted() {
    this.loadSubscription();
    this.loadInstruments();
    this.loadLessons();
    this.loadRecommendations();
  },
  methods: {
    loadInstruments() {
      // Popular instruments with emoji icons
      this.allInstruments = [
        { id: 'guitar', name: 'Guitar', icon: '🎸', lessonCount: 150 },
        { id: 'piano', name: 'Piano', icon: '🎹', lessonCount: 200 },
        { id: 'drums', name: 'Drums', icon: '🥁', lessonCount: 85 },
        { id: 'violin', name: 'Violin', icon: '🎻', lessonCount: 75 },
        { id: 'bass', name: 'Bass Guitar', icon: '🎸', lessonCount: 60 },
        { id: 'saxophone', name: 'Saxophone', icon: '🎷', lessonCount: 45 },
        { id: 'trumpet', name: 'Trumpet', icon: '🎺', lessonCount: 40 },
        { id: 'flute', name: 'Flute', icon: '🪈', lessonCount: 35 },
        { id: 'ukulele', name: 'Ukulele', icon: '🎸', lessonCount: 55 },
        { id: 'cello', name: 'Cello', icon: '🎻', lessonCount: 30 },
        { id: 'clarinet', name: 'Clarinet', icon: '🎵', lessonCount: 25 },
        { id: 'harmonica', name: 'Harmonica', icon: '🎵', lessonCount: 20 },
        { id: 'banjo', name: 'Banjo', icon: '🪕', lessonCount: 18 },
        { id: 'accordion', name: 'Accordion', icon: '🪗', lessonCount: 15 },
        { id: 'mandolin', name: 'Mandolin', icon: '🎵', lessonCount: 12 },
        { id: 'vocals', name: 'Singing/Vocals', icon: '🎤', lessonCount: 100 }
      ];
      this.filteredInstruments = this.allInstruments;
    },

    filterInstruments() {
      const search = this.instrumentSearch.toLowerCase();
      this.filteredInstruments = this.allInstruments.filter(inst =>
        inst.name.toLowerCase().includes(search)
      );
    },

    selectInstrument(instrument) {
      this.selectedInstrument = instrument;
      this.currentLesson = null; // Reset current lesson when switching instruments
      console.log('Selected instrument:', instrument.name);
      
      // Reload lessons for the selected instrument
      this.loadLessons();
      this.loadRecommendations();
    },

    loadSubscription() {
      const sub = subscriptionService.getCurrentSubscription();
      this.subscriptionTier = sub.tier;
      this.tierLimits = subscriptionService.getTierLimits();
      this.allTierLimits = subscriptionService.getAllTierLimits();
      
      const usage = subscriptionService.getDailyUsage();
      this.dailyRemaining = this.tierLimits.videosPerDay - usage.count;
    },

    hasFeature(feature) {
      return subscriptionService.hasFeature(feature);
    },

    async selectLesson(lesson) {
      // Check if premium lesson
      if (lesson.isPremium && this.subscriptionTier === 'free') {
        this.upgradeReason = 'feature_locked';
        this.lockedFeatureMessage = 'This premium lesson requires a paid subscription.';
        this.showUpgradePrompt = true;
        return;
      }

      // Check daily limit
      const canView = subscriptionService.canViewVideo();
      if (!canView.allowed) {
        this.upgradeReason = canView.reason;
        this.showUpgradePrompt = true;
        return;
      }

      // Load lesson
      this.currentLesson = lesson;
      this.lessonProgress = lesson.progress || 0;
      this.currentDifficulty = lesson.suggestedDifficulty || 3;
      
      // Auto-start AI-generated lessons
      if (lesson.videoUrl === 'ai-generated') {
        this.$nextTick(async () => {
          await this.toggleAILesson();
        });
      }
      
      // Start AI analysis
      if (this.hasFeature('aiAnalysis')) {
        this.startAIAnalysis();
      }
      
      // Load progress
      this.loadLessonProgress(lesson.id);
      
      // Update remaining count
      this.dailyRemaining = canView.remaining;
    },

    handleVideoLoaded() {
      console.log('Video loaded successfully:', this.currentLesson?.title);
    },

    async startAIAnalysis() {
      // Simulate real-time AI feedback
      setInterval(() => {
        if (!this.currentLesson) return;
        
        const feedbacks = [
          'Great finger positioning! Keep your wrist relaxed.',
          'Try muting the other strings with your palm.',
          'Your rhythm is improving! Stay consistent.',
          'Focus on smoother transitions between chords.',
          'Perfect tempo! Now work on dynamics.'
        ];
        
        this.realtimeFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        
        // Pose analysis (Pro feature)
        if (this.hasFeature('poseDetection')) {
          const score = 75 + Math.random() * 20;
          this.poseAnalysis = {
            score: Math.round(score),
            scoreClass: score > 85 ? 'excellent' : score > 70 ? 'good' : 'needs-work',
            tips: [
              'Curve your fingers more for cleaner notes',
              'Keep thumb behind the neck',
              'Relax your shoulder tension'
            ]
          };
        }
      }, 8000);
      
      // Generate contextual tips
      this.currentTips = [
        'Practice this section slowly first, then increase tempo',
        'Use a metronome to maintain steady rhythm',
        'Record yourself to identify areas for improvement'
      ];
      
      // Add interactive hotspots
      this.currentHotspots = [
        { id: 1, x: 30, y: 40, time: 15, title: 'Hand Position', description: 'Notice how the instructor curves their fingers here' },
        { id: 2, x: 60, y: 50, time: 45, title: 'Strumming Pattern', description: 'Down-down-up-up-down pattern' },
        { id: 3, x: 45, y: 35, time: 90, title: 'Muting Technique', description: 'Palm muting for percussion effect' }
      ];
    },

    handleTimeUpdate(event) {
      const video = event.target;
      this.currentTime = video.currentTime;
      this.videoDuration = video.duration;
      
      // Update progress
      this.lessonProgress = Math.round((this.currentTime / this.videoDuration) * 100);
      
      // Show time-based hotspots
      if (this.hasFeature('aiAnalysis')) {
        this.currentHotspots = this.currentHotspots.filter(
          h => Math.abs(this.currentTime - h.time) < 5
        );
      }
      
      // Adaptive difficulty adjustment
      if (this.hasFeature('adaptiveDifficulty')) {
        this.updateAdaptiveDifficulty();
      }
    },

    handleVideoEnd() {
      this.lessonProgress = 100;
      
      // Save progress
      progressService.updateLessonProgress(this.currentLesson.id, {
        completed: true,
        completedAt: new Date().toISOString(),
        finalScore: this.masteryScore
      });
      
      // AI feedback on completion
      if (this.hasFeature('aiAnalysis')) {
        this.realtimeFeedback = '🎉 Lesson complete! Great work! Review the tips and practice the challenging sections.';
      }
      
      // Show next recommended lesson
      if (this.hasFeature('personalizedRecommendations')) {
        this.loadRecommendations();
      }
    },

    handleVideoError(event) {
      const video = event.target;
      const error = video.error;
      let errorMsg = 'Unable to load video. ';
      
      if (error) {
        switch(error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMsg = 'Video loading was cancelled. Please try again.';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error while loading video. Check your connection.';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMsg = 'Video file is corrupted or unsupported.';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Video format not supported by your browser.';
            break;
          default:
            errorMsg = 'An unknown error occurred while loading the video.';
        }
      }
      
      console.error('Video playback error:', {
        message: errorMsg,
        videoUrl: this.currentLesson?.videoUrl,
        errorCode: error?.code,
        lessonId: this.currentLesson?.id
      });
      
      // Show user-friendly error message
      this.realtimeFeedback = `⚠️ ${errorMsg} Please try another lesson or use AI-generated lessons.`;
      
      // For AI-generated lessons, no fallback needed - they render on canvas
      // For other lessons, just show the error without loading random content
    },

    isYouTubeVideo(url) {
      return url && (url.includes('youtube.com') || url.includes('youtu.be'));
    },

    updateAdaptiveDifficulty() {
      // Analyze performance and adjust difficulty
      const performance = this.lessonProgress / (this.currentTime / 60); // progress per minute
      
      if (performance > 30 && this.currentDifficulty < 5) {
        this.adaptiveStatus = '📈 You\'re doing great! Consider increasing difficulty.';
      } else if (performance < 10 && this.currentDifficulty > 1) {
        this.adaptiveStatus = '📉 Take it slow. Consider reducing difficulty for better learning.';
      } else {
        this.adaptiveStatus = '✅ Perfect pace! Keep going.';
      }
    },

    adjustDifficulty(delta) {
      this.currentDifficulty = Math.max(1, Math.min(5, this.currentDifficulty + delta));
      // In real app, this would adjust playback speed, simplify tabs, etc.
    },

    showHotspotDetail(hotspot) {
      this.realtimeFeedback = `${hotspot.title}\n\n${hotspot.description}`;
      setTimeout(() => { this.realtimeFeedback = null; }, 5000);
      // In real app, show detailed modal with images/video clips
    },

    markComplete() {
      if (this.lessonProgress < 80) return;
      
      this.currentLesson.completed = true;
      progressService.updateLessonProgress(this.currentLesson.id, {
        completed: true,
        completedAt: new Date().toISOString()
      });
      
      this.realtimeFeedback = '🎉 Lesson marked complete! Keep up the great work!';
      setTimeout(() => { this.realtimeFeedback = null; }, 4000);
    },

    downloadLesson() {
      if (!this.hasFeature('downloadVideos')) {
        this.upgradeReason = 'feature_locked';
        this.lockedFeatureMessage = 'Video downloads are available on Premium and Pro plans.';
        this.showUpgradePrompt = true;
        return;
      }
      
      this.realtimeFeedback = '📥 Downloading lesson for offline access...';
      setTimeout(() => { 
        this.realtimeFeedback = '✅ Download complete!';
        setTimeout(() => { this.realtimeFeedback = null; }, 2000);
      }, 2000);
      // In real app, download video file
    },

    addToPlaylist() {
      this.realtimeFeedback = '✅ Added to your practice playlist!';
      setTimeout(() => { this.realtimeFeedback = null; }, 3000);
      // In real app, save to user playlists
    },

    async generateCustomPlan() {
      if (!this.hasFeature('customLessonPlans')) return;
      
      this.realtimeFeedback = '🤖 Generating personalized lesson plan based on your skill level and goals...';
      
      setTimeout(() => {
        this.realtimeFeedback = '✅ Custom lesson plan created! Check your inbox for details.';
        setTimeout(() => { this.realtimeFeedback = null; }, 5000);
      }, 3000);
      
      // Call AI to generate custom curriculum
      const plan = await aiService.generateLessonPlan({
        currentLevel: this.getUserLevel(),
        goals: this.getUserGoals(),
        weaknesses: this.getUserWeaknesses()
      });
      
      // In real app, show generated plan
      console.log('Custom plan:', plan);
    },

    async generateAIVideo() {
      if (!this.aiVideoPrompt.trim()) return;
      
      this.generatingVideo = true;
      
      try {
        // Simulate AI video generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create a new lesson with the generated content
        const newLesson = {
          id: Date.now(),
          title: `AI Generated: ${this.aiVideoPrompt.substring(0, 50)}...`,
          description: `Custom ${this.selectedInstrument?.name || 'music'} lesson generated by AI based on your request`,
          instructor: 'AI Instructor',
          duration: this.aiVideoDuration === 'short' ? '5:00' : this.aiVideoDuration === 'medium' ? '10:00' : '20:00',
          difficulty: this.aiSkillLevel,
          category: 'custom',
          thumbnail: '/images/ai-generated.png',
          videoUrl: 'ai-generated',
          isPremium: false,
          progress: 0,
          completed: false,
          isAIGenerated: true
        };
        
        this.lessons.unshift(newLesson);
        this.showAIGenerator = false;
        this.aiVideoPrompt = '';
        
        // Auto-select the new lesson
        this.selectLesson(newLesson);
        
        // Success notification
        this.realtimeFeedback = '✨ AI video lesson generated successfully! Your personalized lesson is ready to watch.';
        setTimeout(() => { this.realtimeFeedback = null; }, 5000);
      } catch (error) {
        console.error('Error generating AI video:', error);
        this.realtimeFeedback = '⚠️ Failed to generate video. Please try again.';
        setTimeout(() => { this.realtimeFeedback = null; }, 5000);
      } finally {
        this.generatingVideo = false;
      }
    },

    async submitInstructorRequest() {
      if (!this.instructorName || !this.instructorEmail) return;
      
      this.submittingRequest = true;
      
      try {
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Instructor request:', {
          name: this.instructorName,
          email: this.instructorEmail,
          message: this.instructorMessage,
          instrument: this.selectedInstrument?.name
        });
        
        this.showInstructorConnect = false;
        this.instructorName = '';
        this.instructorEmail = '';
        this.instructorMessage = '';
        
        this.realtimeFeedback = '✅ Request submitted! An instructor will contact you within 24 hours to schedule your first lesson.';
        setTimeout(() => { this.realtimeFeedback = null; }, 6000);
      } catch (error) {
        console.error('Error submitting request:', error);
        this.realtimeFeedback = '⚠️ Failed to submit request. Please try again.';
        setTimeout(() => { this.realtimeFeedback = null; }, 4000);
      } finally {
        this.submittingRequest = false;
      }
    },

    // AI Lesson Control Methods
    async toggleAILesson() {
      this.aiLessonPlaying = !this.aiLessonPlaying;
      
      if (this.aiLessonPlaying) {
        await this.startAILesson();
      } else {
        this.pauseAILesson();
      }
    },
    
    async startAILesson() {
      if (!this.currentLesson?.aiMetadata) return;
      
      this.lessonStartTime = Date.now();
      this.currentExercise = this.currentLesson.aiMetadata.exercises[0];
      
      // Initialize canvas
      const canvas = this.$refs.lessonCanvas;
      if (canvas) {
        canvas.width = 1280;
        canvas.height = 720;
        this.renderAILesson();
      }
      
      // Start monitoring if mic is enabled
      if (this.micEnabled) {
        this.isMonitoring = true;
        this.startAudioMonitoring();
      }
      
      this.realtimeFeedback = '🎸 AI lesson started! Play along with the instructor.';
      setTimeout(() => { this.realtimeFeedback = null; }, 3000);
    },
    
    pauseAILesson() {
      this.isMonitoring = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
    },
    
    resetLesson() {
      this.lessonStartTime = 0;
      this.currentExercise = this.currentLesson?.aiMetadata?.exercises[0];
      this.accuracy = 0;
      this.timingScore = 0;
      this.currentMistake = null;
      this.aiLessonPlaying = false;
      this.isMonitoring = false;
      
      this.realtimeFeedback = '🔄 Lesson reset. Ready to start fresh!';
      setTimeout(() => { this.realtimeFeedback = null; }, 2000);
    },
    
    async requestMicPermission() {
      try {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.micEnabled = true;
        
        if (this.aiLessonPlaying) {
          this.isMonitoring = true;
          this.startAudioMonitoring();
        }
        
        this.realtimeFeedback = '🎤 Microphone enabled! AI is now listening to your playing.';
        setTimeout(() => { this.realtimeFeedback = null; }, 3000);
      } catch (error) {
        console.error('Microphone access denied:', error);
        this.realtimeFeedback = '⚠️ Microphone access required for real-time feedback.';
        setTimeout(() => { this.realtimeFeedback = null; }, 4000);
      }
    },
    
    startAudioMonitoring() {
      // Simulate real-time audio analysis
      const monitoringInterval = setInterval(() => {
        if (!this.isMonitoring) {
          clearInterval(monitoringInterval);
          return;
        }
        
        // Simulate accuracy and timing scores
        this.accuracy = Math.min(100, this.accuracy + Math.random() * 5);
        this.timingScore = 75 + Math.random() * 25;
        
        // Randomly detect "mistakes" for demonstration
        if (Math.random() > 0.95 && !this.currentMistake) {
          this.detectMistake();
        }
        
        // Update current exercise based on time
        const elapsed = (Date.now() - this.lessonStartTime) / 1000;
        const exercises = this.currentLesson.aiMetadata.exercises;
        for (let i = exercises.length - 1; i >= 0; i--) {
          if (elapsed >= exercises[i].time) {
            this.currentExercise = exercises[i];
            break;
          }
        }
      }, 1000);
    },
    
    detectMistake() {
      const mistakes = [
        { description: 'Finger not pressing down fully on 3rd string - muted sound detected', correction: 'Press closer to the fret with more pressure' },
        { description: 'Strumming too fast - tempo is 15% ahead of target', correction: 'Slow down and focus on steady rhythm' },
        { description: 'Hand position too high on neck - affecting tone quality', correction: 'Lower your thumb and arch your fingers more' },
        { description: 'Missing string 1 in chord - only 5 strings ringing', correction: 'Adjust finger 3 to allow string 1 to ring clearly' }
      ];
      
      this.currentMistake = mistakes[Math.floor(Math.random() * mistakes.length)];
      
      setTimeout(() => {
        this.currentMistake = null;
      }, 8000);
    },
    
    showCorrection(mistake) {
      this.realtimeFeedback = `💡 ${mistake.correction}`;
      setTimeout(() => { this.realtimeFeedback = null; }, 5000);
    },
    
    renderAILesson() {
      const canvas = this.$refs.lessonCanvas;
      if (!canvas || !this.aiLessonPlaying) return;
      
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw fretboard
      this.drawFretboard(ctx);
      
      // Draw current exercise notation
      if (this.currentExercise) {
        this.drawExercise(ctx);
      }
      
      // Draw metronome
      this.drawMetronome(ctx);
      
      this.animationFrame = requestAnimationFrame(() => this.renderAILesson());
    },
    
    drawFretboard(ctx) {
      const fretboardX = 100;
      const fretboardY = 200;
      const fretboardWidth = 800;
      const fretboardHeight = 300;
      const numFrets = 12;
      const numStrings = 6;
      
      // Draw fretboard background
      ctx.fillStyle = '#3a2920';
      ctx.fillRect(fretboardX, fretboardY, fretboardWidth, fretboardHeight);
      
      // Draw strings
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      for (let i = 0; i < numStrings; i++) {
        const y = fretboardY + (i * fretboardHeight / (numStrings - 1));
        ctx.beginPath();
        ctx.moveTo(fretboardX, y);
        ctx.lineTo(fretboardX + fretboardWidth, y);
        ctx.stroke();
      }
      
      // Draw frets
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 3;
      for (let i = 0; i <= numFrets; i++) {
        const x = fretboardX + (i * fretboardWidth / numFrets);
        ctx.beginPath();
        ctx.moveTo(x, fretboardY);
        ctx.lineTo(x, fretboardY + fretboardHeight);
        ctx.stroke();
      }
      
      // Draw fret markers
      const markers = [3, 5, 7, 9, 12];
      ctx.fillStyle = '#aaa';
      markers.forEach(fret => {
        const x = fretboardX + ((fret - 0.5) * fretboardWidth / numFrets);
        const y = fretboardY + fretboardHeight / 2;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    
    drawExercise(ctx) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(this.currentExercise.chord || this.currentExercise.pattern || 'Exercise', 1000, 100);
      
      ctx.font = '20px Arial';
      ctx.fillText(this.currentExercise.instruction, 1000, 140);
    },
    
    drawMetronome(ctx) {
      const time = Date.now() / 1000;
      const bpm = this.currentLesson.aiMetadata?.bpm || 80;
      const beat = Math.floor(time * (bpm / 60)) % 4;
      
      const metX = 100;
      const metY = 100;
      
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i === beat ? '#00ff00' : '#333';
        ctx.beginPath();
        ctx.arc(metX + i * 40, metY, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    async loadLessons() {
      // AI-generated guitar lessons with real-time monitoring
      if (this.selectedInstrument?.id === 'guitar') {
        this.lessons = [
          {
            id: 'guitar-1',
            title: 'Beginner Guitar: First Chords',
            description: 'AI guides you through C, G, and D major with real-time finger position feedback',
            instructor: 'AI Instructor',
            duration: '8:30',
            difficulty: 'beginner',
            category: 'chords',
            thumbnail: '/images/chord-library.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              chords: ['C', 'G', 'D'],
              bpm: 60,
              exercises: [
                { time: 0, chord: 'C', instruction: 'Place fingers 1-2-3 on strings 2-4-5' },
                { time: 120, chord: 'G', instruction: 'Stretch finger 3 to string 1' },
                { time: 240, chord: 'D', instruction: 'Focus on clean sound from strings 1-4' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: 'guitar-2',
            title: 'Strumming Patterns for Beginners',
            description: 'AI monitors your rhythm and timing in real-time',
            instructor: 'AI Instructor',
            duration: '10:15',
            difficulty: 'beginner',
            category: 'technique',
            thumbnail: '/images/guitar-hero.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              patterns: ['Down-Down-Up-Up-Down-Up', 'Down-Up-Down-Up'],
              bpm: 80,
              exercises: [
                { time: 0, pattern: 'D D U U D U', instruction: 'Keep wrist loose and relaxed' },
                { time: 180, pattern: 'D U D U', instruction: 'Maintain steady tempo' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: 'guitar-3',
            title: 'Fingerpicking Basics',
            description: 'AI tracks each finger and corrects technique instantly',
            instructor: 'AI Instructor',
            duration: '12:45',
            difficulty: 'intermediate',
            category: 'fingerpicking',
            thumbnail: '/images/practice-tips.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              pattern: 'Travis Picking',
              bpm: 70,
              exercises: [
                { time: 0, fingers: 'T-3-2-3-1-3-2-3', instruction: 'Thumb plays bass, fingers play melody' },
                { time: 240, fingers: 'T-1-2-1-3-1-2-1', instruction: 'Keep steady alternating bass' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: 'guitar-4',
            title: 'Blues Scale Mastery',
            description: 'AI analyzes your scale runs and provides instant feedback',
            instructor: 'AI Instructor',
            duration: '15:00',
            difficulty: 'intermediate',
            category: 'scales',
            thumbnail: '/images/jam-session.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              scale: 'A Minor Pentatonic',
              positions: [1, 2, 3, 4, 5],
              bpm: 90,
              exercises: [
                { time: 0, position: 1, instruction: 'Start at 5th fret, play ascending' },
                { time: 180, position: 2, instruction: 'Shift to 7-10 fret range' },
                { time: 360, position: 3, instruction: 'Connect positions with slide' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: true,
            progress: 0,
            completed: false
          },
          {
            id: 'guitar-5',
            title: 'Barre Chords Made Easy',
            description: 'AI monitors finger pressure and hand position in real-time',
            instructor: 'AI Instructor',
            duration: '11:20',
            difficulty: 'intermediate',
            category: 'chords',
            thumbnail: '/images/chord-library.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              chords: ['F', 'Fm', 'B', 'Bm'],
              bpm: 65,
              exercises: [
                { time: 0, chord: 'F', instruction: 'Index finger flat across all strings at 1st fret' },
                { time: 180, chord: 'Fm', instruction: 'Keep thumb centered behind neck' },
                { time: 360, chord: 'B', instruction: 'Roll index finger slightly for cleaner sound' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true,
              pressureMonitoring: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: 'guitar-6',
            title: 'Advanced Lead Guitar Techniques',
            description: 'AI tracks bends, vibrato, and legato with precision analysis',
            instructor: 'AI Instructor',
            duration: '18:30',
            difficulty: 'advanced',
            category: 'lead',
            thumbnail: '/images/guitar-hero.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              techniques: ['hammer-on', 'pull-off', 'bend', 'vibrato', 'slide'],
              bpm: 110,
              exercises: [
                { time: 0, technique: 'hammer-on', instruction: 'Strike first note, hammer second without picking' },
                { time: 240, technique: 'bend', instruction: 'Push string up to reach target pitch' },
                { time: 480, technique: 'vibrato', instruction: 'Gentle wrist rotation for smooth vibrato' }
              ],
              mistakeDetection: true,
              playAlongEnabled: true,
              pitchTracking: true
            },
            isPremium: true,
            progress: 0,
            completed: false
          }
        ];
      } else {
        // AI-generated lessons for ALL instruments
        const instrumentName = this.selectedInstrument?.name || 'Music';
        const instrumentId = this.selectedInstrument?.id || 'general';
        
        this.lessons = [
          {
            id: `${instrumentId}-1`,
            title: `Beginner ${instrumentName}: Getting Started`,
            description: `AI guides you through your first ${instrumentName.toLowerCase()} lesson with real-time feedback`,
            instructor: 'AI Instructor',
            duration: '8:00',
            difficulty: 'beginner',
            category: 'basics',
            thumbnail: '/images/chord-library.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              bpm: 60,
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: `${instrumentId}-2`,
            title: `${instrumentName} Technique Fundamentals`,
            description: `Master proper technique with AI monitoring your form and posture`,
            instructor: 'AI Instructor',
            duration: '10:00',
            difficulty: 'beginner',
            category: 'technique',
            thumbnail: '/images/practice-tips.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              bpm: 70,
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: `${instrumentId}-3`,
            title: `Intermediate ${instrumentName} Skills`,
            description: `AI tracks your progress and adapts difficulty in real-time`,
            instructor: 'AI Instructor',
            duration: '12:00',
            difficulty: 'intermediate',
            category: 'skills',
            thumbnail: '/images/jam-session.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              bpm: 80,
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: false,
            progress: 0,
            completed: false
          },
          {
            id: `${instrumentId}-4`,
            title: `Advanced ${instrumentName} Mastery`,
            description: `Professional techniques with AI precision analysis`,
            instructor: 'AI Instructor',
            duration: '15:00',
            difficulty: 'advanced',
            category: 'mastery',
            thumbnail: '/images/guitar-hero.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              bpm: 100,
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: true,
            progress: 0,
            completed: false
          },
          {
            id: `${instrumentId}-5`,
            title: `${instrumentName} Practice Routines`,
            description: `Daily practice routines with AI guidance and tracking`,
            instructor: 'AI Instructor',
            duration: '20:00',
            difficulty: 'intermediate',
            category: 'practice',
            thumbnail: '/images/practice-tips.svg',
            videoUrl: 'ai-generated',
            aiMetadata: {
              bpm: 90,
              mistakeDetection: true,
              playAlongEnabled: true
            },
            isPremium: true,
            progress: 0,
            completed: false
          }
        ];
      }
    },

    async loadRecommendations() {
      if (!this.hasFeature('personalizedRecommendations')) return;
      
      // In real app, AI generates recommendations based on:
      // - User's skill level
      // - Completed lessons
      // - Practice patterns
      // - Weak areas identified by AI
      
      this.recommendedLessons = [
        {
          ...this.lessons[1],
          matchScore: 92,
          reason: 'Based on your fingerpicking progress'
        },
        {
          ...this.lessons[2],
          matchScore: 88,
          reason: 'Perfect next step after chord mastery'
        }
      ];
    },

    loadLessonProgress(lessonId) {
      const progress = progressService.getLessonProgress(lessonId);
      if (progress) {
        this.practiceTime = this.formatTime(progress.totalTime || 0);
        this.masteryScore = progress.masteryScore || 0;
      }
    },

    selectTier(tier, limits) {
      if (tier === 'free') {
        this.showPricing = false;
        return;
      }
      
      // Navigate to Stripe checkout
      this.$emit('upgrade-tier', { tier, stripePriceId: limits.stripePriceId });
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      return `${mins}m`;
    },

    getUserLevel() { return 'intermediate'; },
    getUserGoals() { return ['improve improvisation', 'learn blues']; },
    getUserWeaknesses() { return ['timing', 'finger independence']; }
  }
};
</script>

<style scoped>
.ai-video-lessons {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 20px 0;
}

.subscription-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.subscription-badge.free {
  background: #e0e0e0;
  color: #666;
}

.subscription-badge.premium {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.subscription-badge.pro {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.upgrade-hint {
  margin-left: 8px;
  opacity: 0.8;
  font-size: 0.85rem;
}

/* Instrument Selector */
.instrument-selector {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.instrument-selector h2 {
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: #333;
}

.search-box {
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 15px 20px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.instruments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}

.instrument-card {
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 20px 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.instrument-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.instrument-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.instrument-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.instrument-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 5px;
}

.instrument-lessons {
  font-size: 0.85rem;
  opacity: 0.7;
}

.instrument-card.active .instrument-lessons {
  opacity: 0.9;
}

/* No Selection State */
.no-selection {
  background: white;
  border-radius: 20px;
  padding: 80px 40px;
  text-align: center;
  margin-bottom: 30px;
}

.empty-state .empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  color: #333;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

/* Lessons List */
.lessons-list {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  text-align: center;
}

.lessons-list h2 {
  margin: 0 0 15px 0;
  font-size: 1.8rem;
  color: #333;
}

.coming-soon-msg {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Upgrade Prompt */
.upgrade-prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.prompt-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  text-align: center;
}

.prompt-content h2 {
  margin-top: 0;
  font-size: 1.8rem;
}

.btn-upgrade {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 10px;
}

.btn-close {
  background: transparent;
  border: 2px solid #ddd;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}

/* Pricing Modal */
.pricing-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.pricing-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
}

.pricing-tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 30px;
}

.tier-card {
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  padding: 30px;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tier-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.tier-card.recommended {
  border-color: #667eea;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.tier-card h3 {
  font-size: 1.5rem;
  margin: 0 0 15px 0;
}

.price {
  margin-bottom: 20px;
}

.price .amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
}

.price .period {
  color: #666;
  font-size: 1rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

.features li {
  padding: 8px 0;
  color: #333;
}

.btn-select {
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-select:hover {
  background: #5568d3;
}

.current-badge {
  text-align: center;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 10px;
  font-weight: 600;
  color: #666;
}

/* Video Player */
.video-player-container {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.content-notice {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.6;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.content-notice strong {
  font-weight: 700;
}

.video-wrapper {
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
}

.video-element {
  width: 100%;
  display: block;
}

.youtube-iframe {
  aspect-ratio: 16 / 9;
  height: auto;
}

/* AI Lesson Canvas */
.ai-lesson-canvas {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
}

.lesson-canvas {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
}

.ai-monitoring-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  border: 2px solid #00ff88;
  border-radius: 12px;
  padding: 20px;
  max-width: 350px;
  backdrop-filter: blur(10px);
}

.monitoring-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.monitoring-status.active {
  background: rgba(0, 255, 136, 0.1);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #666;
}

.monitoring-status.active .status-indicator {
  background: #00ff88;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.mistake-alert {
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid #ff4444;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: bold;
  color: #ff4444;
}

.mistake-alert p {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.btn-correction {
  background: #ff4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-correction:hover {
  background: #ff6666;
  transform: translateY(-2px);
}

.realtime-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric .label {
  width: 70px;
  font-size: 13px;
  color: #aaa;
}

.meter {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #00cc66);
  transition: width 0.3s ease;
}

.meter-fill.timing {
  background: linear-gradient(90deg, #00aaff, #0088cc);
}

.metric .value {
  width: 50px;
  text-align: right;
  font-weight: bold;
  color: #00ff88;
}

.exercise-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
}

.exercise-info h4 {
  margin: 0 0 8px 0;
  color: #00ff88;
  font-size: 16px;
}

.exercise-info p {
  margin: 0;
  color: #ccc;
  font-size: 14px;
}

.ai-lesson-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.85);
  padding: 15px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.btn-play-pause,
.btn-mic,
.btn-reset {
  background: linear-gradient(135deg, #00ff88, #00cc66);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-play-pause:hover,
.btn-mic:hover,
.btn-reset:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(0, 255, 136, 0.4);
}

.btn-mic {
  background: linear-gradient(135deg, #0088ff, #0066cc);
}

.btn-mic.active {
  background: linear-gradient(135deg, #ff4444, #cc3333);
  animation: pulse 2s infinite;
}

.btn-reset {
  background: linear-gradient(135deg, #888, #666);
}

.ai-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.pose-canvas {
  width: 100%;
  height: 100%;
}

/* Hotspots */
.hotspots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.hotspot-pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  animation: pulse 2s infinite;
}

.hotspot-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.5); opacity: 0; }
}

/* Lesson Info */
.lesson-info {
  margin-top: 20px;
}

.lesson-info h2 {
  margin: 0 0 10px 0;
  font-size: 1.8rem;
}

.lesson-meta {
  display: flex;
  gap: 15px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.difficulty {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 600;
}

.difficulty.beginner { background: #c8e6c9; color: #2e7d32; }
.difficulty.intermediate { background: #fff9c4; color: #f57f17; }
.difficulty.advanced { background: #ffccbc; color: #d84315; }
.difficulty.expert { background: #f8bbd0; color: #c2185b; }

/* AI Feedback */
.ai-feedback-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.ai-feedback-panel h3 {
  margin-top: 0;
  font-size: 1.3rem;
}

.feedback-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #667eea;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.feedback-header .icon {
  font-size: 1.3rem;
}

.score {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.score.excellent { background: #c8e6c9; color: #2e7d32; }
.score.good { background: #fff9c4; color: #f57f17; }
.score.needs-work { background: #ffccbc; color: #d84315; }

.feedback-item ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
}

.feedback-item li {
  margin: 5px 0;
  color: #555;
}

/* Adaptive Controls */
.adaptive-controls {
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.adaptive-controls h4 {
  margin: 0 0 10px 0;
}

.adaptive-status {
  color: #666;
  margin: 10px 0;
  font-size: 0.95rem;
}

.difficulty-slider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}

.difficulty-slider button {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.difficulty-slider button:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.difficulty-slider button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.difficulty-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.difficulty-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #ff9800, #f44336);
  transition: width 0.3s;
}

.difficulty-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #667eea;
}

/* Progress */
.progress-section {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.stat {
  text-align: center;
}

.stat .value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat .label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.progress-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.action-buttons button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-complete {
  background: #4caf50;
  color: white;
}

.btn-complete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-download {
  background: #2196f3;
  color: white;
}

.btn-playlist {
  background: #f5f5f5;
  color: #333;
}

/* Lesson Library */
.lesson-library {
  margin-top: 30px;
}

.ai-generation-prompt {
  display: flex;
  align-items: flex-start;
  gap: 25px;
  padding: 30px 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  color: white;
}

.ai-generation-prompt .prompt-icon {
  font-size: 3rem;
  line-height: 1;
}

.ai-generation-prompt .prompt-content h3 {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.ai-generation-prompt .prompt-content p {
  margin: 0 0 20px 0;
  opacity: 0.95;
  line-height: 1.6;
  font-size: 1.05rem;
}

.action-buttons-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-generate-ai, .btn-connect-instructor {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-generate-ai {
  background: white;
  color: #667eea;
}

.btn-generate-ai:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.btn-connect-instructor {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-connect-instructor:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333;
}

.modal-content h2 {
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  color: #333;
}

.modal-subtitle {
  margin: 0 0 30px 0;
  color: #666;
  font-size: 1.05rem;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-primary {
  flex: 1;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 14px 24px;
  background: #f0f0f0;
  color: #666;
  border: none;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.generation-progress {
  text-align: center;
  padding: 30px 20px;
  margin-top: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.progress-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.generation-progress p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.instructor-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.info-card {
  text-align: center;
  padding: 20px 15px;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-card .info-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.info-card h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #333;
}

.info-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.demo-warning {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px 30px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
  border: 2px solid #ffc107;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.2);
}

.demo-warning .warning-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.demo-warning .warning-content h3 {
  margin: 0 0 10px 0;
  color: #856404;
  font-size: 1.3rem;
}

.demo-warning .warning-content p {
  margin: 0;
  color: #856404;
  line-height: 1.6;
  font-size: 1rem;
}

.coming-soon-notice {
  text-align: center;
  padding: 60px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon-notice .empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.6;
}

.coming-soon-notice p {
  font-size: 1.1rem;
  color: #666;
  margin: 10px 0;
  line-height: 1.6;
}

.coming-soon-notice .beta-note {
  font-size: 0.95rem;
  color: #888;
  font-style: italic;
  margin-top: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Lesson Grid */
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.lesson-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.lesson-card.recommended {
  border: 2px solid #667eea;
}

.lesson-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #e0e0e0;
}

.lesson-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 600;
}

.premium-lock {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.ai-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.completed-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4caf50;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.lesson-details {
  padding: 15px;
}

.lesson-details h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
}

.lesson-details .instructor {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.lesson-details .lesson-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.match {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.lesson-progress {
  margin-top: 10px;
}

.progress-bar.mini {
  height: 6px;
  margin-bottom: 5px;
}

.progress-text {
  font-size: 0.85rem;
  color: #666;
}

/* Custom Plans */
.custom-plans {
  margin-top: 40px;
  text-align: center;
}

.btn-generate-plan {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  padding: 18px 36px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-generate-plan:hover {
  transform: scale(1.05);
}

/* Recommendations Section */
.recommendations {
  margin-bottom: 40px;
}

.recommendations h2 {
  font-size: 1.6rem;
  margin-bottom: 20px;
}

.all-lessons h2 {
  font-size: 1.6rem;
  margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .pricing-tiers {
    grid-template-columns: 1fr;
  }
  
  .progress-stats {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .lesson-grid {
    grid-template-columns: 1fr;
  }
}
</style>
