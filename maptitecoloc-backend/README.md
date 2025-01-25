# TP final - Ma petite coloc

## Contexte :
Cette application backend Node.js utilise TypeScript, Express et MongoDB pour gérer des colocations et des colocataires, avec des fonctionnalités d'authentification et d'autorisation basées sur Json Web Token (JWT).

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
