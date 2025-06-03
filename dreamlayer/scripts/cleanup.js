const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

// Clean build artifacts
const foldersToClean = ['.next', 'node_modules/.cache', 'dist'];

foldersToClean.forEach(folder => {
  try {
    deleteFolderRecursive(folder);
    console.log(`✅ Cleaned ${folder}`);
  } catch (error) {
    console.log(`⚠️  Could not clean ${folder}: ${error.message}`);
  }
});

console.log('🧹 Cleanup complete!');
