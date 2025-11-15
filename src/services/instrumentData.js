// Multi-instrument support data
// Provides chord shapes, tunings, and scale patterns for different instruments

export const INSTRUMENTS = {
  guitar: {
    name: 'Guitar',
    icon: '🎸',
    strings: 6,
    tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
    frets: 22
  },
  bass: {
    name: 'Bass',
    icon: '🎸',
    strings: 4,
    tuning: ['E', 'A', 'D', 'G'],
    frets: 24
  },
  ukulele: {
    name: 'Ukulele',
    icon: '🎸',
    strings: 4,
    tuning: ['G', 'C', 'E', 'A'],
    frets: 15
  },
  piano: {
    name: 'Piano',
    icon: '🎹',
    keys: 88,
    range: ['A0', 'C8']
  },
  drums: {
    name: 'Drums',
    icon: '🥁',
    pads: ['Kick', 'Snare', 'Hi-Hat', 'Tom 1', 'Tom 2', 'Tom 3', 'Crash', 'Ride']
  }
}

// Guitar chord library
export const GUITAR_CHORDS = {
  'C': { fingers: [null, 3, 2, 0, 1, 0], name: 'C Major' },
  'D': { fingers: [null, null, 0, 2, 3, 2], name: 'D Major' },
  'E': { fingers: [0, 2, 2, 1, 0, 0], name: 'E Major' },
  'F': { fingers: [1, 3, 3, 2, 1, 1], name: 'F Major' },
  'G': { fingers: [3, 2, 0, 0, 0, 3], name: 'G Major' },
  'A': { fingers: [null, 0, 2, 2, 2, 0], name: 'A Major' },
  'B': { fingers: [null, 2, 4, 4, 4, 2], name: 'B Major' },
  'Am': { fingers: [null, 0, 2, 2, 1, 0], name: 'A Minor' },
  'Em': { fingers: [0, 2, 2, 0, 0, 0], name: 'E Minor' },
  'Dm': { fingers: [null, null, 0, 2, 3, 1], name: 'D Minor' }
}

// Bass chord library (typically played as root notes)
export const BASS_CHORDS = {
  'C': { fingers: [null, 3, null, null], name: 'C', fret: 3 },
  'D': { fingers: [null, null, 0, null], name: 'D', fret: 0 },
  'E': { fingers: [0, null, null, null], name: 'E', fret: 0 },
  'F': { fingers: [1, null, null, null], name: 'F', fret: 1 },
  'G': { fingers: [3, null, null, null], name: 'G', fret: 3 },
  'A': { fingers: [null, 0, null, null], name: 'A', fret: 0 },
  'B': { fingers: [null, 2, null, null], name: 'B', fret: 2 }
}

// Ukulele chord library
export const UKULELE_CHORDS = {
  'C': { fingers: [0, 0, 0, 3], name: 'C Major' },
  'D': { fingers: [2, 2, 2, 0], name: 'D Major' },
  'E': { fingers: [4, 4, 4, 2], name: 'E Major' },
  'F': { fingers: [2, 0, 1, 0], name: 'F Major' },
  'G': { fingers: [0, 2, 3, 2], name: 'G Major' },
  'A': { fingers: [2, 1, 0, 0], name: 'A Major' },
  'Am': { fingers: [2, 0, 0, 0], name: 'A Minor' },
  'Em': { fingers: [0, 4, 3, 2], name: 'E Minor' },
  'Dm': { fingers: [2, 2, 1, 0], name: 'D Minor' }
}

// Piano chord library (MIDI note numbers)
export const PIANO_CHORDS = {
  'C': { notes: [60, 64, 67], name: 'C Major' },
  'D': { notes: [62, 66, 69], name: 'D Major' },
  'E': { notes: [64, 68, 71], name: 'E Major' },
  'F': { notes: [65, 69, 72], name: 'F Major' },
  'G': { notes: [67, 71, 74], name: 'G Major' },
  'A': { notes: [69, 73, 76], name: 'A Major' },
  'B': { notes: [71, 75, 78], name: 'B Major' },
  'Am': { notes: [69, 72, 76], name: 'A Minor' },
  'Em': { notes: [64, 67, 71], name: 'E Minor' },
  'Dm': { notes: [62, 65, 69], name: 'D Minor' }
}

// Drum patterns library
export const DRUM_PATTERNS = {
  'Rock Basic': {
    kick: [1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 1, 0, 0, 0, 1, 0],
    hihat: [1, 1, 1, 1, 1, 1, 1, 1]
  },
  'Disco': {
    kick: [1, 0, 1, 0, 1, 0, 1, 0],
    snare: [0, 0, 1, 0, 0, 0, 1, 0],
    hihat: [1, 1, 0, 1, 1, 1, 0, 1]
  },
  'Jazz Swing': {
    kick: [1, 0, 0, 1, 0, 0, 1, 0],
    snare: [0, 0, 1, 0, 0, 1, 0, 0],
    ride: [1, 0, 1, 1, 0, 1, 1, 0]
  },
  'Funk': {
    kick: [1, 0, 0, 1, 0, 1, 0, 0],
    snare: [0, 0, 1, 0, 0, 0, 1, 0],
    hihat: [1, 1, 0, 1, 1, 0, 1, 1]
  }
}

// Scale patterns for fretted instruments
export const SCALE_PATTERNS = {
  guitar: {
    'Major': {
      pattern: [2, 2, 1, 2, 2, 2, 1],
      positions: [
        { name: 'Position 1', startFret: 0, shape: [0, 2, 4, 5, 7, 9, 11, 12] },
        { name: 'Position 2', startFret: 2, shape: [2, 4, 5, 7, 9, 11, 12, 14] }
      ]
    },
    'Minor Pentatonic': {
      pattern: [3, 2, 2, 3, 2],
      positions: [
        { name: 'Box 1', startFret: 0, shape: [0, 3, 5, 7, 10, 12] },
        { name: 'Box 2', startFret: 3, shape: [3, 5, 7, 8, 10, 12] }
      ]
    }
  },
  bass: {
    'Major': {
      pattern: [2, 2, 1, 2, 2, 2, 1],
      positions: [
        { name: 'Position 1', startFret: 0, shape: [0, 2, 4, 5, 7, 9, 11, 12] }
      ]
    }
  },
  ukulele: {
    'Major': {
      pattern: [2, 2, 1, 2, 2, 2, 1],
      positions: [
        { name: 'Position 1', startFret: 0, shape: [0, 2, 4, 5, 7, 9, 11, 12] }
      ]
    }
  }
}

export function getChordForInstrument(chordName, instrument) {
  const chordLibraries = {
    guitar: GUITAR_CHORDS,
    bass: BASS_CHORDS,
    ukulele: UKULELE_CHORDS,
    piano: PIANO_CHORDS
  }
  
  const library = chordLibraries[instrument]
  return library ? library[chordName] : null
}

export function getAllChordsForInstrument(instrument) {
  const chordLibraries = {
    guitar: GUITAR_CHORDS,
    bass: BASS_CHORDS,
    ukulele: UKULELE_CHORDS,
    piano: PIANO_CHORDS,
    drums: DRUM_PATTERNS
  }
  
  return chordLibraries[instrument] || {}
}

export function getScalePattern(instrument, scaleName) {
  return SCALE_PATTERNS[instrument]?.[scaleName] || null
}
