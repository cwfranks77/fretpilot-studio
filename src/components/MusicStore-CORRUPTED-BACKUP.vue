<template>
  <div class="music-store">
    <AnimatedHero src="/images/instruments-montage.svg" alt="Music Store" :float="true" :shimmer="true" :overlay="true" height="220px" />

    <div class="container">
      <h1>🎸 FretPilot Music Store & School</h1>
      <p class="subtitle">Premium instruments and accessories delivered to your door</p>

      <!-- Shopping Cart Summary -->
      <div class="cart-summary" v-if="cart.length > 0" @click="showCart = true">
        <span class="cart-icon">🛒</span>
        <span class="cart-count">{{ cart.length }}</span>
        <span class="cart-total">${{ cartTotal.toFixed(2) }}</span>
      </div>

      <!-- Category Filter -->
      <div class="category-filter">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div v-if="product.discount" class="discount-badge">
              -{{ product.discount }}%
            </div>
          </div>
          
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            const selectedCategory = ref('all')
            const cart = ref([])
            const showCart = ref(false)
            const showCheckout = ref(false)
            const checkoutMethod = ref('card')
            const shipping = ref({
            <p class="product-vendor">
              <strong>{{ product.vendor }}</strong>
              <span v-if="product.fulfillment==='fretpilot'"> • Fulfilled by FretPilot</span>
              <span v-else-if="product.fulfillment==='dropship'"> • Ships by vendor</span>
              <span v-else> • Affiliate</span>
              <span class="ship-meta"> • Ships from {{ product.shipFrom }} • ETA {{ product.etaDays }} days</span>
            </p>
            
            const categories = [
              { id: 'all', name: 'All', icon: '🎵' },
              { id: 'guitars', name: 'Guitars', icon: '🎸' },
              { id: 'amps', name: 'Amplifiers', icon: '🔊' },
              { id: 'pedals', name: 'Pedals', icon: '🎛️' },
              { id: 'accessories', name: 'Accessories', icon: '🧰' },
              { id: 'keyboards', name: 'Keyboards', icon: '🎹' },
              { id: 'drums', name: 'Drums', icon: '🥁' },
              { id: 'dj', name: 'DJ', icon: '🎧' },
              { id: 'recording', name: 'Recording', icon: '🎙️' },
              { id: 'live', name: 'Live Sound', icon: '🔈' },
              { id: 'accordions', name: 'Accordions', icon: '🪗' },
              { id: 'headphones', name: 'Headphones', icon: '🎧' },
              { id: 'cables', name: 'Cables', icon: '🔌' }
            ]

            const products = ref([])
    price: 1299.99,
    discount: 15,
    rating: 5,
    reviews: 342,
    description: 'Classic electric guitar with versatile tone and iconic design',
    image: '/images/products/strat.svg',
    stock: 12,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 2,
    category: 'guitars',
    name: 'Gibson Les Paul',
    brand: 'Gibson',
    price: 2499.99,
    discount: 10,
    rating: 5,
    reviews: 289,
    description: 'Premium mahogany body with rich, warm tone',
    image: '/images/products/lespaul.svg',
    stock: 8,
    vendor: 'Gibson Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7
  },
  {
    id: 3,
    category: 'guitars',
    name: 'Taylor 214ce Acoustic',
    brand: 'Taylor',
    price: 899.99,
    rating: 5,
    reviews: 445,
    description: 'Acoustic-electric with beautiful tone and playability',
    image: '/images/products/taylor.svg',
    stock: 15,
    vendor: 'Taylor Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 6
  },
  {
    id: 4,
    category: 'amps',
    name: 'Fender Blues Junior IV',
    brand: 'Fender',
    price: 599.99,
    discount: 20,
    rating: 5,
    reviews: 567,
    description: '15W tube amp with classic Fender tone',
    image: '/images/products/amp.svg',
    stock: 20,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 5,
    category: 'amps',
    name: 'Marshall DSL40CR',
    brand: 'Marshall',
    price: 799.99,
    rating: 5,
    reviews: 423,
    description: '40W combo amp with legendary Marshall crunch',
    image: '/images/products/marshall.svg',
    stock: 10,
    vendor: 'Marshall Partner',
    fulfillment: 'dropship',
    shipFrom: 'UK',
    etaDays: 9
  },
  {
    id: 6,
    category: 'pedals',
    name: 'Boss DS-1 Distortion',
    brand: 'Boss',
    price: 59.99,
    rating: 5,
    reviews: 1240,
    description: 'Classic distortion pedal used by pros worldwide',
    image: '/images/products/pedal.svg',
    stock: 50,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://example.com/affiliate/boss-ds1',
    shipFrom: 'Various',
    etaDays: 3
  },
  {
    id: 7,
    category: 'pedals',
    name: 'Electro-Harmonix Big Muff',
    brand: 'Electro-Harmonix',
    price: 89.99,
    discount: 10,
    rating: 5,
    reviews: 892,
    description: 'Legendary fuzz pedal with thick sustain',
    image: '/images/products/muff.svg',
    stock: 35,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://example.com/affiliate/bigmuff',
    shipFrom: 'USA',
    etaDays: 4
  },
  {
    id: 8,
    category: 'accessories',
    name: 'Ernie Ball Strings (3-Pack)',
    brand: 'Ernie Ball',
    price: 19.99,
    rating: 5,
    reviews: 2340,
    description: 'Super Slinky electric guitar strings',
    image: '/images/products/strings.svg',
    stock: 200,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 4
  },
  {
    id: 9,
    category: 'accessories',
    name: 'Dunlop Jazz III Picks (24-Pack)',
    brand: 'Dunlop',
    price: 14.99,
    rating: 5,
    reviews: 1567,
    description: 'Professional grade guitar picks',
    image: '/images/products/picks.svg',
    stock: 150,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://example.com/affiliate/jazz3',
    shipFrom: 'Various',
    etaDays: 3
  },
  {
    id: 10,
    category: 'accessories',
    name: 'Gator Hardshell Case',
    brand: 'Gator',
    price: 149.99,
    discount: 25,
    rating: 5,
    reviews: 678,
    description: 'Premium protection for your instrument',
    image: '/images/products/case.svg',
    stock: 45,
    vendor: 'Gator Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 6
  }
  ,
  {
    id: 11,
    category: 'keyboards',
    name: 'Yamaha P-125 Digital Piano',
    brand: 'Yamaha',
    price: 699.99,
    rating: 5,
    reviews: 910,
    description: 'Natural piano feel with Graded Hammer Standard keys',
    image: '/images/products/keyboard.svg',
    stock: 18,
    vendor: 'Yamaha Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7
  },
  {
    id: 12,
    category: 'drums',
    name: 'Pearl Export Drum Kit',
    brand: 'Pearl',
    price: 849.99,
    discount: 10,
    rating: 5,
    reviews: 502,
    description: 'Complete 5-piece kit with hardware and cymbals',
    image: '/images/products/drums.svg',
    stock: 9,
    vendor: 'Pearl Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10
  },
  {
    id: 13,
    category: 'dj',
    name: 'Pioneer DDJ-400 Controller',
    brand: 'Pioneer',
    price: 249.99,
    rating: 5,
    reviews: 1540,
    description: 'Compact 2-channel DJ controller for rekordbox',
    image: '/images/products/dj.svg',
    stock: 30,
    vendor: 'Pioneer Partner',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 14,
    category: 'studio',
    name: 'KRK Rokit 5 G4 Monitors (Pair)',
    brand: 'KRK',
    price: 399.99,
    rating: 5,
    reviews: 820,
    description: 'Accurate near-field monitoring with DSP EQ',
    image: '/images/products/monitors.svg',
    stock: 40,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 4
  },
  {
    id: 15,
    category: 'mics',
    name: 'Shure SM58 Vocal Microphone',
    brand: 'Shure',
    price: 109.99,
    rating: 5,
    reviews: 5000,
    description: 'Industry-standard cardioid dynamic vocal mic',
    image: '/images/products/mic.svg',
    stock: 120,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 16,
    category: 'accordions',
    name: 'Hohner Panther Diatonic Accordion',
    brand: 'Hohner',
    price: 599.99,
    rating: 5,
    reviews: 210,
    description: '3-row versatile accordion for Tex-Mex and folk styles',
    image: '/images/products/accordion.svg',
    stock: 14,
    vendor: 'Hohner Partner',
    fulfillment: 'dropship',
    shipFrom: 'Germany',
    etaDays: 11
  },
  {
    id: 17,
    category: 'studio',
    name: 'Focusrite Scarlett 2i2 Audio Interface',
    brand: 'Focusrite',
    price: 179.99,
    rating: 5,
    reviews: 3200,
    description: '2-in/2-out USB audio interface with Air mode',
    image: '/images/products/interface.svg',
    stock: 75,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 4
  },
  {
    id: 18,
    category: 'mics',
    name: 'Audio-Technica AT2020 Condenser',
    brand: 'Audio-Technica',
    price: 99.99,
    rating: 5,
    reviews: 4100,
    description: 'Affordable large diaphragm condenser for home studios',
    image: '/images/products/mic.svg',
    stock: 110,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 19,
    category: 'keyboards',
    name: 'Akai MPK Mini Plus MIDI Controller',
    brand: 'Akai',
    price: 169.99,
    rating: 5,
    reviews: 950,
    description: 'Compact controller with expanded keys and knobs',
    image: '/images/products/keyboard.svg',
    stock: 65,
    vendor: 'FretPilot',
    fulfillment: 'fretpilot',
    shipFrom: 'USA',
    etaDays: 4
  },
  {
    id: 20,
    category: 'dj',
    name: 'Native Instruments Traktor Kontrol S2',
    brand: 'Native Instruments',
    price: 339.99,
    rating: 5,
    reviews: 740,
    description: '2-channel DJ system with high-res jog wheels',
    image: '/images/products/dj.svg',
    stock: 22,
    vendor: 'Dropship DJ',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 6
  }
])

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.category === selectedCategory.value)
})

const cartSubtotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const shippingCost = computed(() => {
  // FretPilot-fulfilled: free over $100; Dropship: $9.99 per dropship item; Affiliate items are not carted
  const fretpilotSubtotal = cart.value
    .filter(i => i.fulfillment === 'fretpilot')
    .reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const dropshipCount = cart.value
    .filter(i => i.fulfillment === 'dropship')
    .reduce((sum, i) => sum + i.quantity, 0)
  const dropshipShipping = dropshipCount * 9.99
  const fretpilotShipping = fretpilotSubtotal > 100 ? 0 : (fretpilotSubtotal > 0 ? 15.99 : 0)
  return fretpilotShipping + dropshipShipping
})

const taxAmount = computed(() => {
  return (cartSubtotal.value + shippingCost.value) * 0.08
})

const cartTotal = computed(() => {
  return cartSubtotal.value + shippingCost.value + taxAmount.value
})

function addToCart(product) {
  const existing = cart.value.find(item => item.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      ...product,
      quantity: 1
    })
  }
  saveCart()
  showCart.value = true
}

function removeFromCart(item) {
  const index = cart.value.indexOf(item)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
  saveCart()
}

function updateQuantity(item, delta) {
  item.quantity += delta
  if (item.quantity <= 0) {
    removeFromCart(item)
  }
  saveCart()
}

