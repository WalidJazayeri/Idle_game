# Vampire Idle Starter

Base de jeu **React + Phaser + Vite + TypeScript** pour un idle inspiré de Vampire Survivors.

## Installation

```bash
npm install
npm run dev
```

## Concept inclus

- Héros au centre qui attaque automatiquement
- Ennemis qui arrivent par vagues
- Gain d'or à chaque kill
- Upgrades : dégâts, vitesse d'attaque, portée
- Sauvegarde localStorage
- Progression hors ligne simplifiée
- Structure prête pour ajouter Capacitor plus tard

## Prochaine étape Android

Quand le prototype web est stable :

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android
npx cap add android
npm run build
npx cap sync android
```
