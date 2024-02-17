# Lancement du projet et initialisation de la DB

Tout d'abord, modifiez le fichier app.js pour permettre la connexion à votre MySQL :

#### const db = mysql.createConnection({

#### host: "localhost",

#### user: "Votre_nom_d_utilisateur",

#### assword: "Votre_mot_de_passe",

#### database: "visitcards",

#### });

Vous devez avoir installé MySQL sur votre ordinateur

Ensuite lancez votre shell MySQL depuis le dossier '**API Cartes de visites**'

Lancez la commande `source script.sql` dans votre terminal MySQL pour lancer le script qui initialisera la DB (si ça ne trouve pas le script, faites `source /chemin/vers/script.sql`)

Pour finir, faites `nodemon app.js` depuis le dossier '**API Cartes de visites**' pour lancer le projet puis allez sur le port 3000
