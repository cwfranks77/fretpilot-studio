<template>
  <div class="gear-wrapper">
    <h2>🎸 Recommended Gear (Affiliate Links)</h2>
    <p class="disclosure">Some links are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you.</p>
    <div v-for="bundle in bundles" :key="bundle.name" class="bundle">
      <h3>{{ bundle.name }}</h3>
      <ul>
        <li v-for="item in bundle.items" :key="item.label">
          <a :href="item.url" target="_blank" rel="noopener nofollow" @click="track(item)">{{ item.label }}</a>
          <span class="note">— {{ item.note }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const affiliate = (typeof window !== 'undefined' && window.getReferralCode) ? window.getReferralCode() : ''

const bundles = ref([
  {
    name: 'Beginner Electric Setup',
    items: [
      { label: 'Yamaha Pacifica PAC112V', url: 'https://www.amazon.com/dp/B001R2U29C/?tag=yourtag-20', note: 'Versatile starter guitar' },
      { label: 'Boss Katana 50 Amp', url: 'https://www.amazon.com/dp/B09BFZC7PC/?tag=yourtag-20', note: 'Flexible tones & headphone out' },
      { label: 'Ernie Ball 3-Pack Strings', url: 'https://www.amazon.com/dp/B00KVP5KXA/?tag=yourtag-20', note: 'Keep fresh tone' }
    ]
  },
  {
    name: 'Recording Starter Pack',
    items: [
      { label: 'Focusrite Scarlett 2i2 Interface', url: 'https://www.amazon.com/dp/B08RCHBGY5/?tag=yourtag-20', note: 'Reliable USB interface' },
      { label: 'Audio-Technica AT2020 Mic', url: 'https://www.amazon.com/dp/B0006H92QK/?tag=yourtag-20', note: 'Affordable condenser mic' },
      { label: 'Closed-Back Headphones', url: 'https://www.amazon.com/dp/B000AJIF4E/?tag=yourtag-20', note: 'Tracking and mixing' }
    ]
  }
])

function track(item) {
  try { window.trackEvent && window.trackEvent('affiliate_click', { label: item.label }) } catch(_) {}
}
</script>
<style scoped>
.gear-wrapper { padding: 20px; max-width: 720px; margin: 0 auto; }
.gear-wrapper h2 { margin: 0 0 10px; font-size: 28px; }
.disclosure { font-size: 12px; color: #bbb; margin-bottom: 20px; }
.bundle { margin-bottom: 28px; background: rgba(255,255,255,0.03); padding: 16px 20px; border-radius: 12px; border:1px solid rgba(255,255,255,0.06); }
.bundle h3 { margin:0 0 10px; font-size: 18px; }
ul { list-style:none; padding:0; margin:0; }
li { margin:6px 0; }
a { color:#1E90FF; text-decoration:none; }
a:hover { text-decoration:underline; }
.note { color:#888; font-size:12px; margin-left:4px; }
</style>
