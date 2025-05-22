const fs = require('fs');

function fixDialogTrigger(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove asChild prop from DialogTrigger component
  content = content.replace(
    /<DialogTrigger\s+asChild>/g,
    '<DialogTrigger>'
  );

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed DialogTrigger props: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No DialogTrigger props issue found in: ${filePath}`);
    return false;
  }
}

// Fix the create-topic-form component
const filePath = './components/create-topic-form.tsx';
if (fs.existsSync(filePath)) {
  fixDialogTrigger(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
