<template>
  <div class="music-store">
    <AnimatedHero src="/images/instruments-montage.svg" alt="Music Store" :float="true" :shimmer="true" :overlay="true" height="220px" />

    <div class="container">
      <h1>🎸 The Franks Standard</h1>
      <p class="subtitle">Premium instruments, pro audio & musician gear - Curated by musicians, for musicians</p>

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
            <p class="product-brand">{{ product.brand }}</p>
            <div class="product-rating">
              <span class="stars">{{ '⭐'.repeat(product.rating) }}</span>
              <span class="reviews">({{ product.reviews }} reviews)</span>
            </div>
            <p class="product-description">{{ product.description }}</p>
            <p class="product-vendor">
              <strong>{{ product.vendor }}</strong>
              <span v-if="product.fulfillment==='fretpilot'"> • Fulfilled by FretPilot</span>
              <span v-else-if="product.fulfillment==='dropship'"> • Ships by vendor</span>
              <span v-else> • Affiliate</span>
              <span class="ship-meta"> • Ships from {{ product.shipFrom }} • ETA {{ product.etaDays }} days</span>
            </p>
            
            <div class="product-footer">
              <div class="product-price">
                <span v-if="product.discount" class="original-price">${{ product.price.toFixed(2) }}</span>
                <span class="current-price">${{ (product.price * (1 - (product.discount || 0) / 100)).toFixed(2) }}</span>
              </div>
              <button v-if="product.fulfillment !== 'affiliate'" @click="addToCart(product)" class="add-to-cart-btn">
                🛒 Add to Cart
              </button>
              <a v-else :href="product.affiliateUrl" target="_blank" rel="noopener" class="buy-external-btn">
                🔗 Buy from {{ product.vendor }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Shopping Cart Modal -->
      <div v-if="showCart" class="modal-overlay" @click="showCart = false">
        <div class="modal cart-modal" @click.stop>
          <div class="modal-header">
            <h2>🛒 Shopping Cart</h2>
            <button @click="showCart = false" class="close-btn">✕</button>
          </div>

          <div class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <img :src="item.image" :alt="item.name" class="cart-item-image" />
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <p class="cart-item-brand">{{ item.brand }}</p>
                <div class="cart-item-quantity">
                  <button @click="updateQuantity(item, -1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button @click="updateQuantity(item, 1)">+</button>
                </div>
              </div>
              <div class="cart-item-price">
                ${{ (item.price * item.quantity).toFixed(2) }}
                <button @click="removeFromCart(item)" class="remove-btn">🗑️</button>
              </div>
            </div>
          </div>

          <div class="cart-summary-detail">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ cartSubtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>{{ shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'FREE' }}</span>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <span>${{ taxAmount.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <div class="checkout-actions">
            <button @click="proceedToCheckout" class="checkout-btn">
              Proceed to Checkout
            </button>
            <button @click="showCart = false" class="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <!-- Checkout Modal -->
      <div v-if="showCheckout" class="modal-overlay" @click="showCheckout = false">
        <div class="modal checkout-modal" @click.stop>
          <div class="modal-header">
            <h2>💳 Checkout</h2>
            <button @click="showCheckout = false" class="close-btn">✕</button>
          </div>

          <div class="checkout-content">
            <div class="payment-method-selector">
              <h3>Select Payment Method</h3>
              <div class="payment-options">
                <button 
                  :class="{ active: checkoutMethod === 'card' }"
                  @click="checkoutMethod = 'card'"
                >
                  💳 Credit Card
                </button>
                <button 
                  :class="{ active: checkoutMethod === 'bitcoin' }"
                  @click="checkoutMethod = 'bitcoin'"
                >
                  ₿ Bitcoin
                </button>
              </div>
            </div>

            <div class="shipping-form">
              <h3>Shipping Address</h3>
              <input v-model="shipping.name" placeholder="Full Name" />
              <input v-model="shipping.address" placeholder="Street Address" />
              <div class="form-row">
                <input v-model="shipping.city" placeholder="City" />
                <input v-model="shipping.state" placeholder="State" />
                <input v-model="shipping.zip" placeholder="ZIP" />
              </div>
              <input v-model="shipping.phone" placeholder="Phone Number" />
            </div>

            <div class="order-summary">
              <h3>Order Summary</h3>
              <div class="summary-items">
                <div v-for="item in cart" :key="item.id" class="summary-item">
                  <span>{{ item.name }} × {{ item.quantity }}</span>
                  <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="summary-total">
                <strong>Total: ${{ cartTotal.toFixed(2) }}</strong>
              </div>
            </div>

            <button @click="placeOrder" class="place-order-btn">
              {{ checkoutMethod === 'bitcoin' ? '₿ Pay with Bitcoin' : '💳 Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AnimatedHero from './AnimatedHero.vue'
import { createBitcoinPayment } from '../services/bitcoinPaymentService'
import { postJSON, API_BASE } from '../services/config'
import { makeOrder, saveOrder } from '../services/orderService'
import { sendOrderConfirmation } from '../services/emailService'
import { submitDropshipPO } from '../services/vendorService'
import { 
  CURATED_PRODUCTS, 
  createDropshipOrder, 
  trackOrder,
  fetchSpocketProducts,
  fetchPrintfulProducts 
} from '../services/dropshippingService'

const selectedCategory = ref('all')
const cart = ref([])
const showCart = ref(false)
const showCheckout = ref(false)
const checkoutMethod = ref('card')
const shipping = ref({
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: ''
})

const categories = [
  { id: 'all', name: 'All', icon: '🎵' },
  { id: 'guitars', name: 'Guitars', icon: '🎸' },
  { id: 'bass', name: 'Bass', icon: '🎸' },
  { id: 'amps', name: 'Amplifiers', icon: '🔊' },
  { id: 'pedals', name: 'Effects', icon: '🎛️' },
  { id: 'keyboards', name: 'Keys & Synths', icon: '🎹' },
  { id: 'drums', name: 'Drums', icon: '🥁' },
  { id: 'dj', name: 'DJ & Production', icon: '🎧' },
  { id: 'studio', name: 'Recording', icon: '🎚️' },
  { id: 'mics', name: 'Microphones', icon: '🎤' },
  { id: 'live', name: 'Live Sound', icon: '📢' },
  { id: 'homeaudio', name: 'Home Audio', icon: '🔉' },
  { id: 'caraudio', name: 'Car Audio', icon: '🚗' },
  { id: 'orchestral', name: 'Orchestral', icon: '🎻' },
  { id: 'accessories', name: 'Accessories', icon: '🎯' }
]

const products = ref([
  // GUITARS
  {
    id: 1,
    category: 'guitars',
    name: 'Fender Stratocaster',
    brand: 'Fender',
    price: 1299.99,
    discount: 15,
    rating: 5,
    reviews: 342,
    description: 'Classic electric guitar with versatile tone',
    image: '/images/products/strat.svg',
    stock: 12,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 2,
    category: 'guitars',
    name: 'Gibson Les Paul Standard',
    brand: 'Gibson',
    price: 2499.99,
    rating: 5,
    reviews: 289,
    description: 'Premium mahogany body with rich, warm tone',
    image: '/images/products/lespaul.svg',
    stock: 8,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 3,
    category: 'guitars',
    name: 'PRS SE Custom 24',
    brand: 'PRS',
    price: 899.99,
    rating: 5,
    reviews: 445,
    description: 'Versatile guitar with coil-tap humbuckers',
    image: '/images/products/taylor.svg',
    stock: 15,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 4,
    category: 'guitars',
    name: 'Ibanez RG Series',
    brand: 'Ibanez',
    price: 699.99,
    rating: 5,
    reviews: 521,
    description: 'Fast neck and powerful pickups for metal',
    image: '/images/products/strat.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 5,
    category: 'guitars',
    name: 'Jackson Soloist',
    brand: 'Jackson',
    price: 1199.99,
    rating: 5,
    reviews: 310,
    description: 'Shred-ready with EMG pickups',
    image: '/images/products/lespaul.svg',
    stock: 10,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // BASS
  {
    id: 6,
    category: 'bass',
    name: 'Fender Precision Bass',
    brand: 'Fender',
    price: 1099.99,
    rating: 5,
    reviews: 412,
    description: 'Classic P-Bass tone and feel',
    image: '/images/products/strat.svg',
    stock: 14,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 7,
    category: 'bass',
    name: 'Music Man StingRay',
    brand: 'Music Man',
    price: 1899.99,
    rating: 5,
    reviews: 287,
    description: 'Punchy active electronics and growl',
    image: '/images/products/lespaul.svg',
    stock: 8,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // AMPS
  {
    id: 8,
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
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 9,
    category: 'amps',
    name: 'Marshall DSL40CR',
    brand: 'Marshall',
    price: 799.99,
    rating: 5,
    reviews: 423,
    description: '40W combo with legendary Marshall crunch',
    image: '/images/products/marshall.svg',
    stock: 10,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 10,
    category: 'amps',
    name: 'Orange Crush 35RT',
    brand: 'Orange',
    price: 299.99,
    rating: 5,
    reviews: 312,
    description: 'British tone with built-in reverb and tuner',
    image: '/images/products/amp.svg',
    stock: 25,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // PEDALS
  {
    id: 11,
    category: 'pedals',
    name: 'Boss DS-1 Distortion',
    brand: 'Boss',
    price: 59.99,
    rating: 5,
    reviews: 1240,
    description: 'Classic distortion used by pros worldwide',
    image: '/images/products/pedal.svg',
    stock: 50,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 12,
    category: 'pedals',
    name: 'Electro-Harmonix Big Muff',
    brand: 'Electro-Harmonix',
    price: 89.99,
    rating: 5,
    reviews: 892,
    description: 'Legendary fuzz with thick sustain',
    image: '/images/products/muff.svg',
    stock: 35,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 13,
    category: 'pedals',
    name: 'Strymon Timeline Delay',
    brand: 'Strymon',
    price: 449.99,
    rating: 5,
    reviews: 567,
    description: 'Pro-level delay with studio quality',
    image: '/images/products/pedal.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // KEYBOARDS
  {
    id: 14,
    category: 'keyboards',
    name: 'Yamaha P-125 Digital Piano',
    brand: 'Yamaha',
    price: 699.99,
    rating: 5,
    reviews: 910,
    description: 'Natural piano feel with Graded Hammer keys',
    image: '/images/products/keyboard.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 15,
    category: 'keyboards',
    name: 'Korg Minilogue XD',
    brand: 'Korg',
    price: 649.99,
    rating: 5,
    reviews: 487,
    description: 'Analog polyphonic synthesizer',
    image: '/images/products/keyboard.svg',
    stock: 22,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 16,
    category: 'keyboards',
    name: 'Nord Stage 3',
    brand: 'Nord',
    price: 3999.99,
    rating: 5,
    reviews: 245,
    description: 'Professional stage piano and synth',
    image: '/images/products/keyboard.svg',
    stock: 5,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // DRUMS
  {
    id: 17,
    category: 'drums',
    name: 'Pearl Export 5-Piece Kit',
    brand: 'Pearl',
    price: 849.99,
    rating: 5,
    reviews: 502,
    description: 'Complete kit with hardware and cymbals',
    image: '/images/products/drums.svg',
    stock: 9,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 18,
    category: 'drums',
    name: 'Zildjian A Custom Cymbal Set',
    brand: 'Zildjian',
    price: 699.99,
    rating: 5,
    reviews: 389,
    description: 'Pro cymbals with brilliant finish',
    image: '/images/products/drums.svg',
    stock: 15,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // DJ & PRODUCTION
  {
    id: 19,
    category: 'dj',
    name: 'Pioneer DDJ-400',
    brand: 'Pioneer',
    price: 249.99,
    rating: 5,
    reviews: 1540,
    description: 'Compact 2-channel controller for rekordbox',
    image: '/images/products/dj.svg',
    stock: 30,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 20,
    category: 'dj',
    name: 'Native Instruments Traktor S4',
    brand: 'Native Instruments',
    price: 999.99,
    rating: 5,
    reviews: 740,
    description: '4-channel system with jog wheels',
    image: '/images/products/dj.svg',
    stock: 22,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 21,
    category: 'dj',
    name: 'Technics SL-1200MK7',
    brand: 'Technics',
    price: 1099.99,
    rating: 5,
    reviews: 612,
    description: 'Legendary DJ turntable',
    image: '/images/products/dj.svg',
    stock: 12,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // RECORDING
  {
    id: 22,
    category: 'studio',
    name: 'Focusrite Scarlett 2i2',
    brand: 'Focusrite',
    price: 179.99,
    rating: 5,
    reviews: 3200,
    description: '2-in/2-out USB interface with Air mode',
    image: '/images/products/interface.svg',
    stock: 75,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 23,
    category: 'studio',
    name: 'Universal Audio Apollo Twin X',
    brand: 'Universal Audio',
    price: 899.99,
    rating: 5,
    reviews: 487,
    description: 'Pro interface with UAD plugins',
    image: '/images/products/interface.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 24,
    category: 'studio',
    name: 'KRK Rokit 5 G4 Monitors',
    brand: 'KRK',
    price: 399.99,
    rating: 5,
    reviews: 820,
    description: 'Accurate near-field monitoring with DSP',
    image: '/images/products/monitors.svg',
    stock: 40,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 25,
    category: 'studio',
    name: 'Yamaha HS8 Studio Monitors',
    brand: 'Yamaha',
    price: 699.99,
    rating: 5,
    reviews: 1240,
    description: 'Industry-standard studio monitors',
    image: '/images/products/monitors.svg',
    stock: 35,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // MICROPHONES
  {
    id: 26,
    category: 'mics',
    name: 'Shure SM58 Vocal Microphone',
    brand: 'Shure',
    price: 109.99,
    rating: 5,
    reviews: 5000,
    description: 'Industry-standard cardioid dynamic',
    image: '/images/products/mic.svg',
    stock: 120,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 27,
    category: 'mics',
    name: 'Audio-Technica AT2020',
    brand: 'Audio-Technica',
    price: 99.99,
    rating: 5,
    reviews: 4100,
    description: 'Large diaphragm condenser for studios',
    image: '/images/products/mic.svg',
    stock: 110,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 28,
    category: 'mics',
    name: 'Rode NT1-A',
    brand: 'Rode',
    price: 229.99,
    rating: 5,
    reviews: 2340,
    description: 'Ultra-low noise studio condenser',
    image: '/images/products/mic.svg',
    stock: 45,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // LIVE SOUND
  {
    id: 29,
    category: 'live',
    name: 'QSC K12.2 Powered Speaker',
    brand: 'QSC',
    price: 799.99,
    rating: 5,
    reviews: 612,
    description: '2000W powered PA speaker',
    image: '/images/products/monitors.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 30,
    category: 'live',
    name: 'Behringer X32 Digital Mixer',
    brand: 'Behringer',
    price: 2499.99,
    rating: 5,
    reviews: 890,
    description: '40-channel digital mixing console',
    image: '/images/products/interface.svg',
    stock: 8,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 5
  },
  // HOME AUDIO
  {
    id: 31,
    category: 'homeaudio',
    name: 'Klipsch Reference Premiere',
    brand: 'Klipsch',
    price: 1499.99,
    rating: 5,
    reviews: 487,
    description: '5.1 home theater speaker system',
    image: '/images/products/monitors.svg',
    stock: 12,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 32,
    category: 'homeaudio',
    name: 'Denon AVR-X3800H',
    brand: 'Denon',
    price: 1199.99,
    rating: 5,
    reviews: 612,
    description: '9.4-channel 8K AV receiver',
    image: '/images/products/amp.svg',
    stock: 15,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 33,
    category: 'homeaudio',
    name: 'Sonos Arc Soundbar',
    brand: 'Sonos',
    price: 899.99,
    rating: 5,
    reviews: 1540,
    description: 'Premium Dolby Atmos soundbar',
    image: '/images/products/monitors.svg',
    stock: 25,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 2
  },
  {
    id: 34,
    category: 'homeaudio',
    name: 'SVS SB-1000 Pro Subwoofer',
    brand: 'SVS',
    price: 599.99,
    rating: 5,
    reviews: 789,
    description: 'Sealed 12" powered subwoofer',
    image: '/images/products/amp.svg',
    stock: 18,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // CAR AUDIO
  {
    id: 35,
    category: 'caraudio',
    name: 'JL Audio 12W7AE-3',
    brand: 'JL Audio',
    price: 899.99,
    rating: 5,
    reviews: 412,
    description: '12" high-performance subwoofer',
    image: '/images/products/amp.svg',
    stock: 14,
    vendor: 'Crutchfield',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://crutchfield.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 36,
    category: 'caraudio',
    name: 'Alpine iLX-W650 Receiver',
    brand: 'Alpine',
    price: 399.99,
    rating: 5,
    reviews: 567,
    description: '7" CarPlay/Android Auto receiver',
    image: '/images/products/interface.svg',
    stock: 22,
    vendor: 'Crutchfield',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://crutchfield.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 37,
    category: 'caraudio',
    name: 'Rockford Fosgate P300-12',
    brand: 'Rockford Fosgate',
    price: 299.99,
    rating: 5,
    reviews: 823,
    description: 'Powered 12" subwoofer enclosure',
    image: '/images/products/amp.svg',
    stock: 28,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 2
  },
  {
    id: 38,
    category: 'caraudio',
    name: 'Kenwood Excelon KFC-XP184C',
    brand: 'Kenwood',
    price: 179.99,
    rating: 5,
    reviews: 312,
    description: '7" component speaker system',
    image: '/images/products/monitors.svg',
    stock: 35,
    vendor: 'Crutchfield',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://crutchfield.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // ORCHESTRAL
  {
    id: 39,
    category: 'orchestral',
    name: 'Yamaha YVS-100 Violin',
    brand: 'Yamaha',
    price: 4999.99,
    rating: 5,
    reviews: 78,
    description: 'Silent electric violin with authentic tone',
    image: '/images/products/taylor.svg',
    stock: 5,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 40,
    category: 'orchestral',
    name: 'Hohner Panther Accordion',
    brand: 'Hohner',
    price: 599.99,
    rating: 5,
    reviews: 210,
    description: '3-row diatonic accordion',
    image: '/images/products/accordion.svg',
    stock: 14,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 5
  },
  {
    id: 41,
    category: 'orchestral',
    name: 'Roland Aerophone AE-20',
    brand: 'Roland',
    price: 1299.99,
    rating: 5,
    reviews: 145,
    description: 'Digital wind instrument with breath control',
    image: '/images/products/keyboard.svg',
    stock: 8,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  // ACCESSORIES
  {
    id: 42,
    category: 'accessories',
    name: 'Ernie Ball Strings (3-Pack)',
    brand: 'Ernie Ball',
    price: 19.99,
    rating: 5,
    reviews: 2340,
    description: 'Super Slinky electric guitar strings',
    image: '/images/products/strings.svg',
    stock: 200,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 43,
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
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 44,
    category: 'accessories',
    name: 'Gator Hardshell Case',
    brand: 'Gator',
    price: 149.99,
    rating: 5,
    reviews: 678,
    description: 'Premium protection for your instrument',
    image: '/images/products/case.svg',
    stock: 45,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 45,
    category: 'accessories',
    name: 'Mogami Gold Studio Cable',
    brand: 'Mogami',
    price: 59.99,
    rating: 5,
    reviews: 1240,
    description: '10ft premium instrument cable',
    image: '/images/products/strings.svg',
    stock: 85,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 46,
    category: 'accessories',
    name: 'Hercules GS414B Guitar Stand',
    brand: 'Hercules',
    price: 39.99,
    rating: 5,
    reviews: 2100,
    description: 'Auto-grip multi-guitar stand',
    image: '/images/products/case.svg',
    stock: 120,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  // PREMIUM DROPSHIP PRODUCTS - High-End Fulfilled by Printful/Spocket
  {
    id: 47,
    category: 'guitars',
    name: 'Custom Premium Electric Guitar',
    brand: 'The Franks Standard',
    price: 1499.99,
    rating: 5,
    reviews: 245,
    description: 'Hand-selected tonewoods, custom finish, professional setup - USA made',
    image: '/images/products/strat.svg',
    stock: 25,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 14,
    variantId: 'custom-electric-premium'
  },
  {
    id: 48,
    category: 'studio',
    name: 'Professional Audio Interface Bundle',
    brand: 'The Franks Standard Pro Audio',
    price: 599.99,
    rating: 5,
    reviews: 432,
    description: 'Studio-grade interface with premium cables and monitors',
    image: '/images/products/mic.svg',
    stock: 50,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 5,
    variantId: 'audio-interface-bundle-pro'
  },
  {
    id: 49,
    category: 'pedals',
    name: 'Boutique Overdrive Pedal',
    brand: 'The Franks Standard Signature Series',
    price: 279.99,
    rating: 5,
    reviews: 567,
    description: 'Hand-wired boutique tone with true bypass - Limited edition',
    image: '/images/products/pedals.svg',
    stock: 100,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'pedal-overdrive-boutique'
  },
  {
    id: 50,
    category: 'apparel',
    name: 'Premium Embroidered Hoodie',
    brand: 'The Franks Standard Signature',
    price: 89.99,
    rating: 5,
    reviews: 823,
    description: 'Luxury heavyweight hoodie with embroidered logo - Made in USA',
    image: '/images/products/strat.svg',
    stock: 9999,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 5,
    variantId: 'hoodie-embroidered-premium'
  },
  {
    id: 51,
    category: 'accessories',
    name: 'Professional Guitar Hard Case',
    brand: 'The Franks Standard Pro Gear',
    price: 249.99,
    rating: 5,
    reviews: 341,
    description: 'TSA-approved flight case with plush interior',
    image: '/images/products/case.svg',
    stock: 75,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 5,
    variantId: 'hardcase-flight-pro'
  },
  {
    id: 52,
    category: 'accessories',
    name: 'Handcrafted Leather Guitar Strap',
    brand: 'The Franks Standard Artisan',
    price: 149.99,
    rating: 5,
    reviews: 278,
    description: 'Full-grain leather with custom tooling and suede backing',
    image: '/images/products/case.svg',
    stock: 60,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10,
    variantId: 'strap-leather-handcrafted'
  },
  {
    id: 53,
    category: 'studio',
    name: 'Studio Monitoring System',
    brand: 'The Franks Standard Pro Audio',
    price: 899.99,
    rating: 5,
    reviews: 190,
    description: '5" powered monitors with acoustic treatment panels',
    image: '/images/products/mic.svg',
    stock: 40,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'monitors-studio-system'
  },
  {
    id: 54,
    category: 'guitars',
    name: 'Custom Acoustic Guitar Package',
    brand: 'The Franks Standard',
    price: 1899.99,
    rating: 5,
    reviews: 156,
    description: 'Solid wood construction with pro setup and premium hardshell case',
    image: '/images/products/taylor.svg',
    stock: 20,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 14,
    variantId: 'acoustic-custom-package'
  },
  {
    id: 55,
    category: 'apparel',
    name: 'Luxury Leather Jacket - Musician Edition',
    brand: 'The Franks Standard Signature',
    price: 499.99,
    rating: 5,
    reviews: 89,
    description: 'Premium cowhide leather jacket with custom patches',
    image: '/images/products/strat.svg',
    stock: 50,
    vendor: 'Printful',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10,
    variantId: 'jacket-leather-musician'
  },
  {
    id: 56,
    category: 'pedals',
    name: 'Multi-Effects Processor Pro',
    brand: 'The Franks Standard Pro Gear',
    price: 749.99,
    rating: 5,
    reviews: 423,
    description: 'Professional multi-effects with amp modeling and USB recording',
    image: '/images/products/pedals.svg',
    stock: 35,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 5,
    variantId: 'multieffects-pro-processor'
  },
  // GIBSON ACCESSORIES - Premium Hardware & Parts
  {
    id: 57,
    category: 'accessories',
    name: 'Gibson Burstbucker Pro Pickup Set',
    brand: 'Gibson',
    price: 249.99,
    rating: 5,
    reviews: 312,
    description: 'Vintage PAF-style humbuckers - neck and bridge set',
    image: '/images/products/picks.svg',
    stock: 45,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 58,
    category: 'accessories',
    name: 'Gibson ABR-1 Tune-o-matic Bridge',
    brand: 'Gibson',
    price: 89.99,
    rating: 5,
    reviews: 198,
    description: 'Authentic vintage-style ABR-1 bridge with titanium saddles',
    image: '/images/products/strings.svg',
    stock: 60,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 59,
    category: 'accessories',
    name: 'Gibson Vintage Deluxe Tuners - Gold',
    brand: 'Gibson',
    price: 119.99,
    rating: 5,
    reviews: 245,
    description: 'Premium Kluson-style tuners with 14:1 ratio - set of 6',
    image: '/images/products/strings.svg',
    stock: 38,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 60,
    category: 'accessories',
    name: 'Gibson Switchcraft Toggle Switch',
    brand: 'Gibson',
    price: 24.99,
    rating: 5,
    reviews: 567,
    description: 'Made-in-USA 3-way toggle switch with long thread',
    image: '/images/products/picks.svg',
    stock: 150,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 61,
    category: 'accessories',
    name: 'Gibson 490R/498T Pickup Set',
    brand: 'Gibson',
    price: 189.99,
    rating: 5,
    reviews: 289,
    description: 'Modern ceramic magnet humbuckers - hot output',
    image: '/images/products/picks.svg',
    stock: 42,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 62,
    category: 'accessories',
    name: 'Gibson Top Hat Knobs - Amber (Set of 4)',
    brand: 'Gibson',
    price: 39.99,
    rating: 5,
    reviews: 423,
    description: 'Vintage amber top hat knobs with metal inserts',
    image: '/images/products/picks.svg',
    stock: 85,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 63,
    category: 'accessories',
    name: 'Gibson Historic Truss Rod Cover',
    brand: 'Gibson',
    price: 29.99,
    rating: 5,
    reviews: 178,
    description: 'Les Paul Standard 2-screw truss rod cover - authentic',
    image: '/images/products/picks.svg',
    stock: 95,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 64,
    category: 'accessories',
    name: 'Gibson Quick Connect Battery System',
    brand: 'Gibson',
    price: 19.99,
    rating: 5,
    reviews: 312,
    description: 'Easy battery replacement for active pickups',
    image: '/images/products/picks.svg',
    stock: 120,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 65,
    category: 'accessories',
    name: 'Gibson Nashville Tune-o-matic Bridge',
    brand: 'Gibson',
    price: 79.99,
    rating: 5,
    reviews: 234,
    description: 'Modern Nashville-style bridge with wide spacing',
    image: '/images/products/strings.svg',
    stock: 52,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 66,
    category: 'accessories',
    name: 'Gibson 500K CTS Audio Taper Pots (Set)',
    brand: 'Gibson',
    price: 49.99,
    rating: 5,
    reviews: 445,
    description: 'Professional-grade potentiometers - set of 4',
    image: '/images/products/picks.svg',
    stock: 78,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  // DIY GUITAR KITS - Build Your Own
  {
    id: 67,
    category: 'guitars',
    name: 'Les Paul Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 299.99,
    discount: 10,
    rating: 5,
    reviews: 512,
    description: 'Complete LP-style kit: mahogany body, maple top, rosewood fretboard, all hardware included',
    image: '/images/products/lespaul.svg',
    stock: 35,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-lespaul-complete'
  },
  {
    id: 68,
    category: 'guitars',
    name: 'Stratocaster Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 249.99,
    discount: 15,
    rating: 5,
    reviews: 687,
    description: 'Complete Strat-style kit: alder body, maple neck, all electronics and hardware',
    image: '/images/products/strat.svg',
    stock: 48,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-strat-complete'
  },
  {
    id: 69,
    category: 'guitars',
    name: 'Telecaster Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 229.99,
    rating: 5,
    reviews: 423,
    description: 'Complete Tele-style kit: ash body, maple neck, vintage-style bridge and pickups',
    image: '/images/products/strat.svg',
    stock: 42,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-tele-complete'
  },
  {
    id: 70,
    category: 'guitars',
    name: 'SG Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 279.99,
    rating: 5,
    reviews: 298,
    description: 'Complete SG-style kit: mahogany body and neck, dual humbuckers, chrome hardware',
    image: '/images/products/lespaul.svg',
    stock: 28,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-sg-complete'
  },
  {
    id: 71,
    category: 'bass',
    name: 'Precision Bass Style DIY Kit',
    brand: 'The Franks Standard Build Series',
    price: 269.99,
    rating: 5,
    reviews: 345,
    description: 'Complete P-Bass kit: alder body, maple neck, split-coil pickup, vintage hardware',
    image: '/images/products/strat.svg',
    stock: 32,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-pbass-complete'
  },
  {
    id: 72,
    category: 'bass',
    name: 'Jazz Bass Style DIY Kit',
    brand: 'The Franks Standard Build Series',
    price: 289.99,
    rating: 5,
    reviews: 289,
    description: 'Complete J-Bass kit: ash body, maple neck, dual single-coil pickups',
    image: '/images/products/strat.svg',
    stock: 26,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-jbass-complete'
  },
  {
    id: 73,
    category: 'guitars',
    name: 'Explorer Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 319.99,
    rating: 5,
    reviews: 198,
    description: 'Complete Explorer-style kit: mahogany body, set neck, EMG-style pickups',
    image: '/images/products/lespaul.svg',
    stock: 18,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-explorer-complete'
  },
  {
    id: 74,
    category: 'guitars',
    name: 'Flying V Style DIY Guitar Kit',
    brand: 'The Franks Standard Build Series',
    price: 309.99,
    rating: 5,
    reviews: 167,
    description: 'Complete V-style kit: korina body, mahogany neck, dual humbuckers',
    image: '/images/products/lespaul.svg',
    stock: 15,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-flyingv-complete'
  },
  {
    id: 75,
    category: 'guitars',
    name: 'Premium Carved Top DIY Kit',
    brand: 'The Franks Standard Master Series',
    price: 449.99,
    rating: 5,
    reviews: 134,
    description: 'Premium LP-style kit: flame maple top, mahogany body, bound neck, Grover tuners',
    image: '/images/products/lespaul.svg',
    stock: 22,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10,
    variantId: 'diy-premium-carved'
  },
  {
    id: 76,
    category: 'guitars',
    name: 'Semi-Hollow 335 Style DIY Kit',
    brand: 'The Franks Standard Build Series',
    price: 379.99,
    rating: 5,
    reviews: 223,
    description: 'Complete 335-style kit: laminated maple body, f-holes, dual humbuckers, Bigsby tremolo',
    image: '/images/products/taylor.svg',
    stock: 19,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 7,
    variantId: 'diy-semihollow-335'
  },
  {
    id: 77,
    category: 'guitars',
    name: 'Acoustic Dreadnought DIY Kit',
    brand: 'The Franks Standard Acoustic Series',
    price: 329.99,
    rating: 5,
    reviews: 456,
    description: 'Complete acoustic kit: spruce top, mahogany back/sides, rosewood fretboard',
    image: '/images/products/taylor.svg',
    stock: 31,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10,
    variantId: 'diy-acoustic-dread'
  },
  {
    id: 78,
    category: 'guitars',
    name: 'Classical Guitar DIY Kit',
    brand: 'The Franks Standard Classical Series',
    price: 199.99,
    rating: 5,
    reviews: 278,
    description: 'Complete classical kit: cedar top, mahogany body, slotted headstock, nylon strings',
    image: '/images/products/taylor.svg',
    stock: 24,
    vendor: 'Spocket',
    fulfillment: 'dropship',
    shipFrom: 'USA',
    etaDays: 10,
    variantId: 'diy-classical-complete'
  },
  // MORE GIBSON ACCESSORIES
  {
    id: 79,
    category: 'accessories',
    name: 'Gibson Brite Wire Electric Strings',
    brand: 'Gibson',
    price: 14.99,
    rating: 5,
    reviews: 1820,
    description: '.010-.046 gauge nickel-plated steel strings',
    image: '/images/products/strings.svg',
    stock: 250,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 80,
    category: 'accessories',
    name: 'Gibson Phosphor Bronze Acoustic Strings',
    brand: 'Gibson',
    price: 12.99,
    rating: 5,
    reviews: 1345,
    description: '.012-.053 warm tone acoustic guitar strings',
    image: '/images/products/strings.svg',
    stock: 280,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 81,
    category: 'accessories',
    name: 'Gibson Premium Guitar Strap - Leather',
    brand: 'Gibson',
    price: 79.99,
    rating: 5,
    reviews: 567,
    description: 'Genuine leather strap with embossed Gibson logo',
    image: '/images/products/case.svg',
    stock: 65,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 82,
    category: 'accessories',
    name: 'Gibson Guitar Polish & Cloth Kit',
    brand: 'Gibson',
    price: 24.99,
    rating: 5,
    reviews: 892,
    description: 'Premium polish with microfiber cloth - safe for all finishes',
    image: '/images/products/picks.svg',
    stock: 145,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 83,
    category: 'accessories',
    name: 'Gibson Wiring Harness Kit - Les Paul',
    brand: 'Gibson',
    price: 149.99,
    rating: 5,
    reviews: 234,
    description: 'Complete pre-wired harness with CTS pots and Switchcraft jack',
    image: '/images/products/picks.svg',
    stock: 42,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 84,
    category: 'accessories',
    name: 'Gibson Pickguard - Les Paul Standard',
    brand: 'Gibson',
    price: 39.99,
    rating: 5,
    reviews: 189,
    description: 'Authentic cream single-ply pickguard',
    image: '/images/products/picks.svg',
    stock: 78,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  {
    id: 85,
    category: 'accessories',
    name: 'Gibson Lightning Bolt Strap Locks',
    brand: 'Gibson',
    price: 29.99,
    rating: 5,
    reviews: 723,
    description: 'Secure strap lock system - chrome finish',
    image: '/images/products/picks.svg',
    stock: 110,
    vendor: 'Amazon',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://amazon.com',
    shipFrom: 'Various',
    etaDays: 2
  },
  // ADDITIONAL PREMIUM INSTRUMENTS
  {
    id: 86,
    category: 'guitars',
    name: 'ESP LTD EC-1000',
    brand: 'ESP',
    price: 999.99,
    rating: 5,
    reviews: 345,
    description: 'Professional single-cut with EMG pickups',
    image: '/images/products/lespaul.svg',
    stock: 14,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 87,
    category: 'guitars',
    name: 'Schecter Hellraiser C-1',
    brand: 'Schecter',
    price: 849.99,
    rating: 5,
    reviews: 512,
    description: 'Active EMG pickups with quilted maple top',
    image: '/images/products/lespaul.svg',
    stock: 18,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 88,
    category: 'guitars',
    name: 'Gretsch G5420T Electromatic',
    brand: 'Gretsch',
    price: 599.99,
    rating: 5,
    reviews: 423,
    description: 'Hollow body with Bigsby tremolo - vintage tone',
    image: '/images/products/taylor.svg',
    stock: 11,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 89,
    category: 'guitars',
    name: 'Epiphone Les Paul Custom Pro',
    brand: 'Epiphone',
    price: 649.99,
    rating: 5,
    reviews: 789,
    description: 'ProBucker humbuckers with coil-split',
    image: '/images/products/lespaul.svg',
    stock: 24,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
  },
  {
    id: 90,
    category: 'guitars',
    name: 'Squier Classic Vibe Stratocaster',
    brand: 'Squier',
    price: 449.99,
    rating: 5,
    reviews: 1240,
    description: 'Vintage-inspired with Alnico pickups',
    image: '/images/products/strat.svg',
    stock: 32,
    vendor: 'Sweetwater',
    fulfillment: 'affiliate',
    affiliateUrl: 'https://sweetwater.com',
    shipFrom: 'USA',
    etaDays: 3
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
      const totalBTC = (cartTotal.value / 66000).toFixed(8)
      alert(`Bitcoin Payment\n\nTotal: ${totalBTC} BTC\n\nGenerating payment address...`)
      
      const payment = await createBitcoinPayment('custom')
      alert(`Send exactly ${totalBTC} BTC to:\n\n${payment.address}\n\nOrder will be processed after confirmation.`)
      
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
    try {
      // Prepare dropship order data
      const dropshipItems = cart.value
        .filter(item => item.fulfillment === 'dropship')
        .map(item => ({
          productId: item.id,
          variantId: item.variantId || item.id,
          quantity: item.quantity,
          price: item.price,
          supplier: item.vendor
        }))

      // Create order with dropshipping suppliers (Printful, Spocket, etc.)
      if (dropshipItems.length > 0) {
        const dropshipResult = await createDropshipOrder({
          items: dropshipItems,
          customer: {
            firstName: shipping.value.name.split(' ')[0],
            lastName: shipping.value.name.split(' ').slice(1).join(' ') || '',
            email: localStorage.getItem('userEmail') || 'customer@fretpilot.com',
            phone: shipping.value.phone
          },
          shippingAddress: {
            address1: shipping.value.address,
            city: shipping.value.city,
            state: shipping.value.state,
            zip: shipping.value.zip,
            country: 'US'
          },
          paymentMethod: 'card'
        })

        if (!dropshipResult.success) {
          throw new Error('Dropship order creation failed')
        }

        // Save dropship order IDs for tracking
        console.log('Dropship orders created:', dropshipResult.orders)
      }

      // Handle Stripe checkout for payment
      const successUrl = window.location.origin + '/?checkout_success=1'
      const cancelUrl = window.location.origin + '/?checkout_cancel=1'
      const { url } = await postJSON('/api/stripe/create-checkout-session', { cart: cart.value, successUrl, cancelUrl })
      
      if (url && url.includes('example.com')) {
        // Dev mode - simulate successful order
        const order = makeOrder({
          items: cart.value,
          shipping: shipping.value,
          total: cartTotal.value,
          paymentMethod: 'card',
          status: 'paid',
          fulfillmentSummary: summarizeFulfillment(cart.value),
          dropshipOrders: dropshipItems.length > 0 ? 'submitted' : 'none'
        })
        saveOrder(order)
        await submitDropshipPO(order)
        await sendOrderConfirmation(order)
        clearCart()
        showCheckout.value = false
        alert('Order placed! Your dropship items are being processed by our suppliers.')
      } else if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL')
      }
    } catch (e) {
      console.error('Order error:', e)
      alert('Unable to complete order. Please check your connection and try again.')
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

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.music-store {
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 60px;
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
