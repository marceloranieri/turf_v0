// /lib/moderation.ts
// Simple moderation placeholder for MVP

interface ModerationResult {
  safe: boolean;
  reason?: string;
}

export async function checkContent(content: string): Promise<ModerationResult> {
  if (!content || content.trim().length === 0) {
    return { safe: false, reason: "Empty message" };
  }

  if (content.length > 5000) {
    return { safe: false, reason: "Message too long" };
  }

  const badWords = ['spam', 'scam']; // Expand as needed
  const hasProf = badWords.some(word =>
    content.toLowerCase().includes(word.toLowerCase())
  );

  if (hasProf) {
    return { safe: false, reason: "Inappropriate content" };
  }

  return { safe: true };
}

// Optional placeholder utilities
export function filterProfanity(text: string): string {
  return text;
}

export function detectSpam(message: string): boolean {
  return false;
}

// Legacy function support
export function moderateMessage(message: string) {
  return { approved: true, message };
}

export function validateMessage(message: string) {
  return { valid: true };
}

export function sanitizeContent(content: string) {
  return content;
} 