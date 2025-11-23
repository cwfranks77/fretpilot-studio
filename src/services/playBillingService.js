// JavaScript wrapper for Play Billing Plugin
// Use this in your Vue components to handle Android subscriptions

class PlayBillingService {
  constructor() {
    this.isAndroid = window.Capacitor?.getPlatform() === 'android';
    this.PlayBilling = window.Capacitor?.Plugins?.PlayBilling;
  }

  /**
   * Check if Play Billing is available (Android only)
   */
  isAvailable() {
    return this.isAndroid && this.PlayBilling != null;
  }

  /**
   * Query available subscription products
   * @param {string[]} productIds - Array of product IDs (e.g., ['premium_monthly', 'premium_yearly'])
   * @returns {Promise<Array>} - Array of product details with pricing
   */
  async queryProducts(productIds) {
    if (!this.isAvailable()) {
      throw new Error('Play Billing not available on this platform');
    }

    try {
      const result = await this.PlayBilling.queryProducts({ productIds });
      return result.products || [];
    } catch (error) {
      console.error('[PlayBilling] Query failed:', error);
      throw error;
    }
  }

  /**
   * Purchase a subscription
   * @param {string} productId - Product ID to purchase
   * @param {string} offerToken - Offer token from product details
   * @returns {Promise<Object>} - Purchase details
   */
  async purchaseSubscription(productId, offerToken) {
    if (!this.isAvailable()) {
      throw new Error('Play Billing not available on this platform');
    }

    try {
      // Set up event listeners for purchase flow
      return new Promise((resolve, reject) => {
        const purchaseListener = this.PlayBilling.addListener('purchaseCompleted', (purchase) => {
          console.log('[PlayBilling] Purchase completed:', purchase);
          
          // Track subscription start
          if (window.trackEvent) {
            window.trackEvent('subscription_start', {
              product_id: productId,
              platform: 'android',
              method: 'play_billing'
            });
          }
          
          purchaseListener.remove();
          cancelListener.remove();
          errorListener.remove();
          resolve(purchase);
        });

        const cancelListener = this.PlayBilling.addListener('purchaseCanceled', () => {
          console.log('[PlayBilling] Purchase canceled by user');
          purchaseListener.remove();
          cancelListener.remove();
          errorListener.remove();
          reject(new Error('Purchase canceled'));
        });

        const errorListener = this.PlayBilling.addListener('purchaseError', (error) => {
          console.error('[PlayBilling] Purchase error:', error);
          purchaseListener.remove();
          cancelListener.remove();
          errorListener.remove();
          reject(new Error(error.message || 'Purchase failed'));
        });

        // Launch purchase flow
        this.PlayBilling.purchaseSubscription({ productId, offerToken })
          .catch(err => {
            purchaseListener.remove();
            cancelListener.remove();
            errorListener.remove();
            reject(err);
          });
      });
    } catch (error) {
      console.error('[PlayBilling] Purchase failed:', error);
      throw error;
    }
  }

  /**
   * Restore previous purchases
   * @returns {Promise<Array>} - Array of active purchases
   */
  async restorePurchases() {
    if (!this.isAvailable()) {
      throw new Error('Play Billing not available on this platform');
    }

    try {
      const result = await this.PlayBilling.restorePurchases();
      return result.purchases || [];
    } catch (error) {
      console.error('[PlayBilling] Restore failed:', error);
      throw error;
    }
  }

  /**
   * Acknowledge a purchase (automatically handled in plugin, but exposed for manual use)
   * @param {string} purchaseToken - Purchase token to acknowledge
   */
  async acknowledgePurchase(purchaseToken) {
    if (!this.isAvailable()) {
      throw new Error('Play Billing not available on this platform');
    }

    try {
      await this.PlayBilling.acknowledgePurchase({ purchaseToken });
    } catch (error) {
      console.error('[PlayBilling] Acknowledgment failed:', error);
      throw error;
    }
  }

  /**
   * Check if user has active premium subscription
   * @returns {Promise<boolean>}
   */
  async hasPremiumSubscription() {
    if (!this.isAvailable()) {
      return false; // On web, use Stripe or server-side check
    }

    try {
      const purchases = await this.restorePurchases();
      // Check if any purchase matches your premium product IDs
      const premiumProducts = ['premium_monthly', 'premium_yearly', 'premium_pro'];
      return purchases.some(purchase => premiumProducts.includes(purchase.productId));
    } catch (error) {
      console.error('[PlayBilling] Premium check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const playBillingService = new PlayBillingService();

// Example usage in Vue component:
/*
import { playBillingService } from '@/services/playBillingService.js';

export default {
  data() {
    return {
      products: [],
      isPremium: false
    };
  },
  async mounted() {
    if (playBillingService.isAvailable()) {
      // Query available products
      this.products = await playBillingService.queryProducts([
        'premium_monthly',
        'premium_yearly'
      ]);

      // Check existing subscription
      this.isPremium = await playBillingService.hasPremiumSubscription();
    }
  },
  methods: {
    async subscribe(product) {
      try {
        const purchase = await playBillingService.purchaseSubscription(
          product.productId,
          product.offerToken
        );
        
        console.log('Subscription successful!', purchase);
        this.isPremium = true;
        
        // Update UI, sync with backend, etc.
      } catch (error) {
        if (error.message === 'Purchase canceled') {
          console.log('User canceled subscription');
        } else {
          console.error('Subscription failed:', error);
          alert('Subscription failed. Please try again.');
        }
      }
    }
  }
};
*/
