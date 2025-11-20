<template>
  <div class="ai-video-lessons">
    <!-- Header -->
    <div class="header">
      <h1>🎸 AI Video Lessons</h1>
      <div class="subscription-badge" :class="subscriptionTier">
        {{ tierLimits.name }}
        <span v-if="subscriptionTier === 'free'" class="upgrade-hint">
          {{ dailyRemaining }}/{{ tierLimits.videosPerDay }} lessons today
        </span>
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
    <div v-if="currentLesson" class="video-player-container">
      <!-- Content Notice -->
      <div class="content-notice">
        ⚠️ <strong>Demo Mode:</strong> These are placeholder videos. Replace with actual guitar lesson content before launch.
        <br>Upload your guitar instruction videos and update the videoUrl fields in the lessons array.
      </div>
      
      <div class="video-wrapper">
        <video 
          ref="videoPlayer"
          :key="currentLesson.id"
          :src="currentLesson.videoUrl"
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnd"
          @error="handleVideoError"
          @loadedmetadata="handleVideoLoaded"
          controls
          controlsList="nodownload"
          preload="auto"
          playsinline
          crossorigin="anonymous"
          class="video-element"
        />
        
        <!-- AI Overlay (Premium+) -->
        <div v-if="hasFeature('poseDetection') && showAIOverlay" class="ai-overlay">
          <canvas ref="poseCanvas" class="pose-canvas"></canvas>
        </div>

        <!-- Interactive Hotspots (Premium+) -->
        <div v-if="hasFeature('aiAnalysis') && currentHotspots.length" class="hotspots">
          <div 
            v-for="hotspot in currentHotspots"
            :key="hotspot.id"
            class="hotspot"
            :style="{ left: hotspot.x + '%', top: hotspot.y + '%' }"
            @click="showHotspotDetail(hotspot)"
          >
            <div class="hotspot-pulse"></div>
            <div class="hotspot-icon">💡</div>
          </div>
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
        <h2>📚 All Lessons</h2>
        <div class="lesson-grid">
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
      videoDuration: 0
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
    this.loadLessons();
    this.loadRecommendations();
  },
  methods: {
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
      
      // Force video reload
      this.$nextTick(() => {
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.load();
        }
      });
      
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
      let errorMsg = 'Video failed to load. ';
      
      if (error) {
        switch(error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMsg += 'Playback aborted.';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMsg += 'Network error.';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMsg += 'Decode error.';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg += 'Video format not supported.';
            break;
          default:
            errorMsg += 'Unknown error.';
        }
      }
      
      console.error('Video error:', errorMsg, this.currentLesson?.videoUrl);
      this.realtimeFeedback = '⚠️ ' + errorMsg + ' Trying alternate source...';
      
      // Try fallback video
      if (this.currentLesson && video.src !== 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4') {
        setTimeout(() => {
          this.currentLesson.videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
          this.$nextTick(() => {
            if (this.$refs.videoPlayer) {
              this.$refs.videoPlayer.load();
            }
          });
        }, 1000);
      }
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
      alert(`${hotspot.title}\n\n${hotspot.description}`);
      // In real app, show detailed modal with images/video clips
    },

    markComplete() {
      if (this.lessonProgress < 80) return;
      
      this.currentLesson.completed = true;
      progressService.updateLessonProgress(this.currentLesson.id, {
        completed: true,
        completedAt: new Date().toISOString()
      });
      
      alert('🎉 Lesson marked complete! Keep up the great work!');
    },

    downloadLesson() {
      if (!this.hasFeature('downloadVideos')) {
        this.upgradeReason = 'feature_locked';
        this.lockedFeatureMessage = 'Video downloads are available on Premium and Pro plans.';
        this.showUpgradePrompt = true;
        return;
      }
      
      alert('📥 Downloading lesson for offline access...');
      // In real app, download video file
    },

    addToPlaylist() {
      alert('✅ Added to your practice playlist!');
      // In real app, save to user playlists
    },

    async generateCustomPlan() {
      if (!this.hasFeature('customLessonPlans')) return;
      
      alert('🤖 Generating personalized lesson plan based on your skill level and goals...');
      
      // Call AI to generate custom curriculum
      const plan = await aiService.generateLessonPlan({
        currentLevel: this.getUserLevel(),
        goals: this.getUserGoals(),
        weaknesses: this.getUserWeaknesses()
      });
      
      // In real app, show generated plan
      console.log('Custom plan:', plan);
    },

    async loadLessons() {
      // In real app, load from API
      this.lessons = [
        {
          id: 1,
          title: 'Beginner Chord Transitions',
          description: 'Master smooth transitions between basic chords',
          instructor: 'Sarah Johnson',
          duration: '15:30',
          difficulty: 'beginner',
          category: 'technique',
          thumbnail: '/images/video-placeholder.png',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          isPremium: false,
          progress: 0,
          completed: false
        },
        {
          id: 2,
          title: 'Advanced Fingerpicking Patterns',
          description: 'Learn complex fingerpicking with AI-guided feedback',
          instructor: 'Mike Chen',
          duration: '22:15',
          difficulty: 'advanced',
          category: 'technique',
          thumbnail: '/images/video-placeholder.png',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          isPremium: true,
          progress: 0,
          completed: false
        },
        {
          id: 3,
          title: 'Blues Improvisation Masterclass',
          description: 'AI-powered improvisation with real-time feedback',
          instructor: 'David Williams',
          duration: '35:00',
          difficulty: 'intermediate',
          category: 'improvisation',
          thumbnail: '/images/video-placeholder.png',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          isPremium: true,
          progress: 45,
          completed: false
        }
      ];
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2rem;
  margin: 0;
}

.subscription-badge {
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
