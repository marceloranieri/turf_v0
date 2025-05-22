const fs = require('fs');

function fixImportExtensions(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Look for import/export statements with .tsx or .ts extensions and remove them
  if (content.includes('.tsx') || content.includes('.ts')) {
    // Remove .tsx extensions from import/export paths
    content = content.replace(/from\s+['"]([^'"]+)\.tsx['"]/g, "from '$1'");
    content = content.replace(/from\s+['"]([^'"]+)\.ts['"]/g, "from '$1'");
    
    // Also handle export * from statements
    content = content.replace(/export\s+\*\s+from\s+['"]([^'"]+)\.tsx['"]/g, "export * from '$1'");
    content = content.replace(/export\s+\*\s+from\s+['"]([^'"]+)\.ts['"]/g, "export * from '$1'");
    
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed import extensions: ${filePath}`);
    return true;
  } else {
    console.log(`❌ No import extension issues found in: ${filePath}`);
    return false;
  }
}

// Fix the account-settings component
const filePath = './components/account-settings.tsx';
if (fs.existsSync(filePath)) {
  fixImportExtensions(filePath);
} else {
  console.log(`❌ File not found: ${filePath}`);
}
