// AI Service for FretPilot Studio
// Handles AI-powered lesson generation, practice analysis, and more

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || ''

// Check if AI is available (has API key)
export function isAIAvailable() {
  return !!OPENAI_API_KEY
}

// Generate a personalized lesson plan
export async function generateLessonPlan({ skillLevel, goals, genre, instrument = 'guitar', duration = 30 }) {
  if (!OPENAI_API_KEY) {
    return generateFallbackLesson({ skillLevel, goals, genre, instrument, duration })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert ${instrument} teacher creating personalized lesson plans. 
            Return lessons in JSON format with this structure:
            {
              "title": "Lesson title",
              "description": "Brief description",
              "duration": ${duration},
              "exercises": [
                {
                  "name": "Exercise name",
                  "description": "What to do",
                  "duration": 5,
                  "tips": ["tip1", "tip2"],
                  "chords": ["Am", "C", "G"] // if applicable
                }
              ],
              "songs": [
                {
                  "title": "Song name",
                  "artist": "Artist",
                  "difficulty": "easy|medium|hard",
                  "chords": ["G", "C", "D", "Em"]
                }
              ],
              "techniques": ["technique1", "technique2"],
              "nextSteps": "What to practice next"
            }`
          },
          {
            role: 'user',
            content: `Create a ${duration}-minute ${instrument} lesson for a ${skillLevel} player who wants to ${goals.join(', ')} and enjoys ${genre} music. Focus on practical exercises they can do right now.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    
    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const lessonJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    return JSON.parse(lessonJson)
  } catch (error) {
    console.error('AI lesson generation failed:', error)
    return generateFallbackLesson({ skillLevel, goals, genre, instrument, duration })
  }
}

