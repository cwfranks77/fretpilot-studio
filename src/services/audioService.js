// Professional Audio Service for FretPilot Studio
// Uses Tone.js for realistic instrument sounds

import * as Tone from 'tone'

// Audio context state
let isInitialized = false
let currentInstrument = 'guitar'

// Instruments
let guitarSampler = null
let pianoSampler = null
let bassSampler = null
let ukeleleSampler = null

// Effects chain
let reverb = null
let compressor = null

// Note frequencies for all instruments
const noteFrequencies = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
}

// Guitar standard tuning (E2, A2, D3, G3, B3, E4) - low to high string
const guitarStrings = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']

// Chord definitions with actual fret positions
const chordDefinitions = {
  // Major chords
  'C': { frets: [-1, 3, 2, 0, 1, 0], notes: ['C3', 'E3', 'G3', 'C4', 'E4'] },
  'D': { frets: [-1, -1, 0, 2, 3, 2], notes: ['D3', 'A3', 'D4', 'F#4'] },
  'E': { frets: [0, 2, 2, 1, 0, 0], notes: ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'] },
  'F': { frets: [1, 3, 3, 2, 1, 1], notes: ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'] },
  'G': { frets: [3, 2, 0, 0, 0, 3], notes: ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'] },
  'A': { frets: [-1, 0, 2, 2, 2, 0], notes: ['A2', 'E3', 'A3', 'C#4', 'E4'] },
  'B': { frets: [-1, 2, 4, 4, 4, 2], notes: ['B2', 'F#3', 'B3', 'D#4', 'F#4'] },
  
  // Minor chords
  'Am': { frets: [-1, 0, 2, 2, 1, 0], notes: ['A2', 'E3', 'A3', 'C4', 'E4'] },
  'Bm': { frets: [-1, 2, 4, 4, 3, 2], notes: ['B2', 'F#3', 'B3', 'D4', 'F#4'] },
  'Cm': { frets: [-1, 3, 5, 5, 4, 3], notes: ['C3', 'G3', 'C4', 'D#4', 'G4'] },
  'Dm': { frets: [-1, -1, 0, 2, 3, 1], notes: ['D3', 'A3', 'D4', 'F4'] },
  'Em': { frets: [0, 2, 2, 0, 0, 0], notes: ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'] },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], notes: ['F2', 'C3', 'F3', 'G#3', 'C4', 'F4'] },
  'Gm': { frets: [3, 5, 5, 3, 3, 3], notes: ['G2', 'D3', 'G3', 'A#3', 'D4', 'G4'] },
  
  // 7th chords
  'C7': { frets: [-1, 3, 2, 3, 1, 0], notes: ['C3', 'E3', 'A#3', 'C4', 'E4'] },
  'D7': { frets: [-1, -1, 0, 2, 1, 2], notes: ['D3', 'A3', 'C4', 'F#4'] },
  'E7': { frets: [0, 2, 0, 1, 0, 0], notes: ['E2', 'B2', 'D3', 'G#3', 'B3', 'E4'] },
  'G7': { frets: [3, 2, 0, 0, 0, 1], notes: ['G2', 'B2', 'D3', 'G3', 'B3', 'F4'] },
  'A7': { frets: [-1, 0, 2, 0, 2, 0], notes: ['A2', 'E3', 'G3', 'C#4', 'E4'] },
  'Am7': { frets: [-1, 0, 2, 0, 1, 0], notes: ['A2', 'E3', 'G3', 'C4', 'E4'] },
  'Em7': { frets: [0, 2, 0, 0, 0, 0], notes: ['E2', 'B2', 'D3', 'G3', 'B3', 'E4'] },
  
  // Power chords
  'E5': { frets: [0, 2, 2, -1, -1, -1], notes: ['E2', 'B2', 'E3'] },
  'A5': { frets: [-1, 0, 2, 2, -1, -1], notes: ['A2', 'E3', 'A3'] },
  'G5': { frets: [3, 5, 5, -1, -1, -1], notes: ['G2', 'D3', 'G3'] }
}

// Initialize the audio system
export async function initAudio() {
  if (isInitialized) return true
  
  try {
    await Tone.start()
    console.log('[Audio] Tone.js started')
    
    // Create effects chain
    reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.2
    }).toDestination()
    await reverb.generate()
    
    compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    }).connect(reverb)
    
    // Create realistic guitar synth using PluckSynth
    guitarSampler = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.98,
      release: 1.2
    }).connect(compressor)
    
    // Create realistic piano synth
    pianoSampler = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'triangle8'
      },
      envelope: {
        attack: 0.005,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2
      }
    }).connect(compressor)
    
    // Bass synth
    bassSampler = new Tone.MonoSynth({
      oscillator: {
        type: 'fmsine'
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.8,
        release: 0.8
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.5,
        baseFrequency: 200,
        octaves: 2.5
      }
    }).connect(compressor)
    
    // Ukulele synth (brighter pluck)
    ukeleleSampler = new Tone.PluckSynth({
      attackNoise: 2,
      dampening: 6000,
      resonance: 0.95,
      release: 0.8
    }).connect(compressor)
    
    isInitialized = true
    console.log('[Audio] All instruments initialized')
    return true
  } catch (error) {
    console.error('[Audio] Failed to initialize:', error)
    return false
  }
}

// Set current instrument
export function setInstrument(instrument) {
  currentInstrument = instrument
  console.log('[Audio] Instrument set to:', instrument)
}

