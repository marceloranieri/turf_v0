#!/bin/bash

echo "🧼 Starting UI isolation for MVP rebuild..."

# Step 1: Move cluttered folders
echo "📦 Moving unused folders..."
mv app/dashboard old_ui/app/ 2>/dev/null
mv components/* old_ui/components/ 2>/dev/null
mv lib/ui old_ui/lib/ 2>/dev/null
mv hooks/ui old_ui/hooks/ 2>/dev/null

# Step 2: Keep only these
KEEP_FILES=(
  "app/(auth)/login.tsx"
  "app/(auth)/signup.tsx"
  "app/layout.tsx"
  "lib/auth.ts"
  "middleware.ts"
  ".env.local"
)

echo "✅ Retained auth, Supabase, and AI logic."

# Step 3: Clean broken imports of components
echo "🧹 Cleaning imports referencing '@/components'..."
grep -rl "@/components" app/ | while read file; do
  sed -i '' '/@\/components\//d' "$file"
done

echo "✅ Cleanup complete. Your project is now ready for a clean MVP rebuild." 