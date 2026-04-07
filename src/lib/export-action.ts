'use server';

import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

/**
 * Server action to gather all project files and zip them up.
 * Returns a base64 string of the zip file.
 */
export async function downloadProjectZip() {
  const zip = new JSZip();
  const rootDir = process.cwd();

  // Recursive function to add files to JSZip instance
  function addFilesToZip(currentDir: string, zipFolder: JSZip) {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip build artifacts and dependency folders
        if (
          file === 'node_modules' || 
          file === '.next' || 
          file === '.git' || 
          file === '.idx' || 
          file === '.agents' ||
          file === 'out'
        ) {
          continue;
        }
        const newFolder = zipFolder.folder(file);
        if (newFolder) addFilesToZip(fullPath, newFolder);
      } else {
        // Read file as buffer and add to zip
        const content = fs.readFileSync(fullPath);
        zipFolder.file(file, content);
      }
    }
  }

  try {
    addFilesToZip(rootDir, zip);
    const base64 = await zip.generateAsync({ 
      type: 'base64',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    return base64;
  } catch (error) {
    console.error('Failed to generate project zip:', error);
    throw new Error('Project zipping failed.');
  }
}
