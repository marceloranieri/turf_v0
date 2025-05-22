const fs = require('fs');

function fixCategoryIndexing(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for the problematic indexing pattern and fix it
  if (content.includes('categoryColors[topic.category]')) {
    // Replace with a safer access pattern
    content = content.replace(
      /categoryColors\[topic\.category\]/g,
      'categoryColors[topic.category as keyof typeof categoryColors]'
    );
    
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

// Fix the topics page
const filePath = './app/topics/[id]/page.tsx';
if (fs.existsSync(filePath)) {
  fixCategoryIndexing(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
