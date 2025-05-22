#!/bin/bash

echo "🔧 Fixing all TypeScript issues..."

# Fix remaining canvas references in integrations-glow.tsx
sed -i '' '39s/canvas\.width, canvas\.height/(canvas?.width || 0), (canvas?.height || 0)/' components/integrations-glow.tsx
sed -i '' '98s/canvas\.width, canvas\.height/(canvas?.width || 0), (canvas?.height || 0)/' components/integrations-glow.tsx
sed -i '' '107s/canvas\.width \/ 2/(canvas?.width || 0) \/ 2/' components/integrations-glow.tsx
sed -i '' '108s/canvas\.height \/ 2/(canvas?.height || 0) \/ 2/' components/integrations-glow.tsx
sed -i '' '110s/canvas\.width \* 0\.6/(canvas?.width || 0) \* 0.6/' components/integrations-glow.tsx
sed -i '' '117s/canvas\.width, canvas\.height/(canvas?.width || 0), (canvas?.height || 0)/' components/integrations-glow.tsx

# Fix Supabase import issue
sed -i '' 's/@supabase\/auth-helpers-react/@supabase\/supabase-js/' components/notification-bell.tsx

# Also fix any other files that might have the same import issue
find components/ -name "*.tsx" -exec grep -l "@supabase/auth-helpers-react" {} \; | xargs -I {} sed -i '' 's/@supabase\/auth-helpers-react/@supabase\/supabase-js/' {}

echo "✅ All fixes applied!"
echo "🚀 Running build test..."
