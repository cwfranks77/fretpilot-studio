// aiService.js
// Uses backend endpoints when API_BASE is configured, otherwise falls back to stubs.
import { API_BASE, postJSON } from './config'

export async function generateLessonPlan({ goal, level, style }) {
  if (API_BASE) {
    try { return await postJSON('/api/lessons/generate', { goal, level, style }) } catch {}
  }
  await sleep(600) // fallback
  return {
    id: `plan_${Date.now()}`,
    title: `Lesson: ${goal} (${level}, ${style})`,
    steps: [
      `Warm-up: 2 minutes of ${style} strumming at 60 BPM`,
      'Target riff: break into 2 bars, loop each 10x',
      'Metronome escalation: +10 BPM every 2 successful loops',
      'Record a 20s take and compare timing heatmap',
    ],
    videoUrl: '',
  }
}

export async function analyzePractice(blob) {
  if (API_BASE) {
    try {
      // NOTE: For demo simplicity we send no binary; real impl should send FormData with blob
      return await postJSON('/api/practice/analyze', { size: blob?.size || 0 })
    } catch {}
  }
  await sleep(800)
  const tempo = 90 + Math.floor(Math.random() * 25)
  const stability = 70 + Math.floor(Math.random() * 25)
  const focus = stability > 80 ? 'Speed up gradually' : 'Focus on steady downstrokes'
  // Generate a synthetic 6x13 heatmap where open strings and mid-neck have a bit more variance
  const rows = 6, cols = 13
  const heatmap = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const openBias = c === 0 ? 0.25 : 0
      const mid = Math.max(0, 1 - Math.abs(c - 5) / 8)
      const noise = Math.random() * 0.15
      return Math.min(1, 0.1 + openBias + mid * 0.2 + noise)
    })
  )
  return {
    tempo,
    stability,
    focus,
    heatmap,
    drills: [
      'Clap along with metronome at 70% tempo for 2 minutes',
      'Accented downbeat every 4th stroke for feel',
      'Record again and compare timing spread',
    ],
  }
}

export async function generateJamTrack({ key, tempo, style }) {
  if (API_BASE) {
    try { return await postJSON('/api/jam/generate', { key, tempo, style }) } catch {}
  }
  await sleep(500)
  const progressions = {
    Rock: ['I', 'V', 'vi', 'IV'],
    Blues: ['I7', 'IV7', 'V7', 'IV7'],
    Jazz: ['ii', 'V', 'I', 'vi'],
    Funk: ['i', 'bVII', 'IV', 'bVII'],
    Metal: ['i', 'VI', 'VII', 'i'],
  }
  const progression = progressions[style] || progressions.Rock
  return {
    url: '', // Provide generated audio URL when backend is available
    progression: romanToChords(progression, key),
    key,
    tempo,
    style,
  }
}

function romanToChords(roman, key) {
  // Placeholder mapping for a few keys
  const maps = {
    C: { I: 'C', V: 'G', vi: 'Am', IV: 'F', ii: 'Dm', i: 'Cm', bVII: 'Bb', VII: 'B', VI: 'A', IV7:'F7', I7:'C7', V7:'G7' },
    G: { I: 'G', V: 'D', vi: 'Em', IV: 'C', ii: 'Am', i: 'Gm', bVII: 'F', VII: 'F#', VI: 'E', IV7:'C7', I7:'G7', V7:'D7' },
    D: { I: 'D', V: 'A', vi: 'Bm', IV: 'G', ii: 'Em', i: 'Dm', bVII: 'C', VII: 'C#', VI: 'B', IV7:'G7', I7:'D7', V7:'A7' },
    A: { I: 'A', V: 'E', vi: 'F#m', IV: 'D', ii: 'Bm', i: 'Am', bVII: 'G', VII: 'G#', VI: 'F#', IV7:'D7', I7:'A7', V7:'E7' },
    E: { I: 'E', V: 'B', vi: 'C#m', IV: 'A', ii: 'F#m', i: 'Em', bVII: 'D', VII: 'D#', VI: 'C#', IV7:'A7', I7:'E7', V7:'B7' },
  }
  const m = maps[key] || maps.C
  return roman.map(r => m[r] || r)
}

export async function generateAIVideo({ prompt, skillLevel, instrument, duration }) {
  if (API_BASE) {
    try {
      return await postJSON('/api/video/generate', { prompt, skillLevel, instrument, duration })
    } catch {}
  }
  
  // Simulate video generation with realistic delay
  await sleep(8000)
  
  // Generate mock video response
  return {
    videoUrl: createMockVideoUrl(prompt, instrument),
    thumbnail: '/images/video-placeholder.png',
    duration: duration === 'short' ? '3:24' : duration === 'medium' ? '7:12' : '15:48',
    title: prompt.substring(0, 60),
    transcript: generateTranscript(prompt, skillLevel, instrument)
  }
}

function createMockVideoUrl(prompt, instrument) {
  // In production, this would return a real video URL from the AI service
  // For now, return a data URL or placeholder
  return 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0'
}

function generateTranscript(prompt, skillLevel, instrument) {
  return `Welcome to your personalized ${instrument} lesson. Today we'll be working on: ${prompt}. This lesson is designed for ${skillLevel} players. Let's get started...`
}

function sleep(ms){ return new Promise(res=>setTimeout(res,ms)) }
