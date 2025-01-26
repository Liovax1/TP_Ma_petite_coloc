# TP final - Ma petite coloc

## Contexte :
Cette application backend Node.js utilise TypeScript, Express et MongoDB pour gérer des colocations et des colocataires, avec des fonctionnalités d'authentification et d'autorisation basées sur Json Web Token (JWT).

### Choix :

J'ai choisi d'utiliser *Mongoose* pour la gestion de la base de données car je ne maitrise par encore TypeORM.
Pour la gestion des erreurs j'ai utilisé un *middleware personnalisé*, et *MongoDB* pour la gestion des données car je voulais changer par rapport à d'habitude où j'utilise MySQL.
J'ai également utilisé des classes utilitaires pour les réponses de succès et d'erreur à des fins de clarté et de simplicité, mais également pour la facilité de la maintenance.
J'ai utilisé TypeScript car ce langage était au coeur du module.
J'ai utilisé Json Web Token (JWT) pour la gestion de l'authentification et de l'autorisation à des fins de sécurité.
J'ai utilisé Postman pour tester les API. PS : C'est un super outil que je ne connaissais pas avant et que j'utiliserai désormais très souvent.

### Prérequis : *Avoir Node.js et npm installés*
Vérifier la version de Node.js avec `node -v`

## Mise en place du projet Backend (Node.js, Mongodb, JS, typescript)

#### Faire les commandes suivantes :

```bash
npm install express
```
```bash
npm install nodemon
```
```bash
npm install @types/express -d
```
```bash
npm install @types/node -d
```
```bash
npm install ts-node -d
```
```bash
npm install tsup -d
```
```bash
npm install typescript -d
```
```bash
npm install express mongoose
```
```bash
npm install typescript @types/node --save -dev
```
```bash
npx tsc
```
```bash
npx tsc --init
```
```bash
npm install bcrypt
```
```bash
npm install jsonwebtoken bcrypt
```


Vous pouvez créer un compte sur mongodb.com, puis créer un cluster et le connecter (installer Compass).

Installer également Postman pour tester vos différentes requêtes.

### Commandes complémentaires si besoin

- `npm install -g typescript`
- `npm i- g`
- `npm i tsx`
- `npm i -g typescript`
- `npm i`
- `npm i -g tsx`


- Remarque :
S'il s'agit d'un projet cloné, dans le fichier .env, il faudra remplacer l'url de la base de données par celle de votre base de données MongoDB.
Ensuite, supprimer le dossier dist et node_modules puis faite la commande : `npm i` pour recréer le dossier node_modules.
Dans le fichier package.json, au niveau du main et du start, remplacer index.js et server.js par server.ts
Remplacer l'affichage de l'erreur par "Hello World".

### Lancer le serveur avec :
```bash
npm run dev
```
