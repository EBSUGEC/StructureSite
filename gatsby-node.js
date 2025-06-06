const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)
const fs = require('fs')
const csv = require('csv-parser');
const { result } = require('lodash');
// const thesaurus = require(`./src/data/thesaurus.json`)
const dict_prettyNames = {};

// ON ENRICHIE LES NODES MARKDOWN AVEC DES FIELDS
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  
  if (node.internal.type === `MarkdownRemark`) {
    
    const slug = createFilePath({ node, getNode }).replace('/', '')
    
    createNodeField({
      node: node,
      name: `slug`,
      value: slug,
    })
    
    const date = slug.split('_')[0]

    // on ne créé la date que si elle est présente dans le slug
    if(date.match(/\d{4}-\d{2}-\d{2}/)){
      createNodeField({
        node: node,
        name: `date`,
        value: date,
      })
    }

    const parent = getNode(node.parent)
    const collection = parent.sourceInstanceName

    createNodeField({
      node: node,
      name: `collection`,
      value: collection,
    })

    const files = fs.readdirSync(path.dirname(node.fileAbsolutePath)).filter(el => el !== 'index.md')
    const images = files.filter(el => el.endsWith('.png') || el.endsWith('.jpeg') || el.endsWith('.jpg') || el.endsWith('.webp'))
    // const sounds = files.filter(el => el.endsWith('.mp3') || el.endsWith('.wav') || el.endsWith('.ogg'))
    
    createNodeField({
      node: node,
      name: "image",
      value: images[0] ?? null
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  ////////////////////////////////////////////////////////////////////////////////
  // BLOG POSTS
  ////////////////////////////////////////////////////////////////////////////////

  const result = await graphql(
    `
      {
        site {
          siteMetadata {
            pages
          }
        }
        allMarkdownRemark(sort: {fields: {date: DESC}}, limit: 999) {
          edges {
            node {
              fields {
                slug
                date
                collection
              }
              frontmatter {
                title
                uuid
                prettyName
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create all main pages except Accueil
  const pagesToCreate = result.data.site.siteMetadata.pages

  pagesToCreate.forEach(page => {
    const [_, template, pageName] = page.split('_')

    createPage({
      path: `/${pageName}/`,
      component: path.resolve(`./src/templates/${template}.jsx`),
      context: {
        pageName: pageName
      },
    })
  })

  // Create all pages with the same template, this might change later if we want to do markdown pages with specifics templates

  result.data.allMarkdownRemark.edges.forEach((edge, index) => {
    const fields = edge.node.fields;
    const uuid = edge.node.frontmatter.uuid;
    const prettyName = edge.node.frontmatter.prettyName;

    if(fields.slug === ""){
      return
    }

    createPage({
      path: `/${uuid}`,
      component: path.resolve(`./src/templates/blog-post.jsx`),
      context: {
        slug: fields.slug,
        // previous,
        // next,
      },
    })
    if (prettyName) {
      if (prettyName in dict_prettyNames) {
        throw Error(`Pretty name ${prettyName} already exists, clash between ${dict_prettyNames[prettyName]} and ${uuid}`);
        }
      dict_prettyNames[prettyName] = uuid
      createPage({
          path: `/${prettyName}`,
          component: path.resolve(`./src/templates/blog-post.jsx`),
          context: {
              slug: fields.slug,
              // previous,
              // next,
          },
      })
      createPage({
          path: `/${prettyName}/`.toLowerCase(),
          component: path.resolve(`./src/templates/blog-post.jsx`),
          context: {
              slug: fields.slug,
              // previous,
              // next,
          },
      })

    }
  })
}





// définir le schéma graphql pour éviter les erreurs de champs manquants
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: MarkdownRemarkFields
    }
    type MarkdownRemarkFields {
      slug: String,
      date: Date @dateformat
      collection: String
    }
    type Frontmatter {
      tags: [String!]
      sound: String
      author: [String!],
      title: String!
      event: Boolean,
      uuid: String!,
      prettyName: String
    }
  `
  createTypes(typeDefs)
}
