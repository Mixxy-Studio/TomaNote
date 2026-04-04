// scripts/generate-changelog.js
const fs = require('fs');
const path = require('path');

const ROADMAP_DATA_PATH = path.join(__dirname, '../src/features/roadmap/roadmap-data.json');
const CHANGELOG_PATH = path.join(__dirname, '../CHANGELOG.md');

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function generateChangelog() {
  console.log('📝 Generating CHANGELOG.md from roadmap-data.json...\n');

  // Read roadmap-data.json
  let roadmapData;
  try {
    const data = fs.readFileSync(ROADMAP_DATA_PATH, 'utf8');
    roadmapData = JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading roadmap-data.json: ${error.message}`);
    process.exit(1);
  }

  // Build new changelog from scratch (don't merge with existing)
  let changelog = "# Changelog\n\n";
  changelog += "All notable changes to this project will be documented in this file.\n\n";
  changelog += "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).\n\n";

  // Get current version
  const currentVersion = roadmapData.versions.find((v) => v.isCurrent);

  // Add current version
  if (currentVersion) {
    changelog += `## [${currentVersion.versionNumber}] - ${formatDate(currentVersion.date)}\n\n`;
    
    if (currentVersion.items.en && currentVersion.items.en.length > 0) {
      changelog += "### Added\n";
      currentVersion.items.en.forEach((item) => {
        changelog += `- ${item.description}\n`;
      });
      changelog += "\n";
    }
  }

  // Add previous versions (non-old, exclude current)
  const previousVersions = roadmapData.versions
    .filter((v) => v.type === "previous" && !v.isOld && !v.isCurrent)
    .slice(0, 3);

  previousVersions.forEach((version) => {
    changelog += `## [${version.versionNumber}] - ${formatDate(version.date)}\n\n`;
    
    if (version.items.en && version.items.en.length > 0) {
      changelog += "### Added\n";
      version.items.en.forEach((item) => {
        changelog += `- ${item.description}\n`;
      });
      changelog += "\n";
    }
  });

  // Add old versions - ONE <details> per version
  const oldVersions = roadmapData.versions.filter((v) => v.isOld);
  
  if (oldVersions.length > 0) {
    changelog += "### Previous Versions\n\n";
    
    oldVersions.forEach((version) => {
      changelog += `<details>\n<summary>[${version.versionNumber}] - ${formatDate(version.date)}</summary>\n\n`;
      
      if (version.items.en && version.items.en.length > 0) {
        version.items.en.forEach((item) => {
          changelog += `- ${item.description}\n`;
        });
        changelog += "\n";
      }
      
      changelog += "</details>\n\n";
    });
  }

  // Write CHANGELOG.md (completely replace, no merging with existing)
  fs.writeFileSync(CHANGELOG_PATH, changelog);
  console.log('✅ CHANGELOG.md generated automatically');
}

generateChangelog();
