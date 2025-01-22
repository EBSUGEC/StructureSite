import * as React from 'react'

const Introduction = () => { return (
    <div className="landing-block text">
        <h2>Template de site académique de la Fac de Lettres</h2>
        <p>
            Ce site est un modèle pour les sites de laboratoire de <a href="https://lettres.sorbonne-universite.fr/">Faculté des Lettres de Sorbonne Université</a>.
                Il a pour vocation d'être un exemple modifiable afin de mettre en place aisément des sites web permettant de publier billets de blogs et mettre en avant des événements liés à l'activité d'un laboratoire.
        </p>
        <p>
            Fonctionnalités principales
            <ul>
                <li> Publier du contenu à partir de simples fichiers markdown </li>
                <li> Mise en avant d'événements </li>
                <li> Gestion facilitée de membres </li>
            </ul>
        </p>
        <p>
            Ce template a été créé par les ingénieurs de <a href="ceres.sorbonne-universite.fr">l'unité de service du CERES</a>.
        </p>
    </div>
)}

export default Introduction