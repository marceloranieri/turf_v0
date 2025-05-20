const fs = require('fs');
const path = require('path');

// Make sure directories exist
fs.mkdirSync('components/ui', { recursive: true });

// Copy dialog component
if (fs.existsSync('dialog.tsx')) {
  fs.copyFileSync('dialog.tsx', 'components/ui/dialog.tsx');
  console.log('Dialog component copied to components/ui/dialog.tsx');
}

// Copy label component
if (fs.existsSync('label.tsx')) {
  fs.copyFileSync('label.tsx', 'components/ui/label.tsx');
  console.log('Label component copied to components/ui/label.tsx');
}

// Fix import in edit-profile-dialog.tsx
const editProfilePath = 'components/profile/edit-profile-dialog.tsx';
if (fs.existsSync(editProfilePath)) {
  let content = fs.readFileSync(editProfilePath, 'utf8');
  
  // Try both absolute and relative paths
  content = content.replace(
    /from ['"]@\/components\/ui\/dialog['"]/g, 
    'from "../../components/ui/dialog"'
  );
  
  fs.writeFileSync(editProfilePath, content);
  console.log('Fixed dialog import in edit-profile-dialog.tsx');
}

// Fix import in form.tsx
const formPath = 'components/ui/form.tsx';
if (fs.existsSync(formPath)) {
  let content = fs.readFileSync(formPath, 'utf8');
  
  content = content.replace(
    /from ['"]\.\/label['"]/g, 
    'from "@/components/ui/label"'
  );
  
  fs.writeFileSync(formPath, content);
  console.log('Fixed label import in form.tsx');
}

console.log('Import fixes applied successfully!'); 