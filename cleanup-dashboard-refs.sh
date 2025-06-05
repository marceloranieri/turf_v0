#!/bin/bash

echo "🧼 Cleaning up all leftover imports from right-sidebar and fixing layout refs..."

# Ensure clean git state
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Please commit or stash your changes first."
  exit 1
fi

# Remove orphaned components (right-sidebar legacy)
FILES=(
  "components/right-sidebar.tsx"
  "components/right-sidebar/RightSidebar.tsx"
  "components/right-sidebar/Tabs.tsx"
  "components/right-sidebar/Trending.tsx"
  "components/right-sidebar/SuggestedUsers.tsx"
  "components/right-sidebar/Leaderboard.tsx"
  "components/right-sidebar/Radar.tsx"
  "components/right-sidebar/MobileMenu.tsx"
  "components/right-sidebar/index.ts"
  "components/right-sidebar/index.tsx"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    git rm "$f"
    echo "🗑️  Removed $f"
  fi
done

# Remove empty folder
[ -d "components/right-sidebar" ] && rmdir components/right-sidebar && echo "🧹 Folder cleaned"

# Clean lingering imports from project files
FILES_TO_CLEAN=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \))

for FILE in $FILES_TO_CLEAN; do
  sed -i '' '/RightSidebar/d' "$FILE"
  sed -i '' '/SidebarTabs/d' "$FILE"
  sed -i '' '/SuggestedUsers/d' "$FILE"
  sed -i '' '/Trending/d' "$FILE"
  sed -i '' '/Radar/d' "$FILE"
  sed -i '' '/Leaderboard/d' "$FILE"
done

# Fix incorrect export usage
sed -i '' 's/import { DashboardLayout }/import DashboardLayout/' ./app/**/*.tsx

# Final commit
git commit -am "Fix: cleaned up dashboard layout + removed unused sidebar components and imports"
echo "✅ All cleanup done. Ready to push." 