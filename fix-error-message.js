const fs = require('fs');

function fixErrorMessage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for the problematic error.message usage and fix it
  if (content.includes('error.message')) {
    // Replace error.message with a safe string since we're using placeholder error
    content = content.replace(
      /error\.message/g,
      'String(error)'
    );
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed error.message: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No error.message found in: ${filePath}`);
    return false;
  }
}

// Fix the setup-notifications file
const filePath = './app/api/setup-notifications/route.ts';
if (fs.existsSync(filePath)) {
  fixErrorMessage(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
