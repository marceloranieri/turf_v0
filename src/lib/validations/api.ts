import { z } from 'zod';

// Common schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(30),
});

// User settings schemas
export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// Topic schemas
export const createTopicSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(5000),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
});

export const updateTopicSchema = createTopicSchema.partial();

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional(),
});

export const updateCommentSchema = createCommentSchema.partial();

// Like/Bookmark schemas
export const likeSchema = z.object({
  targetId: z.string().uuid(),
  targetType: z.enum(['topic', 'comment']),
});

export const bookmarkSchema = z.object({
  targetId: z.string().uuid(),
  targetType: z.enum(['topic']),
});

// Notification schemas
export const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  inApp: z.boolean(),
});

// Admin schemas
export const adminActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'delete']),
  reason: z.string().optional(),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  parentId: z.string().uuid().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Achievement schemas
export const createAchievementSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200),
  points: z.number().int().min(0),
  icon: z.string(),
  requirements: z.record(z.any()),
});

// Analytics schemas
export const analyticsQuerySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  metrics: z.array(z.string()),
  groupBy: z.string().optional(),
});

// Export types
export type UserSettings = z.infer<typeof userSettingsSchema>;
export type CreateTopic = z.infer<typeof createTopicSchema>;
export type UpdateTopic = z.infer<typeof updateTopicSchema>;
export type TopicQuery = z.infer<typeof topicQuerySchema>;
export type CreateComment = z.infer<typeof createCommentSchema>;
export type UpdateComment = z.infer<typeof updateCommentSchema>;
export type Like = z.infer<typeof likeSchema>;
export type Bookmark = z.infer<typeof bookmarkSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type AdminCreateTopic = z.infer<typeof adminCreateTopicSchema>;
export type AdminUpdateTopic = z.infer<typeof adminUpdateTopicSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type CreateAchievement = z.infer<typeof createAchievementSchema>;
export type UpdateAchievement = z.infer<typeof updateAchievementSchema>;
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

// Validation middleware
export async function validateRequest<T extends z.ZodType>(
  schema: T,
  request: Request
): Promise<{ success: true; data: z.infer<T> } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const data = await schema.parseAsync(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    return { success: false, error: 'Invalid request' };
  }
}

// Helper to create validated route handler
export function withValidation<T extends z.ZodType>(
  schema: T,
  handler: (request: Request, data: z.infer<T>) => Promise<Response>
) {
  return async function validatedHandler(request: Request) {
    const result = await validateRequest(schema, request);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return handler(request, result.data);
  };
} 