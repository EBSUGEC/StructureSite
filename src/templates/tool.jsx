import { graphql, Link } from "gatsby";
import * as React from 'react';
import Layout from '../components/layout';
import '../style/article.css';


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const BlogPost = ({ data, children }) => {
  const {
    nom,
    slug,
    description,
    donnees,
    difficulte,
    source,
    fonctions,
    phases
  } = data.csvNode

  const donneesClean = donnees.split(';')
  const fonctionsClean = fonctions.split(';')
  const phasesClean = phases.split(';')

  const commentaire = "Un texte un peu descriptif qui permet de faire certaines remarques utiles dans la zone dédiée"
  const logo = "https://upload.wikimedia.org/wikipedia/commons/7/70/TXM-logo.png"
  // const open_source = true
  // const online = true
  const ressources = ['[Doc Officielle](https://txm.gitpages.huma-num.fr/textometrie/)', 'www.google.com']
  const similar = ['iramuteq', 'gargantext']

  React.useEffect(() => {
    document.querySelector('body').style.setProperty('--random-rotate', `${getRandomIntInclusive(20, 340)}deg`)
  }, []);
  return (
    <Layout>
      <div className="container" style={{height: '55vh'}}>
        <div className="row" style={{height: '100%'}}>
          <div className="col-md-9" id="mainContent">
            <div className="d-flex justify-content-between align-items-center pt-2" id="toolHeader">
              <div className="d-flex align-items-center">
                <img src={logo} style={{ width: '75px', marginRight: '1.7em' }} />
                <h1>{nom}</h1>
              </div>
              <a href={source}>Installation</a>
            </div>
            <div className="row p-3 border-bottom border-top border-secondary" id="description">
              {description}
              Lorem ipsum et je fais un texte long dont on se fout complètemetn du contenu mais juste pour rajouter des infos qui ne seront pas justifiées.
              Et encore d'ailleurs, il m'en faut toujours plus, PLUS, PLUUUUUUUUUUUUUUS.
            </div>
            <div className="row p-3" id="tags">
              <div className="col d-flex flex-column">
                <span>Fonctions</span>
                {
                  fonctionsClean.map(fonction => <a className="small-tag mt-2">{fonction}</a>)
                }
              </div>
              <div className="col d-flex-column">
                <span>Etapes</span>
                {
                  phasesClean.map(phase => <a className="small-tag phases mt-2">{phase}</a>)
                }
              </div>
              <div className="col d-flex-column">
                <span>Données</span>
                {
                  donneesClean.map(donnee => <a className="small-tag data mt-2">{donnee}</a>)
                }
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex flex-column border-start border-secondary justify-content-between" id="additionalInfos">
              <div className="d-flex flex-column">
                <span className="fw-bolder">Difficulté d'installation:</span>
                Facile
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bolder">Difficulté d'utilisation:</span>
                {difficulte}
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bolder">Ressources:</span>
                {ressources.map(el => {
                  let name = el
                  let link = el
                  if(el.startsWith('[')){
                    [name, link] = el.split(']')
                    name = name.slice(1,)
                    link = link.slice(1, link.length - 1)
                    console.log(name, link)
                  } 
                  return (<a href={link}>{name}</a>)
                })}
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bolder">Outils comparables:</span>
                {similar.map(el => <a href={"/outils/" + el} className="mt-1">{el}</a>)}
              </div>
              <div className="d-flex flex-column">
                <span className="fw-bolder">Commentaire:</span>
                {commentaire}
              </div>
          </div>
        </div>
      </div>
    </Layout >
  )
}

export const query = graphql`
  query ToolBySlug($slug: String!) {
    site {
      siteMetadata {
        title,
      }
    }
    csvNode(slug: {eq: $slug}) {
      nom,
      slug,
      description,
      donnees,
      difficulte,
      source,
      fonctions,
      phases
    }
  }
`

export default BlogPost