import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DESTINOS_DIR = path.join(ROOT_DIR, 'destinos');
const COMPARE_DATA_PATH = path.join(ROOT_DIR, 'src/components/CompareTable/data.json');

// Helper to slugify strings
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Clean attraction name for comparison matching
function cleanForMatch(name) {
  return name
    .split('(')[0]
    .split('—')[0]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Robust heading parser
function parseHeading(headingLine) {
  const cleanLine = headingLine.replace(/^##\s*/, '').trim();
  
  // Regex to match emoji at the start if present
  const emojiRegex = /^([\uD83C-\uDBFF\uDC00-\uDFFF\u200D\uFE0F\u2000-\u3300]+)\s*(.*)/;
  const match = cleanLine.match(emojiRegex);
  
  let emoji = '';
  let title = cleanLine;
  if (match) {
    emoji = match[1];
    title = match[2].trim();
  }
  
  // Clean title from ** or other formatting
  title = title.replace(/\*\*/g, '').trim();
  
  return { emoji, title };
}

// Get the first plain text block to use as preview
function getPreviewBlock(content) {
  const blocks = content.split(/\n\s*\n/);
  for (let block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('<AttractionInfo')) continue;
    if (trimmed.startsWith('![')) continue;
    if (trimmed.startsWith('📸') || trimmed.startsWith('[📸') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) continue;
    if (trimmed.startsWith('---')) continue;
    return trimmed;
  }
  return '';
}

// Split file by H2 headings
function splitSections(fileContent) {
  const lines = fileContent.split('\n');
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        headingLine: line,
        contentLines: []
      };
    } else {
      if (currentSection) {
        currentSection.contentLines.push(line);
      } else {
        if (sections.length === 0) {
          sections.push({
            isHeader: true,
            contentLines: [line]
          });
        } else {
          sections[0].contentLines.push(line);
        }
      }
    }
  }
  if (currentSection) {
    sections.push(currentSection);
  }
  return sections;
}

// Recursively find directories containing must-to-see or nice-to-see files
function findDestinationDirs(dir, list = []) {
  const files = fs.readdirSync(dir);
  let hasGuide = false;
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findDestinationDirs(fullPath, list);
    } else if (file === 'must-to-see.md' || file === 'nice-to-see.md') {
      hasGuide = true;
    }
  }
  if (hasGuide && !list.includes(dir)) {
    list.push(dir);
  }
  return list;
}

