import { graphql, Link } from "gatsby"
import * as React from 'react'
import Calendar from 'react-calendar'
import { Card } from "../components/card"
import Layout from '../components/layout'
import { filterNodes, isDateOnCallendar } from "../helpers"
import { Introduction } from '../components/customisation'
import Planet from '../images/baniere.jpg'

import LogoSorbonne from '../images/lettres-logo-white.svg'
import LogoLabo from '../images/LogoLabo.png'

import "../style/accueil.css"

const Home = ({ data }) => {
    const nodes = data.allMarkdownRemark.nodes
    const lastPosts = React.useRef(null)

    return (
        <Layout nodes={nodes}>
            {/* petite astuce pour passer une fonction qui rend le composant actuel au layout pour que le layout puisse passer les paramètres nécessaires au filtrage*/}
            {(toggleTag, tags, search) => { 
                const filtered = filterNodes(nodes, search, tags);
                if (lastPosts && lastPosts.current && filtered.length !== nodes.length) {
                    lastPosts.current.scrollIntoView()
                }
                return (
                    <div>
                        <HomeHeader nodes={nodes} />
                        <h2 ref={lastPosts} id="last-posts">Dernières publications</h2>
                        <div id="cards-container">
                            {filtered.map((el, index) => <Card postData={el} key={index} toggleTag={toggleTag} selectedTags={tags} />)}
                        </div>
                    </div>
                )
            }
            }
        </Layout>
    )
}

const HomeHeader = ({ nodes }) => {
    const [imageClass, setImageClass] = React.useState("")
    setTimeout(() => setImageClass('full'), 0)
    return (<header>
        <div className="image-container">
            <img id="landing-image" src={Planet} style={{ maxWidth: "100%", margin: 0 }} className={imageClass} />
            {/* <div class="gradient-overlay"></div> */}
            <img id="landing-logo" src={LogoLabo} style={{ maxWidth: "100%", margin: 0 }} />
            <img id="landing-sorbonne" src={LogoSorbonne} style={{ maxWidth: "100%", margin: 0, height: "194px", width: "500px" }} />
        </div>

        <div id="landing-blocks-container">
            <Introduction />
        </div>
    </header>)
}

export const query = graphql`
  query MyQuery {
    site {
        siteMetadata {
            title
        }
    }
    allMarkdownRemark(sort: {fields: {date: DESC}}, filter: {fields: {date: {ne: null}}}, limit: 999) {
        nodes {
            frontmatter {
                tags
                title
                author
                abstract
                sound
                event
                uuid
                prettyName
            }
            fields {
                collection
                date(formatString: "DD MMMM, YYYY", locale: "fr")
                dateRaw: date
                slug
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

export default Home
