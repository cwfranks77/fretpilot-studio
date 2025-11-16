// progressService.js
// Simple local storage-based persistence. Replace with real backend sync later.

const KEY = 'fretpilot-progress'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function write(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)) } catch {}
}

export function saveLessonPlan(plan) {
  const db = read()
  db.lessons = db.lessons || []
  db.lessons.unshift({ ...plan, savedAt: Date.now() })
  write(db)
}

export function saveJamTrack(track) {
  const db = read()
  db.jams = db.jams || []
  db.jams.unshift({ ...track, savedAt: Date.now() })
  write(db)
}

export function listSaved() {
  const db = read()
  return db
}

// Basic per-lesson progress tracking used by AIVideoLessons.vue
export function updateLessonProgress(lessonId, updates = {}) {
  if (!lessonId) return
  const db = read()
  db.lessonProgress = db.lessonProgress || {}
  const prev = db.lessonProgress[lessonId] || {}
  db.lessonProgress[lessonId] = { ...prev, ...updates, updatedAt: Date.now() }
  write(db)
}

export function getLessonProgress(lessonId) {
  if (!lessonId) return null
  const db = read()
  return (db.lessonProgress || {})[lessonId] || null
}
