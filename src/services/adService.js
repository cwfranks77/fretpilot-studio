// adService.js
// Cross-platform ad initialization. Uses AdMob on Capacitor mobile; no-op on web/electron.

let initialized = false

export async function initAds() {
  try {
    // Dynamic import to avoid bundling for non-mobile
    const { Capacitor } = await import('@capacitor/core')
    if (!Capacitor.isNativePlatform()) return false

    const admob = await import('@capacitor-community/admob')
    const { AdMob, TrackingAuthorizationStatus } = admob
    await AdMob.requestTrackingAuthorization?.()
    await AdMob.initialize({ initializeForTesting: true })
    initialized = true
    return true
  } catch (e) {
    // Likely running on web/electron where plugin isn't available
    console.info('Ads not initialized (non-mobile or plugin missing).')
    return false
  }
}

export async function showBanner() {
  if (!initialized) return
  try {
    const admob = await import('@capacitor-community/admob')
    const { BannerAd, BannerAdSize, BannerAdPosition } = admob
    await BannerAd.show({
      adId: 'ca-app-pub-3940256099942544/6300978111', // Test ID; replace in production
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    })
  } catch (e) {
    console.warn('Banner failed', e)
  }
}

export async function showInterstitial() {
  if (!initialized) return
  try {
    const admob = await import('@capacitor-community/admob')
    const { InterstitialAd } = admob
    await InterstitialAd.load({ adId: 'ca-app-pub-3940256099942544/1033173712' })
    await InterstitialAd.show()
  } catch (e) { console.warn('Interstitial failed', e) }
}

export async function showReward() {
  if (!initialized) {
    // Dev/web fallback: simulate rewarded ad
    const ok = typeof window !== 'undefined' ? window.confirm('Simulate rewarded ad?') : false
    return ok ? { type: 'simulated', amount: 1 } : null
  }
  try {
    const admob = await import('@capacitor-community/admob')
    const { RewardAd } = admob
    await RewardAd.load({ adId: 'ca-app-pub-3940256099942544/5224354917' })
    const { type, amount } = await RewardAd.show()
    console.log('User earned reward', type, amount)
    return { type, amount }
  } catch (e) { console.warn('Reward failed', e); return null }
}
