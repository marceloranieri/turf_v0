const fs = require('fs');
const { execSync } = require('child_process');

// Fix Dialog import in edit-profile-dialog.tsx
const editProfilePath = 'components/profile/edit-profile-dialog.tsx';
if (fs.existsSync(editProfilePath)) {
  let content = fs.readFileSync(editProfilePath, 'utf8');
  content = content.replace(
    /from ['"]@\/components\/ui\/dialog['"]/g, 
    'from "@/components/ui/dialog"'
  );
  fs.writeFileSync(editProfilePath, content);
  console.log('Fixed dialog import in edit-profile-dialog.tsx');
}

// Fix Label import in form.tsx
const formPath = 'components/ui/form.tsx';
if (fs.existsSync(formPath)) {
  let content = fs.readFileSync(formPath, 'utf8');
  content = content.replace(
    /from ['"]@\/components\/ui\/label['"]/g, 
    'from "./label"'
  );
  fs.writeFileSync(formPath, content);
  console.log('Fixed label import in form.tsx');
}

// Install recharts
console.log('Installing recharts...');
execSync('pnpm add recharts', { stdio: 'inherit' });

console.log('Path fixes applied successfully!'); 