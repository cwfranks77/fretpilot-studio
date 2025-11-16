// Subscription Service - Tiered Access Control
// Free, Premium ($9.99/mo), Pro ($19.99/mo)

const TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  PRO: 'pro'
};

const TIER_LIMITS = {
  [TIERS.FREE]: {
    name: 'Free',
    price: 0,
    videosPerDay: 3,
    aiAnalysis: false,
    poseDetection: false,
    adaptiveDifficulty: false,
    personalizedRecommendations: false,
    downloadVideos: false,
    privateCoaching: false,
    customLessonPlans: false,
    prioritySupport: false,
    features: [
      'Access to 3 video lessons per day',
      'Basic progress tracking',
      'Community forum access'
    ]
  },
  [TIERS.PREMIUM]: {
    name: 'Premium',
    price: 9.99,
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    videosPerDay: 25,
    aiAnalysis: true,
    poseDetection: true,
    adaptiveDifficulty: true,
    personalizedRecommendations: true,
    downloadVideos: true,
    privateCoaching: false,
    customLessonPlans: false,
    prioritySupport: false,
    features: [
      'Unlimited video lessons',
      'AI technique analysis',
      'Real-time pose detection',
      'Adaptive difficulty adjustment',
      'Personalized recommendations',
      'Download videos for offline practice',
      'Detailed progress analytics',
      'Remove all ads'
    ]
  },
  [TIERS.PRO]: {
    name: 'Pro',
    price: 19.99,
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    videosPerDay: Infinity,
    aiAnalysis: true,
    poseDetection: true,
    adaptiveDifficulty: true,
    personalizedRecommendations: true,
    downloadVideos: true,
    privateCoaching: true,
    customLessonPlans: true,
    prioritySupport: true,
    features: [
      'Everything in Premium, plus:',
      'AI-generated custom lesson plans',
      'Private 1-on-1 video coaching sessions',
      'Priority support (24h response)',
      'Early access to new features',
      'Export your practice data',
      'Certificate of completion',
      'Commercial license for performances'
    ]
  }
};

class SubscriptionService {
  constructor() {
    this.storageKey = 'fretpilot_subscription';
    this.usageKey = 'fretpilot_daily_usage';
  }

  // Get current subscription
  getCurrentSubscription() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      // Default to Premium in dev to unlock all features out of the box
      return {
        tier: TIERS.PREMIUM,
        status: 'active',
        startDate: new Date().toISOString(),
        expiryDate: null,
        stripeSubscriptionId: null
      };
    }
    return JSON.parse(stored);
  }

  // Set subscription (after payment)
  setSubscription(tier, stripeSubscriptionId, expiryDate) {
    const subscription = {
      tier,
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate,
      stripeSubscriptionId,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(subscription));
    return subscription;
  }

  // Get tier limits
  getTierLimits(tier = null) {
    const currentTier = tier || this.getCurrentSubscription().tier;
    return TIER_LIMITS[currentTier];
  }

  // Check if feature is available
  hasFeature(feature) {
    const subscription = this.getCurrentSubscription();
    const limits = TIER_LIMITS[subscription.tier];
    return limits[feature] === true;
  }

  // Track daily usage (for free tier)
  trackVideoView() {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getDailyUsage();
    
    if (usage.date !== today) {
      // Reset for new day
      const newUsage = { date: today, count: 1 };
      localStorage.setItem(this.usageKey, JSON.stringify(newUsage));
      return { allowed: true, remaining: this.getTierLimits().videosPerDay - 1 };
    }
    
    const limits = this.getTierLimits();
    if (usage.count >= limits.videosPerDay) {
      return { allowed: false, remaining: 0 };
    }
    
    usage.count++;
    localStorage.setItem(this.usageKey, JSON.stringify(usage));
    return { allowed: true, remaining: limits.videosPerDay - usage.count };
  }

  getDailyUsage() {
    const stored = localStorage.getItem(this.usageKey);
    if (!stored) {
      const today = new Date().toISOString().split('T')[0];
      return { date: today, count: 0 };
    }
    return JSON.parse(stored);
  }

  // Check if can view video
  canViewVideo() {
    const subscription = this.getCurrentSubscription();
    
    // Check if subscription expired
    if (subscription.expiryDate && new Date(subscription.expiryDate) < new Date()) {
      return { allowed: false, reason: 'subscription_expired' };
    }
    
    // Premium/Pro have unlimited
    if (subscription.tier !== TIERS.FREE) {
      return { allowed: true, remaining: Infinity };
    }
    
    // Check free tier limits
    const usage = this.trackVideoView();
    if (!usage.allowed) {
      return { allowed: false, reason: 'daily_limit_reached', remaining: 0 };
    }
    
    return { allowed: true, remaining: usage.remaining };
  }

  // Get all tiers for pricing page
  getAllTiers() {
    return TIERS;
  }

  getAllTierLimits() {
    return TIER_LIMITS;
  }

  // Cancel subscription
  cancelSubscription() {
    const subscription = this.getCurrentSubscription();
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(subscription));
    return subscription;
  }

  // Upgrade tier
  upgradeTier(newTier, stripeSubscriptionId, expiryDate) {
    return this.setSubscription(newTier, stripeSubscriptionId, expiryDate);
  }
}

export default new SubscriptionService();
export { TIERS, TIER_LIMITS };
