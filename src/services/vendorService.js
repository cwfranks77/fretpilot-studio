import { API_BASE, postJSON } from './config'

export async function submitDropshipPO(order) {
  // Summarize dropship items by vendor
  const vendorMap = {}
  for (const item of order.items) {
    if (item.fulfillment === 'dropship') {
      const key = item.vendor || 'Vendor'
      vendorMap[key] = vendorMap[key] || { vendor: key, items: [], total: 0 }
      vendorMap[key].items.push({ id: item.id, name: item.name, qty: item.quantity, price: item.price })
      vendorMap[key].total += item.price * item.quantity
    }
  }
  const vendors = Object.values(vendorMap)
  if (vendors.length === 0) return { ok: true }

  try {
    await postJSON('/api/vendor/po', { orderId: order.id, vendors, shipping: order.shipping })
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e?.message }
  }
}
