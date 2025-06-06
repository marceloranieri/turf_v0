#!/bin/bash

echo "🧹 Moving old pages to dump/..."

mkdir -p dump/app dump/components

# Pages to retain
keep_dirs=("dashboard" "(auth)" "api")

# Move non-core app pages
for d in app/*; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  if [[ ! " ${keep_dirs[@]} " =~ " ${name} " ]]; then
    git mv "app/$name" dump/app/ 2>/dev/null || echo "⚠️ Skipped $name"
  fi
done

# Move unused components
git mv components/* dump/components/ 2>/dev/null || echo "⚠️ Skipping existing"

# Remove broken layout
rm -f components/dashboard-layout.tsx

git add .
git commit -m "chore: cleanup legacy UI for MVP rebuild"
echo "✅ Cleanup done." 