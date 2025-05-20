import { NextRequest } from 'next/server';
import { rateLimit, withRateLimit, rateLimitConfigs } from '../rate-limit';

describe('Rate Limiting', () => {
  // Mock NextRequest
  const createMockRequest = (path: string, ip: string = '127.0.0.1') => {
    return {
      ip,
      nextUrl: { pathname: path },
    } as NextRequest;
  };

  beforeEach(() => {
    // Clear the rate limit store before each test
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rateLimit middleware', () => {
    it('should allow requests within rate limit', async () => {
      const request = createMockRequest('/api/topics');
      const response = await rateLimit(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Limit')).toBe(rateLimitConfigs.public.max.toString());
      expect(response.headers.get('X-RateLimit-Remaining')).toBe((rateLimitConfigs.public.max - 1).toString());
    });

    it('should block requests exceeding rate limit', async () => {
      const request = createMockRequest('/api/auth/login');
      const maxRequests = rateLimitConfigs.auth.max;

      // Make requests up to the limit
      for (let i = 0; i < maxRequests; i++) {
        await rateLimit(request);
      }

      // Make one more request that should be blocked
      const response = await rateLimit(request);
      
      expect(response.status).toBe(429);
      expect(response.headers.get('Retry-After')).toBeDefined();
    });

    it('should reset rate limit after window expires', async () => {
      const request = createMockRequest('/api/topics');
      
      // Make some requests
      for (let i = 0; i < 5; i++) {
        await rateLimit(request);
      }

      // Advance time past the window
      jest.advanceTimersByTime(rateLimitConfigs.public.windowMs + 1000);

      // Make another request
      const response = await rateLimit(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('X-RateLimit-Remaining')).toBe((rateLimitConfigs.public.max - 1).toString());
    });

    it('should apply different limits for different route types', async () => {
      const authRequest = createMockRequest('/api/auth/login');
      const publicRequest = createMockRequest('/api/topics');
      const protectedRequest = createMockRequest('/api/user/settings');

      // Make requests up to the limit for each type
      for (let i = 0; i < rateLimitConfigs.auth.max; i++) {
        await rateLimit(authRequest);
      }
      for (let i = 0; i < rateLimitConfigs.public.max; i++) {
        await rateLimit(publicRequest);
      }
      for (let i = 0; i < rateLimitConfigs.authenticated.max; i++) {
        await rateLimit(protectedRequest);
      }

      // Verify each type is blocked appropriately
      const authResponse = await rateLimit(authRequest);
      const publicResponse = await rateLimit(publicRequest);
      const protectedResponse = await rateLimit(protectedRequest);

      expect(authResponse.status).toBe(429);
      expect(publicResponse.status).toBe(429);
      expect(protectedResponse.status).toBe(429);
    });
  });

  describe('withRateLimit wrapper', () => {
    it('should pass through to handler when not rate limited', async () => {
      const mockHandler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withRateLimit(mockHandler);
      
      const request = createMockRequest('/api/topics');
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should block handler when rate limited', async () => {
      const mockHandler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withRateLimit(mockHandler);
      
      const request = createMockRequest('/api/auth/login');
      
      // Exceed rate limit
      for (let i = 0; i < rateLimitConfigs.auth.max; i++) {
        await wrappedHandler(request);
      }
      
      const response = await wrappedHandler(request);
      
      expect(response.status).toBe(429);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
}); 