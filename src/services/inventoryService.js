/**
 * Inventory Service
 * Loads and manages product catalog with automated fulfillment routing
 */

import productsData from '../data/products.sample.json'

let productsCache = null

/**
 * Load all active products from catalog
 */
export async function loadProducts() {
  if (productsCache) return productsCache
  
  // Simulate async load (in production, fetch from API/DB)
  await new Promise(resolve => setTimeout(resolve, 100))
  
  productsCache = productsData.filter(p => p.status === 'active')
  return productsCache
}

/**
 * Get product by ID
 */
export async function getProductById(id) {
  const products = await loadProducts()
  return products.find(p => p.id === id)
}

/**
 * Search/filter products
 * @param {Object} filters - { category?, q?, tags?, fulfillment?, minPrice?, maxPrice? }
 */
export async function searchProducts(filters = {}) {
  const products = await loadProducts()
  let results = products

  if (filters.category && filters.category !== 'all') {
    results = results.filter(p => p.category === filters.category)
  }

  if (filters.q) {
    const query = filters.q.toLowerCase()
    results = results.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    )
  }

  if (filters.tags && filters.tags.length) {
    results = results.filter(p => 
      filters.tags.some(tag => p.tags.includes(tag))
    )
  }

  if (filters.fulfillment) {
    results = results.filter(p => p.fulfillment === filters.fulfillment)
  }

  if (filters.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice)
  }

  return results
}

/**
 * Calculate margin for a product or line item
 * @param {Object} product - Product with price, cost, shippingCost
 * @param {Number} quantity - Quantity ordered
 * @returns {Object} { revenue, cost, margin, marginPercent }
 */
export function calculateMargin(product, quantity = 1) {
  const revenue = product.price * quantity
  const totalCost = (product.cost + product.shippingCost) * quantity
  const margin = revenue - totalCost
  const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0

  return {
    revenue: parseFloat(revenue.toFixed(2)),
    cost: parseFloat(totalCost.toFixed(2)),
    margin: parseFloat(margin.toFixed(2)),
    marginPercent: parseFloat(marginPercent.toFixed(2))
  }
}

/**
 * Calculate total margin for cart
 * @param {Array} cartItems - Array of { product, quantity }
 * @returns {Object} Summary with revenue, cost, margin
 */
export function calculateCartMargin(cartItems) {
  const summary = cartItems.reduce((acc, item) => {
    const itemMargin = calculateMargin(item.product || item, item.quantity || 1)
    return {
      revenue: acc.revenue + itemMargin.revenue,
      cost: acc.cost + itemMargin.cost,
      margin: acc.margin + itemMargin.margin
    }
  }, { revenue: 0, cost: 0, margin: 0 })

  summary.marginPercent = summary.revenue > 0 
    ? (summary.margin / summary.revenue) * 100 
    : 0

  return {
    revenue: parseFloat(summary.revenue.toFixed(2)),
    cost: parseFloat(summary.cost.toFixed(2)),
    margin: parseFloat(summary.margin.toFixed(2)),
    marginPercent: parseFloat(summary.marginPercent.toFixed(2))
  }
}

/**
 * Check if product has available stock (for tracked items)
 * @param {Object} product
 * @param {Number} requestedQty
 * @returns {Boolean}
 */
export function checkStock(product, requestedQty = 1) {
  if (product.stock.policy === 'infinite') return true
  return product.stock.available >= requestedQty
}

/**
 * Reserve stock (optimistic decrement for tracked items)
 * In production, this would be a server-side atomic operation
 * @param {String} productId
 * @param {Number} quantity
 */
export async function reserveStock(productId, quantity) {
  const product = await getProductById(productId)
  if (!product) throw new Error('Product not found')
  
  if (product.stock.policy === 'infinite') return true
  
  if (product.stock.available < quantity) {
    throw new Error('Insufficient stock')
  }

  // Optimistic local update (server should handle atomically)
  product.stock.available -= quantity
  return true
}

/**
 * Group cart items by fulfillment type
 * @param {Array} cartItems
 * @returns {Object} { affiliate: [], dropship: [], pod: [], digital: [] }
 */
export function groupByFulfillment(cartItems) {
  return cartItems.reduce((acc, item) => {
    const type = item.product?.fulfillment || item.fulfillment || 'unknown'
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, { affiliate: [], dropship: [], pod: [], digital: [] })
}

/**
 * Get fulfillment badge display info
 * @param {String} fulfillmentType
 * @returns {Object} { label, icon, color, description }
 */
export function getFulfillmentBadge(fulfillmentType) {
  const badges = {
    affiliate: {
      label: 'Buy at Partner',
      icon: '🔗',
      color: '#0066ff',
      description: 'Purchased from authorized retailer'
    },
    dropship: {
      label: 'Ships by Vendor',
      icon: '📦',
      color: '#06c167',
      description: 'Direct shipping from supplier'
    },
    pod: {
      label: 'Print on Demand',
      icon: '🎨',
      color: '#ff6b6b',
      description: 'Custom printed just for you'
    },
    digital: {
      label: 'Instant Access',
      icon: '⚡',
      color: '#ffd700',
      description: 'Digital product, immediate delivery'
    }
  }
  return badges[fulfillmentType] || badges.digital
}