// Generate chord progression suggestions
export async function generateChordProgression({ key, mood, genre, complexity = 'simple' }) {
  if (!OPENAI_API_KEY) {
    return generateFallbackProgression({ key, mood, genre, complexity })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a music theory expert. Generate chord progressions in JSON format:
            {
              "name": "Progression name",
              "key": "C",
              "chords": ["C", "Am", "F", "G"],
              "pattern": "I - vi - IV - V",
              "mood": "uplifting",
              "genre": "pop",
              "bpm_suggestion": 120,
              "strumming": "D DU UDU",
              "tips": ["tip1", "tip2"],
              "similar_songs": ["Song 1 - Artist", "Song 2 - Artist"]
            }`
          },
          {
            role: 'user',
            content: `Generate a ${complexity} chord progression in the key of ${key} with a ${mood} mood, suitable for ${genre} music.`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const progressionJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    return JSON.parse(progressionJson)
  } catch (error) {
    console.error('Chord progression generation failed:', error)
    return generateFallbackProgression({ key, mood, genre, complexity })
  }
}

// Analyze practice recording (timing, rhythm)
export async function analyzePractice({ tempo, targetTempo, notes, duration }) {
  // This would typically use audio analysis - for now we provide structured feedback
  const tempoAccuracy = Math.abs(tempo - targetTempo) / targetTempo
  const isOnTempo = tempoAccuracy < 0.05

  const feedback = {
    overallScore: Math.max(0, 100 - Math.round(tempoAccuracy * 200)),
    timing: {
      accuracy: isOnTempo ? 'excellent' : tempoAccuracy < 0.1 ? 'good' : 'needs work',
      avgTempo: tempo,
      targetTempo: targetTempo,
      variance: Math.round(tempoAccuracy * 100)
    },
    suggestions: [],
    strengths: [],
    practiceMinutes: Math.round(duration / 60)
  }

  if (isOnTempo) {
    feedback.strengths.push('Great tempo control!')
    feedback.suggestions.push('Try increasing the tempo by 5-10 BPM')
  } else if (tempo < targetTempo) {
    feedback.suggestions.push('You\'re playing a bit slow - try using the metronome')
    feedback.suggestions.push('Start slower and gradually increase tempo')
  } else {
    feedback.suggestions.push('You\'re rushing - focus on staying with the beat')
    feedback.suggestions.push('Practice at a slower tempo first')
  }

  return feedback
}

// Generate practice tips based on user's history
export async function generatePracticeTips({ weakAreas, recentChords, practiceTime }) {
  if (!OPENAI_API_KEY) {
    return generateFallbackTips({ weakAreas, recentChords })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an encouraging guitar teacher. Provide 3-5 specific, actionable practice tips in JSON format: { "tips": [{ "title": "Tip title", "description": "Detailed tip", "exercise": "Specific exercise to try" }] }'
          },
          {
            role: 'user',
            content: `A student has been practicing for ${practiceTime} minutes. They recently practiced: ${recentChords.join(', ')}. Areas to improve: ${weakAreas.join(', ')}. Give personalized tips.`
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
    const tipsJson = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    
    return JSON.parse(tipsJson)
  } catch (error) {
    console.error('Tips generation failed:', error)
    return generateFallbackTips({ weakAreas, recentChords })
  }
}

// ============ FALLBACK GENERATORS (No API Key) ============

function generateFallbackLesson({ skillLevel, goals, genre, instrument, duration }) {
  const lessons = {
    beginner: {
      title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Fundamentals for Beginners`,
      description: `A ${duration}-minute lesson focusing on essential ${instrument} skills for ${genre} music.`,
      duration: duration,
      exercises: [
        {
          name: 'Finger Warm-Up',
          description: 'Chromatic exercise on the first 4 frets to build finger independence',
          duration: 5,
          tips: ['Use a metronome at 60 BPM', 'Keep your thumb behind the neck', 'Press firmly but not too hard'],
          chords: []
        },
        {
          name: 'Basic Open Chords',
          description: 'Practice transitioning between the most common open chords',
          duration: 10,
          tips: ['Focus on clean transitions', 'Let each string ring clearly', 'Practice the chord shapes one at a time first'],
          chords: ['G', 'C', 'D', 'Em', 'Am']
        },
        {
          name: 'Strumming Patterns',
          description: 'Learn a basic down-up strumming pattern that works for most songs',
          duration: 10,
          tips: ['Count "1 and 2 and 3 and 4 and"', 'Keep your wrist loose', 'Start slow then speed up'],
          chords: ['G', 'C']
        },
        {
          name: 'Put It Together',
          description: 'Apply your chords and strumming to a simple song progression',
          duration: 5,
          tips: ['Don\'t stop if you make a mistake', 'Keep the rhythm going', 'This is where the magic happens!'],
          chords: ['G', 'D', 'Em', 'C']
        }
      ],
      songs: [
        { title: 'Knockin\' on Heaven\'s Door', artist: 'Bob Dylan', difficulty: 'easy', chords: ['G', 'D', 'Am', 'C'] },
        { title: 'Horse With No Name', artist: 'America', difficulty: 'easy', chords: ['Em', 'D6/9'] },
        { title: 'Wish You Were Here', artist: 'Pink Floyd', difficulty: 'easy', chords: ['G', 'C', 'D', 'Am'] }
      ],
      techniques: ['Finger placement', 'Basic strumming', 'Chord transitions', 'Rhythm keeping'],
      nextSteps: 'Continue practicing these chords until transitions feel smooth. Then try adding a new chord like F or Bm.'
    },
    intermediate: {
      title: `${genre.charAt(0).toUpperCase() + genre.slice(1)} Skills Builder`,
      description: `Level up your ${instrument} playing with ${genre}-focused techniques.`,
      duration: duration,
      exercises: [
        {
          name: 'Barre Chord Warm-Up',
          description: 'F and Bm barre chord practice with proper technique',
          duration: 8,
          tips: ['Roll your index finger slightly', 'Use arm strength, not just finger pressure', 'Check each string rings clearly'],
          chords: ['F', 'Bm', 'B']
        },
        {
          name: 'Fingerpicking Pattern',
          description: 'Travis picking pattern - thumb handles bass, fingers handle melody',
          duration: 10,
          tips: ['Thumb on beats 1 and 3', 'Fingers on beats 2 and 4', 'Start very slowly'],
          chords: ['C', 'G', 'Am', 'E']
        },
        {
          name: 'Pentatonic Scale Run',
          description: 'Minor pentatonic scale in position 1 - the foundation of soloing',
          duration: 7,
          tips: ['Memorize the box pattern', 'Use alternate picking', 'This scale works over most songs!'],
          chords: []
        },
        {
          name: 'Song Application',
          description: 'Apply these techniques to a real song',
          duration: 5,
          tips: ['Start with just the chord progression', 'Add complexity gradually', 'Record yourself to track progress'],
          chords: ['Am', 'F', 'C', 'G']
        }
      ],
      songs: [
        { title: 'Wonderwall', artist: 'Oasis', difficulty: 'medium', chords: ['Em7', 'G', 'Dsus4', 'A7sus4'] },
        { title: 'Hotel California', artist: 'Eagles', difficulty: 'medium', chords: ['Bm', 'F#', 'A', 'E', 'G', 'D', 'Em'] },
        { title: 'Blackbird', artist: 'The Beatles', difficulty: 'medium', chords: ['G', 'Am7', 'G/B', 'C'] }
      ],
      techniques: ['Barre chords', 'Fingerpicking', 'Pentatonic scales', 'Hammer-ons and pull-offs'],
      nextSteps: 'Work on connecting pentatonic positions and adding bends to your solos. Try learning a full song with these techniques.'
    },
    advanced: {
      title: `Advanced ${genre.charAt(0).toUpperCase() + genre.slice(1)} Mastery`,
      description: `Push your ${instrument} skills with advanced ${genre} concepts.`,
      duration: duration,
      exercises: [
        {
          name: 'Jazz Voicings',
          description: 'Extended chord voicings - 7ths, 9ths, and 13ths',
          duration: 10,
          tips: ['Focus on voice leading', 'Learn multiple voicings per chord', 'Use these in your rhythm playing'],
          chords: ['Cmaj7', 'Dm9', 'G13', 'Am7']
        },
        {
          name: 'Mode Exploration',
          description: 'Dorian and Mixolydian modes for soloing',
          duration: 10,
          tips: ['Dorian = minor with raised 6th', 'Mixolydian = major with flatted 7th', 'Great for blues and jazz'],
          chords: []
        },
        {
          name: 'Hybrid Picking',
          description: 'Combine pick and fingers for complex patterns',
          duration: 5,
          tips: ['Pick handles lower strings', 'Middle and ring finger handle higher strings', 'Essential for country and jazz'],
          chords: ['A', 'D', 'E']
        },
        {
          name: 'Improvisation',
          description: 'Solo over a backing track using today\'s concepts',
          duration: 5,
          tips: ['Listen more than you play', 'Leave space in your phrases', 'Tell a story with your solo'],
          chords: ['Am7', 'D7', 'Gmaj7', 'Cmaj7']
        }
      ],
      songs: [
        { title: 'Cliffs of Dover', artist: 'Eric Johnson', difficulty: 'hard', chords: ['G', 'C', 'D', 'Em'] },
        { title: 'Little Wing', artist: 'Jimi Hendrix', difficulty: 'hard', chords: ['Em', 'G', 'Am', 'Bm'] },
        { title: 'Neon', artist: 'John Mayer', difficulty: 'hard', chords: ['Cmaj7', 'Gm7', 'Ebmaj7'] }
      ],
      techniques: ['Extended chord voicings', 'Modal improvisation', 'Hybrid picking', 'Sweep picking basics'],
      nextSteps: 'Record yourself improvising and analyze your note choices. Work on making your playing more melodic and intentional.'
    }
  }

  return lessons[skillLevel] || lessons.beginner
}

