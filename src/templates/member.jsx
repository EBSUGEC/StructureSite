// src/templates/member.jsx
import { graphql } from "gatsby"
import * as React from 'react'
import { Card } from "../components/card"
import Layout from '../components/layout'
import { filterNodes } from "../helpers"
import "../style/accueil.css"
import "../style/cards.css"

const MemberLayout = ({ data, pageContext }) => {
  const memberNode = data.member;
  const nodes = data.articles.nodes;

  return (
    <Layout nodes={nodes}>
      {(toggleTag, tags, search) => {
        const filtered = filterNodes(nodes, search, tags);
        return (
          <div>
            <header id="cards-introduction">
              <h1>{memberNode.frontmatter.title}</h1>
              <p dangerouslySetInnerHTML={{ __html: memberNode.html }} />
            </header>
            <div id="cards-container">
              {filtered.map(el => <Card postData={el} toggleTag={toggleTag} selectedTags={tags} />)}
            </div>
          </div>
        );
      }}
    </Layout>
  );
};

export const query = graphql`
  query MemberQuery($slug: String!, $authorName: String!) {
    member: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        abstract
      }
    }
    articles: allMarkdownRemark(
      sort: { fields: { date: DESC } }
      filter: { frontmatter: { author: { in: [$authorName] } } }
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
          prettyName
          collection
          date(formatString: "DD MMMM, YYYY", locale: "fr")
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
`;

export default MemberLayout;