const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const RADIX_PREFIX = '@radix-ui/';

const getTsFiles = () =>
  new Promise((resolve, reject) => {
    const find = spawn('find', ['.', '-type', 'f', '-name', '*.ts', '-o', '-name', '*.tsx']);

    let data = '';
    find.stdout.on('data', chunk => data += chunk);
    find.stderr.on('data', err => console.error(`stderr: ${err}`));
    find.on('close', code => {
      if (code === 0) {
        resolve(data.trim().split('\n'));
      } else {
        reject(`find command failed with code ${code}`);
      }
    });
  });

const installPackages = pkgs => {
  if (pkgs.length === 0) return;
  const cmd = `pnpm add ${pkgs.join(' ')}`;
  console.log(`\n📦 Installing missing Radix UI packages:\n> ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ All missing packages installed.\n');
  } catch (err) {
    console.error('❌ Error during installation:', err.message);
  }
};

const checkImports = async () => {
  const radixUsed = new Set();

  try {
    const files = await getTsFiles();
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/from ['"](@radix-ui\/[^'\"]+)['"]/g) || [];
      matches.forEach(match => {
        const clean = match.match(/@radix-ui\/[^'\"]+/)[0];
        radixUsed.add(clean);
      });
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const declared = Object.assign({}, pkg.dependencies, pkg.devDependencies);

    const missing = [...radixUsed].filter(pkg => !declared[pkg]);

    if (missing.length === 0) {
      console.log('✅ All Radix UI imports are declared in package.json');
    } else {
      console.warn('⚠️ Missing Radix UI dependencies found:');
      missing.forEach(pkg => console.log(`  → ${pkg}`));
      installPackages(missing);
    }
  } catch (err) {
    console.error('❌ Error checking imports:', err);
  }
};

checkImports();