function proceedToCheckout() {
  showCart.value = false
  showCheckout.value = true
}

async function placeOrder() {
  if (!shipping.value.name || !shipping.value.address) {
    alert('Please fill in all shipping information')
    return
  }

  if (checkoutMethod.value === 'bitcoin') {
    try {
      const totalBTC = (cartTotal.value / 66000).toFixed(8) // Approximate BTC conversion
      alert(`Bitcoin Payment\n\nTotal: ${totalBTC} BTC\n\nGenerating payment address...`)
      
      const payment = await createBitcoinPayment('custom')
      alert(`Send exactly ${totalBTC} BTC to:\n\n${payment.address}\n\nOrder will be processed after confirmation.`)
      
      // Save order (pending until BTC confirmed by user payment flow)
      const order = makeOrder({
        items: cart.value,
        shipping: shipping.value,
        total: cartTotal.value,
        paymentMethod: 'bitcoin',
        status: 'pending',
        fulfillmentSummary: summarizeFulfillment(cart.value)
      })
      saveOrder(order)
      clearCart()
      showCheckout.value = false
    } catch (error) {
      alert('Bitcoin payment setup failed. Please try again.')
    }
  } else {
    // Card payment via Stripe Checkout (dev fallback if server not configured)
    try {
      const lineItems = cart.value
        .filter(i => i.fulfillment !== 'affiliate')
        .map(i => ({
          price_data: {
            currency: 'usd',
            product_data: { name: i.name },
            unit_amount: Math.round(i.price * 100)
          },
          quantity: i.quantity
        }))
      const successUrl = window.location.origin + '/?checkout_success=1'
      const cancelUrl = window.location.origin + '/?checkout_cancel=1'
      const { url } = await postJSON('/api/stripe/create-checkout-session', { lineItems, successUrl, cancelUrl })
      if (url && url.includes('example.com')) {
        // Dev fallback: simulate success
        const order = makeOrder({
          items: cart.value,
          shipping: shipping.value,
          total: cartTotal.value,
          paymentMethod: 'card',
          status: 'paid',
          fulfillmentSummary: summarizeFulfillment(cart.value)
        })
        saveOrder(order)
        await submitDropshipPO(order)
        await sendOrderConfirmation(order)
        clearCart()
        showCheckout.value = false
        alert('Order placed in dev mode. (Stripe not configured)')
      } else if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL')
      }
    } catch (e) {
      alert('Unable to start card checkout. Is the server running?')
    }
  }
}

