const fs = require('fs');

function fixDeadCode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove the entire if (null) block
  const lines = content.split('\n');
  const newLines = [];
  let skipBlock = false;
  let blockDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line starts the problematic if (null) block
    if (line.trim().startsWith('if (null)')) {
      skipBlock = true;
      blockDepth = 1;
      modified = true;
      continue;
    }
    
    if (skipBlock) {
      // Count braces to know when the block ends
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      blockDepth += openBraces - closeBraces;
      
      if (blockDepth <= 0) {
        skipBlock = false;
      }
      continue;
    }
    
    newLines.push(line);
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed dead code: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No dead code found in: ${filePath}`);
    return false;
  }
}

// Fix the setup-bookmarks file
const filePath = './app/api/setup-bookmarks/route.ts';
if (fs.existsSync(filePath)) {
  fixDeadCode(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
