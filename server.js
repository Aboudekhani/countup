import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// In-memory leads storage
const inquiries = [];
const checklistDownloads = [];

// In-memory rate limiting map: ip -> [timestamps]
const ipRequests = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  recent.push(now);
  ipRequests.set(ip, recent);
  return true;
}

// Middleware
app.use(express.json());

// Serve static assets with no-cache for scripts and styles to prevent stale cache
app.use(express.static(__dirname, {
  extensions: ['html', 'htm', 'js', 'css', 'svg', 'png', 'jpg'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Route for Privacy Policy (Loi 25)
app.get(['/confidentialite', '/confidentialite.html', '/privacy', '/privacy.html', '/politique-de-confidentialite'], (req, res) => {
  res.sendFile(path.join(__dirname, 'confidentialite.html'));
});

// Route for Cookie Policy
app.get(['/cookies', '/cookies.html', '/politique-de-cookies'], (req, res) => {
  res.sendFile(path.join(__dirname, 'cookies.html'));
});

// Lead capture API endpoint with anti-spam & Loi 25 consent validation
app.post('/api/contact', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  // 1. Rate limiting
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please try again later or call us directly at (438) 994-9140.'
    });
  }

  const { name, email, service, message, lang, consent, website_url, form_time } = req.body || {};

  // 2. Anti-spam honeypot verification (invisible field filled only by bots)
  if (website_url) {
    console.warn(`[Spam Blocked] Honeypot triggered from ${clientIp}`);
    // Return 200 to not alert the bot script
    return res.status(200).json({ success: true, message: 'Message received' });
  }

  // 3. Fast-submission bot check (< 1200ms between render and submit)
  if (form_time) {
    const elapsed = Date.now() - Number(form_time);
    if (elapsed > 0 && elapsed < 1200) {
      console.warn(`[Spam Blocked] Instant submission (${elapsed}ms) from ${clientIp}`);
      return res.status(200).json({ success: true, message: 'Message received' });
    }
  }

  // 4. Required fields & Law 25 consent verification
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields (name, email, message)'
    });
  }

  if (consent !== true && consent !== 'true' && consent !== 1 && consent !== 'on') {
    return res.status(400).json({
      success: false,
      error: 'Consent is required according to Quebec Law 25.'
    });
  }

  // 5. Basic email syntax check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email address format.'
    });
  }

  const lead = {
    id: `lead_${Date.now()}`,
    timestamp: new Date().toISOString(),
    ip: clientIp,
    name: String(name).slice(0, 150),
    email: String(email).slice(0, 150),
    service: String(service || 'General Inquiry').slice(0, 100),
    message: String(message).slice(0, 2000),
    consent: true,
    lang: lang === 'fr' ? 'fr' : 'en'
  };

  inquiries.unshift(lead);
  console.log(`[Lead Captured] ${lead.timestamp} | ${lead.name} (${lead.email}) | ${lead.service}`);

  return res.status(200).json({
    success: true,
    message: lead.lang === 'fr' 
      ? 'Merci ! Votre message a été reçu avec succès. Notre équipe vous contactera dans les plus brefs délais.' 
      : 'Thank you! Your message has been received successfully. Our team will contact you shortly.',
    id: lead.id
  });
});

// Checklist download tracking API endpoint
app.post('/api/checklist', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ success: false, error: 'Too many requests' });
  }

  const { email, lang, consent, website_url, form_time } = req.body || {};

  if (website_url) {
    return res.status(200).json({ success: true });
  }

  if (form_time && Date.now() - Number(form_time) < 1000) {
    return res.status(200).json({ success: true });
  }

  if (!email || (consent !== true && consent !== 'true')) {
    return res.status(400).json({ success: false, error: 'Email and consent required.' });
  }

  checklistDownloads.unshift({
    email: String(email).slice(0, 150),
    timestamp: new Date().toISOString(),
    lang: lang === 'fr' ? 'fr' : 'en'
  });

  return res.status(200).json({ success: true });
});

// Direct French routes serve the unified template
app.get(['/fr', '/fr/*', '/index-fr.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Root & Fallback to unified index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`CountUp server running on http://${HOST}:${PORT}`);
});
