const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all Radix UI packages from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const installedRadixPackages = Object.keys(packageJson.dependencies)
  .filter(dep => dep.startsWith('@radix-ui/'));

// Get all imports from the codebase
const findImports = () => {
  const imports = new Set();
  const codeFiles = execSync('find . -type f -name "*.tsx" -o -name "*.ts"')
    .toString()
    .split('\n')
    .filter(Boolean);

  codeFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/from ['"]@radix-ui\/[^'"]+['"]/g) || [];
    matches.forEach(match => {
      const importPath = match.match(/['"]([^'"]+)['"]/)[1];
      imports.add(importPath);
    });
  });

  return Array.from(imports);
};

// Compare installed vs used packages
const usedRadixPackages = findImports();
const missingPackages = usedRadixPackages.filter(pkg => !installedRadixPackages.includes(pkg));

console.log('\n📦 Radix UI Package Check\n');
console.log('Installed packages:', installedRadixPackages.length);
console.log('Used packages:', usedRadixPackages.length);

if (missingPackages.length > 0) {
  console.log('\n❌ Missing packages:');
  missingPackages.forEach(pkg => console.log(`  - ${pkg}`));
  console.log('\nTo install missing packages, run:');
  console.log(`pnpm add ${missingPackages.join(' ')}`);
} else {
  console.log('\n✅ All used Radix UI packages are installed!');
}

// Check for unused packages
const unusedPackages = installedRadixPackages.filter(pkg => !usedRadixPackages.includes(pkg));
if (unusedPackages.length > 0) {
  console.log('\n⚠️  Potentially unused packages:');
  unusedPackages.forEach(pkg => console.log(`  - ${pkg}`));
} 