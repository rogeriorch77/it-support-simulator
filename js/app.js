/* ============================================
   IT SUPPORT SIMULATOR — Main App JS
   Translations embedded inline (no fetch needed,
   works on file:// and any server).
   ============================================ */

// ---- TRANSLATIONS INLINE ----
const TRANSLATIONS = {
  fr: {
    lang_name: "Français",
    welcome: "Bienvenue",
    welcome_subtitle: "Plateforme de simulation pour le support informatique Niveau 1 & 2",
    dashboard: "Tableau de bord",
    tickets: "Tickets",
    simulation: "Simulation",
    knowledge: "Base de connaissances",
    interviews: "Entretiens",
    settings: "Paramètres",
    login: "Connexion",
    logout: "Déconnexion",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    login_btn: "Se connecter",
    login_title: "Connexion à la plateforme",
    login_subtitle: "Entrez vos identifiants pour accéder à la simulation",
    dashboard_title: "Tableau de bord",
    dashboard_subtitle: "Vue d'ensemble de votre progression",
    tickets_title: "Gestion des Tickets",
    tickets_subtitle: "Gérez les demandes de support comme dans un vrai environnement GLPI",
    simulation_title: "Simulation d'appels",
    simulation_subtitle: "Recevez de faux appels et résolvez les problèmes en temps réel",
    knowledge_title: "Base de connaissances",
    knowledge_subtitle: "Apprenez les fondamentaux du support IT",
    stat_tickets_open: "Tickets ouverts",
    stat_tickets_resolved: "Tickets résolus",
    stat_calls_done: "Appels terminés",
    stat_score: "Score global",
    stat_avg_time: "Temps moyen",
    stat_satisfaction: "Satisfaction",
    start_simulation: "Démarrer une simulation",
    new_ticket: "Nouveau ticket",
    select_language: "Langue",
    categories: "Catégories",
    cat_windows: "Windows 10/11",
    cat_ad: "Active Directory & GPO",
    cat_server: "Windows Server",
    cat_m365: "Microsoft 365",
    cat_azure: "Azure",
    cat_network: "Réseau (TCP/IP, DNS, DHCP)",
    search: "Rechercher...",
    priority: "Priorité",
    priority_low: "Basse",
    priority_medium: "Moyenne",
    priority_high: "Haute",
    priority_critical: "Critique",
    status: "Statut",
    status_open: "Ouvert",
    status_in_progress: "En cours",
    status_resolved: "Résolu",
    status_closed: "Fermé",
    no_tickets: "Aucun ticket pour le moment",
    caller: "Appelant",
    department: "Service",
    issue: "Problème",
    accept_call: "Accepter l'appel",
    end_call: "Terminer l'appel",
    no_simulation: "Cliquez sur « Démarrer une simulation » pour commencer",
    footer: "IT Support Simulator — Plateforme d'apprentissage",
    recent_activity: "Activité récente",
    tickets_by_category: "Tickets par catégorie",
    quick_actions: "Actions rapides",
    today: "Aujourd'hui",
    this_week: "Cette semaine",
    performance: "Performance",
    assigned_to: "Assigné à",
    created: "Créé le",
    description: "Description",
    category: "Catégorie",
    add_note: "Ajouter une note",
    notes: "Notes",
    close_ticket: "Fermer le ticket",
    take_ticket: "Prendre en charge",
    resolve_ticket: "Résoudre",
    reopen_ticket: "Réouvrir",
    ticket_details: "Détails du ticket",
    back_to_list: "Retour à la liste",
    filter_all: "Tous",
    filter_open: "Ouverts",
    filter_progress: "En cours",
    filter_resolved: "Résolus",
    no_results: "Aucun résultat",
    sla_warning: "Attention SLA",
    sla_ok: "SLA respecté",
    sla_breach: "SLA dépassé",
    minutes: "min",
    hours: "h",
    call_timer: "Durée de l'appel",
    caller_mood: "Humeur de l'appelant",
    mood_calm: "Calme",
    mood_frustrated: "Frustré(e)",
    mood_angry: "En colère",
    mood_panicked: "Paniqué(e)",
    your_response: "Votre réponse",
    send_response: "Envoyer",
    create_ticket_from_call: "Créer un ticket",
    call_summary: "Résumé de l'appel",
    call_score: "Score de l'appel",
    next_call: "Appel suivant",
    hint: "💡 Indice",
    show_hint: "💡 Afficher un indice",
    correct_answer: "Bonne réponse !",
    wrong_answer: "Essayez encore",
    difficulty: "Difficulté",
    difficulty_easy: "Facile",
    difficulty_medium: "Moyen",
    difficulty_hard: "Difficile",
    level_1: "Niveau 1",
    level_2: "Niveau 2",
    scenario_complete: "Scénario terminé !",
    time_spent: "Temps passé",
    actions_taken: "Actions effectuées",
    open_since: "Ouvert depuis",
    last_update: "Dernière mise à jour",
    tech_assigned: "Technicien",
    /* Knowledge base card descriptions */
    desc_windows: "BSOD, mises à jour, profils utilisateurs, registre, performance, dépannage courant.",
    desc_ad: "Gestion des utilisateurs, groupes, OU, stratégies de groupe, réinitialisation de mots de passe.",
    desc_server: "Rôles serveur, DHCP, DNS, partages réseau, gestion des services, monitoring.",
    desc_m365: "Outlook, Teams, OneDrive, SharePoint, licences, administration Exchange Online.",
    desc_azure: "Azure AD, Intune, machines virtuelles, groupes de ressources, bases du cloud.",
    desc_network: "ping, tracert, ipconfig, nslookup, modèle OSI, diagnostic réseau, Wi-Fi.",
    /* Dashboard */
    sla_performance: "SLA Performance",
    activity_title: "Activité récente",
    quick_actions_title: "Actions rapides",
    nav_terminal: "Terminal",
    /* Progress / XP / Badges */
    xp_label: "XP",
    level_label: "Niveau",
    next_level: "Prochain niveau",
    max_level: "Niveau max atteint !",
    your_badges: "Vos badges",
    badge_locked: "Verrouillé",
    xp_earned: "XP gagné",
    new_badge: "Nouveau badge !",
    calls_completed: "Appels effectués",
    avg_score_label: "Score moyen",
    unique_scenarios: "Scénarios uniques",
    /* Terminal */
    terminal_title: "Terminal CMD Simulé",
    terminal_subtitle: "Pratiquez les commandes Windows comme dans un vrai environnement de support IT",
    terminal_choose_machine: "Choisir un poste à diagnostiquer :",
    terminal_quick_cmds: "Commandes rapides :",
    terminal_legend: "Légende des couleurs",
    terminal_legend_ok: "■ Succès / OK",
    terminal_legend_error: "■ Erreur / Échec",
    terminal_legend_warn: "■ Avertissement",
    terminal_legend_info: "■ Invite / Info",
    terminal_legend_val: "■ Valeur / Résultat",
    terminal_legend_header: "■ En-tête de section",
    terminal_titlebar: "Invite de commandes — Simulateur IT Support",
    mc_normal_desc: "Fonctionnel — Entraînement libre",
    mc_password_desc: "Mot de passe AD expiré",
    mc_locked_desc: "Compte AD verrouillé",
    mc_nointernet_desc: "Pas d'accès Internet (DHCP)",
    mc_printer_desc: "Imprimante réseau hors ligne",
    mc_gpo_desc: "GPO non appliquée",
    mc_fileshare_desc: "Accès partage réseau refusé",
    mc_sfc_desc: "Fichiers système corrompus",
    cat_network_short: "Réseaux",
    /* Simulation */
    cancel: "Annuler",
    step: "Étape",
    try_cmd: "▶ Essayez :",
    score_correct_label: "Correct",
    hints_used: "Indices utilisés",
    choose_scenario: "← Choisir un scénario",
    random_scenario: "Aléatoire ►",
    score_excellent: "Excellent travail ! Vous maîtrisez ce scénario.",
    score_good: "Bien ! Consultez les indices pour perfectionner votre approche.",
    score_poor: "Révisez la théorie sur ce sujet et réessayez.",
    pill_n1_easy: "N1 — Facile",
    pill_n1_medium: "N1 — Moyen",
    pill_n2_medium: "N2 — Moyen",
    pill_n2_hard: "N2 — Difficile",
    diff_easy_badge: "N1 — Facile",
    diff_medium_badge: "N1 — Moyen",
    diff_n2medium_badge: "N2 — Moyen",
    diff_hard_badge: "N2 — Difficile",
    /* Tickets */
    note_placeholder: "Ajouter une note...",
    no_notes: "Aucune note.",
    ticket_created_note: "Ticket créé.",
    status_changed: "Statut changé :"
  }
};

// ---- STATE ----
const App = {
  currentLang: 'fr',
  translations: TRANSLATIONS['fr']
};

// ---- LANGUAGE SYSTEM ----
function loadLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  App.translations = TRANSLATIONS[lang];
  App.currentLang = lang;
  applyTranslations();
}

function t(key) {
  return App.translations[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else if (el.children.length > 0) {
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          node.textContent = val + ' ';
          break;
        }
      }
    } else {
      el.textContent = val;
    }
  });
}

// ---- SIDEBAR / NAVIGATION ----
function initNavigation() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page);
  });
}

// ---- MOBILE MENU ----
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar-overlay');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  loadLanguage('fr');
});
