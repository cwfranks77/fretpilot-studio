/**
 * Vendor Service
 * Automated fulfillment for dropship, POD, and affiliate orders
 * 
 * IMPORTANT: Vendors charge you IMMEDIATELY when you place orders via their APIs.
 * This means you need payment method linked in each vendor dashboard:
 * - CJ Dropshipping: Wallet balance or saved card
 * - Spocket: Saved credit card
 * - Printful: Saved credit card
 * 
 * SETUP REQUIRED:
 * Environment variables (add to .env):
 * - VITE_CJ_API_KEY
 * - VITE_SPOCKET_API_KEY
 * - VITE_PRINTFUL_API_KEY
 */

import { API_BASE, postJSON } from './config'

/**
 * Submit order to CJ Dropshipping
 * CJ immediately charges your linked payment method (wallet or card)
 * 
 * Docs: https://developers.cjdropshipping.com/api2.0/v1/
 * 
 * @param {Object} order - { product, quantity, shippingAddress }
 * @returns {Promise<Object>} { vendorOrderId, cost, estimatedShipDate, status }
 */
export async function submitCJOrder(order) {
  // DEV STUB: Replace with real API call
  // Production code:
  // const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder', {
  //   method: 'POST',
  //   headers: {
  //     'CJ-Access-Token': import.meta.env.VITE_CJ_API_KEY,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     products: [{ vid: order.product.vendor.vendorSku, quantity: order.quantity }],
  //     shippingAddress: { ...order.shippingAddress }
  //   })
  // })
  
  console.log('[CJ Dropshipping] Order submitted (simulated):', order.product.name)
  return {
    vendorOrderId: `CJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    trackingNumber: null,
    estimatedShipDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    cost: order.product.cost + order.product.shippingCost,
    status: 'processing'
  }
}

/**
 * Submit order to Spocket
 * Spocket immediately charges your saved credit card
 * 
 * Docs: https://www.spocket.co/integrations/custom-api
 */
export async function submitSpocketOrder(order) {
  console.log('[Spocket] Order submitted (simulated):', order.product.name)
  return {
    vendorOrderId: `SPK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    trackingNumber: null,
    estimatedShipDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    cost: order.product.cost + order.product.shippingCost,
    status: 'processing'
  }
}

/**
 * Submit order to Printful (Print-on-Demand)
 * Printful immediately charges your saved credit card
 * 
 * Docs: https://developers.printful.com/docs/
 */
export async function submitPrintfulOrder(order) {
  console.log('[Printful] Order submitted (simulated):', order.product.name)
  return {
    vendorOrderId: `PF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    trackingNumber: null,
    estimatedShipDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    cost: order.product.cost + order.product.shippingCost,
    status: 'printing'
  }
}

/**
 * Log affiliate click (no fulfillment, external purchase)
 */
export async function logAffiliateClick(order) {
  console.log('[Affiliate] Click logged:', order.product.name, '→', order.product.vendor.affiliateUrl)
  return {
    vendorOrderId: `AFF-${Date.now()}`,
    trackingNumber: 'EXTERNAL',
    cost: 0,
    status: 'external',
    affiliateUrl: order.product.vendor.affiliateUrl
  }
}

/**
 * Fulfill order based on product type
 * Automatically routes to correct vendor and handles immediate payment
 * 
 * @param {Object} order - { product, quantity, shippingAddress }
 * @returns {Promise<Object>} Vendor order response
 */
export async function fulfillOrder(order) {
  const { product } = order

  switch (product.fulfillment) {
    case 'dropship':
      if (product.vendor.type === 'cj') return await submitCJOrder(order)
      if (product.vendor.type === 'spocket') return await submitSpocketOrder(order)
      throw new Error(`Unknown dropship vendor: ${product.vendor.type}`)

    case 'pod':
      return await submitPrintfulOrder(order)

    case 'affiliate':
      return await logAffiliateClick(order)

    case 'digital':
      console.log('[Digital] Instant access granted:', product.name)
      return {
        vendorOrderId: `DIG-${Date.now()}`,
        trackingNumber: 'DIGITAL',
        cost: 0,
        status: 'delivered'
      }

    default:
      throw new Error(`Unknown fulfillment type: ${product.fulfillment}`)
  }
}

/**
 * Batch fulfill multiple line items
 */
export async function fulfillMultipleOrders(lineItems) {
  const results = []
  for (const item of lineItems) {
    try {
      const vendorOrder = await fulfillOrder(item)
      results.push({ success: true, lineItem: item, vendorOrder })
    } catch (error) {
      console.error('[Vendor Service] Fulfillment failed:', error)
      results.push({ success: false, lineItem: item, error: error.message })
    }
  }
  return results
}

/**
 * Submit PO summary to internal server for logging/webhooks
 * (Original function preserved for compatibility)
 */
export async function submitDropshipPO(order) {
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