function generateFallbackProgression({ key, mood, genre, complexity }) {
  const progressions = {
    happy: {
      simple: { chords: ['I', 'V', 'vi', 'IV'], pattern: 'I - V - vi - IV', name: 'The Pop Progression' },
      complex: { chords: ['I', 'iii', 'vi', 'IV', 'I', 'V', 'IV', 'V'], pattern: 'I - iii - vi - IV - I - V - IV - V', name: 'Extended Pop' }
    },
    sad: {
      simple: { chords: ['vi', 'IV', 'I', 'V'], pattern: 'vi - IV - I - V', name: 'Emotional Minor' },
      complex: { chords: ['vi', 'IV', 'I', 'V', 'vi', 'iii', 'IV', 'V'], pattern: 'vi - IV - I - V - vi - iii - IV - V', name: 'Melancholy Extended' }
    },
    energetic: {
      simple: { chords: ['I', 'IV', 'V', 'I'], pattern: 'I - IV - V - I', name: 'Classic Rock' },
      complex: { chords: ['I', 'bVII', 'IV', 'I'], pattern: 'I - bVII - IV - I', name: 'Power Rock' }
    },
    chill: {
      simple: { chords: ['Imaj7', 'vi7', 'ii7', 'V7'], pattern: 'Imaj7 - vi7 - ii7 - V7', name: 'Smooth Jazz' },
      complex: { chords: ['Imaj7', 'iii7', 'vi7', 'ii7', 'V7', 'Imaj7'], pattern: 'Imaj7 - iii7 - vi7 - ii7 - V7 - Imaj7', name: 'Neo Soul' }
    }
  }

  const keyChords = {
    'C': { 'I': 'C', 'ii': 'Dm', 'iii': 'Em', 'IV': 'F', 'V': 'G', 'vi': 'Am', 'bVII': 'Bb', 'Imaj7': 'Cmaj7', 'ii7': 'Dm7', 'iii7': 'Em7', 'vi7': 'Am7', 'V7': 'G7' },
    'G': { 'I': 'G', 'ii': 'Am', 'iii': 'Bm', 'IV': 'C', 'V': 'D', 'vi': 'Em', 'bVII': 'F', 'Imaj7': 'Gmaj7', 'ii7': 'Am7', 'iii7': 'Bm7', 'vi7': 'Em7', 'V7': 'D7' },
    'D': { 'I': 'D', 'ii': 'Em', 'iii': 'F#m', 'IV': 'G', 'V': 'A', 'vi': 'Bm', 'bVII': 'C', 'Imaj7': 'Dmaj7', 'ii7': 'Em7', 'iii7': 'F#m7', 'vi7': 'Bm7', 'V7': 'A7' },
    'A': { 'I': 'A', 'ii': 'Bm', 'iii': 'C#m', 'IV': 'D', 'V': 'E', 'vi': 'F#m', 'bVII': 'G', 'Imaj7': 'Amaj7', 'ii7': 'Bm7', 'iii7': 'C#m7', 'vi7': 'F#m7', 'V7': 'E7' },
    'E': { 'I': 'E', 'ii': 'F#m', 'iii': 'G#m', 'IV': 'A', 'V': 'B', 'vi': 'C#m', 'bVII': 'D', 'Imaj7': 'Emaj7', 'ii7': 'F#m7', 'iii7': 'G#m7', 'vi7': 'C#m7', 'V7': 'B7' },
    'F': { 'I': 'F', 'ii': 'Gm', 'iii': 'Am', 'IV': 'Bb', 'V': 'C', 'vi': 'Dm', 'bVII': 'Eb', 'Imaj7': 'Fmaj7', 'ii7': 'Gm7', 'iii7': 'Am7', 'vi7': 'Dm7', 'V7': 'C7' },
    'Am': { 'I': 'Am', 'ii': 'Bdim', 'iii': 'C', 'IV': 'Dm', 'V': 'Em', 'vi': 'F', 'bVII': 'G', 'Imaj7': 'Am7', 'ii7': 'Bm7b5', 'iii7': 'Cmaj7', 'vi7': 'Fmaj7', 'V7': 'Em7' },
    'Em': { 'I': 'Em', 'ii': 'F#dim', 'iii': 'G', 'IV': 'Am', 'V': 'Bm', 'vi': 'C', 'bVII': 'D', 'Imaj7': 'Em7', 'ii7': 'F#m7b5', 'iii7': 'Gmaj7', 'vi7': 'Cmaj7', 'V7': 'Bm7' }
  }

  const selectedMood = progressions[mood] || progressions.happy
  const selectedComplexity = selectedMood[complexity] || selectedMood.simple
  const keyMap = keyChords[key] || keyChords['C']

  const actualChords = selectedComplexity.chords.map(numeral => keyMap[numeral] || numeral)

  const bpmSuggestions = {
    happy: 120, sad: 70, energetic: 140, chill: 85
  }

  const strummingPatterns = {
    happy: 'D DU UDU', sad: 'D - DU - DU', energetic: 'D D D D', chill: 'D - D UDU'
  }

  return {
    name: selectedComplexity.name,
    key: key,
    chords: actualChords,
    pattern: selectedComplexity.pattern,
    mood: mood,
    genre: genre,
    bpm_suggestion: bpmSuggestions[mood] || 100,
    strumming: strummingPatterns[mood] || 'D DU UDU',
    tips: [
      'Focus on smooth transitions between chords',
      'Use a metronome to keep steady time',
      'Try varying the dynamics for expression'
    ],
    similar_songs: getSimilarSongs(mood, genre)
  }
}

