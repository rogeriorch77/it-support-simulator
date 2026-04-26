/* ============================================
   IT SUPPORT SIMULATOR — Scenario Translations
   Traduções dos campos dinâmicos dos cenários
   ============================================ */

const SCENARIO_I18N = {

  issue: {
    'ad-password-expired': {
      pt: 'Impossível fazer login — senha expirada',
      fr: 'Impossible de se connecter — mot de passe expiré',
      en: 'Unable to login — password expired'
    },
    'ad-account-locked': {
      pt: 'Conta do Active Directory bloqueada',
      fr: 'Compte Active Directory verrouillé',
      en: 'Active Directory account locked'
    },
    'm365-outlook-disconnected': {
      pt: 'Outlook mostra Desconectado — e-mails não chegam',
      fr: 'Outlook affiche Déconnecté — e-mails non reçus',
      en: 'Outlook shows Disconnected — emails not arriving'
    },
    'windows-slow-pc': {
      pt: 'PC muito lento — impossível trabalhar',
      fr: 'PC très lent — impossible de travailler',
      en: 'PC very slow — impossible to work'
    },
    'network-no-internet': {
      pt: 'Sem conexão à Internet no computador',
      fr: 'Plus de connexion Internet sur le poste',
      en: 'No Internet connection on the workstation'
    },
    'network-printer-offline': {
      pt: 'Impressora de rede offline — fila bloqueada',
      fr: 'Imprimante réseau hors ligne — file bloquée',
      en: 'Network printer offline — print queue stuck'
    },
    'network-vpn-failed': {
      pt: 'VPN — conexão falhou desde esta manhã',
      fr: 'VPN — connexion échouée depuis ce matin',
      en: 'VPN — connection failed since this morning'
    },
    'm365-teams-crash': {
      pt: 'Microsoft Teams trava ao iniciar',
      fr: 'Microsoft Teams plante au démarrage',
      en: 'Microsoft Teams crashes on startup'
    },
    'windows-shared-folder-denied': {
      pt: 'Acesso negado à pasta compartilhada de rede',
      fr: 'Accès refusé au dossier partagé réseau',
      en: 'Access denied to network shared folder'
    },
    'ad-gpo-not-applied': {
      pt: 'GPO de segurança não aplicada — 12 computadores do 3º andar',
      fr: 'GPO de sécurité non appliquée — 12 postes du 3e étage',
      en: 'Security GPO not applied — 12 workstations on 3rd floor'
    },
    'windows-bsod-critical': {
      pt: 'BSOD CRITICAL_PROCESS_DIED em loop — computador da diretoria',
      fr: 'BSOD CRITICAL_PROCESS_DIED en boucle — poste direction',
      en: 'BSOD CRITICAL_PROCESS_DIED loop — executive workstation'
    },
    'server-service-down': {
      pt: 'Serviço DHCP parado — todos os computadores do bloco B em APIPA',
      fr: 'Service DHCP arrêté — tous les postes du bâtiment B en APIPA',
      en: 'DHCP service stopped — all building B workstations on APIPA'
    },
    'm365-azure-license': {
      pt: 'Nova funcionária — sem acesso ao M365, Teams nem Azure AD',
      fr: 'Nouvelle employée — aucun accès M365, Teams ni Azure AD',
      en: 'New employee — no access to M365, Teams or Azure AD'
    },
    'm365-teams-external-meeting': {
      pt: 'Teams — impossível entrar em reunião de parceiro externo',
      fr: 'Teams — impossible de rejoindre une réunion d\'un partenaire externe',
      en: 'Teams — unable to join an external partner meeting'
    },
    'm365-mfa-no-sms': {
      pt: 'MFA — código SMS não recebido — impossível conectar ao Microsoft 365',
      fr: 'MFA — code SMS non reçu — impossible de se connecter à Microsoft 365',
      en: 'MFA — SMS code not received — unable to sign in to Microsoft 365'
    },
    'm365-outlook-forward-rule': {
      pt: 'Regra Outlook de encaminhamento automático criada mas e-mails não são encaminhados',
      fr: 'Règle Outlook de transfert automatique créée mais les e-mails ne sont pas transférés',
      en: 'Outlook auto-forward rule created but emails are not being forwarded'
    },
    'm365-excel-corrupted': {
      pt: 'Arquivo Excel corrompido — impossível abrir, erro a cada tentativa',
      fr: 'Fichier Excel corrompu — impossible à ouvrir, erreur à chaque tentative',
      en: 'Corrupted Excel file — unable to open, error on every attempt'
    },
    'windows-corrupted-profile': {
      pt: 'Perfil de usuário corrompido — área de trabalho vazia, nenhum documento pessoal visível',
      fr: 'Profil utilisateur corrompu — bureau vide, aucun document personnel visible',
      en: 'Corrupted user profile — empty desktop, no personal documents visible'
    },
    'windows-black-screen-update': {
      pt: 'Tela preta após atualização do Windows — impossível acessar a área de trabalho',
      fr: 'Écran noir après mise à jour Windows — impossible d\'accéder au bureau',
      en: 'Black screen after Windows update — unable to access the desktop'
    },
    'windows-sleep-no-wake': {
      pt: 'PC não sai do modo de suspensão — tela preta, sem reação ao teclado nem ao mouse',
      fr: 'PC ne sort pas de veille — écran noir, aucune réaction au clavier ni à la souris',
      en: 'PC won\'t wake from sleep — black screen, no reaction to keyboard or mouse'
    },
    'windows-disk-full': {
      pt: 'Disco C: cheio — impossível salvar arquivos, aplicações com erros',
      fr: 'Disque C: plein — impossible de sauvegarder, applications en erreur',
      en: 'Disk C: full — unable to save files, applications showing errors'
    },
    'windows-dll-missing': {
      pt: 'Erro DLL ausente — aplicação de negócios impossível de iniciar',
      fr: 'Erreur DLL manquante — application métier impossible à lancer',
      en: 'Missing DLL error — business application impossible to launch'
    },
    'windows-bsod-pagefault': {
      pt: 'BSOD PAGE_FAULT_IN_NONPAGED_AREA — travamentos repetidos várias vezes ao dia',
      fr: 'BSOD PAGE_FAULT_IN_NONPAGED_AREA — crashs répétés plusieurs fois par jour',
      en: 'BSOD PAGE_FAULT_IN_NONPAGED_AREA — repeated crashes several times a day'
    },
    'windows-system-files-corrupt': {
      pt: 'Arquivos de sistema Windows corrompidos — aplicações fechando aleatoriamente',
      fr: 'Fichiers système Windows corrompus — applications qui plantent aléatoirement',
      en: 'Corrupted Windows system files — applications crashing randomly'
    },
    'windows-defender-update-fail': {
      pt: 'Windows Defender — atualização das definições antivírus falha com erro',
      fr: 'Windows Defender — mise à jour des définitions antivirus échoue avec erreur',
      en: 'Windows Defender — antivirus definition update fails with error'
    },
    'windows-wrong-resolution': {
      pt: 'Resolução da tela incorreta após reinicialização — exibição borrada e ampliada',
      fr: 'Résolution d\'écran incorrecte après redémarrage — affichage flou et agrandi',
      en: 'Wrong screen resolution after restart — blurry and enlarged display'
    },
    'windows-no-sound-update': {
      pt: 'Som parou de funcionar após atualização do Windows — nenhum dispositivo de áudio',
      fr: 'Son ne fonctionne plus après mise à jour Windows — aucun périphérique audio',
      en: 'Sound stopped working after Windows update — no audio device'
    },
    'windows-auto-restart-night': {
      pt: 'PC reinicia automaticamente toda noite — trabalhos em andamento perdidos',
      fr: 'PC redémarre automatiquement chaque nuit — travaux en cours perdus',
      en: 'PC restarts automatically every night — work in progress lost'
    },
    'windows-install-rights': {
      pt: 'Aplicação impossível de instalar — erro de direitos insuficientes',
      fr: 'Application impossible à installer — erreur droits insuffisants',
      en: 'Application cannot be installed — insufficient rights error'
    },
    'windows-scheduled-task-fail': {
      pt: 'Tarefa agendada não executa — script de backup silencioso após rotação de senha',
      fr: 'Tâche planifiée Windows ne s\'exécute pas — script de sauvegarde silencieux',
      en: 'Windows scheduled task not running — silent backup script failure'
    },
    'windows-winlogon-error': {
      pt: 'Erro winlogon.exe na inicialização — impossível acessar a sessão Windows',
      fr: 'Erreur winlogon.exe au démarrage — impossible d\'accéder à la session Windows',
      en: 'winlogon.exe error at startup — unable to access Windows session'
    },
    'windows-print-queue-stuck': {
      pt: 'Fila de impressão travada — impossível imprimir ou cancelar documentos',
      fr: 'File d\'attente d\'impression bloquée — impossible d\'imprimer ni de supprimer',
      en: 'Print queue stuck — unable to print or delete documents'
    },
    'windows-slow-startup': {
      pt: 'PC muito lento ao iniciar — 8 minutos para chegar à área de trabalho',
      fr: 'PC très lent au démarrage — 8 minutes pour arriver au bureau Windows',
      en: 'PC very slow to start — 8 minutes to reach the Windows desktop'
    },
    'hardware-external-screen': {
      pt: 'Monitor externo não detectado — Windows exibe apenas uma tela',
      fr: 'Écran externe non détecté — Windows n\'affiche qu\'un seul écran',
      en: 'External screen not detected — Windows only shows one display'
    },
    'hardware-webcam-teams': {
      pt: 'Webcam não reconhecida no Teams — câmera indisponível na reunião',
      fr: 'Webcam non reconnue dans Teams — caméra indisponible en réunion',
      en: 'Webcam not recognized in Teams — camera unavailable in meeting'
    },
    'hardware-printer-paper-jam': {
      pt: 'Impressora local — erro de papel preso persistente após desobstrução',
      fr: 'Imprimante locale — erreur papier coincé persistante après dégagement',
      en: 'Local printer — persistent paper jam error after clearing'
    },
    'hardware-docking-no-charge': {
      pt: 'Docking station — laptop não carrega mais via estação de trabalho',
      fr: 'Docking station — le laptop ne se charge plus via la station d\'accueil',
      en: 'Docking station — laptop no longer charges through the dock'
    },
    'hardware-network-scanner': {
      pt: 'Scanner de rede não detectado pelos computadores do serviço',
      fr: 'Scanner réseau non détecté par les postes du service',
      en: 'Network scanner not detected by workstations'
    },
    'hardware-battery-drain': {
      pt: 'Bateria do laptop — autonomia de apenas 20 minutos',
      fr: 'Batterie laptop — autonomie de 20 minutes seulement',
      en: 'Laptop battery — only 20 minutes of battery life'
    },
    'hardware-bluetooth-mouse': {
      pt: 'Mouse Bluetooth — desconexões repetidas a cada poucos minutos',
      fr: 'Souris Bluetooth — déconnexions répétées toutes les quelques minutes',
      en: 'Bluetooth mouse — repeated disconnections every few minutes'
    },
    'hardware-screen-flickering': {
      pt: 'Monitor externo piscando — sinal de vídeo instável',
      fr: 'Écran externe qui scintille — signal vidéo instable',
      en: 'External screen flickering — unstable video signal'
    },
    'hardware-fn-keys-inverted': {
      pt: 'Teclas de função do laptop invertidas após atualização do BIOS',
      fr: 'Touches de fonction laptop inversées après mise à jour BIOS',
      en: 'Laptop function keys inverted after BIOS update'
    },
    'hardware-headset-mic': {
      pt: 'Headset — microfone não detectado na reunião Teams',
      fr: 'Casque audio — micro non détecté en réunion Teams',
      en: 'Headset — microphone not detected in Teams meeting'
    },
    'm365-mailbox-full': {
      pt: 'Caixa de e-mail Outlook cheia — quota de 50 GB ultrapassado, e-mails não recebidos',
      fr: 'Boîte mail Outlook pleine — quota 50 Go dépassé, e-mails non reçus',
      en: 'Outlook mailbox full — 50 GB quota exceeded, emails not received'
    },
    'm365-sharepoint-office-open': {
      pt: 'Impossível abrir ficheiros SharePoint diretamente no Office — erro de autenticação',
      fr: 'Impossible d\'ouvrir les fichiers SharePoint directement dans Office — erreur d\'authentification',
      en: 'Unable to open SharePoint files directly in Office — authentication error'
    },
    'm365-outlook-signature-lost': {
      pt: 'Assinatura automática do Outlook desapareceu após atualização do Office',
      fr: 'Signature automatique Outlook disparue après mise à jour Office',
      en: 'Outlook automatic signature disappeared after Office update'
    },
    'm365-teams-video-quality': {
      pt: 'Teams — qualidade de vídeo muito degradada nas reuniões (tremidos, desfocado)',
      fr: 'Teams — qualité vidéo très dégradée pendant les réunions (flou, saccades)',
      en: 'Teams — very poor video quality during meetings (blur, stuttering)'
    },
    'm365-calendar-not-shared': {
      pt: 'Calendário Outlook não partilhado com o gestor — procedimento de partilha desconhecido',
      fr: 'Calendrier Outlook non partagé avec le manager — procédure de partage inconnue',
      en: 'Outlook calendar not shared with manager — sharing procedure unknown'
    },
    'm365-onedrive-sync-error': {
      pt: 'OneDrive bloqueado em sincronização — ícone vermelho, ficheiros não sincronizados',
      fr: 'OneDrive bloqué en synchronisation — icône rouge, fichiers non synchronisés',
      en: 'OneDrive stuck syncing — red icon, files not synchronized'
    },
    'm365-license-expired': {
      pt: 'Licença M365 expirada — perda de acesso ao Word, Excel, Teams e Outlook',
      fr: 'Licence M365 expirée — perte d\'accès à Word, Excel, Teams et Outlook',
      en: 'M365 licence expired — loss of access to Word, Excel, Teams and Outlook'
    },
    'm365-sharepoint-access-denied': {
      pt: 'SharePoint — acesso negado ao site de equipa de Formação (erro 403)',
      fr: 'SharePoint — accès refusé au site d\'équipe Formation (erreur 403)',
      en: 'SharePoint — access denied to Training team site (error 403)'
    },
    'network-no-access-after-move': {
      pt: 'Sem acesso à rede após mudança de escritório — IP APIPA, sem conectividade',
      fr: 'Pas d\'accès réseau après déménagement de bureau — IP APIPA, aucune connexion',
      en: 'No network access after office move — APIPA IP, no connectivity'
    },
    'network-dhcp-exhausted': {
      pt: 'DHCP — pool de endereços esgotado — Edifício C inteiro em APIPA',
      fr: 'DHCP — pool d\'adresses épuisé — Bâtiment C entier en APIPA (169.254.x.x)',
      en: 'DHCP — address pool exhausted — entire Building C on APIPA'
    },
    'network-switch-down': {
      pt: 'Switch do 2º andar com falha — todo o piso sem rede',
      fr: 'Switch du 2e étage en panne — tout le plateau est hors réseau',
      en: '2nd floor switch down — entire floor off the network'
    },
    'network-vpn-unstable': {
      pt: 'VPN instável — desconexões frequentes em teletrabalho a cada 30 minutos',
      fr: 'VPN instable — déconnexions fréquentes en télétravail toutes les 30 minutes',
      en: 'Unstable VPN — frequent disconnections during remote work every 30 minutes'
    },
    'network-proxy-blocking': {
      pt: 'Proxy bloqueia o acesso ao site parceiro fornecedor — erro 403 Forbidden',
      fr: 'Proxy bloque l\'accès au site partenaire fournisseur — erreur 403 Forbidden',
      en: 'Proxy blocking access to supplier partner website — 403 Forbidden error'
    },
    'network-high-latency-datacenter': {
      pt: 'Latência elevada detectada para o datacenter — aplicações de negócio muito lentas',
      fr: 'Latence élevée détectée vers le datacenter — applications métier très lentes',
      en: 'High latency detected to the datacenter — business applications very slow'
    },
    'network-shared-folder-unavailable': {
      pt: 'Partilha de rede \\\\SRV-FILES\\RH inacessível — erro de caminho de rede',
      fr: 'Partage réseau \\\\SRV-FILES\\RH inaccessible — erreur chemin réseau introuvable',
      en: 'Network share \\\\SRV-FILES\\HR inaccessible — network path not found error'
    },
    'network-no-internet-conference': {
      pt: 'Sem acesso à internet nem à rede na sala de conferência A — reunião em 20 min',
      fr: 'Pas d\'accès internet ni réseau depuis la salle de conférence A — réunion dans 20 min',
      en: 'No internet or network access in conference room A — meeting in 20 min'
    },
    'network-dns-internal-failure': {
      pt: 'DNS interno fora de serviço — impossível resolver nomes internos (CORP.LOCAL)',
      fr: 'DNS interne hors service — impossible de résoudre les noms internes (CORP.LOCAL)',
      en: 'Internal DNS down — unable to resolve internal names (CORP.LOCAL)'
    },
    'network-slow-file-server': {
      pt: 'Acesso muito lento ao servidor de ficheiros SRV-FILES — abertura de ficheiros demora 2-3 minutos',
      fr: 'Accès très lent au serveur de fichiers SRV-FILES — ouverture des fichiers en 2-3 minutes',
      en: 'Very slow access to SRV-FILES file server — files take 2-3 minutes to open'
    },
    'network-rdp-impossible': {
      pt: 'RDP impossível para o servidor aplicacional SRV-APP01 — conexão recusada',
      fr: 'RDP impossible vers le serveur applicatif SRV-APP01 — connexion refusée',
      en: 'RDP impossible to application server SRV-APP01 — connection refused'
    },
    'network-wifi-autodisconnect': {
      pt: 'Wi-Fi — desconexão automática a cada hora, reconexão manual necessária',
      fr: 'Wi-Fi — déconnexion automatique toutes les heures, reconnexion manuelle nécessaire',
      en: 'Wi-Fi — automatic disconnection every hour, manual reconnection required'
    },
    'ad-wrong-ou-gpo': {
      pt: 'OU incorreta no posto — GPO errada aplicada (restrições de software indevidas)',
      fr: 'OU incorrecte sur un poste — mauvaise GPO appliquée (restrictions logicielles intempestives)',
      en: 'Wrong OU on workstation — incorrect GPO applied (unwanted software restrictions)'
    },
    'ad-service-account-expired': {
      pt: 'Conta de serviço AD expirada — aplicação de negócio indisponível desde esta manhã',
      fr: 'Compte de service AD expiré — application métier indisponible depuis ce matin',
      en: 'AD service account expired — business application unavailable since this morning'
    },
    'ad-azure-connect-sync-failed': {
      pt: 'Azure AD Connect — sincronização AD para Azure AD bloqueada há várias horas',
      fr: 'Azure AD Connect — synchronisation AD vers Azure AD bloquée depuis plusieurs heures',
      en: 'Azure AD Connect — AD to Azure AD synchronisation blocked for several hours'
    },
    'ad-account-disabled-by-error': {
      pt: 'Conta AD desativada por engano durante processo de saída — colaborador ativo bloqueado',
      fr: 'Compte AD désactivé par erreur lors d\'un traitement de départ — collaborateur actif bloqué',
      en: 'AD account accidentally disabled during offboarding — active employee locked out'
    },
    'ad-password-policy-weak': {
      pt: 'Política de senha AD insuficiente — auditoria revela senhas não conformes',
      fr: 'Politique de mot de passe AD insuffisante — audit révèle des mots de passe non conformes',
      en: 'Weak AD password policy — audit reveals non-compliant passwords'
    },
    'ad-gpo-software-restriction': {
      pt: 'GPO de restrição de software — impossível instalar aplicação aprovada pelo gestor',
      fr: 'GPO de restriction logicielle — impossible d\'installer un logiciel approuvé par le manager',
      en: 'Software restriction GPO — unable to install manager-approved software'
    },
    'ad-shared-folder-access-denied': {
      pt: 'Acesso negado à pasta partilhada — utilizador perdeu grupo de segurança AD após reorganização',
      fr: 'Accès refusé sur dossier partagé — utilisateur absent du groupe de sécurité AD après réorganisation',
      en: 'Shared folder access denied — user lost AD security group after OU reorganization'
    },
    'ad-vpn-group-missing': {
      pt: 'Conexão VPN impossível — utilizador ausente do grupo de segurança VPN no AD',
      fr: 'Connexion VPN impossible — utilisateur absent du groupe de sécurité VPN dans AD',
      en: 'VPN connection impossible — user missing from VPN security group in AD'
    },
    'ad-password-reset-denied': {
      pt: 'Impossível redefinir a palavra-passe de uma utilizadora — delegação AD não cobre a nova OU',
      fr: 'Impossible de réinitialiser le mot de passe d\'une employée — délégation AD limitée à l\'OU d\'origine',
      en: 'Unable to reset employee password — AD delegation does not cover the new OU'
    },
    'server-disk-critical': {
      pt: 'Espaço em disco crítico no SRV-FILES — 98% utilizado, shadow copies VSS acumuladas sem limite',
      fr: 'Espace disque critique sur SRV-FILES — 98% utilisé, shadow copies VSS accumulées sans limite',
      en: 'Critical disk space on SRV-FILES — 98% used, VSS shadow copies accumulated without limit'
    },
    'server-ssl-expired': {
      pt: 'Certificado SSL IIS expirado — intranet.corp.local inacessível, erro NET::ERR_CERT_DATE_INVALID',
      fr: 'Certificat SSL IIS expiré — intranet.corp.local inaccessible, erreur NET::ERR_CERT_DATE_INVALID',
      en: 'IIS SSL certificate expired — intranet.corp.local unreachable, NET::ERR_CERT_DATE_INVALID error'
    }
  },

  caller: {
    'ad-password-expired':          { pt: 'Clara Souza',       fr: 'Claire Petit',     en: 'Claire Petit' },
    'ad-account-locked':            { pt: 'Lucas Moreira',     fr: 'Lucas Moreau',     en: 'Lucas Moreau' },
    'm365-outlook-disconnected':    { pt: 'João Martins',      fr: 'Jean Martin',      en: 'Jean Martin' },
    'windows-slow-pc':              { pt: 'Amanda Ferreira',   fr: 'Amélie Fontaine',  en: 'Amélie Fontaine' },
    'network-no-internet':          { pt: 'Nadia Bento',       fr: 'Nadia Bensalem',   en: 'Nadia Bensalem' },
    'network-printer-offline':      { pt: 'Sofia Lemos',       fr: 'Sophie Lemaire',   en: 'Sophie Lemaire' },
    'network-vpn-failed':           { pt: 'Maria Duarte',      fr: 'Marie Dupont',     en: 'Marie Dupont' },
    'm365-teams-crash':             { pt: 'André Rocha',       fr: 'Antoine Roux',     en: 'Antoine Roux' },
    'windows-shared-folder-denied': { pt: 'Pedro Moreira',     fr: 'Pierre Morel',     en: 'Pierre Morel' },
    'ad-gpo-not-applied':           { pt: 'Admin de Rede',     fr: 'Admin Réseau',     en: 'Network Admin' },
    'windows-bsod-critical':        { pt: 'Lucas Bernardo',    fr: 'Luc Bernard',      en: 'Luc Bernard' },
    'server-service-down':          { pt: 'Alice Moreira',     fr: 'Alice Moreau',     en: 'Alice Moreau' },
    'm365-azure-license':           { pt: 'Responsável de RH', fr: 'Responsable RH',   en: 'HR Manager' },
    'm365-teams-external-meeting':  { pt: 'Estevão Colin',     fr: 'Stéphane Colin',   en: 'Stéphane Colin' },
    'm365-mfa-no-sms':              { pt: 'Maria Duarte',      fr: 'Marie Dupont',     en: 'Marie Dupont' },
    'm365-outlook-forward-rule':    { pt: 'Dênis Marchand',    fr: 'Denis Marchand',   en: 'Denis Marchand' },
    'm365-excel-corrupted':         { pt: 'Valéria Lemos',     fr: 'Valérie Lemoine',  en: 'Valérie Lemoine' },
    'windows-corrupted-profile':    { pt: 'Isabel Renaud',     fr: 'Isabelle Renaud',  en: 'Isabelle Renaud' },
    'windows-black-screen-update':  { pt: 'Tomás Laurent',     fr: 'Thomas Laurent',   en: 'Thomas Laurent' },
    'windows-sleep-no-wake':        { pt: 'Paulo Lefevre',     fr: 'Paul Lefevre',     en: 'Paul Lefevre' },
    'windows-disk-full':            { pt: 'Celina Moreira',    fr: 'Céline Morel',     en: 'Céline Morel' },
    'windows-dll-missing':          { pt: 'Luísa Perin',       fr: 'Lucie Perrin',     en: 'Lucie Perrin' },
    'windows-bsod-pagefault':       { pt: 'Marco Duarte',      fr: 'Marc Dupuis',      en: 'Marc Dupuis' },
    'windows-system-files-corrupt': { pt: 'Rodrigo Branco',    fr: 'Romain Blanc',     en: 'Romain Blanc' },
    'windows-defender-update-fail': { pt: 'Alice Moreira',     fr: 'Alice Moreau',     en: 'Alice Moreau' },
    'windows-wrong-resolution':     { pt: 'Natália Simão',     fr: 'Nathalie Simon',   en: 'Nathalie Simon' },
    'windows-no-sound-update':      { pt: 'Julia Bernardo',    fr: 'Julie Bernard',    en: 'Julie Bernard' },
    'windows-auto-restart-night':   { pt: 'Francisco Petit',   fr: 'Franck Petit',     en: 'Franck Petit' },
    'windows-install-rights':       { pt: 'Pedro Moreira',     fr: 'Pierre Morel',     en: 'Pierre Morel' },
    'windows-scheduled-task-fail':  { pt: 'Olivério Martins',  fr: 'Olivier Martin',   en: 'Olivier Martin' },
    'windows-winlogon-error':       { pt: 'Silvia Ramos',      fr: 'Sylvie Rousseau',  en: 'Sylvie Rousseau' },
    'windows-print-queue-stuck':    { pt: 'Sofia Lemos',       fr: 'Sophie Lemaire',   en: 'Sophie Lemaire' },
    'windows-slow-startup':         { pt: 'João Paulo Vieira', fr: 'Jean-Paul Vidal',  en: 'Jean-Paul Vidal' },
    'hardware-external-screen':     { pt: 'Amanda Ferreira',   fr: 'Amélie Fontaine',  en: 'Amélie Fontaine' },
    'hardware-webcam-teams':        { pt: 'Bernardo Leal',     fr: 'Bernard Leroy',    en: 'Bernard Leroy' },
    'hardware-printer-paper-jam':   { pt: 'Martina Girão',     fr: 'Martine Girard',   en: 'Martine Girard' },
    'hardware-docking-no-charge':   { pt: 'Valéria Lemos',     fr: 'Valérie Lemoine',  en: 'Valérie Lemoine' },
    'hardware-network-scanner':     { pt: 'Rodrigo Branco',    fr: 'Romain Blanc',     en: 'Romain Blanc' },
    'hardware-battery-drain':       { pt: 'Silvia Ramos',      fr: 'Sylvie Rousseau',  en: 'Sylvie Rousseau' },
    'hardware-bluetooth-mouse':     { pt: 'Julia Bernardo',    fr: 'Julie Bernard',    en: 'Julie Bernard' },
    'hardware-screen-flickering':   { pt: 'Marco Duarte',      fr: 'Marc Dupuis',      en: 'Marc Dupuis' },
    'hardware-fn-keys-inverted':    { pt: 'Hugo Gonçalves',    fr: 'Hugo Garnier',     en: 'Hugo Garnier' },
    'hardware-headset-mic':         { pt: 'Celina Moreira',    fr: 'Céline Morel',     en: 'Céline Morel' },
    'm365-mailbox-full':            { pt: 'Cristina Faria',    fr: 'Christine Faure',   en: 'Christine Faure' },
    'm365-sharepoint-office-open':  { pt: 'Eric Bonnet',       fr: 'Éric Bonnet',       en: 'Éric Bonnet' },
    'm365-outlook-signature-lost':  { pt: 'Martina Girão',     fr: 'Martine Girard',    en: 'Martine Girard' },
    'm365-teams-video-quality':     { pt: 'Bernardo Leal',     fr: 'Bernard Leroy',     en: 'Bernard Leroy' },
    'm365-calendar-not-shared':     { pt: 'Laura Pinto',        fr: 'Laura Petit',        en: 'Laura Petit' },
    'm365-onedrive-sync-error':     { pt: 'Camila Duarte',      fr: 'Camille Dupont',     en: 'Camille Dupont' },
    'm365-license-expired':         { pt: 'Responsável RH',     fr: 'Responsable RH',     en: 'HR Manager' },
    'm365-sharepoint-access-denied':{ pt: 'Nádia Bento',        fr: 'Nadia Bensalem',      en: 'Nadia Bensalem' },
    'network-no-access-after-move': { pt: 'Lucas Moreira',      fr: 'Lucas Moreau',        en: 'Lucas Moreau' },
    'network-dhcp-exhausted':       { pt: 'Alice Moreira',      fr: 'Alice Moreau',        en: 'Alice Moreau' },
    'network-switch-down':              { pt: 'Admin Rede',         fr: 'Admin Réseau',        en: 'Network Admin' },
    'network-vpn-unstable':             { pt: 'Isabela Renaud',     fr: 'Isabelle Renaud',     en: 'Isabelle Renaud' },
    'network-proxy-blocking':           { pt: 'Franco Petit',       fr: 'Franck Petit',        en: 'Franck Petit' },
    'network-high-latency-datacenter':   { pt: 'Admin Rede',       fr: 'Admin Réseau',        en: 'Network Admin' },
    'network-shared-folder-unavailable': { pt: 'Clara Souza',      fr: 'Claire Petit',        en: 'Claire Petit' },
    'network-no-internet-conference':    { pt: 'Nádia Bento',      fr: 'Nadia Bensalem',      en: 'Nadia Bensalem' },
    'network-dns-internal-failure':      { pt: 'Admin Rede',        fr: 'Admin Réseau',        en: 'Network Admin' },
    'network-slow-file-server':          { pt: 'Pedro Moreira',     fr: 'Pierre Morel',        en: 'Pierre Morel' },
    'network-rdp-impossible':            { pt: 'Admin Rede',        fr: 'Admin Réseau',        en: 'Network Admin' },
    'network-wifi-autodisconnect':       { pt: 'Karim Mansouri',    fr: 'Karim Mansouri',      en: 'Karim Mansouri' },
    'ad-wrong-ou-gpo':                   { pt: 'Admin Rede',         fr: 'Admin Réseau',        en: 'Network Admin' },
    'ad-service-account-expired':        { pt: 'Olivério Martins',   fr: 'Olivier Martin',      en: 'Olivier Martin' },
    'ad-azure-connect-sync-failed':      { pt: 'Admin Rede',         fr: 'Admin Réseau',        en: 'Network Admin' },
    'ad-account-disabled-by-error':      { pt: 'Responsável RH',     fr: 'Responsable RH',      en: 'HR Manager' },
    'ad-password-policy-weak':           { pt: 'Admin Rede',         fr: 'Admin Réseau',        en: 'Network Admin' },
    'ad-gpo-software-restriction':       { pt: 'Thomas Laurent',     fr: 'Thomas Laurent',      en: 'Thomas Laurent' },
    'ad-shared-folder-access-denied':    { pt: 'Pierre Morel',        fr: 'Pierre Morel',         en: 'Pierre Morel' },
    'ad-vpn-group-missing':              { pt: 'Karim Mansouri',      fr: 'Karim Mansouri',       en: 'Karim Mansouri' },
    'ad-password-reset-denied':          { pt: 'Sophie Laurent',      fr: 'Sophie Laurent',       en: 'Sophie Laurent' },
    'server-disk-critical':              { pt: 'Admin Rede',           fr: 'Admin Réseau',          en: 'Network Admin' },
    'server-ssl-expired':                { pt: 'Admin Rede',           fr: 'Admin Réseau',          en: 'Network Admin' }
  },

  dept: {
    'ad-password-expired':          { pt: 'Jurídico',         fr: 'Juridique',            en: 'Legal' },
    'ad-account-locked':            { pt: 'Contabilidade',    fr: 'Comptabilité',         en: 'Accounting' },
    'm365-outlook-disconnected':    { pt: 'Recursos Humanos', fr: 'Ressources Humaines',  en: 'Human Resources' },
    'windows-slow-pc':              { pt: 'Comercial',        fr: 'Commercial',           en: 'Sales' },
    'network-no-internet':          { pt: 'Treinamento',      fr: 'Formation',            en: 'Training' },
    'network-printer-offline':      { pt: 'Marketing',        fr: 'Marketing',            en: 'Marketing' },
    'network-vpn-failed':           { pt: 'Contabilidade',    fr: 'Comptabilité',         en: 'Accounting' },
    'm365-teams-crash':             { pt: 'Comercial',        fr: 'Commercial',           en: 'Sales' },
    'windows-shared-folder-denied': { pt: 'Logística',        fr: 'Logistique',           en: 'Logistics' },
    'ad-gpo-not-applied':           { pt: 'TI',               fr: 'IT',                   en: 'IT' },
    'windows-bsod-critical':        { pt: 'Diretoria',        fr: 'Direction',            en: 'Management' },
    'server-service-down':          { pt: 'TI / Helpdesk',    fr: 'IT / Helpdesk',        en: 'IT / Helpdesk' },
    'm365-azure-license':           { pt: 'Recursos Humanos', fr: 'Ressources Humaines',  en: 'Human Resources' },
    'm365-teams-external-meeting':  { pt: 'Comercial',               fr: 'Commercial',      en: 'Sales' },
    'm365-mfa-no-sms':              { pt: 'Contabilidade',           fr: 'Comptabilité',    en: 'Accounting' },
    'm365-outlook-forward-rule':    { pt: 'Jurídico',                fr: 'Juridique',       en: 'Legal' },
    'm365-excel-corrupted':         { pt: 'Finanças',                fr: 'Finance',         en: 'Finance' },
    'windows-corrupted-profile':    { pt: 'Diretoria',               fr: 'Direction',       en: 'Management' },
    'windows-black-screen-update':  { pt: 'Marketing',               fr: 'Marketing',       en: 'Marketing' },
    'windows-sleep-no-wake':        { pt: 'Treinamento',             fr: 'Formation',       en: 'Training' },
    'windows-disk-full':            { pt: 'Atendimento ao Cliente',  fr: 'Service Client',  en: 'Customer Service' },
    'windows-dll-missing':          { pt: 'Finanças',                fr: 'Finance',         en: 'Finance' },
    'windows-bsod-pagefault':       { pt: 'P&D',                    fr: 'R&D',             en: 'R&D' },
    'windows-system-files-corrupt': { pt: 'Compras',                 fr: 'Achats',          en: 'Purchasing' },
    'windows-defender-update-fail': { pt: 'TI / Helpdesk',           fr: 'IT / Helpdesk',   en: 'IT / Helpdesk' },
    'windows-wrong-resolution':     { pt: 'Qualidade',               fr: 'Qualité',         en: 'Quality' },
    'windows-no-sound-update':      { pt: 'Comunicação',             fr: 'Communication',   en: 'Communication' },
    'windows-auto-restart-night':   { pt: 'Produção',                fr: 'Production',      en: 'Production' },
    'windows-install-rights':       { pt: 'Logística',               fr: 'Logistique',      en: 'Logistics' },
    'windows-scheduled-task-fail':  { pt: 'TI / Helpdesk',           fr: 'IT / Helpdesk',   en: 'IT / Helpdesk' },
    'windows-winlogon-error':       { pt: 'Diretoria Geral',         fr: 'Direction Générale', en: 'General Management' },
    'windows-print-queue-stuck':    { pt: 'Marketing',               fr: 'Marketing',       en: 'Marketing' },
    'windows-slow-startup':         { pt: 'Contabilidade',           fr: 'Comptabilité',    en: 'Accounting' },
    'hardware-external-screen':     { pt: 'Comercial',               fr: 'Commercial',      en: 'Sales' },
    'hardware-webcam-teams':        { pt: 'Diretoria',               fr: 'Direction',       en: 'Management' },
    'hardware-printer-paper-jam':   { pt: 'Atendimento ao Cliente',  fr: 'Service Client',  en: 'Customer Service' },
    'hardware-docking-no-charge':   { pt: 'Finanças',                fr: 'Finance',         en: 'Finance' },
    'hardware-network-scanner':     { pt: 'Compras',                 fr: 'Achats',          en: 'Purchasing' },
    'hardware-battery-drain':       { pt: 'Diretoria Geral',         fr: 'Direction Générale', en: 'General Management' },
    'hardware-bluetooth-mouse':     { pt: 'Comunicação',             fr: 'Communication',   en: 'Communication' },
    'hardware-screen-flickering':   { pt: 'P&D',                    fr: 'R&D',             en: 'R&D' },
    'hardware-fn-keys-inverted':    { pt: 'Contabilidade',          fr: 'Comptabilité',    en: 'Accounting' },
    'hardware-headset-mic':         { pt: 'Atendimento ao Cliente', fr: 'Service Client',  en: 'Customer Service' },
    'm365-mailbox-full':            { pt: 'Contabilidade',           fr: 'Comptabilité',     en: 'Accounting' },
    'm365-sharepoint-office-open':  { pt: 'Jurídico',                fr: 'Juridique',         en: 'Legal' },
    'm365-outlook-signature-lost':  { pt: 'Atendimento ao Cliente',  fr: 'Service Client',    en: 'Customer Service' },
    'm365-teams-video-quality':     { pt: 'Diretoria',               fr: 'Direction',         en: 'Management' },
    'm365-calendar-not-shared':     { pt: 'Finanças',                fr: 'Finance',            en: 'Finance' },
    'm365-onedrive-sync-error':     { pt: 'Marketing',               fr: 'Marketing',          en: 'Marketing' },
    'm365-license-expired':         { pt: 'Recursos Humanos',        fr: 'Ressources Humaines', en: 'Human Resources' },
    'm365-sharepoint-access-denied':{ pt: 'Treinamento',             fr: 'Formation',          en: 'Training' },
    'network-no-access-after-move': { pt: 'Contabilidade',           fr: 'Comptabilité',       en: 'Accounting' },
    'network-dhcp-exhausted':       { pt: 'TI / Helpdesk',           fr: 'IT / Helpdesk',      en: 'IT / Helpdesk' },
    'network-switch-down':              { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',      en: 'IT / Helpdesk' },
    'network-vpn-unstable':             { pt: 'Diretoria',        fr: 'Direction',           en: 'Management' },
    'network-proxy-blocking':           { pt: 'Produção',         fr: 'Production',          en: 'Production' },
    'network-high-latency-datacenter':   { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'network-shared-folder-unavailable': { pt: 'Jurídico',         fr: 'Juridique',         en: 'Legal' },
    'network-no-internet-conference':    { pt: 'Treinamento',      fr: 'Formation',         en: 'Training' },
    'network-dns-internal-failure':      { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'network-slow-file-server':          { pt: 'Logística',        fr: 'Logistique',       en: 'Logistics' },
    'network-rdp-impossible':            { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'network-wifi-autodisconnect':       { pt: 'Comercial',        fr: 'Commercial',       en: 'Sales' },
    'ad-wrong-ou-gpo':                   { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'ad-service-account-expired':        { pt: 'TI / Helpdesk',   fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'ad-azure-connect-sync-failed':      { pt: 'TI / Helpdesk',    fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'ad-account-disabled-by-error':      { pt: 'Recursos Humanos',  fr: 'Ressources Humaines', en: 'Human Resources' },
    'ad-password-policy-weak':           { pt: 'TI / Helpdesk',    fr: 'IT / Helpdesk',    en: 'IT / Helpdesk' },
    'ad-gpo-software-restriction':       { pt: 'Marketing',         fr: 'Marketing',        en: 'Marketing' },
    'ad-shared-folder-access-denied':    { pt: 'Logística',          fr: 'Logistique',        en: 'Logistics' },
    'ad-vpn-group-missing':              { pt: 'Comercial',           fr: 'Commercial',        en: 'Sales' },
    'ad-password-reset-denied':          { pt: 'Recursos Humanos',    fr: 'Ressources Humaines', en: 'Human Resources' },
    'server-disk-critical':              { pt: 'TI / Helpdesk',        fr: 'IT / Helpdesk',         en: 'IT / Helpdesk' },
    'server-ssl-expired':                { pt: 'TI / Helpdesk',        fr: 'IT / Helpdesk',         en: 'IT / Helpdesk' }
  }

};

// Helper — retorna o campo traduzido para o idioma atual
function tScenario(scenarioId, field) {
  const lang = App.currentLang || 'fr';
  const map = SCENARIO_I18N[field];
  if (!map || !map[scenarioId]) return null;
  return map[scenarioId][lang] || map[scenarioId]['pt'] || null;
}
