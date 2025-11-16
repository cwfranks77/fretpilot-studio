const fetch = require('node-fetch')

// Handle vendor purchase order forwarding
// Priority:
// 1) ShipStation (if SHIPSTATION_API_KEY and SHIPSTATION_API_SECRET set)
// 2) Generic webhook (if VENDOR_PO_WEBHOOK_URL set)
// 3) Fallback: log only

function sanitizeText(str, fallback = '') {
  return (typeof str === 'string' && str.trim().length > 0) ? str.trim() : fallback
}

async function tryShipStation(body) {
  const key = process.env.SHIPSTATION_API_KEY
  const secret = process.env.SHIPSTATION_API_SECRET
  if (!key || !secret) return { used: false }

  try {
    const order = buildShipStationOrder(body)
    const resp = await fetch('https://ssapi.shipstation.com/orders/createorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64')
      },
      body: JSON.stringify(order)
    })
    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      return { used: true, ok: false, error: 'shipstation_http_' + resp.status, detail: text }
    }
    const data = await resp.json().catch(() => ({}))
    return { used: true, ok: true, provider: 'shipstation', data }
  } catch (e) {
    return { used: true, ok: false, error: 'shipstation_error', detail: e?.message }
  }
}

function buildShipStationOrder(body) {
  const { orderId, shipping = {}, vendors = [] } = body || {}
  const orderNumber = String(orderId || Date.now())
  const name = sanitizeText(shipping.name, 'Customer')
  const address = sanitizeText(shipping.address, 'Unknown St')
  const city = sanitizeText(shipping.city, 'City')
  const state = sanitizeText(shipping.state, 'ST')
  const postalCode = sanitizeText(shipping.zip, '00000')
  const countryCode = sanitizeText(shipping.countryCode || 'US', 'US')
  const phone = sanitizeText(shipping.phone, '')

  // Flatten vendor items into a single list for one order
  const items = []
  for (const v of vendors) {
    for (const it of (v.items || [])) {
      items.push({
        sku: 'product-' + (it.id || 'unknown'),
        name: sanitizeText(it.name, 'Item'),
        quantity: Number(it.qty || 1),
        unitPrice: Number(it.price || 0)
      })
    }
  }

  return {
    orderNumber,
    orderDate: new Date().toISOString(),
    orderStatus: 'awaiting_shipment',
    billTo: {
      name,
      street1: address,
      city,
      state,
      postalCode,
      country: countryCode,
      phone
    },
    shipTo: {
      name,
      street1: address,
      city,
      state,
      postalCode,
      country: countryCode,
      phone
    },
    items
  }
}

async function tryWebhook(body) {
  const url = process.env.VENDOR_PO_WEBHOOK_URL
  if (!url) return { used: false }
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      return { used: true, ok: false, error: 'webhook_http_' + resp.status, detail: text }
    }
    const data = await resp.json().catch(() => ({}))
    return { used: true, ok: true, provider: 'webhook', data }
  } catch (e) {
    return { used: true, ok: false, error: 'webhook_error', detail: e?.message }
  }
}

async function handleVendorPO(body) {
  // Attempt ShipStation first
  const ship = await tryShipStation(body)
  if (ship.used) return ship

  // Then generic webhook
  const hook = await tryWebhook(body)
  if (hook.used) return hook

  // Fallback: log and acknowledge
  // eslint-disable-next-line no-console
  console.log('[vendor] fallback log', body)
  return { ok: true, provider: 'none', note: 'No vendor integration configured' }
}

module.exports = { handleVendorPO }
