export async function sendContact(data) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (e) {
    return { ok: false, error: 'network_error' }
  }
}
