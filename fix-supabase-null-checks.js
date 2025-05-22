const fs = require('fs');

function addSupabaseNullCheck(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for lines with "await supabaseAdmin" that don't have null checks
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line has "await supabaseAdmin"
    if (line.includes('await supabaseAdmin') && line.includes('const {')) {
      // Check if there's already a null check in the previous few lines
      let hasNullCheck = false;
      for (let j = Math.max(0, i - 5); j < i; j++) {
        if (lines[j].includes('!supabaseAdmin') || lines[j].includes('supabaseAdmin === null')) {
          hasNullCheck = true;
          break;
        }
      }
      
      if (!hasNullCheck) {
        // Get the indentation of the current line
        const indent = line.match(/^(\s*)/)[1];
        
        // Add null check before this line
        newLines.push(`${indent}if (!supabaseAdmin) {`);
        newLines.push(`${indent}  return Response.json({ error: 'Database connection failed' }, { status: 500 })`);
        newLines.push(`${indent}}`);
        newLines.push('');
        modified = true;
      }
    }
    
    newLines.push(line);
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

// Fix the topics file
const filePath = './app/api/topics/[id]/route.ts';
if (fs.existsSync(filePath)) {
  addSupabaseNullCheck(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
