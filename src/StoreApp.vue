<template>
  <div class="standalone-store">
    <header class="store-header">
      <div class="header-content">
        <div class="brand">
          <div class="logo-container">
            <img src="/resources/brand-assets/TFS_temple_logo.svg" alt="The Franks Standard Logo" class="brand-logo">
          </div>
          <div class="brand-text">
            <h1>THE FRANKS STANDARD</h1>
            <p class="tagline">PREMIUM INSTRUMENTS. SERVICE STANDARD.</p>
          </div>
        </div>
        <nav class="header-nav">
          <a href="/" class="app-link">Launch FretPilot App</a>
          <button @click="showCart = true" class="cart-btn" v-if="cart.length > 0">
            🛒 Cart ({{ cart.length }}) - ${{ cartTotal.toFixed(2) }}
          </button>
        </nav>
      </div>
    </header>

    <MusicStore />

    <footer class="store-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About The Franks Standard</h3>
          <p>Premium music gear and pro audio equipment curated for musicians who demand the best. Quality is our standard.</p>
        </div>
        <div class="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="mailto:support@fretpilotstudio.com">Contact Support</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns & Exchanges</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Connect</h3>
          <ul>
            <li><a href="https://fretpilotstudio.com">Main Site</a></li>
            <li><a href="https://fretpilotstudio.com">FretPilot App</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 The Franks Standard. All rights reserved. | Powered by FretPilot</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MusicStore from './components/MusicStore.vue'

const cart = ref([])
const showCart = ref(false)

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})
</script>

<style scoped>
.standalone-store {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.store-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-container {
  flex: 0 0 auto;
}

.brand-logo {
  height: 80px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-text h1 {
  font-family: 'Cinzel', Georgia, 'Times New Roman', serif;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin: 0;
  background: linear-gradient(135deg, #f5f5f5 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  margin: 0;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #d4af37;
}

.header-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.app-link {
  padding: 0.6rem 1.2rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid #667eea;
  border-radius: 8px;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.app-link:hover {
  background: rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.cart-btn {
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.store-footer {
  margin-top: auto;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem 1rem 2rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p,
.footer-section ul {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #667eea;
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .brand h1 {
    font-size: 1.5rem;
  }

  .header-nav {
    flex-direction: column;
    width: 100%;
  }

  .app-link,
  .cart-btn {
    width: 100%;
  }

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>
