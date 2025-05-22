const fs = require('fs');

function fixUndefinedVariable(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for references to triggerError and fix them
  if (content.includes('triggerError')) {
    // Replace triggerError with null since we're using placeholders
    content = content.replace(/triggerError/g, 'null');
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed undefined variable: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No undefined variable found in: ${filePath}`);
    return false;
  }
}

// Fix the setup-bookmarks file
const filePath = './app/api/setup-bookmarks/route.ts';
if (fs.existsSync(filePath)) {
  fixUndefinedVariable(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
