// inventorySourceService.js
// Integration with Inventory Source API for dropshipping premium music gear

const API_BASE = 'https://api.inventory-source.com/v1'
let API_KEY = ''
let API_SECRET = ''

// Initialize with credentials
export function initInventorySource(apiKey, apiSecret) {
  API_KEY = apiKey
  API_SECRET = apiSecret
}

// Fetch products from Inventory Source
export async function syncProducts(filters = {}) {
  try {
    const params = new URLSearchParams({
      category: filters.category || 'musical-instruments',
      brand: filters.brand || '',
      minPrice: filters.minPrice || 0,
      maxPrice: filters.maxPrice || 99999,
      inStock: true
    })

    const response = await fetch(`${API_BASE}/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Secret': API_SECRET,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error('Failed to fetch products')
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Inventory Source sync error:', error)
    return []
  }
}

// Get real-time inventory count for a product
export async function checkStock(productId) {
  try {
    const response = await fetch(`${API_BASE}/products/${productId}/inventory`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Secret': API_SECRET
      }
    })

    if (!response.ok) throw new Error('Failed to check stock')
    
    const data = await response.json()
    return {
      available: data.quantity > 0,
      quantity: data.quantity,
      leadTime: data.leadTimeDays || 0
    }
  } catch (error) {
    console.error('Stock check error:', error)
    return { available: false, quantity: 0, leadTime: 0 }
  }
}

// Submit order to Inventory Source (they route to supplier)
export async function createOrder(orderDetails) {
  try {
    const payload = {
      orderNumber: `TFS-${Date.now()}`,
      customer: {
        name: orderDetails.name,
        email: orderDetails.email,
        phone: orderDetails.phone,
        shippingAddress: {
          street: orderDetails.address,
          city: orderDetails.city,
          state: orderDetails.state,
          zip: orderDetails.zip,
          country: 'US'
        }
      },
      items: orderDetails.items.map(item => ({
        productId: item.productId,
        sku: item.sku,
        quantity: item.quantity,
        price: item.price
      })),
      shippingMethod: orderDetails.shippingSpeed || 'standard'
    }

    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Secret': API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) throw new Error('Failed to create order')
    
    const data = await response.json()
    return {
      success: true,
      orderId: data.orderId,
      trackingNumber: data.trackingNumber || null,
      estimatedDelivery: data.estimatedDeliveryDate
    }
  } catch (error) {
    console.error('Order creation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get order status and tracking
export async function getOrderStatus(orderId) {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Secret': API_SECRET
      }
    })

    if (!response.ok) throw new Error('Failed to get order status')
    
    const data = await response.json()
    return {
      status: data.status, // pending, processing, shipped, delivered
      trackingNumber: data.trackingNumber,
      carrier: data.carrier,
      trackingUrl: data.trackingUrl,
      estimatedDelivery: data.estimatedDeliveryDate,
      shippedDate: data.shippedDate
    }
  } catch (error) {
    console.error('Order status error:', error)
    return null
  }
}

// Transform Inventory Source product to store format
export function transformProduct(isProduct) {
  return {
    id: isProduct.productId,
    name: isProduct.title,
    brand: isProduct.brand,
    price: isProduct.retailPrice,
    cost: isProduct.wholesalePrice, // Don't expose this to frontend!
    image: isProduct.images?.[0] || '/images/placeholder.jpg',
    images: isProduct.images || [],
    description: isProduct.description,
    specs: isProduct.specifications || {},
    category: isProduct.category,
    sku: isProduct.sku,
    inStock: isProduct.quantityAvailable > 0,
    quantity: isProduct.quantityAvailable,
    supplier: isProduct.supplierName,
    fulfillment: 'dropship',
    shippingTime: '2-5 business days',
    madeIn: 'USA'
  }
}

// Cache products locally to reduce API calls
let productCache = []
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export async function getCachedProducts(forceRefresh = false) {
  const now = Date.now()
  
  if (!forceRefresh && productCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    return productCache
  }

  const products = await syncProducts()
  productCache = products.map(transformProduct)
  cacheTimestamp = now
  
  return productCache
}

// Filter products by category/brand
export function filterProducts(products, filters) {
  let filtered = [...products]

  if (filters.category) {
    filtered = filtered.filter(p => p.category === filters.category)
  }

  if (filters.brand) {
    filtered = filtered.filter(p => 
      p.brand.toLowerCase().includes(filters.brand.toLowerCase())
    )
  }

  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice)
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice)
  }

  if (filters.inStock) {
    filtered = filtered.filter(p => p.inStock)
  }

  return filtered
}
