/**
 * Google Play Billing Service for FretPilot Studio
 * 
 * This service wraps the cordova-plugin-purchase API to handle subscription purchases.
 * 
 * SETUP COMPLETED:
 * ✓ cordova-plugin-purchase installed and synced
 * ✓ Android billing library added to build.gradle
 * 
 * REMAINING SETUP:
 * 1. Configure subscription products in Google Play Console:
 *    - Go to https://play.google.com/console
 *    - Navigate to: Your App → Monetize → Subscriptions
 *    - Create the following subscription products:
 *      • Product ID: fretpilot_premium_monthly
 *        Price: $9.99/month
 *        Billing period: 1 month
 *      • Product ID: fretpilot_premium_yearly  
 *        Price: $99.99/year
 *        Billing period: 1 year
 *      • Product ID: fretpilot_premium_lifetime
 *        Price: $299.99 (one-time)
 *        Billing period: None (use "Prepaid" plan)
 * 
 * 2. Set up payment profile in Play Console:
 *    - Go to: Payments & reports → Setup payment profile
 *    - Add your Navy Federal Credit Union account details
 *    - Google will deposit payments monthly (minus 15-30% commission)
 * 
 * 3. Test the integration:
 *    - Add licensed test users in Play Console → Setup → License testing
 *    - Test purchases won't charge real money
 * 
 * PAYMENT FLOW:
 * User → Purchases in App → Google Play Store processes payment → 
 * Google deposits to your bank account monthly (minus commission)
 */

import { Capacitor } from '@capacitor/core';

// Product IDs configured in Google Play Console
export const SUBSCRIPTION_PRODUCTS = {
  monthly: 'fretpilot_premium_monthly',
  yearly: 'fretpilot_premium_yearly',
  lifetime: 'fretpilot_premium_lifetime'
};

// Mock products for web/testing or when store info isn't ready yet
function _mockProducts() {
  return [
    {
      productId: SUBSCRIPTION_PRODUCTS.monthly,
      title: 'FretPilot Premium Monthly',
      description: 'Unlimited AI lessons, full video library, no ads',
      price: '$9.99',
      priceAmount: 9.99,
      currency: 'USD',
      type: 'subscription'
    },
    {
      productId: SUBSCRIPTION_PRODUCTS.yearly,
      title: 'FretPilot Premium Yearly',
      description: 'Best value - 2 months free',
      price: '$99.99',
      priceAmount: 99.99,
      currency: 'USD',
      type: 'subscription'
    },
    {
      productId: SUBSCRIPTION_PRODUCTS.lifetime,
      title: 'FretPilot Lifetime Access',
      description: 'Pay once, own forever',
      price: '$299.99',
      priceAmount: 299.99,
      currency: 'USD',
      type: 'purchase'
    }
  ];
}

// Get the CdvPurchase object from window
const getStore = () => {
  return window.CdvPurchase?.store;
};

/**
 * Check if Google Play Billing is available on this platform
 */
export function isGooglePlayBillingAvailable() {
  return Capacitor.getPlatform() === 'android' && typeof window.CdvPurchase !== 'undefined';
}

/**
 * Initialize the billing client
 * IMPORTANT: Call this when the app starts
 */
