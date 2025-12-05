// Placeholder Bitcoin payment service
export async function createBitcoinPayment(plan) {
  return { id: 'btc_' + Date.now(), amount: plan === 'lifetime' ? 0.00075 : 0.00015, address: 'bc1q...' }
}
export async function checkPaymentStatus(id) {
  return { confirmed: false }
}
export function startPaymentMonitoring(cb) {
  return setInterval(() => {}, 10000)
}
export function stopPaymentMonitoring(id) {
  clearInterval(id)
}
export function getPaymentQRCode(address, amount) {
  return 'data:image/svg+xml,...'
}
