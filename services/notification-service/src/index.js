const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.set('trust proxy', 1);

const port = process.env.PORT || 5005;

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'notification-service',
    twilio_configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
  });
});

/**
 * Generate a WhatsApp click-to-chat link.
 * Works on mobile (opens app) and desktop (opens WhatsApp Web).
 */
app.post('/notify/whatsapp-link', (req, res) => {
  const { phone, laptop_brand, laptop_model, vendor_name, price_pkr } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'phone is required' });
  }

  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  let message = `Hi${vendor_name ? ' ' + vendor_name : ''},`;
  if (laptop_brand && laptop_model) {
    message += ` I'm interested in the ${laptop_brand} ${laptop_model}`;
    if (price_pkr) {
      message += ` listed at Rs. ${Number(price_pkr).toLocaleString()}`;
    }
    message += '. Is it available?';
  } else {
    message += ' I have a question about a laptop.';
  }

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  console.log(`[WA] Generated link for ${cleanPhone} (${laptop_brand || 'general'})`);

  res.json({
    url,
    phone: cleanPhone,
    message,
  });
});

/**
 * Send a WhatsApp message via Twilio (if configured).
 * Falls back to simulation if credentials are missing.
 */
app.post('/notify/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'to and message are required' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.log('[WA] Twilio not configured — returning simulated response');
    return res.json({
      status: 'simulated',
      to,
      message,
      note: 'Twilio credentials missing; message not actually sent.',
    });
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', `whatsapp:${to}`);
    params.append('Body', message);

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      params.toString(),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log(`[WA] Twilio sent SID=${response.data.sid}`);
    res.json({ status: 'sent', sid: response.data.sid });
  } catch (error) {
    console.error('[WA] Twilio error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.use((err, req, res, next) => {
  console.error('[NOTIFY ERROR]', err.message);
  res.status(500).json({ error: 'Internal error' });
});

app.listen(port, () => {
  console.log(`Notification Service running on port ${port}`);
});
