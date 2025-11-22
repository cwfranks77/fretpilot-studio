<template>
  <div class="simple-lessons" data-build="canvas-v1">
    <div style="background: #06c167; color: #000; padding: 15px; text-align: center; font-weight: bold; font-size: 18px; margin-bottom: 20px;">
      ✅ CANVAS MODE ACTIVE - Build v2.0 - No Videos!
    </div>
    <h1>🎸 Guitar Lessons <small style="font-size:14px; opacity:0.6;">Canvas Mode v1</small></h1>
    
    <div v-if="!selectedLesson" class="lesson-list">
      <div 
        v-for="lesson in lessons" 
        :key="lesson.id"
        @click="selectedLesson = lesson; startLesson()"
        class="lesson-card"
      >
        <h3>{{ lesson.title }}</h3>
        <p>{{ lesson.description }}</p>
      </div>
    </div>
    
    <div v-else class="lesson-player">
      <button @click="selectedLesson = null" class="back-btn">← Back to Lessons</button>
      <h2>{{ selectedLesson.title }}</h2>
      
      <div class="canvas-container">
        <canvas ref="lessonCanvas" width="1280" height="720"></canvas>
      </div>
      
      <div class="controls">
        <button @click="togglePlay" class="btn-play">{{ playing ? '⏸ Pause' : '▶️ Play' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const selectedLesson = ref(null);
console.log('[SimpleLessons] Component loaded - canvas build v1');
const playing = ref(false);
const lessonCanvas = ref(null);
let animationFrame = null;

const lessons = [
  { id: 1, title: 'Beginner Chords', description: 'Learn C, G, and D chords' },
  { id: 2, title: 'Strumming Patterns', description: 'Basic rhythm techniques' },
  { id: 3, title: 'Finger Exercises', description: 'Build finger strength' }
];

function startLesson() {
  console.log('Starting lesson:', selectedLesson.value);
  playing.value = true;
  setTimeout(() => renderLesson(), 100);
}

function togglePlay() {
  playing.value = !playing.value;
  console.log('Toggle play:', playing.value);
  if (playing.value) {
    renderLesson();
  } else {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  }
}

function renderLesson() {
  console.log('Render lesson called, canvas:', lessonCanvas.value, 'playing:', playing.value);
  if (!lessonCanvas.value || !playing.value) return;
  
  const ctx = lessonCanvas.value.getContext('2d');
  console.log('Got context, drawing...');
  
  // Clear
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1280, 720);
  
  // Draw fretboard
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  
  // Horizontal strings
  for (let i = 0; i < 6; i++) {
    const y = 200 + (i * 60);
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.lineTo(1000, y);
    ctx.stroke();
  }
  
  // Vertical frets
  for (let i = 0; i <= 12; i++) {
    const x = 200 + (i * 66);
    ctx.beginPath();
    ctx.moveTo(x, 200);
    ctx.lineTo(x, 500);
    ctx.stroke();
  }
  
  // Title
  ctx.fillStyle = '#fff';
  ctx.font = '32px Arial';
  ctx.fillText(selectedLesson.value.title, 400, 100);
  
  animationFrame = requestAnimationFrame(renderLesson);
}

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.simple-lessons {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  color: #fff;
}

.lesson-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.lesson-card {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.lesson-card:hover {
  transform: scale(1.05);
  background: #2a2a2a;
}

.lesson-card h3 {
  margin: 0 0 10px 0;
  color: #06c167;
}

.lesson-player {
  margin-top: 20px;
}

.back-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
}

.canvas-container {
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin: 20px 0;
}

canvas {
  width: 100%;
  height: auto;
  display: block;
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-play {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
}
</style>