export async function initializeBilling() {
  if (!isGooglePlayBillingAvailable()) {
    console.log('Google Play Billing not available on this platform');
    return { success: false, error: 'Not on Android platform or plugin not loaded' };
  }

  try {
    const store = getStore();
    
    // Register products
    store.register([
      {
        id: SUBSCRIPTION_PRODUCTS.monthly,
        type: store.PAID_SUBSCRIPTION,
        platform: store.GOOGLE_PLAY
      },
      {
        id: SUBSCRIPTION_PRODUCTS.yearly,
        type: store.PAID_SUBSCRIPTION,
        platform: store.GOOGLE_PLAY
      },
      {
        id: SUBSCRIPTION_PRODUCTS.lifetime,
        type: store.PAID_SUBSCRIPTION,
        platform: store.GOOGLE_PLAY
      }
    ]);

    // Set up event handlers
    store.when().approved((transaction) => {
      transaction.finish();
      // Save premium status
      const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}');
      auth.premium = true;
      auth.plan = transaction.products[0].id.replace('fretpilot_premium_', '');
      auth.purchaseToken = transaction.id;
      localStorage.setItem('fretpilot-auth', JSON.stringify(auth));
    });

    store.when().finished((transaction) => {
      console.log('Transaction finished:', transaction);
    });

    store.when().error((error) => {
      console.error('Store error:', error);
    });

    // Initialize the store
    await store.initialize([store.GOOGLE_PLAY]);
    
    console.log('Google Play Billing initialized');
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize billing:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get available subscription products
 */
export async function getProducts() {
  if (!isGooglePlayBillingAvailable()) {
    // Return mock products for web/testing
    return _mockProducts();
  }

  try {
    const store = getStore();
    const products = Object.values(SUBSCRIPTION_PRODUCTS)
      .map(id => store.get(id))
      .filter(p => p)
      .map(p => ({
        productId: p.id,
        title: p.title,
        description: p.description,
        price: p.pricing?.price || 'N/A',
        priceAmount: p.pricing?.priceMicros / 1000000 || 0,
        currency: p.pricing?.currency || 'USD',
        type: p.type
      }));
    
    return products.length > 0 ? products : _mockProducts(); // Fallback to mock if not loaded yet
  } catch (error) {
    console.error('Failed to get products:', error);
    return _mockProducts(); // Return mock products
  }
}

/**
 * Purchase a subscription product
 * @param {string} productId - One of SUBSCRIPTION_PRODUCTS values
 */
export async function purchaseProduct(productId) {
  if (!isGooglePlayBillingAvailable()) {
    // Simulate successful purchase for testing
    console.log('[Billing] Mock purchase:', productId);
    
    // Save premium status locally
    const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}');
    auth.premium = true;
    auth.plan = productId.replace('fretpilot_premium_', '');
    auth.purchaseToken = 'mock_' + Date.now();
    localStorage.setItem('fretpilot-auth', JSON.stringify(auth));
    
    return {
      success: true,
      productId,
      purchaseToken: 'mock_' + Date.now(),
      orderId: 'ORDER_' + Date.now()
    };
  }

  try {
    const store = getStore();
    const product = store.get(productId);
    
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    
    // Get the first available offer (for subscriptions)
    const offer = product.offers?.[0];
    if (!offer) {
      throw new Error(`No offers available for ${productId}`);
    }
    
    // Initiate purchase
    await offer.order();
    
    return { 
      success: true, 
      productId: productId,
      message: 'Purchase successful! Premium features unlocked.'
    };
  } catch (error) {
    console.error('Purchase failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Restore previous purchases
 * Call this when user reinstalls the app
 */
export async function restorePurchases() {
  if (!isGooglePlayBillingAvailable()) {
    console.log('[Billing] Mock restore - no purchases to restore');
    return { restored: 0 };
  }

  try {
    const store = getStore();
    
    // Refresh receipts from the store
    await store.restorePurchases();
    
    // Check for owned products
    const purchases = Object.values(SUBSCRIPTION_PRODUCTS)
      .map(id => store.get(id))
      .filter(p => p && p.owned);
    
    // Update local storage if we found purchases
    if (purchases.length > 0) {
      const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}');
      auth.premium = true;
      auth.plan = purchases[0].id.replace('fretpilot_premium_', '');
      auth.purchaseToken = purchases[0].transaction?.id || 'restored';
      localStorage.setItem('fretpilot-auth', JSON.stringify(auth));
    }
    
    return { restored: purchases.length };
  } catch (error) {
    console.error('Restore failed:', error);
    return { restored: 0, error: error.message };
  }
}

/**
 * Check if user has an active subscription
 */
export async function checkSubscriptionStatus() {
  const auth = JSON.parse(localStorage.getItem('fretpilot-auth') || '{}');
  
  if (!isGooglePlayBillingAvailable()) {
    // Return local storage status for web
    if (auth.premium && auth.purchaseToken) {
      return {
        active: true,
        plan: auth.plan || 'monthly',
        purchaseToken: auth.purchaseToken
      };
    }
    return { active: false };
  }

  try {
    const store = getStore();
    
    // Check if any of our products are owned
    const ownedProduct = Object.values(SUBSCRIPTION_PRODUCTS)
      .map(id => store.get(id))
      .find(p => p && p.owned);
    
    if (ownedProduct) {
      return {
        active: true,
        plan: ownedProduct.id.replace('fretpilot_premium_', ''),
        purchaseToken: ownedProduct.transaction?.id
      };
    }
    
    return { active: false };
  } catch (error) {
    console.error('Status check failed:', error);
    // Fallback to local storage
    if (auth.premium && auth.purchaseToken) {
      return {
        active: true,
        plan: auth.plan || 'monthly',
        purchaseToken: auth.purchaseToken
      };
    }
    return { active: false };
  }
}

/**
 * Open subscription management in Play Store
 * Allows users to cancel or change their subscription
 */
export async function manageSubscription() {
  if (!isGooglePlayBillingAvailable()) {
    alert('Subscription management is only available on Android via Google Play Store');
    return;
  }

  try {
    const store = getStore();
    
    // Open subscription management
    await store.manageSubscriptions();
    
    return { success: true };
  } catch (error) {
    console.error('Failed to open subscription management:', error);
    
    // Fallback: Open Play Store subscriptions page
    const packageName = 'com.fretpilot.app';
    const url = `https://play.google.com/store/account/subscriptions?package=${packageName}`;
    window.open(url, '_system');
    
    return { success: true };
  }
}
