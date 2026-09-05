import fs from 'fs';
import path from 'path';

const distPath = path.resolve(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

try {
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('✓ Successfully generated dist/404.html for GitHub Pages SPA fallback');
  }
} catch (err) {
  console.warn('Warning: Could not copy 404.html:', err);
}
