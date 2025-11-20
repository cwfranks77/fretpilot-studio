// Contact utilities: sanitization + optional email sending
// If SMTP env vars are not fully present, we fall back to file logging only.

const nodemailer = safeRequire('nodemailer')

function safeRequire(mod) {
  try { return require(mod) } catch (_) { return null }
}

function sanitizeField(v) {
  if (typeof v !== 'string') return ''
  // Remove control chars, limit unicode extremes
  return v.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

function haveSMTPEnv() {
  return process.env.CONTACT_SMTP_HOST && process.env.CONTACT_SMTP_PORT && process.env.CONTACT_SMTP_USER && process.env.CONTACT_SMTP_PASS && process.env.CONTACT_TO
}

async function sendContactEmail({ name, email, subject, message, ip, ts }) {
  if (!haveSMTPEnv() || !nodemailer) {
    return { sent: false, mode: 'log_only' }
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.CONTACT_SMTP_HOST,
      port: parseInt(process.env.CONTACT_SMTP_PORT, 10) || 587,
      secure: (process.env.CONTACT_SMTP_SECURE === 'true'),
      auth: {
        user: process.env.CONTACT_SMTP_USER,
        pass: process.env.CONTACT_SMTP_PASS
      }
    })

    const mailInfo = await transporter.sendMail({
      from: `FretPilot Contact <${process.env.CONTACT_SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: `[FretPilot Contact] ${subject}`,
      text: buildPlainText({ name, email, subject, message, ip, ts }),
      html: buildHtml({ name, email, subject, message, ip, ts })
    })
    return { sent: true, id: mailInfo.messageId, mode: 'smtp' }
  } catch (e) {
    console.error('[contact] email send failed', e)
    return { sent: false, error: 'smtp_failed', mode: 'smtp_error' }
  }
}

function buildPlainText({ name, email, subject, message, ip, ts }) {
  return `New contact message\n----------------------\nTime: ${ts}\nIP: ${ip}\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n`;
}

function buildHtml({ name, email, subject, message, ip, ts }) {
  return `<h2>New Contact Message</h2>
  <p><strong>Time:</strong> ${escapeHtml(ts)}<br />
  <strong>IP:</strong> ${escapeHtml(ip)}<br />
  <strong>Name:</strong> ${escapeHtml(name)}<br />
  <strong>Email:</strong> ${escapeHtml(email)}<br />
  <strong>Subject:</strong> ${escapeHtml(subject)}</p>
  <pre style="background:#f4f4f4;padding:12px;border-radius:6px;white-space:pre-wrap;font-family:monospace;">${escapeHtml(message)}</pre>`
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[s]))
}

module.exports = { sendContactEmail, sanitizeField }
