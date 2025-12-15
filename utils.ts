/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Utility functions for data validation and sanitization
 */

// Generate cryptographically secure unique IDs
export const generateSecureId = (): string => {
  // Use crypto API for better randomness
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`;
};

// Sanitize string inputs to prevent XSS
export const sanitizeString = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .substring(0, 1000); // Limit length
};

// Validate and sanitize number inputs
export const sanitizeNumber = (value: number | string, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
};

// Validate phone number format
export const sanitizePhone = (phone: string): string => {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '').substring(0, 15);
};

// Validate and parse localStorage data
export const safeParseJSON = <T>(jsonString: string | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    return parsed !== null && parsed !== undefined ? parsed : defaultValue;
  } catch (error) {
    console.error('Failed to parse JSON from localStorage:', error);
    return defaultValue;
  }
};

// Validate discount (0-100 for percent, 0-subtotal for fixed)
export const validateDiscount = (value: number, type: 'fixed' | 'percent', subtotal: number): number => {
  const sanitized = sanitizeNumber(value, 0);
  if (type === 'percent') {
    return Math.min(100, sanitized);
  } else {
    return Math.min(subtotal, sanitized);
  }
};

// Validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB. Please upload a smaller image.' };
  }

  return { valid: true };
};

// Validate stock availability
export const validateStockAvailability = (requestedQty: number, availableStock: number): { available: boolean; maxQty: number } => {
  const sanitizedQty = Math.floor(sanitizeNumber(requestedQty, 0));
  return {
    available: sanitizedQty <= availableStock,
    maxQty: availableStock
  };
};

// Escape HTML to prevent XSS
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
