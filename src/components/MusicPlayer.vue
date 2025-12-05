<template>
  <section class="music-player" aria-label="Music player">
    <div class="music-player__header">
      <div>
        <p class="eyebrow">Ambient practice mix</p>
        <h2>Music Player</h2>
      </div>
      <p class="status">{{ playing ? 'Now playing' : 'Paused' }}</p>
    </div>

    <div class="music-player__body">
      <ul class="playlist">
        <li
          v-for="(track, index) in tracks"
          :key="track.id"
          :class="{ active: index === activeTrackIndex }"
          @click="playTrack(index)"
        >
          <div>
            <p class="track-title">{{ track.title }}</p>
            <p class="track-details">{{ track.artist }} · {{ track.mood }}</p>
          </div>
          <span class="duration">{{ track.duration }}</span>
        </li>
      </ul>

      <div class="controls">
        <button class="ghost" @click="prevTrack" aria-label="Previous track">⏮</button>
        <button class="play-toggle" @click="togglePlay" :aria-pressed="playing">
          {{ playing ? '❚❚' : '▶' }}
        </button>
        <button class="ghost" @click="nextTrack" aria-label="Next track">⏭</button>
      </div>

      <div class="progress" @click="seek($event)" ref="progressBar">
        <div class="progress__bar" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="time">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <audio ref="audio" :src="activeTrack.src" preload="metadata"></audio>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const tracks = [
  {
    id: 'glass-strings',
    title: 'Glass Strings',
    artist: 'FretPilot Studio',
    mood: 'luminous practice',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 371
  },
  {
    id: 'afterglow',
    title: 'Afterglow Meditations',
    artist: 'FretPilot Studio + Friends',
    mood: 'evening focus',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 284
  },
  {
    id: 'aurora',
    title: 'Aurora Walk',
    artist: 'FretPilot Studio',
    mood: 'bright circuits',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 467
  }
]

const activeTrackIndex = ref(0)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audio = ref(null)
const progressBar = ref(null)

const activeTrack = computed(() => tracks[activeTrackIndex.value])
const progressPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, (currentTime.value / duration.value) * 100)
})

function formatTime(value) {
  const sec = Math.floor(value || 0)
  const minutes = Math.floor(sec / 60)
  const seconds = sec % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function playTrack(index) {
  activeTrackIndex.value = index
  resetTime()
  play()
}

function togglePlay() {
  playing.value ? pause() : play()
}

function play() {
  const player = audio.value
  if (!player) return
  player.play().then(() => {
    playing.value = true
    duration.value = player.duration || activeTrack.duration
  }).catch(() => {
    playing.value = false
  })
}

function pause() {
  const player = audio.value
  if (!player) return
  player.pause()
  playing.value = false
}

function prevTrack() {
  if (activeTrackIndex.value > 0) {
    activeTrackIndex.value -= 1
  } else {
    activeTrackIndex.value = tracks.length - 1
  }
  resetTime()
  play()
}

function nextTrack() {
  if (activeTrackIndex.value < tracks.length - 1) {
    activeTrackIndex.value += 1
  } else {
    activeTrackIndex.value = 0
  }
  resetTime()
  play()
}

function resetTime() {
  currentTime.value = 0
  duration.value = audio.value?.duration || tracks[activeTrackIndex.value].duration
}

function seek(event) {
  const rect = progressBar.value?.getBoundingClientRect()
  if (!rect || !audio.value) return
  const clickX = event.clientX - rect.left
  const percent = clickX / rect.width
  audio.value.currentTime = percent * (duration.value || tracks[activeTrackIndex.value].duration)
}

function onTimeUpdate() {
  if (audio.value) {
    currentTime.value = audio.value.currentTime
  }
}

function onLoadedMetadata() {
  duration.value = audio.value.duration
}

function onEnded() {
  playing.value = false
}

onMounted(() => {
  const player = audio.value
  if (!player) return
  player.addEventListener('timeupdate', onTimeUpdate)
  player.addEventListener('loadedmetadata', onLoadedMetadata)
  player.addEventListener('ended', onEnded)
})

onUnmounted(() => {
  const player = audio.value
  if (!player) return
  player.removeEventListener('timeupdate', onTimeUpdate)
  player.removeEventListener('loadedmetadata', onLoadedMetadata)
  player.removeEventListener('ended', onEnded)
})
</script>

<style scoped>
.music-player {
  background: rgba(15, 16, 24, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  max-width: 900px;
  margin: 40px auto;
  box-shadow: 0 20px 40px rgba(5, 8, 15, 0.6);
}

.music-player__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.music-player__header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.status {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
}

.music-player__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.playlist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.playlist li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.playlist li.active {
  border-color: #06c167;
  background: rgba(6, 193, 103, 0.12);
}

.track-title {
  margin: 0;
  font-weight: 600;
  color: #fafafa;
}

.track-details {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: #9ca3bb;
}

.duration {
  font-size: 0.85rem;
  color: #9ca3bb;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.controls button {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: transparent;
  color: #fff;
  font-size: 1.5rem;
  padding: 12px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;
}

.controls button:hover {
  border-color: #06c167;
  transform: translateY(-2px);
}

.play-toggle {
  font-size: 1.6rem;
  font-weight: bold;
  background: linear-gradient(135deg, #00d4ff, #0066ff);
  border: none;
  padding: 12px 20px;
}

.progress {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.progress__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #00d4ff, #06c167);
  transition: width 0.1s;
}

.time {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .music-player {
    margin: 30px 16px;
  }

  .music-player__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .controls {
    gap: 6px;
  }
}
</style>
