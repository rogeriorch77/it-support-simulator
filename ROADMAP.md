# IT Support Simulator — Roadmap & Architecture

> Document de référence pour la vision produit, la stack technique et la structure du projet.

---

## Vision produit

| Tier | Public | Accès | Modèle |
|------|--------|-------|--------|
| **N1/N2** | Étudiants, autodidactes, écoles | GitHub OAuth uniquement | Gratuit / Open Source |
| **N3** | Entreprises, équipes IT, centres de formation | GitHub OAuth + MFA | Payant / B2B |

---

## Tier 1 — N1/N2 Freemium / Open Source

### Objectif
Plateforme d'apprentissage gratuite, publique, accessible via compte GitHub uniquement.  
Cible : étudiants en informatique, techniciens en reconversion, écoles et lycées professionnels.

### Stack technique

| Couche | Technologie | Rôle | Coût |
|--------|------------|------|------|
| **Frontend** | HTML5 + CSS3 + Vanilla JS | Interface du simulateur | Gratuit |
| **Hosting** | Netlify | Déploiement continu depuis GitHub | Gratuit |
| **Auth** | GitHub OAuth 2.0 | Connexion exclusive via compte GitHub | Gratuit |
| **Backend** | Netlify Functions (serverless) | Échange sécurisé du token OAuth | Gratuit |
| **Base de données** | Supabase (PostgreSQL) | Sauvegarde XP, badges, historique | Gratuit (500 MB) |
| **Sécurité** | Variables d'environnement Netlify | `client_secret` jamais exposé dans le code | — |

### Flux d'authentification GitHub OAuth

```
1. Utilisateur clique "Se connecter avec GitHub"
2. Redirection vers GitHub → l'utilisateur autorise l'application
3. GitHub retourne un code temporaire
4. Netlify Function échange le code contre un token (client_secret sécurisé côté serveur)
5. Supabase crée ou met à jour le profil utilisateur
6. Le simulateur charge les données : XP, badges, historique de scénarios
```

> Le `client_secret` ne touche jamais le frontend. Il reste dans les variables d'environnement Netlify.

### Sécurité

| Mesure | Détail |
|--------|--------|
| Pas de mot de passe | GitHub gère l'authentification — zéro stockage de credentials |
| `client_secret` sécurisé | Variable d'environnement Netlify, jamais dans le code source |
| HTTPS obligatoire | Activé automatiquement sur Netlify |
| Row Level Security | Supabase — chaque utilisateur accède uniquement à ses propres données |
| Accès exclusif GitHub | Pas d'email, pas d'inscription manuelle — filtre naturel vers un public technique |

### Fonctionnalités incluses

| Module | Description |
|--------|-------------|
| **Simulateur d'appels** | 13 scénarios N1/N2 guidés (MCQ + feedback pédagogique) |
| **Terminal CMD simulé** | 25+ commandes Windows, 8 machines pré-configurées |
| **Gestion de tickets** | Interface GLPI simulée (ouvert → en cours → résolu) |
| **Progression XP** | Niveaux, badges — sauvegardés dans Supabase (multi-appareil) |
| **Base de connaissances** | Référence rapide par domaine (Windows, AD, M365, Réseau, Server) |

### Structure des fichiers (état actuel + ajouts prévus)

```
/
├── index.html                  — Page d'accueil / login GitHub
├── dashboard.html              — Tableau de bord XP / badges / stats
├── simulation.html             — Simulateur d'appels N1/N2
├── terminal.html               — Terminal CMD standalone
├── tickets.html                — Gestion des tickets GLPI
├── knowledge.html              — Base de connaissances
│
├── css/
│   └── style.css               — Dark theme (CSS variables)
│
├── js/
│   ├── app.js                  — Core : navigation, menu mobile
│   ├── terminal.js             — Moteur du terminal CMD
│   ├── scenarios.js            — Base de données des 13 scénarios
│   └── progress.js             — XP, niveaux, badges
│
├── netlify/
│   └── functions/
│       ├── auth-github.js      — [NOUVEAU] Échange OAuth code → token
│       └── user-profile.js     — [NOUVEAU] Lecture/écriture profil Supabase
│
├── .env                        — [NOUVEAU] Variables locales (jamais committé)
├── netlify.toml                — [NOUVEAU] Configuration Netlify
├── README.md                   — Documentation publique
└── STRUCTURE.md                — Documentation technique interne
```

### Roadmap N1/N2

