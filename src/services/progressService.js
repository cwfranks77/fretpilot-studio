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
