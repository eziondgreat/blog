const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/config
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return config if it exists, otherwise return a default configuration object
    const config = data || {
      primaryColor: '#00677f',
      secondaryColor: '#a90097',
      tertiaryColor: '#506600',
      fontFamily: 'Inter',
      ads: {
        sidebarGlobal: true,
        inFeedUnits: true,
        midArticleInjector: true,
        publisherId: 'ca-pub-9876543210987654',
        googleAdSenseEnabled: false,
        sidebarAdSlot: '8877665544',
        inFeedAdSlot: '1122334455',
        midArticleAdSlot: '9988776655'
      },
      accessKey: 'ELIZION_SEC_F97BA2'
    };

    res.status(200).json(config);
  } catch (err) {
    console.error('Fetch system config error:', err);
    res.status(500).json({ error: 'Failed to retrieve system configurations' });
  }
});

// PUT /api/config
router.put('/', requireAdmin, async (req, res) => {
  const { primaryColor, secondaryColor, tertiaryColor, fontFamily, ads, accessKey } = req.body;

  try {
    const { data, error } = await supabase
      .from('system_config')
      .upsert({
        id: 1, // enforce single row
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        tertiary_color: tertiaryColor,
        font_family: fontFamily,
        ads,
        access_key: accessKey,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    // Convert keys to match frontend camelCase representation
    const responseData = {
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      tertiaryColor: data.tertiary_color,
      fontFamily: data.font_family,
      ads: data.ads,
      accessKey: data.access_key
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Update system config error:', err);
    res.status(500).json({ error: 'Failed to update system configurations' });
  }
});

module.exports = router;
