const fs = require('fs');

function fixToastDescription(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Split into lines and process
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line contains a description property in a toast call
    if (line.trim().startsWith('description:')) {
      // Skip this line entirely (remove the description property)
      modified = true;
      continue;
    }
    
    newLines.push(line);
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed toast description: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No toast description found in: ${filePath}`);
    return false;
  }
}

// Fix the create-topic-form component
const filePath = './components/create-topic-form.tsx';
if (fs.existsSync(filePath)) {
  fixToastDescription(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
