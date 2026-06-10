const fs = require('fs');
const path = require('path');

const ROADMAP_DATA_PATH = path.join(__dirname, '../src/features/roadmap/roadmap-data.json');
const LOCALES_PATH = {
  es: path.join(__dirname, '../src/locales/es.json'),
  en: path.join(__dirname, '../src/locales/en.json')
};

function syncRoadmapLocales() {
  console.log('🔄 Syncing Roadmap translations to locale files...\n');

  // Read roadmap-data.json
  let roadmapData;
  try {
    roadmapData = JSON.parse(fs.readFileSync(ROADMAP_DATA_PATH, 'utf8'));
  } catch (error) {
    console.error(`❌ Error reading roadmap-data.json: ${error.message}`);
    process.exit(1);
  }

  // Filter only versions shown in the app: prev, current, next (exclude old versions)
  const visibleVersions = roadmapData.versions.filter((v) => {
    // Include: current, previous, next versions
    // Exclude: old versions
    return v.isCurrent || v.type === 'previous' || v.isNext;
  });

  console.log(`📋 Found ${visibleVersions.length} visible versions (prev, current, next)`);

  // Extract translations from roadmap data (only visible versions)
  const translations = {
    es: {
      "roadmap.badge.current": "ACTUAL",
      "roadmap.badge.next": "PRÓXIMO",
      "roadmap.badge.previous": "ANTERIOR"
    },
    en: {
      "roadmap.badge.current": "CURRENT",
      "roadmap.badge.next": "NEXT",
      "roadmap.badge.previous": "PREVIOUS"
    }
  };

  visibleVersions.forEach((version) => {
    const id = version.id;
    
    // Process Spanish translations
    if (version.items.es) {
      version.items.es.forEach((item, index) => {
        translations.es[`roadmap.${id}.${index}.summary`] = item.summary;
        translations.es[`roadmap.${id}.${index}.description`] = item.description;
      });
    }

    // Process English translations
    if (version.items.en) {
      version.items.en.forEach((item, index) => {
        translations.en[`roadmap.${id}.${index}.summary`] = item.summary;
        translations.en[`roadmap.${id}.${index}.description`] = item.description;
      });
    }
  });

  // Update each locale file
  Object.keys(LOCALES_PATH).forEach((lang) => {
    const localePath = LOCALES_PATH[lang];
    let localeData;

    try {
      localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    } catch (error) {
      console.error(`❌ Error reading ${lang}.json: ${error.message}`);
      process.exit(1);
    }

    // Add roadmap section (or update existing)
    localeData._comment_roadmap = `Auto-generated from roadmap-data.json - Do not edit manually`;
    
    // Merge roadmap translations (don't overwrite existing keys)
    Object.keys(translations[lang]).forEach((key) => {
      if (!localeData[key]) {
        localeData[key] = translations[lang][key];
      }
    });

    // Write back to file with proper formatting
    const jsonContent = JSON.stringify(localeData, null, 2);
    fs.writeFileSync(localePath, jsonContent, 'utf8');
    
    console.log(`✅ Updated ${lang}.json with ${Object.keys(translations[lang]).length} roadmap translations`);
  });

  console.log('\n✨ Sync complete! Roadmap translations are now available in locale files.');
}

syncRoadmapLocales();
