/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  category: string;
  audience: 'EXEC' | 'PRO' | 'STUDENT';
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  views: number;
  adClicks: number;
  image: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
}

export interface SystemConfig {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  fontFamily: 'Inter' | 'JetBrains Mono' | 'Literata';
  ads: {
    sidebarGlobal: boolean;
    inFeedUnits: boolean;
    midArticleInjector: boolean;
    publisherId: string;
    googleAdSenseEnabled: boolean;
    sidebarAdSlot: string;
    inFeedAdSlot: string;
    midArticleAdSlot: string;
  };
  accessKey: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  headline: string;
  highlightWord: string;
  description: string;
  buttonText: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  linkPostId: string;
}

export type AdminTab = 'dashboard' | 'analytics' | 'content' | 'audience' | 'settings';
