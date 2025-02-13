@echo off
setlocal

:: Définition des chemins
set "SOURCE=../EBSUGEC.github.io/data"
set "DEST=src/data"

:: Vérifier si le dossier source existe
if not exist "%SOURCE%" (
    echo Le dossier source "%SOURCE%" n'existe pas.
    exit /b 1
)

:: Créer le dossier de destination s'il n'existe pas
if not exist "%DEST%" (
    mkdir "%DEST%"
)

:: Copier les fichiers et dossiers
xcopy "%SOURCE%\*" "%DEST%" /E /I /Y

echo Copie terminée !
exit /b 0
