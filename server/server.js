require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend integration
app.use(cors({
  origin: '*', // We can restrict this in production (Render) later
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const configRoutes = require('./routes/config');
const slidesRoutes = require('./routes/slides');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/slides', slidesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Self-Keep-Alive Pinger (Prevents Render spin-down & Supabase pause)
const { supabase } = require('./db');
function startKeepAlive() {
  const externalUrl = process.env.RENDER_EXTERNAL_URL;
  if (!externalUrl) {
    console.log('Keep-alive: RENDER_EXTERNAL_URL not set. Skipping keep-alive pinger (local development).');
    return;
  }

  console.log(`Keep-alive: Initializing pinger for URL: ${externalUrl}`);

  // Ping every 14 minutes (Render free tier spins down after 15 minutes of inactivity)
  const PING_INTERVAL = 14 * 60 * 1000;

  setInterval(async () => {
    try {
      console.log(`[Keep-Alive] Pinging self at ${externalUrl}/api/health...`);
      const response = await fetch(`${externalUrl}/api/health`);
      if (response.ok) {
        console.log(`[Keep-Alive] Self-ping successful.`);
      } else {
        console.warn(`[Keep-Alive] Self-ping returned status: ${response.status}`);
      }

      // Query Supabase to keep it from pausing (requires activity at least once a week)
      console.log(`[Keep-Alive] Pinging Supabase...`);
      const { error } = await supabase.from('system_config').select('id').eq('id', 1).single();
      if (error) {
        console.error(`[Keep-Alive] Supabase ping failed:`, error.message);
      } else {
        console.log(`[Keep-Alive] Supabase ping successful.`);
      }
    } catch (err) {
      console.error(`[Keep-Alive] Error in keep-alive loop:`, err.message || err);
    }
  }, PING_INTERVAL);
}

// Start keep-alive
startKeepAlive();

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