// Get note from string and fret
function getNoteFromFret(stringIndex, fret) {
  if (fret < 0) return null // Muted string
  
  const openNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] // Guitar standard tuning
  const openNote = openNotes[stringIndex]
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  
  // Parse the open note
  const noteName = openNote.slice(0, -1)
  const octave = parseInt(openNote.slice(-1))
  const noteIndex = noteNames.indexOf(noteName)
  
  // Calculate new note
  const newNoteIndex = (noteIndex + fret) % 12
  const newOctave = octave + Math.floor((noteIndex + fret) / 12)
  
  return noteNames[newNoteIndex] + newOctave
}

// Play a single note
export async function playNote(note, duration = '4n', velocity = 0.7) {
  if (!isInitialized) {
    await initAudio()
  }
  
  const synth = getSynthForInstrument()
  if (!synth) return
  
  try {
    const now = Tone.now()
    synth.triggerAttackRelease(note, duration, now, velocity)
  } catch (error) {
    console.error('[Audio] Error playing note:', error)
  }
}

// Play a chord with realistic strum pattern
export async function playChord(chordName, strumSpeed = 'medium', direction = 'down') {
  if (!isInitialized) {
    await initAudio()
  }
  
  const chord = chordDefinitions[chordName]
  if (!chord) {
    console.warn('[Audio] Unknown chord:', chordName)
    return
  }
  
  const synth = getSynthForInstrument()
  if (!synth) return
  
  // Strum timing
  const strumDelays = {
    slow: 0.06,
    medium: 0.035,
    fast: 0.02
  }
  const delay = strumDelays[strumSpeed] || strumDelays.medium
  
  // Get notes to play
  const notes = []
  for (let i = 0; i < 6; i++) {
    const fret = chord.frets[i]
    if (fret >= 0) {
      const note = getNoteFromFret(i, fret)
      if (note) notes.push({ note, stringIndex: i })
    }
  }
  
  // Reverse for upstroke
  if (direction === 'up') {
    notes.reverse()
  }
  
  // Play with strum timing
  const now = Tone.now()
  notes.forEach((noteData, index) => {
    const time = now + (index * delay)
    // Slight velocity variation for realism
    const velocity = 0.6 + (Math.random() * 0.2)
    
    try {
      if (currentInstrument === 'piano') {
        // Piano plays all notes at once
        synth.triggerAttackRelease(noteData.note, '2n', index === 0 ? now : time, velocity)
      } else {
        // Stringed instruments strum
        synth.triggerAttackRelease(noteData.note, '2n', time, velocity)
      }
    } catch (error) {
      console.error('[Audio] Error playing note:', noteData.note, error)
    }
  })
}

// Play chord by notes array
export async function playChordNotes(notes, duration = '2n') {
  if (!isInitialized) {
    await initAudio()
  }
  
  const synth = getSynthForInstrument()
  if (!synth) return
  
  const now = Tone.now()
  const delay = 0.03 // Strum delay
  
  notes.forEach((note, index) => {
    // Convert note name to proper format if needed
    let properNote = note
    if (!note.match(/\d$/)) {
      // Add octave if missing
      properNote = note + '4'
    }
    
    const time = now + (index * delay)
    const velocity = 0.6 + (Math.random() * 0.15)
    
    try {
      synth.triggerAttackRelease(properNote, duration, time, velocity)
    } catch (error) {
      console.error('[Audio] Error playing note:', properNote, error)
    }
  })
}

// Play a scale
export async function playScale(notes, tempo = 120) {
  if (!isInitialized) {
    await initAudio()
  }
  
  const synth = getSynthForInstrument()
  if (!synth) return
  
  const beatDuration = 60 / tempo
  const now = Tone.now()
  
  notes.forEach((note, index) => {
    const time = now + (index * beatDuration)
    const velocity = 0.7
    
    try {
      synth.triggerAttackRelease(note, '8n', time, velocity)
    } catch (error) {
      console.error('[Audio] Error playing scale note:', note, error)
    }
  })
}

// Play metronome click
export function playMetronomeClick(isAccent = false) {
  if (!Tone.context || Tone.context.state !== 'running') return
  
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1
    }
  }).toDestination()
  
  const note = isAccent ? 'C3' : 'C4'
  const velocity = isAccent ? 0.8 : 0.5
  
  synth.triggerAttackRelease(note, '32n', Tone.now(), velocity)
  
  // Clean up
  setTimeout(() => synth.dispose(), 500)
}

// Get synth for current instrument
function getSynthForInstrument() {
  switch (currentInstrument) {
    case 'guitar':
      return guitarSampler
    case 'piano':
      return pianoSampler
    case 'bass':
      return bassSampler
    case 'ukulele':
      return ukeleleSampler
    default:
      return guitarSampler
  }
}

// Check if audio is ready
export function isAudioReady() {
  return isInitialized
}

// Get available chords
export function getAvailableChords() {
  return Object.keys(chordDefinitions)
}

// Stop all sounds
export function stopAll() {
  if (guitarSampler) guitarSampler.releaseAll?.()
  if (pianoSampler) pianoSampler.releaseAll?.()
  if (bassSampler) bassSampler.releaseAll?.()
  if (ukeleleSampler) ukeleleSampler.releaseAll?.()
}

// Dispose of all audio resources
export function disposeAudio() {
  stopAll()
  guitarSampler?.dispose()
  pianoSampler?.dispose()
  bassSampler?.dispose()
  ukeleleSampler?.dispose()
  reverb?.dispose()
  compressor?.dispose()
  isInitialized = false
}

export default {
  initAudio,
  setInstrument,
  playNote,
  playChord,
  playChordNotes,
  playScale,
  playMetronomeClick,
  isAudioReady,
  getAvailableChords,
  stopAll,
  disposeAudio
}

