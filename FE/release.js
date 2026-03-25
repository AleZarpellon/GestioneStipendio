const { execSync } = require('child_process');

const version = require('./package.json').version;

try {
  console.log('Version:', version);

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "release ${version}"`, { stdio: 'inherit' });
  execSync(`git tag v${version}`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${version}`, { stdio: 'inherit' });

  console.log('✅ Release completata:', version);
} catch (e) {
  console.error('❌ Errore durante la release:', e.message);
  process.exit(1);
}
