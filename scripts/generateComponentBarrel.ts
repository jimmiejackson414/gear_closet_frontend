import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert the current file's URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the fixed directory path
const componentsDir = path.join(__dirname, '..', 'components', 'ui');

/**
 * Ensures each UI subdirectory has an index.ts barrel.
 * A root `components/ui/index.ts` is intentionally NOT generated:
 * shadcn-nuxt scans that folder and treats every entry as a component
 * directory, which breaks on a root barrel file (ENOTDIR).
 */
const generateBarrelFile = async () => {
  try {
    const subDirs = await fs.promises.readdir(componentsDir, { withFileTypes: true });
    console.log('Subdirectories in components directory:', subDirs);

    const missing: string[] = [];
    for (const dirent of subDirs) {
      if (!dirent.isDirectory()) continue;
      const subDirBarrelFile = path.join(componentsDir, dirent.name, 'index.ts');
      if (!fs.existsSync(subDirBarrelFile)) {
        missing.push(dirent.name);
        console.log(`No barrel file found in ${path.join(componentsDir, dirent.name)}`);
      }
    }

    if (missing.length) {
      console.log(`Missing barrels in: ${missing.join(', ')}`);
    } else {
      console.log('All UI subdirectories have barrel files.');
    }
  } catch (err) {
    console.error('Error checking barrel files:', err);
  }
};

// Run the script
generateBarrelFile();
