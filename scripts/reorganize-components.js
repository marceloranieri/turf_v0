const fs = require('fs');
const path = require('path');

// Create new feature-based directories
const featureDirs = [
  'components/auth',
  'components/topics',
  'components/settings',
  'components/debate',
  'components/shared',
  'components/layout',
  'components/ui'
];

// Create directories if they don't exist
featureDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Map of files to move: [source, destination]
const filesToMove = [
  // Auth components
  ['components/login-form.tsx', 'components/auth/login-form.tsx'],
  ['components/register-form.tsx', 'components/auth/register-form.tsx'],
  
  // Settings components
  ['components/email-preferences.tsx', 'components/settings/email-preferences.tsx'],
  ['components/account-settings.tsx', 'components/settings/account-settings.tsx'],
  ['components/preferences-settings.tsx', 'components/settings/preferences-settings.tsx'],
  ['components/settings-view.tsx', 'components/settings/settings-view.tsx'],
  
  // Topic components
  ['components/search-filters.tsx', 'components/topics/topic-filters.tsx'],
  ['components/search-view.tsx', 'components/topics/topic-search-view.tsx'],
  
  // Layout components
  ['components/dashboard-layout.tsx', 'components/layout/dashboard-layout.tsx'],
  ['components/left-sidebar.tsx', 'components/layout/sidebar.tsx'],
];

// Move files to new locations
filesToMove.forEach(([source, destination]) => {
  if (fs.existsSync(source)) {
    // Read the file
    const content = fs.readFileSync(source, 'utf8');
    
    // Update imports to use new structure
    let updatedContent = content
      .replace(/@\/components\/ui\//g, '@components/ui/')
      .replace(/@\/components\//g, '@components/');
    
    // Write to new location
    fs.writeFileSync(destination, updatedContent);
    
    // Create a redirection file at old location
    const redirectContent = `// This file has been moved to ${destination}\nexport * from '${destination.replace('components/', '@components/')}';`;
    fs.writeFileSync(source, redirectContent);
  }
});

console.log('Component reorganization complete'); 