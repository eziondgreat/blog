const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/comments/posts/:postId/comments - Get approved comments for a specific post
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Fetch post comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments/posts/:postId/comments - Create a new comment (Public)
router.post('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  const { author, text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    // Generate a default avatar if none provided (similar to frontend ReaderView.tsx)
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author: author || '@ANONYMOUS_WRITER',
        avatar: randomAvatar,
        time: 'Just now', // frontend parses this or uses default
        text: text.trim(),
        approved: true // Default to approved
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Post comment error:', err);
    res.status(500).json({ error: 'Failed to submit comment' });
  }
});

// GET /api/comments - Get all comments for moderation (Admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    // We join the posts table to fetch the post title
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        post:posts (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten response structure so post_title is easily accessible on frontend
    const mapped = data.map(cmt => ({
      id: cmt.id,
      postId: cmt.post_id,
      postTitle: cmt.post ? cmt.post.title : 'Deleted Post',
      author: cmt.author,
      avatar: cmt.avatar,
      time: cmt.time,
      text: cmt.text,
      approved: cmt.approved,
      createdAt: cmt.created_at
    }));

    res.status(200).json(mapped);
  } catch (err) {
    console.error('Fetch all comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments for moderation' });
  }
});

// PUT /api/comments/:id/approve - Approve a comment (Admin only)
router.put('/:id/approve', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, comment: data });
  } catch (err) {
    console.error('Approve comment error:', err);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});

// DELETE /api/comments/:id - Delete/reject a comment (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