function getSimilarSongs(mood, genre) {
  const songs = {
    'happy-pop': ['Happy - Pharrell Williams', 'Uptown Funk - Bruno Mars', 'Can\'t Stop The Feeling - Justin Timberlake'],
    'happy-rock': ['Mr. Brightside - The Killers', 'Don\'t Stop Believin\' - Journey', 'Livin\' on a Prayer - Bon Jovi'],
    'sad-pop': ['Someone Like You - Adele', 'Fix You - Coldplay', 'Say Something - A Great Big World'],
    'sad-rock': ['Nothing Else Matters - Metallica', 'Hurt - Johnny Cash', 'Mad World - Gary Jules'],
    'energetic-rock': ['Back in Black - AC/DC', 'Smells Like Teen Spirit - Nirvana', 'Enter Sandman - Metallica'],
    'chill-jazz': ['Autumn Leaves - Various', 'Blue in Green - Miles Davis', 'Take Five - Dave Brubeck']
  }
  return songs[`${mood}-${genre}`] || ['Wonderwall - Oasis', 'Let It Be - The Beatles', 'Hotel California - Eagles']
}

function generateFallbackTips({ weakAreas, recentChords }) {
  const tips = [
    {
      title: 'Slow Down to Speed Up',
      description: 'Practice at 50% speed with perfect form. Speed will come naturally as muscle memory develops.',
      exercise: 'Set metronome to 60 BPM, play chord changes on each beat.'
    },
    {
      title: 'Focus on Transitions',
      description: 'The hardest part isn\'t the chords - it\'s moving between them smoothly.',
      exercise: 'Practice just two chords back and forth for 2 minutes each pair.'
    },
    {
      title: 'Use Visual Anchors',
      description: 'Find the finger that moves the least between chords and keep it as an anchor.',
      exercise: `For ${recentChords[0] || 'G'} to ${recentChords[1] || 'C'}, identify which finger stays put.`
    },
    {
      title: 'Record Yourself',
      description: 'You\'ll hear mistakes you don\'t notice while playing. It\'s uncomfortable but incredibly valuable.',
      exercise: 'Record a 1-minute practice session and listen back critically.'
    },
    {
      title: 'Consistency Over Duration',
      description: '15 focused minutes daily beats 2 hours once a week.',
      exercise: 'Set a daily reminder and commit to just 15 minutes of practice.'
    }
  ]

  // Customize based on weak areas
  if (weakAreas.includes('timing')) {
    tips.unshift({
      title: 'Master the Metronome',
      description: 'Timing issues often come from rushing. The metronome is your best friend.',
      exercise: 'Practice with metronome for entire session. Count out loud: 1-2-3-4.'
    })
  }

  if (weakAreas.includes('barre chords')) {
    tips.unshift({
      title: 'Barre Chord Breakthrough',
      description: 'Use your arm weight, not just finger strength. Roll your index finger slightly.',
      exercise: 'Hold F barre chord for 30 seconds, release, repeat 5 times.'
    })
  }

  return { tips: tips.slice(0, 5) }
}

// Export utility for checking API status
export function getAIStatus() {
  return {
    available: isAIAvailable(),
    mode: isAIAvailable() ? 'ai-powered' : 'offline-mode',
    message: isAIAvailable() 
      ? 'AI-powered lessons are active!' 
      : 'Running in offline mode with curated lessons. Add VITE_OPENAI_API_KEY for AI features.'
  }
}

