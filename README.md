# IT Support Simulator N1/N2

> Plateforme de simulation support IT N1/N2 — entraînement tickets, terminal, quiz technique et préparation aux entretiens. Idéal pour décrocher son premier poste.

**Live →** [rogeriorch77.github.io/it-support-simulator](https://rogeriorch77.github.io/it-support-simulator)  
**Stack →** Vanilla HTML/CSS/JS · Supabase Auth · GitHub OAuth · Zero dependencies

---

## Screenshots

### Tableau de bord
![Dashboard](img/dashboard.webp)

### Simulation d'appels
![Simulation](img/simulation.webp)

### Gestion de tickets
![Tickets](img/tickets.webp)

### Terminal interactif
![Terminal](img/terminal.webp)

### Base de connaissances
![Knowledge Base](img/knowledge.webp)

### Quiz technique chronométré
![Quiz](img/quiz.webp)

### Préparation aux entretiens
![Entretiens](img/interview.webp)

---

## Modules

| Module | Description |
|--------|-------------|
| **Classement public** | Leaderboard en temps réel visible sans connexion — compétition XP entre joueurs |
| **Simulation d'appels** | 13 scénarios N1/N2 réalistes avec contexte appelant, étapes diagnostiques MCQ et feedback pédagogique |
| **Terminal CMD** | 25+ commandes Windows sur 8 machines pré-configurées avec pannes spécifiques |
| **Tickets GLPI** | 80 tickets support réalistes — open → en cours → résolu, avec résolution via terminal |
| **Base de connaissances** | Référence rapide par domaine (Windows, AD, M365, Azure, Réseau, Serveur) |
| **Quiz technique** | 30 questions N1/N2 chronométrées, choix simple et multiple, bonus vitesse, XP synchronisé |
| **Entretiens** | 45 questions/réponses d'entretien N1/N2 avec méthode STAR et filtres par catégorie |

---

## Système XP & Classement

| Niveau | Nom | XP requis |
|--------|-----|-----------|
| 1 | Débutant | 0 XP |
| 2 | Technicien | 500 XP |
| 3 | Support N1 | 1 500 XP |
| 4 | Support N2 | 3 500 XP |
| 5 | Spécialiste | 7 000 XP |
| 6 | Expert | 14 000 XP |
| 7 | Architecte | 25 000 XP |
| 8 | Elite | 50 000 XP |

XP gagné en quiz, synchronisé dans Supabase. Classement mondial public, pas de plafond.

---

## Connexion

Accès via **GitHub OAuth** — aucun mot de passe, aucune donnée sensible stockée.  
Le classement est visible sans connexion. La connexion débloque la progression personnelle.

---

## Tech Stack

| Item | Détail |
|------|--------|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript ES6+ |
| Auth | Supabase Auth — GitHub OAuth |
| Base de données | Supabase (PostgreSQL) — profils et XP uniquement |
| Hébergement | GitHub Pages |
| Dépendances | Supabase JS SDK (CDN) — zéro npm, zéro framework |
| Compatibilité | Tout navigateur moderne |

---

## Structure

```
/
├── index.html            — Landing page + classement public
├── dashboard.html        — XP / niveaux / statistiques
├── simulation.html       — Simulateur d'appels N1/N2
├── terminal.html         — Terminal CMD interactif
├── tickets.html          — Gestion de tickets GLPI
├── knowledge.html        — Base de connaissances
├── entretiens.html       — Préparation aux entretiens
├── quiz.html             — Quiz technique chronométré
├── schema.sql            — Schéma base de données Supabase
├── img/                  — Screenshots et assets
├── css/style.css         — Design system thème sombre
└── js/
    ├── app.js            — Core: traductions, navigation
    ├── auth.js           — Supabase Auth + guard + XP sync
    ├── config.example.js — Template configuration (copier → config.js)
    ├── terminal.js       — Moteur CMD
    ├── scenarios.js      — Base de données 13 scénarios
    ├── tickets.js        — Base de données 80 tickets
    └── progress.js       — XP, niveaux, badges
```

---

## Environnement fictif

| Élément | Valeur |
|---------|--------|
| Domaine AD | `CORP.LOCAL` |
| Sous-réseau | `192.168.1.0/24` |
| Contrôleur de domaine | `DC01.CORP.LOCAL` |
| Format machine | `PC-[DEPT]-[NUM]` |
| Format compte | `prenom.nom` |

---

Développé par [@rogeriorch77](https://github.com/rogeriorch77)
