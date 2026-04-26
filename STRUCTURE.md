# IT Support Simulator — Structure Complète

> Document de référence. Reflète l'état actuel du projet : 100 % français, sans sélecteur de langue.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Arborescence des fichiers](#2-arborescence-des-fichiers)
3. [Pages HTML](#3-pages-html)
4. [JavaScript — Fichiers](#4-javascript--fichiers)
5. [Scénarios — Base de données](#5-scénarios--base-de-données)
6. [Système de progression](#6-système-de-progression)
7. [Terminal simulé](#7-terminal-simulé)
8. [Design System (CSS)](#8-design-system-css)
9. [localStorage — Clés utilisées](#9-localstorage--clés-utilisées)
10. [Règles de développement](#10-règles-de-développement)
11. [Environnement fictif](#11-environnement-fictif)
12. [Roadmap](#12-roadmap)

---

## 1. Vue d'ensemble

| Champ | Valeur |
|-------|--------|
| **Nom** | IT Support Simulator — N1/N2 avec GLPI |
| **Objectif** | Plateforme d'apprentissage pour techniciens support IT N1/N2 |
| **Public** | Débutants et professionnels en formation |
| **Langue** | Français (unique) |
| **Stack** | HTML5 + CSS3 pur + Vanilla JS (ES6+) |
| **Serveur** | Aucun — fonctionne en `file://` directement |
| **Dépendances externes** | Aucune |
| **Persistance** | `localStorage` uniquement |

---

## 2. Arborescence des fichiers

```
/CLAUDE
│
├── index.html              (30 lignes)   — Page d'accueil / entrée
├── login.html              (50 lignes)   — Formulaire de login
├── dashboard.html         (314 lignes)   — Tableau de bord principal
├── tickets.html           (415 lignes)   — Gestion des tickets GLPI
├── simulation.html        (686 lignes)   — Simulateur d'appels N1/N2
├── terminal.html          (473 lignes)   — Terminal CMD standalone
├── knowledge.html         (128 lignes)   — Base de connaissances
│
├── css/
│   └── style.css         (1595 lignes)   — Feuille de styles unique (dark theme)
│
├── js/
│   ├── app.js             (200 lignes)   — Core : traductions, navigation, menu mobile
│   ├── terminal.js        (743 lignes)   — Moteur du terminal CMD (IIFE)
│   ├── scenarios.js       (747 lignes)   — Base de données des 13 scénarios
│   └── progress.js        (196 lignes)   — XP, niveaux, badges
│
├── img/
│   ├── flag-fr.svg                       — Drapeau France (SVG inline)
│   ├── flag-gb.svg                       — Drapeau UK (non utilisé)
│   └── flag-br.svg                       — Drapeau Brésil (non utilisé)
│
├── lang/
│   ├── fr.json                           — ⚠ OBSOLÈTE — ne pas utiliser
│   ├── en.json                           — ⚠ OBSOLÈTE — ne pas utiliser
│   └── pt.json                           — ⚠ OBSOLÈTE — ne pas utiliser
│
├── CLAUDE.md                             — Instructions pour IAs assistantes
└── STRUCTURE.md                          — Ce fichier
```

---

## 3. Pages HTML

### 3.1 `index.html` — Accueil

Page d'entrée minimaliste. Contient un bouton vers `dashboard.html`.

**Sections :**
- Logo IT
- Titre de bienvenue (`data-i18n="welcome"`)
- Bouton → Dashboard

---

### 3.2 `login.html` — Login

Formulaire simple. Enregistre le nom de l'utilisateur dans `localStorage`.

**Champs :**
- Nom d'utilisateur (input text)
- Mot de passe (input password — non validé, cosmétique)

**Comportement :**
```javascript
localStorage.setItem('user', username);
window.location.href = 'dashboard.html';
```

---

### 3.3 `dashboard.html` — Tableau de bord

Vue d'ensemble de la progression du technicien.

**Sections :**

| Section | Description |
|---------|-------------|
| Carte XP / Niveau | Barre de progression, niveau actuel, XP total |
| Stats (4 cartes) | Appels effectués, scénarios uniques, score moyen, badges |
| Graphique tickets | Barres statiques par catégorie (Windows, AD/GPO, Server, M365, Azure, Réseau) |
| SLA Performance | Barres de performance par priorité (Critique, Haute, Moyenne, Basse) |
| Activité récente | Liste statique des derniers événements |
| Actions rapides | Liens → Simulation, Nouveau ticket, Base de connaissances |
| Badges | Grille dynamique de tous les badges (gagnés / verrouillés) |

**Scripts chargés :** `app.js`, `progress.js`

---

### 3.4 `tickets.html` — Tickets GLPI

Simulation du système de ticketing GLPI.

**Composants :**

| Composant | Description |
|-----------|-------------|
| Barre de filtres | Tous / Ouverts / En cours / Résolus + recherche texte |
| Tableau des tickets | ID, problème, appelant, service, catégorie, priorité, statut, SLA |
| Modal — Nouveau ticket | Formulaire : appelant, service, problème, catégorie, priorité, description |
| Panneau de détail | Infos complètes, notes, boutons d'action selon l'état |

**Flux d'états d'un ticket :**
```
open → progress → resolved → closed
         ↑                      ↓
         └──────────────────────┘ (réouvrir)
```

**Tickets (base de données `js/tickets.js`) :**

80 tickets réalistes répartis par catégorie :

| Catégorie | Quantité |
|-----------|---------|
| Windows | 20 |
| Microsoft 365 | 15 |
| Réseau | 15 |
| AD/GPO | 12 |
| Hardware | 10 |
| Sécurité | 5 |
| Server | 3 |
| **Total** | **80** |

**Actions disponibles selon statut :**

| Statut | Boutons |
|--------|---------|
| `open` | Prendre en charge |
| `progress` | Résoudre |
| `resolved` | Fermer / Réouvrir |
| `closed` | Réouvrir |

**Scripts chargés :** `app.js`, `tickets.js`

---

### 3.5 `simulation.html` — Simulateur d'appels

Cœur de la plateforme. Simule des appels de support IT N1/N2.

**Phases :**

```
1. LISTE       → Sélection d'un scénario (grille de cartes filtrables)
      ↓
2. SONNERIE    → Téléphone sonne, identité de l'appelant visible
      ↓
3. APPEL ACTIF → Chat + options MCQ + terminal intégré
      ↓
4. SCORE       → Résultat, XP gagné, badges débloqués
```

**Phase 1 — Liste des scénarios :**
- Pills de filtre : Tous | N1 — Facile | N1 — Moyen | N2 — Difficile | Réseau
- Cartes scénario : catégorie, titre (issue), appelant, badge difficulté, checkmark si complété

**Phase 2 — Sonnerie :**
- Affiche : nom de l'appelant, département, humeur
- Bouton « Accepter l'appel »
- Bouton « Annuler »

**Phase 3 — Appel actif :**

Panneau gauche :
- Barre supérieure : identité appelant, humeur, timer live
- Fenêtre de chat : bulles appelant (gris) / technicien (bleu)
- Terminal intégré (mini-terminal)

Panneau droit :
- Question de l'étape courante
- 4 options (A, B, C, D) avec feedback visuel (vert/rouge)
- Bouton « Afficher un indice » (pénalité enregistrée, mais pas de perte de score)
- Indicateur d'étape : « Étape X / Y »
- Suggestion de commande CMD si disponible

**Phase 4 — Score :**
- Anneau de score visuel (vert/jaune/rouge)
- Statistiques : réponses correctes, indices utilisés, difficulté
- Message de feedback :
  - ≥ 80 % → « Excellent travail ! Vous maîtrisez ce scénario. »
  - ≥ 50 % → « Bien ! Consultez les indices pour perfectionner votre approche. »
  - < 50 % → « Révisez la théorie sur ce sujet et réessayez. »
- Boutons : « ← Choisir un scénario » | « Aléatoire ► »

**Scripts chargés :** `app.js`, `scenarios.js`, `terminal.js`, `progress.js`

---

### 3.6 `terminal.html` — Terminal standalone

Terminal CMD libre pour s'entraîner sans contrainte de scénario.

**8 machines pré-configurées :**

| Machine | IP | Contexte simulé |
|---------|----|-----------------|
| PC-MARKETING-01 | 192.168.1.45 | Fonctionnel — entraînement libre |
| PC-JURIDIQUE-03 | 192.168.1.78 | Mot de passe AD expiré |
| PC-COMPTA-07 | 192.168.1.92 | Compte AD verrouillé |
| PC-RH-02 | APIPA | Sans internet (DHCP échoué) |
| PC-DIRECTION-01 | 192.168.1.55 | Imprimante hors ligne |
| PC-ETAGE3-12 | 192.168.1.112 | GPO non appliquée |
| PC-LOGISTIQUE-04 | 192.168.1.134 | Partage réseau sans accès |
| PC-ACHATS-09 | 192.168.1.67 | Fichiers système corrompus |

**Commandes rapides (chips cliquables) :**
`ipconfig /all` · `ping 8.8.8.8` · `net user` · `gpupdate /force` · `sc query spooler` · `tasklist` · `sfc /scannow` · `netstat -an`

**Légende des couleurs :**

| Couleur | Classe CSS | Signification |
|---------|-----------|---------------|
| Vert | `.term-ok` | Succès / OK |
| Rouge | `.term-error` | Erreur / Échec |
| Jaune | `.term-warn` | Avertissement |
| Bleu | `.term-info` | Invite / Info |
| Bleu clair | `.term-val` | Valeur / Résultat |
| Blanc gras | `.term-header` | En-tête de section |

**Scripts chargés :** `app.js`, `terminal.js`

---

### 3.7 `knowledge.html` — Base de connaissances

Grille de 6 catégories (contenu à développer).

| Carte | Icône | Description |
|-------|-------|-------------|
| Windows 10/11 | 💻 | BSOD, mises à jour, profils utilisateurs, registre, performance |
| Active Directory & GPO | 👥 | Utilisateurs, groupes, OU, stratégies de groupe, reset MDP |
| Windows Server | 🖨 | Rôles serveur, DHCP, DNS, partages réseau, services, monitoring |
| Microsoft 365 | ☁ | Outlook, Teams, OneDrive, SharePoint, licences, Exchange Online |
| Azure | ⚡ | Azure AD, Intune, VM, groupes de ressources, bases du cloud |
| Réseau (TCP/IP, DNS, DHCP) | 🌐 | ping, tracert, ipconfig, nslookup, modèle OSI, Wi-Fi |

**Scripts chargés :** `app.js`

---

## 4. JavaScript — Fichiers

### 4.1 `js/app.js` — Core (~200 lignes)

**Objet `TRANSLATIONS`** — toutes les clés en français :

```javascript
const TRANSLATIONS = {
  fr: {
    dashboard: "Tableau de bord",
    tickets: "Tickets",
    // ... ~180 clés
  }
};
```

**État global :**
```javascript
const App = {
  currentLang: 'fr',   // fixe — plus de changement de langue
  translations: {}
};
```

**Fonctions publiques :**

| Fonction | Description |
|----------|-------------|
| `loadLanguage('fr')` | Charge les traductions et applique au DOM |
| `t('clé')` | Retourne le texte traduit pour une clé |
| `applyTranslations()` | Met à jour tous les `[data-i18n]` dans le DOM |
| `initNavigation()` | Active le lien courant dans la sidebar |
| `initMobileMenu()` | Hamburger + overlay sur mobile |

**Règle importante :** `applyTranslations()` utilise `Node.TEXT_NODE` pour préserver les éléments enfants (`<span>` de comptage dans les boutons de filtre). Le contenu généré dynamiquement via `innerHTML` doit utiliser `t()` directement.

---

### 4.2 `js/terminal.js` — Moteur CMD (743 lignes)

IIFE qui expose une API publique :

```javascript
const Terminal = (() => {
  let ctx = { /* état du PC simulé */ };
  return { init, setContext, execute, printLine, blank };
})();
```

**API publique :**

| Méthode | Description |
|---------|-------------|
| `Terminal.init(outputEl, inputEl, promptEl)` | Initialise le terminal avec les éléments DOM |
| `Terminal.setContext(contextObj)` | Injecte le contexte d'un scénario |
| `Terminal.execute(command)` | Exécute une commande et affiche la sortie |
| `Terminal.printLine(text, cssClass)` | Affiche une ligne formatée |
| `Terminal.blank()` | Affiche une ligne vide |

**Flags de contexte (`terminalContext`) :**

| Flag | Type | Effet |
|------|------|-------|
| `hostname` | string | Nom du PC affiché dans le prompt |
| `username` | string | Nom d'utilisateur affiché |
| `domain` | string | Domaine AD |
| `ip` | string | Adresse IP (`'APIPA'` = 169.254.x.x) |
| `gateway` | string | Passerelle par défaut |
| `dns1` | string | DNS primaire |
| `adPasswordExpired` | bool | `net user` → MDP expiré |
| `adUserLocked` | bool | `net user` → Compte verrouillé |
| `gpoBroken` | bool | `gpupdate /force` → Erreur LDAP |
| `printerOK` | bool | `sc query spooler` → STOPPED si false |
| `printerIP` | string | IP de l'imprimante |
| `pingFails` | string[] | IPs/hosts qui retournent timeout |
| `internetOK` | bool | Tous les pings externes échouent si false |
| `serverShareOK` | bool | `net use` → Lecteurs déconnectés si false |
| `vpnOK` | bool | VPN ne se connecte pas |
| `sfcErrors` | bool | `sfc /scannow` → Fichiers corrompus trouvés |
| `services` | object | État par service (`{ DHCPServer: 'STOPPED' }`) |
| `dnsOK` | bool | `nslookup` échoue si false |

**Commandes supportées (25+) :**

```
ipconfig [/all] [/release] [/renew]
ping <host> [-t] [-n N]
tracert <host>
nslookup <host>
gpupdate [/force]
net user [<nom>] [/domain]
net use
net accounts
net start <service>
net stop <service>
sc query <service>
sc start <service>
sc stop <service>
tasklist [/fi "..."]
taskkill /pid <n> [/f]
netstat [-an] [-b]
arp -a
systeminfo
sfc /scannow
dism /online /cleanup-image /restorehealth
chkdsk [C:] [/f] [/r]
hostname
whoami
nltest /dsgetdc:<domain>
dsquery user
netsh int ip reset
netsh winsock reset
services.msc
gpedit.msc
dsa.msc
cls
dir [chemin]
cd [chemin]
help [commande]
```

---

### 4.3 `js/scenarios.js` — Scénarios (747 lignes)

Structure de l'objet `SCENARIOS` :
```javascript
const SCENARIOS = {
  easy:   [ /* 5 scénarios */ ],
  medium: [ /* 4 scénarios */ ],  // ← windows-shared-folder-denied compté ici
  hard:   [ /* 4 scénarios */ ]
};
```

**Structure d'un scénario :**
```javascript
{
  id: 'kebab-case-unique',
  category: 'AD/GPO | Windows | M365 | Réseau | Server | Azure',
  level: 1 | 2,
  difficulty: 'easy | medium | hard',
  caller: 'Prénom Nom',
  dept: 'Service',
  mood: 'calm | frustrated | angry | panicked',
  issue: 'Titre court du problème',
  terminalContext: { /* flags */ },
  messages: [
    { from: 'caller', text: '...' }
  ],
  steps: [
    {
      question: '...',
      options: [
        { text: '...', correct: false, feedback: '...' },
        { text: '...', correct: false, feedback: '...' },
        { text: '...', correct: true,  feedback: '...' },
        { text: '...', correct: false, feedback: '...' }
      ],
      hint: '...',
      terminalCommand: '...',   // optionnel
      callerReply: '...'        // optionnel — affiché après bonne réponse
    }
  ]
}
```

**Fonctions helpers :**

| Fonction | Retourne |
|----------|----------|
| `getAllScenarios()` | Tous les scénarios dans un tableau plat |
| `getScenariosByCategory(cat)` | Scénarios filtrés par catégorie |
| `getRandomScenario(difficulty)` | Un scénario aléatoire du niveau |
| `getScenarioById(id)` | Le scénario correspondant à l'ID |

---

### 4.4 `js/progress.js` — Progression (196 lignes)

IIFE qui expose l'API `Progress`.

**Barème XP :**

| Difficulté | XP de base | Bonus (score ≥ 80%) |
|------------|-----------|---------------------|
| easy | 50 XP | + 12 XP |
| medium | 100 XP | + 25 XP |
| hard | 200 XP | + 50 XP |

**Niveaux :**

| ID | Nom | XP minimum | Étoiles |
|----|-----|-----------|---------|
| `rookie` | Débutant | 0 XP | ⭐ |
| `tech_n1` | Technicien N1 | 150 XP | ⭐⭐ |
| `spec_n1` | Spécialiste N1 | 400 XP | ⭐⭐⭐ |
| `tech_n2` | Technicien N2 | 800 XP | ⭐⭐⭐⭐ |
| `expert_n2` | Expert N2 | 1500 XP | ⭐⭐⭐⭐⭐ |
| `senior` | N2 Confirmé | 2500 XP | ⭐⭐⭐⭐⭐⭐ |

**Badges (8 total) :**

| ID | Icône | Nom | Condition |
|----|-------|-----|-----------|
| `first_call` | ☎ | Premier Appel | 1 scénario terminé |
| `perfect` | ✔ | Perfectionniste | Score 100% obtenu |
| `streak_5` | ⚡ | En Série | 5 scénarios terminés |
| `ad_expert` | 👥 | AD Expert | 3 scénarios AD/GPO |
| `network_pro` | 🌐 | Network Pro | 3 scénarios réseau |
| `n2_ready` | 🏋 | Prêt N2 | 2 scénarios difficiles |
| `polyvalent` | 🌟 | Polyvalent | 3 catégories différentes |
| `speed` | ⏰ | Quick Fix | Appel terminé en < 2 min |

**API publique :**

| Méthode | Description |
|---------|-------------|
| `Progress.addResult({ id, category, difficulty, score, duration })` | Enregistre un résultat, retourne `{ xpEarned, newBadges }` |
| `Progress.getStats()` | Retourne toutes les stats agrégées |
| `Progress.getHistory()` | Tableau de tous les appels enregistrés |
| `Progress.getTotalXP(history)` | Calcule le XP total |
| `Progress.getLevel(xp)` | Retourne l'objet niveau pour un XP donné |
| `Progress.getNextLevel(xp)` | Retourne le prochain niveau (ou `null` si max) |
| `Progress.getLevelProgress(xp)` | Pourcentage de progression vers le niveau suivant |
| `Progress.LEVELS` | Tableau de tous les niveaux |
| `Progress.BADGE_DEFS` | Tableau de toutes les définitions de badges |

---

## 5. Scénarios — Base de données

### Niveau 1 — Facile (5 scénarios)

| ID | Catégorie | Appelant | Service | Problème | Étapes |
|----|-----------|----------|---------|----------|--------|
| `ad-password-expired` | AD/GPO | Claire Petit | Juridique | Mot de passe expiré | 2 |
| `ad-account-locked` | AD/GPO | Lucas Moreau | Comptabilité | Compte AD verrouillé | 2 |
| `m365-outlook-disconnected` | M365 | Jean Martin | Ressources Humaines | Outlook Déconnecté | 2 |
| `windows-slow-pc` | Windows | Amélie Fontaine | Commercial | PC très lent (MsMpEng 90%) | 2 |
| `network-no-internet` | Réseau | Nadia Bensalem | Formation | IP APIPA — pas d'internet | 2 |

### Niveau 1 — Moyen (4 scénarios)

| ID | Catégorie | Appelant | Service | Problème | Étapes |
|----|-----------|----------|---------|----------|--------|
| `network-printer-offline` | Réseau | Sophie Lemaire | Marketing | Imprimante hors ligne + file bloquée | 3 |
| `network-vpn-failed` | Réseau | Marie Dupont | Comptabilité | VPN — certificat expiré | 3 |
| `m365-teams-crash` | M365 | Antoine Roux | Commercial | Teams plante — cache corrompu | 2 |
| `windows-shared-folder-denied` | Réseau | Pierre Morel | Logistique | Accès refusé dossier partagé | 3 |

### Niveau 2 — Difficile (4 scénarios)

| ID | Catégorie | Appelant | Service | Problème | Étapes |
|----|-----------|----------|---------|----------|--------|
| `ad-gpo-not-applied` | AD/GPO | Admin Réseau | IT | GPO filtrée — OU déplacée | 4 |
| `windows-bsod-critical` | Windows | Luc Bernard | Direction | BSOD CRITICAL_PROCESS_DIED | 4 |
| `server-service-down` | Server | Alice Moreau | IT/Helpdesk | Service DHCP arrêté — disque plein | 3 |
| `m365-azure-license` | Azure | Responsable RH | RH | Nouvelle employée sans licence M365 | 3 |

**Total : 13 scénarios — 35 étapes — 140 options de réponse**

---

## 6. Système de progression

### Flux complet

```
Scénario terminé
       ↓
Progress.addResult({ id, category, difficulty, score, duration })
       ↓
       ├── Enregistre dans callHistory (localStorage)
       ├── Calcule XP (base + bonus si score ≥ 80%)
       ├── Vérifie les badges débloqués
       └── Retourne { xpEarned, newBadges[] }
              ↓
simulation.html affiche l'écran de score
avec XP gagné + badges débloqués
              ↓
dashboard.html lit Progress.getStats()
et met à jour toutes les cartes
```

### `callHistory` — Structure d'une entrée

```javascript
{
  id: 'ad-password-expired',
  category: 'AD/GPO',
  difficulty: 'easy',
  score: 100,           // % de bonnes réponses
  duration: 87,         // secondes
  date: 1714000000000   // timestamp ms
}
```

---

## 7. Terminal simulé

### Architecture

Le terminal est une **IIFE** — il s'auto-exécute et retourne uniquement son API publique. Aucune variable globale n'est exposée sauf `Terminal`.

### Fonctionnement d'une commande

```
User tape commande
       ↓
Terminal.execute(cmd)
       ↓
Parser : cmd.toLowerCase().trim().split(' ')
       ↓
Switch sur cmd[0] (ipconfig, ping, net, sc…)
       ↓
Lecture du ctx courant (context-aware)
       ↓
printLine() avec classe CSS adaptée
```

### Exemples de comportement context-aware

**`ipconfig /all`** avec `ip: 'APIPA'` :
```
Adresse IPv4. . . . . : 169.254.142.37 (APIPA - Adresse auto-attribuée)
Serveur DHCP . . . . : INACCESSIBLE
```

**`gpupdate /force`** avec `gpoBroken: true` :
```
Erreur LDAP : Impossible de contacter le contrôleur de domaine.
Code d'erreur : 0x6D9 — The endpoint mapper failed.
```

**`sc query spooler`** avec `services: { spooler: 'STOPPED' }` :
```
SERVICE_NAME : spooler
        STATE              : 1  STOPPED
```

---

## 8. Design System (CSS)

### Variables CSS (`:root`)

```css
--bg-dark:       #0f172a   /* fond principal */
--bg-sidebar:    #1e293b   /* sidebar */
--bg-card:       #1e293b   /* cards */
--bg-input:      #334155   /* inputs, chips */
--text-primary:  #f1f5f9   /* texte principal */
--text-secondary:#94a3b8   /* texte secondaire */
--text-muted:    #64748b   /* texte discret */
--accent:        #3b82f6   /* bleu — action principale */
--success:       #22c55e   /* vert */
--warning:       #f59e0b   /* jaune */
--danger:        #ef4444   /* rouge */
--border:        #334155   /* bordures */
--radius:        8px        /* border-radius standard */
```

### Layout

```
┌─────────────────────────────────────────────┐
│  SIDEBAR (240px fixe)  │  MAIN-CONTENT       │
│  ─────────────────────  │  margin-left: 240px │
│  Logo                   │  ┌─ TOPBAR ────────┐│
│  Nav links              │  │ Hamburger Search ││
│  (aucun sélecteur       │  └─────────────────┘│
│   de langue)            │  PAGE-CONTENT       │
│                         │  APP-FOOTER         │
└─────────────────────────────────────────────┘
```

**Mobile (< 768px) :**
- Sidebar masquée par défaut (`transform: translateX(-100%)`)
- Hamburger `☰` visible dans la topbar
- Clic hamburger → sidebar `.open` + overlay actif

### Classes de badge

| Classe | Couleur | Usage |
|--------|---------|-------|
| `.badge-open` | Bleu | Ticket ouvert |
| `.badge-progress` | Jaune | En cours |
| `.badge-resolved` | Vert | Résolu |
| `.badge-closed` | Gris | Fermé |
| `.badge-low` | Vert | Priorité basse |
| `.badge-medium` | Jaune | Priorité moyenne |
| `.badge-high` | Rouge | Priorité haute |
| `.badge-critical` | Rouge intense | Priorité critique |

### Icônes (entités HTML)

Le projet n'utilise aucune librairie d'icônes. Tout est en entités HTML :

| Entité | Caractère | Usage |
|--------|-----------|-------|
| `&#9632;` | ■ | Dashboard nav |
| `&#9993;` | ✉ | Tickets nav |
| `&#9742;` | ☎ | Simulation nav |
| `&#9654;` | ▶ | Terminal nav |
| `&#9733;` | ★ | Knowledge nav |
| `&#9776;` | ☰ | Hamburger mobile |
| `&#128269;` | 🔍 | Icône recherche |

---

## 9. localStorage — Clés utilisées

| Clé | Type | Contenu |
|-----|------|---------|
| `user` | string | Nom de l'utilisateur connecté |
| `callHistory` | JSON array | Historique de tous les appels (scénarios complétés) |
| `earnedBadges` | JSON array | IDs des badges débloqués |

> **Note :** La clé `lang` n'est plus utilisée. La langue est fixée à `'fr'` directement dans `app.js`.

---

## 10. Règles de développement

### Règles critiques

1. **Pas de `fetch()` ni d'imports** — le site fonctionne en `file://`. Toutes les données sont inline.
2. **Pas de dépendances externes** — sans npm, CDN JS, ni frameworks.
3. **Pas de couleurs hardcodées en CSS** — toujours `var(--accent)`, jamais `#3b82f6`.
4. **Pas d'emoji de drapeau** — `🇫🇷` ne s'affiche pas sur Windows.
5. **Un seul fichier CSS** — nouveaux styles ajoutés à la fin de `style.css` avec un commentaire de section.
6. **Les fichiers `lang/*.json` sont obsolètes** — ne jamais les éditer ni réactiver.

### Traductions

- Tout texte visible doit avoir `data-i18n="clé"` dans le HTML
- La clé doit exister dans `TRANSLATIONS.fr` dans `app.js`
- Le contenu généré dynamiquement via `innerHTML` utilise `t('clé')` directement (pas `data-i18n`)
- `applyTranslations()` préserve les éléments enfants via `Node.TEXT_NODE`

### Scénarios

- L'`id` est unique, en kebab-case
- Chaque étape a **exactement 4 options**, **une seule correcte**
- Le `feedback` des options incorrectes explique **pourquoi c'est faux** (pédagogique)
- Le `terminalCommand` doit être une commande **réellement supportée** par `terminal.js`
- Le `terminalContext` doit refléter **exactement** l'état du PC du scénario
- Le `callerReply` n'apparaît qu'après une **bonne réponse**

### Terminal

- Ne pas casser les commandes existantes — vérifier les effets de contexte avant de modifier
- Les nouvelles commandes s'ajoutent dans le `switch` de `terminal.js`
- Respecter les classes CSS de couleur (`.term-ok`, `.term-error`, etc.)

---

## 11. Environnement fictif

Tous les scénarios partagent le même environnement pour la cohérence :

| Élément | Valeur |
|---------|--------|
| Domaine AD | `CORP.LOCAL` |
| Contrôleur de domaine | `DC01.CORP.LOCAL` |
| Serveur de fichiers | `SRV-FILES` |
| Sous-réseau | `192.168.1.0/24` |
| Passerelle | `192.168.1.1` |
| DNS primaire | `192.168.1.10` (= DC01) |
| DNS secondaire | `8.8.8.8` |
| Imprimante réseau | `192.168.1.200` |
| Format PCs | `PC-[DEPT]-[NUM]` (ex: `PC-JURIDIQUE-03`) |
| Format utilisateurs | `prenom.nom` (ex: `claire.petit`) |
| Départements | Juridique, Comptabilité, RH, Marketing, Direction, Commercial, Logistique, IT, Formation |

---

## 12. Roadmap

| # | Fonctionnalité | Priorité | Notes |
|---|----------------|----------|-------|
| 1 | Contenu réel dans la base de connaissances | Haute | Articles par catégorie |
| 2 | Étendre à 30+ scénarios | Haute | Suivre la structure de `scenarios.js` |
| 3 | Intégration XP / badges dans `simulation.html` | Haute | `Progress.addResult()` déjà disponible |
| 4 | Mode examen — sans indices, chronométré | Moyenne | Variante de la simulation |
| 5 | Login multi-profils | Moyenne | `localStorage` par nom |
| 6 | Notifications toast / alertes SLA | Basse | CSS + JS pur |
| 7 | Page de configuration | Basse | Reset, préférences |
