export function makeOrder({ items, shipping, total, paymentMethod, status = 'pending', fulfillmentSummary = [] }) {
  return {
    id: Date.now(),
    items,
    shipping,
    total,
    paymentMethod,
    status, // pending | paid | fulfilled | cancelled
    fulfillment: fulfillmentSummary, // [{type:'fretpilot'|'dropship', vendor, quantity}]
    createdAt: new Date().toISOString(),
    tracking: [] // [{carrier, number, url, itemIds:[] }]
  }
}

export function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('fretpilot-orders') || '[]')
  orders.unshift(order)
  localStorage.setItem('fretpilot-orders', JSON.stringify(orders))
  return order
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('fretpilot-orders') || '[]')
  } catch {
    return []
  }
}

export function updateOrderStatus(id, status) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx >= 0) {
    orders[idx].status = status
    localStorage.setItem('fretpilot-orders', JSON.stringify(orders))
    return orders[idx]
  }
  return null
}

export function addTracking(id, trackingEntry) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx >= 0) {
    orders[idx].tracking.push(trackingEntry)
    localStorage.setItem('fretpilot-orders', JSON.stringify(orders))
    return orders[idx]
  }
  return null
}
