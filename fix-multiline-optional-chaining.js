const fs = require('fs');

function fixMultilineOptionalChaining(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for the pattern where we have const { ... } = await supabaseAdmin
  // followed by ?.from on the next line(s)
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if current line has "const {" and "await supabaseAdmin" but no "?."
    if (line.includes('const {') && line.includes('await supabaseAdmin') && !line.includes('?.')) {
      // Check if the next few lines contain "?."
      let foundOptionalChaining = false;
      let nextLineIndex = -1;
      
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        if (lines[j].includes('?.')) {
          foundOptionalChaining = true;
          nextLineIndex = j;
          break;
        }
      }
      
      if (foundOptionalChaining) {
        // Get the indentation
        const indent = line.match(/^(\s*)/)[1];
        
        // Add null check before this line
        newLines.push(`${indent}if (!supabaseAdmin) {`);
        newLines.push(`${indent}  return Response.json({ error: 'Database connection failed' }, { status: 500 })`);
        newLines.push(`${indent}}`);
        newLines.push('');
        
        // Add the current line unchanged
        newLines.push(line);
        
        // Process the next lines, removing the optional chaining
        for (let k = i + 1; k <= nextLineIndex; k++) {
          if (k === nextLineIndex) {
            // Remove the ?. from this line
            const fixedLine = lines[k].replace('?.', '.');
            newLines.push(fixedLine);
          } else {
            newLines.push(lines[k]);
          }
        }
        
        // Skip ahead past the lines we just processed
        i = nextLineIndex;
        modified = true;
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    console.log(`✅ Fixed multiline optional chaining: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No multiline optional chaining pattern found in: ${filePath}`);
    return false;
  }
}

// Fix the reset-debate-topic-rotation file
const filePath = './app/api/reset-debate-topic-rotation/route.ts';
if (fs.existsSync(filePath)) {
  fixMultilineOptionalChaining(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
