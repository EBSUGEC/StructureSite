const fs = require('fs')
const path = require('path')

const DIR = './src/data'
const folders = fs.readdirSync(DIR)

const siteConfig = JSON.parse(fs.readFileSync('siteConfig.json', 'utf8'));


let config = {
  siteMetadata: {
    ...siteConfig,
    authors: [
      { id: `IreneGimenez`, name: `Irène Gimenez` },
      { id: `HetaRundgren`, name: `Heta Rundgren` },
      { id: `NassiraHedjerassi`, name: `Nassira Hedjerassi` },
      { id: `CharlotteVampo`, name: `Charlotte Vampo` },
      { id: `SophieAlbert`, name: `Sophie Albert` },
      { id: `CeliaPosta`, name: `Célia Posta` },
      { id: `SarahSagueton`, name: `Sarah Sagueton` },
      { id: `JudithGourmelin`, name: `Judith Gourmelin` },
      { id: `LauraPeaud`, name: `Laura Péaud` },
      { id: `VirginieJulliard`, name: `Virginie Julliard` },
      { id: `ClaireLiseGaillard`, name: `Claire-Lise Gaillard` },
      { id: `RacheleBorghi`, name: `Rachele Borghi` },
      { id: `HannahVictoriaJohnson`, name: `Hannah Victoria Johnson` },
      { id: `IreneGimenezClaireLiseGaillard`, name: `Irene Gimenez & Claire Lise Gaillard` },
      { id: `AnneDebrosse`, name: `Anne Debrosse` },
      { id: `marionverguesclemencedoumengesblancheturck`, name: `Marion Vergues, Clémence Doumenges & Blanche Turck` },
      { id: `JustineAudebrand`, name: `Justine Audebrand` },
      { id: `HetaRundgrenStuartPluenIreneGimenez`, name: `Heta Rundgren, Stuart Pluen & Irène Gimenez` },
      { id: `AdeleHoareau`, name: `Adèle Hoareau` },
      { id: `MathildeCastanie`, name: `Mathilde Castanié` },
      { id: `BlancheTurck`, name: `Blanche Turck` },
      { id: `ChloeButonCamilleCourgeon`, name: `Chloé Buton & Camille Courgeon` },
      { id: `MarieCabadi`, name: `Marie Cabadi` },
      { id: `AnneDebrosse`, name: `Anne Debrosse` },
      { id: `BlanchePlaquevent`, name: `Blanche Plaquevent` },
      { id: `MileneLeGoff`, name: `Milene Le Goff` },
      { id: `AuroreTurbiau`, name: `Aurore Turbiau` },
      { id: `ZoePoliJulietteZanetta`, name: `Zoé Poli & Juliette Zanetta` },
      { id: `VincentBollenot`, name: `Vincent Bollenot` }
    ],
    pages: []
  },
  plugins: [
    "gatsby-plugin-emotion",
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap", {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "src/images/" + siteConfig['logo']
      }
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        footnotes: true,
        plugins: [
          // `gatsby-remark-copy-linked-files`,
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: []
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            // options: {
            //   wrapperStyle: `margin-bottom: 1.0725rem`,
            // },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-autolink-headers`
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    }
    // {
    //   resolve: `gatsby-transformer-csv`,
    // }
  ],
};

console.log(folders)
folders.forEach(folder => {
  if(!folder.startsWith('_') && fs.statSync(path.join(DIR, folder)).isDirectory() && folder !== '.git' && folder !== ".github"){
    config.plugins.push({
      resolve: 'gatsby-source-filesystem', 
      options: {
        name: folder.split('_')[2], 
        path: path.join(DIR, folder)}, 
        // ignore: [`**/*.csv`, '*.csv', '**\\*.csv', '**\\*\.csv', '**\*.csv', path.join(DIR, folder, '2024-02-08_Tutoriel_tableau_Public', 'Fichier_Atelier.csv')]
      })
    config.siteMetadata.pages.push(folder)
  }
})


module.exports = config
