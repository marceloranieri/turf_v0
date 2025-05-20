import { headers } from 'next/headers';

// Development CSP configuration
const devCSP = {
  defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://*.supabase.co",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https://*.supabase.co",
    "https://*.cloudflare.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  connectSrc: [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
  ],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  workerSrc: ["'self'"],
  manifestSrc: ["'self'"],
  prefetchSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
};

// Production CSP configuration
const prodCSP = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "https://*.supabase.co",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "https://fonts.googleapis.com",
  ],
  imgSrc: [
    "'self'",
    "data:", // Required for Next.js
    "https://*.supabase.co",
    "https://*.cloudflare.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  connectSrc: [
    "'self'",
    "https://*.supabase.co",
    "wss://*.supabase.co",
  ],
  frameSrc: ["'none'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  workerSrc: ["'self'"],
  manifestSrc: ["'self'"],
  prefetchSrc: ["'self'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: [],
};

// Additional security headers
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '),
};

// Convert CSP directives to header string
function generateCSPString(directives: Record<string, string[]>) {
  return Object.entries(directives)
    .map(([key, value]) => {
      if (value.length === 0) return key;
      return `${key} ${value.join(' ')}`;
    })
    .join('; ');
}

// Get CSP configuration based on environment
export function getCSPConfig() {
  const isDev = process.env.NODE_ENV === 'development';
  const directives = isDev ? devCSP : prodCSP;
  return generateCSPString(directives);
}

// Helper function to check if a request is from a development environment
export function isDevelopment() {
  try {
    const headersList = headers();
    const host = headersList.get('host') || '';
    return host.includes('localhost') || host.includes('127.0.0.1');
  } catch {
    return process.env.NODE_ENV === 'development';
  }
} 