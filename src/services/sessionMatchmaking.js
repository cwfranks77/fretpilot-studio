// Session Matchmaking & Recommendation System

class SessionMatchmaking {
  constructor() {
    this.userProfile = this.loadUserProfile()
    this.sessionHistory = this.loadSessionHistory()
  }

  loadUserProfile() {
    const stored = localStorage.getItem('fretpilot-user-profile')
    return stored ? JSON.parse(stored) : {
      instruments: ['Guitar'],
      skillLevel: 'intermediate',
      preferredGenres: ['rock', 'blues'],
      practiceTime: 0,
      sessionsCompleted: 0,
      achievements: []
    }
  }

  saveUserProfile() {
    localStorage.setItem('fretpilot-user-profile', JSON.stringify(this.userProfile))
  }

  loadSessionHistory() {
    const stored = localStorage.getItem('fretpilot-session-history')
    return stored ? JSON.parse(stored) : []
  }

  saveSessionHistory() {
    localStorage.setItem('fretpilot-session-history', JSON.stringify(this.sessionHistory))
  }

  // Find best matching sessions for user
  findMatches(availableSessions, limit = 5) {
    const scored = availableSessions.map(session => ({
      session,
      score: this.calculateMatchScore(session)
    }))

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score)

    return scored.slice(0, limit).map(s => ({
      ...s.session,
      matchScore: s.score,
      matchReason: this.getMatchReason(s.session, s.score)
    }))
  }

  calculateMatchScore(session) {
    let score = 0

    // Genre match (0-30 points)
    if (this.userProfile.preferredGenres.includes(session.genre)) {
      score += 30
    }

    // Skill level match (0-25 points)
    const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro']
    const userLevel = skillLevels.indexOf(this.userProfile.skillLevel)
    const sessionLevel = skillLevels.indexOf(session.skillLevel)
    const skillDiff = Math.abs(userLevel - sessionLevel)
    score += Math.max(0, 25 - (skillDiff * 10))

    // Session size preference (0-15 points)
    const optimalSize = 4
    const sizeDiff = Math.abs(session.players.length - optimalSize)
    score += Math.max(0, 15 - (sizeDiff * 3))

    // Needs specific instrument (0-20 points)
    if (this.sessionNeedsInstrument(session)) {
      score += 20
    }

    // Active/popular session (0-10 points)
    if (session.isLive && session.players.length > 0) {
      score += 10
    }

    return score
  }

  sessionNeedsInstrument(session) {
    const instruments = session.players.map(p => p.instrument)
    const userInstruments = this.userProfile.instruments

    // Check if session is missing an instrument the user plays
    const common = ['Guitar', 'Bass', 'Drums', 'Keys']
    for (const instrument of userInstruments) {
      if (common.includes(instrument) && !instruments.includes(instrument)) {
        return true
      }
    }
    return false
  }

  getMatchReason(session, score) {
    const reasons = []

    if (this.userProfile.preferredGenres.includes(session.genre)) {
      reasons.push(`You love ${session.genre}`)
    }

    if (this.sessionNeedsInstrument(session)) {
      reasons.push('They need your instrument')
    }

    const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro']
    const userLevel = skillLevels.indexOf(this.userProfile.skillLevel)
    const sessionLevel = skillLevels.indexOf(session.skillLevel)
    
    if (userLevel === sessionLevel) {
      reasons.push('Perfect skill match')
    }

    if (session.isLive && session.players.length > 0) {
      reasons.push('Active right now')
    }

    return reasons.length > 0 ? reasons.join(' • ') : 'Good match'
  }

  // Suggest session settings based on user preferences
  suggestSessionSettings() {
    const genreSettings = {
      rock: { bpm: 120, keys: ['E', 'A', 'D', 'G'] },
      blues: { bpm: 90, keys: ['E', 'A', 'G', 'C'] },
      jazz: { bpm: 140, keys: ['Bb', 'F', 'Eb', 'C'] },
      metal: { bpm: 180, keys: ['E', 'D', 'Drop D', 'Drop C'] },
      funk: { bpm: 110, keys: ['E', 'A', 'D', 'G'] },
      pop: { bpm: 120, keys: ['C', 'G', 'D', 'A'] }
    }

    const preferredGenre = this.userProfile.preferredGenres[0] || 'rock'
    const settings = genreSettings[preferredGenre] || genreSettings.rock

    return {
      genre: preferredGenre,
      bpm: settings.bpm,
      key: settings.keys[Math.floor(Math.random() * settings.keys.length)],
      skillLevel: this.userProfile.skillLevel
    }
  }

  // Track session completion
  recordSessionCompletion(session, stats) {
    this.sessionHistory.push({
      sessionId: session.id,
      genre: session.genre,
      duration: stats.duration,
      players: session.players.length,
      timestamp: Date.now(),
      rating: stats.rating || 0
    })

    // Update user stats
    this.userProfile.sessionsCompleted++
    this.userProfile.practiceTime += stats.duration

    // Check for achievements
    this.checkAchievements()

    this.saveSessionHistory()
    this.saveUserProfile()
  }

  checkAchievements() {
    const achievements = [
      {
        id: 'first-jam',
        name: 'First Jam',
        condition: () => this.userProfile.sessionsCompleted >= 1,
        icon: '🎸'
      },
      {
        id: 'regular-jammer',
        name: 'Regular Jammer',
        condition: () => this.userProfile.sessionsCompleted >= 10,
        icon: '🎵'
      },
      {
        id: 'jam-master',
        name: 'Jam Master',
        condition: () => this.userProfile.sessionsCompleted >= 50,
        icon: '🏆'
      },
      {
        id: 'genre-explorer',
        name: 'Genre Explorer',
        condition: () => {
          const genres = new Set(this.sessionHistory.map(s => s.genre))
          return genres.size >= 5
        },
        icon: '🌍'
      },
      {
        id: 'practice-warrior',
        name: 'Practice Warrior',
        condition: () => this.userProfile.practiceTime >= 3600, // 1 hour
        icon: '⚔️'
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        condition: () => {
          const uniquePlayers = new Set()
          this.sessionHistory.forEach(s => {
            if (s.players) uniquePlayers.add(s.players)
          })
          return uniquePlayers.size >= 20
        },
        icon: '🦋'
      }
    ]

    achievements.forEach(achievement => {
      if (!this.userProfile.achievements.includes(achievement.id)) {
        if (achievement.condition()) {
          this.userProfile.achievements.push(achievement.id)
          this.notifyAchievement(achievement)
        }
      }
    })
  }

  notifyAchievement(achievement) {
    // Trigger UI notification
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('achievement-unlocked', {
        detail: achievement
      })
      window.dispatchEvent(event)
    }
  }

  getAchievements() {
    const allAchievements = [
      { id: 'first-jam', name: 'First Jam', description: 'Complete your first jam session', icon: '🎸' },
      { id: 'regular-jammer', name: 'Regular Jammer', description: 'Complete 10 jam sessions', icon: '🎵' },
      { id: 'jam-master', name: 'Jam Master', description: 'Complete 50 jam sessions', icon: '🏆' },
      { id: 'genre-explorer', name: 'Genre Explorer', description: 'Jam in 5 different genres', icon: '🌍' },
      { id: 'practice-warrior', name: 'Practice Warrior', description: 'Spend 1 hour in jam sessions', icon: '⚔️' },
      { id: 'social-butterfly', name: 'Social Butterfly', description: 'Jam with 20 different players', icon: '🦋' }
    ]

    return allAchievements.map(a => ({
      ...a,
      unlocked: this.userProfile.achievements.includes(a.id)
    }))
  }

  // Get user stats for leaderboard
  getUserStats() {
    return {
      sessionsCompleted: this.userProfile.sessionsCompleted,
      practiceTime: this.userProfile.practiceTime,
      achievementCount: this.userProfile.achievements.length,
      favoriteGenre: this.getFavoriteGenre(),
      averageRating: this.getAverageRating()
    }
  }

  getFavoriteGenre() {
    if (this.sessionHistory.length === 0) return 'N/A'
    
    const genreCounts = {}
    this.sessionHistory.forEach(s => {
      genreCounts[s.genre] = (genreCounts[s.genre] || 0) + 1
    })

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])[0][0]
  }

  getAverageRating() {
    if (this.sessionHistory.length === 0) return 0
    
    const ratings = this.sessionHistory
      .filter(s => s.rating)
      .map(s => s.rating)
    
    if (ratings.length === 0) return 0
    
    return ratings.reduce((a, b) => a + b, 0) / ratings.length
  }

  // Update user preferences
  updatePreferences(preferences) {
    Object.assign(this.userProfile, preferences)
    this.saveUserProfile()
  }

  // Find users looking for specific instruments
  findInstrumentOpportunities(availableSessions) {
    return availableSessions
      .filter(session => this.sessionNeedsInstrument(session))
      .map(session => ({
        ...session,
        neededInstrument: this.getNeededInstrument(session)
      }))
  }

  getNeededInstrument(session) {
    const instruments = session.players.map(p => p.instrument)
    const common = ['Guitar', 'Bass', 'Drums', 'Keys']
    
    for (const instrument of this.userProfile.instruments) {
      if (common.includes(instrument) && !instruments.includes(instrument)) {
        return instrument
      }
    }
    return null
  }
}

const matchmaking = new SessionMatchmaking()

export default matchmaking
export { matchmaking }
