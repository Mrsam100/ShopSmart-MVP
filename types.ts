
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  costPrice: number;
  stock: number;
  category: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  totalSpent: number;
  pendingBalance: number;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discount?: number;
  discountType?: 'fixed' | 'percent';
}

export interface Sale {
  id: string;
  timestamp: number;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  discountType: 'fixed' | 'percent';
  total: number;
  paymentType: 'cash' | 'card' | 'wallet' | 'bank' | 'pending';
  notes?: string;
  customerId?: string;
}

export type AppView = 'landing' | 'pos' | 'inventory' | 'customers' | 'reports' | 'reseller' | 'settings' | 'dashboard' | 'login';

export interface AppSettings {
  language: 'en' | 'ar' | 'hi';
  currency: string;
  darkMode: boolean;
  businessType: string;
  taxRate: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Paper {
  id: string;
  title: string;
  publisher: string;
  authors: string[];
  abstract: string;
  abstractPreview: string;
  publicationDate: string;
  category: string;
  doi: string;
  whyMatters: string;
  upvotes: number;
  timestamp: number;
  aiInsights: string[];
  publisherLogo: string;
  readTime: string;
  description?: string;
  fileUrl?: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}
