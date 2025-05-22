const fs = require('fs');

function fixDialogProps(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove open and onOpenChange props from Dialog component
  content = content.replace(
    /<Dialog\s+open=\{[^}]+\}\s+onOpenChange=\{[^}]+\}>/g,
    '<Dialog>'
  );

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Dialog props: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No Dialog props issue found in: ${filePath}`);
    return false;
  }
}

// Fix the create-topic-form component
const filePath = './components/create-topic-form.tsx';
if (fs.existsSync(filePath)) {
  fixDialogProps(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
