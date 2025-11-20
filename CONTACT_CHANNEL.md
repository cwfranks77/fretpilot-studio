# FretPilot Contact / Open Door Channel

This feature gives testers and future customers a direct line to reach you inside the app.

## Overview
- Frontend component: `src/components/ContactOpenDoor.vue`
- Service helper: `src/services/contactService.js`
- Backend endpoint: `POST /api/contact`
- Logging file (always): `server/logs/contact.log` (auto-created)
- Optional email delivery (SMTP): controlled by environment variables.

If SMTP is not configured the message is still accepted and appended to the log file; response includes `{"ok": true, delivered: false, mode: "log_only"}`.

## Request Body
```jsonc
{
  "name": "Your Name",          // required, <=80 chars
  "email": "you@example.com",   // required, valid format, <=120 chars
  "subject": "(optional) short subject", // <=120 chars
  "message": "Detailed message text",    // required, 5..5000 chars
  "_hp": ""                     // honeypot must remain empty
}
```

## Anti-Abuse Measures
- Honeypot `_hp` field (hidden in UI) -> if filled returns `bot_detected`.
- Rate limiting: max 8 messages / 10 minutes / IP (`429 rate_limited`).
- Length caps on all fields.
- Basic email regex and minimum length for message.

## Environment Variables (optional for email)
Add / update `.env` at the project root:
```
CONTACT_SMTP_HOST=smtp.example.com
CONTACT_SMTP_PORT=587
CONTACT_SMTP_SECURE=false      # set true if using port 465 / SSL
CONTACT_SMTP_USER=apikey-or-user
CONTACT_SMTP_PASS=supersecret
CONTACT_TO=support@fretpilotstudio.com
```
Restart the server after editing `.env`.

## Response Examples
Success with SMTP configured:
```json
{ "ok": true, "delivered": true, "mode": "smtp" }
```
Success without SMTP:
```json
{ "ok": true, "delivered": false, "mode": "log_only" }
```
Validation error:
```json
{ "ok": false, "error": "invalid_email" }
```
Rate limited:
```json
{ "ok": false, "error": "rate_limited" }
```

## Manual Testing (PowerShell)
```powershell
# Basic success
Invoke-RestMethod -Method Post -Uri http://localhost:5175/api/contact -ContentType 'application/json' -Body '{"name":"Tester","email":"tester@example.com","subject":"Hi","message":"Loving the app!"}'

# Honeypot trigger
Invoke-RestMethod -Method Post -Uri http://localhost:5175/api/contact -ContentType 'application/json' -Body '{"name":"Bot","email":"bot@example.com","message":"spam","_hp":"filled"}'
```

## Log File Rotation Suggestion
For production, consider an external process or use a logging library with rotation (e.g. `pino` + `pino-rotate`). Current implementation appends JSON lines.

## Security Notes
- Input is sanitized (control chars stripped) and length limited before logging / email.
- HTML email uses escaped content to prevent injection.
- No persistence beyond flat file unless you add DB storage.

## Future Enhancements
- Add optional reCAPTCHA / hCaptcha.
- Integrate with helpdesk (Freshdesk, Zendesk) or Discord webhook.
- UI message history for user.

---
Maintained with an open-door policy ❤️