function summarizeFulfillment(items) {
  const acc = {}
  for (const i of items) {
    if (i.fulfillment === 'affiliate') continue
    const key = i.fulfillment + '|' + (i.vendor || 'Vendor')
    acc[key] = acc[key] || { type: i.fulfillment, vendor: i.vendor || 'Vendor', quantity: 0 }
    acc[key].quantity += i.quantity
  }
  return Object.values(acc)
}

function saveCart() {
  localStorage.setItem('fretpilot-cart', JSON.stringify(cart.value))
}

function loadCart() {
  const saved = localStorage.getItem('fretpilot-cart')
  if (saved) {
    try {
      cart.value = JSON.parse(saved)
    } catch (e) {
      cart.value = []
    }
  }
}

function clearCart() {
  cart.value = []
  saveCart()
}

// legacy saveOrder removed; using orderService.saveOrder instead

onMounted(() => {
  loadCart()
  // Load product catalog from static JSON with graceful fallback
  fetch('/data/products.json')
    .then(r => r.ok ? r.json() : [])
    .then(list => {
      if (Array.isArray(list) && list.length) {
        products.value = list
      }
    })
    .catch(() => {/* keep fallback if any */})
})
</script>

<style scoped>
.music-store {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
}

.page-hero {
  max-width: 450px;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(30, 144, 255, 0.3));
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

h1 {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #8892a6;
  font-size: 1.1em;
  margin-bottom: 40px;
}

.cart-summary {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #06c167;
  color: #fff;
  padding: 12px 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(6, 193, 103, 0.4);
  transition: all 0.3s;
}

.cart-summary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 193, 103, 0.6);
}

.cart-icon {
  font-size: 1.5em;
}

