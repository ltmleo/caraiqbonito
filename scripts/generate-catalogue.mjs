import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const DESTINOS_DIR = path.join(ROOT_DIR, 'destinos');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src/data/catalogueData.ts');

function getCategoryInfo(dirPath) {
  const yamlPath = path.join(dirPath, '_category_.yaml');
  if (fs.existsSync(yamlPath)) {
    const content = fs.readFileSync(yamlPath, 'utf-8');
    const labelMatch = content.match(/label:\s*'(.*)'/) || content.match(/label:\s*(.*)/);
    if (labelMatch) {
      const label = labelMatch[1].replace(/['"]/g, '');
      // Improved emoji matching for complex emojis (like flags + variation selectors)
      const emojiMatch = label.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF\u200D\uFE0F]+)\s*(.*)/) || label.match(/^(\p{Emoji_Presentation}|\p{Emoji})\s*(.*)/u);
      
      if (emojiMatch) {
        let icon = emojiMatch[1];
        let name = emojiMatch[2].trim();
        // Clean up common issues
        name = name.replace(/^[^\w\sÀ-ú]/, '').trim(); 
        return { icon, name };
      }
      return { icon: '', name: label };
    }
  }
  return { icon: '', name: path.basename(dirPath) };
}

function getDestinationInfo(destDir, continentSlug, categorySlug) {
  const slug = path.basename(destDir);
  const mdPath = path.join(destDir, `${slug}.md`);
  if (!fs.existsSync(mdPath)) return null;

  const content = fs.readFileSync(mdPath, 'utf-8');
  
  // Parse frontmatter
  const titleMatch = content.match(/title:\s*(.*)/);
  let title = titleMatch ? titleMatch[1].trim() : '';
  
  const statusMatch = content.match(/status:\s*(.*)/);
  const status = statusMatch ? statusMatch[1].trim() : 'novo';

  const countryMatch = content.match(/country:\s*(.*)/);
  let country = countryMatch ? countryMatch[1].trim() : '';

  // Get H1 and flag
  // Regex that matches an emoji (flag or globe etc) at start of H1
  const headerMatch = content.match(/^#\s*([\uD83C-\uDBFF\uDC00-\uDFFF\u200D\uFE0F]+)?\s*(.*)/m) || content.match(/^#\s*(\p{Emoji_Presentation}|\p{Emoji})?\s*(.*)/mu);
  const h1Icon = headerMatch ? headerMatch[1] : '';
  const h1Title = headerMatch ? headerMatch[2].trim() : '';

  if (!title) title = h1Title || slug;
  // Clean title: remove remaining leading emoji components or punctuation
  title = title.replace(/^[^\w\sÀ-ú]/, '').trim();

  // If country not in frontmatter, try to guess from emoji
  if (!country && h1Icon) {
    const flagMap = {
      '🇩🇪': 'Alemanha',
      '🇸🇰': 'Eslováquia',
      '🇭🇺': 'Hungria',
      '🇦🇹': 'Áustria',
      '🇨🇿': 'República Tcheca',
      '🇧🇷': 'Brasil',
      '🇹🇷': 'Turquia',
      '🇦🇷': 'Argentina',
      '🌍': 'Argentina', // El Calafate is in Argentina
    };
    country = flagMap[h1Icon] || '';
  }

  // Find image in content: ![](/img/xxx.png)
  const imgMatch = content.match(/!\[.*\]\((.*)\)/);
  let imagePath = imgMatch ? imgMatch[1] : '';
  
  // Fallback to convention if no image found in MD
  if (!imagePath) {
    const conventionPath = `/img/${slug.replace(/-/g, '_')}_hero.png`;
    if (fs.existsSync(path.join(ROOT_DIR, 'static', conventionPath))) {
      imagePath = conventionPath;
    }
  }

  return {
    name: title,
    country: country || 'Desconhecido',
    image: imagePath,
    link: `/destinos/${continentSlug}/${categorySlug}/${slug}`,
    status: status,
    slug: slug
  };
}

function generate() {
  const continents = fs.readdirSync(DESTINOS_DIR).filter(f => fs.statSync(path.join(DESTINOS_DIR, f)).isDirectory());
  
  const catalogueData = continents.map(continentSlug => {
    const continentPath = path.join(DESTINOS_DIR, continentSlug);
    const { icon, name: continentName } = getCategoryInfo(continentPath);
    
    const categories = fs.readdirSync(continentPath).filter(f => fs.statSync(path.join(continentPath, f)).isDirectory());
    
    const processedCategories = categories.map(categorySlug => {
      const categoryPath = path.join(continentPath, categorySlug);
      const { name: categoryName } = getCategoryInfo(categoryPath);
      
      const destinationDirs = fs.readdirSync(categoryPath).filter(f => fs.statSync(path.join(categoryPath, f)).isDirectory());
      
      const destinations = destinationDirs
        .map(destSlug => getDestinationInfo(path.join(categoryPath, destSlug), continentSlug, categorySlug))
        .filter(Boolean);
        
      return {
        name: categoryName,
        destinations
      };
    }).filter(cat => cat.destinations.length > 0);

    return {
      continent: continentName,
      icon,
      categories: processedCategories
    };
  }).filter(cont => cont.categories.length > 0);

  // Generate the file content
  let imports = '';
  const dataString = JSON.stringify(catalogueData, null, 2);
  
  // We want to handle images as imports for Docusaurus to process them correctly if possible,
  // or just use strings if they are in /static.
  // Given the current setup, using strings with absolute paths (/img/...) is fine if baseUrl is handled.
  // But the current catalogo.tsx uses imports.
  
  // Let's transform the JSON to use imported variables for images
  const imageImports = new Set();
  const transformedData = catalogueData.map(cont => ({
    ...cont,
    categories: cont.categories.map(cat => ({
      ...cat,
      destinations: cat.destinations.map(dest => {
        if (dest.image && dest.image.startsWith('/img/')) {
          const varName = dest.slug.replace(/[^a-zA-Z0-9]/g, '_') + 'Img';
          imageImports.add(`import ${varName} from '@site/static${dest.image}';`);
          return { ...dest, image: `___${varName}___` };
        }
        return dest;
      })
    }))
  }));

  let finalContent = `// Automatically generated file. Do not edit manually.\n`;
  finalContent += Array.from(imageImports).sort().join('\n') + '\n\n';
  finalContent += `export const catalogueData = ${JSON.stringify(transformedData, null, 2).replace(/"___(.*?)___"/g, '$1')};\n`;

  // Create data directory if it doesn't exist
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, finalContent);
  console.log('Catalogue data generated successfully at ' + OUTPUT_FILE);
}

generate();
