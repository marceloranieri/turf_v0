const fs = require('fs');

function fixCategoryIndexing(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace the specific pattern in DailyDebateTopics
  content = content.replace(
    /categoryColors\[dailyTopic\.topic\.category\]/g,
    'categoryColors[dailyTopic.topic.category as keyof typeof categoryColors]'
  );

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed category indexing: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No category indexing issue found in: ${filePath}`);
    return false;
  }
}

// Fix the DailyDebateTopics component
const filePath = './components/DailyDebateTopics.tsx';
if (fs.existsSync(filePath)) {
  fixCategoryIndexing(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
