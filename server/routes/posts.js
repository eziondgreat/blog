const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const { requireAdmin } = require('../middleware/auth');

// Helper to generate unique slugs
const generateUniqueSlug = async (title, excludeId = null) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric/non-space/non-hyphen characters
    .trim()
    .replace(/[-\s]+/g, '-'); // collapse spaces/hyphens to a single hyphen

  if (!baseSlug) baseSlug = 'post';

  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    let query = supabase.from('posts').select('id').eq('slug', slug);
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    const { data, error } = await query;
    
    if (data && data.length > 0) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      exists = false;
    }
  }
  return slug;
};

// Map DB row to Frontend BlogPost schema
const mapPostToFrontend = (post) => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  content: post.content,
  status: post.status,
  category: post.category,
  audience: post.audience,
  tags: post.tags,
  author: post.author,
  date: post.date,
  readTime: post.read_time,
  views: post.views,
  adClicks: post.ad_clicks,
  image: post.image,
  seoTitle: post.seo_title,
  seoDescription: post.seo_description,
  canonicalUrl: post.canonical_url
});

// GET /api/posts - Get all posts (or only published for guests)
router.get('/', async (req, res) => {
  // Check if admin is authenticated (optional check for reading unpublished drafts)
  const authHeader = req.headers.authorization;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) isAdmin = true;
    } catch (e) {
      // Ignore token errors and treat as guest
    }
  }

  try {
    let query = supabase.from('posts').select('*');
    
    if (!isAdmin) {
      // Guests only see published posts
      query = query.eq('status', 'Published');
    }

    // Default order by created_at desc (or date)
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data.map(mapPostToFrontend));
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/posts/:idOrSlug - Get a single post by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;

  try {
    // Check if UUID format
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idOrSlug);
    let query = supabase.from('posts').select('*');

    if (isUuid) {
      query = query.eq('id', idOrSlug);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      throw error;
    }

    res.status(200).json(mapPostToFrontend(data));
  } catch (err) {
    console.error('Fetch single post error:', err);
    res.status(500).json({ error: 'Failed to retrieve blog post' });
  }
});

// POST /api/posts - Create new post (Admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { title, content, status, category, audience, tags, author, date, readTime, image, seoTitle, seoDescription, canonicalUrl } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required fields' });
  }

  try {
    const slug = await generateUniqueSlug(title);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content,
        status: status || 'Draft',
        category: category || 'General',
        audience: audience || 'PRO',
        tags: tags || [],
        author: author || 'Admin',
        date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        read_time: readTime || '5 min read',
        image,
        seo_title: seoTitle,
        seo_description: seoDescription,
        canonical_url: canonicalUrl
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(mapPostToFrontend(data));
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PUT /api/posts/:id - Update existing post (Admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content, status, category, audience, tags, author, date, readTime, image, seoTitle, seoDescription, canonicalUrl, views, adClicks } = req.body;

  try {
    // Generate new slug if title has changed
    let updates = {
      content,
      status,
      category,
      audience,
      tags,
      author,
      date,
      read_time: readTime,
      image,
      seo_title: seoTitle,
      seo_description: seoDescription,
      canonical_url: canonicalUrl,
      views,
      ad_clicks: adClicks,
      updated_at: new Date().toISOString()
    };

    if (title) {
      updates.title = title;
      // Fetch current post to see if title changed
      const { data: currentPost } = await supabase.from('posts').select('title, slug').eq('id', id).single();
      if (currentPost && currentPost.title !== title) {
        updates.slug = await generateUniqueSlug(title, id);
      }
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(mapPostToFrontend(data));
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE /api/posts/:id - Delete post (Admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

module.exports = router;
