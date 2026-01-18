// scripts/update-readme.js
const fs = require('fs');
const path = require('path');

// Leer la versión actualizada de package.json
const pkg = require('../package.json');
const version = pkg.version;

// Ruta al README.md
const readmePath = path.join(__dirname, '../README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

// Reemplazar el marcador {{version}} con la versión real
readmeContent = readmeContent.replace(/v`{{version}}`/g, `v\`${version}\``);

// Guardar los cambios
fs.writeFileSync(readmePath, readmeContent);
// console.log('✅ README.md actualizado con la versión:', version);

const changelogPath = path.join(__dirname, '../CHANGELOG.md');
let changelogContent = fs.readFileSync(changelogPath, 'utf8');

changelogContent = changelogContent.replace(
  /## \[Unreleased\]/,
  `## [Unreleased]\n\n## [${version}]`
);

fs.writeFileSync(changelogPath, changelogContent);