// Placeholder Google Play Billing service
export function isGooglePlayBillingAvailable() { return false }
export const SUBSCRIPTION_PRODUCTS = { monthly: 'monthly', yearly: 'yearly', lifetime: 'lifetime' }
export async function purchaseProduct(id) { return { success: false, error: 'Not implemented' } }
export async function getProducts() { return { products: [] } }
export async function checkSubscriptionStatus() { return { active: false, plan: null } }
export function manageSubscription() {}
export async function restorePurchases() { return { restored: 0 } }
