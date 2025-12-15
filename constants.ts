
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Paper, JournalArticle } from './types';

export const BRAND_NAME = 'ShopSmart';

export const INDUSTRIES = [
  { name: "Grocery Stores", icon: "🛒", color: "#FFB673" },
  { name: "Pharmacies", icon: "💊", color: "#6A4FBF" },
  { name: "Salons & Barbers", icon: "✂️", color: "#2AB9A9" },
  { name: "Cafés & Bakeries", icon: "☕", color: "#FFD447" },
  { name: "Tailors & Fashion", icon: "🧵", color: "#E6007A" },
  { name: "Mobile Repair", icon: "📱", color: "#2775CA" },
  { name: "Fruit Stalls", icon: "🍎", color: "#14F195" },
  { name: "Mini-Marts", icon: "🏪", color: "#8247E5" }
];

export const FEATURES = [
  { 
    title: "Quick Sales", 
    desc: "Record a sale in seconds. Large buttons, tap-to-add, instant checkout.",
    icon: "⚡",
    color: "#FFB673"
  },
  { 
    title: "Offline Ready", 
    desc: "No internet? No problem. Record everything and sync when you're back online.",
    icon: "📡",
    color: "#6A4FBF"
  },
  { 
    title: "Simple Stock", 
    desc: "Manage your items easily. Get alerts when you're running low.",
    icon: "📦",
    color: "#2AB9A9"
  },
  { 
    title: "Fast Reports", 
    desc: "See how much you earned today, this week, or this month at a glance.",
    icon: "📊",
    color: "#FFD447"
  }
];

export const INITIAL_PRODUCTS = [
  { id: 'p1', sku: '8901001', name: 'Fresh Milk 1L', price: 2.50, costPrice: 1.80, stock: 50, category: 'Grocery', status: 'active' },
  { id: 'p2', sku: '8901002', name: 'Whole Wheat Bread', price: 1.20, costPrice: 0.80, stock: 8, category: 'Bakery', status: 'active' },
  { id: 'p3', sku: '8901003', name: 'Eggs (Dozen)', price: 3.80, costPrice: 2.50, stock: 15, category: 'Grocery', status: 'active' },
  { id: 'p4', sku: '8901004', name: 'Coffee Powder 200g', price: 5.50, costPrice: 4.00, stock: 5, category: 'Grocery', status: 'active' }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'j-1',
    title: 'Modern Retail Resilience',
    date: 'January 15, 2025',
    excerpt: 'Exploring how neighborhood shops adapt to digital trends.',
    content: 'An analysis of local commerce patterns in the age of digital transformation...'
  },
  {
    id: 'j-2',
    title: 'Offline-First Architectures',
    date: 'January 10, 2025',
    excerpt: 'Why local data storage is critical for business continuity.',
    content: 'Technical insights into building resilient retail applications...'
  }
];

export const PAPERS: Paper[] = [
  {
    id: 'p-safe-1',
    title: 'Digital Safety Foundations',
    publisher: 'Schroeder Tech',
    authors: ['Archival Team'],
    abstract: 'An introductory guide to internet security for young learners.',
    abstractPreview: 'Understand basic safety protocols and digital footprints.',
    publicationDate: '2025',
    category: 'Safety',
    doi: 'https://schroeder.tech/safety-foundations',
    whyMatters: 'Essential for navigating the modern web securely.',
    upvotes: 42,
    timestamp: Date.now(),
    aiInsights: ['Privacy', 'Ethics'],
    publisherLogo: 'S',
    readTime: '10 min'
  }
];

export const GLOSSARY: Record<string, string> = {
  'AI': 'Artificial Intelligence: systems that emulate human intelligence.',
  'POS': 'Point of Sale: the physical or digital location where transactions happen.',
  'VAT': 'Value Added Tax: a consumption tax on goods and services.'
};

export const getPublisherInfo = (publisher: string) => {
  return {
    color: '#6A4FBF',
    logo: publisher.charAt(0).toUpperCase()
  };
};
