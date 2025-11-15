import { API_BASE, postJSON } from './config'

export async function sendOrderConfirmation(order) {
  try {
    if (!API_BASE) return false
    await postJSON('/api/email/send', {
      to: 'customer@example.com',
      subject: 'Your FretPilot order',
      template: 'order-confirmation',
      data: { order }
    })
    return true
  } catch (e) {
    return false
  }
}
