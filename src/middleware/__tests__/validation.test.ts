import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateRequest, withValidation } from '../validation';

describe('Validation Middleware', () => {
  // Mock NextRequest
  const createMockRequest = (method: string, body?: any, searchParams?: Record<string, string>) => {
    return {
      method,
      json: () => Promise.resolve(body),
      nextUrl: {
        searchParams: new URLSearchParams(searchParams),
        pathname: '/api/test/[id]',
      },
    } as NextRequest;
  };

  describe('validateRequest', () => {
    const testSchema = z.object({
      name: z.string().min(2),
      age: z.number().int().positive(),
    });

    it('should validate request body', async () => {
      const request = createMockRequest('POST', { name: 'John', age: 25 });
      const result = await validateRequest(request, { body: testSchema });

      expect(result.success).toBe(true);
      expect(result.data.body).toEqual({ name: 'John', age: 25 });
    });

    it('should validate query parameters', async () => {
      const request = createMockRequest('GET', undefined, { page: '1', limit: '10' });
      const querySchema = z.object({
        page: z.coerce.number().int().positive(),
        limit: z.coerce.number().int().positive(),
      });
      
      const result = await validateRequest(request, { query: querySchema });

      expect(result.success).toBe(true);
      expect(result.data.query).toEqual({ page: 1, limit: 10 });
    });

    it('should validate URL parameters', async () => {
      const request = createMockRequest('GET');
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });
      
      const result = await validateRequest(request, { params: paramsSchema });

      expect(result.success).toBe(false);
      expect(result.error).toContain('id');
    });

    it('should return validation errors', async () => {
      const request = createMockRequest('POST', { name: 'J', age: -1 });
      const result = await validateRequest(request, { body: testSchema });

      expect(result.success).toBe(false);
      expect(result.error).toContain('name');
      expect(result.error).toContain('age');
    });
  });

  describe('withValidation wrapper', () => {
    const testSchema = z.object({
      name: z.string().min(2),
    });

    it('should pass validated data to handler', async () => {
      const mockHandler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withValidation({ body: testSchema }, mockHandler);
      
      const request = createMockRequest('POST', { name: 'John' });
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, { body: { name: 'John' } });
    });

    it('should return 400 for invalid data', async () => {
      const mockHandler = jest.fn();
      const wrappedHandler = withValidation({ body: testSchema }, mockHandler);
      
      const request = createMockRequest('POST', { name: 'J' });
      const response = await wrappedHandler(request);
      
      expect(response.status).toBe(400);
      expect(mockHandler).not.toHaveBeenCalled();
      
      const data = await response.json();
      expect(data.error).toContain('name');
    });

    it('should handle multiple validation schemas', async () => {
      const bodySchema = z.object({ name: z.string() });
      const querySchema = z.object({ page: z.coerce.number() });
      const paramsSchema = z.object({ id: z.string() });
      
      const mockHandler = jest.fn().mockResolvedValue(new Response('OK'));
      const wrappedHandler = withValidation(
        { body: bodySchema, query: querySchema, params: paramsSchema },
        mockHandler
      );
      
      const request = createMockRequest('POST', { name: 'John' }, { page: '1' });
      await wrappedHandler(request);
      
      expect(mockHandler).toHaveBeenCalledWith(request, {
        body: { name: 'John' },
        query: { page: 1 },
        params: { id: undefined },
      });
    });
  });
}); 