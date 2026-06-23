const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/slides
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map DB underscore fields to frontend camelCase fields
    const mapped = data.map(slide => ({
      id: slide.id,
      badge: slide.badge,
      headline: slide.headline,
      highlightWord: slide.highlight_word,
      description: slide.description,
      buttonText: slide.button_text,
      gradientFrom: slide.gradient_from,
      gradientVia: slide.gradient_via,
      gradientTo: slide.gradient_to,
      linkPostId: slide.link_post_id
    }));

    res.status(200).json(mapped);
  } catch (err) {
    console.error('Fetch slides error:', err);
    res.status(500).json({ error: 'Failed to fetch hero slides' });
  }
});

// POST /api/slides
router.post('/', requireAdmin, async (req, res) => {
  const { id, badge, headline, highlightWord, description, buttonText, gradientFrom, gradientVia, gradientTo, linkPostId } = req.body;

  try {
    const payload = {
      badge,
      headline,
      highlight_word: highlightWord,
      description,
      button_text: buttonText,
      gradient_from: gradientFrom,
      gradient_via: gradientVia,
      gradient_to: gradientTo,
      link_post_id: linkPostId
    };

    if (id) {
      payload.id = id;
    }

    const { data, error } = await supabase
      .from('slides')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    const saved = {
      id: data.id,
      badge: data.badge,
      headline: data.headline,
      highlightWord: data.highlight_word,
      description: data.description,
      buttonText: data.button_text,
      gradientFrom: data.gradient_from,
      gradientVia: data.gradient_via,
      gradientTo: data.gradient_to,
      linkPostId: data.link_post_id
    };

    res.status(200).json(saved);
  } catch (err) {
    console.error('Save slide error:', err);
    res.status(500).json({ error: 'Failed to save hero slide' });
  }
});

// DELETE /api/slides/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Hero slide deleted successfully' });
  } catch (err) {
    console.error('Delete slide error:', err);
    res.status(500).json({ error: 'Failed to delete hero slide' });
  }
});

module.exports = router;
