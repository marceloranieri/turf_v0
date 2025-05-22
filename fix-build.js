const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Add "use client" directive to files that need it
const clientComponentPaths = [
  'components/topics/topic-analytics.tsx',
  'components/topics/user-analytics.tsx', // Adding this one proactively
];

clientComponentPaths.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('"use client"')) {
      content = '"use client"\n\n' + content;
      fs.writeFileSync(filePath, content);
      console.log(`Added "use client" to ${filePath}`);
    }
  }
});

// Fix import paths
const fixImportPaths = (filePath, oldPath, newPath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(oldPath)) {
      content = content.replace(new RegExp(oldPath, 'g'), newPath);
      fs.writeFileSync(filePath, content);
      console.log(`Fixed import path in ${filePath}: ${oldPath} -> ${newPath}`);
    }
  }
};

fixImportPaths('components/settings/settings-view.tsx', './ui/use-toast', '@/components/ui/use-toast');
fixImportPaths('components/settings/settings-view.tsx', './ui/button', '@/components/ui/button');

// Install missing dependencies
console.log('Installing missing dependencies...');
execSync('pnpm add next-themes @radix-ui/react-dialog @radix-ui/react-toast class-variance-authority', { stdio: 'inherit' });

// Install missing shadcn components
console.log('Installing missing shadcn components...');
execSync('npx shadcn@latest add dialog', { stdio: 'inherit' });
execSync('npx shadcn@latest add toast', { stdio: 'inherit' });

console.log('Build fixes applied successfully!'); 