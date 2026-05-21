# 🚀 CargoPilot - Plateforme d'Analytique Supply Chain

**CargoPilot** est une application web moderne conçue pour les professionnels de la logistique et de la supply chain. Elle permet de visualiser, analyser et optimiser les flux de transport internationaux à travers une interface intuitive, bilingue (Français/Anglais) et performante.

## 🌟 Fonctionnalités Clés

### 📊 Tableau de Bord (Overview)
- **KPIs en Temps Réel** : Suivi du taux de retard, coût total, émissions de CO2 et expéditions critiques.
- **Diagnostic Automatique** : Analyse intelligente des causes principales de retard et identification du meilleur transporteur.
- **Alertes Critiques** : Liste immédiate des expéditions à haut risque.

### 🗺️ Carte des Flux (Transport Map)
- **Visualisation Dynamique** : Affichage des flux mondiaux avec des courbes (arcs) pour une meilleure lisibilité.
- **Légende Intelligente** : Distinction claire entre les modes de transport (Route, Mer, Air) via des icônes et styles de traits.
- **Interaction** : Filtrage par mode de transport et niveau de risque directement sur la carte.

### 🚛 Performance Transporteurs
- **Scorecards** : Évaluation des transporteurs sur une échelle de 0 à 100.
- **Ranking** : Classement par fiabilité (Fiable, À surveiller, À risque).
- **Analyses Comparatives** : Comparaison des coûts moyens et des taux de retard par prestataire.

### 🔍 Qualité des Données
- **Audit Automatique** : Détection d'anomalies (doublons, données manquantes, incohérences de dates).
- **Recommandations** : Conseils actionnables pour corriger les erreurs à la source (TMS, base de données).

### 💡 Simulation d'Optimisation
- **Scénarios What-If** : Simulation du transfert de flux des transporteurs les moins performants vers les meilleurs.
- **Calcul d'Impact** : Estimation des économies potentielles en jours de retard et en euros.

## 🛠️ Installation et Lancement

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- npm (installé avec Node.js)

### Étapes
1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Lancer en mode développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:5173`.

3. **Générer le build de production** :
   ```bash
   npm run build
   ```

## 📂 Gestion des Données (Import CSV)

L'application permet d'importer vos propres données via un fichier CSV. 
- **Format attendu** : Le séparateur peut être `,` ou `;` (compatible Excel FR).
- **Colonnes obligatoires** : `id`, `mode`, `originCity`, `destinationCity`, `carrier`, `plannedArrival`, `actualArrival`, `costEur`, `riskLevel`, etc.
- **Note** : Un modèle de données complet est disponible via le bouton "Réinitialiser" pour tester les fonctionnalités.

## 💻 Technologies Utilisées
- **Core** : React, TypeScript, Vite
- **Styling** : TailwindCSS, Lucide React
- **Cartographie** : React-Leaflet
- **Graphiques** : Recharts
- **Parsing** : PapaParse

---
*Développé pour une gestion logistique de pointe.*
