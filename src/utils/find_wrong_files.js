const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Le répertoire ${dir} n'existe pas`);
    return fileList;
  }
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith(".md") || file.endsWith(".markdown")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Chemin depuis src/utils/ vers src/data/
const dataPath = path.join(__dirname, "..", "data");
let foundFiles = [];
if (fs.existsSync(dataPath)) {
  foundFiles = findMarkdownFiles(dataPath);
} else {
  console.error(`❌ Le répertoire ${dataPath} n'existe pas`);
  process.exit(1);
}

if (foundFiles.length === 0) {
  console.log(
    "❌ Aucun fichier Markdown trouvé. Vérifiez les chemins de recherche.",
  );
  process.exit(1);
}

console.log(`🔍 Analyse de ${foundFiles.length} fichiers Markdown...\n`);

let problematicFiles = [];
let missingUuidFiles = [];
let invalidUuidFiles = [];

foundFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf8");
    const parsed = matter(content);
    const author = parsed.data.author;
    const uuid = parsed.data.uuid;

    // --- Vérification author ---
    if (author !== undefined && !Array.isArray(author)) {
      problematicFiles.push({
        file,
        authorValue: author,
        type: typeof author,
      });
      console.log(`⚠️  PROBLÈME: ${file}`);
      console.log(
        `   author = ${JSON.stringify(author)} (type: ${typeof author})`,
      );
      console.log("");
    } else if (author === undefined) {
      console.log(`ℹ️  ${file} - pas de champ author`);
    } else {
      console.log(`✓ ${file} - author OK (tableau)`);
    }

    // --- Vérification UUID ---
    if (uuid === undefined || uuid === null || uuid === "") {
      missingUuidFiles.push({ file });
      console.log(`⚠️  UUID MANQUANT: ${file}`);
      console.log("");
    } else if (!UUID_REGEX.test(String(uuid))) {
      invalidUuidFiles.push({ file, uuidValue: uuid });
      console.log(`⚠️  UUID INVALIDE: ${file}`);
      console.log(`   uuid = ${JSON.stringify(uuid)}`);
      console.log("");
    } else {
      console.log(`✓ ${file} - uuid OK (${uuid})`);
    }
  } catch (error) {
    console.error(`❌ ERREUR de parsing dans ${file}:`);
    console.error(`   ${error.message}\n`);
  }
});

console.log("\n" + "=".repeat(60));

// --- Rapport author ---
if (problematicFiles.length > 0) {
  console.log(
    `\n🎯 ${problematicFiles.length} fichier(s) avec "author" non-tableau trouvé(s):\n`,
  );
  problematicFiles.forEach(({ file, authorValue }) => {
    console.log(`  - ${file}`);
    console.log(`    Valeur actuelle: ${JSON.stringify(authorValue)}`);
  });
  console.log("\n💡 Solution: Transformer en tableau, par exemple:");
  console.log('   author: "John Doe"  →  author: ["John Doe"]');
} else {
  console.log('\n✅ Tous les champs "author" sont corrects ou absents.');
}

// --- Rapport UUID ---
console.log("\n" + "=".repeat(60));

if (missingUuidFiles.length > 0) {
  console.log(
    `\n🎯 ${missingUuidFiles.length} fichier(s) sans champ "uuid":\n`,
  );
  missingUuidFiles.forEach(({ file }) => {
    console.log(`  - ${file}`);
  });
  console.log(
    "\n💡 Solution: Ajouter un uuid dans le frontmatter, par exemple:",
  );
  console.log("   uuid: 550e8400-e29b-41d4-a716-446655440000");
} else {
  console.log('\n✅ Tous les fichiers ont un champ "uuid".');
}

if (invalidUuidFiles.length > 0) {
  console.log(
    `\n🎯 ${invalidUuidFiles.length} fichier(s) avec un "uuid" invalide:\n`,
  );
  invalidUuidFiles.forEach(({ file, uuidValue }) => {
    console.log(`  - ${file}`);
    console.log(`    Valeur actuelle: ${JSON.stringify(uuidValue)}`);
  });
  console.log("\n💡 Un UUID valide respecte le format RFC 4122 :");
  console.log("   xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx");
} else if (missingUuidFiles.length === 0) {
  console.log("✅ Tous les UUIDs sont valides.");
}

console.log("=".repeat(60));