function processDestinations() {
  const destDirs = findDestinationDirs(DESTINOS_DIR);
  console.log(`Found ${destDirs.length} destination directories to process.`);

  // Load CompareTable data if it exists
  let compareData = null;
  if (fs.existsSync(COMPARE_DATA_PATH)) {
    try {
      compareData = JSON.parse(fs.readFileSync(COMPARE_DATA_PATH, 'utf-8'));
      console.log('Loaded CompareTable data.');
    } catch (err) {
      console.error('Error loading CompareTable data:', err);
    }
  }

  for (let destDir of destDirs) {
    const citySlug = path.basename(destDir);
    
    // Determine the Docusaurus URL path prefix for this destination
    // e.g. /destinos/europa/central/berlim
    const relativeToDocs = path.relative(DESTINOS_DIR, destDir).replace(/\\/g, '/');
    const routePrefix = `/destinos/${relativeToDocs}`;

    const atracoesDir = path.join(destDir, 'atracoes');
    if (!fs.existsSync(atracoesDir)) {
      fs.mkdirSync(atracoesDir);
    }

    const filesToProcess = ['must-to-see.md', 'nice-to-see.md'];

    for (let filename of filesToProcess) {
      const filePath = path.join(destDir, filename);
      if (!fs.existsSync(filePath)) continue;

      console.log(`Processing file: ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const sections = splitSections(content);

      const isMustToSee = filename === 'must-to-see.md';
      const parentLabel = isMustToSee ? 'Imperdíveis' : 'Vale a Visita';
      
      let newFileContent = '';

      for (let section of sections) {
        if (section.isHeader) {
          newFileContent += section.contentLines.join('\n');
          continue;
        }

        const { emoji, title } = parseHeading(section.headingLine);
        const sectionContent = section.contentLines.join('\n');
        
        // Find if there's an AttractionInfo component
        const infoMatch = sectionContent.match(/<AttractionInfo\s+[^>]*\/>/);
        const attractionInfoTag = infoMatch ? infoMatch[0] : '';

        // Generate slug and file path for attraction page
        const attractionSlug = slugify(title.split('(')[0]);
        const attractionFilePath = path.join(atracoesDir, `${attractionSlug}.md`);

        // Get clean H1 title
        const cleanTitle = title;
        const pageTitle = emoji ? `${emoji} ${cleanTitle}` : cleanTitle;

        // Generate the child attraction page content
        const backLink = isMustToSee ? '../must-to-see.md' : '../nice-to-see.md';
        
        const childPageContent = `---
title: ${cleanTitle}
sidebar_label: ${emoji ? emoji + ' ' : ''}${cleanTitle.split('(')[0].trim()}
---

# ${pageTitle}

${attractionInfoTag ? attractionInfoTag + '\n\n' : ''}${sectionContent.replace(/<AttractionInfo\s+[^>]*\/>/, '').trim()}

---

[← Voltar para ${parentLabel}](${backLink})
`;

        fs.writeFileSync(attractionFilePath, childPageContent, 'utf-8');
        console.log(`  -> Created attraction page: ${attractionFilePath}`);

        // Match with CompareTable data to link it
        if (compareData) {
          // Find matching city in data.json
          // CompareTable key is usually matching the citySlug (e.g. "istanbul", "berlin", "prague")
          // Let's normalize city slugs for lookup
          const dataCityKey = Object.keys(compareData).find(k => {
            const cleanK = k.toLowerCase().replace(/[^a-z]/g, '');
            const cleanCity = citySlug.toLowerCase().replace(/[^a-z]/g, '');
            return cleanK === cleanCity || cleanK.includes(cleanCity) || cleanCity.includes(cleanK);
          });

          if (dataCityKey) {
            const cityAttractions = compareData[dataCityKey].attractions;
            const matchedAttr = cityAttractions.find(attr => {
              const hClean = cleanForMatch(cleanTitle);
              const aClean = cleanForMatch(attr.name);
              return hClean === aClean || hClean.includes(aClean) || aClean.includes(hClean);
            });

            if (matchedAttr) {
              matchedAttr.link = `${routePrefix}/atracoes/${attractionSlug}`;
              console.log(`    Mapped CompareTable attraction: "${matchedAttr.name}" -> ${matchedAttr.link}`);
            }
          }
        }

        // Get preview and rewrite the section in the original list
        const preview = getPreviewBlock(sectionContent);
        
        // Find existing image inside sectionContent to keep a visual thumbnail in the main list
        const imgMatch = sectionContent.match(/!\[.*\]\((.*)\)/);
        const imageMarkdown = imgMatch ? imgMatch[0] : '';

        let updatedSectionContent = `\n## ${section.headingLine.replace(/^##\s*/, '')}\n\n`;
        if (attractionInfoTag) {
          updatedSectionContent += `${attractionInfoTag}\n\n`;
        }
        if (imageMarkdown) {
          updatedSectionContent += `${imageMarkdown}\n\n`;
        }
        if (preview) {
          updatedSectionContent += `${preview}\n\n`;
        }
        updatedSectionContent += `[👉 Ver detalhes, história e informações completas de ${cleanTitle.split('(')[0].trim()}](./atracoes/${attractionSlug}.md)\n\n---\n`;

        newFileContent += updatedSectionContent;
      }

      // Write updated list back to file
      // Remove trailing double divider at the very end of file if any
      const cleanedNewContent = newFileContent.replace(/---\n\s*---\n*$/, '---\n');
      fs.writeFileSync(filePath, cleanedNewContent, 'utf-8');
      console.log(`Updated original file: ${filePath}`);
    }
  }

  // Save updated CompareTable data
  if (compareData) {
    fs.writeFileSync(COMPARE_DATA_PATH, JSON.stringify(compareData, null, 2), 'utf-8');
    console.log('Saved updated CompareTable data to data.json');
  }
}

processDestinations();
