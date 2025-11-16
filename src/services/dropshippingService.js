/**
 * Dropshipping Integration Service
 * Client-side wrapper for backend dropshipping API
 * API keys are stored server-side for security
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Product Categories
export const PRODUCT_CATEGORIES = {
  guitars: {
    name: 'Guitars',
    subcategories: ['Acoustic', 'Electric', 'Bass', 'Classical']
  },
  accessories: {
    name: 'Accessories',
    subcategories: ['Strings', 'Picks', 'Capos', 'Tuners', 'Straps', 'Cases']
  },
  amps: {
    name: 'Amplifiers',
    subcategories: ['Practice Amps', 'Combo Amps', 'Heads', 'Cabinets']
  },
  pedals: {
    name: 'Effects Pedals',
    subcategories: ['Distortion', 'Delay', 'Reverb', 'Chorus', 'Multi-Effects']
  },
  gear: {
    name: 'Studio Gear',
    subcategories: ['Cables', 'Stands', 'Microphones', 'Recording Equipment']
  }
}

// Fetch products from Printful
export async function fetchPrintfulProducts() {
  try {
    const response = await fetch(`${DROPSHIP_CONFIG.printful.baseUrl}/store/products`, {
      headers: {
        'Authorization': `Bearer ${DROPSHIP_CONFIG.printful.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Printful API error:', error)
    return []
  }
}

// Fetch products from Spocket
export async function fetchSpocketProducts(category = '') {
  try {
    const params = new URLSearchParams({
      category: category,
      page: '1',
      per_page: '50'
    })
    
    const response = await fetch(`${DROPSHIP_CONFIG.spocket.baseUrl}/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${DROPSHIP_CONFIG.spocket.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Spocket API error:', error)
    return []
  }
}

// Curated product catalog (fallback/demo)
export const CURATED_PRODUCTS = [
  {
    id: 'guitar-acoustic-001',
    name: 'Acoustic Dreadnought Guitar',
    category: 'guitars',
    subcategory: 'Acoustic',
    price: 299.99,
    comparePrice: 399.99,
    description: 'Professional acoustic guitar with solid spruce top and mahogany back and sides',
    features: [
      'Solid Spruce Top',
      'Mahogany Back & Sides',
      'Rosewood Fingerboard',
      'Chrome Die-Cast Tuners',
      'Includes Gig Bag'
    ],
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    inStock: true,
    rating: 4.7,
    reviews: 342,
    shipping: 'Free shipping',
    supplier: 'Spocket',
    shippingTime: '5-7 days'
  },
  {
    id: 'guitar-electric-001',
    name: 'Classic Electric Guitar - Sunburst',
    category: 'guitars',
    subcategory: 'Electric',
    price: 449.99,
    comparePrice: 599.99,
    description: 'Vintage-style electric guitar with dual humbucker pickups',
    features: [
      'Dual Humbucker Pickups',
      'Maple Neck',
      'Rosewood Fretboard',
      '3-Way Toggle Switch',
      'Vintage Tremolo Bridge'
    ],
    images: [
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
      'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 567,
    shipping: 'Free shipping',
    supplier: 'Spocket',
    shippingTime: '5-7 days'
  },
  {
    id: 'strings-acoustic-001',
    name: 'Premium Acoustic Guitar Strings (3-Pack)',
    category: 'accessories',
    subcategory: 'Strings',
    price: 24.99,
    description: 'Phosphor bronze wound strings for warm, rich tone',
    features: [
      'Phosphor Bronze',
      'Light Gauge (.012-.053)',
      'Long-Lasting Coating',
      '3 Sets Included'
    ],
    images: [
      'https://images.unsplash.com/photo-1614963366795-8e3e1c3d9e1d?w=800'
    ],
    inStock: true,
    rating: 4.9,
    reviews: 1243,
    shipping: 'Free shipping on orders over $25',
    supplier: 'Printful',
    shippingTime: '3-5 days'
  },
  {
    id: 'pedal-distortion-001',
    name: 'Overdrive Distortion Pedal',
    category: 'pedals',
    subcategory: 'Distortion',
    price: 79.99,
    comparePrice: 109.99,
    description: 'Classic tube-amp style overdrive with smooth sustain',
    features: [
      'True Bypass',
      'Level, Tone, Gain Controls',
      '9V Battery or Adapter',
      'Durable Metal Housing'
    ],
    images: [
      'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800'
    ],
    inStock: true,
    rating: 4.6,
    reviews: 421,
    shipping: 'Free shipping',
    supplier: 'Spocket',
    shippingTime: '5-7 days'
  },
  {
    id: 'amp-practice-001',
    name: '20W Practice Amplifier',
    category: 'amps',
    subcategory: 'Practice Amps',
    price: 89.99,
    description: 'Compact practice amp with headphone output and aux input',
    features: [
      '20 Watts Power',
      'Clean & Overdrive Channels',
      'Headphone Jack',
      'Aux Input for Jamming',
      '8" Speaker'
    ],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    inStock: true,
    rating: 4.5,
    reviews: 789,
    shipping: 'Free shipping',
    supplier: 'Spocket',
    shippingTime: '7-10 days'
  },
  {
    id: 'capo-001',
    name: 'Quick-Change Guitar Capo',
    category: 'accessories',
    subcategory: 'Capos',
    price: 12.99,
    description: 'Spring-loaded capo for acoustic and electric guitars',
    features: [
      'Quick-Change Design',
      'Soft Rubber Padding',
      'Fits Most Guitars',
      'Lightweight Aluminum'
    ],
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'
    ],
    inStock: true,
    rating: 4.8,
    reviews: 2156,
    shipping: 'Free shipping on orders over $25',
    supplier: 'Printful',
    shippingTime: '3-5 days'
  }
]

// Create order with dropshipping supplier
export async function createDropshipOrder(orderData) {
  try {
    const response = await fetch(`${API_URL}/api/dropship/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create dropship order')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Order creation error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Track order status
export async function trackOrder(orderId, supplier) {
  try {
    const response = await fetch(`${API_URL}/api/dropship/track-order/${supplier}/${orderId}`)
    
    if (!response.ok) {
      throw new Error('Failed to track order')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Order tracking error:', error)
    return null
  }
}

// Get products from dropshipping suppliers
export async function getDropshipProducts() {
  try {
    const response = await fetch(`${API_URL}/api/dropship/products`)
    
    if (!response.ok) {
      // Fallback to curated products if API fails
      return { products: CURATED_PRODUCTS }
    }
    
    const data = await response.json()
    
    // If no products from suppliers, use curated
    if (!data.products || data.products.length === 0) {
      return { products: CURATED_PRODUCTS }
    }
    
    return data
  } catch (error) {
    console.error('Fetch products error:', error)
    return { products: CURATED_PRODUCTS }
  }
}

// Calculate shipping costs
export function calculateShipping(items, destination) {
  // Free shipping over $50
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  if (subtotal >= 50) {
    return 0
  }
  
  // Standard shipping rates
  const domesticShipping = 5.99
  const internationalShipping = 15.99
  
  return destination.country === 'US' ? domesticShipping : internationalShipping
}

// Get product recommendations
export function getRecommendations(currentProduct) {
  // Recommend related products
  const related = CURATED_PRODUCTS.filter(p => 
    p.category === currentProduct.category && 
    p.id !== currentProduct.id
  ).slice(0, 4)
  
  return related
}
