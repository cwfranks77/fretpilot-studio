<template>
  <section class="orders">
    <h2>📦 Order History</h2>
    <p v-if="orders.length === 0" class="empty">No orders yet.</p>
    <div v-else class="order-list">
      <div v-for="o in orders" :key="o.id" class="order-card">
        <div class="row">
          <div>
            <div class="id">Order #{{ o.id }}</div>
            <div class="date">{{ fmt(o.createdAt) }}</div>
          </div>
          <div class="status" :class="o.status">{{ o.status }}</div>
        </div>
        <div class="items">
          <div v-for="it in o.items" :key="it.id" class="item">
            <span>{{ it.name }} × {{ it.quantity }}</span>
            <span>${{ (it.price * it.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="row total">
          <span>Payment: {{ o.paymentMethod }}</span>
          <strong>Total: ${{ o.total.toFixed(2) }}</strong>
        </div>
        <div v-if="o.fulfillment?.length" class="fulfillment">
          <div v-for="f in o.fulfillment" :key="f.vendor+f.type" class="fulfill-row">
            <span>{{ f.vendor }} • {{ f.type }}</span>
            <span>Items: {{ f.quantity }}</span>
          </div>
        </div>
        <div v-if="o.tracking?.length" class="tracking">
          <div v-for="t in o.tracking" :key="t.number" class="track-row">
            <a :href="t.url" target="_blank" rel="noopener">Track: {{ t.carrier }} {{ t.number }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders } from '../services/orderService'

const orders = ref([])

function fmt(iso) {
  const d = new Date(iso)
  return d.toLocaleString()
}

onMounted(() => {
  orders.value = getOrders()
})
</script>

<style scoped>
.orders { padding: 24px; color: #e8ecf6; min-height: 100vh; background: #000; }
.empty { color: #8892a6; }
.order-list { display: grid; gap: 16px; max-width: 900px; margin: 0 auto; }
.order-card { background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 16px; }
.row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.id { font-weight: 700; }
.date { color: #8892a6; font-size: .9em; }
.status { padding: 6px 10px; border-radius: 999px; font-weight: 700; background: #222; text-transform: capitalize; }
.status.paid { background: #153d2b; color: #28d17c; }
.status.pending { background: #2a2633; color: #c6a8ff; }
.items { border-top: 1px solid #2a2a2a; border-bottom: 1px solid #2a2a2a; padding: 8px 0; margin: 8px 0; }
.item { display: flex; justify-content: space-between; color: #cfd6e6; }
.total { color: #fff; }
.fulfillment { margin-top: 8px; color: #cfd6e6; }
.fulfill-row { display: flex; justify-content: space-between; }
.tracking { margin-top: 8px; }
.track-row a { color: #06c167; text-decoration: none; }
</style>
