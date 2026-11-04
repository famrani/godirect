GoDirect — structure bateaux issue de l’export Alegria (99)

Placer create-boat-storage.cjs ET boat-media-manifest.json dans server/scripts/.
Le manifeste est extrait de bnFleet, bnOutings, resources et siteContent.
Il contient 119 chemins uniques pour alegria, bigboss et seabreeze,
soit 37 dossiers (parents compris), sans les données personnelles de l’export.

Destination : gs://ailla-poc.appspot.com/boat/<id>/img/...
Conserve exactement boat/, events/, home/ et les sous-dossiers du JSON.
Cette commande ne crée pas assets/boats/ et ne copie pas sous tenants/alegria_data/.
Les références canoniques du JSON commencent par boat/<id>/img/ : c’est leur
structure exacte que le script reproduit à la racine du bucket GoDirect.

Depuis server/, simulation :
node scripts/create-boat-storage.cjs --folders-only
Création effective de l’arborescence (objets vides se terminant par /) :
node scripts/create-boat-storage.cjs --folders-only --apply

Pour copier aussi les images depuis le frontend :
node scripts/create-boat-storage.cjs
Puis, après examen du plan :
node scripts/create-boat-storage.cjs --apply

Exemple : assets/img/boat/bali4.1/bali-41-2.jpg devient
boat/alegria/img/boat/bali4.1/bali-41-2.jpg.
Le fichier est aussi copié sous bigboss/seabreeze si le JSON le référence ainsi.
Le script ne substitue pas de photos à des fichiers manquants.
Un chemin absent est signalé MISSING ; en mode copie réelle, le code de sortie
est non nul si des images sont manquantes ou si des opérations échouent.

--bucket permet de choisir explicitement un autre bucket ; par défaut, celui
de GoDirect est défini dans le manifeste, sans reprendre adn_root depuis .env.
Le SDK utilise GCS_SERVICE_ACCOUNT ou FIREBASE_SERVICE_ACCOUNT, sinon ADC.
Dépendance : @google-cloud/storage (déjà utilisée par le backend).
Le chargement de dotenv est facultatif ; s’il est installé, le .env de server
est lu automatiquement. Une simple connexion gcloud login ne fournit pas
nécessairement les identifiants ADC au SDK Node.

Aucun objet existant n’est écrasé (précondition atomique ifGenerationMatch=0).
Aucune suppression, aucune modification Firebase, IAM, ACL ou publication.
La création de dossiers/copieuse est indépendante de la configuration d’affichage
frontend : elle ne réécrit pas les références locales Firebase.

Testé : simulation à partir du manifeste, 119 références couvertes, création
simulée des dossiers, bucket cible, objets existants et anti-écrasement.
Sur les fichiers locaux disponibles ici : 42 références trouvées, 77 manquantes.
Non testé : connexion et opérations réelles GCS. Aucune écriture en ligne ici.

MISE A JOUR — source harbornest-1
Sans --source, le script cherche harbornest-1 à proximité du dossier courant
et du script, avec les variantes src/assets/img, app/src/assets/img, assets/img.
Il affiche le chemin retenu. Si plusieurs dossiers existent, il demande
un --source explicite plutôt que de choisir. Il ne cherche pas dans boatify.
Exemple depuis boatify/server si les deux projets sont voisins :
node scripts/create-boat-storage.cjs --source ../../harbornest-1/src/assets/img
Ajouter --apply après vérification du plan. Si votre frontend est sous app/,
utiliser ../../harbornest-1/app/src/assets/img.
Tests : détection d’un projet voisin, variante app/, source explicite,
refus d’une source ambiguë, mode dossiers seul sans source. Pas de copie GCP réelle.