| # | Fonctionnalité | Priorité | Statut |
|---|----------------|----------|--------|
| 1 | Stabilisation et tests complets en local | Haute | En cours |
| 2 | Déploiement Netlify + GitHub OAuth | Haute | À faire |
| 3 | Intégration Supabase (remplace localStorage) | Haute | À faire |
| 4 | Extension à 30+ scénarios | Haute | À faire |
| 5 | Contenu réel dans la base de connaissances | Haute | À faire |
| 6 | Mode examen — sans indices, chronométré | Moyenne | À faire |
| 7 | Notifications toast / alertes SLA | Basse | À faire |
| 8 | Page de configuration (reset, préférences) | Basse | À faire |

---

## Tier 2 — N3 Produit commercial / B2B

### Objectif
Environnement SysAdmin Jr avec VMs réelles accessibles en SSH.  
Cible : entreprises qui forment leurs équipes IT, centres GRETA, organismes de formation (OPCO).

### Stack technique

| Couche | Technologie | Rôle | Coût estimé |
|--------|------------|------|-------------|
| **Hosting** | VPS dédié (OVH / Hetzner) | Serveur principal | ~10–30 €/mois |
| **Virtualisation** | Proxmox / KVM | VMs isolées par utilisateur | Inclus VPS |
| **Accès utilisateur** | SSH réel vers VM dédiée | Terminal non simulé | — |
| **Auth** | GitHub OAuth + MFA obligatoire | Sécurité renforcée | — |
| **Backend** | Node.js ou Python (FastAPI) | API de gestion des VMs | — |
| **Base de données** | PostgreSQL (auto-hébergé) | Profils, progression, facturation | Inclus VPS |
| **Paiement** | Stripe | Abonnement mensuel/annuel par siège | 1.4% + 0.25€/transaction |

### Fonctionnalités incluses

| Module | Description |
|--------|-------------|
| **Terminal SSH réel** | VM Proxmox isolée par utilisateur, remise à zéro après chaque session |
| **Scénarios SysAdmin** | Proxmox, LVM, systemd, cron, iptables, logs réels |
| **Environnement cassé** | Le système est délibérément en erreur — l'apprenant doit le réparer |
| **Dashboard entreprise** | Suivi de progression par équipe, exports PDF |
| **Facturation** | Stripe — abonnement par siège ou par équipe |
| **Support pédagogique** | Corrigés détaillés, documentation par scénario |

### Sécurité renforcée N3

| Mesure | Détail |
|--------|--------|
| MFA obligatoire | Authentification à deux facteurs pour tous les comptes |
| VM isolée par utilisateur | Aucune interaction possible entre utilisateurs |
| Réseau cloisonné | Les VMs n'ont pas accès à Internet — réseau interne uniquement |
| Reset automatique | La VM est remise à l'état initial après chaque session |
| Logs d'accès | Toutes les connexions SSH sont enregistrées |

### Modèle commercial

| Plan | Prix estimé | Inclus |
|------|------------|--------|
| **Individuel** | 15 €/mois | 1 compte, accès complet N3 |
| **Équipe** | 99 €/mois | 10 comptes, dashboard manager |
| **École / OPCO** | Sur devis | Comptes illimités, API LMS, attestations |

### Roadmap N3

| # | Fonctionnalité | Priorité |
|---|----------------|----------|
| 1 | Infrastructure VPS + Proxmox | Haute |
| 2 | Système de provisionnement de VMs par utilisateur | Haute |
| 3 | 10 premiers scénarios SysAdmin Jr | Haute |
| 4 | Dashboard entreprise | Moyenne |
| 5 | Intégration Stripe | Moyenne |
| 6 | Attestations de complétion (PDF signé) | Moyenne |
| 7 | API LMS (Moodle, Canvas) | Basse |
| 8 | Modules alignés ITIL 4 / RHCSA / CompTIA | Basse |

---

## Vue d'ensemble — Évolution du projet

```
Phase 1 (maintenant)
└── Finalisation et tests N1/N2 en local

Phase 2 (prochaine étape)
└── Deploy Netlify + GitHub OAuth + Supabase
    └── IT Support Simulator en ligne, gratuit, open source

Phase 3 (après premiers utilisateurs)
└── Expansion N1/N2 : 30+ scénarios, mode examen, base de connaissances complète

Phase 4 (long terme)
└── Lancement N3 : VPS + Proxmox + SSH réel + Stripe
    └── Partenariats écoles, GRETA, OPCO
```

---

*Document rédigé en avril 2026 — à mettre à jour à chaque étape franchie.*
