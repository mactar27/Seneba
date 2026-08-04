# SENEBA - Taxi & VTC Application

SENEBA est une application moderne de réservation de véhicules avec chauffeur (VTC) et taxis, développée avec **Next.js 14**, **React**, et **Tailwind CSS**. 

https://github.com/user-attachments/assets/42df0359-e5ab-4c01-b54c-49f0cbf983c2
## Fonctionnalités Principales

- 📍 **Carte Interactive Dynamique** : Intégration de Leaflet pour afficher en temps réel la position de l'utilisateur et visualiser les chauffeurs disponibles aux alentours.
- 🚗 **Simulation & Synchro Base de Données** : Un système qui interroge la base de données MySQL pour remonter la position exacte des véhicules actifs (`getAvailableDrivers`). S'il n'y a personne en ligne, "0 chauffeur à proximité" apparaît.
- 📱 **Interface Fluide et Mobile-First** : Une esthétique claire avec des animations (flottement, icônes réactives) via `lucide-react` et des fenêtres de détails en bas d'écran (Bottom Sheets).

## Technologies Utilisées

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS, shadcn/ui
- **Cartographie** : Leaflet & React-Leaflet
- **Base de données** : MySQL2 (connexion directe depuis les Server Actions)

## Démarrage Rapide

1. Installez les dépendances :
   ```bash
   pnpm install
   ```

2. Configurez votre base de données :
   Exécutez les fichiers SQL présents dans le dossier `/scripts` depuis votre outil MySQL ou via la CLI.
   Mettez à jour le fichier `.env.local` avec vos identifiants de base de données.

3. Lancez le serveur de développement :
   ```bash
   pnpm dev
   ```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.
