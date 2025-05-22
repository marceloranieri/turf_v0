# Security Features

This document outlines the security features implemented in the application.

## Rate Limiting

The application implements an in-memory rate limiting system to prevent abuse and brute force attacks. Different rate limits are applied based on the route type:

- **Authentication Routes** (`/api/auth/*`): 5 requests per minute
- **Protected Routes** (`/api/*`): 20 requests per minute
- **Public Routes** (`/api/public/*`): 60 requests per minute

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Time when the rate limit resets

When a rate limit is exceeded, the API returns a 429 status code with a `Retry-After` header.

### Usage

```typescript
import { withRateLimit } from '@/lib/rate-limit';

export const GET = withRateLimit(async (request) => {
  // Your route handler
});
```

## Input Validation

All API routes use Zod schemas for input validation. The validation middleware checks:
- Request body
- Query parameters
- URL parameters

### Usage

```typescript
import { withValidation } from '@/middleware/validation';
import { userSettingsSchema } from '@/lib/validations/api';

export const PATCH = withValidation(
  { body: userSettingsSchema },
  async (request, data) => {
    // Your route handler
    // data.body contains validated request body
  }
);
```

## Testing Security Features

### Rate Limiting Tests

```bash
# Test public route (60 requests per minute)
for i in {1..65}; do
  curl -i "http://localhost:3000/api/topics?page=1&limit=10"
  sleep 1
done

# Test authenticated route (20 requests per minute)
for i in {1..25}; do
  curl -i -H "Authorization: Bearer YOUR_TOKEN" "http://localhost:3000/api/user/settings"
  sleep 1
done
```

### Validation Tests

```bash
# Test invalid pagination
curl -i "http://localhost:3000/api/topics?page=0&limit=200"

# Test invalid user settings
curl -i -X PATCH -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"theme":"invalid"}' \
  "http://localhost:3000/api/user/settings"
```

## Implementation Details

### Rate Limiting

The rate limiting system uses an in-memory store to track requests. Each request is identified by a combination of IP address and route path. The system automatically cleans up old entries to prevent memory leaks.

### Validation

The validation system uses Zod schemas to define the expected shape of request data. The middleware automatically validates incoming requests and returns detailed error messages for invalid data.

## Best Practices

1. Always use rate limiting and validation for API routes
2. Keep rate limits reasonable for your use case
3. Use specific validation schemas for each route
4. Monitor rate limit headers in production
5. Consider implementing IP-based blocking for repeated violations

## Future Improvements

1. Add Redis-based rate limiting for distributed systems
2. Implement IP-based blocking for repeated violations
3. Add rate limit monitoring and logging
4. Create a dashboard for viewing rate limit statistics 