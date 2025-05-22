const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const getTailwindConfig = () => {
  try {
    const configPath = path.join(process.cwd(), 'tailwind.config.ts');
    return fs.readFileSync(configPath, 'utf8');
  } catch (err) {
    console.error('❌ Error reading tailwind.config.ts:', err.message);
    process.exit(1);
  }
};

const extractPlugins = (config) => {
  const plugins = new Set();
  const matches = config.match(/require\(['"]([^'"]+)['"]\)/g) || [];
  matches.forEach(match => {
    const plugin = match.match(/['"]([^'"]+)['"]/)[1];
    if (plugin.startsWith('tailwindcss-')) {
      plugins.add(plugin);
    }
  });
  return Array.from(plugins);
};

const installPlugins = (plugins) => {
  if (plugins.length === 0) return;
  const cmd = `pnpm add -D ${plugins.join(' ')}`;
  console.log(`\n📦 Installing missing Tailwind plugins:\n> ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ All missing plugins installed.\n');
  } catch (err) {
    console.error('❌ Error during installation:', err.message);
  }
};

const checkPlugins = () => {
  try {
    const config = getTailwindConfig();
    const usedPlugins = extractPlugins(config);
    
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const declared = Object.assign({}, pkg.dependencies, pkg.devDependencies);
    
    const missing = usedPlugins.filter(plugin => !declared[plugin]);
    
    if (missing.length === 0) {
      console.log('✅ All Tailwind plugins are declared in package.json');
    } else {
      console.warn('⚠️ Missing Tailwind plugins found:');
      missing.forEach(plugin => console.log(`  → ${plugin}`));
      installPlugins(missing);
    }
  } catch (err) {
    console.error('❌ Error checking plugins:', err);
  }
};

checkPlugins();
