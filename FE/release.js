const { execSync } = require('child_process');

const version = require('./package.json').version;

try {
  console.log('Version:', version);

  // Forza l'aggiunta di TUTTE le modifiche nella monorepo (BE + FE)
  execSync('git add -A', { stdio: 'inherit' });

  execSync(`git commit -m "release ${version}: FE and BE updates"`, { stdio: 'inherit' });
  execSync(`git tag v${version}`, { stdio: 'inherit' });

  // Invio al server
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${version}`, { stdio: 'inherit' });

  console.log('✅ Release globale completata:', version);
} catch (e) {
  console.error('❌ Errore durante la release:', e.message);
  process.exit(1);
}