.cart-count {
  background: #fff;
  color: #06c167;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9em;
}

.cart-total {
  font-weight: 700;
  font-size: 1.1em;
}

.category-filter {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.category-filter button {
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s;
}

.category-filter button.active {
  background: #06c167;
  border-color: #06c167;
  color: #fff;
}

.category-filter button:hover:not(.active) {
  border-color: #06c167;
  color: #06c167;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.product-card {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-card:hover {
  border-color: #06c167;
  transform: translateY(-4px);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff4444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9em;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 1.3em;
  margin-bottom: 6px;
}

.product-brand {
  color: #8892a6;
  font-size: 0.9em;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  color: #ffa500;
  font-size: 0.9em;
}

.reviews {
  color: #8892a6;
  font-size: 0.85em;
}

.product-description {
  color: #8892a6;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 16px;
}

.product-vendor {
  color: #cfd6e6;
  font-size: 0.9em;
  margin: -4px 0 16px;
}

.ship-meta {
  color: #8892a6;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.product-price {
  display: flex;
  flex-direction: column;
}

.original-price {
  color: #8892a6;
  text-decoration: line-through;
  font-size: 0.9em;
}

.current-price {
  color: #06c167;
  font-size: 1.5em;
  font-weight: 700;
}

.add-to-cart-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.buy-external-btn {
  display: inline-block;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.buy-external-btn:hover {
  border-color: #06c167;
  color: #06c167;
}
.add-to-cart-btn:hover {
  background: #09a557;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #0a0a0a;
  border: 2px solid #2a2a2a;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #2a2a2a;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: #2a2a2a;
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #3a3a3a;
}

.cart-items {
  padding: 24px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #1a1a1a;
  border-radius: 12px;
  margin-bottom: 16px;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 8px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info h4 {
  margin: 0 0 6px;
}

.cart-item-brand {
  color: #8892a6;
  font-size: 0.9em;
  margin-bottom: 12px;
}

.cart-item-quantity {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cart-item-quantity button {
  background: #2a2a2a;
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2em;
}

.cart-item-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  font-size: 1.2em;
  font-weight: 700;
  color: #06c167;
}

.remove-btn {
  background: #ff4444;
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9em;
}

.cart-summary-detail {
  padding: 24px;
  border-top: 1px solid #2a2a2a;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #8892a6;
}

.summary-row.total {
  font-size: 1.4em;
  font-weight: 700;
  color: #fff;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #2a2a2a;
}

.checkout-actions {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkout-btn {
  background: #06c167;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.checkout-btn:hover {
  background: #09a557;
}

.continue-shopping-btn {
  background: #2a2a2a;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
}

.checkout-content {
  padding: 24px;
}

.payment-method-selector {
  margin-bottom: 30px;
}

.payment-method-selector h3 {
  margin-bottom: 16px;
}

.payment-options {
  display: flex;
  gap: 12px;
}

.payment-options button {
  flex: 1;
  background: #1a1a1a;
  border: 2px solid #2a2a2a;
  color: #cfd6e6;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  transition: all 0.3s;
}

.payment-options button.active {
  background: #06c167;
  border-color: #06c167;
  color: #fff;
}

.shipping-form {
  margin-bottom: 30px;
}

.shipping-form h3 {
  margin-bottom: 16px;
}

.shipping-form input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 1em;
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 12px;
}

.order-summary {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.order-summary h3 {
  margin-bottom: 16px;
}

.summary-items {
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  color: #8892a6;
  margin-bottom: 8px;
}

.summary-total {
  padding-top: 16px;
  border-top: 1px solid #2a2a2a;
  font-size: 1.3em;
}

.place-order-btn {
  width: 100%;
  background: #06c167;
  color: #fff;
  border: none;
  padding: 18px;
  border-radius: 12px;
  font-size: 1.2em;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.place-order-btn:hover {
  background: #09a557;
  transform: translateY(-2px);
}
</style>
