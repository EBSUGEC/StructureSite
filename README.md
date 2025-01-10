# CERES Website Markdown Generator

Un template de générateur de site créé par le CERES et permettant d'utiliser de simples markdowns pour créer des pages.
Pour configurer le site:
- créer un repository sur le nouveau compte en utilisant celui ci comme template, ce repository devra s'appeler <nom_du_compte>.github.io
- créer un repository vide qui contiendra le contenu du site:
    - chaque rubrique sera un dossier et s'appelera sous la forme suivante : numero_typeaffichage_nomrubrique ex: 1_cards_membres
        - le numéro sert à regrouper dans un espace du menu les rubriques ayant le même numéro, ainsi avoir 1_cards_membres et 1_cards_actualités regroupera membres et actualités ensemble dans le menu
        - les types d'affichages disponibles sont longcards et cards et affichent les articles de la rubriques soit sous forme de miniatures carrées (cards) ou rectangulaires (longcards)
    - chaque article sera ensuite un dossier dont le nom sera sous la forme YYYY-MM-DD_nomarticle ce dossier contiendra un index.md ainsi que toutes les images à afficher dans l'article
- changer 