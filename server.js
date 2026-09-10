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


// Lead capture API endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, service, message, lang } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields (name, email, message)'
    });
  }

  const lead = {
    id: `lead_${Date.now()}`,
    timestamp: new Date().toISOString(),
    name: String(name).slice(0, 150),
    email: String(email).slice(0, 150),
    service: String(service || 'General Inquiry').slice(0, 100),
    message: String(message).slice(0, 2000),
    lang: lang === 'fr' ? 'fr' : 'en'
  };

  inquiries.unshift(lead);
  console.log(`[Lead Captured] ${lead.timestamp} | ${lead.name} (${lead.email}) | ${lead.service}`);

  return res.status(200).json({
    success: true,
    message: lead.lang === 'fr' 
      ? 'Merci ! Votre message a été reçu avec succès.' 
      : 'Thank you! Your inquiry has been received successfully.',
    id: lead.id
  });
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
