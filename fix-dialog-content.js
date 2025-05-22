const fs = require('fs');

function fixDialogContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove className prop from DialogContent component
  content = content.replace(
    /<DialogContent\s+className="[^"]*">/g,
    '<DialogContent>'
  );

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed DialogContent props: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No DialogContent props issue found in: ${filePath}`);
    return false;
  }
}

// Fix the create-topic-form component
const filePath = './components/create-topic-form.tsx';
if (fs.existsSync(filePath)) {
  fixDialogContent(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
