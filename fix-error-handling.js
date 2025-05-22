const fs = require('fs');

function fixErrorHandling(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace err.message with proper error handling
  content = content.replace(
    /setError\(err\.message\)/g,
    'setError(err instanceof Error ? err.message : String(err))'
  );

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed error handling: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No error handling issue found in: ${filePath}`);
    return false;
  }
}

// Fix the DailyDebateTopics component
const filePath = './components/DailyDebateTopics.tsx';
if (fs.existsSync(filePath)) {
  fixErrorHandling(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
