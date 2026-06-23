import { BlogPost, Comment, SystemConfig, HeroSlide } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (tokenRequired = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (tokenRequired) {
    const token = localStorage.getItem('elizion_admin_token') || sessionStorage.getItem('elizion_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  // Authentication
  async login(email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to authenticate');
    }

    const data = await response.json();
    if (data.token) {
      if (rememberMe) {
        localStorage.setItem('elizion_admin_token', data.token);
        localStorage.setItem('elizion_admin_email', data.user.email);
      } else {
        sessionStorage.setItem('elizion_admin_token', data.token);
        sessionStorage.setItem('elizion_admin_email', data.user.email);
      }
    }
    return data;
  },

  logout(): void {
    localStorage.removeItem('elizion_admin_token');
    localStorage.removeItem('elizion_admin_email');
    sessionStorage.removeItem('elizion_admin_token');
    sessionStorage.removeItem('elizion_admin_email');
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('elizion_admin_token') || sessionStorage.getItem('elizion_admin_token'));
  },

  // System Configuration
  async getConfig(): Promise<SystemConfig> {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve system configurations');
    }

    return response.json();
  },

  async saveConfig(config: SystemConfig): Promise<SystemConfig> {
    const response = await fetch(`${API_BASE_URL}/config`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update system configurations');
    }

    return response.json();
  },

  // Blog Posts
  async getPosts(): Promise<BlogPost[]> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: getHeaders(true), // Send auth header optionally so admin can view drafts
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve blog posts');
    }

    return response.json();
  },

  async getPost(idOrSlug: string): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/posts/${idOrSlug}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve blog post');
    }

    return response.json();
  },

  async createPost(post: Omit<BlogPost, 'id' | 'views' | 'adClicks' | 'slug'>): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to create blog post');
    }

    return response.json();
  },

  async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update blog post');
    }

    return response.json();
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to delete blog post');
    }

    return response.json();
  },

  // Hero Slides
  async getSlides(): Promise<HeroSlide[]> {
    const response = await fetch(`${API_BASE_URL}/slides`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve hero slides');
    }

    return response.json();
  },

  async saveSlide(slide: Omit<HeroSlide, 'id'> & { id?: string }): Promise<HeroSlide> {
    const response = await fetch(`${API_BASE_URL}/slides`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(slide),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to save hero slide');
    }

    return response.json();
  },

  async deleteSlide(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/slides/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to delete hero slide');
    }

    return response.json();
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const response = await fetch(`${API_BASE_URL}/comments/posts/${postId}/comments`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve post comments');
    }

    return response.json();
  },

  async postComment(postId: string, author: string, text: string): Promise<Comment> {
    const response = await fetch(`${API_BASE_URL}/comments/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ author, text }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to submit comment');
    }

    return response.json();
  }
};
