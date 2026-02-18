const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Le répertoire ${dir} n'existe pas`);
    return fileList;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') || file.endsWith('.markdown')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Chemin depuis src/utils/ vers src/data/
const dataPath = path.join(__dirname, '..', 'data');

let foundFiles = [];
if (fs.existsSync(dataPath)) {
  foundFiles = findMarkdownFiles(dataPath);
} else {
  console.error(`❌ Le répertoire ${dataPath} n'existe pas`);
  process.exit(1);
}

if (foundFiles.length === 0) {
  console.log('❌ Aucun fichier Markdown trouvé. Vérifiez les chemins de recherche.');
  process.exit(1);
}

console.log(`🔍 Analyse de ${foundFiles.length} fichiers Markdown...\n`);

let problematicFiles = [];

foundFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const parsed = matter(content);
    const author = parsed.data.author;
    
    // Vérifier si author existe et n'est pas un tableau
    if (author !== undefined && !Array.isArray(author)) {
      problematicFiles.push({
        file,
        authorValue: author,
        type: typeof author
      });
      console.log(`⚠️  PROBLÈME: ${file}`);
      console.log(`   author = ${JSON.stringify(author)} (type: ${typeof author})`);
      console.log('');
    } else if (author === undefined) {
      console.log(`ℹ️  ${file} - pas de champ author`);
    } else {
      console.log(`✓ ${file} - author OK (tableau)`);
    }
  } catch (error) {
    console.error(`❌ ERREUR de parsing dans ${file}:`);
    console.error(`   ${error.message}\n`);
  }
});

console.log('\n' + '='.repeat(60));
if (problematicFiles.length > 0) {
  console.log(`\n🎯 ${problematicFiles.length} fichier(s) avec "author" non-tableau trouvé(s):\n`);
  problematicFiles.forEach(({ file, authorValue }) => {
    console.log(`  - ${file}`);
    console.log(`    Valeur actuelle: ${JSON.stringify(authorValue)}`);
  });
  console.log('\n💡 Solution: Transformer en tableau, par exemple:');
  console.log('   author: "John Doe"  →  author: ["John Doe"]');
} else {
  console.log('\n✅ Tous les champs "author" sont corrects ou absents.');
}
console.log('='.repeat(60));