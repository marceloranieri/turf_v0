const fs = require('fs');

function fixOptionalChaining(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Split into lines for easier processing
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for the problematic pattern: const { ... } = await supabaseAdmin?.
    if (line.includes('const {') && line.includes('await supabaseAdmin?.')) {
      // Get the indentation
      const indent = line.match(/^(\s*)/)[1];
      
      // Add null check before this line
      newLines.push(`${indent}if (!supabaseAdmin) {`);
      newLines.push(`${indent}  return Response.json({ error: 'Database connection failed' }, { status: 500 })`);
      newLines.push(`${indent}}`);
      newLines.push('');
      
      // Remove the optional chaining (?.) from the original line
      const fixedLine = line.replace('supabaseAdmin?.', 'supabaseAdmin.');
      newLines.push(fixedLine);
      modified = true;
    } else {
      newLines.push(line);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed optional chaining: ${filePath}`);
    return true;
  }
  return false;
}

// Fix the specific file
const filePath = './app/api/generate-daily-debate-topics/route.ts';
if (fs.existsSync(filePath)) {
  fixOptionalChaining(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
