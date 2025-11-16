<template>
  <section class="ai-lesson">
    <img src="/images/ai-lesson.svg" alt="AI Lesson" class="page-hero" />
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin: 20px 0;">
      <FeatureIcons icon="ai" :size="48" />
      <h2 style="margin: 0;">AI Lesson Generator</h2>
    </div>
    <p class="subtitle">Describe your goal and get a personalized video-backed lesson plan.</p>

    <form class="controls" @submit.prevent="generate">
      <label>
        Goal
        <input v-model="goal" placeholder="e.g., Smooth chord changes from C to G at 100 BPM" />
      </label>
      <label>
        Skill level
        <select v-model="level">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
      <label>
        Style
        <select v-model="style">
          <option>Rock</option>
          <option>Blues</option>
          <option>Jazz</option>
          <option>Country</option>
          <option>Metal</option>
        </select>
      </label>
      <button :disabled="loading" type="submit">{{ loading? 'Generating…' : 'Generate Lesson' }}</button>
      <button v-if="!premium && quota<=0" type="button" class="reward" @click="unlockWithAd">Watch Ad to Unlock +1</button>
    </form>

    <div v-if="plan" class="plan">
      <h3>{{ plan.title }}</h3>
      <ol>
        <li v-for="(step,idx) in plan.steps" :key="idx">{{ step }}</li>
      </ol>
      <div class="video" v-if="plan.videoUrl && plan.videoUrl.trim()">
        <video :src="plan.videoUrl" controls preload="metadata" />
      </div>
      <div class="video-placeholder" v-else>
        <p>📹 Generate a short instructional clip and step-by-step plan.</p>
        <p class="hint">Follow the step-by-step instructions above</p>
      </div>
      <div class="cta">
        <button @click="savePlan">Save to My Practice</button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FeatureIcons from '../assets/logos/FeatureIcons.vue'
import { generateLessonPlan } from '../services/aiService'
import { saveLessonPlan } from '../services/progressService'
import { isPremium, getDailyLessonRemaining, consumeLessonSlot, addRewardCredit } from '../services/featureFlags'
import { showReward } from '../services/adService'
import { log } from '../services/analyticsService'

const goal = ref('Smooth chord changes from C to G at 100 BPM')
const level = ref('Beginner')
const style = ref('Rock')
const loading = ref(false)
const error = ref('')
const plan = ref(null)
const quota = ref(getDailyLessonRemaining())
const premium = ref(isPremium())

async function generate() {
  if (!premium.value && quota.value <= 0) {
    error.value = 'Daily free AI lesson quota reached. Watch a rewarded ad or upgrade.'
    return
  }
  loading.value = true
  error.value = ''
  plan.value = null
  try {
    plan.value = await generateLessonPlan({ goal: goal.value, level: level.value, style: style.value })
    if (!premium.value) {
      consumeLessonSlot()
      quota.value = getDailyLessonRemaining()
    }
    log('ai_lesson_generated', { level: level.value, style: style.value })
  } catch (e) {
    error.value = 'Could not generate lesson right now.'
    console.warn(e)
  } finally {
    loading.value = false
  }
}

function savePlan() {
  if (plan.value) {
    saveLessonPlan(plan.value)
    alert('Saved to My Practice!')
    log('ai_lesson_saved', { id: plan.value.id })
  }
}

async function unlockWithAd(){
  try {
    const reward = await showReward()
    if (reward) {
      addRewardCredit(1)
      quota.value = getDailyLessonRemaining()
      alert('Thanks! You earned +1 AI generation for today.')
      log('reward_ad_completed', { amount: reward.amount })
    } else {
      alert('Ad not available right now. Try again later.')
    }
  } catch(e){
    console.warn(e)
    alert('Ad failed to load. Please try again later.')
  }
}
</script>

<style scoped>
.ai-lesson { padding: 16px; color:#e9ecf6; background:#000; min-height:100% }
.page-hero { width: 100%; max-width: 600px; height: auto; margin: 0 auto 16px; display: block; border-radius: 12px; animation: floatSlow 9s ease-in-out infinite }
@keyframes floatSlow { 0%{ transform:translateY(0)} 50%{ transform:translateY(-6px)} 100%{ transform:translateY(0)} }
.subtitle { color:#a9b2c9 }
.controls { display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:12px; margin:12px 0 }
input,select { width:100%; padding:10px; border-radius:8px; border:1px solid #1a1a1a; background:#0a0a0a; color:#e9ecf6 }
button { background:#5b74ff; border:none; color:#fff; padding:10px 14px; border-radius:8px; cursor:pointer }
.reward { background:#00b894 }
.plan { margin-top:16px; background:#0a0a0a; border:1px solid #1a1a1a; border-radius:12px; padding:14px }
.video { margin-top:10px }
video { width:100%; max-width:720px; border-radius:8px; }
.video-placeholder { 
  margin-top:10px; 
  padding:24px; 
  background:rgba(91,116,255,0.1); 
  border:2px dashed #5b74ff; 
  border-radius:8px; 
  text-align:center; 
}
.video-placeholder p { margin:8px 0 }
.video-placeholder .hint { font-size:0.9em; color:#a9b2c9; font-style:italic }
.cta { margin-top:12px }
.error { color:#ff8a8a }
</style>
