import { graphql } from "gatsby"
import * as React from 'react'
import Layout from '../components/layout'
import { LongCard } from "../components/longcard"
import { filterNodes } from "../helpers"
import "../style/accueil.css"
import "../style/long-cards.css"

const CardsLayout = ({ data }) => {
    const nodes = data.allMarkdownRemark.nodes
    return (
        <Layout nodes={nodes}>
            {/* petite astuce pour passer une fonction qui rend le composant actuel au layout pour que le layout puisse passer les paramètres nécessaires au filtrage*/}
            {(toggleTag, tags, search) => {
                const filtered = filterNodes(nodes, search, tags);
                const description = nodes.filter(node => node.fields.slug === "")[0]
                return (
                    <div>
                        {
                            description &&
                            (<header id="cards-introduction">
                                <h1>{description.frontmatter.title}</h1>
                                <p dangerouslySetInnerHTML={{ __html: description.html }} />
                            </header>
                            )
                        }
                        <div id="cards-container">
                            {filtered.map(el => <LongCard postData={el} toggleTag={toggleTag} selectedTags={tags} />)}
                        </div>
                    </div>
                )
            }
            }
        </Layout>
    )
}

export const query = graphql`
    query MyQuery($pageName: String = "") {
        allMarkdownRemark(
        sort: [{fields: {date: DESC}}, {fields: {slug: ASC}}],
        filter: {fields: {collection: {eq: $pageName}}}
        limit: 999
        ) {
        nodes {
            html
            frontmatter {
            tags
            title
            author
            abstract
            sound
            uuid
            prettyName
            }
            fields {
            date(formatString: "DD MMMM, YYYY", locale: "fr")
            slug
            collection
            image {
                    childImageSharp {
                        gatsbyImageData(placeholder: TRACED_SVG, width: 400)
                    }
                }
            }
            excerpt(pruneLength: 600)
        }
    }
}
`

export default CardsLayout
