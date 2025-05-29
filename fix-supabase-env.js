const fs = require('fs');
const path = require('path');

const TARGET_DIR = './app/api';
const FRONT_KEYS = {
  'NEXT_PUBLIC_SUPABASE_URL': 'SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'SUPABASE_ANON_KEY',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const [wrong, correct] of Object.entries(FRONT_KEYS)) {
    const regex = new RegExp(`process\\.env\\.${wrong}`, 'g');
    content = content.replace(regex, `process.env.${correct}`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

const files = walk(TARGET_DIR);
files.forEach(fixFile);

console.log('🔍 Scan complete. All env key issues inside /app/api should be fixed.');
