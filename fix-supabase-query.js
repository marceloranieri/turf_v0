const fs = require('fs');

function fixSupabaseQuery(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for the problematic .query() usage and replace with a placeholder
  if (content.includes('supabaseAdmin.query(')) {
    // Replace .query( with a placeholder comment
    content = content.replace(
      /(await\s+supabaseAdmin)\.query\(\s*`[^`]*`\s*\)/gs,
      '// Note: Raw SQL execution removed - this should be handled through migrations\n    // Table creation should be done via Supabase dashboard'
    );
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed supabaseAdmin.query(): ${filePath}`);
    return true;
  } else {
    console.log(`❌ No supabaseAdmin.query() found in: ${filePath}`);
    return false;
  }
}

// Fix the setup file
const filePath = './app/api/setup/route.ts';
if (fs.existsSync(filePath)) {
  fixSupabaseQuery(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
