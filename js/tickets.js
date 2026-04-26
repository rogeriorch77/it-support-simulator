/* ============================================
   IT SUPPORT SIMULATOR — Ticket Database
   80 realistic N1/N2 support tickets
   Levels: 'N1 Facile' | 'N1 Moyen' | 'N2 Moyen' | 'N2 Difficile'
   ============================================ */

const TICKETS = [

  // ── WINDOWS (20) ──────────────────────────────────────────────

  { id: '001', level: 'N2 Difficile', issue: 'BSOD CRITICAL_PROCESS_DIED en boucle', caller: 'Luc Bernard', dept: 'Direction', category: 'Windows', priority: 'critical', status: 'open', sla: 'breach',
    description: "BSOD en boucle depuis ce matin : CRITICAL_PROCESS_DIED. Le PC redémarre avant d'atteindre le bureau. Le directeur a une réunion dans 30 min. Tous ses fichiers sont sur ce poste.",
    tech: '—', notes: [{ author: 'Système', date: '08:45', text: 'Ticket créé — priorité critique.' }] },

  { id: '002', level: 'N1 Moyen', issue: 'PC très lent — CPU à 100% en permanence', caller: 'Amélie Fontaine', dept: 'Commercial', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "PC inutilisable depuis 2 jours. Le gestionnaire des tâches indique MsMpEng.exe à 90% du CPU en permanence. L'utilisatrice ne peut plus travailler.",
    tech: '—', notes: [] },

  { id: '003', level: 'N2 Moyen', issue: 'Écran noir après mise à jour Windows', caller: 'Thomas Laurent', dept: 'Marketing', category: 'Windows', priority: 'high', status: 'open', sla: 'warning',
    description: "Après la mise à jour automatique de la nuit, le PC démarre mais reste sur écran noir après le login. Le curseur est visible mais rien d'autre.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '09:10', text: 'Tentative de redémarrage en mode sans échec. Désactivation du pilote graphique en cours.' }] },

  { id: '004', level: 'N1 Moyen', issue: 'Windows Update bloqué à 35%', caller: 'Hugo Garnier', dept: 'Comptabilité', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "La mise à jour KB5034441 est bloquée à 35% depuis 3 heures. Le PC ne répond plus. L'utilisateur a besoin de son poste pour les entretiens de l'après-midi.",
    tech: '—', notes: [] },

  { id: '005', level: 'N2 Moyen', issue: 'Profil utilisateur corrompu — bureau vide', caller: 'Isabelle Renaud', dept: 'Direction', category: 'Windows', priority: 'high', status: 'open', sla: 'warning',
    description: "Après une coupure de courant, l'utilisatrice se connecte avec un profil temporaire. Bureau vide, tous les favoris et fichiers locaux semblent inaccessibles. Présentation client dans 2h.",
    tech: '—', notes: [] },

  { id: '006', level: 'N1 Facile', issue: 'Disque C: plein — espace insuffisant', caller: 'Céline Morel', dept: 'Service Client', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Windows indique 0 Mo disponibles sur C:. Impossible d'ouvrir des documents ou de sauvegarder. Les fichiers temp et les anciennes mises à jour ont été identifiés comme cause probable.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '10:00', text: 'Lancement de cleanmgr /sageset:1. Suppression des fichiers Windows.old (8 Go récupérés).' },
      { author: 'Admin IT', date: '10:20', text: 'Ticket résolu. 12 Go libérés au total.' }
    ] },

  { id: '007', level: 'N1 Facile', issue: 'PC ne sort pas de veille', caller: 'Paul Lefevre', dept: 'Formation', category: 'Windows', priority: 'low', status: 'open', sla: 'ok',
    description: "Le PC entre en veille normalement mais ne se réveille pas quand l'utilisateur bouge la souris ou appuie sur une touche. Seul un redémarrage forcé fonctionne.",
    tech: '—', notes: [] },

  { id: '008', level: 'N2 Difficile', issue: 'BSOD PAGE_FAULT_IN_NONPAGED_AREA', caller: 'Marc Dupuis', dept: 'R&D', category: 'Windows', priority: 'critical', status: 'open', sla: 'breach',
    description: "BSOD aléatoire plusieurs fois par jour. Code d'erreur : PAGE_FAULT_IN_NONPAGED_AREA. Suspicion de RAM défectueuse ou pilote corrompu. Dump mémoire récupéré.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '11:00', text: 'Lancement de mdsched.exe. Analyse de la RAM en cours (redémarrage planifié).' }] },

  { id: '009', level: 'N2 Moyen', issue: 'Erreur DLL manquante au démarrage application', caller: 'Lucie Perrin', dept: 'Finance', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Au lancement du logiciel métier, message : « MSVCP140.dll est absent de votre ordinateur ». L'application est indispensable pour le suivi de production.",
    tech: '—', notes: [] },

  { id: '010', level: 'N1 Moyen', issue: 'Windows Defender — mise à jour des définitions échoue', caller: 'Alice Moreau', dept: 'IT / Helpdesk', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Windows Defender affiche une erreur 0x80070422 lors de la mise à jour des signatures. Le PC n'est plus protégé contre les nouvelles menaces.",
    tech: '—', notes: [] },

  { id: '011', level: 'N2 Moyen', issue: 'Fichiers système corrompus — sfc /scannow', caller: 'Romain Blanc', dept: 'Achats', category: 'Windows', priority: 'high', status: 'open', sla: 'ok',
    description: "L'utilisateur signale des erreurs aléatoires dans diverses applications. sfc /scannow exécuté et retourne des erreurs de fichiers système corrompus non réparables.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '14:00', text: 'DISM /Online /Cleanup-Image /RestoreHealth lancé. Durée estimée : 20 min.' },
      { author: 'Admin IT', date: '14:35', text: 'Réparation terminée. sfc /scannow repassé — aucune erreur. Ticket résolu.' }
    ] },

  { id: '012', level: 'N1 Moyen', issue: 'Son ne fonctionne plus après mise à jour', caller: 'Julie Bernard', dept: 'Communication', category: 'Windows', priority: 'low', status: 'open', sla: 'ok',
    description: "Après Windows Update, plus aucun son. Le pilote audio Realtek semble avoir été remplacé par un pilote générique Microsoft incompatible.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '15:00', text: 'Réinstallation du pilote Realtek HD depuis le site constructeur. Son rétabli.' }] },

  { id: '013', level: 'N1 Facile', issue: 'Résolution écran incorrecte après redémarrage', caller: 'Nathalie Simon', dept: 'Qualité', category: 'Windows', priority: 'low', status: 'open', sla: 'ok',
    description: "L'écran est bloqué en 1024x768. La résolution native 1920x1080 n'est plus proposée dans les paramètres d'affichage.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '09:30', text: 'Mise à jour pilote GPU via Device Manager. Résolution native restaurée.' }] },

  { id: '014', level: 'N1 Moyen', issue: 'Application impossible à installer — droits insuffisants', caller: 'Pierre Morel', dept: 'Logistique', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'utilisateur tente d'installer Adobe Reader mais reçoit « Droits administrateur requis ». Le logiciel est validé par la DSI mais n'est pas encore dans le catalogue SCCM.",
    tech: '—', notes: [] },

  { id: '015', level: 'N2 Moyen', issue: 'PC redémarre automatiquement chaque nuit', caller: 'Franck Petit', dept: 'Production', category: 'Windows', priority: 'low', status: 'open', sla: 'ok',
    description: "Le PC redémarre automatiquement vers 2h du matin, interrompant les traitements planifiés. Cause probable : redémarrage forcé par Windows Update.",
    tech: '—', notes: [] },

  { id: '016', level: 'N2 Moyen', issue: 'Tâche planifiée ne s\'exécute pas', caller: 'Olivier Martin', dept: 'IT / Helpdesk', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Une tâche planifiée de sauvegarde ne s'exécute plus depuis 5 jours. Le planificateur de tâches indique : « Le compte spécifié n'est pas disponible. »",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '10:00', text: 'Compte de service ayant expiré. Renouvellement du mot de passe en cours.' }] },

  { id: '017', level: 'N2 Difficile', issue: 'Erreur winlogon.exe au démarrage', caller: 'Sylvie Rousseau', dept: 'Direction Générale', category: 'Windows', priority: 'critical', status: 'open', sla: 'breach',
    description: "Message au démarrage : « winlogon.exe — Application Error ». Le PC ne peut pas accéder au bureau. Utilisatrice membre de la direction générale. Escalade requise.",
    tech: '—', notes: [] },

  { id: '018', level: 'N1 Facile', issue: 'Imprimante locale — file d\'attente bloquée', caller: 'Sophie Lemaire', dept: 'Marketing', category: 'Windows', priority: 'low', status: 'open', sla: 'ok',
    description: "File d'impression bloquée — les documents restent en attente indéfiniment. Redémarrage du service Spooler nécessaire.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '11:15', text: 'net stop spooler, suppression des fichiers dans spool\\PRINTERS, net start spooler. Résolu.' }] },

  { id: '019', level: 'N1 Moyen', issue: 'Connexion bureau à distance refusée', caller: 'Isabelle Renaud', dept: 'Direction', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Télétravail : l'utilisatrice ne peut plus se connecter en RDP à son poste de bureau. Message : « Le bureau à distance ne peut pas se connecter. »",
    tech: '—', notes: [] },

  { id: '020', level: 'N1 Moyen', issue: 'PC lent au démarrage — 8 minutes pour arriver au bureau', caller: 'Jean-Paul Vidal', dept: 'Comptabilité', category: 'Windows', priority: 'medium', status: 'open', sla: 'ok',
    description: "Démarrage anormalement long depuis 2 semaines. MSConfig révèle 23 programmes au démarrage. Suspicion de logiciel tiers ajouté récemment.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '13:00', text: 'Audit des programmes au démarrage en cours via Autoruns.' }] },

  // ── MICROSOFT 365 (15) ────────────────────────────────────────

  { id: '021', level: 'N1 Moyen', issue: 'Outlook — impossible de synchroniser les e-mails', caller: 'Jean Martin', dept: 'Ressources Humaines', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "Outlook affiche « Déconnecté » depuis hier soir. Connexion internet fonctionnelle. L'utilisateur attend des documents RH importants pour les entretiens du jour.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '10:30', text: 'Profil Outlook recréé via Panneau de configuration. Test de synchronisation en cours.' }] },

  { id: '022', level: 'N1 Facile', issue: 'Teams — impossible de partager l\'écran', caller: 'Antoine Roux', dept: 'Commercial', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "Lors des réunions Teams, le bouton « Partager l'écran » est grisé. Le problème est apparu après une mise à jour de Windows. Présentation client impactée.",
    tech: '—', notes: [] },

  { id: '023', level: 'N1 Facile', issue: 'OneDrive bloqué en synchronisation — icône rouge', caller: 'Camille Dupont', dept: 'Marketing', category: 'M365', priority: 'low', status: 'open', sla: 'ok',
    description: "OneDrive affiche une icône rouge depuis 2 jours. Erreur 0x8004de40. Les fichiers locaux ne se synchronisent plus avec le cloud.",
    tech: '—', notes: [] },

  { id: '024', level: 'N2 Moyen', issue: 'SharePoint — accès refusé à un site d\'équipe', caller: 'Nadia Bensalem', dept: 'Formation', category: 'M365', priority: 'high', status: 'open', sla: 'warning',
    description: "L'utilisatrice n'a plus accès au site SharePoint Formation depuis hier. Erreur 403. Son manager confirme qu'elle devrait y avoir accès. Travail bloqué.",
    tech: '—', notes: [] },

  { id: '025', level: 'N2 Moyen', issue: 'Licence M365 expirée — perte d\'accès aux applications', caller: 'Responsable RH', dept: 'Ressources Humaines', category: 'M365', priority: 'high', status: 'open', sla: 'ok',
    description: "Suite au non-renouvellement d'une licence, un utilisateur n'a plus accès à Outlook, Teams et Word. Toutes les applications passent en mode lecture seule.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '09:00', text: 'Connexion au centre d\'administration M365. Réattribution d\'une licence E3.' },
      { author: 'Admin IT', date: '09:15', text: 'Licence active. Utilisateur reconnecté. Ticket résolu.' }
    ] },

  { id: '026', level: 'N1 Facile', issue: 'Calendrier Outlook non partagé avec le manager', caller: 'Laura Petit', dept: 'Finance', category: 'M365', priority: 'low', status: 'open', sla: 'ok',
    description: "Le manager ne peut pas voir le calendrier de sa collaboratrice malgré sa demande de partage. Les autorisations ne semblent pas s'être appliquées.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '14:00', text: 'Partage reconfiguré via OWA. Visibilité confirmée côté manager.' }] },

  { id: '027', level: 'N1 Facile', issue: 'Teams — qualité vidéo dégradée en réunion', caller: 'Bernard Leroy', dept: 'Direction', category: 'M365', priority: 'low', status: 'open', sla: 'ok',
    description: "La caméra Teams affiche une image floue et pixélisée. Les autres participants se plaignent. La webcam fonctionne normalement dans d'autres applications.",
    tech: '—', notes: [] },

  { id: '028', level: 'N1 Facile', issue: 'Outlook — signature automatique disparue', caller: 'Martine Girard', dept: 'Service Client', category: 'M365', priority: 'low', status: 'open', sla: 'ok',
    description: "Après une mise à jour d'Outlook, la signature professionnelle de l'utilisatrice a disparu. Elle doit signer manuellement chaque e-mail.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '15:30', text: 'Signature recréée et définie comme signature par défaut pour les nouveaux messages et les réponses.' }] },

  { id: '029', level: 'N1 Moyen', issue: 'Impossible d\'ouvrir les fichiers SharePoint dans Office', caller: 'Éric Bonnet', dept: 'Juridique', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "Quand l'utilisateur clique sur un fichier Excel depuis SharePoint, Office demande une reconnexion en boucle. Le fichier ne s'ouvre jamais.",
    tech: '—', notes: [] },

  { id: '030', level: 'N1 Facile', issue: 'Boîte mail pleine — quota 50 Go dépassé', caller: 'Christine Faure', dept: 'Comptabilité', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "Outlook indique que la boîte mail est pleine. L'utilisatrice ne peut plus envoyer ni recevoir d'e-mails. Le quota de 50 Go est atteint.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '10:00', text: 'Aide à l\'archivage des anciens dossiers. Activation de l\'archivage automatique en cours.' }] },

  { id: '031', level: 'N1 Moyen', issue: 'MFA — code SMS non reçu', caller: 'Marie Dupont', dept: 'Comptabilité', category: 'M365', priority: 'high', status: 'open', sla: 'warning',
    description: "L'utilisatrice ne reçoit plus les codes SMS de double authentification. Impossible de se connecter à M365 depuis son nouveau téléphone. Numéro changé récemment.",
    tech: '—', notes: [] },

  { id: '032', level: 'N1 Moyen', issue: 'Teams — impossible de rejoindre une réunion externe', caller: 'Stéphane Colin', dept: 'Commercial', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'utilisateur ne peut pas rejoindre des réunions Teams organisées par des entreprises externes. Message : « Vous n'êtes pas autorisé à rejoindre cette réunion. »",
    tech: '—', notes: [] },

  { id: '033', level: 'N2 Moyen', issue: 'Nouvelle employée sans accès M365', caller: 'Responsable RH', dept: 'Ressources Humaines', category: 'M365', priority: 'medium', status: 'open', sla: 'ok',
    description: "Employée arrivée lundi. Compte AD créé mais aucune licence M365 assignée. Pas d'accès à Outlook, Teams ni OneDrive. Travail bloqué depuis 2 jours.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '08:30', text: 'Licence M365 E3 attribuée via le portail admin.' },
      { author: 'Admin IT', date: '08:45', text: 'Accès confirmé. Ticket résolu.' }
    ] },

  { id: '034', level: 'N1 Moyen', issue: 'Excel — fichier corrompu impossible à ouvrir', caller: 'Valérie Lemoine', dept: 'Finance', category: 'M365', priority: 'high', status: 'open', sla: 'warning',
    description: "Un fichier Excel contenant les données de clôture mensuelle ne s'ouvre plus. Message : « Le fichier est endommagé et ne peut pas être ouvert. » Sauvegarde introuvable.",
    tech: '—', notes: [] },

  { id: '035', level: 'N1 Moyen', issue: 'Règles Outlook — transfert automatique non fonctionnel', caller: 'Denis Marchand', dept: 'Juridique', category: 'M365', priority: 'low', status: 'open', sla: 'ok',
    description: "Une règle de transfert automatique vers une adresse externe a été bloquée par la politique de sécurité M365. L'utilisateur avait configuré ce transfert pour ses congés.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '16:00', text: 'Politique de prévention des transferts externes expliquée. Redirection interne configurée à la place.' }] },

  // ── RÉSEAU (15) ───────────────────────────────────────────────

  { id: '036', level: 'N1 Moyen', issue: 'Impossible de se connecter au VPN', caller: 'Marie Dupont', dept: 'Comptabilité', category: 'Réseau', priority: 'high', status: 'open', sla: 'warning',
    description: "L'utilisatrice ne peut plus accéder au VPN depuis ce matin. Message : « Connexion échouée — délai d'attente dépassé ». A redémarré le PC sans succès. Clôtures mensuelles urgentes.",
    tech: '—', notes: [{ author: 'Système', date: '09:15', text: 'Ticket créé automatiquement via appel.' }] },

  { id: '037', level: 'N2 Moyen', issue: 'IP APIPA — pas d\'accès internet ni réseau', caller: 'Alice Moreau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'high', status: 'open', sla: 'warning',
    description: "ipconfig retourne une adresse 169.254.x.x. Le PC ne peut pas contacter le serveur DHCP. Aucun accès internet ou réseau interne.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '11:00', text: 'ipconfig /release + /renew lancés. DHCP ne répond pas. Vérification du câble et du port switch en cours.' }] },

  { id: '038', level: 'N1 Moyen', issue: 'Wi-Fi — déconnexion automatique toutes les heures', caller: 'Karim Mansouri', dept: 'Commercial', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "Le PC se déconnecte du Wi-Fi toutes les heures environ. La reconnexion est automatique mais interrompt les visioconférences. Problème apparu après mise à jour pilote.",
    tech: '—', notes: [] },

  { id: '039', level: 'N2 Moyen', issue: 'RDP impossible vers le serveur applicatif', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'high', status: 'open', sla: 'warning',
    description: "Depuis ce matin, impossible d'ouvrir une session RDP sur SRV-APPLI. Message : « Le bureau à distance ne peut pas se connecter. » Le service RDP semble actif côté serveur.",
    tech: '—', notes: [] },

  { id: '040', level: 'N1 Moyen', issue: 'Imprimante réseau 3e étage hors ligne', caller: 'Sophie Lemaire', dept: 'Marketing', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'imprimante réseau HP du 3e étage apparaît hors ligne pour tous les utilisateurs du plateau. File d'attente bloquée. Présentation à imprimer avant 14h.",
    tech: '—', notes: [] },

  { id: '041', level: 'N2 Moyen', issue: 'Accès lent au serveur de fichiers', caller: 'Pierre Morel', dept: 'Logistique', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'ouverture des fichiers sur \\\\SRV-FILES prend 30 à 60 secondes. Le problème affecte tout le service Logistique. Travail significativement ralenti.",
    tech: '—', notes: [{ author: 'Admin IT', date: '14:00', text: 'Analyse du trafic réseau avec Wireshark. Latence constatée sur le segment Logistique.' }] },

  { id: '042', level: 'N1 Moyen', issue: 'Pas d\'accès internet depuis la salle de conférence A', caller: 'Nadia Bensalem', dept: 'Formation', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "Les PC et laptops connectés en Wi-Fi dans la salle A n'ont pas d'accès internet. Le réseau interne fonctionne. Réunion avec client externe dans 1h.",
    tech: '—', notes: [] },

  { id: '043', level: 'N2 Difficile', issue: 'DNS — impossible de résoudre les noms internes', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'high', status: 'open', sla: 'warning',
    description: "nslookup retourne des erreurs pour tous les noms internes (ex: dc01.corp.local). Les adresses IP directes fonctionnent. DNS primaire 192.168.1.10 semble avoir un problème.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '10:30', text: 'Service DNS sur DC01 redémarré. Tests en cours.' }] },

  { id: '044', level: 'N2 Moyen', issue: 'Partage réseau \\\\SRV-FILES\\RH inaccessible', caller: 'Claire Petit', dept: 'Juridique', category: 'Réseau', priority: 'high', status: 'open', sla: 'warning',
    description: "Tous les utilisateurs RH ont perdu l'accès au partage \\\\SRV-FILES\\RH depuis 8h. Erreur « Le chemin réseau spécifié est introuvable. » Processus de paie bloqué.",
    tech: '—', notes: [] },

  { id: '045', level: 'N2 Moyen', issue: 'VPN instable — déconnexions fréquentes en télétravail', caller: 'Isabelle Renaud', dept: 'Direction', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "En télétravail, la connexion VPN se coupe toutes les 15-20 minutes. L'utilisatrice perd ses sessions RDP et doit tout relancer. Productivité fortement impactée.",
    tech: '—', notes: [] },

  { id: '046', level: 'N2 Moyen', issue: 'Proxy bloque l\'accès à un site partenaire', caller: 'Franck Petit', dept: 'Production', category: 'Réseau', priority: 'low', status: 'open', sla: 'ok',
    description: "Le site extranet du partenaire bancaire est bloqué par le proxy d'entreprise. L'utilisateur en a besoin pour les virements. Validation manager fournie.",
    tech: '—', notes: [] },

  { id: '047', level: 'N2 Difficile', issue: 'Latence élevée détectée vers le datacenter', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "tracert vers le datacenter montre une latence de 250ms sur le 3e saut (routeur cœur de réseau). Valeur normale : 5ms. Impact sur les applications hébergées.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '09:00', text: 'Interface saturée sur routeur cœur identifiée. QoS reconfiguré.' },
      { author: 'Admin IT', date: '09:45', text: 'Latence retombée à 4ms. Ticket résolu.' }
    ] },

  { id: '048', level: 'N2 Difficile', issue: 'Switch du 2e étage en panne — plateau hors réseau', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'critical', status: 'open', sla: 'breach',
    description: "Le switch HP Aruba du 2e étage ne répond plus au ping. 28 postes sans réseau. Aucune redondance sur ce segment. Impact total sur les équipes Marketing et RH.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '08:00', text: 'Switch redémarré — aucun changement. Probable panne matérielle.' },
      { author: 'Admin IT', date: '08:30', text: 'Switch de remplacement commandé en urgence. Livraison estimée 11h.' }
    ] },

  { id: '049', level: 'N1 Moyen', issue: 'Pas d\'accès réseau après déménagement de bureau', caller: 'Lucas Moreau', dept: 'Comptabilité', category: 'Réseau', priority: 'medium', status: 'open', sla: 'ok',
    description: "Suite au déménagement vers le bureau C204, le PC n'a plus accès au réseau. Le port réseau du bureau n'est pas patché dans la baie. VLAN non configuré.",
    tech: '—', notes: [] },

  { id: '050', level: 'N2 Difficile', issue: 'DHCP — plus d\'adresses distribuées — Bâtiment C', caller: 'Alice Moreau', dept: 'IT / Helpdesk', category: 'Réseau', priority: 'critical', status: 'open', sla: 'breach',
    description: "Le service DHCP ne distribue plus d'adresses IP dans le bâtiment C. Tous les postes récupèrent une IP APIPA. Étendue DHCP potentiellement épuisée ou service arrêté.",
    tech: '—', notes: [{ author: 'Système', date: '07:45', text: 'Alerte automatique — service DHCP non joignable.' }] },

  // ── ACTIVE DIRECTORY / GPO (12) ───────────────────────────────

  { id: '051', level: 'N1 Facile', issue: 'Mot de passe expiré — impossible de se connecter', caller: 'Claire Petit', dept: 'Juridique', category: 'AD/GPO', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'utilisatrice ne peut plus ouvrir sa session Windows. Mot de passe expiré. L'option de changement n'est pas visible à l'écran de connexion.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '09:00', text: 'Reset du mot de passe via ADUC. Case « Doit changer au prochain login » cochée.' },
      { author: 'Admin IT', date: '09:10', text: 'Utilisatrice reconnectée. Ticket résolu.' }
    ] },

  { id: '052', level: 'N1 Facile', issue: 'Compte Active Directory verrouillé', caller: 'Lucas Moreau', dept: 'Comptabilité', category: 'AD/GPO', priority: 'medium', status: 'open', sla: 'ok',
    description: "Compte verrouillé après plusieurs tentatives de connexion échouées. L'utilisateur suspecte un autre appareil encore connecté avec l'ancien mot de passe.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '10:00', text: 'Compte déverrouillé via ADUC. Recherche des sources de verrouillage avec l\'outil LockoutStatus.' },
      { author: 'Admin IT', date: '10:15', text: 'Ancien téléphone professionnel identifié. Compte mis à jour sur l\'appareil.' }
    ] },

  { id: '053', level: 'N2 Difficile', issue: 'GPO de sécurité non appliquée — postes du 3e étage', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'warning',
    description: "Les nouvelles GPO de sécurité ne s'appliquent pas sur 12 postes du 3e étage. gpresult /r montre des erreurs. Risque de non-conformité sécurité.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '11:00', text: 'Vérification des liens GPO dans les OU. Les postes semblent avoir été déplacés vers une mauvaise OU.' },
      { author: 'Admin IT', date: '11:30', text: 'gpupdate /force lancé sur 3 postes de test — 2 OK.' }
    ] },

  { id: '054', level: 'N2 Moyen', issue: 'Impossible de réinitialiser le mot de passe d\'un utilisateur', caller: 'Responsable RH', dept: 'Ressources Humaines', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'warning',
    description: "Un technicien N1 rapporte qu'il ne peut pas réinitialiser le mot de passe d'un utilisateur de la direction via ADUC. Message : « Droits insuffisants. »",
    tech: '—', notes: [] },

  { id: '055', level: 'N2 Moyen', issue: 'Utilisateur absent du groupe de sécurité VPN', caller: 'Karim Mansouri', dept: 'Commercial', category: 'AD/GPO', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'utilisateur ne peut pas se connecter au VPN malgré une demande validée. La vérification montre qu'il n'est pas membre du groupe AD « GRP-VPN-Users ».",
    tech: '—', notes: [] },

  { id: '056', level: 'N2 Moyen', issue: 'Accès refusé sur dossier partagé — droits NTFS incorrects', caller: 'Pierre Morel', dept: 'Logistique', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'warning',
    description: "L'utilisateur a accès au partage réseau mais reçoit « Accès refusé » sur un sous-dossier spécifique. Les permissions NTFS semblent incorrectes.",
    tech: '—', notes: [] },

  { id: '057', level: 'N2 Moyen', issue: 'Compte AD désactivé par erreur lors d\'un départ', caller: 'Responsable RH', dept: 'Ressources Humaines', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'ok',
    description: "Le compte d'un utilisateur encore en poste a été désactivé par erreur lors du traitement des départs RH. Il ne peut plus se connecter depuis ce matin.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '08:15', text: 'Compte réactivé dans ADUC. Utilisateur reconnecté. Procédure de désactivation revue.' }] },

  { id: '058', level: 'N2 Moyen', issue: 'Politique de mot de passe — complexité non respectée', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'AD/GPO', priority: 'medium', status: 'open', sla: 'ok',
    description: "Audit de sécurité : plusieurs comptes ont des mots de passe ne respectant pas la Fine-Grained Password Policy. La PSO semble ne pas s'appliquer à certains groupes.",
    tech: '—', notes: [] },

  { id: '059', level: 'N2 Moyen', issue: 'GPO de restriction — utilisateur ne peut plus installer', caller: 'Thomas Laurent', dept: 'Marketing', category: 'AD/GPO', priority: 'medium', status: 'open', sla: 'ok',
    description: "Depuis un déménagement d'OU, l'utilisateur ne peut plus installer de logiciels validés. Une GPO de restriction s'applique désormais à son poste.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '14:30', text: 'Poste replacé dans la bonne OU. GPresult confirme l\'application des bonnes politiques.' }] },

  { id: '060', level: 'N2 Difficile', issue: 'OU incorrecte — mauvaise GPO appliquée sur un poste', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'warning',
    description: "Un poste se retrouve dans l'OU Invités au lieu de l'OU Personnel. Les GPO de restriction lui sont appliquées : pas d'accès au panneau de configuration, bureau simplifié.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '09:00', text: 'Déplacement du poste dans l\'OU correcte. gpupdate /force en cours.' }] },

  { id: '061', level: 'N2 Difficile', issue: 'Compte de service expiré — application indisponible', caller: 'Olivier Martin', dept: 'IT / Helpdesk', category: 'AD/GPO', priority: 'critical', status: 'open', sla: 'breach',
    description: "Le mot de passe du compte de service SVC-BACKUP a expiré. Le service de sauvegarde ne peut plus s'authentifier. Aucune sauvegarde depuis 5 jours.",
    tech: '—', notes: [{ author: 'Système', date: '06:00', text: 'Alerte automatique — échec de sauvegarde consécutif.' }] },

  { id: '062', level: 'N2 Difficile', issue: 'Synchronisation Azure AD Connect non fonctionnelle', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'AD/GPO', priority: 'high', status: 'open', sla: 'warning',
    description: "Azure AD Connect n'a pas synchronisé depuis 6 heures. Les nouveaux comptes créés en local ne sont pas disponibles dans Azure AD. Accès M365 bloqué pour les nouveaux.",
    tech: '—', notes: [] },

  // ── HARDWARE (10) ─────────────────────────────────────────────

  { id: '063', level: 'N1 Facile', issue: 'Écran externe non détecté', caller: 'Amélie Fontaine', dept: 'Commercial', category: 'Hardware', priority: 'low', status: 'open', sla: 'ok',
    description: "Après un déménagement de bureau, l'écran externe du laptop n'est plus détecté. Le câble DisplayPort a été changé. Le problème persiste.",
    tech: '—', notes: [] },

  { id: '064', level: 'N1 Facile', issue: 'Webcam non reconnue dans Teams', caller: 'Bernard Leroy', dept: 'Direction', category: 'Hardware', priority: 'medium', status: 'open', sla: 'ok',
    description: "La webcam USB Logitech n'est plus reconnue dans Teams ni dans le gestionnaire de périphériques. Elle fonctionnait correctement jusqu'à hier. Réunion direction cet après-midi.",
    tech: '—', notes: [] },

  { id: '065', level: 'N1 Moyen', issue: 'Docking station ne charge plus le laptop', caller: 'Valérie Lemoine', dept: 'Finance', category: 'Hardware', priority: 'medium', status: 'open', sla: 'ok',
    description: "La station d'accueil Dell WD19 ne charge plus le laptop et ne transmet plus le signal vidéo. Le laptop fonctionne sur batterie. La docking était tombée du bureau.",
    tech: '—', notes: [] },

  { id: '066', level: 'N1 Facile', issue: 'Imprimante locale — papier coincé persistant', caller: 'Martine Girard', dept: 'Service Client', category: 'Hardware', priority: 'low', status: 'open', sla: 'ok',
    description: "Message de bourrage papier persistant même après retrait du papier. Le capteur de papier semble défectueux.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '15:00', text: 'Réinitialisation de l\'imprimante. Capteur nettoyé à l\'air comprimé. Impression de test OK.' }] },

  { id: '067', level: 'N1 Moyen', issue: 'Scanner réseau non détecté par les postes', caller: 'Romain Blanc', dept: 'Achats', category: 'Hardware', priority: 'low', status: 'open', sla: 'ok',
    description: "Le scanner réseau du service Achats n'apparaît plus dans la liste des scanners disponibles. Il est allumé et accessible via son interface web.",
    tech: '—', notes: [] },

  { id: '068', level: 'N1 Moyen', issue: 'Batterie laptop — autonomie de 20 minutes seulement', caller: 'Sylvie Rousseau', dept: 'Direction Générale', category: 'Hardware', priority: 'medium', status: 'open', sla: 'ok',
    description: "La batterie du laptop passe de 100% à 0% en moins de 20 minutes. Le rapport de batterie Windows indique une capacité actuelle de 12% de la capacité d'origine.",
    tech: '—', notes: [] },

  { id: '069', level: 'N1 Facile', issue: 'Souris Bluetooth — déconnexion répétée', caller: 'Julie Bernard', dept: 'Communication', category: 'Hardware', priority: 'low', status: 'open', sla: 'ok',
    description: "La souris Bluetooth se déconnecte toutes les 10-15 minutes. Nécessite d'être reconnectée manuellement. Productivité impactée.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '10:00', text: 'Remplacement des piles. Reparage Bluetooth. Problème résolu. Ticket fermé.' }] },

  { id: '070', level: 'N1 Moyen', issue: 'Écran qui scintille — signal instable', caller: 'Marc Dupuis', dept: 'R&D', category: 'Hardware', priority: 'medium', status: 'open', sla: 'ok',
    description: "L'écran principal du poste scintille aléatoirement plusieurs fois par heure. Le problème disparaît en bougeant le câble HDMI. Câble ou port défectueux.",
    tech: '—', notes: [] },

  { id: '071', level: 'N1 Facile', issue: 'Touches de fonction laptop inversées après BIOS update', caller: 'Hugo Garnier', dept: 'Comptabilité', category: 'Hardware', priority: 'low', status: 'open', sla: 'ok',
    description: "Après une mise à jour du BIOS, les touches de fonction (F1-F12) se comportent comme les touches multimédia sans appuyer sur Fn.",
    tech: 'Admin IT', notes: [{ author: 'Admin IT', date: '11:00', text: 'Modification du paramètre Function Key Behavior dans le BIOS (Action Keys Mode → Disabled). Résolu.' }] },

  { id: '072', level: 'N1 Facile', issue: 'Casque audio — micro non détecté en réunion', caller: 'Céline Morel', dept: 'Service Client', category: 'Hardware', priority: 'medium', status: 'open', sla: 'ok',
    description: "Le casque USB Jabra est détecté pour le son mais son microphone n'apparaît pas dans les paramètres audio. Les clients ne peuvent pas entendre l'utilisatrice en appel.",
    tech: '—', notes: [] },

  // ── SÉCURITÉ (5) ──────────────────────────────────────────────

  { id: '073', level: 'N2 Moyen', issue: 'Alerte antivirus — fichier en quarantaine', caller: 'Alice Moreau', dept: 'IT / Helpdesk', category: 'Sécurité', priority: 'high', status: 'open', sla: 'warning',
    description: "Windows Defender a mis en quarantaine un fichier téléchargé depuis un mail. L'utilisatrice n'est pas sûre d'avoir cliqué sur une pièce jointe suspecte. PC potentiellement compromis.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '09:30', text: 'PC isolé du réseau. Analyse complète Defender lancée. Vérification des connexions réseau suspectes.' },
      { author: 'Admin IT', date: '10:00', text: 'Aucune autre menace détectée. Analyse de l\'historique des connexions en cours.' }
    ] },

  { id: '074', level: 'N1 Moyen', issue: 'Tentative de phishing signalée par un utilisateur', caller: 'Christine Faure', dept: 'Comptabilité', category: 'Sécurité', priority: 'high', status: 'open', sla: 'ok',
    description: "L'utilisatrice a reçu un mail imitant la DSI demandant ses identifiants. Elle n'a pas cliqué mais transfère le mail. Campagne de phishing possible en cours.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '14:00', text: 'Mail analysé. Domaine expéditeur bloqué dans Exchange Online. Alerte diffusée à tous les utilisateurs.' },
      { author: 'Admin IT', date: '14:30', text: 'Aucun utilisateur compromis identifié. Ticket résolu.' }
    ] },

  { id: '075', level: 'N2 Difficile', issue: 'Ransomware suspecté — fichiers chiffrés', caller: 'Luc Bernard', dept: 'Direction', category: 'Sécurité', priority: 'critical', status: 'open', sla: 'breach',
    description: "Un utilisateur signale que ses fichiers ont été renommés avec l'extension .locked. Des fichiers README_DECRYPT.txt sont présents. PC immédiatement débranché du réseau.",
    tech: '—', notes: [
      { author: 'Système', date: '11:00', text: 'ALERTE CRITIQUE — PC isolé physiquement du réseau.' },
      { author: 'Admin IT', date: '11:05', text: 'Cellule de crise activée. RSSI informé. Analyse forensique en cours.' }
    ] },

  { id: '076', level: 'N2 Difficile', issue: 'Connexion suspecte détectée sur compte AD', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Sécurité', priority: 'critical', status: 'open', sla: 'breach',
    description: "Les logs AD montrent des connexions depuis une IP externe inconnue sur un compte utilisateur à 3h du matin. L'utilisateur confirme ne pas s'être connecté. Compromission probable.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '08:00', text: 'Compte désactivé immédiatement. Réinitialisation du mot de passe forcée.' },
      { author: 'Admin IT', date: '08:30', text: 'Analyse des logs de connexion des 30 derniers jours en cours. RSSI informé.' }
    ] },

  { id: '077', level: 'N2 Moyen', issue: 'Clé USB inconnue trouvée et branchée sur poste sensible', caller: 'Éric Bonnet', dept: 'Juridique', category: 'Sécurité', priority: 'high', status: 'open', sla: 'warning',
    description: "Une clé USB sans étiquette a été trouvée dans la salle de réunion et branchée par curiosité sur un PC du service juridique. Le PC doit être analysé immédiatement.",
    tech: '—', notes: [{ author: 'Système', date: '10:00', text: 'Ticket créé — PC mis hors réseau en attente d\'analyse.' }] },

  // ── WINDOWS SERVER (3) ────────────────────────────────────────

  { id: '078', level: 'N2 Difficile', issue: 'Service DHCP arrêté — Bâtiment B sans réseau', caller: 'Alice Moreau', dept: 'IT / Helpdesk', category: 'Server', priority: 'critical', status: 'open', sla: 'ok',
    description: "Le service DHCP sur SRV-DC02 s'est arrêté. 45 postes du bâtiment B ont une IP APIPA. Cause : disque système plein à 100%, service incapable d'écrire les baux.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '07:30', text: 'Espace disque libéré (logs anciens supprimés, 15 Go récupérés). Service DHCP redémarré.' },
      { author: 'Admin IT', date: '07:45', text: 'Baux DHCP redistribués. Tous les postes ont une IP valide. Ticket résolu.' }
    ] },

  { id: '079', level: 'N2 Moyen', issue: 'Espace disque critique sur SRV-FILES — 98% utilisé', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Server', priority: 'high', status: 'open', sla: 'warning',
    description: "SRV-FILES affiche 98% d'utilisation sur le volume D: (données). Risque d'interruption de service imminent. Croissance anormale détectée dans le dossier partage Marketing.",
    tech: 'Admin IT', notes: [
      { author: 'Admin IT', date: '13:00', text: 'Identification des dossiers les plus volumineux via TreeSize. Dossier Marketing Videos : 180 Go de doublons.' },
      { author: 'Admin IT', date: '13:30', text: 'Demande d\'archivage envoyée au responsable Marketing. Quota de dossier en cours de configuration.' }
    ] },

  { id: '080', level: 'N2 Moyen', issue: 'Certificat SSL expiré — intranet inaccessible', caller: 'Admin Réseau', dept: 'IT / Helpdesk', category: 'Server', priority: 'high', status: 'open', sla: 'warning',
    description: "Le certificat SSL du serveur intranet a expiré hier à minuit. Les navigateurs affichent une erreur de sécurité. Les utilisateurs ne peuvent plus accéder aux applications internes.",
    tech: '—', notes: [{ author: 'Système', date: '00:01', text: 'Alerte automatique — certificat expiré.' }] }

];
