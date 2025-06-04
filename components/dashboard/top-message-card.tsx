"use client";

import { motion } from "framer-motion";

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  upvotes: number;
  media_url?: string;
  media_type?: string;
}

interface TopMessageCardProps {
  message: Message;
}

export function TopMessageCard({ message }: TopMessageCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-neutral-800 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 text-xs mb-2 text-muted-foreground">
        <span>{new Date(message.created_at).toLocaleTimeString()}</span>
        <span>@{message.user_id}</span>
      </div>
      <p className="text-sm">{message.content}</p>

      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex -space-x-2">
          {[...Array(4)].map((_, i) => (
            <img key={i} className="w-6 h-6 rounded-full border border-black" src="/avatars/default.png" alt="User" />
          ))}
        </div>
        <span>💬 48</span>
      </div>
    </motion.div>
  );
} 