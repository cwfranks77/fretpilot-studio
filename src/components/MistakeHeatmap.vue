<template>
  <section class="heatmap">
    <h3>Mistake Heatmap</h3>
    <p class="hint">Darker cells indicate more timing/pitch issues at that string/fret.</p>
    <div class="board" role="img" aria-label="Fretboard heatmap">
      <div class="row header">
        <div class="cell label"></div>
        <div v-for="f in frets" :key="'h'+f" class="cell label">{{ f }}</div>
      </div>
      <div v-for="(row, rIdx) in data" :key="'r'+rIdx" class="row">
        <div class="cell label">{{ strings[rIdx] }}</div>
        <div v-for="(v, cIdx) in row" :key="'c'+cIdx" class="cell" :style="cellStyle(v)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  heatmap: { type: Array, required: true }, // array[6][13] 0..1
})

const strings = ['e', 'B', 'G', 'D', 'A', 'E'] // high to low
const frets = Array.from({ length: 13 }, (_, i) => i)

const data = computed(() => {
  // Ensure 6x13 with default zeros
  const rows = 6, cols = 13
  const out = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => 0))
  if (Array.isArray(props.heatmap)) {
    for (let r = 0; r < Math.min(rows, props.heatmap.length); r++) {
      const row = props.heatmap[r]
      if (Array.isArray(row)) {
        for (let c = 0; c < Math.min(cols, row.length); c++) out[r][c] = Number(row[c]) || 0
      }
    }
  }
  return out
})

function cellStyle(v){
  // map 0..1 -> transparency for red overlay
  const clamped = Math.max(0, Math.min(1, v))
  const alpha = clamped * 0.9 + 0.05
  return { background: `linear-gradient(180deg, rgba(255,82,82,${alpha}), rgba(255,82,82,${alpha}))` }
}
</script>

<style scoped>
.heatmap { margin-top: 12px; color:#e6ebf5 }
.hint { color:#9fb0c9; margin: 6px 0 10px }
.board { display:inline-block; border:1px solid #324052; border-radius:10px; overflow:hidden; background:#131a24 }
.row { display:flex }
.cell { width:28px; height:24px; border-right:1px solid #273243; border-bottom:1px solid #273243 }
.row:last-child .cell { border-bottom:none }
.cell:last-child { border-right:none }
.label { display:flex; align-items:center; justify-content:center; background:#1c2533; color:#a9b4cb; font-size:12px; width:30px }
.header .cell { background:#1a2230; font-weight:600 }
</style>
