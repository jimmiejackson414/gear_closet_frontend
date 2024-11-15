import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert the current file's URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the fixed directory path
const componentsDir = path.join(__dirname, '..', 'components', 'ui');
const barrelFile = path.join(componentsDir, 'index.ts');

// Function to read the components directory and generate the barrel file
const generateBarrelFile = async () => {
  try {
    const subDirs = await fs.promises.readdir(componentsDir, { withFileTypes: true });
    console.log('Subdirectories in components directory:', subDirs);

    const imports = await Promise.all(
      subDirs
        .filter(dirent => dirent.isDirectory())
        .map(async dirent => {
          const subDirPath = path.join(componentsDir, dirent.name);
          const subDirBarrelFile = path.join(subDirPath, 'index.ts');

          // Check if the subdirectory has a barrel file
          if (fs.existsSync(subDirBarrelFile)) {
            return `export * from './${dirent.name}';`;
          } else {
            console.log(`No barrel file found in ${subDirPath}`);
            return null;
          }
        }),
    );

    const filteredImports = imports.filter(Boolean)
      .join('\n');
    const importCount = filteredImports ? filteredImports.split('\n').length : 0;
    console.log(`Generated ${importCount} imports:`, filteredImports);

    await fs.promises.writeFile(barrelFile, filteredImports);
    console.log('Root barrel file created successfully!');
  } catch (err) {
    console.error('Error generating barrel file:', err);
  }
};

// Run the script
generateBarrelFile();