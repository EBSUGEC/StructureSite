cd src/
if [ ! -d "./data" ];
then
    git clone https://github.com/<REMPLACER_PAR_LE_NOM_DE_LABO>/contenu-du-site.git ./data
fi
cd ./data
git pull origin main
cd ../..

# npx gatsby clean
# npm start
