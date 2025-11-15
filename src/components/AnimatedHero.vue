<template>
  <div class="animated-hero" :style="{ height }">
    <img :src="src" :alt="alt" class="img" :class="{ 'float': float, 'shimmer': shimmer }" />
    <div v-if="overlay" class="overlay"></div>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  height: { type: String, default: '220px' },
  float: { type: Boolean, default: true },
  shimmer: { type: Boolean, default: true },
  overlay: { type: Boolean, default: false }
})
</script>

<style scoped>
.animated-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
}
.img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
  transform: scale(1.02);
}
.float { animation: floatSlow 6s ease-in-out infinite; }
.shimmer { mask-image: linear-gradient(120deg, rgba(0,0,0,.9) 40%, rgba(0,0,0,.6) 50%, rgba(0,0,0,.9) 60%); mask-size: 200% 100%; animation: shimmerMove 8s linear infinite; }
.overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.04), transparent 60%),
              radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.04), transparent 60%);
}

@keyframes floatSlow {
  0% { transform: translateY(0) scale(1.02); }
  50% { transform: translateY(-6px) scale(1.025); }
  100% { transform: translateY(0) scale(1.02); }
}
@keyframes shimmerMove {
  0% { mask-position: 200% 0; }
  100% { mask-position: -200% 0; }
}
</style>
