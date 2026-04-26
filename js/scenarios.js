/* ============================================
   IT SUPPORT SIMULATOR — Scenario Database
   N1/N2 Scenarios covering all IT domains
   ============================================ */

const SCENARIOS = {

  /* ==========================================
     NIVEAU 1 — EASY
     ========================================== */
  easy: [

    // --- AD: Mot de passe expiré ---
    {
      id: 'ad-password-expired',
      category: 'AD/GPO',
      level: 1,
      difficulty: 'easy',
      caller: 'Claire Petit',
      dept: 'Juridique',
      mood: 'calm',
      issue: 'Impossible de se connecter — mot de passe expiré',
      terminalContext: {
        hostname: 'PC-JURIDIQUE-03', username: 'claire.petit',
        domain: 'CORP.LOCAL', ip: '192.168.1.78',
        adPasswordExpired: true, adUserLocked: false
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Claire du service juridique. Je n'arrive plus à ouvrir ma session Windows ce matin. Il y a un message qui dit que mon mot de passe a expiré." },
        { from: 'caller', text: "J'ai essayé Ctrl+Alt+Suppr mais je ne vois pas l'option pour le changer. J'ai un contrat urgent à envoyer avant midi." }
      ],
      steps: [
        {
          question: "Quelle est votre première action ?",
          options: [
            { text: "Lui dire de redémarrer le PC", correct: false, feedback: "Redémarrer ne résoudra pas un mot de passe expiré dans AD." },
            { text: "Ouvrir ADUC (dsa.msc), trouver le compte et réinitialiser le mot de passe", correct: true, feedback: "Correct ! ADUC permet de réinitialiser le mot de passe côté serveur." },
            { text: "Escalader immédiatement au N2", correct: false, feedback: "Un reset de MDP AD est une opération N1 standard. Pas besoin d'escalade." },
            { text: "Lui demander d'utiliser un autre PC", correct: false, feedback: "Ça ne résout pas le problème du compte." }
          ],
          hint: "Utilisez dsa.msc (Active Directory Users & Computers) pour réinitialiser le mot de passe.",
          terminalCommand: "net user claire.petit /domain",
          callerReply: "D'accord, je reste en ligne."
        },
        {
          question: "Vous avez réinitialisé le mot de passe. Comment le communiquer à l'utilisatrice ?",
          options: [
            { text: "Par e-mail en clair", correct: false, feedback: "Envoyer un mot de passe par e-mail en clair est une faille de sécurité majeure." },
            { text: "Verbalement par téléphone avec obligation de changer au prochain login", correct: true, feedback: "Correct ! Communication verbale sécurisée + case « L'utilisateur doit changer le MDP à la prochaine ouverture de session »." },
            { text: "Lui donner le même mot de passe que l'ancien", correct: false, feedback: "C'est interdit par la politique de mot de passe (historique)." },
            { text: "Afficher le mot de passe dans le ticket", correct: false, feedback: "Ne jamais mettre de mot de passe dans un ticket — visible par tous les techs." }
          ],
          hint: "Bonne pratique : mot de passe temporaire communiqué verbalement + case « must change at next logon ».",
          callerReply: "Parfait, j'ai pu me reconnecter ! Merci beaucoup, c'est réglé."
        }
      ]
    },

    // --- AD: Compte verrouillé ---
    {
      id: 'ad-account-locked',
      category: 'AD/GPO',
      level: 1,
      difficulty: 'easy',
      caller: 'Lucas Moreau',
      dept: 'Comptabilité',
      mood: 'frustrated',
      issue: 'Compte Active Directory verrouillé',
      terminalContext: {
        hostname: 'PC-COMPTA-07', username: 'lucas.moreau',
        domain: 'CORP.LOCAL', ip: '192.168.1.92',
        adUserLocked: true, adPasswordExpired: false
      },
      messages: [
        { from: 'caller', text: "Bonjour, Lucas Moreau de la comptabilité. Mon compte est bloqué, je ne peux plus me connecter du tout. C'est la troisième fois cette semaine !" },
        { from: 'caller', text: "J'ai essayé mon mot de passe plusieurs fois mais ça dit que mon compte est verrouillé. C'est vraiment pénalisant." }
      ],
      steps: [
        {
          question: "Première vérification dans Active Directory ?",
          options: [
            { text: "Déverrouiller directement le compte sans poser de questions", correct: false, feedback: "Il faut d'abord comprendre la cause — plusieurs verrouillages = peut indiquer une attaque ou un MDP enregistré en erreur quelque part." },
            { text: "Vérifier dans ADUC si le compte est verrouillé et identifier les tentatives échouées", correct: true, feedback: "Correct ! Déverrouiller ET vérifier les event logs pour comprendre la cause des tentatives multiples." },
            { text: "Réinitialiser le mot de passe sans vérification", correct: false, feedback: "Avant de réinitialiser, il faut vérifier pourquoi le compte se verrouille régulièrement." },
            { text: "Désactiver la politique de verrouillage", correct: false, feedback: "Ne jamais désactiver les politiques de sécurité. Ce serait une faille grave." }
          ],
          hint: "Utilisez 'net user lucas.moreau /domain' pour voir l'état du compte. Cherchez aussi dans l'Event Viewer (ID 4740).",
          terminalCommand: "net user lucas.moreau /domain",
          callerReply: "OK, qu'est-ce que vous voyez ?"
        },
        {
          question: "Le compte est verrouillé. Lucas dit qu'il a son mot de passe et ne comprend pas le blocage. Que faire ?",
          options: [
            { text: "Déverrouiller le compte, vérifier si un appareil mobile ou une session RDP enregistre l'ancien MDP", correct: true, feedback: "Parfait ! Souvent la cause : un téléphone ou une session RDP avec l'ancien MDP verrouille le compte automatiquement." },
            { text: "Juste déverrouiller et raccrocher", correct: false, feedback: "Sans investiguer la cause, le compte se reverrouillera et l'utilisateur rappellera." },
            { text: "Lui dire de changer de mot de passe", correct: false, feedback: "Si la cause n'est pas identifiée, le nouveau MDP sera aussi verrouillé par le vieux appareil." },
            { text: "Désactiver le compte pendant 24h", correct: false, feedback: "Désactiver un compte sans raison bloque complètement l'utilisateur." }
          ],
          hint: "Vérifiez les appareils enregistrés (téléphone pro, session RDP, service Windows) qui pourraient relancer des tentatives avec l'ancien MDP.",
          callerReply: "Ah oui ! Mon téléphone avait mon ancien mot de passe enregistré. Je le mets à jour. Merci !"
        }
      ]
    },

    // --- M365: Outlook déconnecté ---
    {
      id: 'm365-outlook-disconnected',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Jean Martin',
      dept: 'Ressources Humaines',
      mood: 'frustrated',
      issue: 'Outlook affiche Déconnecté — e-mails non reçus',
      terminalContext: {
        hostname: 'PC-RH-04', username: 'jean.martin',
        domain: 'CORP.LOCAL', ip: '192.168.1.88',
        internetOK: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Jean du service RH. Outlook affiche 'Déconnecté' en bas depuis hier soir. Je ne reçois plus aucun e-mail." },
        { from: 'caller', text: "Internet fonctionne bien, je peux naviguer sur le web. Mais Outlook ne veut pas se reconnecter. J'attends des CV importants." }
      ],
      steps: [
        {
          question: "Le problème est isolé à Outlook, internet fonctionne. Première action ?",
          options: [
            { text: "Réinstaller Office 365 complètement", correct: false, feedback: "Réinstaller est une mesure extrême. Commencez par des actions simples." },
            { text: "Vérifier que le mode Hors connexion n'est pas activé (Envoi/Réception > Hors connexion)", correct: true, feedback: "Correct ! C'est souvent la cause. Un clic accidentel sur 'Travailler hors connexion' coupe la synchronisation." },
            { text: "Redémarrer le serveur Exchange", correct: false, feedback: "Avant de toucher au serveur, vérifiez les causes côté client." },
            { text: "Créer un nouveau profil Outlook", correct: false, feedback: "Étape pertinente mais pas en premier — commencez par les actions simples." }
          ],
          hint: "Dans Outlook : onglet Envoi/Réception → vérifiez si 'Travailler hors connexion' est coché (le bouton apparaît enfoncé).",
          callerReply: "Attendez... il y a effectivement un bouton qui semble activé dans Envoi/Réception."
        },
        {
          question: "Le mode hors connexion était activé, vous le désactivez mais Outlook reste déconnecté. Prochaine étape ?",
          options: [
            { text: "Supprimer et recréer le profil Outlook (%appdata%\\Microsoft\\Outlook)", correct: true, feedback: "Correct ! Un profil corrompu est la deuxième cause la plus fréquente. Supprimer le profil et le reconfigurer règle le problème." },
            { text: "Vérifier le câble réseau", correct: false, feedback: "Internet fonctionne, donc le réseau n'est pas en cause." },
            { text: "Appeler Microsoft Support", correct: false, feedback: "Un problème de profil Outlook est une résolution N1 standard." },
            { text: "Dire à l'utilisateur de se connecter à Outlook Web App à la place", correct: false, feedback: "C'est un contournement, pas une résolution. Le client Outlook doit fonctionner." }
          ],
          hint: "Panneau de configuration → Courrier → Afficher les profils → Supprimer le profil corrompu et en créer un nouveau.",
          callerReply: "Après la recréation du profil, Outlook se synchronise ! Je reçois mes e-mails. Merci !"
        }
      ]
    },

    // --- WINDOWS: PC lent ---
    {
      id: 'windows-slow-pc',
      category: 'Windows',
      level: 1,
      difficulty: 'easy',
      caller: 'Amélie Fontaine',
      dept: 'Commercial',
      mood: 'frustrated',
      issue: 'PC très lent — impossible de travailler',
      terminalContext: {
        hostname: 'PC-COMMERCIAL-05', username: 'amelie.fontaine',
        domain: 'CORP.LOCAL', ip: '192.168.1.62',
        internetOK: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Amélie du service commercial. Mon PC est extrêmement lent depuis ce matin. Ça met 5 minutes pour ouvrir un fichier Excel !" },
        { from: 'caller', text: "Je n'ai rien installé de nouveau. C'est comme ça depuis que je suis arrivée ce matin. J'ai des appels clients dans 30 minutes." }
      ],
      steps: [
        {
          question: "Comment diagnostiquer la lenteur en premier ?",
          options: [
            { text: "Formater le PC", correct: false, feedback: "Formater sans diagnostic c'est perdre du temps inutilement." },
            { text: "Ouvrir le Gestionnaire des tâches (Ctrl+Shift+Échap) et identifier le processus qui consomme le CPU/RAM", correct: true, feedback: "Correct ! Le Gestionnaire des tâches est le premier outil pour identifier la cause (CPU, RAM, disque)." },
            { text: "Ajouter plus de RAM", correct: false, feedback: "On ne peut pas ajouter de RAM à distance, et on n'a pas encore identifié la cause." },
            { text: "Redémarrer sans diagnostic", correct: false, feedback: "Redémarrer peut résoudre temporairement mais sans diagnostic le problème reviendra." }
          ],
          hint: "tasklist dans CMD ou Gestionnaire des tâches : regardez le % CPU et RAM. Un antivirus en plein scan ou une mise à jour Windows sont souvent la cause.",
          terminalCommand: "tasklist",
          callerReply: "Je vois plein de processus. Il y en a un qui prend 90% du CPU... c'est MsMpEng.exe."
        },
        {
          question: "MsMpEng.exe (Windows Defender) consomme 90% du CPU. Cause probable ?",
          options: [
            { text: "Désactiver définitivement Windows Defender", correct: false, feedback: "Ne jamais désactiver l'antivirus de façon permanente. C'est une faille de sécurité majeure." },
            { text: "Un scan antivirus est en cours ou une mise à jour des définitions se télécharge — attendre la fin ou planifier hors heures de travail", correct: true, feedback: "Correct ! Windows Defender fait souvent des scans automatiques au démarrage. On peut les planifier en dehors des heures de travail." },
            { text: "Supprimer Windows Defender", correct: false, feedback: "On ne supprime pas les composants de sécurité Windows." },
            { text: "Appeler le service antivirus", correct: false, feedback: "Ce n'est pas nécessaire — c'est un comportement normal qu'on peut gérer." }
          ],
          hint: "Windows Defender peut être configuré pour scanner en dehors des heures de bureau via la planification de tâches ou les paramètres Windows Security.",
          callerReply: "Ah, effectivement c'était un scan automatique. Ça vient de se terminer, le PC est normal maintenant. Merci !"
        }
      ]
    },

    // --- RÉSEAU: Pas de connexion Internet ---
    {
      id: 'network-no-internet',
      category: 'Réseau',
      level: 1,
      difficulty: 'easy',
      caller: 'Nadia Bensalem',
      dept: 'Formation',
      mood: 'calm',
      issue: 'Plus de connexion Internet sur le poste',
      terminalContext: {
        hostname: 'PC-RH-02', username: 'nadia.bensalem',
        domain: 'CORP.LOCAL', ip: 'APIPA',
        internetOK: false, dnsOK: false,
        pingFails: ['8.8.8.8', 'google', '192.168.1.1']
      },
      messages: [
        { from: 'caller', text: "Bonjour, Nadia de la formation. Je n'ai plus du tout accès à Internet depuis ce matin. La page affiche 'Aucune connexion réseau'." },
        { from: 'caller', text: "Mon voisin de bureau lui a accès. Ça doit venir de mon poste." }
      ],
      steps: [
        {
          question: "Votre collègue fonctionne, vous non. Première commande à lancer ?",
          options: [
            { text: "ping google.com", correct: false, feedback: "Bon réflexe mais commencez par vérifier votre configuration IP locale avec ipconfig." },
            { text: "ipconfig /all pour vérifier la configuration réseau", correct: true, feedback: "Correct ! ipconfig /all révèle immédiatement si le PC a une IP valide ou une IP APIPA (169.254.x.x) indiquant un problème DHCP." },
            { text: "Appeler le fournisseur Internet", correct: false, feedback: "Le voisin a internet donc la connexion ISP fonctionne. C'est local." },
            { text: "Redémarrer le routeur", correct: false, feedback: "Si le voisin fonctionne, le routeur n'est pas en cause." }
          ],
          hint: "Une adresse en 169.254.x.x = IP APIPA = le PC n'a pas reçu d'adresse DHCP. Problème côté câble, carte réseau ou service DHCP client.",
          terminalCommand: "ipconfig /all",
          callerReply: "Que voyez-vous ?"
        },
        {
          question: "ipconfig montre l'IP 169.254.x.x (APIPA). Que cela indique-t-il ?",
          options: [
            { text: "Le serveur DNS est en panne", correct: false, feedback: "APIPA n'est pas liée au DNS mais au DHCP." },
            { text: "Le PC n'a pas pu obtenir d'adresse IP du serveur DHCP — vérifier câble, service DHCP client, et carte réseau", correct: true, feedback: "Exact ! APIPA (169.254.x.x) = attribution automatique quand DHCP est inaccessible. Vérifiez le câble physique d'abord." },
            { text: "Windows Firewall bloque la connexion", correct: false, feedback: "Le pare-feu ne causerait pas une IP APIPA." },
            { text: "La carte réseau est en panne définitivement", correct: false, feedback: "Avant de conclure à une panne matérielle, vérifiez les causes logicielles." }
          ],
          hint: "Étapes : 1) Vérifier le câble RJ45. 2) ipconfig /release puis /renew. 3) Vérifier le service DHCP Client dans services.msc.",
          terminalCommand: "netsh int ip reset",
          callerReply: "Ah le câble réseau était mal branché ! Après l'avoir reconnecté et fait ipconfig /renew, j'ai maintenant une IP normale. Internet marche !"
        }
      ]
    },

    // --- HARDWARE: Touches de fonction inversées après BIOS update ---
    {
      id: 'hardware-fn-keys-inverted',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Hugo Garnier',
      dept: 'Comptabilité',
      mood: 'calm',
      issue: 'Touches de fonction laptop inversées après mise à jour BIOS',
      terminalContext: {
        hostname: 'PC-COMPTA-11', username: 'hugo.garnier',
        domain: 'CORP.LOCAL', ip: '192.168.1.97'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Hugo de la comptabilité. Depuis ce matin, mes touches F1 à F12 ne fonctionnent plus normalement. Pour faire F5 dans Excel, je dois maintenant appuyer sur Fn+F5. Avant c'était juste F5." },
        { from: 'caller', text: "Le service IT a fait une mise à jour BIOS hier soir. Je pense que ça vient de là. C'est vraiment gênant car j'utilise les touches de fonction toute la journée." }
      ],
      steps: [
        {
          question: "Les touches de fonction sont inversées après une mise à jour BIOS. Quelle est la cause la plus probable ?",
          options: [
            { text: "Le pilote du clavier a été corrompu par la mise à jour BIOS", correct: false, feedback: "Le BIOS et les pilotes Windows sont indépendants. Une mise à jour BIOS ne corrompt pas les pilotes clavier." },
            { text: "La mise à jour BIOS a réinitialisé le paramètre 'Function Key Behavior' à sa valeur par défaut (mode multimédia)", correct: true, feedback: "Correct ! Les mises à jour BIOS réinitialisent souvent les paramètres à leurs valeurs par défaut. Sur la plupart des laptops, le mode par défaut est 'Multimedia' — les touches F1-F12 activent le son, la luminosité, etc. sans Fn." },
            { text: "Windows a modifié les paramètres du clavier automatiquement", correct: false, feedback: "Windows ne contrôle pas ce comportement — il est géré au niveau BIOS/firmware du laptop." },
            { text: "Le clavier est défectueux et doit être remplacé", correct: false, feedback: "Si les touches répondent (même à l'envers), le clavier fonctionne. C'est un paramètre logiciel à corriger." }
          ],
          hint: "Les mises à jour BIOS réinitialisent les paramètres. Cherchez 'Fn Lock' ou 'Function Key Behavior' dans les options BIOS/UEFI.",
          callerReply: "Ah oui, ça fait sens. Comment je peux corriger ça sans avoir à retourner dans le BIOS ?"
        },
        {
          question: "Comment rétablir rapidement le comportement normal des touches de fonction ?",
          options: [
            { text: "Désinstaller et réinstaller les pilotes du clavier dans le Gestionnaire de périphériques", correct: false, feedback: "Les pilotes clavier ne contrôlent pas le comportement Fn. Cette action n'aura aucun effet sur le problème." },
            { text: "Appuyer sur Fn+Esc (touche Fn Lock) pour inverser le comportement — si non disponible, modifier le paramètre dans le BIOS/UEFI", correct: true, feedback: "Correct ! La majorité des laptops disposent d'une touche Fn Lock (souvent Fn+Esc ou Fn+verrou) qui bascule le comportement sans entrer dans le BIOS. Si cette combinaison n'existe pas sur ce modèle, l'option 'Function Key Behavior' dans le BIOS/UEFI (F2 ou Del au démarrage) résout définitivement le problème." },
            { text: "Modifier un paramètre dans les Options d'ergonomie de Windows", correct: false, feedback: "Windows ne propose pas de paramètre pour contrôler le comportement des touches Fn — c'est géré au niveau du firmware." },
            { text: "Redémarrer le PC en maintenant F10 pour restaurer les paramètres BIOS", correct: false, feedback: "F10 au démarrage n'a pas cet effet. La touche d'accès au BIOS dépend du fabricant (F2, Del, F12...) et les paramètres s'y modifient manuellement." }
          ],
          hint: "Sur la plupart des laptops HP, Dell, Lenovo : Fn+Esc bascule le Fn Lock. Un indicateur LED s'allume souvent pour signaler l'état actif.",
          callerReply: "J'ai appuyé sur Fn+Esc et une petite LED s'est allumée sur le clavier. Maintenant F5 refonctionne directement sans Fn. Merci !"
        }
      ]
    },

    // --- HARDWARE: Casque audio — micro non détecté ---
    {
      id: 'hardware-headset-mic',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Céline Morel',
      dept: 'Service Client',
      mood: 'frustrated',
      issue: 'Casque audio — micro non détecté en réunion Teams',
      terminalContext: {
        hostname: 'PC-SERVICECLIENT-05', username: 'celine.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.114'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Céline du service client. Je suis en réunion Teams là et personne ne m'entend ! Mon micro n'est pas détecté. J'ai pourtant bien branché mon casque." },
        { from: 'caller', text: "J'ai redémarré Teams mais ça ne change rien. Le casque fonctionne pour le son, j'entends les collègues, mais eux ne m'entendent pas du tout." }
      ],
      steps: [
        {
          question: "Le casque est branché et le son fonctionne, mais le micro n'est pas détecté dans Teams. Quelle est votre première vérification ?",
          options: [
            { text: "Désinstaller et réinstaller Teams", correct: false, feedback: "Trop radical pour commencer. Le problème est probablement au niveau du périphérique audio Windows, pas de Teams lui-même." },
            { text: "Vérifier les périphériques d'enregistrement Windows : clic droit sur l'icône son → Paramètres son → Enregistrement", correct: true, feedback: "Correct ! Windows doit d'abord reconnaître le micro comme périphérique d'enregistrement actif. Si le casque n'apparaît pas ou n'est pas défini par défaut, Teams ne pourra jamais le détecter." },
            { text: "Dire à l'utilisatrice de redémarrer son PC", correct: false, feedback: "Redémarrer peut parfois résoudre le problème mais n'identifie pas la cause. Commencez par vérifier les paramètres audio." },
            { text: "Lui demander d'utiliser le micro intégré du PC", correct: false, feedback: "Ce n'est pas une solution — on résout le problème du casque, on ne le contourne pas." }
          ],
          hint: "Clic droit sur l'icône son (barre des tâches) → Paramètres son → onglet Enregistrement. Ou : Exécuter → mmsys.cpl → onglet Enregistrement.",
          callerReply: "Je vois bien mon casque dans l'onglet Enregistrement, il est là. Mais il n'est pas coché comme périphérique par défaut — c'est le micro du PC qui est sélectionné."
        },
        {
          question: "Le micro du casque apparaît dans Windows mais n'est pas défini par défaut. Quelles sont les deux actions à effectuer ?",
          options: [
            { text: "Définir le casque comme périphérique d'enregistrement par défaut dans Windows, puis vérifier le micro sélectionné dans Teams (Paramètres → Appareils)", correct: true, feedback: "Parfait ! Double action nécessaire : 1) Windows doit utiliser le casque par défaut. 2) Teams a ses propres paramètres audio indépendants — il faut y sélectionner explicitement le casque." },
            { text: "Mettre à jour les pilotes audio depuis le Gestionnaire de périphériques", correct: false, feedback: "Le casque est déjà visible dans Windows, donc les pilotes fonctionnent. La mise à jour des pilotes n'est pas nécessaire ici." },
            { text: "Définir le casque par défaut dans Windows uniquement — Teams s'adaptera automatiquement", correct: false, feedback: "Pas toujours vrai. Teams mémorise son propre périphérique audio. Il faut vérifier ses paramètres séparément." },
            { text: "Redémarrer le service Windows Audio depuis services.msc", correct: false, feedback: "Le service audio fonctionne puisque le son est présent. Le problème est uniquement la sélection du périphérique par défaut." }
          ],
          hint: "Dans Teams : avatar en haut à droite → Paramètres → Appareils → Microphone. Choisir le casque dans la liste déroulante.",
          callerReply: "J'ai défini le casque par défaut dans Windows et changé le micro dans Teams. Les collègues m'entendent maintenant ! Merci, c'était rapide."
        }
      ]
    },

    // --- HARDWARE: Souris Bluetooth — déconnexion répétée ---
    {
      id: 'hardware-bluetooth-mouse',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Julie Bernard',
      dept: 'Communication',
      mood: 'frustrated',
      issue: 'Souris Bluetooth — déconnexions répétées toutes les quelques minutes',
      terminalContext: {
        hostname: 'PC-COM-06', username: 'julie.bernard',
        domain: 'CORP.LOCAL', ip: '192.168.1.119'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Julie du service communication. Ma souris Bluetooth se déconnecte toutes les 5-10 minutes depuis hier. Je dois la rebrancher à chaque fois — c'est épuisant." },
        { from: 'caller', text: "J'ai essayé de l'éteindre et de la rallumer mais ça ne dure pas. La souris est toute neuve, je l'ai reçue la semaine dernière." }
      ],
      steps: [
        {
          question: "Une souris Bluetooth neuve se déconnecte toutes les 5-10 minutes. Quelle est votre première vérification ?",
          options: [
            { text: "Remplacer la souris — elle est défectueuse", correct: false, feedback: "La souris est neuve mais une déconnexion répétée a des causes logicielles bien connues à vérifier avant d'envisager un échange matériel." },
            { text: "Vérifier le niveau de batterie de la souris", correct: true, feedback: "Correct ! Même une souris neuve peut avoir une batterie partiellement déchargée à la livraison. Une batterie faible est la première cause de déconnexions Bluetooth intermittentes." },
            { text: "Désinstaller et réinstaller le pilote Bluetooth", correct: false, feedback: "Pas en première approche. Commencez par le plus simple : la batterie." },
            { text: "Passer la souris en filaire USB", correct: false, feedback: "Ce n'est pas une solution — on résout le problème Bluetooth, on ne le contourne pas." }
          ],
          hint: "Vérifiez la charge de la batterie via l'application du fabricant, ou le niveau affiché dans Paramètres → Bluetooth et appareils.",
          callerReply: "La batterie affiche 85% dans les paramètres Windows. Ce n'est pas ça. Qu'est-ce qu'on vérifie ensuite ?"
        },
        {
          question: "La batterie est à 85%. Le problème vient probablement de la gestion d'énergie Windows. Quelle action corriger ?",
          options: [
            { text: "Désactiver le Bluetooth complètement puis le réactiver", correct: false, feedback: "Désactiver/réactiver le Bluetooth est temporaire et ne résout pas la cause racine — Windows coupera à nouveau l'adaptateur pour économiser de l'énergie." },
            { text: "Gestionnaire de périphériques → adaptateur Bluetooth → Propriétés → Gestion de l'alimentation → décocher 'Autoriser l'ordinateur à éteindre cet appareil pour économiser de l'énergie'", correct: true, feedback: "Parfait ! Windows coupe automatiquement les périphériques Bluetooth inactifs pour économiser la batterie du laptop. Désactiver cette option sur l'adaptateur Bluetooth maintient la connexion permanente." },
            { text: "Mettre à jour Windows — un bug connu cause ces déconnexions", correct: false, feedback: "Ce n'est pas un bug Windows mais un comportement de gestion d'énergie par défaut qu'il faut désactiver manuellement." },
            { text: "Changer le canal Bluetooth dans les paramètres avancés", correct: false, feedback: "Le Bluetooth ne propose pas de sélection manuelle de canal comme le Wi-Fi. Ce n'est pas la bonne piste." }
          ],
          hint: "Gestionnaire de périphériques (devmgmt.msc) → Bluetooth → clic droit sur l'adaptateur → Propriétés → onglet Gestion de l'alimentation.",
          callerReply: "J'ai décoché cette option dans le gestionnaire. Ça fait 20 minutes que la souris reste connectée sans interruption. Merci beaucoup !"
        }
      ]
    },

    // --- HARDWARE: Imprimante locale — papier coincé persistant ---
    {
      id: 'hardware-printer-paper-jam',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Martine Girard',
      dept: 'Service Client',
      mood: 'frustrated',
      issue: 'Imprimante locale — erreur papier coincé persistante après dégagement',
      terminalContext: {
        hostname: 'PC-SERVICECLIENT-02', username: 'martine.girard',
        domain: 'CORP.LOCAL', ip: '192.168.1.116'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Martine du service client. Mon imprimante locale affiche 'Papier coincé' depuis ce matin. J'ai déjà ouvert le capot et retiré le papier, mais l'erreur ne disparaît pas." },
        { from: 'caller', text: "J'ai redémarré l'imprimante deux fois. Le message revient à chaque fois. J'ai des documents urgents à imprimer pour un client." }
      ],
      steps: [
        {
          question: "L'utilisatrice a retiré le papier visible mais l'erreur 'Papier coincé' persiste. Quelle est votre première instruction ?",
          options: [
            { text: "Remplacer l'imprimante — elle est probablement défectueuse", correct: false, feedback: "Une erreur persistante après dégagement visible est presque toujours due à un fragment de papier déchiré encore présent dans le circuit. Vérifiez tous les accès avant de conclure à une panne." },
            { text: "Demander à l'utilisatrice de vérifier soigneusement tous les accès de l'imprimante — bac papier, porte arrière, zone du tambour — à la recherche d'un fragment déchiré", correct: true, feedback: "Correct ! Le capteur de bourrage détecte des morceaux de papier de quelques centimètres. Un petit fragment invisible au premier coup d'œil suffit à maintenir l'erreur. Il faut inspecter méthodiquement chaque accès avec une lampe si nécessaire." },
            { text: "Réinstaller le pilote de l'imprimante depuis le Gestionnaire de périphériques", correct: false, feedback: "Le pilote ne contrôle pas les capteurs physiques du papier. Réinstaller le pilote ne résoudra pas un bourrage persistant." },
            { text: "Lancer une impression de test depuis Windows — ça réinitialise souvent les erreurs", correct: false, feedback: "Lancer une impression avec un bourrage actif aggrave le problème — les feuilles s'accumulent contre le papier coincé." }
          ],
          hint: "Les imprimantes HP et Canon ont souvent une porte arrière amovible. Vérifiez aussi le bac de sortie et la zone de fusion (attention : chaude). Utilisez une lampe de poche pour voir dans les zones sombres.",
          callerReply: "J'ai trouvé un tout petit morceau déchiré dans la porte arrière — il était coincé dans les rouleaux. Je l'ai retiré avec précaution."
        },
        {
          question: "Le fragment a été retiré mais l'imprimante affiche encore l'erreur. Comment réinitialiser complètement l'imprimante ?",
          options: [
            { text: "Éteindre l'imprimante avec le bouton d'alimentation, débrancher le câble électrique 30 secondes, rebrancher et rallumer", correct: true, feedback: "Parfait ! Un cycle d'alimentation complet (avec débranchement électrique) vide les mémoires tampons et réinitialise les capteurs. Un simple redémarrage via le bouton ne suffit pas toujours car l'imprimante reste alimentée en veille." },
            { text: "Redémarrer le PC — Windows relancera l'imprimante automatiquement", correct: false, feedback: "Redémarrer le PC n'agit pas sur l'électronique de l'imprimante. C'est l'imprimante elle-même qui doit être réinitialisée par un cycle d'alimentation complet." },
            { text: "Désinstaller et réinstaller l'imprimante dans Windows", correct: false, feedback: "La suppression et réinstallation de l'imprimante dans Windows ne réinitialise pas les capteurs physiques de l'appareil." },
            { text: "Appuyer simultanément sur les boutons de l'imprimante pour un reset usine", correct: false, feedback: "Un reset usine efface tous les paramètres réseau et personnalisés — totalement disproportionné pour résoudre une erreur de bourrage résiduelle." }
          ],
          hint: "Si l'erreur persiste après le cycle d'alimentation, vider aussi la file d'attente Windows : Paramètres → Imprimantes → clic droit → Voir ce qui s'imprime → Annuler tous les documents.",
          callerReply: "J'ai débranché 30 secondes et rebranché. L'imprimante redémarre sans erreur ! Je vais lancer mes impressions. Merci !"
        }
      ]
    },

    // --- HARDWARE: Webcam non reconnue dans Teams ---
    {
      id: 'hardware-webcam-teams',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Bernard Leroy',
      dept: 'Direction',
      mood: 'calm',
      issue: 'Webcam non reconnue dans Teams — caméra indisponible en réunion',
      terminalContext: {
        hostname: 'PC-DIR-03', username: 'bernard.leroy',
        domain: 'CORP.LOCAL', ip: '192.168.1.142'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Bernard de la direction. Depuis ce matin, ma caméra ne fonctionne plus dans Teams. Le bouton caméra est grisé et j'ai le message 'Aucune caméra trouvée'." },
        { from: 'caller', text: "La webcam est bien branchée en USB. Elle fonctionnait très bien hier. J'ai une réunion de direction dans une heure et j'ai besoin de la caméra." }
      ],
      steps: [
        {
          question: "Teams affiche 'Aucune caméra trouvée' malgré la webcam branchée. Quelle est votre première vérification ?",
          options: [
            { text: "Désinstaller et réinstaller Teams — un bug de mise à jour bloque souvent la caméra", correct: false, feedback: "Avant de réinstaller quoi que ce soit, vérifiez les autorisations Windows. Une mise à jour de Windows 10/11 peut réinitialiser les permissions caméra pour toutes les applications." },
            { text: "Vérifier les paramètres de confidentialité Windows : Paramètres → Confidentialité → Caméra — s'assurer que l'accès caméra est activé et que Teams est autorisé", correct: true, feedback: "Correct ! Windows 10/11 gère les autorisations d'accès à la caméra application par application. Une mise à jour ou une manipulation peut désactiver l'accès pour Teams. C'est la première cause d'une caméra soudainement indisponible dans une application spécifique." },
            { text: "Remplacer la webcam USB par une autre — elle est probablement en panne", correct: false, feedback: "Si la caméra fonctionnait hier, une panne subite sans choc physique est peu probable. Vérifiez les paramètres logiciels d'abord." },
            { text: "Redémarrer le service Windows Camera depuis services.msc", correct: false, feedback: "Il n'existe pas de service 'Windows Camera' distinct dans services.msc. La caméra est gérée par le Gestionnaire de périphériques et les paramètres de confidentialité." }
          ],
          hint: "Paramètres Windows (Win+I) → Confidentialité et sécurité → Caméra → vérifier 'Autoriser les applications à accéder à votre caméra' + chercher Microsoft Teams dans la liste.",
          callerReply: "L'accès caméra global est bien activé, et Teams est bien autorisé dans la liste. Le problème vient d'ailleurs."
        },
        {
          question: "Les autorisations Windows sont correctes. Comment forcer Teams à reconnaître la webcam ?",
          options: [
            { text: "Vérifier dans Teams : avatar → Paramètres → Appareils → Caméra — sélectionner la webcam dans la liste déroulante", correct: true, feedback: "Parfait ! Teams mémorise le dernier périphérique caméra utilisé. Si la webcam a été reconnectée sur un port USB différent ou si Windows lui a attribué un nouvel identifiant, Teams pointe vers un périphérique qui n'existe plus. Il suffit de sélectionner la bonne webcam dans les paramètres Teams." },
            { text: "Mettre à jour le pilote de la webcam depuis le Gestionnaire de périphériques", correct: false, feedback: "Si la webcam fonctionnait hier sans mise à jour, son pilote est correct. La mise à jour du pilote n'est pas la cause ici — Teams pointe simplement vers le mauvais périphérique." },
            { text: "Désactiver puis réactiver la webcam dans le Gestionnaire de périphériques", correct: false, feedback: "Cette action peut aider si le périphérique est en erreur, mais si la webcam apparaît sans point d'exclamation dans le Gestionnaire, son état est sain. Le problème est dans la sélection Teams." },
            { text: "Créer un nouveau profil utilisateur Windows pour contourner le problème", correct: false, feedback: "Totalement disproportionné. Le problème est un simple paramètre de sélection de caméra dans Teams, pas un profil corrompu." }
          ],
          hint: "Dans Teams : cliquer sur l'avatar en haut à droite → Paramètres → Appareils → section Caméra → cliquer sur la liste déroulante et sélectionner la webcam. Un aperçu vidéo confirme que la caméra est active.",
          callerReply: "Teams pointait vers une ancienne caméra intégrée qui n'existe plus sur ce PC. J'ai sélectionné la webcam USB dans la liste et l'aperçu s'affiche ! Merci, tout est prêt pour ma réunion."
        }
      ]
    },

    // --- HARDWARE: Écran externe non détecté ---
    {
      id: 'hardware-external-screen',
      category: 'Hardware',
      level: 1,
      difficulty: 'easy',
      caller: 'Amélie Fontaine',
      dept: 'Commercial',
      mood: 'calm',
      issue: 'Écran externe non détecté — Windows n\'affiche qu\'un seul écran',
      terminalContext: {
        hostname: 'PC-COM-09', username: 'amelie.fontaine',
        domain: 'CORP.LOCAL', ip: '192.168.1.103'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Amélie du commercial. J'ai branché mon écran externe en HDMI comme d'habitude, mais Windows ne le détecte pas du tout. Je n'ai que mon écran de laptop." },
        { from: 'caller', text: "J'ai redémarré le PC une fois mais ça n'a rien changé. L'écran externe affiche juste 'Pas de signal'. J'en ai besoin pour présenter un tableau de bord client cet après-midi." }
      ],
      steps: [
        {
          question: "L'écran externe affiche 'Pas de signal'. Quelles vérifications physiques effectuez-vous en premier ?",
          options: [
            { text: "Mettre à jour le pilote de la carte graphique — c'est la cause habituelle", correct: false, feedback: "Si l'écran fonctionnait avant sans mise à jour, le pilote n'est pas la cause. Commencez toujours par le physique : câble, connexions, source d'entrée." },
            { text: "Vérifier que le câble HDMI est bien branché des deux côtés, que l'écran est allumé et que la bonne source d'entrée est sélectionnée sur le moniteur", correct: true, feedback: "Correct ! 'Pas de signal' signifie que le moniteur ne reçoit aucun signal vidéo. Trois causes physiques immédiates : câble mal serti, écran sur la mauvaise entrée (HDMI 1 vs HDMI 2 vs DisplayPort), ou simplement éteint. Ce sont les premières secondes de diagnostic." },
            { text: "Brancher l'écran sur un autre PC pour tester si le moniteur fonctionne", correct: false, feedback: "C'est une bonne vérification mais pas la première — commencez par les causes simples sur le poste concerné avant de déplacer du matériel." },
            { text: "Réinstaller Windows — une corruption système peut bloquer la détection d'écran", correct: false, feedback: "Totalement disproportionné. La détection d'écran est rarement liée à Windows lui-même — c'est presque toujours un problème physique ou un paramètre d'affichage." }
          ],
          hint: "Sur le moniteur : cherchez le bouton 'Source' ou 'Input' pour changer l'entrée. Vérifiez aussi que le câble HDMI est bien clipsé — un câble partiellement inséré peut sembler branché sans l'être vraiment.",
          callerReply: "Le câble est bien branché des deux côtés, l'écran est allumé et sur l'entrée HDMI 1. Mais Windows ne montre toujours qu'un seul écran dans les paramètres d'affichage."
        },
        {
          question: "Les connexions physiques sont correctes mais Windows ne détecte pas l'écran. Comment forcer la détection ?",
          options: [
            { text: "Utiliser le raccourci Windows + P pour ouvrir le menu de projection et sélectionner 'Étendre', puis aller dans Paramètres → Affichage → Détecter si l'écran n'apparaît pas", correct: true, feedback: "Parfait ! Win+P ouvre le panneau de projection instantanément — utile pour basculer entre les modes (PC seul, Dupliquer, Étendre, Deuxième écran). Si l'écran n'apparaît toujours pas, le bouton 'Détecter' dans Paramètres → Affichage force Windows à rescanner les sorties vidéo." },
            { text: "Redémarrer le PC une deuxième fois — la première tentative échoue parfois", correct: false, feedback: "Si un redémarrage n'a pas suffi, un deuxième ne changera rien. Le bouton 'Détecter' dans les paramètres d'affichage est plus ciblé et plus rapide." },
            { text: "Désinstaller et réinstaller le pilote de la carte graphique", correct: false, feedback: "Si la carte graphique fonctionne (l'écran du laptop affiche normalement), son pilote est sain. La réinstallation du pilote est une dernière recours, pas une deuxième étape." },
            { text: "Changer le câble HDMI — il est sûrement défectueux", correct: false, feedback: "Possible, mais avant de changer le câble, utilisez le bouton 'Détecter' dans Windows — c'est gratuit, immédiat et résout la majorité des cas de non-détection après connexion correcte." }
          ],
          hint: "Win+P → Étendre. Si l'écran n'apparaît pas : clic droit sur le bureau → Paramètres d'affichage → faire défiler vers le bas → bouton 'Détecter'. L'écran devrait apparaître avec un numéro.",
          callerReply: "Win+P n'affichait qu'un écran, mais après avoir cliqué 'Détecter' dans les paramètres, le deuxième écran est apparu ! J'ai sélectionné 'Étendre' et tout fonctionne. Merci !"
        }
      ]
    },

    // --- WINDOWS: File d'attente d'impression bloquée ---
    {
      id: 'windows-print-queue-stuck',
      category: 'Windows',
      level: 1,
      difficulty: 'easy',
      caller: 'Sophie Lemaire',
      dept: 'Marketing',
      mood: 'frustrated',
      issue: 'File d\'attente d\'impression bloquée — impossible d\'imprimer ni de supprimer les documents',
      terminalContext: {
        hostname: 'PC-MARKETING-05', username: 'sophie.lemaire',
        domain: 'CORP.LOCAL', ip: '192.168.1.109'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Sophie du marketing. Mon imprimante n'imprime plus rien depuis ce matin. J'ai 6 documents en attente dans la file d'impression et je ne peux même pas les supprimer — le bouton 'Annuler' ne fait rien." },
        { from: 'caller', text: "J'ai redémarré l'imprimante mais les documents restent bloqués dans la file. J'ai besoin d'imprimer des supports pour une réunion dans 30 minutes." }
      ],
      steps: [
        {
          question: "La file d'impression est bloquée et les documents ne peuvent pas être supprimés. Quelle est la cause et la solution ?",
          options: [
            { text: "Désinstaller et réinstaller l'imprimante dans Windows", correct: false, feedback: "La réinstallation de l'imprimante ne vide pas une file bloquée — les documents resteraient. De plus, c'est une opération longue inutile ici." },
            { text: "Arrêter le service Print Spooler (spouleur d'impression), vider manuellement le dossier de spool, puis redémarrer le service", correct: true, feedback: "Correct ! Le service Print Spooler gère la file d'impression. Quand il est bloqué, les documents ne peuvent ni être imprimés ni supprimés via l'interface normale. L'arrêter force la libération des fichiers, ce qui permet de les supprimer manuellement." },
            { text: "Redémarrer le PC — le service redémarrera automatiquement et videra la file", correct: false, feedback: "Pas toujours vrai. Un redémarrage peut laisser les fichiers de spool corrompus en place, reproduisant le blocage au démarrage suivant. La procédure manuelle est plus fiable." },
            { text: "Formater la file d'impression depuis le panneau de configuration", correct: false, feedback: "Il n'existe pas d'option 'formater la file' dans le panneau de configuration. La gestion du spooler se fait via les services Windows." }
          ],
          hint: "services.msc → Print Spooler → Arrêter. Puis naviguer vers C:\\Windows\\System32\\spool\\PRINTERS et supprimer tous les fichiers (pas le dossier). Puis redémarrer le service.",
          terminalCommand: "net stop spooler",
          callerReply: "D'accord, je fais quoi exactement après avoir arrêté le service ?"
        },
        {
          question: "Le service Print Spooler est arrêté. Quelle est la prochaine étape ?",
          options: [
            { text: "Redémarrer le service immédiatement — il se videra tout seul", correct: false, feedback: "Si vous redémarrez le service sans supprimer les fichiers corrompus, les mêmes documents bloqués seront rechargés et le problème persistera." },
            { text: "Supprimer tous les fichiers dans C:\\Windows\\System32\\spool\\PRINTERS, puis redémarrer le service Print Spooler", correct: true, feedback: "Parfait ! Les fichiers .SHD et .SPL dans ce dossier sont les documents en attente d'impression. Les supprimer avec le service arrêté vide proprement la file. Le redémarrage du service repart alors sur une file vide et propre." },
            { text: "Supprimer le dossier PRINTERS entier puis redémarrer", correct: false, feedback: "Supprimer le dossier lui-même est une erreur — Windows a besoin de ce dossier pour fonctionner. Supprimez uniquement les fichiers à l'intérieur, pas le dossier." },
            { text: "Modifier les permissions du dossier spool pour donner accès à l'utilisateur", correct: false, feedback: "Les permissions du dossier spool ne sont pas en cause ici — le problème est des fichiers corrompus qui bloquent le service, pas un problème de droits." }
          ],
          hint: "Avec le service arrêté : ouvrir l'Explorateur → C:\\Windows\\System32\\spool\\PRINTERS → sélectionner tout (Ctrl+A) → supprimer. Puis services.msc → Print Spooler → Démarrer. Ou en une ligne : net start spooler",
          terminalCommand: "net start spooler",
          callerReply: "J'ai supprimé les fichiers du dossier et redémarré le service. La file est vide et mon imprimante fonctionne à nouveau ! Mes supports sont imprimés. Merci !"
        }
      ]
    },

    // --- WINDOWS: Résolution écran incorrecte après redémarrage ---
    {
      id: 'windows-wrong-resolution',
      category: 'Windows',
      level: 1,
      difficulty: 'easy',
      caller: 'Nathalie Simon',
      dept: 'Qualité',
      mood: 'calm',
      issue: 'Résolution d\'écran incorrecte après redémarrage — affichage flou et agrandi',
      terminalContext: {
        hostname: 'PC-QUALITE-03', username: 'nathalie.simon',
        domain: 'CORP.LOCAL', ip: '192.168.1.117'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Nathalie du service qualité. Depuis ce matin après le redémarrage de mon PC, tout est affiché en très grand et flou. Les icônes sont énormes et le texte est difficile à lire." },
        { from: 'caller', text: "Il y a eu une mise à jour Windows la nuit dernière. Je pense que ça a changé quelque chose dans mon affichage. Comment remettre ça comme avant ?" }
      ],
      steps: [
        {
          question: "L'affichage est agrandi et flou après une mise à jour Windows. Quelle est votre première action ?",
          options: [
            { text: "Restaurer Windows au point de restauration précédant la mise à jour", correct: false, feedback: "La restauration système est disproportionnée pour un problème de résolution d'affichage. La cause est presque toujours un pilote graphique mis à jour — corrigible en quelques clics." },
            { text: "Clic droit sur le bureau → Paramètres d'affichage → Résolution → sélectionner la résolution recommandée (marquée 'Recommandé')", correct: true, feedback: "Correct ! Une mise à jour Windows peut réinitialiser la résolution à une valeur inférieure à la résolution native du moniteur, d'où l'affichage agrandi et flou. La résolution 'Recommandé' correspond à la résolution native de l'écran et donne un affichage net." },
            { text: "Désinstaller la mise à jour Windows — elle a cassé l'affichage", correct: false, feedback: "La mise à jour n'est pas nécessairement en cause — et la désinstaller peut exposer le système. Corrigez d'abord la résolution, c'est la solution la plus simple et la plus rapide." },
            { text: "Brancher un autre écran pour vérifier si le problème vient du moniteur", correct: false, feedback: "Si le problème est apparu après une mise à jour sans changement physique, la cause est logicielle. Vérifiez les paramètres de résolution avant de manipuler du matériel." }
          ],
          hint: "Clic droit bureau → Paramètres d'affichage → Résolution d'affichage. La valeur 'Recommandé' correspond à la résolution native (ex: 1920x1080 pour un écran Full HD). Sélectionner et Conserver les modifications.",
          callerReply: "La résolution était à 1024x768 alors qu'avant c'était 1920x1080. J'ai remis en 1920x1080 Recommandé. L'affichage est revenu normal. Mais est-ce que ça risque de se reproduire au prochain redémarrage ?"
        },
        {
          question: "La résolution est corrigée mais Nathalie craint que ça se reproduise. Comment stabiliser l'affichage durablement ?",
          options: [
            { text: "Rien — si le problème revient, elle rappellera", correct: false, feedback: "Une résolution qui se réinitialise à chaque redémarrage indique un pilote graphique instable ou générique. Il faut stabiliser le pilote pour éviter la récidive." },
            { text: "Mettre à jour ou réinstaller le pilote de la carte graphique depuis le Gestionnaire de périphériques — Windows a peut-être installé un pilote générique à la place du pilote fabricant", correct: true, feedback: "Exact ! Une mise à jour Windows peut remplacer le pilote graphique certifié par un pilote générique Microsoft (MSBDD) qui ne mémorise pas correctement les paramètres d'affichage. Mettre à jour le pilote depuis le fabricant (Intel, NVIDIA, AMD) ou via le Gestionnaire de périphériques → 'Rechercher automatiquement des pilotes' restaure un pilote stable." },
            { text: "Désactiver les mises à jour automatiques des pilotes dans Windows", correct: false, feedback: "Désactiver les mises à jour de pilotes peut créer des failles de sécurité. Mieux vaut configurer Windows pour ne pas remplacer les pilotes manuellement installés (Paramètres avancés du système → Matériel → Paramètres d'installation des périphériques)." },
            { text: "Créer un script au démarrage qui réapplique la résolution 1920x1080 à chaque connexion", correct: false, feedback: "Un script de contournement masque le problème sans le résoudre. La bonne solution est de stabiliser le pilote graphique." }
          ],
          hint: "Gestionnaire de périphériques (devmgmt.msc) → Cartes graphiques → clic droit → Mettre à jour le pilote → Rechercher automatiquement. Si le pilote générique est installé, il affichera 'Microsoft Basic Display Adapter' — dans ce cas, téléchargez le pilote Intel/NVIDIA/AMD depuis le site du fabricant.",
          callerReply: "Le Gestionnaire de périphériques montrait 'Microsoft Basic Display Adapter'. J'ai téléchargé le pilote Intel depuis le site et réinstallé — la résolution est maintenant stable et correcte même après redémarrage. Merci !"
        }
      ]
    },

    // --- WINDOWS: PC ne sort pas de veille ---
    {
      id: 'windows-sleep-no-wake',
      category: 'Windows',
      level: 1,
      difficulty: 'easy',
      caller: 'Paul Lefevre',
      dept: 'Formation',
      mood: 'calm',
      issue: 'PC ne sort pas de veille — écran noir, aucune réaction au clavier ni à la souris',
      terminalContext: {
        hostname: 'PC-FORMATION-02', username: 'paul.lefevre',
        domain: 'CORP.LOCAL', ip: '192.168.1.86'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Paul du service formation. Mon PC ne sort plus de veille ce matin. L'écran est noir et il ne réagit ni au clavier ni à la souris. Les voyants du PC semblent allumés." },
        { from: 'caller', text: "J'ai une session de formation dans 20 minutes et j'ai besoin de mon PC. Qu'est-ce que je peux faire ?" }
      ],
      steps: [
        {
          question: "PC en veille, écran noir, aucune réaction au clavier ou à la souris. Quelle est la première séquence d'actions ?",
          options: [
            { text: "Appuyer et maintenir le bouton d'alimentation 10 secondes pour forcer l'arrêt immédiatement", correct: false, feedback: "Forcer l'arrêt est une dernière option — elle coupe le courant brutalement et peut corrompre des fichiers ouverts. Tentez d'abord des actions moins destructives : touche clavier, mouvement souris, puis appui court sur le bouton d'alimentation." },
            { text: "Appuyer sur une touche du clavier ou déplacer la souris, puis essayer un appui court (1 seconde) sur le bouton d'alimentation pour déclencher le réveil", correct: true, feedback: "Correct ! L'ordre est important : 1) Touche clavier ou mouvement souris — si le périphérique est configuré pour réveiller le PC, ça suffit. 2) Appui court sur le bouton d'alimentation — envoie un signal de réveil sans couper l'alimentation. 3) Seulement en dernier recours : maintien 10 secondes pour forcer l'arrêt." },
            { text: "Débrancher et rebrancher le câble d'alimentation du PC", correct: false, feedback: "Débrancher l'alimentation pendant la veille peut corrompre des fichiers ouverts, comme un arrêt forcé brutal. C'est une dernière extrémité, pas une première action." },
            { text: "Attendre 5 minutes — le PC sortira de veille tout seul", correct: false, feedback: "Un PC bloqué en veille n'en sort pas seul. Une intervention est nécessaire — Paul a une formation dans 20 minutes." }
          ],
          hint: "Si l'écran reste noir après touche clavier + appui court sur power : vérifiez que l'écran externe est allumé et sur la bonne entrée. Si le PC ne répond vraiment pas : force shutdown (10s) puis redémarrage normal.",
          callerReply: "L'appui court sur le bouton d'alimentation n'a rien fait. J'ai maintenu 10 secondes, le PC s'est éteint, j'ai rallumé et tout est revenu. Mais comment éviter que ça se reproduise ?"
        },
        {
          question: "PC redémarré, problème immédiat résolu. Comment configurer Windows pour éviter les blocages de veille ?",
          options: [
            { text: "Désactiver complètement la mise en veille — le PC ne dormira plus jamais", correct: false, feedback: "Désactiver la veille augmente la consommation électrique et l'usure matérielle. Mieux vaut configurer la veille correctement plutôt que la supprimer." },
            { text: "Désactiver la veille hybride (Options d'alimentation → Paramètres avancés → Veille → Autoriser la mise en veille hybride → Désactivé) et vérifier que le clavier est autorisé à réveiller le PC dans le Gestionnaire de périphériques", correct: true, feedback: "Parfait ! La veille hybride (qui combine veille et mise en veille prolongée) est souvent responsable des blocages au réveil — la désactiver résout la majorité des cas. Vérifier le Gestionnaire de périphériques → Claviers → Propriétés → Gestion de l'alimentation → 'Autoriser ce périphérique à sortir l'ordinateur de veille' garantit que le clavier peut toujours réveiller le PC." },
            { text: "Mettre à jour le BIOS — un bug BIOS cause souvent les problèmes de veille", correct: false, feedback: "Une mise à jour BIOS peut résoudre certains problèmes de veille avancés, mais ce n'est pas la première action recommandée. Commencez par les paramètres Windows accessibles sans risque." },
            { text: "Raccourcir le délai de mise en veille à 1 minute pour que le PC entre et sorte fréquemment de veille", correct: false, feedback: "Réduire le délai de veille ne résout pas un problème de réveil — ça augmente seulement la fréquence des cycles veille/réveil et donc les occasions de bloquer." }
          ],
          hint: "Panneau de configuration → Options d'alimentation → Modifier les paramètres du mode → Modifier les paramètres d'alimentation avancés → Veille → Autoriser la mise en veille hybride → Désactivé. Gestionnaire de périphériques → Claviers → clic droit → Propriétés → Gestion de l'alimentation.",
          callerReply: "J'ai désactivé la veille hybride et activé le réveil par clavier. Ma formation s'est bien passée. Plus aucun blocage depuis. Merci !"
        }
      ]
    },

    // --- WINDOWS: Disque C: plein ---
    {
      id: 'windows-disk-full',
      category: 'Windows',
      level: 1,
      difficulty: 'easy',
      caller: 'Céline Morel',
      dept: 'Service Client',
      mood: 'frustrated',
      issue: 'Disque C: plein — impossible de sauvegarder, applications en erreur',
      terminalContext: {
        hostname: 'PC-SERVICECLIENT-08', username: 'celine.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.115'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Céline du service client. Mon PC affiche en permanence 'Espace disque insuffisant' et je ne peux plus rien sauvegarder. Mon disque C: affiche en rouge dans l'explorateur." },
        { from: 'caller', text: "Plusieurs applications ont commencé à planter depuis ce matin à cause de ça. Je ne sais pas comment ça s'est rempli aussi vite." }
      ],
      steps: [
        {
          question: "Disque C: plein, applications en erreur. Quelle est la première action pour libérer de l'espace rapidement ?",
          options: [
            { text: "Supprimer des fichiers dans le dossier Windows\\System32 pour libérer de l'espace", correct: false, feedback: "Supprimer des fichiers dans System32 est extrêmement dangereux — vous risquez de rendre Windows inutilisable. Ne touchez jamais aux dossiers système." },
            { text: "Lancer le Nettoyage de disque (cleanmgr.exe) pour supprimer les fichiers temporaires, les fichiers Windows Update inutiles et vider la Corbeille", correct: true, feedback: "Correct ! Le Nettoyage de disque identifie et supprime en toute sécurité les fichiers récupérables : fichiers temporaires, cache Windows Update, vignettes, éléments de la Corbeille. En mode administrateur, il propose aussi de nettoyer les fichiers système (anciennes installations Windows, journaux). C'est le premier outil à utiliser." },
            { text: "Formater le disque C: et réinstaller Windows pour repartir de zéro", correct: false, feedback: "Formater C: supprime tout — Windows, applications et données. C'est une solution radicale pour un problème qui se résout en quelques minutes avec les bons outils." },
            { text: "Acheter un disque externe et y déplacer Windows", correct: false, feedback: "Windows ne peut pas être déplacé sur un disque externe facilement. Libérez d'abord l'espace existant avec les outils appropriés." }
          ],
          hint: "Exécuter (Win+R) → cleanmgr.exe → sélectionner C: → cocher tout. Pour les fichiers système : cliquer 'Nettoyer les fichiers système' (nécessite droits admin). L'espace récupérable est affiché avant la suppression.",
          terminalCommand: "cleanmgr.exe",
          callerReply: "Le Nettoyage de disque a libéré 4,2 Go — surtout des fichiers Windows Update et temporaires. Mais il reste seulement 1,5 Go libre sur 120 Go. C'est encore trop peu."
        },
        {
          question: "Après nettoyage, seulement 1,5 Go libre reste. Comment identifier et traiter les gros fichiers qui occupent le disque ?",
          options: [
            { text: "Utiliser l'Analyseur de stockage Windows (Paramètres → Système → Stockage → Afficher l'utilisation du stockage) ou un outil comme WinDirStat pour identifier les dossiers et fichiers les plus volumineux", correct: true, feedback: "Parfait ! L'Analyseur de stockage Windows visualise l'espace par catégorie (applications, fichiers temporaires, autres). WinDirStat (gratuit) offre une vue graphique encore plus détaillée par dossier. Ces outils révèlent typiquement : un dossier Téléchargements plein de vieux fichiers, des vidéos sur le Bureau, des sauvegardes volumineuses, ou des logs applicatifs accumulés." },
            { text: "Compresser le disque C: entier avec la compression NTFS pour doubler l'espace disponible", correct: false, feedback: "La compression NTFS ralentit significativement les performances du système — chaque accès fichier nécessite une décompression à la volée. Ce n'est pas une solution recommandée pour un disque système." },
            { text: "Désinstaller Windows et réinstaller une version allégée", correct: false, feedback: "Totalement disproportionné. Identifiez les fichiers volumineux et déplacez-les — c'est la solution rapide, sans risque et sans perte de données." },
            { text: "Augmenter la taille de la partition C: en empiétant sur la partition D:", correct: false, feedback: "Redimensionner les partitions est risqué et nécessite que la partition D: ait de l'espace libre adjacent à C:. Déplacez d'abord les gros fichiers vers D: ou un lecteur réseau — c'est plus simple et sans risque." }
          ],
          hint: "Paramètres (Win+I) → Système → Stockage → cliquer sur C: pour voir la répartition. Vérifiez : Téléchargements, Bureau, Vidéos, Musique. Les fichiers volumineux non essentiels doivent être déplacés vers le lecteur réseau (\\\\SRV-FILES\\ServiceClient) ou supprimés.",
          callerReply: "WinDirStat a révélé un dossier 'Enregistrements_Teams' de 38 Go sur le Bureau — des enregistrements de réunions de l'année dernière. Je les ai déplacés sur le lecteur réseau. Maintenant j'ai 39 Go libres. Merci !"
        }
      ]
    },

    // --- M365: Boîte mail pleine — quota dépassé ---
    {
      id: 'm365-mailbox-full',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Christine Faure',
      dept: 'Comptabilité',
      mood: 'frustrated',
      issue: 'Boîte mail Outlook pleine — quota 50 Go dépassé, e-mails non reçus',
      terminalContext: {
        hostname: 'PC-COMPTA-12', username: 'christine.faure',
        domain: 'CORP.LOCAL', ip: '192.168.1.95'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Christine de la comptabilité. Depuis ce matin je reçois des notifications Outlook qui disent que ma boîte mail est pleine et que je ne peux plus recevoir de nouveaux e-mails. Des clients m'ont dit que leurs messages revenaient en erreur." },
        { from: 'caller', text: "Je vois bien dans Outlook que j'ai presque 50 Go utilisés sur 50 Go. J'ai accumulé beaucoup d'e-mails avec des pièces jointes depuis des années. Comment libérer de l'espace rapidement ?" }
      ],
      steps: [
        {
          question: "Boîte mail à 50/50 Go. Quelles actions immédiates permettent de libérer de l'espace rapidement ?",
          options: [
            { text: "Supprimer tous les e-mails de plus d'un an sans vérification — c'est trop vieux pour être utile", correct: false, feedback: "Supprimer massivement sans vérification est risqué — certains e-mails anciens peuvent avoir une valeur légale ou comptable. Commencez par vider les dossiers toujours récupérables (Éléments supprimés, Courrier indésirable) et cibler les grosses pièces jointes." },
            { text: "Vider les dossiers Éléments supprimés et Courrier indésirable, puis trier la boîte de réception et les Éléments envoyés par taille pour identifier et supprimer les e-mails avec les plus grosses pièces jointes", correct: true, feedback: "Correct ! Les Éléments supprimés et le Courrier indésirable consomment de l'espace sans valeur — les vider en premier est sans risque. Trier par taille (Affichage → Trier par → Taille) révèle immédiatement les e-mails avec des pièces jointes volumineuses — souvent quelques dizaines d'e-mails représentent 80% de l'espace utilisé." },
            { text: "Exporter toute la boîte mail en fichier .pst et supprimer tous les e-mails du serveur", correct: false, feedback: "Un export .pst complet de 50 Go prendrait des heures et rendrait les e-mails inaccessibles depuis d'autres appareils. Commencez par les actions rapides (vider corbeille, supprimer les gros e-mails) avant d'envisager une archivage." },
            { text: "Contacter Microsoft pour augmenter le quota — 50 Go est insuffisant", correct: false, feedback: "Avant de demander plus d'espace, libérez ce qui est déjà là. Microsoft propose des archives en ligne, mais la première étape est le nettoyage des données inutiles." }
          ],
          hint: "Dans Outlook : clic droit sur Éléments supprimés → Vider le dossier. Clic droit sur Courrier indésirable → Supprimer tout. Dans la Boîte de réception : Affichage → Trier par taille (décroissant) → sélectionner et supprimer les e-mails > 10 Mo dont vous n'avez plus besoin.",
          callerReply: "J'ai vidé les Éléments supprimés (3,2 Go) et le Courrier indésirable (1,8 Go). En triant par taille, j'ai trouvé 15 e-mails avec des vidéos ou fichiers CAO lourds — supprimés. J'ai récupéré 12 Go. Mais comment éviter de remplir à nouveau aussi vite ?"
        },
        {
          question: "12 Go récupérés. Comment gérer la croissance de la boîte mail à long terme ?",
          options: [
            { text: "Demander à l'administrateur d'activer l'archive en ligne M365 (In-Place Archive) pour ajouter un espace d'archivage illimité lié à la boîte principale", correct: true, feedback: "Parfait ! L'archive en ligne M365 (Exchange Online Archiving) ajoute un espace d'archivage supplémentaire accessible directement depuis Outlook — les anciens e-mails y sont déplacés automatiquement selon une politique d'archivage configurable (ex: tout ce qui a plus de 2 ans). L'admin active cette option dans le Centre d'administration Exchange en quelques clics." },
            { text: "Demander à Christine de ne plus utiliser les pièces jointes — partager les fichiers via SharePoint uniquement", correct: false, feedback: "Bonne pratique à encourager, mais changer les habitudes de travail prend du temps et ne résout pas le problème immédiat. L'archive en ligne est la solution structurelle pour la boîte existante." },
            { text: "Acheter un abonnement Microsoft 365 avec plus de stockage pour Christine", correct: false, feedback: "Avant d'augmenter le quota, utilisez les fonctionnalités déjà incluses dans M365 — l'archive en ligne est disponible dans la plupart des plans Enterprise sans coût supplémentaire." },
            { text: "Configurer Outlook pour supprimer automatiquement tous les e-mails après 30 jours", correct: false, feedback: "Supprimer automatiquement tous les e-mails après 30 jours entraînerait une perte de données importantes (contrats, factures, correspondances légales). La politique de rétention doit être définie avec le responsable et la conformité, pas appliquée arbitrairement." }
          ],
          hint: "Centre d'administration Exchange (admin.exchange.microsoft.com) → Boîtes aux lettres → Christine Faure → Autres → Archive en ligne → Activer. Une fois activée, une stratégie de rétention déplace automatiquement les e-mails anciens vers l'archive. L'espace archive est séparé du quota principal.",
          callerReply: "L'admin a activé l'archive en ligne. Outlook affiche maintenant 'Archive en ligne' dans le volet de navigation. Les e-mails de plus de 2 ans vont s'y déplacer automatiquement. Ma boîte principale est à 38 Go — j'ai de la marge. Merci !"
        }
      ]
    },

    // --- M365: Signature automatique Outlook disparue ---
    {
      id: 'm365-outlook-signature-lost',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Martine Girard',
      dept: 'Service Client',
      mood: 'confused',
      issue: 'Signature automatique Outlook disparue après mise à jour Office',
      terminalContext: {
        hostname: 'PC-SERVCLNT-06', username: 'martine.girard',
        domain: 'CORP.LOCAL', ip: '192.168.1.66'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Martine du service client. Depuis ce matin, ma signature automatique n'apparaît plus quand je compose un e-mail. J'ai eu une mise à jour Office cette nuit. J'envoie beaucoup d'e-mails aux clients et ma signature doit absolument être présente." },
        { from: 'caller', text: "Hier soir tout marchait parfaitement. Ce matin, Outlook a redémarré après la mise à jour et là plus rien. Où est-ce que je peux retrouver mes signatures ?" }
      ],
      steps: [
        {
          question: "La signature automatique d'Outlook a disparu après une mise à jour. Quelle est la première vérification à effectuer ?",
          options: [
            { text: "Réinstaller Office — la mise à jour a corrompu les paramètres de signature", correct: false, feedback: "La réinstallation est une mesure radicale non justifiée ici. Les fichiers de signature Outlook sont stockés indépendamment dans le profil utilisateur — une mise à jour peut réinitialiser l'association signature/compte sans effacer les fichiers eux-mêmes." },
            { text: "Fichier → Options → Courrier → Signatures — vérifier si les signatures existent encore et sont bien associées au compte", correct: true, feedback: "Correct ! Les mises à jour Office réinitialisent parfois l'association signature/compte sans supprimer les fichiers de signature. Dans Fichier → Options → Courrier → Signatures, vous vérifiez si les signatures sont présentes et si elles sont correctement assignées aux nouveaux messages et aux réponses/transferts." },
            { text: "Vérifier dans le Registre Windows si les clés de signature Outlook sont intactes", correct: false, feedback: "Le Registre n'est pas l'endroit pour diagnostiquer une signature Outlook manquante. Les paramètres de signature sont accessibles directement dans les Options Outlook, sans passer par regedit." },
            { text: "Créer un nouveau profil Outlook — l'ancien profil est corrompu par la mise à jour", correct: false, feedback: "Créer un nouveau profil effacerait tous les paramètres personnalisés d'Outlook sans résoudre le problème. Vérifiez d'abord si les signatures existent dans les Options Outlook." }
          ],
          hint: "Outlook → Fichier → Options → Courrier → bouton 'Signatures…'. Vous verrez la liste des signatures créées. Si elles existent, vérifiez les listes déroulantes 'Nouveaux messages' et 'Réponses/transferts' pour le compte concerné.",
          callerReply: "Je suis dans Fichier → Options → Courrier → Signatures. Je vois que ma signature 'Martine_ServiceClient' existe encore dans la liste, mais les listes déroulantes 'Nouveaux messages' et 'Réponses/transferts' sont sur '(aucune)'. La mise à jour a réinitialisé l'association !"
        },
        {
          question: "La signature existe mais n'est plus associée au compte. Comment finaliser la résolution ?",
          options: [
            { text: "Dans 'Choisissez une signature par défaut', sélectionner le compte, puis choisir 'Martine_ServiceClient' dans 'Nouveaux messages' et 'Réponses/transferts', puis cliquer OK", correct: true, feedback: "Parfait ! La mise à jour a simplement dissocié la signature du compte sans la supprimer. En réassignant la signature dans les deux listes déroulantes (nouveaux messages ET réponses/transferts), Outlook l'insèrera automatiquement dans tous les e-mails. Si la signature avait été supprimée, il faudrait la recréer depuis le modèle de signature disponible sur l'intranet." },
            { text: "Supprimer l'ancienne signature et en créer une nouvelle manuellement depuis zéro", correct: false, feedback: "Inutile de supprimer une signature correcte et existante. Si la signature est déjà dans la liste, il suffit de la réassocier aux listes déroulantes — plus rapide et la mise en forme d'origine est préservée." },
            { text: "Copier la signature depuis l'e-mail d'un collègue et la coller comme nouvelle signature", correct: false, feedback: "Copier depuis un e-mail peut introduire des problèmes de mise en forme (HTML mal structuré, images encodées en base64 lourdes). Utilisez toujours la signature existante ou le modèle officiel de l'intranet." },
            { text: "Demander à l'administrateur de déployer la signature via GPO pour éviter que le problème se reproduise", correct: false, feedback: "Le déploiement de signature par GPO est une bonne pratique à long terme, mais pas la solution immédiate. Réassociez d'abord la signature existante, puis suggérez à l'équipe IT la standardisation via GPO." }
          ],
          hint: "Dans la fenêtre Signatures : section 'Choisissez une signature par défaut' → sélectionner le compte → dans 'Nouveaux messages' choisir 'Martine_ServiceClient' → idem pour 'Réponses/transferts' → OK. Tester en créant un nouveau message.",
          callerReply: "J'ai sélectionné ma signature dans les deux listes déroulantes et cliqué OK. Je viens de créer un nouveau message test — ma signature apparaît automatiquement ! Tout est rentré dans l'ordre. Merci, c'était simple finalement."
        }
      ]
    },

    // --- M365: Teams — qualité vidéo dégradée ---
    {
      id: 'm365-teams-video-quality',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Bernard Leroy',
      dept: 'Direction',
      mood: 'annoyed',
      issue: 'Teams — qualité vidéo très dégradée pendant les réunions (flou, saccades)',
      terminalContext: {
        hostname: 'PC-DIR-04', username: 'bernard.leroy',
        domain: 'CORP.LOCAL', ip: '192.168.1.25'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Bernard Leroy, Direction. Depuis quelques jours ma vidéo Teams est complètement floue et saccadée pendant mes réunions. Mes interlocuteurs me demandent de couper la caméra tellement c'est mauvais. J'ai des réunions importantes et ça ne peut pas continuer." },
        { from: 'caller', text: "J'ai essayé de redémarrer Teams mais ça ne change rien. Sur mon dernier appel avec le directeur général, la vidéo était vraiment inutilisable. Qu'est-ce qui se passe ?" }
      ],
      steps: [
        {
          question: "Vidéo Teams dégradée (flou, saccades). Quelle est la première cause à investiguer ?",
          options: [
            { text: "Bande passante réseau insuffisante — vérifier si d'autres applications consomment la connexion en arrière-plan", correct: true, feedback: "Correct ! La qualité vidéo Teams est directement liée à la bande passante disponible — Teams nécessite environ 1,5 Mbps en montant pour la HD. Des synchronisations OneDrive, des téléchargements, ou une connexion surchargée dégradent immédiatement la vidéo. C'est la cause la plus fréquente et la plus simple à vérifier avec le Gestionnaire des tâches." },
            { text: "Webcam défectueuse — le capteur s'est dégradé avec le temps", correct: false, feedback: "Une dégradation matérielle soudaine de la webcam est peu probable. La cause la plus fréquente d'une dégradation de qualité vidéo Teams est la bande passante réseau — vérifiez d'abord la consommation réseau avant de diagnostiquer le hardware." },
            { text: "Serveur Microsoft Teams en incident — vérifier le tableau de bord de statut Microsoft 365", correct: false, feedback: "Un incident Teams global affecterait tous les utilisateurs simultanément. Comme le problème est isolé à Bernard, la cause est locale. Vérifiez d'abord le réseau et les paramètres locaux." },
            { text: "Mise à jour Teams manquante — une ancienne version limite la qualité vidéo", correct: false, feedback: "Les mises à jour Teams sont automatiques et ne limitent pas intentionnellement la qualité vidéo. La dégradation est due à une ressource insuffisante (réseau ou CPU), pas à une version obsolète." }
          ],
          hint: "Gestionnaire des tâches (Ctrl+Shift+Esc) → onglet Performances → Ethernet ou Wi-Fi — vérifier l'utilisation réseau en temps réel. Aussi dans Teams : cliquer sur '...' en réunion → 'Paramètres de l'appel' → voir la qualité de la connexion affichée.",
          callerReply: "J'ai ouvert le Gestionnaire des tâches pendant une réunion : le réseau est à 98% d'utilisation ! OneDrive est en train de synchroniser 4 Go de fichiers en arrière-plan. C'est ça qui consomme toute la bande passante !"
        },
        {
          question: "OneDrive en synchronisation massive monopolise la bande passante. Quelle est la solution appropriée ?",
          options: [
            { text: "Suspendre la synchronisation OneDrive pendant les réunions, et configurer une limite de bande passante OneDrive dans ses paramètres", correct: true, feedback: "Parfait ! Double action : 1) Suspension immédiate — clic droit icône OneDrive (barre des tâches) → Suspendre la synchronisation → 2 heures. 2) Limitation permanente — OneDrive → Paramètres → Réseau → limiter la vitesse de chargement (ex: 500 Ko/s). OneDrive ne monopolisera plus jamais la connexion, Teams aura toujours la bande passante nécessaire." },
            { text: "Désactiver OneDrive définitivement pour libérer la bande passante", correct: false, feedback: "Désactiver OneDrive priverait Bernard de la synchronisation de ses fichiers de travail. La solution est de limiter la bande passante d'OneDrive, pas de le désactiver." },
            { text: "Passer Teams en mode audio uniquement pour économiser la bande passante", correct: false, feedback: "Couper la vidéo est un contournement ponctuel, pas une solution. Le problème fondamental est qu'OneDrive consomme trop de bande passante — il faut limiter OneDrive, pas priver Bernard de vidéo dans ses réunions de direction." },
            { text: "Demander une augmentation de la bande passante internet à l'opérateur", correct: false, feedback: "Avant de changer de contrat, optimisez l'utilisation existante — OneDrive peut être limité gratuitement et immédiatement. L'augmentation de bande passante est une solution coûteuse qui ne résout pas le problème de configuration." }
          ],
          hint: "Clic droit icône OneDrive (barre des tâches) → Suspendre la synchronisation → 2 heures (action immédiate). Pour la configuration durable : clic droit → Paramètres → Réseau → Taux de chargement → saisir une limite (ex: 500 Ko/s).",
          callerReply: "J'ai suspendu la synchronisation OneDrive — la vidéo Teams est redevenue parfaitement fluide. J'ai aussi configuré la limitation à 512 Ko/s. Mes prochaines réunions ne seront plus perturbées. Merci !"
        }
      ]
    },

    // --- M365: Calendrier Outlook non partagé avec le manager ---
    {
      id: 'm365-calendar-not-shared',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Laura Petit',
      dept: 'Finance',
      mood: 'neutral',
      issue: 'Calendrier Outlook non partagé avec le manager — procédure de partage inconnue',
      terminalContext: {
        hostname: 'PC-FINANCE-08', username: 'laura.petit',
        domain: 'CORP.LOCAL', ip: '192.168.1.74'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Laura du service finance. Mon manager m'a demandé de partager mon calendrier Outlook avec lui pour voir mes disponibilités et planifier des réunions plus facilement. Je ne sais pas comment faire ça." },
        { from: 'caller', text: "Est-ce que je peux le faire depuis Outlook directement ou il faut que l'administrateur intervienne ? Je voudrais que mon manager puisse voir mes réunions mais pas modifier mon agenda." }
      ],
      steps: [
        {
          question: "Laura souhaite partager son calendrier Outlook avec son manager. Comment procéder depuis Outlook ?",
          options: [
            { text: "Outlook → Calendrier → Clic droit sur 'Calendrier' dans le volet de navigation → Partager le calendrier → saisir l'adresse e-mail du manager", correct: true, feedback: "Correct ! Outlook Exchange permet le partage de calendrier directement depuis l'interface, sans intervention de l'administrateur. Le clic droit sur le calendrier ouvre les options de partage : on saisit l'adresse du destinataire et on choisit le niveau d'accès. Le manager reçoit une invitation par e-mail pour accepter le partage." },
            { text: "Exporter le calendrier en fichier .ics et l'envoyer par e-mail au manager", correct: false, feedback: "Exporter en .ics crée une copie statique à un instant T — le manager ne verra pas les mises à jour en temps réel. Le partage dynamique via Exchange est la solution pour un accès en continu." },
            { text: "Créer un calendrier partagé d'équipe dans Teams et y copier les réunions", correct: false, feedback: "Un calendrier Teams est une solution différente et plus complexe. Pour partager son calendrier Outlook personnel avec son manager, le partage direct Exchange est plus simple et plus adapté." },
            { text: "Demander à l'administrateur de configurer une délégation complète de calendrier", correct: false, feedback: "La délégation (qui permet de créer/modifier des rendez-vous au nom de quelqu'un) nécessite l'admin et donne trop de droits. Pour un simple partage de lecture, Laura peut le faire seule depuis Outlook." }
          ],
          hint: "Dans Outlook, cliquez sur 'Calendrier' dans la barre de navigation en bas. Dans le volet gauche, faites un clic droit sur 'Calendrier' sous 'Mon calendrier'. Sélectionnez 'Partager le calendrier'. Entrez l'adresse e-mail du manager et configurez les autorisations.",
          callerReply: "J'ai trouvé l'option ! Je vois la fenêtre de partage avec un champ pour l'adresse e-mail du manager. J'ai entré son adresse. Maintenant je dois choisir les autorisations — quelles options je lui donne ?"
        },
        {
          question: "Le manager doit voir les rendez-vous de Laura mais pas les modifier. Quel niveau d'autorisation accorder ?",
          options: [
            { text: "'Réviseur (peut afficher tous les détails)' — lecture complète du calendrier incluant les titres et descriptions des rendez-vous", correct: true, feedback: "Parfait ! L'autorisation 'Réviseur' donne un accès en lecture complète : le manager voit tous les détails des rendez-vous (titre, lieu, description, participants) sans pouvoir les modifier. C'est exactement ce dont il a besoin pour planifier des réunions et connaître les disponibilités de Laura en détail." },
            { text: "'Auteur (peut créer et modifier des éléments)' — le manager pourra aussi ajouter des réunions dans l'agenda de Laura", correct: false, feedback: "L'autorisation Auteur donne des droits de modification — le manager pourrait créer, modifier ou supprimer des rendez-vous dans l'agenda de Laura. C'est trop de droits pour un simple partage de visibilité." },
            { text: "'Peut afficher quand je suis occupé(e)' — affiche uniquement les créneaux libres/occupés sans les détails", correct: false, feedback: "Ce niveau est trop restrictif — le manager ne verrait que libre ou occupé, sans les titres des réunions. Il ne pourrait pas planifier efficacement sans connaître le contexte des rendez-vous." },
            { text: "'Délégué (peut modifier et accepter en mon nom)' — accès complet incluant la messagerie", correct: false, feedback: "La délégation donne au manager un accès complet incluant potentiellement la boîte mail de Laura — beaucoup trop de droits. Réservez la délégation aux cas d'assistanat de direction. Pour un partage de calendrier simple, 'Réviseur' est approprié." }
          ],
          hint: "Dans les autorisations de partage, choisissez 'Réviseur' dans la liste déroulante — lecture complète (titres, lieux, descriptions) sans modification. Cliquez Envoyer pour transmettre l'invitation au manager.",
          callerReply: "J'ai sélectionné 'Réviseur' et cliqué Envoyer. Mon manager vient de recevoir l'invitation et m'a confirmé qu'il peut voir mon calendrier en détail. Il est content ! Merci pour la procédure."
        }
      ]
    },

    // --- M365: OneDrive bloqué en synchronisation — icône rouge ---
    {
      id: 'm365-onedrive-sync-error',
      category: 'M365',
      level: 1,
      difficulty: 'easy',
      caller: 'Camille Dupont',
      dept: 'Marketing',
      mood: 'confused',
      issue: 'OneDrive bloqué en synchronisation — icône rouge, fichiers non synchronisés',
      terminalContext: {
        hostname: 'PC-MARKET-07', username: 'camille.dupont',
        domain: 'CORP.LOCAL', ip: '192.168.1.77'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Camille du marketing. Depuis ce matin, l'icône OneDrive dans la barre des tâches est rouge avec un point d'exclamation. Mes fichiers ne se synchronisent plus. J'ai modifié plusieurs présentations hier soir que je dois partager avec mon équipe." },
        { from: 'caller', text: "J'ai essayé de fermer et rouvrir OneDrive mais l'icône reste rouge. Mes collègues voient les anciennes versions de mes fichiers mais pas les modifications d'hier soir." }
      ],
      steps: [
        {
          question: "Icône OneDrive rouge avec point d'exclamation. Quelle est la première action pour diagnostiquer le problème ?",
          options: [
            { text: "Cliquer sur l'icône rouge OneDrive pour lire le message d'erreur précis affiché dans le panneau de synchronisation", correct: true, feedback: "Correct ! L'icône rouge est un indicateur général — le message dans le panneau de synchronisation donne la cause précise. Les erreurs les plus fréquentes : fichier ouvert par une application (verrou), nom de fichier avec caractère interdit, quota OneDrive plein, ou problème d'authentification. Chaque erreur a sa procédure de résolution spécifique." },
            { text: "Désinstaller et réinstaller OneDrive — l'application est corrompue", correct: false, feedback: "La réinstallation est disproportionnée sans diagnostic préalable. L'icône rouge indique un problème précis que vous pouvez identifier en lisant le message d'erreur — cela prend 30 secondes." },
            { text: "Copier manuellement les fichiers modifiés sur le serveur \\\\SRV-FILES\\Marketing", correct: false, feedback: "Copier manuellement est un contournement, pas une solution. Il faut d'abord identifier la cause de l'erreur pour la résoudre — les fichiers doivent continuer à se synchroniser automatiquement." },
            { text: "Redémarrer le PC — une session OneDrive corrompue bloque la synchronisation", correct: false, feedback: "Un redémarrage peut débloquer une session figée, mais sans lire le message d'erreur vous ne savez pas si c'est un problème de session ou un problème structurel (nom de fichier, quota). Commencez toujours par identifier l'erreur précise." }
          ],
          hint: "Cliquez sur l'icône OneDrive rouge dans la barre des tâches. Le panneau s'ouvre et affiche les fichiers en erreur avec un message explicatif. L'erreur indique exactement ce qui bloque la synchronisation.",
          callerReply: "J'ai cliqué sur l'icône rouge. Je vois : 'Un fichier ne peut pas être synchronisé' avec le nom 'Présentation_Campagne_Q2 - Version FINALE (2).pptx'. Il dit qu'il ne peut pas accéder au fichier."
        },
        {
          question: "OneDrive ne peut pas accéder au fichier 'Présentation_Campagne_Q2 - Version FINALE (2).pptx'. Quelle est la cause probable et la solution ?",
          options: [
            { text: "Fermer PowerPoint si le fichier est ouvert — le verrou de fichier empêche OneDrive de le synchroniser", correct: true, feedback: "Parfait ! Quand un fichier .pptx (ou tout fichier Office) est ouvert dans l'application, un verrou d'écriture est actif — OneDrive ne peut pas lire le fichier pour le synchroniser. Fermer PowerPoint libère immédiatement le verrou. OneDrive reprend la synchronisation automatiquement en quelques secondes. Si le fichier reste bloqué après fermeture, un redémarrage du client OneDrive suffit." },
            { text: "Renommer le fichier en supprimant les parenthèses — les caractères ( ) sont interdits dans les noms de fichiers OneDrive", correct: false, feedback: "Les parenthèses sont autorisées dans OneDrive. Le message 'ne peut pas accéder au fichier' pointe vers un verrou d'écriture (fichier ouvert), pas un caractère interdit. Les vrais caractères interdits sont : \\ / : * ? \" < > |" },
            { text: "Supprimer le fichier et le recréer depuis la dernière version synchronisée", correct: false, feedback: "Supprimer le fichier ferait perdre les modifications d'hier soir — exactement ce que Camille veut préserver. Identifiez la cause avant toute suppression." },
            { text: "Désactiver la synchronisation OneDrive et envoyer les fichiers par e-mail", correct: false, feedback: "Désactiver OneDrive priverait Camille de la synchronisation automatique et de la co-édition. Une simple fermeture de PowerPoint résout le problème — pas besoin de changer d'outil." }
          ],
          hint: "Vérifier la barre des tâches : PowerPoint est-il encore ouvert ? Si oui, le fermer (ou enregistrer puis fermer). OneDrive relancera la synchronisation automatiquement. Si l'icône reste rouge, clic droit sur l'icône → 'Suspendre la synchronisation' → '2 minutes' puis reprendre.",
          callerReply: "PowerPoint avait le fichier ouvert en arrière-plan — je ne l'avais pas remarqué ! Je l'ai fermé et OneDrive a immédiatement commencé à synchroniser. L'icône est passée au bleu puis au vert. Mes collègues voient maintenant la version finale. Merci !"
        }
      ]
    }
  ],

  /* ==========================================
     NIVEAU 1 — MEDIUM
     ========================================== */
  medium: [

    // --- RÉSEAU: Imprimante réseau hors ligne ---
    {
      id: 'network-printer-offline',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Sophie Lemaire',
      dept: 'Marketing',
      mood: 'frustrated',
      issue: 'Imprimante réseau hors ligne — file bloquée',
      terminalContext: {
        hostname: 'PC-MARKETING-02', username: 'sophie.lemaire',
        domain: 'CORP.LOCAL', ip: '192.168.1.50',
        printerOK: false, printerIP: '192.168.1.200',
        pingFails: ['192.168.1.200'],
        services: { spooler: 'STOPPED' }
      },
      messages: [
        { from: 'caller', text: "Bonjour, Sophie du marketing. L'imprimante du 2e étage est en panne depuis ce matin. Tous les documents sont bloqués dans la file d'attente." },
        { from: 'caller', text: "Plusieurs collègues ont le même problème. C'est l'imprimante partagée HP sur le réseau. Présentation client dans 2 heures !" }
      ],
      steps: [
        {
          question: "Plusieurs utilisateurs touchés, même imprimante réseau. Que vérifiez-vous en premier ?",
          options: [
            { text: "Réinstaller le driver sur tous les PC affectés", correct: false, feedback: "Si tous les PC sont touchés, le problème est probablement côté imprimante ou réseau, pas les drivers." },
            { text: "Pinguer l'adresse IP de l'imprimante pour vérifier la connectivité", correct: true, feedback: "Correct ! Ping de l'IP imprimante = test réseau basique. Si timeout → problème réseau/imprimante physique." },
            { text: "Redémarrer tous les PC du service", correct: false, feedback: "Inutile — le problème est côté imprimante ou réseau." },
            { text: "Commander une nouvelle imprimante", correct: false, feedback: "Bien trop prématuré sans diagnostic." }
          ],
          hint: "ping 192.168.1.200 pour tester la joignabilité de l'imprimante. Timeout = imprimante éteinte, câble débranché ou adresse IP changée.",
          terminalCommand: "ping 192.168.1.200",
          callerReply: "On peut aller voir physiquement l'imprimante si vous avez besoin."
        },
        {
          question: "Le ping timeout. Vous allez vérifier physiquement l'imprimante. Quoi inspecter ?",
          options: [
            { text: "La cartouche d'encre", correct: false, feedback: "Un manque d'encre ne causerait pas un timeout réseau." },
            { text: "L'état de marche, les voyants, le câble réseau et redémarrer l'imprimante", correct: true, feedback: "Parfait ! L'imprimante est peut-être éteinte, en erreur papier, ou le câble RJ45 a été débranché." },
            { text: "Changer l'adresse IP de l'imprimante", correct: false, feedback: "Ne changez pas l'IP sans savoir pourquoi elle ne répond pas." },
            { text: "Mettre l'imprimante en USB direct sur un PC", correct: false, feedback: "Contournement acceptable mais ne règle pas le problème réseau." }
          ],
          hint: "Vérifiez dans l'ordre : alimentation, voyants d'état, câble réseau RJ45, puis redémarrez l'imprimante.",
          callerReply: "Le câble réseau était débranché ! Après l'avoir reconnecté et redémarré l'imprimante, le ping répond."
        },
        {
          question: "L'imprimante répond au ping. Mais des documents sont toujours bloqués. Que faire ?",
          options: [
            { text: "Redémarrer tous les PC du service", correct: false, feedback: "Inutile — il faut purger la file d'impression." },
            { text: "Purger la file d'impression sur le serveur et redémarrer le service Spooler", correct: true, feedback: "Correct ! Les jobs bloqués restent dans la queue. sc stop spooler → supprimer les fichiers dans C:\\Windows\\System32\\spool\\PRINTERS\\ → sc start spooler." },
            { text: "Supprimer et réinstaller l'imprimante sur chaque PC", correct: false, feedback: "Trop lourd si plusieurs PC sont concernés. Purger la file sur le serveur suffit." },
            { text: "Dire aux utilisateurs d'envoyer leurs documents par e-mail", correct: false, feedback: "C'est un contournement, pas une résolution." }
          ],
          hint: "sc stop spooler → supprimer *.spl et *.shd dans C:\\Windows\\System32\\spool\\PRINTERS\\ → sc start spooler",
          terminalCommand: "sc query spooler",
          callerReply: "L'imprimante fonctionne de nouveau ! Les documents s'impriment. Merci, vous nous avez sauvés pour la présentation !"
        }
      ]
    },

    // --- VPN: Connexion échouée ---
    {
      id: 'network-vpn-failed',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Marie Dupont',
      dept: 'Comptabilité',
      mood: 'frustrated',
      issue: 'VPN — connexion échouée depuis ce matin',
      terminalContext: {
        hostname: 'PC-COMPTA-02', username: 'marie.dupont',
        domain: 'CORP.LOCAL', ip: '192.168.1.45',
        vpnOK: false, internetOK: true,
        pingFails: ['10.10.0.1', 'vpn.corp.local']
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Marie de la comptabilité. Mon VPN ne se connecte plus depuis ce matin. Message : 'Connexion échouée — délai d'attente dépassé'." },
        { from: 'caller', text: "J'ai redémarré mon PC mais toujours pareil. J'ai besoin du VPN pour accéder aux dossiers partagés pour les clôtures." }
      ],
      steps: [
        {
          question: "Première vérification avant tout diagnostic VPN ?",
          options: [
            { text: "Réinstaller le client VPN", correct: false, feedback: "Réinstaller sans diagnostic = perte de temps. Commencez par les bases." },
            { text: "Vérifier que Internet fonctionne (ping 8.8.8.8)", correct: true, feedback: "Correct ! Sans internet, le VPN ne peut pas se connecter. C'est le prérequis fondamental." },
            { text: "Appeler l'hébergeur du VPN", correct: false, feedback: "Avant d'appeler un tiers, vérifiez le côté client." },
            { text: "Désactiver le pare-feu Windows", correct: false, feedback: "Ne désactivez pas le pare-feu sans raison valide — c'est une faille de sécurité." }
          ],
          hint: "ping 8.8.8.8 pour tester la connectivité Internet. Si ça marche, le problème est VPN-spécifique.",
          terminalCommand: "ping 8.8.8.8",
          callerReply: "Le ping marche, j'ai bien Internet."
        },
        {
          question: "Internet OK, VPN échoue. Comment isoler si c'est un problème individuel ou global ?",
          options: [
            { text: "Tester avec le compte d'un autre utilisateur ou sur un autre PC", correct: true, feedback: "Exact ! Si un autre user se connecte → problème de profil/certificat de Marie. Si personne ne se connecte → problème serveur VPN." },
            { text: "Réinitialiser le mot de passe VPN", correct: false, feedback: "Avant de changer quoi que ce soit, isolez d'abord la cause." },
            { text: "Contacter l'ISP", correct: false, feedback: "Internet fonctionne, donc l'ISP n'est pas en cause." },
            { text: "Désactiver l'antivirus", correct: false, feedback: "L'antivirus peut bloquer le VPN mais c'est à vérifier en dernier recours." }
          ],
          hint: "Demandez à un collègue si son VPN fonctionne. Ça permet de savoir si c'est un problème de serveur ou de client.",
          callerReply: "Mon collègue a vérifié, lui ça marche. Donc c'est bien mon compte ou mon PC."
        },
        {
          question: "Le problème est isolé au PC/profil de Marie. Que vérifiez-vous ?",
          options: [
            { text: "Supprimer et recréer le profil VPN, vérifier si le certificat d'authentification est valide", correct: true, feedback: "Correct ! Un certificat client expiré ou un profil VPN corrompu sont les causes les plus fréquentes d'un VPN individuel qui ne marche plus." },
            { text: "Reformater le PC", correct: false, feedback: "Beaucoup trop radical pour un problème VPN." },
            { text: "Changer l'adresse IP du PC", correct: false, feedback: "L'adresse IP ne devrait pas affecter la connexion VPN si internet fonctionne." },
            { text: "Contacter le N3", correct: false, feedback: "Un problème de profil/certificat VPN est résolvable en N1/N2." }
          ],
          hint: "Vérifiez la date d'expiration du certificat client VPN dans le gestionnaire de certificats (certmgr.msc).",
          callerReply: "Mon certificat VPN avait expiré ! Après le renouvellement, le VPN se connecte. Merci beaucoup !"
        }
      ]
    },

    // --- M365: Teams plante ---
    {
      id: 'm365-teams-crash',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Antoine Roux',
      dept: 'Commercial',
      mood: 'frustrated',
      issue: 'Microsoft Teams plante au démarrage',
      terminalContext: {
        hostname: 'PC-COMMERCIAL-03', username: 'antoine.roux',
        domain: 'CORP.LOCAL', ip: '192.168.1.73',
        internetOK: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Antoine du commercial. Teams ne veut plus s'ouvrir depuis hier. Ça se lance, l'icône apparaît dans la barre des tâches, puis ça se ferme tout seul." },
        { from: 'caller', text: "J'ai déjà désinstallé et réinstallé mais même résultat. J'ai une réunion client dans 1 heure que je ne peux pas rater !" }
      ],
      steps: [
        {
          question: "Teams se ferme immédiatement après le lancement. Première action ?",
          options: [
            { text: "Réinstaller Office 365 entier", correct: false, feedback: "Réinstaller tout Office est excessif. Le problème est isolé à Teams." },
            { text: "Supprimer le cache Teams (%appdata%\\Microsoft\\Teams)", correct: true, feedback: "Correct ! Le cache Teams est souvent corrompu après une mise à jour. Le supprimer force Teams à se reconstruire proprement." },
            { text: "Créer un nouveau profil Windows", correct: false, feedback: "Un nouveau profil Windows est une mesure extrême. Le cache Teams est plus simple à régler." },
            { text: "Utiliser Teams Web directement", correct: false, feedback: "Bon contournement pour la réunion urgente, mais il faut aussi résoudre le problème client." }
          ],
          hint: "Chemin du cache Teams : %appdata%\\Microsoft\\Teams — supprimez tout le contenu du dossier (pas le dossier lui-même).",
          callerReply: "D'accord, je vais faire ça."
        },
        {
          question: "Après suppression du cache, Teams fonctionne. Que faire avant de fermer le ticket ?",
          options: [
            { text: "Vérifier que Teams est à jour (Check for updates) et documenter la solution", correct: true, feedback: "Parfait ! Vérifier les mises à jour évite la récurrence. Et documenter aide les collègues qui pourraient avoir le même problème." },
            { text: "Rien, ça marche donc c'est terminé", correct: false, feedback: "Sans vérification des mises à jour et documentation, le problème peut revenir." },
            { text: "Réinstaller Windows", correct: false, feedback: "Teams fonctionne maintenant. Réinstaller Windows serait disproportionné." },
            { text: "Envoyer un e-mail à Microsoft", correct: false, feedback: "Inutile pour ce type de problème courant." }
          ],
          hint: "Dans Teams : icône profil → Check for updates. Documenter dans le ticket : cause (cache corrompu) et solution.",
          callerReply: "Teams est à jour et tout fonctionne ! Je vais pouvoir faire ma réunion. Merci !"
        }
      ]
    },

    // --- WINDOWS: Accès dossier partagé refusé ---
    {
      id: 'windows-shared-folder-denied',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Pierre Morel',
      dept: 'Logistique',
      mood: 'calm',
      issue: 'Accès refusé au dossier partagé réseau',
      terminalContext: {
        hostname: 'PC-LOGISTIQUE-04', username: 'pierre.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.134',
        serverShareOK: false, internetOK: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Pierre de la logistique. Depuis ce matin, impossible d'accéder à notre dossier partagé. Message : 'Accès refusé — \\\\SRV-FILES\\Logistique'." },
        { from: 'caller', text: "Plusieurs collègues ont le même problème. Hier ça marchait bien. Aucun changement IT de notre côté." }
      ],
      steps: [
        {
          question: "Accès refusé sur partage réseau, tous les utilisateurs du service touchés. Première vérification ?",
          options: [
            { text: "Vérifier que le serveur de fichiers est joignable (ping SRV-FILES)", correct: true, feedback: "Correct ! Si le serveur n'est pas joignable, c'est un problème réseau ou serveur. Si il répond, c'est un problème de permissions." },
            { text: "Reformater tous les PC de la logistique", correct: false, feedback: "Disproportionné et ne résoudrait pas un problème de permissions." },
            { text: "Recréer les comptes utilisateurs", correct: false, feedback: "Pas nécessaire avant d'avoir vérifié les permissions." },
            { text: "Contacter le N3 immédiatement", correct: false, feedback: "Vérifiez d'abord les bases : connectivité et permissions." }
          ],
          hint: "ping SRV-FILES ou ping 192.168.1.10 pour vérifier si le serveur répond. net use pour voir les lecteurs réseau mappés.",
          terminalCommand: "net use",
          callerReply: "Le dossier \\\\SRV-FILES\\Commun est accessible, mais \\\\Logistique donne accès refusé."
        },
        {
          question: "SRV-FILES répond, les partages généraux marchent, seul \\Logistique est refusé. Cause probable ?",
          options: [
            { text: "Les permissions NTFS ou de partage du dossier Logistique ont été modifiées", correct: true, feedback: "Correct ! Si un seul partage est affecté et que les autres marchent, c'est clairement un problème de permissions sur ce dossier spécifique." },
            { text: "Problème de réseau général", correct: false, feedback: "Si d'autres partages marchent, le réseau n'est pas en cause." },
            { text: "Le dossier a été supprimé", correct: false, feedback: "Un dossier supprimé donnerait 'Chemin réseau introuvable', pas 'Accès refusé'." },
            { text: "Problème d'antivirus", correct: false, feedback: "L'antivirus ne bloquerait pas un dossier réseau de cette façon." }
          ],
          hint: "Vérifiez les permissions de partage (Share) ET les permissions NTFS sur \\\\SRV-FILES\\Logistique. Un groupe de sécurité a peut-être été modifié.",
          callerReply: "OK, vous allez regarder du côté des permissions sur le serveur ?"
        },
        {
          question: "Sur le serveur, vous voyez que le groupe 'GRP-Logistique' a été retiré des permissions du dossier. Action ?",
          options: [
            { text: "Réajouter le groupe 'GRP-Logistique' avec les permissions correctes (Lire/Écrire) et tester l'accès", correct: true, feedback: "Parfait ! Réajouter le groupe de sécurité restaure l'accès pour tous les membres sans toucher aux comptes individuels." },
            { text: "Donner les permissions à chaque utilisateur individuellement", correct: false, feedback: "Mauvaise pratique : toujours utiliser des groupes pour gérer les permissions, jamais les utilisateurs individuels." },
            { text: "Donner la permission 'Tout le monde : Contrôle total'", correct: false, feedback: "Donner 'Contrôle total' à tout le monde est une faille de sécurité grave." },
            { text: "Recréer le dossier", correct: false, feedback: "Inutile — le dossier existe, c'est juste un problème de permissions." }
          ],
          hint: "Dans les propriétés du dossier → Sécurité → Modifier → Ajouter le groupe → cocher Modifier (Write + Read).",
          callerReply: "L'accès est rétabli ! Tous les collègues peuvent accéder au dossier. Merci !"
        }
      ]
    },

    // --- WINDOWS: Windows Update bloqué ---
    {
      id: 'windows-update-failed',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Thomas Laurent',
      dept: 'Marketing',
      mood: 'frustrated',
      issue: 'Windows Update bloqué — erreur 0x80070005 depuis une semaine',
      terminalContext: {
        hostname: 'PC-MARKETING-06', username: 'thomas.laurent',
        domain: 'CORP.LOCAL', ip: '192.168.1.68',
        internetOK: true, windowsUpdateFails: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Thomas du marketing. Windows Update m'affiche une erreur depuis une semaine : code 0x80070005. Des mises à jour importantes sont en attente mais impossible de les installer." },
        { from: 'caller', text: "Ça télécharge correctement, puis à l'installation ça bloque sur cette erreur. Je suis inquiet pour la sécurité de mon PC." }
      ],
      steps: [
        {
          question: "Erreur 0x80070005 sur Windows Update. Que signifie ce code d'erreur ?",
          options: [
            { text: "Le disque dur est plein", correct: false, feedback: "0x80070005 n'est pas une erreur d'espace disque. C'est une erreur d'accès refusé." },
            { text: "Accès refusé — un service ou des permissions bloquent l'écriture dans le dossier de mise à jour", correct: true, feedback: "Correct ! 0x80070005 = ERROR_ACCESS_DENIED. Souvent causé par un service Windows Update corrompu ou des permissions incorrectes sur le dossier SoftwareDistribution." },
            { text: "La connexion Internet est trop lente", correct: false, feedback: "La vitesse Internet n'est pas liée à une erreur 0x80070005." },
            { text: "Le PC n'est pas compatible avec cette mise à jour", correct: false, feedback: "0x80070005 n'est pas une erreur de compatibilité matérielle ou logicielle." }
          ],
          hint: "Commandes utiles : net stop wuauserv → renommer C:\\Windows\\SoftwareDistribution en SoftwareDistribution.old → net start wuauserv",
          terminalCommand: "sc query wuauserv",
          callerReply: "Donc c'est un problème de service ou de permissions sur le PC ?"
        },
        {
          question: "Après avoir arrêté les services et renommé SoftwareDistribution, l'erreur persiste. Que faire ensuite ?",
          options: [
            { text: "Désactiver Windows Update définitivement", correct: false, feedback: "Désactiver les mises à jour expose le PC aux failles de sécurité. Ce n'est jamais une solution acceptable." },
            { text: "Lancer l'utilitaire Windows Update Troubleshooter et consulter les logs dans C:\\Windows\\WindowsUpdate.log", correct: true, feedback: "Correct ! Le Troubleshooter répare automatiquement les configurations corrompues. Les logs détaillent l'erreur exacte pour affiner le diagnostic." },
            { text: "Réinstaller Windows", correct: false, feedback: "Trop radical pour une erreur de mise à jour. L'utilitaire de résolution doit suffire." },
            { text: "Appeler Microsoft Support directement", correct: false, feedback: "Le Troubleshooter intégré et les logs sont les outils appropriés avant toute escalade externe." }
          ],
          hint: "Paramètres → Mise à jour et sécurité → Résolution des problèmes → Windows Update. Ou en CMD : msdt.exe /id WindowsUpdateDiagnostic",
          callerReply: "Le Troubleshooter a trouvé et corrigé des 'Erreurs dans le registre de Windows Update'. La mise à jour se relance !"
        },
        {
          question: "Le Troubleshooter a corrigé le registre. La mise à jour se lance. Que vérifier avant de clore le ticket ?",
          options: [
            { text: "Fermer le ticket immédiatement dès que la mise à jour se lance", correct: false, feedback: "Attendre la fin complète de l'installation. Une mise à jour qui se lance n'est pas une mise à jour réussie." },
            { text: "Confirmer que toutes les mises à jour s'installent et vérifier l'Observateur d'événements pour des erreurs résiduelles", correct: true, feedback: "Correct ! Attendez la fin de l'installation (redémarrage inclus), puis vérifiez Observateur d'événements → Applications → Windows Update pour confirmer l'absence d'erreurs." },
            { text: "Désactiver l'antivirus pendant les mises à jour", correct: false, feedback: "Inutile et dangereux. Windows Update fonctionne correctement avec un antivirus actif." },
            { text: "Redémarrer le PC sans attendre la fin de l'installation", correct: false, feedback: "Redémarrer en cours d'installation peut corrompre les fichiers système." }
          ],
          hint: "Attendez le redémarrage final. Ensuite Observateur d'événements → Applications → filtrer sur 'WindowsUpdateClient' pour confirmer le succès.",
          callerReply: "Toutes les mises à jour sont installées et le PC a redémarré normalement. Merci, je suis rassuré !"
        }
      ]
    },

    // --- WINDOWS: Bureau à distance refusé ---
    {
      id: 'windows-rdp-refused',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Isabelle Renaud',
      dept: 'Direction',
      mood: 'calm',
      issue: 'Bureau à distance (RDP) refusé — impossible de se connecter depuis le domicile',
      terminalContext: {
        hostname: 'PC-DIRECTION-03', username: 'isabelle.renaud',
        domain: 'CORP.LOCAL', ip: '192.168.1.88',
        rdpEnabled: false,
        services: { TermService: 'STOPPED' }
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Isabelle de la direction. Je travaille en télétravail et depuis ce matin je ne peux plus me connecter à mon PC du bureau via Bureau à distance. Message : 'La connexion n'a pas pu se connecter à l'ordinateur distant'." },
        { from: 'caller', text: "Hier tout fonctionnait. Mon collègue Jean peut lui se connecter au sien depuis chez lui. Mon VPN est actif et connecté." }
      ],
      steps: [
        {
          question: "VPN OK, RDP échoue uniquement sur ce poste. Première vérification ?",
          options: [
            { text: "Désinstaller et réinstaller le client Bureau à distance", correct: false, feedback: "Le client RDP est intégré à Windows. Et si ça marchait hier, le problème est côté poste distant, pas côté client." },
            { text: "Pinguer le PC distant et vérifier l'état du service Bureau à distance (TermService)", correct: true, feedback: "Correct ! Le ping confirme la joignabilité du poste. sc query TermService vérifie si le service Remote Desktop Services est actif." },
            { text: "Recréer le compte AD de l'utilisatrice", correct: false, feedback: "Le compte AD fonctionne (VPN connecté). Le problème est sur le service RDP du poste, pas le compte." },
            { text: "Lui conseiller de venir travailler au bureau", correct: false, feedback: "Contournement non souhaitable — le problème technique doit être résolu pour le télétravail." }
          ],
          hint: "ping PC-DIRECTION-03 pour confirmer la joignabilité. Ensuite sc query TermService ou services.msc pour vérifier l'état du service.",
          terminalCommand: "sc query TermService",
          callerReply: "Pouvez-vous accéder à mon PC à distance pour vérifier ?"
        },
        {
          question: "sc query TermService retourne STATUS: STOPPED. Que faire ?",
          options: [
            { text: "Ouvrir tous les ports du pare-feu Windows", correct: false, feedback: "Ouvrir tous les ports est une faille de sécurité grave. On cible uniquement le service et le port 3389." },
            { text: "Démarrer le service TermService et vérifier la règle de pare-feu pour le port 3389", correct: true, feedback: "Correct ! sc start TermService redémarre le Bureau à distance. Une mise à jour récente peut avoir désactivé la règle de pare-feu pour le port 3389 — vérifiez-la." },
            { text: "Supprimer le profil Windows de l'utilisatrice", correct: false, feedback: "Le profil utilisateur n'a aucun lien avec un service système arrêté." },
            { text: "Changer le port RDP pour un port non standard", correct: false, feedback: "Changer le port est une mesure de durcissement optionnelle, pas une solution à un service arrêté." }
          ],
          hint: "sc start TermService. Puis : netsh advfirewall firewall show rule name='Bureau à distance' pour vérifier la règle sur le port 3389.",
          terminalCommand: "sc start TermService",
          callerReply: "Le service est relancé ! La connexion Bureau à distance fonctionne maintenant, je suis bien connectée à mon PC."
        },
        {
          question: "RDP fonctionne à nouveau. Comment éviter que le service s'arrête de nouveau ?",
          options: [
            { text: "Ne rien faire de plus, ça marche maintenant", correct: false, feedback: "Sans passer le service en démarrage automatique et comprendre la cause, l'incident se reproduira après le prochain redémarrage." },
            { text: "Configurer TermService en démarrage automatique et consulter l'Observateur d'événements pour comprendre la cause de l'arrêt", correct: true, feedback: "Exact ! sc config TermService start= auto évite que le service reste arrêté après redémarrage. L'Observateur d'événements (ID 7036) révèle pourquoi le service s'est arrêté (souvent une mise à jour Windows)." },
            { text: "Désactiver Windows Update pour éviter que ça recommence", correct: false, feedback: "Les mises à jour de sécurité sont essentielles. Configurez le service en automatique plutôt que de bloquer les mises à jour." },
            { text: "Forcer l'utilisatrice à toujours travailler au bureau", correct: false, feedback: "Le télétravail est une politique d'entreprise. La solution est technique, pas organisationnelle." }
          ],
          hint: "sc config TermService start= auto. Observateur d'événements → Journal Windows → Système → filtrer sur l'ID 7036 pour voir l'historique d'arrêt du service.",
          callerReply: "Service configuré en automatique, logs consultés. Une mise à jour Windows avait changé son état. Tout est stable, merci !"
        }
      ]
    },

    // --- HARDWARE: Écran qui scintille — signal instable ---
    {
      id: 'hardware-screen-flickering',
      category: 'Hardware',
      level: 1,
      difficulty: 'medium',
      caller: 'Marc Dupuis',
      dept: 'R&D',
      mood: 'frustrated',
      issue: 'Écran externe qui scintille — signal vidéo instable',
      terminalContext: {
        hostname: 'PC-RD-08', username: 'marc.dupuis',
        domain: 'CORP.LOCAL', ip: '192.168.1.133'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Marc du service R&D. Mon écran externe scintille depuis ce matin — il clignote toutes les 10-15 secondes environ. C'est vraiment difficile de travailler dans ces conditions." },
        { from: 'caller', text: "C'est un écran Dell branché en DisplayPort sur mon laptop. L'écran du laptop, lui, ne scintille pas du tout. Je n'ai rien changé récemment à ma connaissance." }
      ],
      steps: [
        {
          question: "L'écran externe scintille mais l'écran intégré du laptop est stable. Quelle est votre première vérification physique ?",
          options: [
            { text: "Remplacer immédiatement l'écran externe — il est défectueux", correct: false, feedback: "Trop hâtif. Un scintillement peut avoir de nombreuses causes logicielles ou de connexion avant d'être un défaut matériel de l'écran." },
            { text: "Vérifier et re-brancher fermement le câble DisplayPort aux deux extrémités (laptop et écran)", correct: true, feedback: "Correct ! Un câble mal serti ou légèrement desserré est la cause la plus fréquente de scintillement. L'écran intégré stable confirme que c'est bien la connexion externe le problème, pas la carte graphique." },
            { text: "Redémarrer le PC immédiatement", correct: false, feedback: "Avant de redémarrer, vérifiez la connexion physique — c'est rapide et souvent suffisant." },
            { text: "Mettre à jour Windows en priorité", correct: false, feedback: "Les mises à jour Windows ne résolvent généralement pas un problème de signal vidéo instable. Commencez par le physique." }
          ],
          hint: "Débranchez et rebranchez le câble DisplayPort des deux côtés. Essayez aussi un autre port DisplayPort du laptop si disponible.",
          callerReply: "J'ai rebranché le câble des deux côtés bien fermement. Le scintillement continue malheureusement."
        },
        {
          question: "Le câble est bien connecté et le scintillement persiste. Quelle est la prochaine vérification ?",
          options: [
            { text: "Vérifier la fréquence de rafraîchissement de l'écran dans les paramètres d'affichage Windows", correct: true, feedback: "Exact ! Une fréquence de rafraîchissement incompatible (ex : écran 60Hz réglé en 75Hz) provoque un scintillement caractéristique. Paramètres → Système → Affichage → Paramètres d'affichage avancés → Fréquence de rafraîchissement." },
            { text: "Désactiver l'écran externe et travailler uniquement sur l'écran intégré", correct: false, feedback: "Ce n'est pas une solution — on résout le problème, on ne le contourne pas." },
            { text: "Formater le PC pour éliminer toute cause logicielle", correct: false, feedback: "Totalement disproportionné pour un scintillement d'écran. Plusieurs vérifications simples restent à faire." },
            { text: "Escalader immédiatement au N2", correct: false, feedback: "Pas encore nécessaire. Un technicien N1 peut diagnostiquer et résoudre ce type de problème." }
          ],
          hint: "Paramètres → Système → Affichage → Paramètres d'affichage avancés → sélectionner l'écran externe → Fréquence de rafraîchissement. Choisir la valeur native de l'écran (souvent 60Hz).",
          callerReply: "La fréquence était réglée à 75Hz alors que mon écran est un modèle 60Hz. Je l'ai remis à 60Hz. Le scintillement a disparu immédiatement !"
        },
        {
          question: "Problème résolu. Que notez-vous dans le ticket pour prévenir une récidive ?",
          options: [
            { text: "Rien — problème réglé, on ferme le ticket", correct: false, feedback: "Un ticket sans documentation ne permet pas d'identifier les problèmes récurrents ni d'aider un autre technicien face au même cas." },
            { text: "Cause : fréquence de rafraîchissement 75Hz incompatible avec l'écran Dell 60Hz. Résolution : remise à 60Hz dans les paramètres d'affichage avancés. Conseil : vérifier ce paramètre après chaque mise à jour du pilote graphique.", correct: true, feedback: "Parfait ! Un ticket bien documenté inclut la cause, la résolution et un conseil préventif. Les mises à jour de pilotes graphiques peuvent réinitialiser ce paramètre — utile à noter." },
            { text: "Câble DisplayPort défectueux remplacé", correct: false, feedback: "Ce n'est pas ce qui a résolu le problème. Le câble était fonctionnel — c'était la fréquence de rafraîchissement." },
            { text: "Problème matériel écran — surveiller en cas de récidive", correct: false, feedback: "Ce n'était pas un problème matériel mais un paramètre logiciel. Une documentation inexacte induit en erreur les prochains techniciens." }
          ],
          hint: "Un bon ticket contient : symptôme, cause identifiée, solution appliquée, conseil de prévention.",
          callerReply: "Ticket bien documenté. Merci pour la rapidité !"
        }
      ]
    },

    // --- HARDWARE: Batterie laptop — autonomie insuffisante ---
    {
      id: 'hardware-battery-drain',
      category: 'Hardware',
      level: 1,
      difficulty: 'medium',
      caller: 'Sylvie Rousseau',
      dept: 'Direction Générale',
      mood: 'frustrated',
      issue: 'Batterie laptop — autonomie de 20 minutes seulement',
      terminalContext: {
        hostname: 'PC-DG-02', username: 'sylvie.rousseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.145'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Sylvie Rousseau de la direction générale. Mon laptop ne tient plus que 20 minutes sur batterie. J'ai des déplacements toute la semaine et je ne peux pas rester branchée en permanence." },
        { from: 'caller', text: "Le PC a environ 3 ans. La batterie durait bien plus d'une heure avant. Là c'est devenu vraiment problématique pour mes réunions en dehors du bureau." }
      ],
      steps: [
        {
          question: "Autonomie de 20 minutes sur un laptop de 3 ans. Quelle est votre première vérification rapide ?",
          options: [
            { text: "Commander immédiatement une batterie de remplacement", correct: false, feedback: "Avant de commander du matériel, vérifiez d'abord le plan d'alimentation — une mauvaise configuration peut diviser l'autonomie par trois sans que la batterie soit défectueuse." },
            { text: "Vérifier le plan d'alimentation Windows : s'il est en 'Performances élevées', le passer en 'Équilibré' ou 'Économiseur de batterie'", correct: true, feedback: "Correct ! Le plan 'Performances élevées' maintient le CPU et l'écran à pleine puissance en permanence. C'est une vérification rapide qui peut immédiatement améliorer l'autonomie." },
            { text: "Réinstaller Windows pour repartir d'une base saine", correct: false, feedback: "Totalement disproportionné. Le système d'exploitation n'est pas la cause d'une batterie qui dure 20 minutes." },
            { text: "Désactiver le Wi-Fi et le Bluetooth pour économiser de l'énergie", correct: false, feedback: "Ces composants consomment peu. Ce n'est pas une première étape de diagnostic — on commence par le plan d'alimentation." }
          ],
          hint: "Clic droit sur l'icône batterie → Options d'alimentation. Ou : Paramètres → Système → Alimentation et mise en veille → Paramètres d'alimentation supplémentaires.",
          callerReply: "Mon plan était bien en 'Équilibré'. J'ai essayé 'Économiseur de batterie' mais ça ne change pas grand-chose, je tiens toujours environ 20-25 minutes."
        },
        {
          question: "Le plan d'alimentation n'est pas en cause. Comment diagnostiquer précisément l'état de la batterie ?",
          options: [
            { text: "Ouvrir le Gestionnaire des tâches et regarder la consommation CPU", correct: false, feedback: "Le Gestionnaire des tâches montre la charge CPU, pas l'état de la batterie. Ce n'est pas le bon outil pour ce diagnostic." },
            { text: "Exécuter 'powercfg /batteryreport' en invite de commandes administrateur pour obtenir le rapport de batterie Windows", correct: true, feedback: "Excellent ! La commande powercfg /batteryreport génère un rapport HTML complet avec la 'Design Capacity' (capacité d'origine) vs la 'Full Charge Capacity' (capacité actuelle). C'est le diagnostic officiel Windows pour l'état d'une batterie." },
            { text: "Vérifier dans le BIOS la température de la batterie", correct: false, feedback: "Le BIOS ne fournit pas d'informations détaillées sur la santé de la batterie. Utilisez les outils Windows prévus à cet effet." },
            { text: "Télécharger un logiciel tiers de diagnostic batterie", correct: false, feedback: "Windows dispose déjà de l'outil natif powercfg — inutile d'installer un logiciel externe." }
          ],
          hint: "Ouvrir cmd en administrateur → taper : powercfg /batteryreport /output C:\\battery-report.html → ouvrir le fichier généré dans un navigateur.",
          terminalCommand: "powercfg /batteryreport /output C:\\battery-report.html",
          callerReply: "Le rapport est généré. Je lis : Design Capacity 45 210 mWh — Full Charge Capacity 9 340 mWh. C'est grave ?"
        },
        {
          question: "Design Capacity : 45 210 mWh — Full Charge Capacity : 9 340 mWh (soit 79% de dégradation). Quelle est la suite ?",
          options: [
            { text: "Calibrer la batterie en la déchargeant complètement puis en la rechargeant à 100%", correct: false, feedback: "La calibration peut corriger une jauge imprécise, mais une batterie à 21% de sa capacité d'origine est physiquement usée. La calibration n'a aucun effet sur la capacité réelle des cellules." },
            { text: "Informer l'utilisatrice, ouvrir un bon de commande pour le remplacement de la batterie et lui fournir un chargeur de secours en attendant", correct: true, feedback: "Parfait ! À 21% de capacité résiduelle, la batterie est en fin de vie — le remplacement est inévitable. Fournir un chargeur de secours maintient la productivité pendant le délai de commande. C'est la bonne gestion d'un actif matériel dégradé." },
            { text: "Lui dire de toujours travailler branchée — la batterie n'est plus utile", correct: false, feedback: "Pour une cadre de direction en déplacement, 'toujours branchée' n'est pas une solution acceptable. Le remplacement est nécessaire." },
            { text: "Mettre à jour le pilote de la batterie dans le Gestionnaire de périphériques", correct: false, feedback: "Le pilote de batterie gère la communication avec Windows, pas la capacité physique des cellules. Une mise à jour de pilote ne restaure pas une capacité perdue." }
          ],
          hint: "Seuil critique : Full Charge Capacity < 40% de la Design Capacity = remplacement recommandé. Ici 9 340 / 45 210 = 20,6% → batterie en fin de vie.",
          callerReply: "Merci pour le diagnostic clair. J'attends le chargeur de secours et la commande de batterie est lancée. Ticket bien documenté."
        }
      ]
    },

    // --- HARDWARE: Scanner réseau non détecté ---
    {
      id: 'hardware-network-scanner',
      category: 'Hardware',
      level: 1,
      difficulty: 'medium',
      caller: 'Romain Blanc',
      dept: 'Achats',
      mood: 'calm',
      issue: 'Scanner réseau non détecté par les postes du service',
      terminalContext: {
        hostname: 'PC-ACHATS-03', username: 'romain.blanc',
        domain: 'CORP.LOCAL', ip: '192.168.1.108'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Romain du service achats. Depuis ce matin, notre scanner réseau n'est plus détecté par aucun poste du service. On en a besoin pour numériser les bons de commande." },
        { from: 'caller', text: "Hier soir tout fonctionnait. Ce matin plus rien. Le scanner est allumé, on voit les voyants verts, mais le logiciel de numérisation dit 'Aucun scanner trouvé'." }
      ],
      steps: [
        {
          question: "Le scanner est allumé mais non détecté par le logiciel. Quelle est votre première vérification réseau ?",
          options: [
            { text: "Désinstaller et réinstaller le logiciel de numérisation sur tous les postes", correct: false, feedback: "Si aucun poste ne détecte le scanner depuis ce matin, le problème n'est pas le logiciel — celui-ci fonctionnait hier. Vérifiez d'abord la connectivité réseau du scanner." },
            { text: "Pinger l'adresse IP habituelle du scanner pour vérifier s'il répond sur le réseau", correct: true, feedback: "Correct ! Si le scanner ne répond pas au ping sur son IP habituelle, il n'est pas joignable sur le réseau — soit son IP a changé, soit il a un problème de connexion réseau. C'est le premier diagnostic réseau à faire." },
            { text: "Redémarrer tous les postes du service achats", correct: false, feedback: "Si le scanner lui-même n'est pas joignable, redémarrer les postes ne changera rien." },
            { text: "Appeler le fournisseur du scanner pour un support matériel", correct: false, feedback: "Trop hâtif. Diagnostiquez d'abord la cause — c'est probablement un problème de configuration réseau, pas une panne matérielle." }
          ],
          hint: "L'adresse IP du scanner est habituellement notée dans le ticket d'installation ou visible sur l'écran du scanner (Menu → Réseau → Informations TCP/IP).",
          terminalCommand: "ping 192.168.1.75",
          callerReply: "Le ping sur 192.168.1.75 ne répond pas — 'Délai d'attente de la demande dépassé' sur les 4 tentatives."
        },
        {
          question: "Le scanner ne répond plus sur son IP habituelle (192.168.1.75). Quelle est la cause la plus probable et comment la corriger ?",
          options: [
            { text: "Le scanner est en panne — remplacer le matériel", correct: false, feedback: "Les voyants sont verts et le scanner était fonctionnel hier. Avant de conclure à une panne, vérifiez si son IP a changé — une réattribution DHCP est bien plus probable." },
            { text: "Le serveur DHCP a réattribué une nouvelle IP au scanner — vérifier l'IP actuelle sur l'écran du scanner et mettre à jour la configuration du logiciel", correct: true, feedback: "Exact ! Sans IP fixe, chaque redémarrage peut donner une nouvelle IP au scanner via DHCP. Vérifiez l'IP actuelle sur l'écran du scanner (Menu → Réseau), mettez à jour le logiciel, puis configurez une IP statique ou une réservation DHCP pour éviter la récidive." },
            { text: "Le câble réseau du scanner est débranché — vérifier physiquement", correct: false, feedback: "Si le câble était débranché, le scanner ne serait pas allumé avec des voyants verts réseau. L'IP manquante pointe vers un changement d'adresse." },
            { text: "Réinstaller le pilote du scanner sur chaque poste avec la nouvelle IP", correct: false, feedback: "La plupart des logiciels de scan réseau permettent de changer l'IP du scanner dans les paramètres sans réinstallation complète du pilote." }
          ],
          hint: "Sur le scanner : Menu → Configuration réseau → Adresse IP. Notez la nouvelle IP, puis dans le logiciel : Paramètres → Scanner → Modifier l'adresse IP. Recommandez ensuite une réservation DHCP par adresse MAC dans le routeur.",
          terminalCommand: "ping 192.168.1.82",
          callerReply: "L'écran du scanner affichait 192.168.1.82 ! J'ai mis à jour l'adresse dans le logiciel sur mon poste et ça fonctionne. Je transmets la nouvelle IP aux collègues. Merci !"
        }
      ]
    },

    // --- HARDWARE: Docking station ne charge plus le laptop ---
    {
      id: 'hardware-docking-no-charge',
      category: 'Hardware',
      level: 1,
      difficulty: 'medium',
      caller: 'Valérie Lemoine',
      dept: 'Finance',
      mood: 'frustrated',
      issue: 'Docking station — le laptop ne se charge plus via la station d\'accueil',
      terminalContext: {
        hostname: 'PC-FINANCE-04', username: 'valerie.lemoine',
        domain: 'CORP.LOCAL', ip: '192.168.1.126'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Valérie de la finance. Depuis ce matin, mon laptop ne se charge plus quand il est posé sur la station d'accueil. La batterie se vide progressivement même au bureau." },
        { from: 'caller', text: "La station d'accueil fonctionne pour le reste — mes deux écrans externes et le clavier fonctionnent normalement. C'est uniquement la charge qui ne passe plus." }
      ],
      steps: [
        {
          question: "La docking station fonctionne pour les périphériques mais ne charge plus le laptop. Quelle est votre première vérification ?",
          options: [
            { text: "Remplacer la station d'accueil — elle est partiellement défectueuse", correct: false, feedback: "Les périphériques fonctionnent, donc la docking station communique correctement avec le laptop. Le problème est ciblé sur l'alimentation — vérifiez l'adaptateur secteur avant de conclure à une panne du dock." },
            { text: "Vérifier l'adaptateur secteur de la docking station : contrôler le branchement mural, le connecteur côté dock et si le voyant LED du dock est allumé", correct: true, feedback: "Correct ! Si l'alimentation électrique de la docking station est interrompue (câble desserré, multiprise éteinte, adaptateur défaillant), les données passent via USB mais la charge ne passe plus. Le voyant LED du dock indique si l'alimentation est présente." },
            { text: "Redémarrer le laptop — Windows a peut-être bloqué la charge", correct: false, feedback: "Windows ne bloque pas la charge physique. Si le courant ne passe pas, un redémarrage ne changera rien." },
            { text: "Désinstaller et réinstaller le pilote de la docking station", correct: false, feedback: "Les pilotes gèrent la communication USB — pas la charge électrique. Si le voyant du dock est éteint, c'est un problème d'alimentation, pas de pilote." }
          ],
          hint: "Vérifiez : 1) le câble de l'adaptateur secteur côté prise murale, 2) le connecteur côté dock, 3) si le voyant d'alimentation du dock est allumé (souvent blanc ou bleu).",
          callerReply: "Le voyant est bien allumé, l'adaptateur est correctement branché des deux côtés. Tout semble OK de ce côté."
        },
        {
          question: "L'alimentation du dock est correcte. Le laptop charge-t-il normalement si on le branche directement avec son chargeur d'origine ?",
          options: [
            { text: "Inutile de tester — si le dock est alimenté, le problème vient forcément du laptop", correct: false, feedback: "Tester la charge directe isole le problème : si le laptop charge directement, le problème est dans le dock ou la connexion dock-laptop. Si non, le port de charge du laptop est suspect." },
            { text: "Tester la charge directe avec le chargeur d'origine, puis reconnecter le laptop au dock en changeant de port USB-C si disponible", correct: true, feedback: "Parfait ! La charge directe fonctionne → le laptop charge bien, donc le problème est dans la connexion dock-laptop. Beaucoup de docking stations ont plusieurs ports USB-C/Thunderbolt — changer de port résout souvent le problème si un port est défaillant. Si aucun port du dock ne charge, le contrôleur de charge du dock est à remplacer." },
            { text: "Mettre à jour le firmware du dock via le site du fabricant immédiatement", correct: false, feedback: "Une mise à jour firmware est pertinente, mais elle intervient après avoir testé les causes physiques simples. Commencez par isoler le problème avec la charge directe." },
            { text: "Escalader au N2 — les docking stations sont trop complexes pour le N1", correct: false, feedback: "Un diagnostic de docking station (alimentation, ports, charge directe) est entièrement dans le périmètre N1. L'escalade N2 n'est justifiée qu'après avoir épuisé les vérifications de base." }
          ],
          hint: "Charge directe OK + dock alimenté = problème sur le port USB-C/Thunderbolt du dock. Essayez un autre port du dock. Si toujours KO, vérifiez le firmware du dock sur le site du fabricant (Dell, HP, Lenovo selon le modèle).",
          callerReply: "La charge directe fonctionne. J'ai essayé l'autre port USB-C du dock — ça charge ! Le premier port était défectueux. Je vais noter le port à ne plus utiliser. Merci !"
        }
      ]
    },

    // --- WINDOWS: PC lent au démarrage ---
    {
      id: 'windows-slow-startup',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Jean-Paul Vidal',
      dept: 'Comptabilité',
      mood: 'frustrated',
      issue: 'PC très lent au démarrage — 8 minutes pour arriver au bureau Windows',
      terminalContext: {
        hostname: 'PC-COMPTA-14', username: 'jean-paul.vidal',
        domain: 'CORP.LOCAL', ip: '192.168.1.94'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Jean-Paul de la comptabilité. Mon PC met maintenant 8 minutes pour démarrer complètement. Avant c'était rapide — depuis 2 semaines c'est devenu insupportable." },
        { from: 'caller', text: "Une fois démarré ça va à peu près, mais le matin c'est vraiment pénalisant. J'ai l'impression que plein de choses se lancent au démarrage depuis qu'on a installé des nouveaux logiciels." }
      ],
      steps: [
        {
          question: "PC qui démarre en 8 minutes. L'utilisateur suspecte des logiciels lancés au démarrage. Quelle est votre première action ?",
          options: [
            { text: "Réinstaller Windows pour repartir d'une base propre", correct: false, feedback: "Beaucoup trop radical en première approche. Des programmes de démarrage excessifs sont une cause connue et facile à corriger sans réinstallation." },
            { text: "Ouvrir le Gestionnaire des tâches → onglet Démarrage → identifier et désactiver les programmes à impact élevé non essentiels", correct: true, feedback: "Correct ! L'onglet Démarrage du Gestionnaire des tâches liste tous les programmes lancés à l'ouverture de session avec leur impact mesuré (Élevé / Moyen / Faible). Désactiver les programmes non essentiels à impact élevé réduit directement le temps de démarrage." },
            { text: "Augmenter la mémoire RAM du PC", correct: false, feedback: "L'ajout de RAM peut améliorer les performances générales, mais si le problème vient d'un excès de programmes au démarrage, la RAM supplémentaire n'accélérera pas significativement le boot." },
            { text: "Planifier un antivirus complet — le PC est peut-être infecté", correct: false, feedback: "Un scan antivirus est pertinent, mais ce n'est pas la première étape pour un démarrage lent. Commencez par vérifier les programmes de démarrage — c'est la cause la plus fréquente." }
          ],
          hint: "Ctrl+Maj+Échap → onglet Démarrage. Colonne 'Impact au démarrage' : désactivez tout ce qui est 'Élevé' et non essentiel (OneDrive, Teams, Spotify, outils fabricants, etc.). Les logiciels Microsoft Office peuvent souvent être désactivés au démarrage.",
          callerReply: "J'ai désactivé 7 programmes à impact élevé dont Teams, OneDrive et deux outils installés avec les nouveaux logiciels. Ça a déjà amélioré mais il met encore 4-5 minutes. C'est toujours trop long."
        },
        {
          question: "Le démarrage est passé de 8 à 4-5 minutes après désactivation des programmes. Quelle est la cause probable du délai résiduel ?",
          options: [
            { text: "Désactiver encore plus de services Windows pour accélérer", correct: false, feedback: "Désactiver des services Windows système est risqué et peut provoquer des dysfonctionnements. Le problème résiduel a une autre cause à identifier proprement." },
            { text: "Vérifier l'utilisation du disque dans le Gestionnaire des tâches au démarrage — un disque HDD à 100% d'utilisation indique un goulot d'étranglement à diagnostiquer", correct: true, feedback: "Exact ! Sur un disque dur HDD (non SSD), 100% d'utilisation au démarrage est un symptôme classique : Windows Update en arrière-plan, Windows Search qui indexe, ou un disque en fin de vie. L'onglet Performance → Disque du Gestionnaire des tâches le confirme instantanément." },
            { text: "Remplacer le PC — il est trop ancien pour Windows", correct: false, feedback: "Avant de remplacer le matériel, identifiez précisément la cause. Un PC HDD qui démarre lentement peut souvent être résolu par un passage à un SSD à moindre coût." },
            { text: "Activer le démarrage rapide dans les options d'alimentation Windows", correct: false, feedback: "Le démarrage rapide est souvent déjà activé par défaut. Et s'il est désactivé, l'activer n'améliorera que marginalement un démarrage de 4-5 minutes causé par un disque lent." }
          ],
          hint: "Gestionnaire des tâches → onglet Performance → Disque. Si l'utilisation est proche de 100% pendant plusieurs minutes au démarrage sur un HDD, envisagez : désactiver Windows Search temporairement (services.msc → Windows Search) ou recommander une migration vers SSD.",
          terminalCommand: "winsat disk",
          callerReply: "Le disque était à 100% pendant 3 minutes au démarrage — c'est un HDD de 2018. J'ai désactivé Windows Search et le démarrage est passé à 2 minutes. On va demander un SSD pour ce poste. Merci !"
        }
      ]
    },

    // --- WINDOWS: Tâche planifiée ne s'exécute pas ---
    {
      id: 'windows-scheduled-task-fail',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Olivier Martin',
      dept: 'IT / Helpdesk',
      mood: 'calm',
      issue: 'Tâche planifiée Windows ne s\'exécute pas — script de sauvegarde silencieux',
      terminalContext: {
        hostname: 'SRV-BACKUP-01', username: 'olivier.martin',
        domain: 'CORP.LOCAL', ip: '192.168.1.20'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Olivier de l'IT. Notre tâche planifiée de sauvegarde ne s'est pas exécutée depuis 3 jours. Le script PowerShell tourne normalement si on le lance manuellement, mais la tâche planifiée reste silencieuse." },
        { from: 'caller', text: "Le compte de service utilisé pour la tâche a eu son mot de passe changé il y a 4 jours dans le cadre de la rotation trimestrielle. Je soupçonne que c'est lié." }
      ],
      steps: [
        {
          question: "La tâche planifiée ne s'exécute plus depuis 4 jours — exactement après une rotation de mot de passe. Quelle est votre première vérification dans le Planificateur de tâches ?",
          options: [
            { text: "Supprimer et recréer la tâche planifiée depuis zéro", correct: false, feedback: "Recréer la tâche est une solution de dernier recours. Commencez par identifier la cause exacte via le résultat de la dernière exécution — c'est plus rapide et moins risqué." },
            { text: "Ouvrir le Planificateur de tâches → trouver la tâche → vérifier le 'Résultat de la dernière exécution' et consulter l'onglet Historique pour identifier le code d'erreur", correct: true, feedback: "Correct ! Le code de résultat est décisif : 0x0 = succès, 0x1 = erreur générique, 0x41301 = tâche en cours, 0x8007052E = échec d'authentification (mot de passe incorrect). Ce dernier code confirmerait directement le lien avec la rotation de mot de passe." },
            { text: "Vérifier que le script PowerShell n'a pas été modifié depuis 4 jours", correct: false, feedback: "Le script fonctionne en exécution manuelle — il n'est donc pas en cause. La coïncidence avec le changement de mot de passe est trop évidente pour ne pas l'investiguer en premier." },
            { text: "Désactiver puis réactiver la tâche pour forcer une réinitialisation", correct: false, feedback: "Désactiver/réactiver ne résout pas un problème d'authentification. Le code d'erreur doit d'abord être identifié." }
          ],
          hint: "Planificateur de tâches → clic droit sur la tâche → Propriétés → onglet Historique. Cherchez le code 0x8007052E (LOGON_FAILURE) qui confirme un problème d'authentification du compte de service.",
          terminalCommand: "schtasks /query /tn \"\\Backup\\SauvegardeQuotidienne\" /fo LIST /v",
          callerReply: "Le code de résultat est 0x8007052E. Donc c'est bien le mot de passe du compte de service qui n'est plus à jour dans la tâche."
        },
        {
          question: "Erreur 0x8007052E confirmée — le mot de passe du compte de service est obsolète dans la tâche. Comment corriger correctement ?",
          options: [
            { text: "Remettre l'ancien mot de passe sur le compte de service pour que la tâche refonctionne", correct: false, feedback: "Revenir à l'ancien mot de passe annule la rotation de sécurité trimestrielle — c'est une régression de sécurité inacceptable. Le bon sens est de mettre à jour la tâche avec le nouveau mot de passe." },
            { text: "Mettre à jour les informations d'identification dans la tâche : onglet Général → 'Changer l'utilisateur ou le groupe' → entrer le nouveau mot de passe du compte de service", correct: true, feedback: "Exact ! La tâche planifiée stocke les credentials au moment de sa création. Après une rotation de mot de passe, il faut les mettre à jour dans la tâche. Bonne pratique complémentaire : envisager un compte de service avec un mot de passe géré automatiquement (gMSA — Group Managed Service Account) pour éviter ce problème à l'avenir." },
            { text: "Configurer la tâche pour s'exécuter uniquement quand l'utilisateur est connecté — plus besoin de stocker les credentials", correct: false, feedback: "Une tâche de sauvegarde doit s'exécuter même sans session ouverte. Configurer 'Exécuter uniquement quand l'utilisateur est connecté' la rendrait dépendante d'une session active — inacceptable pour une sauvegarde automatique nocturne." },
            { text: "Créer un nouveau compte de service dédié avec un mot de passe qui n'expire jamais", correct: false, feedback: "Un compte avec mot de passe sans expiration est une mauvaise pratique de sécurité. La solution correcte est un gMSA (Group Managed Service Account) dont Windows gère le renouvellement automatiquement." }
          ],
          hint: "Planificateur de tâches → clic droit sur la tâche → Propriétés → Général → bouton 'Changer l'utilisateur ou le groupe'. Entrez le compte de service et son nouveau mot de passe. Testez avec 'Exécuter' pour confirmer. Pour éviter la récidive : envisager un gMSA.",
          terminalCommand: "schtasks /run /tn \"\\Backup\\SauvegardeQuotidienne\"",
          callerReply: "J'ai mis à jour le mot de passe dans la tâche et lancé une exécution manuelle — succès, code 0x0. La sauvegarde de ce soir sera bien exécutée. Je note aussi la recommandation gMSA pour le prochain cycle. Merci !"
        }
      ]
    },

    // --- WINDOWS: PC redémarre automatiquement chaque nuit ---
    {
      id: 'windows-auto-restart-night',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Franck Petit',
      dept: 'Production',
      mood: 'frustrated',
      issue: 'PC redémarre automatiquement chaque nuit — travaux en cours perdus',
      terminalContext: {
        hostname: 'PC-PROD-07', username: 'franck.petit',
        domain: 'CORP.LOCAL', ip: '192.168.1.135'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Franck de la production. Mon PC redémarre tout seul chaque nuit vers 3h du matin depuis deux semaines. Je laisse souvent des fichiers ouverts pour le lendemain matin et je les retrouve fermés." },
        { from: 'caller', text: "Ce matin j'ai perdu deux heures de travail non sauvegardé. C'est vraiment problématique. Est-ce que c'est Windows qui fait ça ?" }
      ],
      steps: [
        {
          question: "PC qui redémarre seul vers 3h chaque nuit. Quelle est votre première investigation ?",
          options: [
            { text: "Vérifier si l'alimentation électrique est instable — une coupure de courant nocturne provoque ce comportement", correct: false, feedback: "Une coupure électrique est irrégulière et ne se produit pas à heure fixe chaque nuit. Un redémarrage planifié à la même heure est le signe d'une tâche programmée ou de Windows Update." },
            { text: "Consulter l'Observateur d'événements → Journaux Windows → Système → filtrer sur l'ID 1074 pour identifier ce qui a initié le redémarrage", correct: true, feedback: "Correct ! L'ID d'événement 1074 enregistre chaque redémarrage initié par un processus avec le nom de l'application responsable. C'est le diagnostic le plus direct pour identifier l'origine — Windows Update, une tâche planifiée, ou un autre processus." },
            { text: "Désactiver toutes les tâches planifiées Windows pour arrêter les redémarrages", correct: false, feedback: "Désactiver toutes les tâches planifiées peut bloquer des opérations système essentielles (maintenance, mises à jour de sécurité). Identifiez d'abord la cause avant de désactiver quoi que ce soit." },
            { text: "Remplacer l'alimentation du PC — elle redémarre en cas de surtension", correct: false, feedback: "Un redémarrage à heure fixe et régulière n'est pas le symptôme d'une alimentation défaillante. Les pannes d'alimentation sont aléatoires, pas planifiées." }
          ],
          hint: "eventvwr.msc → Journaux Windows → Système → Filtrer le journal actuel → ID d'événement : 1074. Chaque redémarrage planifié y est enregistré avec la source (ex : Windows Update, schtasks, etc.).",
          terminalCommand: "Get-WinEvent -FilterHashtable @{LogName='System'; Id=1074} | Select-Object TimeCreated, Message | Select-Object -First 5",
          callerReply: "L'événement 1074 indique : 'Le processus C:\\Windows\\system32\\wuauclt.exe a initié le redémarrage de PC-PROD-07 pour le compte de l'utilisateur NT AUTHORITY\\SYSTEM pour la raison : Système d'exploitation : Mise à jour'. C'est bien Windows Update."
        },
        {
          question: "Windows Update déclenche le redémarrage à 3h. Comment configurer correctement pour éviter les redémarrages non souhaités ?",
          options: [
            { text: "Désactiver complètement Windows Update — les redémarrages cesseront", correct: false, feedback: "Désactiver Windows Update expose le système aux failles de sécurité. Ce n'est pas une solution acceptable en entreprise, surtout sur un poste de production." },
            { text: "Configurer les Heures d'activité (Windows Update → Options avancées → Heures d'activité) et via GPO définir une fenêtre de maintenance hors production — ex: weekend 2h-4h", correct: true, feedback: "Parfait ! Les Heures d'activité indiquent à Windows quand l'utilisateur est actif — les redémarrages sont alors différés hors de cette plage. La GPO (Computer Configuration → Administrative Templates → Windows Update → Configure Automatic Updates) permet de centraliser cette configuration sur tous les postes de production avec une fenêtre de maintenance adaptée." },
            { text: "Paramétrer le PC pour ne jamais redémarrer automatiquement — l'utilisateur le fera manuellement", correct: false, feedback: "En pratique, les utilisateurs ne redémarrent pas régulièrement leur PC — les mises à jour s'accumulent et les correctifs de sécurité ne sont jamais appliqués. Une fenêtre de maintenance définie est préférable." },
            { text: "Installer les mises à jour manuellement chaque semaine pour contrôler les redémarrages", correct: false, feedback: "Gérer manuellement les mises à jour sur chaque poste n'est pas scalable. La bonne pratique en entreprise est une GPO centralisée avec fenêtre de maintenance définie." }
          ],
          hint: "Paramètres → Windows Update → Options avancées → Heures d'activité : définir 6h-22h (couvre la journée de travail). Via GPO : Computer Configuration → Admin Templates → Windows Update → 'Configure Automatic Updates' → option 4 (Planifier l'installation) avec le jour et l'heure souhaités.",
          callerReply: "J'ai configuré les heures d'activité de 6h à 22h. L'IT va aussi déployer une GPO pour planifier les redémarrages le week-end à 2h. Cette nuit, plus de redémarrage intempestif. Merci !"
        }
      ]
    },

    // --- WINDOWS: Application impossible à installer — droits insuffisants ---
    {
      id: 'windows-install-rights',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Pierre Morel',
      dept: 'Logistique',
      mood: 'frustrated',
      issue: 'Application impossible à installer — erreur droits insuffisants',
      terminalContext: {
        hostname: 'PC-LOGISTIQUE-06', username: 'pierre.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.122'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Pierre de la logistique. J'essaie d'installer le logiciel TransportPro envoyé par notre prestataire mais j'ai un message 'Droits insuffisants pour installer cette application'. Ça bloque complètement." },
        { from: 'caller', text: "J'ai besoin de ce logiciel pour la livraison de demain matin. Mon responsable a validé l'installation. Qu'est-ce que je dois faire ?" }
      ],
      steps: [
        {
          question: "Pierre obtient 'droits insuffisants' en lançant l'installeur. Quelle est la cause et la solution immédiate ?",
          options: [
            { text: "Désactiver le Contrôle de compte d'utilisateur (UAC) sur le poste pour permettre l'installation", correct: false, feedback: "Désactiver l'UAC supprime une couche de sécurité essentielle sur tout le poste. Ce n'est pas une solution acceptable — on élève les droits uniquement pour cette installation spécifique." },
            { text: "Faire un clic droit sur l'installeur → 'Exécuter en tant qu'administrateur' et entrer les credentials IT admin pour élever les droits le temps de l'installation", correct: true, feedback: "Correct ! Les utilisateurs standards n'ont pas les droits d'installation système par défaut — c'est une mesure de sécurité normale. L'élévation via 'Exécuter en tant qu'administrateur' avec les credentials IT permet l'installation sans donner des droits permanents à l'utilisateur." },
            { text: "Ajouter Pierre au groupe 'Administrateurs locaux' pour qu'il puisse installer lui-même", correct: false, feedback: "Donner des droits administrateurs permanents à un utilisateur standard contourne toutes les politiques de sécurité du poste. C'est une pratique à éviter sauf exception justifiée et documentée." },
            { text: "Demander au prestataire de fournir une version sans installation (portable)", correct: false, feedback: "Possible mais pas la solution immédiate — Pierre a besoin du logiciel pour demain matin. L'élévation des droits via IT est la réponse rapide et correcte." }
          ],
          hint: "Clic droit sur le fichier .exe ou .msi → 'Exécuter en tant qu'administrateur'. Windows demande alors des credentials admin — entrez les identifiants IT. L'installation se déroule avec les droits élevés sans modifier les droits permanents du compte utilisateur.",
          callerReply: "Avec le clic droit 'Exécuter en tant qu'administrateur' et vos identifiants, l'installation s'est déroulée sans problème. TransportPro est installé et fonctionne. Merci !"
        },
        {
          question: "L'installation est faite. Pierre demande à pouvoir installer lui-même les prochains logiciels métier validés par son responsable. Que proposez-vous ?",
          options: [
            { text: "Lui accorder des droits administrateurs locaux permanents — son responsable a validé", correct: false, feedback: "La validation du responsable porte sur le logiciel, pas sur les droits permanents. Les droits admin permanents pour un utilisateur standard sont une violation des politiques de sécurité et exposent le poste à des risques (malware installé involontairement, modifications système accidentelles)." },
            { text: "Ouvrir une demande de changement pour intégrer TransportPro au catalogue logiciel IT (déploiement SCCM/MDM) et établir une procédure de demande d'installation pour les cas futurs", correct: true, feedback: "Parfait ! La bonne pratique est d'intégrer les logiciels métier récurrents au catalogue IT pour un déploiement contrôlé. Pour les cas ponctuels, une procédure de demande documentée (ticket avec validation responsable + IT) permet l'installation supervisée sans compromettre la sécurité du poste." },
            { text: "Créer un script d'installation que Pierre pourra exécuter lui-même avec les droits élevés intégrés", correct: false, feedback: "Un script avec credentials intégrés est une faille de sécurité majeure — les identifiants admin seraient accessibles à l'utilisateur. Ce type de solution ne doit jamais être utilisé." },
            { text: "Documenter le cas et ne rien changer — l'IT interviendra à chaque installation", correct: false, feedback: "Si Pierre installe régulièrement des logiciels métier, une intervention IT manuelle à chaque fois n'est pas scalable. Intégrer le logiciel au catalogue IT résout le problème structurellement." }
          ],
          hint: "Solution long terme : intégrer TransportPro dans SCCM/Intune pour un déploiement contrôlé depuis le Portail d'entreprise. Court terme : procédure de ticket d'installation avec double validation (responsable + IT) et intervention technique planifiée.",
          callerReply: "Très bien, je vais ouvrir une demande pour intégrer TransportPro au catalogue IT. Pour les cas futurs j'enverrai un ticket avec la validation de mon responsable. C'est logique. Merci !"
        }
      ]
    },

    // --- WINDOWS: Son ne fonctionne plus après mise à jour ---
    {
      id: 'windows-no-sound-update',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Julie Bernard',
      dept: 'Communication',
      mood: 'frustrated',
      issue: 'Son ne fonctionne plus après mise à jour Windows — aucun périphérique audio',
      terminalContext: {
        hostname: 'PC-COM-04', username: 'julie.bernard',
        domain: 'CORP.LOCAL', ip: '192.168.1.118'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Julie de la communication. Depuis la mise à jour Windows de cette nuit, je n'ai plus aucun son sur mon PC. L'icône du haut-parleur dans la barre des tâches affiche une croix rouge." },
        { from: 'caller', text: "J'ai vérifié que ce n'est pas en sourdine et le volume est au maximum. Je travaille sur des productions audio et vidéo — c'est bloquant pour moi toute la journée." }
      ],
      steps: [
        {
          question: "Croix rouge sur l'icône son après mise à jour Windows. La vérification du volume n'est pas en cause. Quelle est la première étape de diagnostic ?",
          options: [
            { text: "Redémarrer le PC une deuxième fois — la mise à jour n'a peut-être pas terminé de s'appliquer", correct: false, feedback: "Si la mise à jour a déjà déclenché un redémarrage et que le problème persiste, un deuxième redémarrage ne changera rien. La croix rouge indique qu'aucun périphérique audio n'est reconnu — c'est un problème de pilote à diagnostiquer." },
            { text: "Vérifier dans le Gestionnaire de périphériques si la carte audio présente une erreur (point d'exclamation jaune) et contrôler l'état du service Windows Audio dans services.msc", correct: true, feedback: "Correct ! La croix rouge sur l'icône son signifie que Windows ne détecte aucun périphérique audio. Deux causes immédiates : le pilote audio est en erreur dans le Gestionnaire de périphériques (point d'exclamation jaune) ou le service Windows Audio est arrêté. Ces deux vérifications prennent moins d'une minute." },
            { text: "Désinstaller immédiatement la mise à jour Windows responsable", correct: false, feedback: "Désinstaller une mise à jour sans diagnostic précis est risqué (correctifs de sécurité supprimés). Vérifiez d'abord si le pilote audio peut être restauré — c'est plus ciblé et moins risqué." },
            { text: "Brancher des haut-parleurs USB externes — ils ont leurs propres pilotes et fonctionneront", correct: false, feedback: "Contourner le problème n'est pas une solution acceptable pour une personne qui travaille sur des productions audio. Le problème doit être résolu sur l'équipement existant." }
          ],
          hint: "devmgmt.msc → Contrôleurs son, vidéo et jeux → vérifier les icônes. services.msc → Windows Audio → vérifier état 'En cours d'exécution'. Un point d'exclamation jaune = pilote en erreur. Service arrêté = le démarrer manuellement.",
          terminalCommand: "sc query audiosrv",
          callerReply: "Dans le Gestionnaire de périphériques, la carte Realtek Audio a un point d'exclamation jaune. Le service Windows Audio est bien en cours d'exécution. C'est le pilote Realtek qui est en erreur."
        },
        {
          question: "Le pilote Realtek Audio est en erreur après la mise à jour. Comment le restaurer correctement ?",
          options: [
            { text: "Gestionnaire de périphériques → pilote Realtek → Propriétés → Pilote → 'Restaurer le pilote précédent' si l'option est disponible, sinon désinstaller le pilote et télécharger la version stable depuis le site Realtek ou du fabricant du PC", correct: true, feedback: "Parfait ! 'Restaurer le pilote précédent' revient à la version qui fonctionnait avant la mise à jour — c'est la solution la plus rapide. Si indisponible (pas de sauvegarde), désinstaller le pilote défectueux puis redémarrer (Windows réinstalle automatiquement) ou télécharger le pilote certifié depuis Realtek.com ou le site du fabricant du PC (Dell, HP, Lenovo)." },
            { text: "Mettre à jour le pilote via Windows Update → Rechercher les mises à jour — Windows trouvera le bon pilote", correct: false, feedback: "C'est précisément la mise à jour Windows qui a installé le pilote défectueux. Redemander une mise à jour risque de réinstaller la même version problématique. Préférez le pilote directement depuis le fabricant." },
            { text: "Modifier les paramètres du registre Windows pour réactiver la carte audio", correct: false, feedback: "Modifier le registre pour un problème de pilote audio est risqué et inutile. La restauration ou réinstallation du pilote est la procédure correcte et sans risque." },
            { text: "Effectuer une restauration système complète au point d'avant la mise à jour", correct: false, feedback: "La restauration système est disproportionnée ici — seul le pilote audio est en cause. Restaurer le pilote uniquement est plus rapide, ciblé et sans impact sur le reste du système." }
          ],
          hint: "devmgmt.msc → Contrôleurs son → clic droit Realtek → Propriétés → onglet Pilote → 'Restaurer le pilote précédent'. Si grisé : 'Désinstaller le périphérique' → cocher 'Supprimer le logiciel pilote' → redémarrer. Windows réinstallera automatiquement ou téléchargez depuis realtek.com.",
          callerReply: "L'option 'Restaurer le pilote précédent' était disponible. Après restauration et redémarrage, le son est revenu ! L'icône haut-parleur est normal. Je peux reprendre mes productions. Merci !"
        }
      ]
    },

    // --- WINDOWS: Fichiers système corrompus — sfc /scannow ---
    {
      id: 'windows-system-files-corrupt',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Romain Blanc',
      dept: 'Achats',
      mood: 'frustrated',
      issue: 'Fichiers système Windows corrompus — applications qui plantent aléatoirement',
      terminalContext: {
        hostname: 'PC-ACHATS-05', username: 'romain.blanc',
        domain: 'CORP.LOCAL', ip: '192.168.1.109'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Romain des achats. Depuis quelques jours, plusieurs applications se ferment toutes seules sans raison. Excel plante, l'explorateur Windows redémarre, et j'ai des messages d'erreur avec des codes que je ne comprends pas." },
        { from: 'caller', text: "Ce n'est pas constant — ça arrive de façon aléatoire. Un collègue m'a dit que ça pouvait être des fichiers système corrompus. Comment vérifier ça ?" }
      ],
      steps: [
        {
          question: "Applications qui plantent aléatoirement — corruption système suspectée. Quel est l'outil Windows approprié pour diagnostiquer et réparer ?",
          options: [
            { text: "Lancer un antivirus complet — les plantages aléatoires indiquent souvent une infection", correct: false, feedback: "Un antivirus est pertinent mais ne répare pas les fichiers système corrompus. SFC (System File Checker) est l'outil dédié à ce diagnostic — commencez par lui." },
            { text: "Ouvrir une invite de commandes en administrateur et exécuter 'sfc /scannow' — l'outil analyse et répare les fichiers système Windows protégés", correct: true, feedback: "Correct ! SFC (System File Checker) scanne l'intégrité de tous les fichiers système Windows protégés et remplace les fichiers corrompus ou modifiés par des versions correctes depuis le cache système. C'est l'outil officiel Microsoft pour ce type de diagnostic." },
            { text: "Réinstaller toutes les applications qui plantent une par une", correct: false, feedback: "Si la corruption est au niveau des fichiers système Windows, réinstaller les applications n'aura aucun effet — elles continueront à planter car les DLL système qu'elles utilisent restent corrompues." },
            { text: "Défragmenter le disque dur — les fichiers fragmentés causent des plantages", correct: false, feedback: "La fragmentation ralentit les accès disque mais ne provoque pas de plantages applicatifs. La corruption de fichiers système est une cause distincte qui nécessite SFC." }
          ],
          hint: "Clic droit sur le menu Démarrer → Invite de commandes (admin) ou Windows PowerShell (admin) → taper : sfc /scannow. L'analyse dure 10-15 minutes. Ne pas fermer la fenêtre pendant l'analyse.",
          terminalCommand: "sfc /scannow",
          callerReply: "SFC s'est terminé avec le message : 'La protection des ressources Windows a trouvé des fichiers corrompus mais n'a pas pu réparer certains d'entre eux.' Qu'est-ce que ça veut dire ?"
        },
        {
          question: "SFC a trouvé des corruptions mais ne peut pas toutes les réparer. Quelle est la prochaine étape ?",
          options: [
            { text: "Réinstaller Windows — si SFC ne peut pas réparer, c'est trop grave", correct: false, feedback: "Pas encore. Quand SFC ne peut pas réparer certains fichiers, c'est souvent parce que le cache système (WinSxS) lui-même est corrompu. DISM peut réparer ce cache depuis Windows Update avant de relancer SFC." },
            { text: "Exécuter 'DISM /Online /Cleanup-Image /RestoreHealth' pour réparer le cache système Windows, puis relancer 'sfc /scannow'", correct: true, feedback: "Exact ! DISM (Deployment Image Servicing and Management) répare le magasin de composants Windows (WinSxS) en téléchargeant les fichiers corrects depuis Windows Update. Une fois le cache réparé, SFC peut s'appuyer dessus pour remplacer les fichiers corrompus qu'il n'arrivait pas à réparer seul. La séquence DISM → SFC est la procédure standard Microsoft." },
            { text: "Ignorer les fichiers que SFC ne peut pas réparer — les plantages finiront par s'arrêter", correct: false, feedback: "Des fichiers système corrompus non réparés peuvent aggraver les symptômes au fil du temps. La procédure DISM doit être tentée avant d'envisager des mesures plus radicales." },
            { text: "Consulter le CBS.log et réparer manuellement les fichiers corrompus un par un", correct: false, feedback: "Réparer manuellement les fichiers système est une opération risquée réservée aux cas où DISM et SFC ont tous deux échoué. Tentez toujours DISM d'abord — c'est automatisé et sécurisé." }
          ],
          hint: "Invite de commandes (admin) : DISM /Online /Cleanup-Image /RestoreHealth (connexion internet requise, durée ~15-20 min). Puis relancer : sfc /scannow. Résultats détaillés dans C:\\Windows\\Logs\\CBS\\CBS.log",
          terminalCommand: "DISM /Online /Cleanup-Image /RestoreHealth",
          callerReply: "DISM a récupéré des fichiers depuis Windows Update. Après avoir relancé sfc /scannow, le message indique maintenant 'La protection des ressources Windows a réparé les fichiers corrompus'. Plus aucun plantage depuis ce matin !"
        }
      ]
    },

    // --- WINDOWS: Defender — mise à jour des définitions échoue ---
    {
      id: 'windows-defender-update-fail',
      category: 'Windows',
      level: 1,
      difficulty: 'medium',
      caller: 'Alice Moreau',
      dept: 'IT / Helpdesk',
      mood: 'calm',
      issue: 'Windows Defender — mise à jour des définitions antivirus échoue avec erreur',
      terminalContext: {
        hostname: 'PC-IT-03', username: 'alice.moreau',
        domain: 'CORP.LOCAL', ip: '192.168.1.102'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Alice de l'IT. Windows Defender ne peut plus mettre à jour ses définitions antivirus depuis hier. L'erreur affichée est 0x8007000d dans le panneau Sécurité Windows." },
        { from: 'caller', text: "J'ai essayé de lancer la mise à jour manuellement plusieurs fois mais ça échoue à chaque tentative. Les définitions datent de 3 jours — c'est préoccupant pour la sécurité du poste." }
      ],
      steps: [
        {
          question: "Mise à jour des définitions Defender en échec avec le code 0x8007000d. Quelle est la première action ciblée ?",
          options: [
            { text: "Désinstaller et réinstaller Windows Defender", correct: false, feedback: "Windows Defender est un composant système intégré à Windows — il ne peut pas être désinstallé via les méthodes classiques. Le code 0x8007000d indique une corruption du cache Windows Update, pas un problème de Defender lui-même." },
            { text: "Forcer la mise à jour via PowerShell avec Update-MpSignature, et si l'échec persiste, réinitialiser le cache Windows Update (arrêter wuauserv, supprimer le dossier SoftwareDistribution, redémarrer le service)", correct: true, feedback: "Correct ! Update-MpSignature force la mise à jour des signatures sans passer par l'interface graphique. Si l'erreur 0x8007000d persiste, elle indique une corruption du cache Windows Update — réinitialiser ce cache en supprimant le dossier SoftwareDistribution résout la majorité des erreurs de mise à jour Windows et Defender." },
            { text: "Désactiver temporairement Defender et utiliser un antivirus tiers en attendant", correct: false, feedback: "Désactiver Defender laisse le poste sans protection antivirus active — inacceptable même temporairement. Résolvez le problème de mise à jour directement." },
            { text: "Attendre 24h — les serveurs Microsoft sont peut-être temporairement indisponibles", correct: false, feedback: "L'erreur 0x8007000d est un code d'erreur local (données invalides dans le cache) — elle ne disparaît pas seule. Une action corrective est nécessaire." }
          ],
          hint: "PowerShell (admin) : Update-MpSignature. Si erreur : net stop wuauserv → renommer C:\\Windows\\SoftwareDistribution en SoftwareDistribution.old → net start wuauserv → relancer Update-MpSignature.",
          terminalCommand: "Update-MpSignature",
          callerReply: "Update-MpSignature a aussi échoué avec la même erreur. Je vais essayer la réinitialisation du cache Windows Update."
        },
        {
          question: "La réinitialisation du cache SoftwareDistribution est effectuée. Comment vérifier que le problème est résolu ?",
          options: [
            { text: "Relancer Update-MpSignature et vérifier la date des définitions dans Sécurité Windows → Protection contre les virus et menaces → Mises à jour de la protection", correct: true, feedback: "Parfait ! Après la réinitialisation du cache, Update-MpSignature devrait se terminer sans erreur. La vérification de la date des définitions dans Sécurité Windows confirme que les signatures sont bien à jour (date du jour). Si la date ne change pas malgré l'absence d'erreur, attendez quelques minutes — la synchronisation peut prendre du temps." },
            { text: "Redémarrer le PC et observer si Defender se met à jour automatiquement au démarrage suivant", correct: false, feedback: "Attendre un redémarrage pour vérifier ne vous donne pas de confirmation immédiate. Vérifiez activement la date des définitions après la mise à jour forcée — c'est plus rapide et plus fiable." },
            { text: "Vérifier dans l'Observateur d'événements si des erreurs Defender sont encore présentes", correct: false, feedback: "L'Observateur d'événements montre l'historique des erreurs passées, pas l'état actuel. La vérification directe de la date des définitions dans Sécurité Windows est plus immédiate et pertinente." },
            { text: "Scanner le PC complet avec Defender pour confirmer que les nouvelles définitions fonctionnent", correct: false, feedback: "Un scan complet peut durer des heures et n'est pas nécessaire pour valider une mise à jour de définitions. Vérifiez simplement la date des signatures dans les paramètres Defender." }
          ],
          hint: "Sécurité Windows → Protection contre les virus et menaces → Mises à jour de la protection → 'Dernière mise à jour'. La date doit correspondre à aujourd'hui. En PowerShell : Get-MpComputerStatus | Select-Object AntivirusSignatureLastUpdated",
          terminalCommand: "Get-MpComputerStatus | Select-Object AntivirusSignatureLastUpdated",
          callerReply: "Après réinitialisation du cache, Update-MpSignature s'est terminé sans erreur. Les définitions sont maintenant à jour — date d'aujourd'hui confirmée. Le dossier SoftwareDistribution.old peut être supprimé. Merci !"
        }
      ]
    },

    // --- WINDOWS: Erreur DLL manquante au démarrage application ---
    {
      id: 'windows-dll-missing',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Lucie Perrin',
      dept: 'Finance',
      mood: 'frustrated',
      issue: 'Erreur DLL manquante — application métier impossible à lancer',
      terminalContext: {
        hostname: 'PC-FINANCE-07', username: 'lucie.perrin',
        domain: 'CORP.LOCAL', ip: '192.168.1.128'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Lucie de la finance. Depuis ce matin, mon logiciel de comptabilité FinanceExpert ne s'ouvre plus. J'ai un message d'erreur : 'VCRUNTIME140.dll est introuvable. Réinstallez l'application pour corriger ce problème'." },
        { from: 'caller', text: "J'ai essayé de relancer le logiciel plusieurs fois mais c'est toujours le même message. J'ai des clôtures de fin de mois à faire aujourd'hui — c'est vraiment urgent." }
      ],
      steps: [
        {
          question: "L'erreur mentionne 'VCRUNTIME140.dll introuvable'. Quelle est la cause et l'approche correcte ?",
          options: [
            { text: "Télécharger VCRUNTIME140.dll depuis un site DLL tiers et la copier dans le dossier System32", correct: false, feedback: "Télécharger des DLL depuis des sites non officiels est une pratique dangereuse — ces fichiers peuvent contenir des malwares. VCRUNTIME140.dll appartient au package officiel Microsoft Visual C++ Redistributable, disponible gratuitement sur microsoft.com." },
            { text: "VCRUNTIME140.dll fait partie du package Visual C++ Redistributable Microsoft — installer la version appropriée (2015-2022) depuis le site officiel Microsoft", correct: true, feedback: "Correct ! VCRUNTIME140.dll est une DLL du runtime Visual C++ 2015-2022. Elle est absente si le package n'a jamais été installé ou a été supprimé (par un antivirus ou une désinstallation). La solution est d'installer le package officiel Microsoft Visual C++ Redistributable — gratuit, sécurisé, et sans risque." },
            { text: "Réinstaller FinanceExpert — la réinstallation inclura automatiquement toutes les DLL nécessaires", correct: false, feedback: "Parfois vrai, mais pas toujours. Certains installeurs ne vérifient pas les prérequis. Si le package Visual C++ n'est pas présent, la réinstallation de l'application produira la même erreur. Installez le prérequis en premier." },
            { text: "Désinstaller et réinstaller Windows — seule façon de restaurer toutes les DLL système", correct: false, feedback: "VCRUNTIME140.dll n'est pas une DLL Windows native — c'est un composant redistribuable Microsoft que l'installateur de l'application aurait dû déployer. La réinstallation de Windows est totalement disproportionnée." }
          ],
          hint: "Recherchez 'Microsoft Visual C++ Redistributable' sur microsoft.com. Téléchargez la version x64 (et x86 si l'application est 32 bits) de la version 2015-2022. L'erreur indique VCRUNTIME140 → package VC++ 2015-2022.",
          terminalCommand: "winget install Microsoft.VCRedist.2015+.x64",
          callerReply: "J'ai installé le package Visual C++ Redistributable 2015-2022 x64 depuis microsoft.com. FinanceExpert se lance maintenant sans erreur ! Comment éviter que ça se reproduise ?"
        },
        {
          question: "Problème résolu. Comment expliquer la disparition de cette DLL et prévenir la récidive ?",
          options: [
            { text: "La DLL a probablement été supprimée par Windows Update — désactiver les mises à jour automatiques", correct: false, feedback: "Windows Update ne supprime pas les DLL des packages tiers comme Visual C++ Redistributable. Désactiver les mises à jour pour cette raison serait une erreur de diagnostic et une mauvaise pratique de sécurité." },
            { text: "La DLL peut avoir été supprimée par un antivirus (faux positif) ou lors de la désinstallation d'une autre application — vérifier les journaux antivirus et intégrer VC++ Redistributable dans le déploiement standard des postes via SCCM/Intune", correct: true, feedback: "Exact ! Les causes fréquentes : faux positif antivirus qui met la DLL en quarantaine, ou désinstallation d'une autre application qui partageait ce runtime et l'a emporté avec elle. La prévention passe par l'inclusion des packages VC++ Redistributable dans le déploiement standard IT — ainsi tous les postes ont les prérequis dès l'installation." },
            { text: "Rien à faire — c'est un problème ponctuel qui ne se reproduira pas", correct: false, feedback: "Sans identifier la cause, le problème peut se reproduire, notamment si un antivirus continue à mettre la DLL en quarantaine ou si d'autres applications ont les mêmes prérequis manquants." },
            { text: "Créer une sauvegarde quotidienne du dossier System32 pour restaurer les DLL perdues", correct: false, feedback: "Sauvegarder System32 n'est pas une pratique standard — le dossier est géré par Windows. La solution est d'installer correctement les packages prérequis, pas de sauvegarder les DLL manuellement." }
          ],
          hint: "Dans les journaux de l'antivirus (ex: Windows Defender → Historique de protection), vérifiez si VCRUNTIME140.dll a été mis en quarantaine récemment. Pour la prévention : ajouter les packages VC++ Redistributable 2015-2022 x64/x86 dans le catalogue de déploiement SCCM/Intune.",
          callerReply: "Les journaux Defender montrent que VCRUNTIME140.dll a bien été mis en quarantaine il y a 3 jours — faux positif d'une mise à jour des définitions. J'ai créé une exclusion et signalé à Microsoft. Je vais aussi intégrer ce package au déploiement standard. Merci !"
        }
      ]
    },

    // --- WINDOWS: Profil utilisateur corrompu — bureau vide ---
    {
      id: 'windows-corrupted-profile',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Isabelle Renaud',
      dept: 'Direction',
      mood: 'frustrated',
      issue: 'Profil utilisateur corrompu — bureau vide, aucun document personnel visible',
      terminalContext: {
        hostname: 'PC-DIR-05', username: 'isabelle.renaud',
        domain: 'CORP.LOCAL', ip: '192.168.1.146'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Isabelle de la direction. Ce matin en me connectant, mon bureau est complètement vide — fond d'écran par défaut, aucune icône, aucun de mes fichiers. Un message disait 'Nous n'avons pas pu vous connecter à votre compte'." },
        { from: 'caller', text: "J'ai redémarré mais c'est pareil. Tous mes documents semblent avoir disparu — dossier Documents vide, pas de fichiers sur le Bureau. Mes données sont-elles perdues ?" }
      ],
      steps: [
        {
          question: "Bureau vide avec le message 'Nous n'avons pas pu vous connecter à votre compte'. Quel est le diagnostic immédiat ?",
          options: [
            { text: "Les données sont perdues — recréer le profil depuis zéro et restaurer depuis la sauvegarde", correct: false, feedback: "Les données ne sont pas perdues — elles sont toujours dans C:\\Users\\isabelle.renaud. Windows a simplement chargé un profil temporaire (TEMP) parce que le profil principal est verrouillé ou marqué comme corrompu. Il faut réparer le pointeur de registre, pas recréer le profil." },
            { text: "Windows a chargé un profil temporaire à cause d'une corruption de la clé de registre ProfileList — vérifier HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList pour identifier la clé défectueuse", correct: true, feedback: "Correct ! Quand Windows ne peut pas charger un profil, il crée une session temporaire et affiche ce message. Dans le registre, la clé du profil concerné est souvent dupliquée avec une extension .bak ou contient un chemin incorrect. Identifier cette entrée est l'étape clé du diagnostic." },
            { text: "Formater le PC — un profil corrompu ne peut pas être réparé", correct: false, feedback: "Un profil corrompu se répare via le registre dans la grande majorité des cas. Les données dans C:\\Users\\isabelle.renaud sont intactes — une réparation de registre les rend à nouveau accessibles." },
            { text: "Créer un nouveau compte utilisateur AD — le profil sera recréé proprement", correct: false, feedback: "Créer un nouveau compte AD crée un nouveau profil vide — les données de l'ancien profil resteraient dans C:\\Users\\isabelle.renaud sans être associées au nouveau compte. Ce n'est pas la bonne approche." }
          ],
          hint: "regedit → HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList. Cherchez deux entrées avec le même SID : une normale et une avec .bak. La valeur ProfileImagePath doit pointer vers C:\\Users\\isabelle.renaud.",
          terminalCommand: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProfileList\" /s",
          callerReply: "Dans le registre, je vois deux clés pour le même SID : une normale avec ProfileImagePath = C:\\Users\\TEMP, et une avec .bak avec ProfileImagePath = C:\\Users\\isabelle.renaud. C'est bien le problème."
        },
        {
          question: "Deux clés de registre en conflit : SID normal (pointe vers TEMP) et SID.bak (pointe vers le vrai profil). Quelle est la procédure de réparation ?",
          options: [
            { text: "Supprimer les deux clés et redémarrer — Windows recréera les entrées automatiquement", correct: false, feedback: "Supprimer les deux clés supprime l'association SID → profil. Windows créera un nouveau profil vide au prochain démarrage, mais n'associera pas le SID au dossier C:\\Users\\isabelle.renaud existant." },
            { text: "Dans regedit : supprimer la clé SID (sans .bak), renommer la clé SID.bak en SID (retirer .bak), corriger la valeur ProfileImagePath vers C:\\Users\\isabelle.renaud, puis redémarrer", correct: true, feedback: "Parfait ! La procédure exacte : 1) Supprimer la clé SID (celle qui pointe vers TEMP). 2) Renommer SID.bak en SID. 3) Dans cette clé, vérifier que ProfileImagePath = C:\\Users\\isabelle.renaud. 4) Changer la valeur RefCount à 0 et State à 0. 5) Redémarrer — Windows chargera le bon profil." },
            { text: "Modifier la valeur ProfileImagePath de la clé SID normale pour pointer vers C:\\Users\\isabelle.renaud sans toucher à la clé .bak", correct: false, feedback: "Cette approche laisse la clé .bak en place, ce qui peut continuer à créer des conflits au prochain démarrage. La procédure correcte est de supprimer le doublon et de corriger le pointeur en même temps." },
            { text: "Copier manuellement les fichiers de C:\\Users\\isabelle.renaud vers C:\\Users\\TEMP", correct: false, feedback: "Copier les fichiers vers le profil TEMP est un contournement temporaire — le profil TEMP est supprimé à chaque déconnexion. La réparation du registre est la solution pérenne." }
          ],
          hint: "Étapes exactes : regedit → ProfileList → supprimer clé SID → F2 sur SID.bak → renommer en SID → double-clic RefCount → mettre 0 → double-clic State → mettre 0 → vérifier ProfileImagePath → redémarrer. Les données dans C:\\Users\\isabelle.renaud sont intactes.",
          callerReply: "J'ai suivi la procédure exacte. Après redémarrage, mon bureau est revenu avec tous mes icônes et fichiers ! Mes documents sont intacts. Le message d'erreur n'apparaît plus. Immense merci !"
        }
      ]
    },

    // --- WINDOWS: Écran noir après mise à jour Windows ---
    {
      id: 'windows-black-screen-update',
      category: 'Windows',
      level: 2,
      difficulty: 'medium',
      caller: 'Thomas Laurent',
      dept: 'Marketing',
      mood: 'frustrated',
      issue: 'Écran noir après mise à jour Windows — impossible d\'accéder au bureau',
      terminalContext: {
        hostname: 'PC-MARKETING-03', username: 'thomas.laurent',
        domain: 'CORP.LOCAL', ip: '192.168.1.111'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Thomas du marketing. Après la mise à jour Windows d'hier soir, mon PC démarre sur un écran noir. J'entends bien Windows démarrer — le son de connexion — mais l'écran reste noir avec juste le curseur de la souris." },
        { from: 'caller', text: "J'ai redémarré trois fois, c'est pareil à chaque fois. J'ai des créations graphiques à livrer ce matin — c'est vraiment urgent." }
      ],
      steps: [
        {
          question: "Écran noir avec curseur après mise à jour Windows. Windows démarre mais le bureau n'apparaît pas. Quelle est la cause probable et le premier diagnostic ?",
          options: [
            { text: "Le disque dur est défaillant — la mise à jour a détecté un problème matériel et bloqué le démarrage", correct: false, feedback: "Un disque défaillant ne produit pas un écran noir avec curseur — il empêche le démarrage bien plus tôt. L'écran noir avec curseur et son de connexion indique que Windows a démarré mais qu'explorer.exe ou le pilote graphique ne s'est pas lancé correctement." },
            { text: "Explorer.exe ne s'est pas lancé ou le pilote graphique est incompatible — appuyer sur Ctrl+Alt+Suppr → Gestionnaire des tâches → Fichier → Exécuter une nouvelle tâche → explorer.exe pour tester", correct: true, feedback: "Correct ! L'écran noir avec curseur et son de connexion signifie que la session Windows est ouverte mais explorer.exe (le shell Windows) ne s'est pas lancé. Ctrl+Alt+Suppr donne accès au Gestionnaire des tâches même sans bureau. Lancer explorer.exe depuis 'Exécuter une nouvelle tâche' permet de valider si c'est le shell ou le pilote graphique." },
            { text: "Déconnecter tous les périphériques USB et redémarrer — un conflit USB bloque parfois le bureau", correct: false, feedback: "Un conflit USB peut retarder le démarrage mais ne produit généralement pas un écran noir persistant avec curseur. La cause post-mise à jour est plus probablement liée au pilote graphique ou à explorer.exe." },
            { text: "Reinstaller Windows immédiatement — la mise à jour a corrompue le système", correct: false, feedback: "La réinstallation est une dernière option. Un écran noir après mise à jour est un problème connu résolvable via le Gestionnaire des tâches ou le Mode sans échec sans perte de données." }
          ],
          hint: "Ctrl+Alt+Suppr → Gestionnaire des tâches → Fichier → Exécuter une nouvelle tâche → taper 'explorer.exe' → OK. Si le bureau apparaît : c'est un problème de démarrage d'explorer. Si toujours noir : passer en Mode sans échec pour diagnostiquer le pilote graphique.",
          callerReply: "J'ai lancé explorer.exe depuis le Gestionnaire des tâches — le bureau est apparu ! Mais dès que je redémarre, l'écran redevient noir. C'est donc explorer.exe qui ne se lance pas automatiquement."
        },
        {
          question: "Explorer.exe ne se lance plus automatiquement au démarrage. Comment corriger le problème de façon permanente ?",
          options: [
            { text: "Ajouter explorer.exe manuellement dans le dossier Démarrage Windows pour qu'il se lance à chaque connexion", correct: false, feedback: "Explorer.exe ne doit pas être dans le dossier Démarrage — il est géré par une valeur de registre spécifique. L'ajouter dans Démarrage crée des instances multiples et peut causer d'autres problèmes." },
            { text: "Vérifier dans regedit que la valeur Shell dans HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon est bien 'explorer.exe' — une mise à jour peut l'avoir modifiée", correct: true, feedback: "Exact ! La clé Winlogon\\Shell définit quel processus est lancé comme shell Windows au démarrage. Une mise à jour corrompue ou un malware peut modifier cette valeur. Si elle est vide, pointe vers un fichier inexistant, ou contient autre chose qu'explorer.exe, Windows démarre sans shell — d'où l'écran noir. La correction est immédiate : remettre la valeur à 'explorer.exe'." },
            { text: "Désinstaller la mise à jour Windows depuis Paramètres → Windows Update → Afficher l'historique des mises à jour → Désinstaller", correct: false, feedback: "Désinstaller la mise à jour est une option valable mais radicale — elle supprime des correctifs de sécurité. La correction de la valeur de registre Winlogon\\Shell est plus ciblée et ne sacrifie pas la mise à jour." },
            { text: "Créer un nouveau compte utilisateur — le profil actuel est irréparable", correct: false, feedback: "Le problème est une valeur de registre globale (HKLM, pas HKCU) — elle affecte tous les comptes. Créer un nouveau compte ne résoudrait pas le problème pour Thomas ni pour les autres utilisateurs du PC." }
          ],
          hint: "regedit → HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon → valeur 'Shell' → doit contenir exactement : explorer.exe. Si vide ou incorrect : double-clic → saisir 'explorer.exe' → OK → redémarrer.",
          terminalCommand: "reg query \"HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\" /v Shell",
          callerReply: "La valeur Shell était vide ! Je l'ai remise à 'explorer.exe'. Après redémarrage, le bureau se charge normalement. Mes fichiers graphiques sont là. Merci, vous m'avez sauvé la mise !"
        }
      ]
    },

    // --- M365: Règles Outlook — transfert automatique non fonctionnel ---
    {
      id: 'm365-outlook-forward-rule',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Denis Marchand',
      dept: 'Juridique',
      mood: 'calm',
      issue: 'Règle Outlook de transfert automatique créée mais les e-mails ne sont pas transférés',
      terminalContext: {
        hostname: 'PC-JURIDIQUE-07', username: 'denis.marchand',
        domain: 'CORP.LOCAL', ip: '192.168.1.82'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Denis du service juridique. J'ai créé une règle dans Outlook pour transférer automatiquement certains e-mails clients vers mon adresse personnelle quand je suis en déplacement. Mais les e-mails ne sont pas transférés." },
        { from: 'caller', text: "La règle est bien là dans la liste, elle semble active. J'ai testé en m'envoyant un e-mail moi-même mais rien n'arrive à l'adresse externe. Est-ce que c'est un problème de ma règle ?" }
      ],
      steps: [
        {
          question: "La règle de transfert existe dans Outlook mais n'envoie rien. Quelle est votre première vérification ?",
          options: [
            { text: "Supprimer et recréer la règle — elle est probablement mal configurée", correct: false, feedback: "Avant de recréer la règle, vérifiez que la règle existante est bien cochée (active) dans le gestionnaire de règles et qu'elle s'applique aux bons e-mails. Une recréation sans diagnostic peut reproduire le même problème." },
            { text: "Vérifier dans Outlook que la règle est bien cochée (active) dans Accueil → Règles → Gérer les règles et alertes, et tester avec le bouton 'Exécuter les règles maintenant'", correct: true, feedback: "Correct ! Une règle décochée est inactive — elle apparaît dans la liste mais ne s'exécute pas. Le bouton 'Exécuter les règles maintenant' permet de forcer l'application sur les e-mails existants pour valider que la règle fonctionne techniquement. Si elle s'exécute manuellement mais pas automatiquement, le problème est différent." },
            { text: "Désinstaller et réinstaller Outlook — un bug empêche les règles de fonctionner", correct: false, feedback: "Les règles Outlook sont stockées sur le serveur Exchange/M365 — une réinstallation d'Outlook ne les affecte pas et ne résoudra pas ce problème." },
            { text: "Contacter le destinataire externe pour vérifier qu'il ne bloque pas les e-mails transférés", correct: false, feedback: "Si les e-mails ne quittent même pas Exchange (pas de trace dans les éléments envoyés), le problème est côté expéditeur — pas côté destinataire. Vérifiez d'abord la règle et la politique d'envoi." }
          ],
          hint: "Accueil → Règles → Gérer les règles et alertes. Vérifier : règle cochée, conditions correctes (De: / À: / Objet:), action 'Transférer à' avec la bonne adresse. Onglet Éléments envoyés : les e-mails transférés apparaissent-ils ici ?",
          callerReply: "La règle est bien cochée et les conditions semblent correctes. J'ai cliqué 'Exécuter les règles maintenant' — dans les Éléments envoyés, je vois bien un transfert. Mais il n'arrive toujours pas à l'adresse externe. C'est peut-être bloqué quelque part ?"
        },
        {
          question: "La règle fonctionne techniquement (visible dans Éléments envoyés) mais l'e-mail n'arrive pas à l'adresse externe. Quelle est la cause probable dans un environnement M365 d'entreprise ?",
          options: [
            { text: "L'adresse e-mail externe est invalide — vérifier l'orthographe", correct: false, feedback: "Si l'adresse était invalide, Outlook générerait un message d'erreur de non-remise (NDR). L'absence totale de message indique un blocage silencieux en amont." },
            { text: "La politique anti-spam M365 bloque le transfert automatique vers des adresses externes — l'administrateur Exchange doit autoriser ce transfert dans le Centre d'administration Exchange", correct: true, feedback: "Exact ! Par défaut, Microsoft 365 bloque le transfert automatique vers des adresses externes pour prévenir les fuites de données (data exfiltration). L'admin Exchange doit modifier la politique anti-spam sortante : Centre d'administration Exchange → Protection → Anti-spam sortant → modifier la règle par défaut → Transfert automatique → 'Activé'. Ou créer une exception ciblée pour cet utilisateur." },
            { text: "Le serveur de messagerie du destinataire est temporairement en panne", correct: false, feedback: "Une panne temporaire du serveur destinataire ne bloquerait pas tous les transferts de façon cohérente. Exchange réessaierait pendant 48h et enverrait une NDR en cas d'échec définitif." },
            { text: "Outlook doit être ouvert en permanence pour que les règles de transfert fonctionnent", correct: false, feedback: "Dans M365/Exchange Online, les règles de boîte de réception s'exécutent côté serveur — Outlook n'a pas besoin d'être ouvert. C'est précisément l'avantage des règles serveur par rapport aux règles client." }
          ],
          hint: "Centre d'administration Exchange (admin.exchange.microsoft.com) → Protection → Stratégies anti-spam → Stratégie anti-spam sortante → Transfert automatique → changer de 'Automatique - Contrôlé par le système' à 'Activé'. Attention : documenter et justifier cette exception pour la conformité.",
          callerReply: "L'administrateur a confirmé que le transfert externe était bien bloqué par la politique M365. Il a créé une exception ciblée pour mon compte après validation du responsable. Le transfert fonctionne maintenant. Merci !"
        }
      ]
    },

    // --- M365: Excel — fichier corrompu impossible à ouvrir ---
    {
      id: 'm365-excel-corrupted',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Valérie Lemoine',
      dept: 'Finance',
      mood: 'frustrated',
      issue: 'Fichier Excel corrompu — impossible à ouvrir, erreur à chaque tentative',
      terminalContext: {
        hostname: 'PC-FINANCE-06', username: 'valerie.lemoine',
        domain: 'CORP.LOCAL', ip: '192.168.1.127'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Valérie de la finance. Mon fichier Excel de budget annuel ne s'ouvre plus — j'ai le message 'Le fichier est peut-être endommagé ou corrompu'. J'ai ce fichier depuis des mois et il contenait toutes mes projections Q4." },
        { from: 'caller', text: "J'ai essayé depuis un autre PC, même erreur. Le fichier fait 8 Mo — il est là, je vois son icône, mais je ne peux pas l'ouvrir. C'est une catastrophe, j'ai une réunion budgétaire cet après-midi." }
      ],
      steps: [
        {
          question: "Fichier Excel corrompu qui ne s'ouvre pas. Quelle est la première tentative de récupération ?",
          options: [
            { text: "Renommer le fichier .xlsx en .zip et extraire le contenu XML manuellement", correct: false, feedback: "Cette méthode avancée est pertinente en dernier recours — elle nécessite des connaissances techniques et peut être longue. Commencez par les outils intégrés d'Excel qui sont plus rapides et plus accessibles." },
            { text: "Ouvrir Excel → Fichier → Ouvrir → Parcourir → sélectionner le fichier → cliquer la flèche du bouton Ouvrir → 'Ouvrir et réparer' — outil de réparation intégré Excel", correct: true, feedback: "Correct ! 'Ouvrir et réparer' est l'outil de récupération officiel d'Excel. Il tente d'abord une réparation complète, puis si impossibble, propose d'extraire uniquement les données. C'est la première tentative standard avant toute autre méthode." },
            { text: "Supprimer le fichier et demander à la collègue de le recréer depuis sa copie", correct: false, feedback: "Avant de supprimer quoi que ce soit, tentez toutes les options de récupération disponibles. La suppression est irréversible." },
            { text: "Installer un logiciel tiers de récupération de fichiers Excel", correct: false, feedback: "Excel dispose déjà d'un outil de réparation intégré — inutile d'installer un logiciel tiers en première approche. Commencez par les outils Microsoft." }
          ],
          hint: "Excel → Fichier → Ouvrir → Parcourir → sélectionner le fichier .xlsx → NE PAS cliquer Ouvrir directement → cliquer sur la petite flèche à droite du bouton Ouvrir → 'Ouvrir et réparer' → choisir 'Réparer' en premier, puis 'Extraire les données' si la réparation échoue.",
          callerReply: "J'ai essayé 'Ouvrir et réparer' → Réparer : échec. Puis 'Extraire les données' : Excel a récupéré les données mais toute la mise en forme et les formules semblent perdues. Y a-t-il un moyen de récupérer le fichier original ?"
        },
        {
          question: "La réparation locale a échoué. Le fichier est sauvegardé sur SharePoint/OneDrive. Comment récupérer une version antérieure intacte ?",
          options: [
            { text: "Le fichier est corrompu définitivement — travailler avec la version extraite sans formules", correct: false, feedback: "Pas encore ! Si le fichier est sur SharePoint ou OneDrive, l'historique des versions conserve automatiquement les versions précédentes pendant 180 jours. Une version intacte d'hier ou d'avant-hier est probablement disponible." },
            { text: "Accéder au fichier sur SharePoint/OneDrive → clic droit → Historique des versions → restaurer la dernière version avant corruption", correct: true, feedback: "Parfait ! SharePoint et OneDrive conservent automatiquement l'historique des versions. Clic droit sur le fichier dans SharePoint → Historique des versions (ou ouvrir dans SharePoint → sélectionner le fichier → Versions). Chaque version est horodatée — sélectionnez la dernière version fonctionnelle et restaurez-la. C'est la récupération la plus complète." },
            { text: "Contacter Microsoft Support pour récupérer le fichier depuis leurs serveurs", correct: false, feedback: "Microsoft Support ne récupère pas de fichiers utilisateurs individuels. L'historique des versions SharePoint/OneDrive est l'outil prévu à cet effet — accessible directement sans assistance Microsoft." },
            { text: "Vérifier si un fichier .tmp existe dans le même dossier que le fichier corrompu", correct: false, feedback: "Les fichiers .tmp Excel sont créés localement pendant l'édition et supprimés à la fermeture propre. Si le fichier est sur SharePoint, l'historique des versions est bien plus fiable que les fichiers temporaires locaux." }
          ],
          hint: "SharePoint : naviguer vers le fichier → sélectionner → clic sur '...' (Plus d'options) → Historique des versions. OneDrive : clic droit sur le fichier → Historique des versions. Chaque version est horodatée et peut être téléchargée ou restaurée directement.",
          callerReply: "Il y avait 12 versions dans l'historique SharePoint ! J'ai restauré celle d'hier soir à 18h — toutes les formules et la mise en forme sont intactes. Je suis prête pour ma réunion. Merci infiniment !"
        }
      ]
    },

    // --- M365: Teams — impossible de rejoindre une réunion externe ---
    {
      id: 'm365-teams-external-meeting',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Stéphane Colin',
      dept: 'Commercial',
      mood: 'frustrated',
      issue: 'Teams — impossible de rejoindre une réunion d\'un partenaire externe',
      terminalContext: {
        hostname: 'PC-COM-12', username: 'stephane.colin',
        domain: 'CORP.LOCAL', ip: '192.168.1.106'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Stéphane du commercial. J'essaie de rejoindre une réunion Teams organisée par un client externe mais j'ai le message 'Vous n'êtes pas autorisé à rejoindre cette réunion' ou Teams ne charge tout simplement pas la réunion." },
        { from: 'caller', text: "Mon collègue qui a le même poste arrive à rejoindre des réunions externes. Ce n'est donc pas un problème général. La réunion commence dans 15 minutes — c'est un client important." }
      ],
      steps: [
        {
          question: "Stéphane ne peut pas rejoindre la réunion externe mais son collègue oui. Quelle est la première vérification à effectuer en urgence ?",
          options: [
            { text: "Réinstaller Teams sur le poste de Stéphane — une installation corrompue cause ce type d'erreur", correct: false, feedback: "Si le collègue joint la réunion depuis le même réseau avec la même version de Teams, l'installation n'est pas en cause. Le problème est propre au compte de Stéphane." },
            { text: "Essayer de rejoindre la réunion via le navigateur web (teams.microsoft.com → rejoindre avec le lien) pour contourner le client Teams et identifier si le problème est lié au client ou au compte", correct: true, feedback: "Correct ! La version web de Teams ne dépend pas du client installé ni du cache local. Si la réunion se rejoint via le web, le problème est dans le client Teams (cache, configuration). Si le web échoue aussi, le problème est au niveau du compte ou de la politique d'accès externe." },
            { text: "Demander à l'organisateur de la réunion de renvoyer l'invitation", correct: false, feedback: "Renvoyer l'invitation ne changera rien si le problème est lié aux paramètres du compte ou du client Teams. Diagnostiquez d'abord la cause avant de solliciter le client." },
            { text: "Vérifier si Teams est à jour — une version obsolète peut bloquer l'accès aux réunions externes", correct: false, feedback: "Une mise à jour Teams est rarement la cause d'un blocage soudain, surtout si le collègue avec la même version accède normalement. Cherchez une cause propre au compte de Stéphane." }
          ],
          hint: "Ouvrir un navigateur → teams.microsoft.com → se connecter avec le compte de Stéphane → coller le lien de la réunion → cliquer Rejoindre. Si ça fonctionne : problème de client Teams (vider le cache). Si échec : problème de compte ou politique d'accès externe.",
          callerReply: "Via le navigateur ça fonctionne ! J'ai pu rejoindre la réunion de mon client. Mais j'aimerais que ça marche aussi depuis l'application Teams normale. Qu'est-ce qui cloche ?"
        },
        {
          question: "La réunion fonctionne via le web mais pas dans le client Teams. Comment résoudre le problème dans l'application ?",
          options: [
            { text: "Vider le cache Teams : fermer Teams, supprimer le contenu de %AppData%\\Microsoft\\Teams, relancer Teams", correct: true, feedback: "Correct ! Le cache Teams stocke des données d'authentification et de configuration. Un cache corrompu peut bloquer l'accès aux réunions fédérées tout en laissant les autres fonctions opérationnelles. La suppression du cache force Teams à recréer une session propre — c'est la solution standard pour les comportements erratiques propres à un compte." },
            { text: "Désinstaller Teams et réinstaller la version la plus récente depuis microsoft.com", correct: false, feedback: "La réinstallation complète est une option plus lourde que nécessaire. La vidange du cache résout la majorité des cas de ce type en moins de 2 minutes — tentez-la d'abord." },
            { text: "Créer un nouveau profil Windows pour Stéphane — son profil actuel est corrompu", correct: false, feedback: "Le problème est isolé à Teams (le web fonctionne) — le profil Windows n'est pas en cause. Créer un nouveau profil Windows est disproportionné pour un problème de cache d'application." },
            { text: "Accorder à Stéphane des droits administrateurs locaux pour que Teams puisse accéder aux réunions externes", correct: false, feedback: "Les droits administrateurs n'ont aucun rapport avec l'accès aux réunions Teams externes. Teams fonctionne parfaitement en tant qu'utilisateur standard." }
          ],
          hint: "Fermer Teams complètement (icône dans la barre des tâches → quitter). Ouvrir Exécuter (Win+R) → %AppData%\\Microsoft\\Teams → sélectionner tout → supprimer. Relancer Teams → se reconnecter → tester une réunion externe.",
          callerReply: "J'ai vidé le cache Teams, relancé l'application et testé — la réunion externe se charge normalement maintenant. Ça devait être des données d'authentification obsolètes dans le cache. Merci !"
        }
      ]
    },

    // --- M365: MFA — code SMS non reçu ---
    {
      id: 'm365-mfa-no-sms',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Marie Dupont',
      dept: 'Comptabilité',
      mood: 'frustrated',
      issue: 'MFA — code SMS non reçu — impossible de se connecter à Microsoft 365',
      terminalContext: {
        hostname: 'PC-COMPTA-09', username: 'marie.dupont',
        domain: 'CORP.LOCAL', ip: '192.168.1.91'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Marie de la comptabilité. Je n'arrive plus à me connecter à Microsoft 365 depuis ce matin — le code SMS de vérification n'arrive pas sur mon téléphone. J'attends depuis 20 minutes." },
        { from: 'caller', text: "J'ai redémarré mon téléphone, j'ai du réseau, mais toujours rien. J'ai des virements urgents à valider ce matin — c'est vraiment bloquant." }
      ],
      steps: [
        {
          question: "Le code SMS MFA n'arrive pas. Le téléphone a du réseau. Quelles vérifications immédiates effectuez-vous ?",
          options: [
            { text: "Désactiver le MFA sur le compte de Marie pour lui permettre de se connecter immédiatement", correct: false, feedback: "Désactiver le MFA est une grave violation de sécurité — surtout pour un compte comptabilité qui traite des virements. Le MFA protège contre les compromissions de compte. Trouvez une méthode d'authentification alternative, ne supprimez jamais le MFA." },
            { text: "Vérifier si Marie peut utiliser une méthode MFA alternative : notification Microsoft Authenticator, appel vocal, ou code TOTP depuis l'application Authenticator", correct: true, feedback: "Correct ! Si plusieurs méthodes MFA sont configurées, l'utilisateur peut utiliser une alternative immédiatement sans intervention IT. Microsoft Authenticator (notification push ou code TOTP à 6 chiffres) fonctionne sans SMS ni réseau mobile. C'est la première solution à proposer — rapide, sécurisée, sans risque." },
            { text: "Réinitialiser le mot de passe de Marie — le problème vient peut-être de là", correct: false, feedback: "Le mot de passe n'est pas en cause — le problème est spécifiquement l'étape MFA. Réinitialiser le mot de passe n'affecte pas la réception des SMS MFA." },
            { text: "Demander à Marie d'emprunter le téléphone d'un collègue pour recevoir le SMS", correct: false, feedback: "Le SMS MFA est envoyé au numéro enregistré sur le compte de Marie — le SMS n'arrivera pas sur le téléphone d'un collègue. Ce n'est pas techniquement possible." }
          ],
          hint: "Sur l'écran de connexion M365 après le mot de passe → cliquer 'Utiliser une autre méthode de vérification' → choisir : notification Authenticator, code Authenticator, ou appel vocal. Si aucune alternative configurée, l'admin doit intervenir.",
          callerReply: "Je n'ai que le SMS comme méthode — je n'ai jamais configuré l'application Authenticator. Je suis complètement bloquée. Est-ce que vous pouvez faire quelque chose côté admin ?"
        },
        {
          question: "Marie n'a que le SMS comme méthode MFA et ne reçoit pas le code. Comment débloquer la situation de façon sécurisée ?",
          options: [
            { text: "L'administrateur réinitialise l'inscription MFA de Marie dans Azure AD (Entra ID) → Marie reconfigure ses méthodes MFA à la prochaine connexion, en ajoutant Microsoft Authenticator comme méthode principale", correct: true, feedback: "Exact ! Dans le portail Azure (entra.microsoft.com) → Utilisateurs → Marie Dupont → Méthodes d'authentification → Exiger une réinscription MFA. Au prochain login, Marie devra reconfigurer ses méthodes — c'est l'occasion d'ajouter Microsoft Authenticator comme méthode principale (plus fiable que le SMS). L'admin doit vérifier l'identité de Marie avant cette action (appel vidéo, badge, manager)." },
            { text: "L'administrateur envoie un lien de connexion sans MFA par e-mail à Marie", correct: false, feedback: "Il n'existe pas de 'lien de connexion sans MFA' dans M365 — et créer une exception sans MFA pour un compte comptabilité exposé aux virements serait une faute de sécurité grave." },
            { text: "Mettre à jour le numéro de téléphone de Marie dans Azure AD avec un autre numéro temporaire", correct: false, feedback: "Changer le numéro de téléphone MFA sans vérification d'identité rigoureuse est une technique d'attaque courante (SIM swapping social engineering). L'admin ne doit jamais changer un facteur MFA sans authentification forte préalable de l'utilisateur." },
            { text: "Attendre que l'opérateur télécom résolve le problème de SMS — rien à faire côté IT", correct: false, feedback: "Attendre passivement bloque Marie indéfiniment. L'admin peut débloquer la situation via la réinitialisation MFA dans Entra ID — c'est la procédure prévue exactement pour ce cas." }
          ],
          hint: "Portal Azure (entra.microsoft.com) → Utilisateurs → sélectionner Marie Dupont → Méthodes d'authentification → 'Exiger une réinscription à l'authentification multifacteur'. Vérifier l'identité de Marie avant (vidéo, badge physique). Conseiller ensuite Microsoft Authenticator comme méthode principale.",
          callerReply: "L'admin a réinitialisé mon MFA après vérification de mon identité par vidéo. Je me suis reconnectée et j'ai configuré l'application Microsoft Authenticator. Ça marche parfaitement — et maintenant j'ai une méthode de secours. Merci !"
        }
      ]
    },

    // --- M365: Impossible d'ouvrir fichiers SharePoint dans Office ---
    {
      id: 'm365-sharepoint-office-open',
      category: 'M365',
      level: 1,
      difficulty: 'medium',
      caller: 'Éric Bonnet',
      dept: 'Juridique',
      mood: 'frustrated',
      issue: 'Impossible d\'ouvrir les fichiers SharePoint directement dans Office — erreur d\'authentification',
      terminalContext: {
        hostname: 'PC-JURIDIQUE-09', username: 'eric.bonnet',
        domain: 'CORP.LOCAL', ip: '192.168.1.84'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Éric du service juridique. Quand je clique sur un fichier Word ou Excel depuis SharePoint, j'ai une erreur 'Impossible d'ouvrir ce fichier' ou une demande de connexion en boucle qui ne se termine jamais." },
        { from: 'caller', text: "Ça a commencé hier après que j'ai changé mon mot de passe M365. Depuis, mes fichiers SharePoint ne s'ouvrent plus dans Word ou Excel. Je dois accéder à des contrats urgents." }
      ],
      steps: [
        {
          question: "Fichiers SharePoint impossibles à ouvrir dans Office depuis un changement de mot de passe. Quelle est la cause probable et la première action ?",
          options: [
            { text: "Réinstaller Office — la mise à jour du mot de passe a corrompu l'installation", correct: false, feedback: "Office ne se corrompt pas lors d'un changement de mot de passe. Le problème est que les identifiants M365 cachés dans Windows Credential Manager sont obsolètes — ils contiennent l'ancien mot de passe et créent une boucle d'authentification." },
            { text: "Supprimer les identifiants M365 obsolètes dans le Gestionnaire d'informations d'identification Windows (anciens mot de passe mis en cache), puis se reconnecter à Office", correct: true, feedback: "Correct ! Lors d'un changement de mot de passe M365, Windows Credential Manager conserve l'ancien mot de passe en cache. Office tente de s'authentifier avec ces identifiants obsolètes, échoue, et boucle. Supprimer ces entrées force Office à demander les nouveaux identifiants." },
            { text: "Demander à l'admin de réinitialiser le mot de passe d'Éric — le changement s'est mal passé", correct: false, feedback: "Le mot de passe M365 fonctionne (Éric peut se connecter au portail web). Le problème est uniquement le cache local des identifiants dans Windows." },
            { text: "Télécharger les fichiers SharePoint en local et les ouvrir depuis le disque dur", correct: false, feedback: "Ce contournement ne résout pas le problème structurel et oblige à travailler sur des copies locales sans bénéficier de la co-édition et de la sauvegarde automatique SharePoint." }
          ],
          hint: "Panneau de configuration → Gestionnaire d'informations d'identification → Informations d'identification Windows → chercher toutes les entrées contenant 'MicrosoftOffice', 'Microsoft_', 'live.com', 'sharepoint' → supprimer chaque entrée. Puis rouvrir Office et se connecter avec le nouveau mot de passe.",
          callerReply: "J'ai trouvé 4 entrées dans le Gestionnaire d'informations d'identification avec 'MicrosoftOffice' et 'SharePoint'. Je les ai toutes supprimées. Office me demande maintenant de me reconnecter."
        },
        {
          question: "Les identifiants obsolètes sont supprimés et Office demande une nouvelle connexion. Comment finaliser correctement ?",
          options: [
            { text: "Se connecter avec le compte M365 (eric.bonnet@corp.local + nouveau mot de passe) et cocher 'Rester connecté' pour mettre en cache les nouveaux identifiants", correct: true, feedback: "Parfait ! La reconnexion avec le nouveau mot de passe régénère les jetons d'authentification et recrée les entrées correctes dans le Credential Manager. Cocher 'Rester connecté' évite de devoir se reconnecter à chaque session. Tester ensuite l'ouverture d'un fichier SharePoint confirme que tout fonctionne." },
            { text: "Se connecter sans cocher 'Rester connecté' pour éviter que le problème se reproduise", correct: false, feedback: "Ne pas rester connecté signifie que les identifiants ne sont pas mis en cache — Office demandera le mot de passe à chaque ouverture de fichier SharePoint. Ce n'est pas pratique et ne prévient pas les problèmes futurs." },
            { text: "Désactiver la synchronisation des identifiants Windows pour éviter les conflits futurs", correct: false, feedback: "Désactiver la synchronisation des identifiants empêcherait l'accès transparent aux ressources réseau et M365. Ce n'est pas une solution recommandée." },
            { text: "Créer un nouveau profil Office depuis les paramètres de compte", correct: false, feedback: "Un nouveau profil Office n'est pas nécessaire ici — les identifiants étaient simplement obsolètes dans le Credential Manager. La reconnexion simple suffit." }
          ],
          hint: "Lors de la demande de connexion Office : entrer eric.bonnet@corp.local → nouveau mot de passe → cocher 'Rester connecté' → Se connecter. Puis tester : ouvrir SharePoint dans le navigateur → cliquer sur un fichier Word → 'Ouvrir dans l'application de bureau'.",
          callerReply: "Reconnecté avec mon nouveau mot de passe. J'ai testé l'ouverture d'un contrat depuis SharePoint — Word s'est ouvert directement sans demander de connexion. Tout fonctionne ! Merci, je ne savais pas que le Credential Manager stockait les mots de passe."
        }
      ]
    },

    // --- M365: Licence M365 expirée ---
    {
      id: 'm365-license-expired',
      category: 'M365',
      level: 2,
      difficulty: 'medium',
      caller: 'Responsable RH',
      dept: 'Ressources Humaines',
      mood: 'alarmed',
      issue: 'Licence M365 expirée — perte d\'accès à Word, Excel, Teams et Outlook',
      terminalContext: {
        hostname: 'PC-RH-05', username: 'responsable.rh',
        domain: 'CORP.LOCAL', ip: '192.168.1.55'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est le responsable RH. Ce matin en arrivant, j'ai une bannière rouge dans Word qui dit 'Licence expirée — abonnement non valide'. Outlook, Teams et Excel affichent le même message. Je n'arrive plus à travailler ni à envoyer des e-mails." },
        { from: 'caller', text: "J'ai des entretiens toute la matinée et des contrats à signer numériquement. Est-ce que c'est un problème pour tout le monde ou juste pour moi ?" }
      ],
      steps: [
        {
          question: "Bannière 'Licence expirée' sur tous les produits Office d'un seul utilisateur. Quelle est la première action de diagnostic ?",
          options: [
            { text: "Désinstaller et réinstaller Office — l'installation est corrompue", correct: false, feedback: "La réinstallation n'a aucun effet sur un problème de licence. Office vérifie la validité de la licence auprès des serveurs Microsoft — si elle est invalide côté admin, une réinstallation ne changera rien." },
            { text: "Vérifier dans le Centre d'administration Microsoft 365 (admin.microsoft.com) le statut de la licence assignée au compte du responsable RH", correct: true, feedback: "Correct ! Pour un problème de licence M365, le diagnostic se fait dans Admin M365 → Utilisateurs actifs → sélectionner l'utilisateur → onglet 'Licences et applications'. Vous voyez immédiatement si la licence est assignée et active. Comme le problème est isolé à cet utilisateur, c'est un problème d'assignation individuelle, pas de l'abonnement global." },
            { text: "Vérifier si l'abonnement M365 global de l'entreprise est expiré dans le Centre d'administration", correct: false, feedback: "Si l'abonnement global était expiré, tous les utilisateurs seraient bloqués simultanément — ce serait une alerte majeure. Comme le problème est isolé à un seul compte, c'est un problème d'assignation individuelle de licence." },
            { text: "Demander au responsable RH de se déconnecter et se reconnecter — sa session a expiré", correct: false, feedback: "La reconnexion ne résout pas un problème de licence. Si la licence est expirée ou non assignée dans l'admin M365, se reconnecter ne changera rien — Office continuera d'afficher le message." }
          ],
          hint: "admin.microsoft.com → Utilisateurs → Utilisateurs actifs → rechercher le compte → cliquer → onglet 'Licences et applications'. Vous verrez les licences assignées et leur état (actif / suspendu / non assigné).",
          callerReply: "Mon IT vient de vérifier le portail admin. Ma licence 'Microsoft 365 Business Standard' était assignée mais apparaît maintenant comme 'Non assignée' depuis ce matin. Il ne comprend pas pourquoi elle s'est désassignée."
        },
        {
          question: "La licence M365 s'est désassignée du compte. Comment résoudre et identifier la cause ?",
          options: [
            { text: "Réassigner la licence Microsoft 365 Business Standard depuis Admin M365, puis investiguer via le journal d'audit pour identifier la cause de la désassignation automatique", correct: true, feedback: "Parfait ! Procédure : 1) Réassignation — Admin M365 → Utilisateurs actifs → sélectionner l'utilisateur → Licences → cocher 'Microsoft 365 Business Standard' → Enregistrer (actif en 5-15 min). 2) Investigation — admin.microsoft.com → Conformité → Audit → rechercher les modifications de licences sur les dernières 24h. Cause fréquente : script PowerShell de nettoyage ayant ciblé des comptes par erreur, ou synchronisation Azure AD Connect incorrecte." },
            { text: "Acheter une nouvelle licence M365 pour le responsable RH — l'ancienne est définitivement perdue", correct: false, feedback: "Une licence désassignée n'est pas perdue — elle retourne dans le pool de licences disponibles. La réassigner suffit. Acheter une nouvelle licence serait une dépense inutile." },
            { text: "Réinitialiser le mot de passe M365 du responsable RH pour forcer la réactivation de la licence", correct: false, feedback: "Le mot de passe n'a aucune relation avec l'état de la licence. Réinitialiser le mot de passe n'activera pas une licence désassignée." },
            { text: "Activer le mode Office hors connexion pour permettre de travailler en attendant", correct: false, feedback: "Le mode hors connexion d'Office accorde une grace period limitée (25 jours en général) mais n'est pas une solution — la réassignation de licence est la seule vraie résolution." }
          ],
          hint: "Admin M365 → Utilisateurs actifs → responsable.rh → Licences et applications → cocher la licence → Enregistrer. Pour l'audit : admin.microsoft.com → Conformité → Audit → Activités → 'Modification de la licence utilisateur' → filtrer sur les dernières 24h.",
          callerReply: "L'IT a réassigné la licence. J'ai redémarré Word et la bannière rouge a disparu ! Tout fonctionne à nouveau. L'audit a révélé qu'un script PowerShell de nettoyage automatique avait ciblé des comptes 'inactifs depuis 30 jours' par erreur — mon compte avait peu d'activité ce mois-ci à cause d'un déplacement."
        }
      ]
    },

    // --- M365: SharePoint — accès refusé à un site d'équipe ---
    {
      id: 'm365-sharepoint-access-denied',
      category: 'M365',
      level: 2,
      difficulty: 'medium',
      caller: 'Nadia Bensalem',
      dept: 'Formation',
      mood: 'frustrated',
      issue: 'SharePoint — accès refusé au site d\'équipe Formation (erreur 403)',
      terminalContext: {
        hostname: 'PC-FORM-03', username: 'nadia.bensalem',
        domain: 'CORP.LOCAL', ip: '192.168.1.53'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Nadia de la Formation. Depuis hier après-midi, quand j'essaie d'accéder au SharePoint de notre équipe, j'ai une page 'Accès refusé — Vous n'êtes pas autorisé à accéder à cette page'. J'avais accès la semaine dernière sans problème." },
        { from: 'caller', text: "J'ai besoin des supports de formation pour une session demain matin. Tous les documents sont sur ce SharePoint. Mes collègues du même service n'ont aucun problème — c'est uniquement mon compte." }
      ],
      steps: [
        {
          question: "Nadia a perdu l'accès au SharePoint équipe Formation (erreur 403), ses collègues y accèdent normalement. Quelle est la première vérification ?",
          options: [
            { text: "Vérifier dans les autorisations du site SharePoint si Nadia est toujours membre du groupe associé au site", correct: true, feedback: "Correct ! Une erreur 403 isolée à un seul utilisateur indique presque toujours un problème de permissions. Cause la plus fréquente : l'utilisateur a été retiré (manuellement ou par synchronisation AD) du groupe de sécurité qui donne accès au site. Vérifier dans les autorisations du site SharePoint → groupe 'Formation Membres'." },
            { text: "Demander à Nadia de vider le cache du navigateur et de se reconnecter", correct: false, feedback: "Le cache peut causer des problèmes d'affichage mais pas une erreur 403. L'erreur 403 signifie que le serveur a rejeté la demande — l'authentification a réussi (Nadia est reconnue) mais ses autorisations sont insuffisantes. C'est un problème de permissions côté serveur." },
            { text: "Réinitialiser le mot de passe SharePoint de Nadia", correct: false, feedback: "SharePoint utilise les identifiants M365 — pas de mot de passe séparé. Une erreur 403 = authentification réussie mais permissions insuffisantes. Le problème est dans les droits du site, pas dans le mot de passe." },
            { text: "Vérifier si le site SharePoint est en maintenance ou hors ligne", correct: false, feedback: "Si le site était hors ligne, tous les utilisateurs seraient bloqués. Comme les collègues de Nadia y accèdent sans problème, le site est fonctionnel — le problème est spécifique aux permissions de Nadia." }
          ],
          hint: "Accès admin au site SharePoint : ouvrir le site → Paramètres (engrenage) → Autorisations du site → voir les groupes (Propriétaires / Membres / Visiteurs) → chercher si nadia.bensalem@corp.local figure dans 'Formation Membres'.",
          callerReply: "L'admin a vérifié les permissions du site. Mon compte nadia.bensalem n'est plus dans le groupe 'Formation Membres'. Il était là vendredi mais a disparu depuis hier soir."
        },
        {
          question: "Nadia a été retirée du groupe 'Formation Membres'. Comment résoudre et sécuriser pour éviter que cela se reproduise ?",
          options: [
            { text: "Réajouter nadia.bensalem dans le groupe 'Formation Membres', identifier la cause via le journal d'audit M365, et corriger le processus qui a déclenché la suppression", correct: true, feedback: "Parfait ! Procédure complète : 1) Réajout immédiat — Autorisations du site → groupe 'Formation Membres' → Nouveau → nadia.bensalem@corp.local. 2) Investigation — Admin M365 → Conformité → Audit → 'Modification des autorisations SharePoint' sur les dernières 48h pour identifier qui ou quoi a retiré Nadia. 3) Si causé par une synchronisation AD ou un script automatique, corriger la règle pour éviter les suppressions non intentionnelles." },
            { text: "Donner à Nadia des permissions de Propriétaire pour qu'elle ne soit plus dépendante des groupes", correct: false, feedback: "Les permissions Propriétaire donnent un accès total incluant suppression du site et gestion des permissions — beaucoup trop de droits pour une utilisatrice standard. 'Membre' est le niveau approprié." },
            { text: "Partager directement le site avec l'adresse e-mail de Nadia via un lien de partage", correct: false, feedback: "Le partage direct crée une permission individuelle déconnectée du groupe de sécurité. Si le groupe est la méthode de gestion choisie, maintenir la cohérence en ajoutant Nadia au groupe — pas en créant une permission isolée difficile à maintenir." },
            { text: "Recréer le compte de Nadia dans Azure AD — son compte est corrompu", correct: false, feedback: "Recréer un compte est une mesure extrême non justifiée. Nadia accède à tous ses autres services M365 normalement — seul l'accès à ce site SharePoint est bloqué. C'est un problème de permissions du site, pas du compte." }
          ],
          hint: "Autorisations du site → 'Formation Membres' → 'Nouveau' → saisir nadia.bensalem@corp.local → Partager. Pour l'audit : admin.microsoft.com → Conformité → Audit → Activités SharePoint → 'Modification des membres du groupe' → filtrer sur les 48 dernières heures.",
          callerReply: "L'admin m'a réajoutée dans le groupe 'Formation Membres'. J'ai rafraîchi la page SharePoint et j'ai retrouvé l'accès complet à tous mes documents ! L'IT a trouvé dans le journal d'audit : un script de synchronisation AD avait vidé les groupes SharePoint liés à des OU modifiées. Ils corrigent le script."
        }
      ]
    },

    // --- Réseau: Pas d'accès réseau après déménagement de bureau ---
    {
      id: 'network-no-access-after-move',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Lucas Moreau',
      dept: 'Comptabilité',
      mood: 'confused',
      issue: 'Pas d\'accès réseau après déménagement de bureau — IP APIPA, aucune connexion',
      terminalContext: {
        hostname: 'PC-COMPTA-18', username: 'lucas.moreau',
        domain: 'CORP.LOCAL', ip: '169.254.44.12',
        apipa: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Lucas de la comptabilité. On a déménagé nos bureaux ce matin et depuis que j'ai rebranché mon PC dans le nouveau bureau, je n'ai plus accès au réseau. Internet ne marche pas, je ne peux pas accéder aux lecteurs réseau ni à mes fichiers." },
        { from: 'caller', text: "Mon collègue à côté de moi a le même problème. On a bien rebranché les câbles mais rien ne fonctionne. Est-ce qu'il y a quelque chose à faire pour activer le réseau dans les nouveaux bureaux ?" }
      ],
      steps: [
        {
          question: "PC sans réseau après déménagement, IP APIPA (169.254.x.x). Quelle est la première vérification ?",
          options: [
            { text: "Vérifier que le câble RJ45 est bien connecté au port mural et que le port de la carte réseau affiche des LEDs actives", correct: true, feedback: "Correct ! Après un déménagement, la cause la plus fréquente est une connexion physique défaillante : câble non cliqué jusqu'au bout dans le port mural, mauvais port utilisé, ou câble endommagé. L'IP APIPA confirme que le PC ne reçoit pas de réponse DHCP — soit le câble ne transmet pas le signal, soit le port switch n'est pas activé. Vérifiez d'abord le physique avant de diagnostiquer plus loin." },
            { text: "Réinstaller les pilotes de la carte réseau — le déménagement a perturbé les pilotes", correct: false, feedback: "Les pilotes réseau ne sont pas affectés par un déménagement physique. Une IP APIPA indique un problème de connectivité physique ou de configuration réseau, pas un problème logiciel de pilote." },
            { text: "Appeler l'opérateur internet — la ligne du nouveau bureau n'est pas activée", correct: false, feedback: "Le réseau interne d'entreprise (LAN) ne dépend pas de l'opérateur internet. Le problème est au niveau de la connectivité physique locale (câble, port switch) ou de la configuration réseau interne." },
            { text: "Configurer une IP statique — le serveur DHCP ne couvre pas les nouveaux bureaux", correct: false, feedback: "Configurer une IP statique sans diagnostic est risqué — vous risquez un conflit d'adresses. Et si le câble n'est pas connecté, une IP statique ne changera rien. Vérifiez d'abord la connexion physique." }
          ],
          hint: "Vérifiez le câble RJ45 côté PC (un clic distinctif lors de l'insertion) et côté prise murale. Regardez les LEDs de la carte réseau : verte = lien actif, orange = activité. Testez avec un autre câble si possible.",
          callerReply: "J'ai vérifié le câble — il est bien branché aux deux bouts et j'entends le clic. Mais les LEDs de la carte réseau sont complètement éteintes des deux côtés. Mon collègue a le même symptôme sur son poste."
        },
        {
          question: "Câbles corrects mais LEDs réseau éteintes sur les deux postes. Quelle est la cause probable et la solution ?",
          options: [
            { text: "Les ports switch associés aux nouvelles prises murales ne sont pas activés — contacter l'équipe réseau pour les activer dans la configuration du switch", correct: true, feedback: "Exact ! Dans un environnement d'entreprise, chaque port switch est souvent désactivé par défaut et doit être activé par l'équipe réseau lors d'une installation ou d'un déménagement. Sans signal sur le port switch, la carte réseau du PC ne voit aucun lien (LEDs éteintes). L'équipe réseau doit identifier les ports correspondant aux nouvelles prises murales et les activer dans l'interface de gestion du switch (interface CLI ou web)." },
            { text: "Les câbles muraux sont endommagés — les remplacer par de nouveaux câbles Cat6", correct: false, feedback: "Des câbles muraux endommagés dans plusieurs bureaux simultanément est peu probable après un déménagement simple. Les LEDs éteintes sur le switch (côté infrastructure) indiquent un port switch non activé, pas un câble endommagé." },
            { text: "Brancher les PC directement sur le switch core avec de longs câbles en attendant", correct: false, feedback: "Brancher directement sur le switch core est une solution de contournement non professionnelle qui peut perturber l'infrastructure. La bonne solution est d'activer les ports switch des nouvelles prises, ce qui prend quelques minutes." },
            { text: "Attribuer des adresses IP fixes manuellement pour contourner le problème DHCP", correct: false, feedback: "Même avec une IP statique, si les LEDs réseau sont éteintes (pas de lien physique), aucune communication réseau n'est possible. Le problème est au niveau du switch, pas du DHCP." }
          ],
          hint: "Communiquer à l'équipe réseau : le numéro des prises murales utilisées dans les nouveaux bureaux (inscrit sur la prise ou le patch panel). L'admin réseau active les ports correspondants sur le switch depuis l'interface de gestion (SSH ou HTTPS selon le modèle).",
          callerReply: "L'équipe réseau a activé les ports switch correspondant à nos nouvelles prises murales. Les LEDs sont maintenant allumées et on a récupéré une IP normale. Internet et les lecteurs réseau fonctionnent. Merci !"
        }
      ]
    },

    // --- Réseau: VPN instable — déconnexions fréquentes en télétravail ---
    {
      id: 'network-vpn-unstable',
      category: 'Réseau',
      level: 2,
      difficulty: 'medium',
      caller: 'Isabelle Renaud',
      dept: 'Direction',
      mood: 'frustrated',
      issue: 'VPN instable — déconnexions fréquentes en télétravail toutes les 30 minutes',
      terminalContext: {
        hostname: 'PC-DIR-ISABELLE', username: 'isabelle.renaud',
        domain: 'CORP.LOCAL', ip: '192.168.1.32'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Isabelle Renaud, Direction. Je suis en télétravail et mon VPN se déconnecte automatiquement toutes les 30 minutes environ. Chaque fois je dois me reconnecter, retaper mes identifiants et attendre. C'est insupportable pour travailler." },
        { from: 'caller', text: "Ça dure depuis 3 jours. Avant ça marchait très bien. Mes collègues aussi en télétravail n'ont aucun problème. Est-ce que c'est mon VPN ou ma connexion internet ?" }
      ],
      steps: [
        {
          question: "VPN se déconnecte toutes les 30 min, isolé à Isabelle. Comment distinguer un problème client d'un problème de connexion internet ?",
          options: [
            { text: "Demander à Isabelle de faire un test de stabilité de sa connexion internet (ping continu vers 8.8.8.8) pendant une session VPN pour mesurer les pertes de paquets", correct: true, feedback: "Correct ! Comme le problème est isolé à Isabelle (ses collègues n'ont pas ce problème), la cause est côté client, pas côté serveur VPN. Le ping continu vers une IP externe (ping -t 8.8.8.8) permet de mesurer la stabilité de sa connexion internet en temps réel. Des pertes de paquets ou des pics de latence avant chaque déconnexion VPN confirmeront une connexion internet instable comme cause racine." },
            { text: "Réinstaller le client VPN sur le poste d'Isabelle — l'installation est corrompue", correct: false, feedback: "Réinstaller le VPN sans diagnostic est prématuré. Si la connexion internet sous-jacente est instable, un nouveau client VPN se déconnectera aussi. Identifiez d'abord si le problème est la connexion internet ou le logiciel VPN." },
            { text: "Vérifier les logs du serveur VPN pour identifier pourquoi les sessions d'Isabelle sont coupées", correct: false, feedback: "Les logs serveur peuvent montrer les déconnexions mais pas leur cause côté client. Comme le problème est isolé à Isabelle, commencez par diagnostiquer côté client (stabilité internet) avant d'analyser le serveur." },
            { text: "Demander à Isabelle de désactiver son antivirus — il interfère avec le tunnel VPN", correct: false, feedback: "L'antivirus comme cause des déconnexions est peu probable si le VPN fonctionnait correctement avant. Sans diagnostic préalable, désactiver l'antivirus est une action à risque non justifiée." }
          ],
          hint: "Commande ping continu Windows : ping -t 8.8.8.8 (Ctrl+C pour arrêter). Observer les résultats pendant 5-10 minutes — noter les 'Request timed out' et les variations de latence. Un résultat normal : temps < 30ms, 0% perte.",
          terminalCommand: "ping -t 8.8.8.8",
          callerReply: "J'ai lancé le ping continu. Au bout de 20 minutes, j'ai eu une série de 'Request timed out' — 6 paquets perdus consécutifs — puis une déconnexion VPN immédiatement après. Le ping reprend ensuite normalement. Donc c'est bien ma connexion internet qui est instable."
        },
        {
          question: "Connexion internet instable avec pertes de paquets ponctuelles (6 paquets perdus). Quelles actions recommander à Isabelle ?",
          options: [
            { text: "Redémarrer la box internet (coupure 30s), vérifier le câble entre la box et le PC (passer en filaire si en Wi-Fi), et activer le keepalive VPN dans les paramètres du client pour reconnecter automatiquement", correct: true, feedback: "Procédure adaptée : 1) Redémarrage box — résout les micro-bugs de firmware fréquents sur les box résidentielles. 2) Câble filaire — le Wi-Fi domestique est plus sujet aux interférences et micro-coupures que l'Ethernet filaire. 3) Keepalive VPN — le client VPN (OpenVPN, Cisco AnyConnect, GlobalProtect) peut être configuré pour détecter la perte de connexion et se reconnecter automatiquement. Si le problème persiste, contacter le FAI pour un diagnostic de la ligne (bruit, affaiblissement)." },
            { text: "Demander à l'admin réseau de désactiver le timeout de session côté serveur VPN", correct: false, feedback: "Désactiver le timeout serveur n'empêchera pas les déconnexions liées à une coupure internet — si le tunnel TCP/IP est interrompu, le VPN se coupe quel que soit le timeout. Il faut traiter la cause (instabilité internet), pas le symptôme (déconnexion VPN)." },
            { text: "Basculer sur la connexion 4G du smartphone en partage de connexion pour plus de stabilité", correct: false, feedback: "Le partage 4G peut aider temporairement mais ce n'est pas une solution professionnelle à long terme — débit limité, coûts de data, latence variable. La bonne approche est de stabiliser la connexion fixe d'Isabelle." },
            { text: "Ouvrir un ticket auprès de l'opérateur pour changer d'abonnement internet", correct: false, feedback: "Changer d'abonnement est une décision disproportionnée sans d'abord tenter les actions simples (redémarrage box, filaire). Épuisez les solutions rapides avant d'escalader vers l'opérateur." }
          ],
          hint: "Vérifier si Isabelle est en Wi-Fi ou filaire (ipconfig /all — chercher 'Adaptateur Wi-Fi' vs 'Adaptateur Ethernet'). Si Wi-Fi : lui demander de brancher un câble Ethernet directement sur la box. Redémarrage box : débrancher 30s puis rebrancher.",
          callerReply: "J'étais en Wi-Fi alors que ma box est à 2 mètres ! J'ai branché le câble Ethernet et redémarré la box. Depuis 2 heures le VPN n'a pas décroché une seule fois. Le ping ne montre plus aucune perte. Problème résolu ! Je ne pensais pas que le Wi-Fi pouvait causer ça."
        }
      ]
    },

    // --- Réseau: Proxy bloque l'accès à un site partenaire ---
    {
      id: 'network-proxy-blocking',
      category: 'Réseau',
      level: 2,
      difficulty: 'medium',
      caller: 'Franck Petit',
      dept: 'Production',
      mood: 'frustrated',
      issue: 'Proxy bloque l\'accès au site partenaire fournisseur — erreur 403 Forbidden',
      terminalContext: {
        hostname: 'PC-PROD-11', username: 'franck.petit',
        domain: 'CORP.LOCAL', ip: '192.168.1.91'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Franck de la production. Je dois accéder au portail commandes de notre fournisseur Acier-Plus (acierplus-commandes.fr) pour passer une commande urgente, mais j'ai une page d'erreur 'Accès bloqué par la politique de sécurité réseau'. Mes collègues du bureau à côté ont le même blocage." },
        { from: 'caller', text: "Ce site marchait très bien hier. On nous dit que la production doit passer les commandes avant midi sinon on perd le créneau de livraison. C'est vraiment urgent." }
      ],
      steps: [
        {
          question: "Accès bloqué à un site partenaire avec message 'politique de sécurité réseau'. Comment confirmer que c'est le proxy d'entreprise qui bloque ?",
          options: [
            { text: "Lire le message d'erreur complet (page de blocage proxy avec nom de la catégorie bloquée) et vérifier si d'autres sites similaires sont accessibles", correct: true, feedback: "Correct ! Une page de blocage proxy d'entreprise (Squid, Fortinet, Zscaler) affiche généralement le nom du proxy, la catégorie bloquée (ex: 'Finance', 'Uncategorized', 'Shopping') et l'URL bloquée. Si le message mentionne explicitement une politique réseau avec ces détails, c'est bien le proxy. Vérifier si d'autres sites partenaires sont accessibles confirme que le blocage est spécifique à cette URL." },
            { text: "Désactiver l'antivirus et réessayer — il bloque parfois les sites HTTPS", correct: false, feedback: "Un antivirus ne génère pas de page 'politique de sécurité réseau' — c'est la signature d'un proxy d'entreprise. Désactiver l'antivirus sans raison expose le poste inutilement." },
            { text: "Appeler le partenaire Acier-Plus pour savoir si leur site est en maintenance", correct: false, feedback: "Si le message provient du réseau de l'entreprise ('politique de sécurité réseau'), le site partenaire n'est pas en cause. Vérifiez d'abord que le blocage vient du proxy interne avant de contacter l'externe." },
            { text: "Changer le serveur DNS dans les paramètres réseau du PC pour contourner le blocage", correct: false, feedback: "Le proxy d'entreprise filtre le trafic HTTP/HTTPS indépendamment du DNS — changer le DNS ne contournera pas un proxy transparent ou explicitement configuré. De plus, modifier les paramètres DNS sans autorisation IT va à l'encontre des politiques de sécurité." }
          ],
          hint: "La page de blocage proxy Squid/Fortinet affiche typiquement : 'Access Denied', le nom de l'URL, la catégorie ('Uncategorized' pour un nouveau site partenaire), et souvent une adresse e-mail de contact IT pour demander un déblocage.",
          callerReply: "La page affiche exactement : 'Accès refusé — URL bloquée par Fortinet Web Filter. Catégorie : Uncategorized. URL : acierplus-commandes.fr'. C'est bien le proxy. Le site a changé d'URL récemment — l'ancienne URL était autorisée, la nouvelle ne l'est pas encore."
        },
        {
          question: "Confirmé : le proxy Fortinet bloque la nouvelle URL du site partenaire (catégorie 'Uncategorized'). Comment procéder correctement ?",
          options: [
            { text: "Ajouter l'URL acierplus-commandes.fr à la liste blanche du proxy Fortinet, documenter la demande de déblocage et informer l'utilisateur une fois effectif", correct: true, feedback: "Procédure correcte : 1) Validation — vérifier que le site est bien légitime (HTTPS valide, certificat correct, lié au partenaire connu). 2) Déblocage — dans Fortinet Web Filter (ou proxy utilisé) : ajouter l'URL à la whitelist ou à un groupe d'URLs autorisées pour le département Production. 3) Documentation — créer un ticket de demande de déblocage avec justification métier (partenaire fournisseur officiel). 4) Communication — informer Franck que l'accès sera disponible sous 5-10 min et lui demander de vider le cache du navigateur." },
            { text: "Désactiver le proxy pour tous les utilisateurs du département Production", correct: false, feedback: "Désactiver le proxy pour tout un département est disproportionné et crée une faille de sécurité majeure. Seule l'URL spécifique du partenaire légitime doit être whitelistée, pas toute la protection web." },
            { text: "Donner à Franck les credentials du compte proxy admin pour qu'il gère lui-même ses accès", correct: false, feedback: "Partager des credentials d'administration est une violation de sécurité grave. La gestion des listes blanches est une tâche IT qui doit rester sous contrôle de l'équipe réseau." },
            { text: "Configurer une exception de proxy uniquement dans le navigateur de Franck via les paramètres réseau", correct: false, feedback: "Une exception locale dans le navigateur contourne le proxy mais expose le poste aux risques (le proxy filtre aussi les menaces). De plus, si le proxy est transparent (forcé au niveau réseau), une exception navigateur ne fonctionnera pas." }
          ],
          hint: "Fortinet FortiGate : Policy & Objects → Web Filter Profile → URL Filter → sélectionner le profil appliqué → Add URLs → saisir acierplus-commandes.fr → Action : Allow. Ou via Fortinet Web Application Firewall selon la configuration. Vider le cache navigateur : Ctrl+Shift+Del.",
          callerReply: "L'IT a ajouté le site à la whitelist. J'ai vidé le cache et le portail Acier-Plus est maintenant accessible. J'ai pu passer la commande avant midi. Merci pour la réactivité !"
        }
      ]
    },

    // --- Réseau: Partage réseau \\SRV-FILES\RH inaccessible ---
    {
      id: 'network-shared-folder-unavailable',
      category: 'Réseau',
      level: 2,
      difficulty: 'medium',
      caller: 'Claire Petit',
      dept: 'Juridique',
      mood: 'frustrated',
      issue: 'Partage réseau \\\\SRV-FILES\\RH inaccessible — erreur d\'accès depuis ce matin',
      terminalContext: {
        hostname: 'PC-JURIDIQUE-03', username: 'claire.petit',
        domain: 'CORP.LOCAL', ip: '192.168.1.43'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Claire du juridique. Depuis ce matin je ne peux plus accéder au lecteur réseau \\\\SRV-FILES\\RH. J'ai le message 'Chemin réseau introuvable'. Hier soir ça marchait parfaitement. J'ai des dossiers urgents à récupérer pour une réunion dans 2 heures." },
        { from: 'caller', text: "Mes collègues du service juridique ont le même problème. Par contre j'arrive à accéder aux autres partages comme \\\\SRV-FILES\\Juridique sans problème. C'est uniquement le partage RH qui est inaccessible." }
      ],
      steps: [
        {
          question: "\\\\SRV-FILES\\RH inaccessible ('chemin réseau introuvable'), les autres partages du même serveur fonctionnent. Quelle est la première commande de diagnostic ?",
          options: [
            { text: "ping SRV-FILES — vérifier que le serveur de fichiers répond sur le réseau", correct: false, feedback: "Comme les autres partages du même serveur (\\\\SRV-FILES\\Juridique) fonctionnent, SRV-FILES est clairement accessible sur le réseau — un ping confirmerait quelque chose déjà su. Le problème est spécifique au partage RH : il faut vérifier si ce partage existe encore et si ses permissions sont correctes." },
            { text: "net use \\\\SRV-FILES\\RH — tenter de se connecter au partage et analyser le message d'erreur précis", correct: true, feedback: "Correct ! La commande net use tente d'établir la connexion au partage et retourne un message d'erreur précis : 'Chemin réseau introuvable' peut indiquer que le dossier partagé n'existe plus ou que son nom a changé ; 'Accès refusé' indiquerait un problème de permissions. Cette information guide la suite du diagnostic directement vers la cause." },
            { text: "Redémarrer le PC de Claire — le mapping réseau est peut-être corrompu", correct: false, feedback: "Si les autres partages du même serveur fonctionnent, le mapping réseau du PC est correct. Le problème est spécifique au partage RH sur le serveur, pas au PC client." },
            { text: "Ouvrir une session RDP sur SRV-FILES pour vérifier directement", correct: false, feedback: "Vérifier les partages depuis le serveur est une étape utile, mais la commande net use depuis le poste client donne d'abord l'erreur précise qui guide vers la bonne action — plus rapide avant d'accéder au serveur." }
          ],
          hint: "Dans CMD : net use \\\\SRV-FILES\\RH. L'erreur retournée est importante : 'Chemin réseau introuvable' (partage supprimé ou renommé), 'Accès refusé' (problème de droits), 'Hôte introuvable' (problème réseau). Chaque message pointe vers une cause différente.",
          terminalCommand: "net use \\\\SRV-FILES\\RH",
          callerReply: "Le message est : 'Erreur système 67 — Le nom réseau est introuvable'. J'ai vérifié dans l'Explorateur — le partage \\\\SRV-FILES\\RH n'apparaît plus dans la liste des partages du serveur. Il semble avoir disparu."
        },
        {
          question: "Le partage \\\\SRV-FILES\\RH n'existe plus sur le serveur. Comment investiguer et rétablir l'accès ?",
          options: [
            { text: "Se connecter à SRV-FILES, vérifier dans Gestion de l'ordinateur → Dossiers partagés si le partage RH a été supprimé ou renommé, et le recréer si le dossier physique existe encore", correct: true, feedback: "Procédure correcte : 1) Sur SRV-FILES : Gestion de l'ordinateur → Dossiers partagés → Partages — si 'RH' n'y est pas, le partage a été supprimé (accidentellement ou par maintenance). 2) Vérifier que le dossier physique C:\\Partages\\RH (ou équivalent) existe encore sur le disque. 3) Si oui : clic droit sur le dossier → Partager avec → Configuration avancée → créer le partage avec les mêmes permissions qu'avant (groupes AD : GRP-RH-Lecture, GRP-RH-Ecriture). 4) Documenter l'incident et identifier qui a supprimé le partage via les logs d'audit." },
            { text: "Créer un nouveau serveur de fichiers pour le département RH", correct: false, feedback: "Créer un nouveau serveur est une décision d'infrastructure majeure, disproportionnée pour recréer un partage supprimé. La restauration du partage sur SRV-FILES prend quelques minutes." },
            { text: "Mapper le partage avec une IP directe (\\\\192.168.1.50\\RH) pour contourner le problème de nom", correct: false, feedback: "Si le partage n'existe plus sur le serveur, le mapper avec une IP directe ne changera rien — 'Erreur système 67' indique que le partage lui-même n'existe plus, pas un problème de résolution de nom." },
            { text: "Demander aux utilisateurs RH d'envoyer leurs fichiers par e-mail en attendant", correct: false, feedback: "Partager des fichiers potentiellement confidentiels (données RH) par e-mail est une mauvaise pratique de sécurité et non-conforme RGPD. La restauration du partage réseau est la solution appropriée." }
          ],
          hint: "SRV-FILES → Gestion de l'ordinateur (compmgmt.msc) → Dossiers partagés → Partages. Pour recréer : clic droit sur le dossier physique → Propriétés → Partage → Partage avancé → cocher 'Partager ce dossier' → nommer 'RH' → Autorisations → ajouter les groupes AD appropriés.",
          callerReply: "L'admin a trouvé : le partage RH a été accidentellement supprimé lors d'une maintenance hier soir. Le dossier physique est intact. Il a recréé le partage avec les mêmes permissions. \\\\SRV-FILES\\RH est à nouveau accessible — tous mes dossiers sont là. Ouf !"
        }
      ]
    },

    // --- Réseau: Pas d'accès internet depuis la salle de conférence A ---
    {
      id: 'network-no-internet-conference',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Nadia Bensalem',
      dept: 'Formation',
      mood: 'stressed',
      issue: 'Pas d\'accès internet ni réseau depuis la salle de conférence A — réunion dans 20 min',
      terminalContext: {
        hostname: 'PC-CONF-A', username: 'nadia.bensalem',
        domain: 'CORP.LOCAL', ip: '169.254.12.5',
        apipa: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Nadia de la Formation. Je suis dans la salle de conférence A pour préparer une réunion qui commence dans 20 minutes. Le PC de la salle n'a aucun accès réseau, ni internet ni intranet. L'adresse IP affichée est 169.254.12.5." },
        { from: 'caller', text: "J'ai besoin de projeter des documents SharePoint et de démarrer une réunion Teams avec des participants externes. Est-ce qu'on peut régler ça rapidement ? La réunion est importante." }
      ],
      steps: [
        {
          question: "PC de salle de conférence sans réseau, IP APIPA (169.254.12.5). Quel est le diagnostic initial prioritaire ?",
          options: [
            { text: "Vérifier physiquement le câble RJ45 entre le PC et la prise murale, et regarder les LEDs de la carte réseau", correct: true, feedback: "Correct ! L'IP APIPA confirme que le PC n'a pas reçu de réponse DHCP — soit le câble n'est pas connecté, soit le port switch n'est pas actif. Dans une salle de conférence, le câble est souvent débranché entre les réunions. Vérification physique : câble bien cliqué dans la prise murale et dans le PC, LEDs de la carte réseau allumées (lien actif). C'est la vérification la plus rapide (30 secondes) avant tout diagnostic logiciel." },
            { text: "Redémarrer le PC de la salle — la session réseau est peut-être bloquée", correct: false, feedback: "Un redémarrage sans connexion physique active ne changera rien — si le câble n'est pas branché ou le port switch désactivé, le PC redémarré aura toujours une IP APIPA. Vérifiez d'abord le physique." },
            { text: "Configurer une IP statique manuellement pour contourner le problème DHCP", correct: false, feedback: "Configurer une IP statique sans lien réseau actif (LEDs éteintes) ne fonctionnera pas — si le câble ne transmet pas de signal, aucune configuration IP ne permettra la connexion. Vérifiez le physique en premier." },
            { text: "Utiliser le Wi-Fi de la salle à la place du câble", correct: false, feedback: "Basculer en Wi-Fi est un contournement acceptable en dernier recours, mais d'abord vérifiez la connexion filaire — le câble est peut-être simplement débranché, ce qui se règle en 5 secondes." }
          ],
          hint: "Chercher le câble RJ45 dans la salle (souvent posé sur la table ou dans un tiroir). Le brancher dans la prise murale RJ45 (souvent au mur ou dans la colonne centrale de la table). Vérifier les LEDs de la carte réseau du PC : si éteintes même avec le câble branché, le port switch est probablement désactivé.",
          callerReply: "J'ai trouvé le câble sous la table — il était débranché. Je l'ai rebranché dans la prise murale mais les LEDs de la carte réseau sont toujours éteintes. Le câble est bien cliqué des deux côtés."
        },
        {
          question: "Câble branché correctement mais LEDs réseau éteintes — pas de lien physique. Il reste 15 minutes avant la réunion. Quelle est l'action la plus rapide ?",
          options: [
            { text: "Contacter l'équipe réseau pour activer le port switch de la salle A en urgence, et en parallèle préparer le Wi-Fi comme solution de secours", correct: true, feedback: "Double action parallèle : 1) Urgence réseau — appeler l'équipe réseau (ou ouvrir un ticket prioritaire) pour activer le port switch de la salle de conférence A. Avec le numéro de la prise murale, l'admin réseau peut activer le port en 2-3 minutes depuis l'interface du switch. 2) Solution de secours simultanée — configurer le Wi-Fi entreprise sur le PC de salle pendant que le filaire est en cours d'activation. Pour une réunion Teams et SharePoint, le Wi-Fi est suffisant. La solution de secours garantit la réunion, le filaire sera disponible pour les prochaines utilisations." },
            { text: "Annuler la réunion — sans réseau filaire la salle n'est pas utilisable", correct: false, feedback: "Une réunion Teams + SharePoint peut parfaitement fonctionner via Wi-Fi. Annuler est disproportionné quand des solutions de secours existent. Gérez l'urgence immédiate avec le Wi-Fi pendant que le filaire est rétabli." },
            { text: "Attendre que l'équipe réseau intervienne sur site pour vérifier le câblage physique", correct: false, feedback: "Attendre une intervention sur site peut prendre 30 minutes ou plus — la réunion aura commencé. En parallèle du ticket réseau, activez immédiatement le Wi-Fi comme solution de continuité." },
            { text: "Remplacer le câble RJ45 — le câble actuel est défectueux", correct: false, feedback: "Si les LEDs sont éteintes avec un câble fonctionnel correctement branché, le problème est côté infrastructure (port switch désactivé), pas côté câble. Changer le câble ne changera rien." }
          ],
          hint: "Numéro de la prise murale : inscrit sur l'étiquette de la prise (ex: 'CONF-A-P01'). Wi-Fi : dans les paramètres réseau du PC → connecter au réseau Wi-Fi entreprise (CORP-WiFi) avec les identifiants AD. Appel réseau : numéro d'urgence IT affiché dans la salle ou sur le portail intranet.",
          callerReply: "J'ai appelé le réseau en urgence et connecté le PC en Wi-Fi en attendant. L'équipe réseau a activé le port switch en 3 minutes. La réunion a démarré à l'heure via Wi-Fi puis on a basculé sur le filaire. Tout s'est bien passé. Merci !"
        }
      ]
    },

    // --- Réseau: Accès lent au serveur de fichiers ---
    {
      id: 'network-slow-file-server',
      category: 'Réseau',
      level: 2,
      difficulty: 'medium',
      caller: 'Pierre Morel',
      dept: 'Logistique',
      mood: 'frustrated',
      issue: 'Accès très lent au serveur de fichiers SRV-FILES — ouverture des fichiers en 2-3 minutes',
      terminalContext: {
        hostname: 'PC-LOGISTIQUE-05', username: 'pierre.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.65'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Pierre de la logistique. Depuis ce matin, l'accès au serveur de fichiers est extrêmement lent. Pour ouvrir un fichier Excel sur \\\\SRV-FILES\\Logistique ça prend 2 à 3 minutes. Hier c'était instantané. Toute l'équipe est bloquée." },
        { from: 'caller', text: "On a des bons de commande urgents à traiter. J'ai vérifié la connexion réseau de mon PC — le ping vers le serveur est correct à 1ms. Mon débit internet est normal. Le problème semble venir du serveur lui-même." }
      ],
      steps: [
        {
          question: "Accès très lent à SRV-FILES (2-3 min par fichier), ping LAN normal. Comment localiser la cause côté serveur ?",
          options: [
            { text: "Se connecter à SRV-FILES et vérifier l'utilisation du CPU, de la RAM et surtout l'utilisation et l'espace disponible sur le disque hébergeant les partages", correct: true, feedback: "Correct ! Quand le réseau LAN est sain (ping ok) et que la lenteur affecte tous les utilisateurs du même serveur, la cause est interne au serveur. Les suspects prioritaires : disque saturé (> 90% = performances dégradées), fragmentation excessive du disque (HDD), CPU à 100% (autre processus), ou RAM insuffisante causant du swap. La vérification des ressources serveur (Gestionnaire des tâches ou Moniteur de ressources) donne une image instantanée." },
            { text: "Redémarrer SRV-FILES — un redémarrage résoudra la lenteur", correct: false, feedback: "Redémarrer un serveur de fichiers en production sans diagnostic coupe l'accès pour tous les utilisateurs et peut corrompre les fichiers ouverts. Identifiez d'abord la cause (disque, CPU, RAM) pour agir de façon ciblée." },
            { text: "Augmenter la bande passante du lien réseau entre le poste et SRV-FILES", correct: false, feedback: "Le ping à 1ms confirme que le réseau LAN est sain. La lenteur n'est pas due à la bande passante réseau mais à une ressource saturée côté serveur." },
            { text: "Désactiver les antivirus sur SRV-FILES pour libérer les ressources", correct: false, feedback: "Désactiver l'antivirus sur un serveur de fichiers expose l'infrastructure à des risques majeurs sans diagnostic préalable. Vérifiez d'abord les ressources (CPU, disque, RAM) avant d'envisager d'autres causes." }
          ],
          hint: "Sur SRV-FILES : Gestionnaire des tâches → onglet Performances → voir CPU, RAM, Disque. Si le disque est à 100% d'activité en permanence : vérifier l'espace libre (Explorateur → propriétés du lecteur) et le taux de fragmentation (defrag /a C:).",
          terminalCommand: "defrag /a C:",
          callerReply: "Je suis sur SRV-FILES. Le Gestionnaire des tâches montre : Disque D: (les partages) à 100% d'activité en permanence, espace libre = 6% sur 2 To. CPU et RAM sont normaux. Le disque est quasi plein et l'analyse defrag montre 34% de fragmentation."
        },
        {
          question: "Disque des partages à 94% d'utilisation et 34% de fragmentation. Quelles actions mener pour rétablir les performances ?",
          options: [
            { text: "Libérer de l'espace (supprimer les fichiers obsolètes, archiver les données anciennes), puis lancer la défragmentation, et mettre en place une surveillance régulière de l'espace disque", correct: true, feedback: "Procédure complète : 1) Libérer l'espace — identifier les gros fichiers inutiles (WinDirStat ou TreeSize sur le serveur), supprimer les doublons, archiver les fichiers anciens vers un stockage de second niveau. Objectif : descendre sous 80% d'utilisation. 2) Défragmentation — defrag D: /U /V (uniquement pour HDD, pas pour SSD — la défragmentation d'un SSD est inutile et réduit sa durée de vie). 3) Surveillance — configurer une alerte PRTG/Zabbix/WMI sur l'espace disque (alerte à 80%, critique à 90%)." },
            { text: "Reformater le disque pour supprimer la fragmentation", correct: false, feedback: "Reformater efface toutes les données du serveur de fichiers — catastrophique. La défragmentation et le nettoyage de l'espace libre sont les actions correctes, sans perte de données." },
            { text: "Migrer immédiatement tous les données vers un nouveau serveur avec plus d'espace", correct: false, feedback: "Une migration complète est une décision d'infrastructure planifiée, pas une action d'urgence pour un problème de performances. Les actions immédiates (nettoyage + defrag) résoudront la lenteur dans l'heure." },
            { text: "Activer la compression de disque Windows pour gagner de l'espace sans supprimer de fichiers", correct: false, feedback: "La compression NTFS augmente la charge CPU pour chaque lecture/écriture — sur un serveur de fichiers déjà sous pression, cela aggraverait la situation. Le nettoyage des fichiers obsolètes est la solution appropriée." }
          ],
          hint: "WinDirStat ou TreeSize Free sur SRV-FILES identifie rapidement les dossiers volumineux. Archivage : copier les fichiers de plus de 3 ans vers \\\\SRV-ARCHIVE\\. Défragmentation HDD : defrag D: /U /V (uniquement si HDD, vérifier dans Gestionnaire des disques : 'Disque dur' vs 'Disque SSD').",
          callerReply: "J'ai trouvé 180 Go de fichiers vidéo de réunions datant de 2022 qui n'avaient jamais été archivés. Supprimés après accord RH. Défragmentation en cours — déjà 12% de progression. Les accès sont redevenus normaux dès que l'espace libre a dépassé 15%. Merci !"
        }
      ]
    },

    // --- Réseau: RDP impossible vers le serveur applicatif ---
    {
      id: 'network-rdp-impossible',
      category: 'Réseau',
      level: 2,
      difficulty: 'medium',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'concerned',
      issue: 'RDP impossible vers le serveur applicatif SRV-APP01 — connexion refusée',
      terminalContext: {
        hostname: 'PC-IT-ADMIN', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.15'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est l'admin réseau. Depuis ce matin je ne peux plus me connecter en Bureau à distance (RDP) sur le serveur applicatif SRV-APP01 (192.168.1.200). J'obtiens l'erreur 'Impossible de se connecter à l'ordinateur distant'." },
        { from: 'caller', text: "SRV-APP01 répond au ping correctement. Le serveur tourne — les applications dessus sont accessibles par les utilisateurs via leur navigateur. C'est uniquement le RDP qui ne fonctionne plus. Il n'y a eu aucune intervention prévue sur ce serveur." }
      ],
      steps: [
        {
          question: "RDP refusé vers SRV-APP01, ping ok, services applicatifs fonctionnels. Comment vérifier si le port 3389 (RDP) est ouvert ?",
          options: [
            { text: "Test-NetConnection -ComputerName SRV-APP01 -Port 3389 (PowerShell) ou telnet SRV-APP01 3389 — vérifier si le port RDP répond", correct: true, feedback: "Correct ! Test-NetConnection est la commande PowerShell native pour tester la connectivité sur un port spécifique — elle indique 'TcpTestSucceeded : True' si le port est ouvert et 'False' si fermé. Cela distingue immédiatement entre un problème de service RDP (port fermé côté serveur) et un problème réseau/firewall entre le client et le serveur." },
            { text: "ping SRV-APP01 — vérifier la connectivité réseau de base", correct: false, feedback: "Le ping fonctionne déjà (ICMP ok). ping ne teste pas le port RDP (TCP 3389). Test-NetConnection avec le port 3389 est l'outil approprié pour diagnostiquer un problème RDP spécifique." },
            { text: "Redémarrer SRV-APP01 — le service RDP est peut-être bloqué", correct: false, feedback: "Redémarrer un serveur applicatif en production coupe tous les services et utilisateurs connectés, sans garantie de résoudre le problème. Identifiez d'abord si le port 3389 est ouvert ou fermé avant toute action impactante." },
            { text: "Réinstaller le client Bureau à distance sur le poste admin", correct: false, feedback: "Si d'autres serveurs RDP sont accessibles depuis ce poste, le client est fonctionnel. Le problème est spécifique à SRV-APP01 — c'est côté serveur qu'il faut investiguer." }
          ],
          hint: "PowerShell : Test-NetConnection -ComputerName 192.168.1.200 -Port 3389. Résultat : TcpTestSucceeded : True (port ouvert) ou False (port fermé/filtré). Alternative CMD : telnet 192.168.1.200 3389 (si Telnet est installé : écran noir = port ouvert, message d'erreur = port fermé).",
          terminalCommand: "Test-NetConnection -ComputerName SRV-APP01 -Port 3389",
          callerReply: "Test-NetConnection retourne TcpTestSucceeded : False. Le port 3389 est fermé sur SRV-APP01. Le service RDP tourne peut-être mais quelque chose bloque le port — probablement le pare-feu Windows."
        },
        {
          question: "Port 3389 fermé sur SRV-APP01. Comment identifier et corriger le blocage du pare-feu Windows ?",
          options: [
            { text: "Se connecter à SRV-APP01 (via console ou autre accès admin), vérifier le pare-feu Windows Defender et activer la règle entrante 'Bureau à distance (TCP-Entrée)'", correct: true, feedback: "Procédure correcte : 1) Accès au serveur — utiliser la console de virtualisation (VMware vSphere, Hyper-V), une connexion physique, ou un outil d'administration à distance alternatif (WMIC, PSExec, Windows Admin Center). 2) Pare-feu — Panneau de configuration → Pare-feu Windows Defender → Paramètres avancés → Règles de trafic entrant → chercher 'Bureau à distance (TCP-Entrée)' → vérifier si elle est activée. Si désactivée : clic droit → Activer la règle. 3) Vérifier aussi que le service 'Services Bureau à distance' est bien démarré (services.msc)." },
            { text: "Désactiver complètement le pare-feu Windows sur SRV-APP01 pour rétablir le RDP", correct: false, feedback: "Désactiver le pare-feu expose le serveur à tous les risques réseau — toutes les règles de filtrage seraient supprimées. L'action correcte est d'activer uniquement la règle RDP spécifique, pas de désactiver toute la protection." },
            { text: "Changer le port RDP de 3389 vers 3390 dans le registre Windows", correct: false, feedback: "Changer le port RDP est une mesure de sécurité optionnelle, pas une solution à un port bloqué. Si le pare-feu bloque 3389, il bloquera aussi 3390 si la règle n'est pas mise à jour. Activez d'abord la règle pare-feu existante." },
            { text: "Ouvrir le port 3389 dans le pare-feu réseau (firewall périmétrique)", correct: false, feedback: "Si d'autres serveurs RDP sur le même réseau sont accessibles depuis le même poste, le firewall périmétrique ne filtre pas sélectivement ce port. Le blocage est sur le pare-feu Windows local de SRV-APP01 — c'est là qu'il faut intervenir." }
          ],
          hint: "Depuis un autre accès admin (console VM ou PSExec) : netsh advfirewall firewall set rule name='Remote Desktop - User Mode (TCP-In)' new enable=yes. Ou via PowerShell distant : Invoke-Command -ComputerName SRV-APP01 -ScriptBlock { Enable-NetFirewallRule -DisplayName 'Remote Desktop*' }.",
          callerReply: "J'ai accédé via la console VMware. La règle 'Bureau à distance (TCP-Entrée)' était désactivée — une mise à jour de stratégie de sécurité l'avait désactivée automatiquement hier soir. Je l'ai réactivée. Test-NetConnection retourne maintenant True et le RDP fonctionne !"
        }
      ]
    },

    // --- Réseau: Wi-Fi — déconnexion automatique toutes les heures ---
    {
      id: 'network-wifi-autodisconnect',
      category: 'Réseau',
      level: 1,
      difficulty: 'medium',
      caller: 'Karim Mansouri',
      dept: 'Commercial',
      mood: 'annoyed',
      issue: 'Wi-Fi — déconnexion automatique toutes les heures, reconnexion manuelle nécessaire',
      terminalContext: {
        hostname: 'PC-COMM-09', username: 'karim.mansouri',
        domain: 'CORP.LOCAL', ip: '192.168.1.79'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Karim du commercial. Mon Wi-Fi se coupe automatiquement toutes les heures pile — exactement à l'heure ronde. Je dois cliquer sur le Wi-Fi pour me reconnecter à chaque fois. C'est très perturbant en pleine réunion Teams ou pendant une démonstration client." },
        { from: 'caller', text: "Mes collègues proches de moi n'ont pas ce problème. Ça dure depuis une semaine. J'ai essayé de redémarrer le PC mais ça ne change rien — la déconnexion revient toujours exactement à l'heure suivante." }
      ],
      steps: [
        {
          question: "Wi-Fi se déconnecte exactement à l'heure ronde, isolé à Karim. Quelle est la cause la plus probable ?",
          options: [
            { text: "Paramètre d'économie d'énergie de l'adaptateur Wi-Fi — Windows coupe l'adaptateur après une période d'inactivité réseau perçue", correct: true, feedback: "Correct ! Windows peut configurer l'adaptateur réseau pour se couper afin d'économiser de l'énergie — ce comportement est particulièrement marqué sur les laptops avec le plan d'alimentation 'Économie d'énergie'. La déconnexion régulière et précise (à l'heure) est caractéristique d'un timer d'économie d'énergie, pas d'un problème réseau aléatoire." },
            { text: "Problème du point d'accès Wi-Fi — il déconnecte les clients inactifs", correct: false, feedback: "Si le point d'accès déconnectait les clients inactifs, tous les utilisateurs proches auraient le même problème à la même heure. Comme le problème est isolé à Karim, la cause est dans la configuration locale de son poste." },
            { text: "Interférence radio sur le canal Wi-Fi utilisé — changer le canal résoudrait le problème", correct: false, feedback: "Les interférences radio provoquent des déconnexions aléatoires et erratiques, pas des déconnexions précises à l'heure ronde. La régularité de la déconnexion pointe vers un timer logiciel, pas une cause radio." },
            { text: "Pilote de la carte Wi-Fi obsolète — une mise à jour résoudrait les déconnexions", correct: false, feedback: "Un pilote obsolète peut causer des problèmes de stabilité, mais pas des déconnexions aussi régulières et précises. Le paramètre d'économie d'énergie est la cause la plus probable pour une déconnexion toutes les heures exactement." }
          ],
          hint: "Vérifier le plan d'alimentation actuel : Panneau de configuration → Options d'alimentation. Si 'Économie d'énergie' est sélectionné, c'est probablement la cause. Le paramètre spécifique à modifier est dans le Gestionnaire de périphériques → carte Wi-Fi → Propriétés → Gestion de l'alimentation.",
          callerReply: "Intéressant — je vois dans les Options d'alimentation que mon PC est sur le plan 'Économie d'énergie'. C'est peut-être ça qui coupe le Wi-Fi. Comment désactiver ça spécifiquement pour l'adaptateur Wi-Fi ?"
        },
        {
          question: "Plan d'alimentation 'Économie d'énergie' actif. Comment désactiver l'extinction automatique de l'adaptateur Wi-Fi ?",
          options: [
            { text: "Gestionnaire de périphériques → carte réseau Wi-Fi → Propriétés → onglet 'Gestion de l'alimentation' → décocher 'Autoriser l'ordinateur à éteindre ce périphérique pour économiser de l'énergie'", correct: true, feedback: "Parfait ! Ce paramètre par périphérique est indépendant du plan d'alimentation global — il indique à Windows de ne jamais couper l'adaptateur Wi-Fi pour économiser l'énergie, même en mode économie d'énergie. C'est la solution précise et ciblée. En complément, changer le plan d'alimentation vers 'Performances élevées' ou 'Équilibré' réduit aussi les coupures des autres périphériques." },
            { text: "Désactiver le mode veille du PC dans les Options d'alimentation", correct: false, feedback: "Le mode veille du PC est différent de l'extinction automatique de l'adaptateur réseau. Même avec la veille désactivée, Windows peut couper l'adaptateur Wi-Fi indépendamment via le paramètre de gestion de l'alimentation du périphérique." },
            { text: "Oublier le réseau Wi-Fi et le reconnecter — les paramètres de connexion sont corrompus", correct: false, feedback: "Oublier et reconnecter le réseau n'affecte pas les paramètres d'alimentation de l'adaptateur. La déconnexion se reproduira exactement de la même façon après la reconnexion." },
            { text: "Passer en connexion filaire Ethernet pour éviter les déconnexions Wi-Fi", correct: false, feedback: "Un câble Ethernet est une solution de contournement, pas une résolution du problème. Le paramètre d'économie d'énergie peut être corrigé en quelques clics sans changer les habitudes de travail de Karim." }
          ],
          hint: "Gestionnaire de périphériques (devmgmt.msc) → Cartes réseau → double-clic sur la carte Wi-Fi (Intel, Realtek, etc.) → onglet 'Gestion de l'alimentation' → décocher la case → OK. Tester en attendant l'heure suivante ou en forçant le plan 'Performances élevées'.",
          callerReply: "J'ai décoché la case dans la Gestion de l'alimentation et changé le plan vers 'Équilibré'. Ça fait maintenant 2 heures et le Wi-Fi n'a pas décroché une seule fois ! Je peux enfin faire mes réunions Teams sans interruption. Merci !"
        }
      ]
    },

    // --- AD/GPO: Compte AD désactivé par erreur lors d'un départ ---
    {
      id: 'ad-account-disabled-by-error',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Responsable RH',
      dept: 'Ressources Humaines',
      mood: 'alarmed',
      issue: 'Compte AD désactivé par erreur lors d\'un traitement de départ — collaborateur actif bloqué',
      terminalContext: {
        hostname: 'PC-RH-03', username: 'responsable.rh',
        domain: 'CORP.LOCAL', ip: '192.168.1.53'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est le responsable RH. Sophie Lemaire du marketing m'appelle en urgence — elle ne peut plus se connecter à son PC ce matin. Elle obtient le message 'Votre compte a été désactivé, veuillez contacter votre administrateur'." },
        { from: 'caller', text: "On a traité hier le départ d'un autre employé du marketing. Je pense qu'on a désactivé le mauvais compte par erreur. Sophie est bien en poste et ne doit pas partir. Il faut débloquer ça rapidement." }
      ],
      steps: [
        {
          question: "Compte utilisateur désactivé par erreur probable. Comment confirmer rapidement et identifier la cause ?",
          options: [
            { text: "Dans Active Directory Utilisateurs et Ordinateurs, localiser sophie.lemaire et vérifier si le compte est désactivé, puis consulter le journal d'audit (ID 4725) pour confirmer la désactivation accidentelle", correct: true, feedback: "Correct ! ADUC affiche immédiatement l'état d'un compte (icône avec flèche vers le bas = désactivé). Le journal de sécurité Windows (Observateur d'événements → Sécurité → ID 4725 'Un compte d'utilisateur a été désactivé') enregistre qui a désactivé le compte et à quelle heure — ce qui confirme l'erreur lors du traitement du départ d'hier. La consultation des logs avant d'agir est essentielle pour documenter l'incident." },
            { text: "Créer un nouveau compte pour Sophie Lemaire — plus rapide que de déboguer l'ancien", correct: false, feedback: "Créer un nouveau compte efface l'appartenance aux groupes AD, les permissions sur les partages, les droits SharePoint, les licences M365 associées — il faudrait tout reconfigurer. La réactivation du compte existant préserve toutes ces configurations." },
            { text: "Réinitialiser le mot de passe de Sophie — c'est peut-être un problème de mot de passe expiré", correct: false, feedback: "Le message 'Votre compte a été désactivé' est distinct du message 'Votre mot de passe a expiré'. Un compte désactivé ne peut pas se connecter du tout, quelle que soit la validité du mot de passe. Vérifiez l'état du compte dans ADUC." },
            { text: "Demander à Sophie de se connecter sur un autre PC — le problème est peut-être lié à son poste", correct: false, feedback: "Le message 'compte désactivé' est retourné par le contrôleur de domaine lors de l'authentification — il est indépendant du poste utilisé. Sophie aurait le même message sur n'importe quel PC du domaine." }
          ],
          hint: "ADUC (dsa.msc) → Trouver → saisir 'sophie.lemaire' → le compte avec une icône grisée/flèche bas = désactivé. Clic droit → Activer le compte. Pour l'audit : Observateur d'événements sur DC01 → Sécurité → filtrer ID 4725 → voir 'Sujet' (qui a désactivé) et 'Compte cible' (sophie.lemaire).",
          callerReply: "Confirmé dans ADUC — sophie.lemaire a une flèche vers le bas, compte désactivé. Le journal d'audit ID 4725 montre que c'est admin.it qui l'a désactivée hier à 17h23, juste avant de désactiver le vrai compte de départ. Il a désactivé deux comptes au lieu d'un. Comment réactiver ?"
        },
        {
          question: "Désactivation accidentelle confirmée. Comment réactiver le compte et prévenir ce type d'erreur ?",
          options: [
            { text: "Réactiver le compte sophie.lemaire dans ADUC, vérifier que ses groupes et permissions sont intacts, et mettre en place une procédure de départ avec double vérification", correct: true, feedback: "Procédure complète : 1) Réactivation — ADUC → sophie.lemaire → clic droit → Activer le compte (le compte retrouve immédiatement son état normal, y compris tous ses groupes et permissions). 2) Vérification — confirmer que tous les groupes AD sont présents et que la licence M365 est active. 3) Prévention — la procédure de départ doit inclure : vérification du nom complet avant désactivation, liste des opérations à effectuer avec validation par une seconde personne, et test de connexion du compte sortant dans un environnement de test avant désactivation définitive." },
            { text: "Réactiver le compte et l'isoler dans une OU spéciale de quarantaine par précaution", correct: false, feedback: "Mettre Sophie en quarantaine est injustifié — la désactivation était une erreur administrative, pas un incident de sécurité lié à son compte. Elle doit retrouver un accès normal immédiatement." },
            { text: "Attendre l'accord de la direction avant de réactiver — c'est une décision sensible", correct: false, feedback: "Un collaborateur actif est bloqué depuis ce matin — l'urgence opérationnelle justifie la réactivation immédiate sur confirmation du responsable RH (qui appelle justement pour ça). L'escalade a déjà eu lieu." },
            { text: "Réactiver et forcer un changement de mot de passe à la prochaine connexion par mesure de sécurité", correct: false, feedback: "Forcer un changement de mot de passe n'est pas justifié pour une désactivation accidentelle — cela ajoute de la friction sans apport sécuritaire. Sophie n'a pas fait l'objet d'un incident de sécurité." }
          ],
          hint: "ADUC → sophie.lemaire → clic droit → Activer le compte. Sophie peut se reconnecter immédiatement. Pour vérifier les groupes : onglet 'Membre de' dans les propriétés du compte. Documenter l'incident dans le système de tickets et mettre à jour la procédure de départ.",
          callerReply: "Compte réactivé ! Sophie peut se connecter à nouveau. J'ai vérifié ses groupes AD — tous sont intacts. On a mis en place une checklist de départ avec la règle : vérifier le nom exact 2 fois avant toute désactivation, et avoir un superviseur qui valide. Merci pour la rapidité."
        }
      ]
    },

    // --- AD/GPO: Politique de mot de passe — complexité non respectée ---
    {
      id: 'ad-password-policy-weak',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'concerned',
      issue: 'Politique de mot de passe AD insuffisante — audit révèle des mots de passe non conformes',
      terminalContext: {
        hostname: 'DC01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.1'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est l'admin réseau. Suite à un audit de sécurité interne, on a découvert que la politique de mot de passe du domaine est très faible : minimum 6 caractères, pas de complexité requise, pas d'historique. Plusieurs comptes ont des mots de passe triviaux comme 'Bonjour1'." },
        { from: 'caller', text: "Le RSSI exige qu'on renforce cette politique avant la fin de la semaine. On a aussi besoin d'une politique plus stricte pour les comptes administrateurs (minimum 16 caractères) sans impacter les utilisateurs standards. Comment procéder ?" }
      ],
      steps: [
        {
          question: "Politique de mot de passe domaine insuffisante. Comment vérifier la configuration actuelle et identifier les paramètres à modifier ?",
          options: [
            { text: "Get-ADDefaultDomainPasswordPolicy (PowerShell) ou ouvrir la Default Domain Policy dans l'éditeur de GPO → Paramètres de sécurité → Stratégies de comptes → Stratégie de mot de passe", correct: true, feedback: "Correct ! La commande Get-ADDefaultDomainPasswordPolicy affiche tous les paramètres de la politique de mot de passe du domaine : longueur minimale, complexité, historique, durée de validité, durée de blocage. L'éditeur de GPO permet de les modifier dans la Default Domain Policy (la seule GPO pouvant définir la politique de mot de passe du domaine). Pour des politiques différentes par groupe (ex: admins vs utilisateurs), il faut utiliser les Fine-Grained Password Policies (PSO)." },
            { text: "Forcer immédiatement tous les utilisateurs à changer leur mot de passe — le changement forcé imposera les nouvelles règles", correct: false, feedback: "Forcer un changement de mot de passe sans d'abord renforcer la politique est inutile — les utilisateurs pourraient recréer le même mot de passe simple si les règles de complexité ne sont pas encore activées. Modifiez d'abord la politique, puis forcez le renouvellement." },
            { text: "Désactiver les comptes avec des mots de passe non conformes jusqu'à ce qu'ils les changent", correct: false, feedback: "Désactiver des comptes utilisateurs sans préavis est une mesure disproportionnée qui bloque l'accès au travail. La bonne approche est de renforcer la politique et de forcer un renouvellement au prochain changement." },
            { text: "Installer un outil de gestion de mots de passe tiers pour contourner la faiblesse AD", correct: false, feedback: "Un gestionnaire de mots de passe est un outil complémentaire utile, mais ne remplace pas la politique de mot de passe AD qui est la première ligne de défense. Renforcez d'abord la politique native AD." }
          ],
          hint: "PowerShell sur DC01 : Get-ADDefaultDomainPasswordPolicy | Format-List. Pour modifier : Group Policy Management → Default Domain Policy → Edit → Computer Configuration → Windows Settings → Security Settings → Account Policies → Password Policy.",
          terminalCommand: "Get-ADDefaultDomainPasswordPolicy",
          callerReply: "Résultat actuel : MinPasswordLength=6, ComplexityEnabled=False, PasswordHistoryCount=0, MaxPasswordAge=Never. C'est effectivement très insuffisant. Je dois passer à 12 caractères minimum, complexité activée, historique de 12 mots de passe. Et 16 caractères minimum pour les admins."
        },
        {
          question: "Il faut une politique standard (12 car.) et une politique renforcée pour les admins (16 car.). Comment implémenter les deux ?",
          options: [
            { text: "Modifier la Default Domain Policy pour la politique standard (12 car. + complexité + historique 12), puis créer une Fine-Grained Password Policy (PSO) pour les admins avec 16 car. et la lier au groupe 'Domain Admins'", correct: true, feedback: "Architecture correcte : 1) Default Domain Policy — s'applique à tous les utilisateurs du domaine. Paramètres recommandés : MinPasswordLength=12, ComplexityEnabled=True, PasswordHistoryCount=12, MaxPasswordAge=90 jours. 2) Fine-Grained Password Policy (PSO) — permet d'avoir une politique différente pour un groupe spécifique. Créer via 'Active Directory Administrative Center' → corp.local → System → Password Settings Container → New → Password Settings. Lier au groupe 'Domain Admins' avec une priorité plus haute (precedence plus basse en valeur) que la Default Domain Policy. 3) Forcer le renouvellement — mettre l'attribut pwdLastSet à 0 sur tous les comptes pour forcer un changement au prochain login." },
            { text: "Créer une GPO différente pour le groupe des admins et la lier à l'OU des admins", correct: false, feedback: "La politique de mot de passe AD ne peut être définie que dans la Default Domain Policy (liée à la racine du domaine) ou via les Fine-Grained Password Policies. Une GPO liée à une OU ne peut pas définir la politique de mot de passe — c'est une limitation fondamentale d'Active Directory." },
            { text: "Exiger des mots de passe de 20 caractères pour tous — plus simple à gérer qu'une double politique", correct: false, feedback: "Une politique unique trop restrictive pousse les utilisateurs à noter leurs mots de passe ou à utiliser des patterns prévisibles. L'approche Fine-Grained Password Policy permet d'adapter la rigueur au niveau de risque de chaque profil." },
            { text: "Activer Windows Hello pour tous et supprimer les mots de passe — solution moderne sans politique de mot de passe", correct: false, feedback: "Windows Hello est une excellente solution d'authentification moderne, mais nécessite un déploiement préparé (matériel compatible, configuration PKI ou Azure AD). Ce n'est pas une réponse immédiate à un audit de sécurité qui exige des actions avant la fin de la semaine." }
          ],
          hint: "Fine-Grained Password Policy : Active Directory Administrative Center (dsac.exe) → corp.local → System → Password Settings Container → New Password Settings. Definir Precedence=1 (priorité maximale), MinPasswordLength=16, appliquer au groupe 'Domain Admins'. La policy avec le Precedence le plus bas (valeur numérique) gagne.",
          callerReply: "Default Domain Policy mise à jour : 12 caractères, complexité, historique 12. PSO créée pour Domain Admins : 16 caractères, complexité renforcée. Tous les comptes auront un changement forcé au prochain login via pwdLastSet=0. L'audit de fin de semaine devrait valider la conformité."
        }
      ]
    },

    // --- AD/GPO: GPO de restriction — utilisateur ne peut plus installer ---
    {
      id: 'ad-gpo-software-restriction',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Thomas Laurent',
      dept: 'Marketing',
      mood: 'frustrated',
      issue: 'GPO de restriction logicielle — impossible d\'installer un logiciel approuvé par le manager',
      terminalContext: {
        hostname: 'PC-MARKET-04', username: 'thomas.laurent',
        domain: 'CORP.LOCAL', ip: '192.168.1.54',
        gpoBroken: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Thomas du marketing. Mon manager m'a demandé d'installer le logiciel de retouche Canva Desktop pour un projet urgent. Quand je lance l'installateur, j'ai le message 'Cette installation a été bloquée par votre administrateur système'." },
        { from: 'caller', text: "J'ai l'accord écrit de mon manager par e-mail. Mes collègues du service commercial peuvent installer des logiciels sans problème. On travaille sur la même campagne et j'ai besoin de cet outil pour livrer les visuels avant demain." }
      ],
      steps: [
        {
          question: "Installation bloquée par la politique système sur le poste Marketing. Comment identifier la GPO responsable ?",
          options: [
            { text: "gpresult /r sur le poste pour voir les GPO appliquées et identifier la politique de restriction logicielle active", correct: true, feedback: "Correct ! gpresult /r liste toutes les GPO appliquées sur le poste et l'utilisateur. Une politique de restriction logicielle (Software Restriction Policy ou AppLocker) apparaîtra dans les GPO actives. Le rapport détaillé (gpresult /h rapport.html) montre aussi les règles spécifiques bloquées. Cette information précise quelle GPO et quel niveau de restriction s'appliquent, ce qui guide vers la bonne action corrective." },
            { text: "Désactiver l'UAC (Contrôle de compte d'utilisateur) pour permettre l'installation", correct: false, feedback: "Le message 'bloqué par l'administrateur système' provient d'une GPO de restriction logicielle (SRP ou AppLocker), pas de l'UAC. Désactiver l'UAC n'aurait aucun effet sur une politique AppLocker ou SRP, et créerait une faille de sécurité." },
            { text: "Ajouter Thomas dans le groupe Administrateurs locaux pour contourner la restriction", correct: false, feedback: "Donner les droits admin locaux à un utilisateur standard pour contourner une politique de sécurité est une violation de la politique de sécurité informatique. De plus, AppLocker s'applique aussi aux administrateurs locaux si la règle est configurée ainsi." },
            { text: "Télécharger la version portable du logiciel pour éviter l'installateur", correct: false, feedback: "Les politiques AppLocker bloquent l'exécution des fichiers par chemin, hash ou éditeur — une version portable serait probablement aussi bloquée. De plus, contourner les politiques IT sans autorisation n'est pas acceptable même avec un accord managérial." }
          ],
          hint: "CMD en tant qu'admin : gpresult /r. Chercher dans la section 'UTILISATEUR' les GPO appliquées, notamment celles contenant 'Restriction', 'AppLocker', 'SRP' ou similaire. Pour le rapport HTML complet : gpresult /h C:\\gpo-rapport.html",
          terminalCommand: "gpresult /r",
          callerReply: "gpresult /r montre la GPO 'Marketing-AppLocker-Standard' dans les GPO utilisateur appliquées. Dans les détails, je vois une règle AppLocker qui bloque les installers (.exe, .msi) non signés par des éditeurs approuvés. Canva n'est pas dans la liste blanche."
        },
        {
          question: "GPO AppLocker 'Marketing-AppLocker-Standard' bloque Canva Desktop. Thomas a l'accord de son manager. Comment procéder correctement ?",
          options: [
            { text: "Valider l'accord manager, installer Canva en tant qu'admin IT sur le poste de Thomas, et soumettre une demande formelle pour ajouter l'éditeur Canva à la liste blanche AppLocker si le besoin est récurrent", correct: true, feedback: "Procédure correcte : 1) Validation — l'accord e-mail du manager suffit comme autorisation. Vérifier que Canva Desktop est bien un logiciel métier légitime (éditeur vérifié, sans malware connu). 2) Installation immédiate — se connecter sur PC-MARKET-04 avec le compte admin IT et lancer l'installateur. 3) Règle AppLocker long terme — si Canva sera utilisé régulièrement par Marketing, créer une règle AppLocker basée sur l'éditeur (Canva Pty Ltd) dans la GPO Marketing-AppLocker-Standard. Cela évite des interventions IT répétées pour chaque mise à jour." },
            { text: "Désactiver la GPO AppLocker pour tout le département Marketing pour débloquer Thomas", correct: false, feedback: "Désactiver AppLocker pour tout le département expose 30+ postes à l'installation non contrôlée de logiciels. Une action ciblée (installation admin unique ou règle d'éditeur) est la réponse proportionnée." },
            { text: "Refuser l'installation — la politique de sécurité prime sur l'accord managérial", correct: false, feedback: "La politique IT ne doit pas bloquer le business légitime. Un accord managérial formalisé justifie une exception ou une mise à jour de la liste blanche. Refuser sans alternative n'est pas une réponse constructive." },
            { text: "Demander à Thomas d'utiliser la version web de Canva à la place", correct: false, feedback: "Proposer la version web est acceptable comme solution de court terme si les fonctionnalités sont équivalentes, mais ce n'est pas la réponse à la demande d'installation. Si le manager a validé l'installation desktop pour des raisons précises, cette décision doit être respectée." }
          ],
          hint: "Installation admin : se connecter sur PC-MARKET-04 avec admin.it → runas /user:CORP\\admin.it cmd → lancer l'installateur Canva. Pour la règle AppLocker long terme : Group Policy Management → Marketing-AppLocker-Standard → Edit → AppLocker → Executable Rules → New Rule → Publisher → parcourir l'exe de Canva.",
          callerReply: "L'IT a installé Canva en admin sur mon poste. L'application fonctionne parfaitement. Ils ont aussi ajouté l'éditeur Canva à la liste blanche AppLocker — la prochaine mise à jour se fera automatiquement sans intervention IT. Merci pour la rapidité !"
        }
      ]
    },

    // --- AD/GPO 056 : Accès refusé dossier partagé — droits AD incorrects ---
    {
      id: 'ad-shared-folder-access-denied',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Pierre Morel',
      dept: 'Logistique',
      mood: 'frustrated',
      issue: 'Accès refusé sur le dossier partagé \\\\SRV-FICHIERS\\Logistique — depuis la réorganisation des OU',
      terminalContext: {
        hostname: 'PC-LOG-08', username: 'pierre.morel',
        domain: 'CORP.LOCAL', ip: '192.168.3.48',
        adGroupMissing: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Pierre Morel du service Logistique. Depuis hier matin je n'arrive plus à accéder au dossier partagé \\\\SRV-FICHIERS\\Logistique — j'ai un message 'Accès refusé'." },
        { from: 'caller', text: "Pourtant mes collègues y accèdent sans problème. Rien n'a changé de mon côté, mais l'IT a fait une réorganisation des OU vendredi soir." }
      ],
      steps: [
        {
          question: "Pierre obtient 'Accès refusé' sur un partage réseau accessible à ses collègues. Quelle est la première commande de diagnostic ?",
          options: [
            { text: "whoami /groups pour lister les groupes AD du compte de Pierre et identifier les groupes de sécurité actifs", correct: true, feedback: "Correct ! whoami /groups liste tous les groupes de sécurité auxquels appartient l'utilisateur connecté. Puisque ses collègues accèdent au partage et lui non, la différence est probablement dans l'appartenance à un groupe de sécurité AD qui conditionne l'accès. Cette commande donne une réponse immédiate sans quitter le poste." },
            { text: "Reformater le poste PC-LOG-08 et reconfigurer son accès réseau", correct: false, feedback: "Reformater pour un problème d'accès à un partage est totalement disproportionné. Le problème est clairement lié aux droits AD/NTFS, pas à une corruption système." },
            { text: "Supprimer et recréer le compte de Pierre dans Active Directory", correct: false, feedback: "Recréer un compte AD fait perdre toutes les appartenances aux groupes, les permissions, et les profils applicatifs — c'est l'approche la plus destructive possible. Identifier et corriger la cause (appartenance aux groupes) est la bonne démarche." },
            { text: "Mapper manuellement le lecteur réseau en spécifiant les credentials admin IT", correct: false, feedback: "Mapper le lecteur avec des credentials admin masquerait le problème sans le résoudre. Pierre accéderait aux fichiers sous une identité différente, ce qui est une violation des politiques de sécurité (traçabilité des accès)." }
          ],
          hint: "CMD : whoami /groups | findstr /i 'logistique' pour filtrer les groupes pertinents. Comparer avec un collègue qui accède : net user collegue.nom /domain pour voir ses groupes.",
          terminalCommand: "whoami /groups",
          callerReply: "whoami /groups affiché. Je vois les groupes habituels : GRP-Logistique-Equipe, GRP-Imprimantes-Bur3... mais je ne vois pas de groupe 'GRP-Logistique-Partage' que mes collègues ont peut-être. Comment vérifier ?"
        },
        {
          question: "Pierre n'a pas le groupe GRP-Logistique-Partage dans ses appartenances. Comment confirmer que c'est ce groupe qui donne accès au partage ?",
          options: [
            { text: "Sur SRV-FICHIERS, vérifier les permissions NTFS et de partage du dossier Logistique pour identifier GRP-Logistique-Partage comme groupe autorisé", correct: true, feedback: "Correct ! La vérification côté serveur est essentielle : icacls \\\\SRV-FICHIERS\\Logistique ou via l'Explorateur Windows (Propriétés → Sécurité + Partage) montrera exactement quels groupes AD ont des droits. Confirmer que GRP-Logistique-Partage est le groupe manquant avant de faire toute modification dans AD." },
            { text: "Donner directement à Pierre les droits NTFS 'Contrôle total' sur le dossier partagé", correct: false, feedback: "Attribuer des droits NTFS individuels contourne la gestion des groupes AD et crée une exception non documentée. Quand Pierre change de poste ou quitte la société, ses droits individuels resteront et ne seront pas nettoyés lors de la désactivation du compte. Les droits via groupes AD sont la norme." },
            { text: "Redémarrer le service Partage de fichiers sur SRV-FICHIERS pour forcer une réinitialisation des droits", correct: false, feedback: "Redémarrer le service de partage de fichiers n'a aucun effet sur les groupes AD ou les permissions NTFS — ces droits sont statiques. Ce serait une action inutile qui interromprait l'accès au partage pour tous les utilisateurs pendant le redémarrage." },
            { text: "Demander à Pierre de se déconnecter et se reconnecter pour recharger ses tokens Kerberos", correct: false, feedback: "La reconnexion rechargerait les tokens Kerberos, mais si Pierre n'est pas membre du groupe, il n'y sera toujours pas après reconnexion. La reconnexion est utile APRÈS avoir ajouté Pierre au groupe pour que les nouveaux droits soient pris en compte, pas avant." }
          ],
          hint: "Depuis un poste admin : icacls \\\\SRV-FICHIERS\\Logistique affiche les droits NTFS. Pour les droits de partage : Computer Management → Shared Folders → Shares → Logistique → Properties → Share Permissions.",
          callerReply: "J'ai vérifié avec l'admin IT : les permissions NTFS du dossier accordent le droit 'Modifier' au groupe CORP\\GRP-Logistique-Partage. Les droits de partage permettent à ce même groupe de lire/écrire. Pierre n'est effectivement pas membre de ce groupe — probablement perdu lors de la réorganisation des OU vendredi."
        },
        {
          question: "Pierre a perdu son appartenance à GRP-Logistique-Partage lors de la réorganisation des OU. Comment résoudre et prévenir la récurrence ?",
          options: [
            { text: "ADUC → GRP-Logistique-Partage → Membres → Ajouter Pierre Morel, puis demander à Pierre de se déconnecter/reconnecter pour recharger ses tokens Kerberos", correct: true, feedback: "Procédure complète : 1) Correction immédiate — ADUC → chercher GRP-Logistique-Partage → Membres → Ajouter → pierre.morel. 2) Application — Pierre doit se déconnecter et se reconnecter (ou verr+dév) pour que Windows demande un nouveau ticket Kerberos incluant le nouveau groupe. 3) Vérification — Pierre retente l'accès à \\\\SRV-FICHIERS\\Logistique. 4) Prévention — documenter que le déplacement d'OU peut impacter les appartenances aux groupes si les groupes sont organisés par OU ; vérifier les comptes déplacés vendredi et valider leurs appartenances aux groupes de ressources." },
            { text: "Recréer l'OU d'origine et y remettre Pierre pour restaurer automatiquement ses droits", correct: false, feedback: "Recréer une OU pour un utilisateur est disproportionné. L'appartenance aux groupes de sécurité AD n'est pas liée à la position dans l'OU — un utilisateur peut être dans n'importe quelle OU et être membre de n'importe quel groupe. Le mouvement d'OU peut avoir supprimé l'appartenance si des scripts de provisioning sont liés à l'OU, mais la correction est l'ajout au groupe, pas le déplacement d'OU." },
            { text: "Accorder à Pierre un accès admin local sur SRV-FICHIERS pour éviter les problèmes de droits AD", correct: false, feedback: "Donner des droits admin sur un serveur de fichiers pour contourner un problème de groupe AD est une violation grave des politiques de sécurité. Pierre aurait accès à tous les partages et fichiers système, pas seulement au dossier Logistique." },
            { text: "Modifier les permissions NTFS du dossier pour inclure le groupe 'Utilisateurs du domaine' — tous les employés pourront accéder", correct: false, feedback: "Ouvrir un dossier partagé à tous les utilisateurs du domaine supprime tout contrôle d'accès. Les données métier sensibles de la Logistique (stocks, fournisseurs, etc.) ne doivent pas être accessibles à l'ensemble de l'entreprise." }
          ],
          hint: "ADUC (dsa.msc) → Rechercher GRP-Logistique-Partage → Propriétés → Membres → Ajouter → taper pierre.morel → OK. Sur le poste de Pierre : Ctrl+Alt+Suppr → Se déconnecter → Se reconnecter. Puis \\\\SRV-FICHIERS\\Logistique dans l'Explorateur.",
          callerReply: "Pierre a été ajouté au groupe GRP-Logistique-Partage. Après déconnexion/reconnexion, il accède normalement au dossier partagé. On va vérifier tous les comptes déplacés vendredi pour s'assurer qu'aucun autre employé n'a le même problème. Merci !"
        }
      ]
    },

    // --- AD/GPO 055 : Utilisateur absent du groupe de sécurité VPN ---
    {
      id: 'ad-vpn-group-missing',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Karim Mansouri',
      dept: 'Commercial',
      mood: 'frustrated',
      issue: 'Connexion VPN impossible — accès refusé malgré identifiants corrects',
      terminalContext: {
        hostname: 'PC-COM-15', username: 'karim.mansouri',
        domain: 'CORP.LOCAL', ip: '192.168.4.15',
        vpnGroupMissing: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Karim du Commercial. Depuis ce matin je ne peux plus me connecter au VPN depuis chez moi — le client GlobalProtect s'authentifie mais affiche ensuite 'Accès refusé — vous n'êtes pas autorisé à utiliser ce service'." },
        { from: 'caller', text: "Mon mot de passe AD est correct, je me connecte normalement sur le réseau interne au bureau. J'ai des clients à appeler cet après-midi et mes fichiers sont sur le serveur..." }
      ],
      steps: [
        {
          question: "Karim s'authentifie mais reçoit 'Accès refusé' du VPN alors que ses credentials AD sont valides. Quelle est la cause la plus probable ?",
          options: [
            { text: "L'accès VPN est conditionné par l'appartenance à un groupe AD spécifique — Karim n'est probablement pas membre du groupe autorisé", correct: true, feedback: "Correct ! La majorité des serveurs VPN (GlobalProtect, RRAS, Cisco AnyConnect) utilisent des groupes AD pour contrôler qui peut se connecter. L'authentification AD réussit (credentials valides) mais l'autorisation VPN échoue (non membre du groupe). C'est le scénario classique : le groupe vérifie l'identité, le groupe de sécurité VPN vérifie l'autorisation." },
            { text: "Le certificat SSL du client VPN est expiré — le renouveler résoudra le problème", correct: false, feedback: "Un certificat expiré génère une erreur de type 'Certificate error' ou 'SSL handshake failed', pas un message 'Accès refusé'. Le message explicite indique un problème d'autorisation (qui a le droit de se connecter), pas d'authentification technique." },
            { text: "Reinstaller le client GlobalProtect sur le poste de Karim — un fichier de configuration est corrompu", correct: false, feedback: "Le client GlobalProtect fonctionne correctement (il contacte le serveur, s'authentifie, puis reçoit le refus du serveur). La réinstallation n'a aucun impact sur les droits d'accès AD. Le problème est côté serveur VPN / AD, pas côté client." },
            { text: "L'adresse IP de Karim est bloquée par le pare-feu — ajouter une exception pour son IP personnelle", correct: false, feedback: "Si l'IP de Karim était bloquée par le pare-feu, il n'arriverait pas du tout à contacter le serveur VPN — pas même l'étape d'authentification. Le message 'Accès refusé après authentification' indique que la connexion réseau fonctionne." }
          ],
          hint: "Sur le serveur VPN (ou dans les logs NPS/RADIUS) : Event Viewer → Security → chercher l'ID 6273 (Network Policy Server denied access). Le champ 'Reason Code' et 'Authentication Policy' indiquent si c'est un problème de groupe de sécurité.",
          callerReply: "D'accord, j'entends. Est-ce que vous pouvez vérifier dans Active Directory pourquoi j'aurais perdu l'accès ? J'ai le télétravail depuis 3 mois et ça a toujours fonctionné jusqu'à hier..."
        },
        {
          question: "Vous consultez ADUC pour vérifier les appartenances de Karim. Que cherchez-vous précisément ?",
          options: [
            { text: "Propriétés de karim.mansouri → Membre de → vérifier l'absence de 'GRP-VPN-Utilisateurs' (ou équivalent) dans la liste des groupes", correct: true, feedback: "Correct ! ADUC → Rechercher karim.mansouri → Propriétés → onglet 'Membre de'. La liste doit contenir le groupe autorisant l'accès VPN (souvent nommé GRP-VPN-Utilisateurs, VPN-Access, Remote-Workers, etc.). Son absence explique le refus. Vérifier aussi si le groupe a été renommé ou remplacé récemment." },
            { text: "Vérifier si le compte de Karim est verrouillé ou désactivé dans ADUC", correct: false, feedback: "Un compte verrouillé ou désactivé générerait une erreur 'Le compte est désactivé' ou 'Trop de tentatives de connexion', pas une connexion qui réussit l'authentification mais échoue à l'autorisation. De plus, Karim se connecte normalement au réseau interne au bureau." },
            { text: "Contrôler l'expiration du mot de passe de Karim — un mot de passe expiré bloque le VPN en premier", correct: false, feedback: "Karim confirme que son mot de passe AD est valide et qu'il se connecte au réseau interne. Un mot de passe expiré bloquerait toute authentification AD, pas uniquement le VPN." },
            { text: "Vérifier la politique Dial-in dans l'onglet 'Appel entrant' des propriétés du compte", correct: false, feedback: "L'onglet 'Appel entrant' dans ADUC (Dial-in tab) permet de définir des permissions VPN par compte individuel, mais les infrastructures modernes utilisent des Network Policies (NPS) basées sur des groupes AD plutôt que des permissions par compte. Vérifier les groupes est le bon réflexe dans un environnement de groupe." }
          ],
          hint: "ADUC (dsa.msc) → Rechercher → Entrer 'karim.mansouri' → Double-clic → Onglet 'Membre de'. Comparer avec un collègue commercial ayant accès au VPN (ex: net user collegue.nom /domain | findstr /i 'grp-vpn').",
          callerReply: "J'ai vérifié dans ADUC : Karim Mansouri n'est membre d'aucun groupe contenant 'VPN' dans son nom. Un collègue commercial avec accès VPN a le groupe 'GRP-VPN-Utilisateurs' dans ses appartenances. Karim en était probablement membre mais a perdu ce groupe lors d'une manipulation récente dans AD."
        },
        {
          question: "Karim n'est pas dans GRP-VPN-Utilisateurs alors qu'il est en télétravail régulier. Comment résoudre et fiabiliser le processus ?",
          options: [
            { text: "Ajouter Karim dans GRP-VPN-Utilisateurs via ADUC, lui demander de retenter la connexion VPN, et vérifier que le template de provisioning Commercial inclut ce groupe pour les nouveaux arrivants en télétravail", correct: true, feedback: "Procédure complète : 1) Correction immédiate — ADUC → GRP-VPN-Utilisateurs → Membres → Ajouter → karim.mansouri. 2) Test — Karim retente GlobalProtect immédiatement (pas besoin de déconnexion car il se connecte depuis l'extérieur). 3) Prévention — le fait que Karim ait perdu ce groupe après 3 mois d'usage indique une manipulation erronée dans AD (peut-être lors d'une réorganisation ou d'un script de nettoyage). Vérifier le template de provisioning pour les commerciaux en télétravail et documenter ce groupe comme obligatoire." },
            { text: "Créer un nouveau groupe 'GRP-VPN-Commercial' et configurer le serveur VPN pour accepter ce groupe", correct: false, feedback: "Créer un nouveau groupe VPN pour un seul utilisateur fragmente la gestion des accès. Si GRP-VPN-Utilisateurs existe déjà et est configuré dans la politique VPN/NPS, l'ajouter directement est la voie la plus simple et la moins risquée." },
            { text: "Accorder à Karim un accès VPN permanent via l'onglet 'Appel entrant' de son compte AD, sans passer par les groupes", correct: false, feedback: "Les permissions par compte individuel dans l'onglet 'Appel entrant' ne sont pas recommandées dans les environnements modernes — elles sont difficiles à auditer, à maintenir et contournent la gestion centralisée via groupes. Quand Karim changera de poste, ces droits individuels resteront actifs." },
            { text: "Demander à Karim de se connecter au bureau physiquement et d'utiliser un accès RDP vers son poste pour travailler", correct: false, feedback: "Demander à un télétravailleur de venir physiquement au bureau pour contourner un problème VPN est une non-solution. Cela démontre aussi une incompréhension du rôle du VPN. La correction dans AD est rapide et doit être la réponse." }
          ],
          hint: "ADUC → GRP-VPN-Utilisateurs → Propriétés → Membres → Ajouter → karim.mansouri → OK. Karim peut retenter immédiatement dans GlobalProtect. Vérifier les logs NPS dans Event Viewer (ID 6272 = accès accordé) pour confirmer.",
          callerReply: "Ajouté au groupe GRP-VPN-Utilisateurs. Je viens de retenter GlobalProtect — connexion établie ! J'ai accès à mes fichiers. On va documenter ce groupe comme obligatoire dans notre procédure de télétravail pour éviter que ça arrive à d'autres. Merci pour la rapidité !"
        }
      ]
    },

    // --- AD/GPO 054 : Impossible de réinitialiser le mot de passe — délégation AD manquante ---
    {
      id: 'ad-password-reset-denied',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'medium',
      caller: 'Sophie Laurent',
      dept: 'Ressources Humaines',
      mood: 'frustrated',
      issue: 'Impossible de réinitialiser le mot de passe d\'une employée via ADUC — accès refusé malgré délégation',
      terminalContext: {
        hostname: 'PC-RH-03', username: 'sophie.laurent',
        domain: 'CORP.LOCAL', ip: '192.168.2.31',
        delegationMissing: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, Sophie Laurent des Ressources Humaines. On a une délégation AD qui me permet normalement de réinitialiser les mots de passe des employés, mais là j'ai un 'Accès refusé' quand j'essaie avec Marie Dupont." },
        { from: 'caller', text: "Je réinitialise des mots de passe tous les jours sans problème, mais depuis que l'IT a réorganisé l'arborescence AD hier, ça bloque sur Marie spécifiquement. Elle ne peut pas travailler !" }
      ],
      steps: [
        {
          question: "Sophie a une délégation AD pour les réinitialisations de mots de passe mais obtient 'Accès refusé' uniquement pour Marie Dupont. Quelle est la cause la plus probable ?",
          options: [
            { text: "Marie Dupont a été déplacée dans une OU différente lors de la réorganisation — la délégation de Sophie ne couvre pas cette nouvelle OU", correct: true, feedback: "Correct ! Dans Active Directory, les délégations sont liées à des OU spécifiques. Si Marie a été déplacée dans une OU non couverte par la délégation de Sophie (ex: de OU=Employés vers OU=Direction), Sophie n'a plus les droits nécessaires sur ce nouvel emplacement. C'est la conséquence classique d'une réorganisation d'OU sans vérification des délégations." },
            { text: "Le mot de passe de Marie est protégé par un attribut 'Carte à puce requise' qui bloque la réinitialisation manuelle", correct: false, feedback: "L'attribut 'La carte à puce est requise' peut bloquer la connexion interactive mais n'empêche pas la réinitialisation du mot de passe par un admin ou délégué. L'erreur 'Accès refusé' dans ce contexte indique un problème de droits AD, pas un attribut de sécurité." },
            { text: "Sophie doit demander à la DSI de lui créer un compte admin de domaine pour effectuer cette opération", correct: false, feedback: "Créer un compte admin domaine pour des opérations RH courantes va à l'encontre du principe du moindre privilège. La délégation AD existe précisément pour permettre à des non-admins d'effectuer des tâches spécifiques sans droits globaux. Le problème est l'étendue de la délégation, pas son niveau." },
            { text: "Le compte de Marie Dupont est corrompu — supprimer et recréer le compte résoudra l'accès refusé", correct: false, feedback: "Un compte AD 'corrompu' est extrêmement rare et ne génère pas une erreur 'Accès refusé' côté admin. Cette erreur indique que l'opérateur (Sophie) n'a pas les droits sur cet objet AD, pas que l'objet lui-même est défaillant. Supprimer le compte ferait perdre toutes les appartenances aux groupes et les profils applicatifs." }
          ],
          hint: "Dans ADUC, clic droit sur le compte de Marie Dupont → Propriétés → Objet (onglet) → le Distinguished Name (DN) montre l'OU actuelle. Comparer avec l'OU originale où Sophie a la délégation.",
          callerReply: "Je viens de regarder dans ADUC : Marie Dupont est maintenant dans 'CORP.LOCAL/Direction/Cadres' alors qu'avant elle était dans 'CORP.LOCAL/Employés/RH'. La délégation que j'ai doit concerner l'OU Employés uniquement..."
        },
        {
          question: "Marie est dans OU=Direction/Cadres, hors du périmètre de délégation de Sophie. Comment confirmer précisément l'étendue de la délégation actuelle ?",
          options: [
            { text: "Ouvrir 'Délégation de contrôle' (Delegation of Control) sur l'OU Employés dans ADUC pour voir les entrées ACL configurées pour Sophie", correct: true, feedback: "Correct ! Pour voir les délégations : ADUC → clic droit sur l'OU Employés → Delegate Control... affiche l'assistant (mais ne montre pas bien les existantes). La méthode précise : clic droit OU Employés → Properties → Security → Advanced → filtrer sur sophie.laurent pour voir les ACE (Access Control Entries) et leur portée. Cela confirme que Sophie a les droits 'Réinitialiser le mot de passe' uniquement sur l'OU Employés et ses sous-OU." },
            { text: "Exécuter gpresult /r sur le poste de Sophie pour voir ses droits de délégation AD", correct: false, feedback: "gpresult /r affiche les GPO appliquées à un poste et à un utilisateur, pas les ACL AD ou les délégations. Les délégations AD sont des entrées dans les ACL des objets AD, visibles uniquement via ADUC (onglet Sécurité) ou PowerShell (Get-Acl 'AD:\\OU=Employés,...')." },
            { text: "Tester si Sophie peut réinitialiser le mot de passe d'un autre employé dans OU=Direction pour délimiter le problème", correct: false, feedback: "Tenter des opérations en dehors des droits normaux pour 'tester' n'est pas une approche professionnelle. Cela pourrait déclencher des alertes de sécurité ou modifier des objets involontairement. La vérification des ACL est non-destructive et précise." },
            { text: "Demander au DSI de réinitialiser le mot de passe de Marie en urgence pendant qu'on analyse le problème", correct: false, feedback: "Faire escalader une réinitialisation de mot de passe au DSI pour contourner le problème n'est pas une résolution — c'est un contournement qui laisse le problème intact. Si d'autres employés RH ont été déplacés dans OU=Direction, la même situation se reproduira." }
          ],
          hint: "PowerShell (admin) : Import-Module ActiveDirectory ; (Get-Acl 'AD:\\OU=Employés,DC=corp,DC=local').Access | Where-Object {$_.IdentityReference -like '*sophie*'} | Select IdentityReference, ActiveDirectoryRights, InheritanceType",
          callerReply: "L'admin IT a vérifié les ACL : Sophie a bien la délégation 'Réinitialiser le mot de passe' sur OU=Employés avec héritage sur les sous-OU. Mais OU=Direction est une OU distincte à la racine du domaine, sans lien d'héritage avec OU=Employés. La délégation ne s'applique donc pas à Direction."
        },
        {
          question: "La délégation de Sophie couvre OU=Employés mais pas OU=Direction où Marie a été déplacée. Quelle est la meilleure résolution ?",
          options: [
            { text: "Étendre la délégation de Sophie à OU=Direction/Cadres pour les réinitialisations de mots de passe, après validation par le RSSI que les RH ont le droit de gérer les comptes des cadres", correct: true, feedback: "Procédure correcte : 1) Validation métier — les RH ont-elles le droit de réinitialiser les mots de passe des cadres ? Cette décision appartient au RSSI et à la DRH, pas à l'IT seul. 2) Si validé — ADUC → clic droit OU=Direction → Delegate Control → ajouter sophie.laurent → 'Réinitialiser le mot de passe utilisateur et forcer le changement au prochain login'. 3) Alternative — si les cadres ne doivent pas être gérés par les RH, remettre Marie dans OU=Employés si c'est sa bonne position fonctionnelle. 4) Documentation — mettre à jour la matrice des délégations AD avec la nouvelle étendue." },
            { text: "Accorder à Sophie le rôle 'Account Operators' dans Active Directory pour qu'elle puisse gérer tous les comptes sans restriction d'OU", correct: false, feedback: "Le rôle Account Operators donne des droits étendus sur tous les comptes du domaine (création, modification, suppression), bien au-delà de la simple réinitialisation de mots de passe. C'est une violation grave du principe de moindre privilège. La délégation ciblée par OU est la bonne approche." },
            { text: "Créer un compte admin temporaire pour Sophie le temps que Marie soit replacée dans OU=Employés", correct: false, feedback: "Un compte admin temporaire sans date d'expiration et sans revue est une faille de sécurité courante. De plus, 'temporaire' devient souvent permanent. La solution structurelle (étendre la délégation ou corriger le placement de l'OU) est préférable." },
            { text: "Configurer une GPO sur OU=Direction pour permettre la délégation automatique aux comptes RH", correct: false, feedback: "Les GPO ne gèrent pas les délégations AD sur les objets utilisateur. Les GPO contrôlent la configuration des postes et des utilisateurs (politiques, logiciels, etc.). Les délégations AD sont des ACL sur les objets AD, configurées dans ADUC, pas via GPO." }
          ],
          hint: "ADUC → clic droit OU=Direction → Delegate Control → Next → Add → sophie.laurent → Next → 'Reset user passwords and force password change at next logon' → Finish. Pour vérifier : Get-Acl 'AD:\\OU=Direction,...' | Select -Expand Access | Where {$_.IdentityReference -like '*sophie*'}",
          callerReply: "Le RSSI a validé que les RH peuvent gérer les mots de passe des cadres. La délégation a été étendue à OU=Direction. Je viens de réinitialiser le mot de passe de Marie Dupont sans problème — elle peut se reconnecter. On va documenter toutes les délégations AD dans une matrice pour éviter ces surprises lors des prochaines réorganisations."
        }
      ]
    },

    // --- SERVER 079 : Espace disque critique sur SRV-FILES ---
    {
      id: 'server-disk-critical',
      category: 'Server',
      level: 2,
      difficulty: 'medium',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'calm',
      issue: 'Espace disque critique sur SRV-FILES — disque D: à 98%, alertes supervision déclenchées',
      terminalContext: {
        hostname: 'SRV-FILES', username: 'admin.it',
        domain: 'CORP.LOCAL', ip: '192.168.1.5',
        diskCritical: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, admin réseau. La supervision vient de déclencher une alerte critique : SRV-FILES, disque D: à 98% de capacité — seulement 4 Go libres sur 200 Go. Les utilisateurs signalent des erreurs en essayant de sauvegarder leurs fichiers." },
        { from: 'caller', text: "Ce disque héberge les partages réseau de toute l'entreprise. Si on atteint 100%, les services de fichiers vont tomber. Besoin d'une action rapide." }
      ],
      steps: [
        {
          question: "Le disque D: de SRV-FILES est à 98%. Quelle est la première commande pour identifier les dossiers/fichiers qui consomment le plus d'espace ?",
          options: [
            { text: "PowerShell : Get-ChildItem -Path D:\\ -Recurse -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 20 FullName, @{N='Mo';E={[math]::Round($_.Length/1MB,1)}}", correct: true, feedback: "Correct ! Cette commande PowerShell liste les 20 fichiers les plus volumineux avec leur chemin complet et taille en Mo — indispensable pour cibler les actions de nettoyage. L'option -ErrorAction SilentlyContinue évite les erreurs sur les dossiers système protégés. Alternative : du /s D:\\ (si installé) ou l'outil TreeSize Free pour une visualisation graphique. L'objectif est de comprendre QUI utilise l'espace avant de supprimer quoi que ce soit." },
            { text: "Supprimer immédiatement D:\\Temp et D:\\Recycle.Bin pour libérer de l'espace en urgence", correct: false, feedback: "Supprimer des dossiers sans analyse préalable est risqué. D:\\Temp peut contenir des fichiers temporaires de services actifs (SQL, IIS, backup en cours) dont la suppression peut corrompre des opérations en cours. L'analyse d'abord, la suppression ensuite." },
            { text: "Redémarrer SRV-FILES — le redémarrage libère automatiquement l'espace disque des fichiers temporaires", correct: false, feedback: "Redémarrer un serveur de fichiers en production interrompt l'accès aux partages pour tous les utilisateurs. De plus, un redémarrage ne libère que quelques dizaines de Mo (fichiers de pages, temp de session) — insuffisant face à un disque à 98%." },
            { text: "Ajouter immédiatement un disque virtuel supplémentaire et étendre le volume D: sans analyser la cause", correct: false, feedback: "Ajouter du stockage sans comprendre la cause revient à repousser le problème. Si des shadow copies VSS ou des logs non gérés remplissent le disque, ils continueront à consommer le nouvel espace. L'analyse de la consommation est la première étape." }
          ],
          hint: "PowerShell (admin sur SRV-FILES) : Get-ChildItem D:\\ -Recurse -EA SilentlyContinue | Group-Object DirectoryName | Sort-Object {($_.Group | Measure-Object Length -Sum).Sum} -Desc | Select -First 10 Name, @{N='Go';E={[math]::Round(($_.Group | Measure-Object Length -Sum).Sum/1GB,2)}}",
          terminalCommand: "Get-ChildItem -Path D:\\ -Recurse | Sort-Object Length -Descending | Select-Object -First 20 FullName",
          callerReply: "Analyse terminée. Le dossier D:\\Backups\\VSS_Snapshots occupe 152 Go à lui seul. En regardant de plus près, ce sont des shadow copies VSS qui se sont accumulées depuis 6 mois — aucune limite n'avait été configurée. Le dossier D:\\Partages (données utilisateurs) n'occupe que 38 Go."
        },
        {
          question: "152 Go de shadow copies VSS non limitées remplissent le disque. Comment identifier précisément les snapshots et libérer l'espace correctement ?",
          options: [
            { text: "vssadmin list shadows pour inventorier tous les snapshots, évaluer leur âge, puis vssadmin delete shadows /for=D: /oldest pour supprimer les plus anciens ou /all après validation", correct: true, feedback: "Procédure correcte : 1) Inventaire — vssadmin list shadows affiche chaque snapshot avec sa date de création et son volume. 2) Décision — garder les 2-3 derniers snapshots (utiles pour restauration récente), supprimer les anciens. vssadmin delete shadows /for=D: /oldest supprime le plus ancien. vssadmin delete shadows /for=D: /all supprime tout (à faire si les backups sont garantis par une autre solution). 3) Vérification — dir D: après suppression pour confirmer l'espace libéré. Note : la suppression VSS est immédiate et irréversible — confirmer qu'aucune restauration en cours ne dépend de ces snapshots." },
            { text: "Supprimer manuellement les fichiers du dossier D:\\System Volume Information avec l'Explorateur Windows", correct: false, feedback: "Le dossier System Volume Information contient les shadow copies VSS et est protégé par le système. Tenter de supprimer son contenu manuellement génère des erreurs d'accès refusé. De plus, supprimer des fichiers VSS de cette manière peut corrompre le VSS Writer et empêcher de futures sauvegardes." },
            { text: "Désactiver définitivement le service VSS (Volume Shadow Copy) sur SRV-FILES pour libérer l'espace", correct: false, feedback: "Désactiver VSS supprime la possibilité de restauration 'Versions précédentes' pour les utilisateurs ET empêche les outils de backup (Windows Server Backup, Veeam, etc.) de faire des sauvegardes cohérentes à chaud. La solution est de limiter l'espace VSS, pas de le supprimer." },
            { text: "Déplacer les shadow copies sur un autre volume en modifiant le chemin de stockage VSS", correct: false, feedback: "VSS ne permet pas de déplacer les snapshots existants — vssadmin resize shadowstorage permet de limiter l'espace futur. Les snapshots existants restent sur le volume d'origine. La suppression des anciens snapshots reste la seule option pour libérer l'espace immédiatement." }
          ],
          hint: "CMD (admin) : vssadmin list shadows /for=D: — liste tous les snapshots du volume D. Pour supprimer les plus anciens : vssadmin delete shadows /for=D: /oldest. Pour tout supprimer : vssadmin delete shadows /for=D: /all /quiet. Vérifier l'espace après : dir D:\\ | findstr 'octets libres'",
          terminalCommand: "vssadmin list shadows /for=D:",
          callerReply: "vssadmin list shadows montre 47 snapshots VSS, le plus ancien datant du 22 octobre. On a une solution de backup Veeam qui fait ses propres sauvegardes — ces snapshots VSS ne sont donc pas critiques. On va supprimer tous les snapshots avec /all. Ça libère 152 Go — le disque passe à 23% d'utilisation. Ouf !"
        },
        {
          question: "L'espace est libéré (23% d'utilisation). Comment empêcher que le disque se remplisse à nouveau par les shadow copies VSS ?",
          options: [
            { text: "Limiter l'espace VSS à 15% du volume avec vssadmin resize shadowstorage /for=D: /on=D: /maxsize=30GB, et configurer une alerte supervision à 80% pour anticiper la prochaine alerte", correct: true, feedback: "Double solution préventive : 1) Limite VSS — vssadmin resize shadowstorage /for=D: /on=D: /maxsize=30GB limite les snapshots à 30 Go (15% de 200 Go). Quand la limite est atteinte, VSS supprime automatiquement les snapshots les plus anciens. Ajuster selon la politique de rétention souhaitée. 2) Supervision — une alerte à 80% (160 Go) laisse 20% de marge pour analyser et agir avant une crise. La supervision à 95% comme dans ce scénario est trop tardive pour une action sereine. 3) Bonus — documenter dans la CMDB/wiki la configuration VSS de SRV-FILES et la procédure de nettoyage." },
            { text: "Planifier un script PowerShell pour supprimer tous les snapshots VSS chaque semaine automatiquement", correct: false, feedback: "Supprimer tous les snapshots chaque semaine annule complètement l'utilité du VSS — les utilisateurs ne pourraient restaurer des versions précédentes que dans la semaine. La limitation de l'espace maximum est la bonne approche : VSS gère automatiquement la rotation des snapshots dans la limite définie." },
            { text: "Désactiver la fonctionnalité 'Versions précédentes' dans les propriétés du partage pour que les utilisateurs ne créent plus de snapshots", correct: false, feedback: "Les utilisateurs ne créent pas directement les snapshots VSS — c'est le système (planificateur VSS, agents de backup) qui les crée. Désactiver l'affichage des versions précédentes dans le partage n'empêche pas la création de nouveaux snapshots." },
            { text: "Compresser le dossier D:\\Backups\\VSS_Snapshots avec la compression NTFS pour réduire l'espace utilisé", correct: false, feedback: "Les fichiers de shadow copies VSS (dans System Volume Information) sont déjà dans un format optimisé et ne sont pas compressibles de manière significative par NTFS. De plus, activer la compression NTFS sur un serveur de fichiers actif augmente la charge CPU lors de chaque accès aux fichiers." }
          ],
          hint: "CMD (admin) : vssadmin resize shadowstorage /for=D: /on=D: /maxsize=15% — fixe la limite à 15% du volume. Vérifier : vssadmin list shadowstorage. Pour la supervision : dans le gestionnaire de serveur ou votre outil de monitoring, créer une alerte 'Logical Disk % Free Space < 20' sur SRV-FILES.",
          callerReply: "Limite VSS configurée à 30 Go maximum sur D:. J'ai aussi ajusté les seuils de supervision : alerte jaune à 80%, rouge à 90%. On documente tout dans le wiki IT. Merci pour la méthodologie — on n'avait jamais configuré de limite VSS sur ce serveur depuis 2 ans !"
        }
      ]
    },

    // --- SERVER 080 : Certificat SSL expiré — intranet inaccessible ---
    {
      id: 'server-ssl-expired',
      category: 'Server',
      level: 2,
      difficulty: 'medium',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'calm',
      issue: 'Certificat SSL IIS expiré — intranet.corp.local inaccessible, erreur NET::ERR_CERT_DATE_INVALID',
      terminalContext: {
        hostname: 'SRV-INTRANET', username: 'admin.it',
        domain: 'CORP.LOCAL', ip: '192.168.1.10',
        sslExpired: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, admin réseau. Le site intranet (intranet.corp.local) est inaccessible depuis ce matin — tous les navigateurs affichent 'Votre connexion n'est pas privée, NET::ERR_CERT_DATE_INVALID'. Environ 80 utilisateurs ne peuvent plus accéder au portail RH et aux outils internes." },
        { from: 'caller', text: "On a une PKI interne (ADCS sur SRV-PKI). Le certificat SSL a dû expirer. Besoin de renouveler au plus vite." }
      ],
      steps: [
        {
          question: "L'erreur NET::ERR_CERT_DATE_INVALID indique un certificat SSL expiré. Quelle est la première vérification sur SRV-INTRANET ?",
          options: [
            { text: "IIS Manager → Sites → intranet.corp.local → Bindings → HTTPS → Edit → voir le certificat lié et sa date d'expiration", correct: true, feedback: "Correct ! IIS Manager est le point de vérification direct : dans les bindings HTTPS du site, on voit immédiatement quel certificat est lié et sa date d'expiration. Alternative en PowerShell : Get-ChildItem Cert:\\LocalMachine\\My | Where-Object {$_.Subject -like '*intranet*'} | Select Subject, NotAfter, Thumbprint. Cette commande montre tous les certificats de la machine avec leur date d'expiration — utile pour détecter d'autres certificats proches de l'expiration en même temps." },
            { text: "Redémarrer le service W3SVC (IIS) — le redémarrage force le rechargement du certificat", correct: false, feedback: "Redémarrer IIS n'a aucun effet sur un certificat expiré — le service rechargera le même certificat expiré. L'erreur ERR_CERT_DATE_INVALID est intrinsèque au certificat lui-même, pas à l'état du service." },
            { text: "Désactiver temporairement HTTPS et basculer le site en HTTP pour rétablir l'accès en urgence", correct: false, feedback: "Basculer en HTTP expose les communications intranet (credentials, données RH) en clair sur le réseau. Même en urgence, cette approche est une violation des bonnes pratiques de sécurité. Le renouvellement du certificat est rapide si la PKI interne est disponible." },
            { text: "Supprimer le certificat expiré du magasin Windows et redémarrer IIS pour qu'il génère automatiquement un nouveau certificat", correct: false, feedback: "IIS ne génère pas automatiquement de certificats SSL. Supprimer le certificat expiré sans avoir le nouveau en place rendrait le site définitivement inaccessible en HTTPS. La bonne séquence est : obtenir le nouveau certificat, puis remplacer l'ancien dans les bindings IIS." }
          ],
          hint: "IIS Manager (inetmgr) → connexion à SRV-INTRANET → Sites → intranet.corp.local → dans le panneau Actions → Bindings → sélectionner le binding HTTPS 443 → Edit → le champ SSL certificate montre le certificat actuel et sa date d'expiration.",
          terminalCommand: "Get-ChildItem Cert:\\LocalMachine\\My | Select Subject, NotAfter, Thumbprint",
          callerReply: "IIS confirme : le certificat 'intranet.corp.local' est expiré depuis hier à 23h59. Émis par notre CA interne 'CORP-CA' sur SRV-PKI. Le certificat avait une durée de 2 ans — personne n'avait configuré d'alerte d'expiration. On a la PKI interne disponible pour émettre un nouveau certificat."
        },
        {
          question: "Le certificat IIS est expiré, la PKI interne ADCS est disponible. Comment demander et obtenir le renouvellement via la PKI interne ?",
          options: [
            { text: "MMC → Certificats (ordinateur local) → Personnel → Certificats → clic droit → Toutes les tâches → Demander un nouveau certificat → sélectionner le modèle 'Serveur Web' → configurer le CN = intranet.corp.local", correct: true, feedback: "Procédure ADCS complète : 1) MMC → Fichier → Ajouter/Supprimer un composant logiciel → Certificats → Compte d'ordinateur → Ordinateur local. 2) Personnel → Certificats → clic droit → Toutes les tâches → Demander un nouveau certificat. 3) Stratégie d'inscription Active Directory → Suivant → Cocher 'Serveur Web' → cliquer sur 'Des informations supplémentaires sont nécessaires'. 4) Dans 'Objet', ajouter CN = intranet.corp.local ; dans 'Autre nom', ajouter DNS = intranet.corp.local et DNS = intranet (si accès via nom court). 5) Inscrire → le certificat est émis et installé dans le magasin Personnel de l'ordinateur." },
            { text: "Acheter un certificat SSL public auprès d'une autorité de certification externe (Let's Encrypt, DigiCert) pour remplacer le certificat ADCS", correct: false, feedback: "Un certificat public Let's Encrypt ou DigiCert nécessite une validation de domaine externe (intranet.corp.local n'est pas un FQDN public — la validation HTTP ou DNS Challenge est impossible). De plus, la PKI interne ADCS est précisément faite pour émettre des certificats pour les ressources internes, de façon gratuite et instantanée." },
            { text: "Créer un certificat auto-signé directement dans IIS Manager comme solution permanente", correct: false, feedback: "Un certificat auto-signé générerait la même erreur de sécurité dans tous les navigateurs des utilisateurs, car il n'est pas signé par une CA de confiance. Les postes du domaine font confiance à la PKI interne ADCS (le certificat racine est distribué via GPO) — un certificat ADCS sera accepté sans avertissement." },
            { text: "Exporter le certificat expiré, modifier sa date d'expiration avec OpenSSL et le réimporter dans IIS", correct: false, feedback: "Modifier la date d'expiration d'un certificat signé est impossible sans invalider sa signature cryptographique. Les certificats sont signés numériquement — toute modification du contenu (y compris la date) casse la signature et le certificat sera rejeté. Il faut obligatoirement émettre un nouveau certificat." }
          ],
          hint: "Sur SRV-INTRANET : Win+R → mmc → Fichier → Ajouter composant → Certificats → Compte d'ordinateur. Ou via PowerShell : Get-Certificate -Template WebServer -SubjectName 'CN=intranet.corp.local' -DnsName 'intranet.corp.local','intranet' -CertStoreLocation 'Cert:\\LocalMachine\\My'",
          callerReply: "Nouveau certificat émis par CORP-CA via MMC. Le certificat 'intranet.corp.local' est maintenant dans le magasin Personnel de l'ordinateur avec une validité de 2 ans. Il reste à l'associer au site IIS pour que les utilisateurs puissent y accéder."
        },
        {
          question: "Nouveau certificat ADCS émis et dans le magasin. Comment l'appliquer dans IIS et éviter la prochaine expiration non détectée ?",
          options: [
            { text: "IIS Manager → intranet.corp.local → Bindings → HTTPS 443 → Edit → sélectionner le nouveau certificat dans la liste → OK → puis configurer une alerte supervision sur l'expiration des certificats à J-30", correct: true, feedback: "Procédure complète : 1) Application IIS — inetmgr → Sites → intranet.corp.local → Bindings → sélectionner le binding HTTPS port 443 → Edit → SSL certificate → choisir le nouveau certificat dans la liste déroulante (il apparaît avec son CN et sa nouvelle date d'expiration) → OK. 2) Test immédiat — ouvrir https://intranet.corp.local dans un navigateur pour confirmer. 3) Nettoyage — supprimer l'ancien certificat expiré du magasin Personnel (MMC → Certificats → Personnel → supprimer l'ancien). 4) Prévention — configurer une alerte supervision : script PowerShell planifié qui vérifie NotAfter de tous les certificats IIS et envoie un mail à J-30 et J-7 avant expiration." },
            { text: "Redémarrer SRV-INTRANET — le redémarrage applique automatiquement le nouveau certificat au site IIS", correct: false, feedback: "Un redémarrage du serveur ne modifie pas les bindings IIS. Après redémarrage, IIS relira sa configuration et chargera le même certificat expiré qui était lié au site. La modification des bindings dans IIS Manager est obligatoire." },
            { text: "Supprimer l'ancien certificat expiré du magasin avant d'appliquer le nouveau dans IIS", correct: false, feedback: "Supprimer l'ancien certificat avant de changer le binding IIS rend le site inaccessible en HTTPS pendant la manipulation (IIS ne trouve plus le certificat lié). La bonne séquence : lier le nouveau certificat dans IIS d'abord, tester, puis supprimer l'ancien." },
            { text: "Exporter le nouveau certificat en .pfx et l'importer via l'interface web d'IIS pour éviter toute interruption", correct: false, feedback: "Le certificat est déjà dans le magasin Windows de la machine — IIS Manager l'accède directement sans export/import. L'export .pfx est utile pour déployer un certificat sur un autre serveur, pas pour l'appliquer sur le même serveur où il vient d'être émis." }
          ],
          hint: "IIS Manager → Sites → intranet.corp.local → Actions (droite) → Bindings → Type HTTPS, Port 443 → Edit → SSL certificate → dérouler et choisir le nouveau certificat → OK. Tester dans Firefox (clear cache : Ctrl+Shift+Del → vider le cache). PowerShell alert : Get-ChildItem Cert:\\LocalMachine\\My | Where {$_.NotAfter -lt (Get-Date).AddDays(30)} | Select Subject, NotAfter",
          callerReply: "Nouveau certificat lié dans IIS. Le site https://intranet.corp.local est accessible sans avertissement — les 80 utilisateurs ont retrouvé l'accès. On a configuré un script PowerShell planifié qui envoie un mail à l'équipe IT 30 jours avant l'expiration de tout certificat. Cette panne ne se reproduira plus !"
        }
      ]
    },

    // --- SÉCURITÉ: Phishing — identifiants saisis sur faux site ---
    {
      id: 'security-phishing-report',
      category: 'Sécurité',
      level: 1,
      difficulty: 'medium',
      caller: 'Thomas Perrin',
      dept: 'Achats',
      mood: 'panicked',
      issue: 'E-mail de phishing — utilisateur a cliqué et saisi ses identifiants bancaires',
      terminalContext: {
        hostname: 'PC-ACHATS-03', username: 'thomas.perrin',
        domain: 'CORP.LOCAL', ip: '192.168.1.83'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Thomas des Achats. Je viens de recevoir un e-mail qui ressemblait parfaitement à un message de ma banque. J'ai cliqué sur le lien et j'ai rentré mon identifiant et mon mot de passe avant de réaliser que l'URL n'était pas celle de ma banque." },
        { from: 'caller', text: "J'ai immédiatement fermé la page. Le site ressemblait exactement au site officiel, logo, couleurs, tout. Mais l'URL était du genre 'secure-bnp-verification.ru'. Qu'est-ce que je dois faire maintenant ?" }
      ],
      steps: [
        {
          question: "Thomas a saisi ses identifiants bancaires sur un site de phishing. Quelle est l'action la plus urgente ?",
          options: [
            { text: "Scanner le PC avec l'antivirus pour supprimer le malware de phishing", correct: false, feedback: "Le phishing classique ne dépose pas de malware via le formulaire — il vole les identifiants saisis. La menace immédiate est que l'attaquant utilise les identifiants bancaires, pas une infection locale du PC. Changez le mot de passe bancaire en priorité." },
            { text: "Changer immédiatement le mot de passe du compte bancaire depuis un autre appareil sain, puis contacter la banque pour signaler l'incident", correct: true, feedback: "Correct ! La priorité absolue est de changer le mot de passe avant que l'attaquant ne l'utilise — idéalement depuis un smartphone ou un autre PC non compromis. Contacter ensuite la banque pour signaler le phishing et demander une surveillance du compte. Chaque minute compte : les identifiants volés peuvent être revendus ou utilisés dans les minutes suivant la saisie." },
            { text: "Signaler l'e-mail comme spam dans Outlook et vider la corbeille", correct: false, feedback: "Signaler le spam est une bonne action, mais pas la priorité immédiate. Le mot de passe bancaire est peut-être déjà en train d'être utilisé par l'attaquant. Agissez sur le compte bancaire d'abord, signalez ensuite." },
            { text: "Reformater le PC — il est peut-être compromis par le site de phishing", correct: false, feedback: "Un simple clic sur un lien de phishing et une saisie de formulaire ne compromettent généralement pas le système. Le risque est le vol d'identifiant, pas l'infection. Le reformatage serait disproportionné et ferait perdre du temps précieux pendant lequel le compte bancaire est vulnérable." }
          ],
          hint: "Depuis un téléphone ou un PC différent : accédez directement au site officiel de la banque (tapez l'URL manuellement), changez le mot de passe, et appelez le service client de la banque pour signaler le phishing et demander la surveillance du compte.",
          callerReply: "J'ai changé mon mot de passe bancaire depuis mon téléphone et j'ai appelé ma banque. Ils ont mis une alerte sur mon compte. Maintenant qu'est-ce qu'il faut faire côté informatique professionnel ?"
        },
        {
          question: "L'urgence bancaire est traitée. Que faire pour l'aspect informatique professionnel ?",
          options: [
            { text: "Vérifier si Thomas a utilisé ses identifiants professionnels sur le faux site — si oui, changer immédiatement le mot de passe AD (Ctrl+Alt+Suppr → Modifier le mot de passe)", correct: true, feedback: "Correct ! Le phishing peut cibler les identifiants professionnels autant que personnels. Si Thomas a saisi des credentials CORP.LOCAL, ou utilise le même mot de passe que son compte Windows, son compte AD est compromis. Un changement de mot de passe AD immédiat prévient tout accès non autorisé au réseau d'entreprise et aux ressources partagées." },
            { text: "Bloquer l'URL du site de phishing dans le proxy réseau pour protéger les autres utilisateurs", correct: false, feedback: "Bloquer l'URL est une bonne action de protection collective, mais ce n'est pas la première priorité pour Thomas. Sécurisez d'abord ses identifiants potentiellement compromis, puis escaladez au RSSI pour le blocage d'URL." },
            { text: "Désactiver le compte AD de Thomas le temps d'investiguer", correct: false, feedback: "Désactiver le compte empêcherait Thomas de travailler sans raison valide. La bonne action est de changer les mots de passe potentiellement volés, pas de bloquer le compte." },
            { text: "Ignorer l'aspect informatique — le phishing ne concerne que les identifiants bancaires personnels", correct: false, feedback: "Les attaques de phishing ciblent souvent les identifiants professionnels simultanément. De plus, l'incident doit être signalé au RSSI : d'autres collègues ont peut-être reçu le même e-mail. Un incident non reporté expose l'entreprise." }
          ],
          hint: "Demandez à Thomas : 'Avez-vous saisi votre mot de passe Windows ou professionnel sur ce site ?' ou 'Utilisez-vous le même mot de passe pour la banque et votre compte Windows ?'. Si oui : Ctrl+Alt+Suppr → Modifier le mot de passe AD immédiatement.",
          callerReply: "J'utilise des mots de passe différents pour la banque et le travail, donc mon compte Windows n'est pas en danger. J'avais uniquement mes identifiants bancaires sur ce faux site."
        },
        {
          question: "Identifiants professionnels sécurisés. Comment clôturer correctement l'incident ?",
          options: [
            { text: "Supprimer l'e-mail de phishing et oublier l'incident — le problème est résolu", correct: false, feedback: "Supprimer l'e-mail sans signalement est une erreur : d'autres collègues ont peut-être reçu le même e-mail sans le signaler. Le RSSI doit être informé et les en-têtes de l'e-mail original contiennent des informations précieuses pour l'analyse." },
            { text: "Envoyer un e-mail à toute l'entreprise pour avertir du phishing", correct: false, feedback: "La communication sur un incident de sécurité doit passer par le RSSI, pas être diffusée directement par un utilisateur. Un e-mail mal formulé peut causer de la panique ou être lui-même pris pour un phishing." },
            { text: "Signaler l'e-mail de phishing au RSSI avec le message original en pièce jointe, signaler sur signal-spam.fr, et expliquer à Thomas les 3 indicateurs clés du phishing", correct: true, feedback: "Procédure complète de clôture : 1) Rapport RSSI — l'e-mail original (en pièce jointe, pas en transfert simple) permet au RSSI d'analyser les en-têtes, identifier d'autres destinataires dans l'entreprise, et bloquer l'expéditeur. 2) Signal-spam.fr — contribue à la base nationale des e-mails malveillants. 3) Sensibilisation — 3 indicateurs clés : urgence artificielle ('votre compte sera bloqué'), mauvaise URL (domaine suspect, fautes de frappe), demande d'identifiants par e-mail (une vraie banque ne demande jamais ça)." },
            { text: "Formater le PC de Thomas pour éliminer tout risque de contamination", correct: false, feedback: "Visiter un site de phishing ne laisse généralement pas de malware sur le PC — l'attaque est sociale, pas technique. Un reformatage serait disproportionné et causerait une indisponibilité inutile." }
          ],
          hint: "Dans Outlook : sélectionner l'e-mail → 'Autres actions' → 'Afficher la source du message' pour les en-têtes. Joindre le fichier .eml au rapport RSSI. Sur signal-spam.fr : formulaire de signalement en ligne.",
          callerReply: "J'ai transmis l'e-mail au RSSI et signalé sur signal-spam.fr. Le RSSI m'a informé que 4 autres collègues avaient reçu le même e-mail, mais je suis le seul à avoir cliqué. Il va bloquer le domaine et envoyer une alerte à toute l'entreprise. Merci pour votre réactivité !"
        }
      ]
    },

    // --- SÉCURITÉ: Clé USB inconnue branchée sur un poste ---
    {
      id: 'security-usb-unknown',
      category: 'Sécurité',
      level: 2,
      difficulty: 'medium',
      caller: 'Valérie Martin',
      dept: 'Juridique',
      mood: 'worried',
      issue: 'Clé USB inconnue trouvée et branchée sur un poste — risque de compromission',
      terminalContext: {
        hostname: 'PC-JURIDIQUE-07', username: 'valerie.martin',
        domain: 'CORP.LOCAL', ip: '192.168.1.81'
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Valérie du service juridique. Ce matin j'ai trouvé une clé USB dans le couloir, près de la cafétéria. J'ai pensé que c'était à quelqu'un de notre service, alors je l'ai branchée pour voir si je trouvais un nom ou des fichiers appartenant à un collègue." },
        { from: 'caller', text: "En l'ouvrant j'ai vu des dossiers avec des noms techniques bizarres. J'ai débranché immédiatement sans rien ouvrir. Mon PC semble fonctionner normalement mais je ne sais pas si j'ai fait quelque chose de grave." }
      ],
      steps: [
        {
          question: "Valérie a branché une clé USB inconnue et consulté son contenu. Quelle est l'action immédiate ?",
          options: [
            { text: "Scanner la clé USB avec l'antivirus avant de continuer à l'utiliser", correct: false, feedback: "Scanner la clé sur le PC potentiellement compromis est insuffisant — si la clé a exécuté un payload au branchement (BadUSB), l'antivirus local peut être désactivé ou contourné. Certains malwares n'ont pas de fichiers scannable car l'attaque est dans le firmware. Isolez d'abord, analysez ensuite dans un environnement maîtrisé." },
            { text: "Isoler le poste du réseau immédiatement (débrancher le câble Ethernet ou désactiver le Wi-Fi) et ne plus utiliser le PC en attendant une analyse de sécurité", correct: true, feedback: "Correct ! Une clé USB inconnue est un vecteur d'attaque classique — technique dite du 'USB drop'. Certaines clés sont des BadUSB : elles émulent un clavier et exécutent des commandes dès la connexion, même sans clic utilisateur. L'isolation réseau immédiate empêche tout malware éventuel de communiquer avec un serveur de commande ou de se propager sur le réseau d'entreprise." },
            { text: "Reformater la clé USB pour éliminer tout contenu malveillant", correct: false, feedback: "Reformater la clé détruirait les preuves nécessaires à l'investigation de sécurité. Ne modifiez pas la clé — elle doit être transmise à l'équipe sécurité. Certains BadUSB ont leur payload dans le firmware, inaccessible par un formatage." },
            { text: "Demander à un collègue si la clé lui appartient avant d'escalader", correct: false, feedback: "Cette approche sous-estime le risque. L'isolation du poste est urgente. Même si la clé appartient à un collègue, elle aurait pu être modifiée avant d'être 'perdue'. Le protocole de sécurité s'applique indépendamment de l'origine présumée de la clé." }
          ],
          hint: "Sur le PC : débrancher le câble Ethernet ou désactiver le Wi-Fi (icône réseau → 'Déconnecter'). Ne pas éteindre le PC — les processus en mémoire sont des preuves forensiques. Garder la clé USB dans une enveloppe étiquetée avec la date et l'heure.",
          callerReply: "J'ai débranché le câble réseau. Mon PC est toujours allumé. La clé USB est posée sur mon bureau. Qu'est-ce que je dois faire ensuite ?"
        },
        {
          question: "PC isolé du réseau. Quelle est la procédure de traitement de l'incident ?",
          options: [
            { text: "Éteindre le PC immédiatement pour éviter que le malware s'exécute davantage", correct: false, feedback: "Éteindre le PC efface la mémoire RAM qui peut contenir des preuves cruciales : processus malveillants actifs, connexions réseau établies, clés de chiffrement en mémoire. Les équipes forensiques préfèrent analyser un système en fonctionnement. N'éteignez pas sans instruction explicite du RSSI." },
            { text: "Contacter le RSSI immédiatement avec tous les détails (heure du branchement, durée, actions effectuées) et remettre la clé USB à l'équipe sécurité dans un contenant isolé", correct: true, feedback: "Procédure correcte : le RSSI prend en charge l'investigation. Informations à transmettre : heure exacte du branchement, durée de connexion, si Windows a affiché une notification AutoPlay, si des fichiers ont été ouverts. La clé doit être placée dans un sachet fermé — elle constitue une pièce à conviction. L'équipe sécurité analysera la clé dans une sandbox et fera une image forensique du PC si nécessaire." },
            { text: "Réinstaller Windows sur le PC pour éliminer tout risque et reprendre le travail rapidement", correct: false, feedback: "La réinstallation détruit toutes les preuves forensiques et ne doit jamais être faite avant l'investigation. Si la clé a exfiltré des données ou établi un tunnel, une réinstallation ne résout pas la compromission potentielle." },
            { text: "Brancher la clé USB sur un autre PC pour une deuxième analyse de son contenu", correct: false, feedback: "Brancher la clé sur un autre PC expose ce second poste au même risque. Une clé USB suspecte ne doit être analysée que dans un environnement spécialement préparé (sandbox, VM sans accès réseau) par l'équipe sécurité." }
          ],
          hint: "Notez l'heure exacte du branchement et la durée. Placez la clé USB dans un sachet ou enveloppe étiquetés. Appelez le RSSI depuis votre téléphone — ne pas envoyer d'e-mail depuis le PC potentiellement compromis.",
          callerReply: "J'ai appelé le RSSI depuis mon téléphone. Il arrive dans 10 minutes avec un PC d'analyse isolé. Il m'a dit de ne pas toucher à mon PC ni à la clé. Y a-t-il autre chose à faire en attendant ?"
        },
        {
          question: "En attendant le RSSI, quelle information est importante à documenter ?",
          options: [
            { text: "Documenter précisément : heure du branchement, durée, nom des dossiers visibles sur la clé, si Windows a affiché une notification AutoPlay, et si des fichiers ont été ouverts ou seulement consultés dans l'explorateur", correct: true, feedback: "La documentation précise est cruciale pour l'investigation forensique : 1) Timeline — l'heure exacte permet de croiser avec les logs Windows (Event ID 20001 pour le branchement USB). 2) AutoPlay — si Windows a proposé d'exécuter automatiquement un programme, cela indique une possible exécution. 3) Fichiers ouverts ou non — ouvrir un fichier Office peut déclencher des macros malveillantes, contrairement à simplement lire les noms de fichiers. Ces détails déterminent le niveau de réponse nécessaire." },
            { text: "Essayer de retrouver le propriétaire de la clé en interrogeant les collègues", correct: false, feedback: "Mener sa propre enquête n'est pas approprié dans un incident de sécurité — cela peut alerter un attaquant interne potentiel. Le RSSI gère l'investigation. Votre rôle est de fournir des informations techniques précises." },
            { text: "Installer un outil de détection de malware depuis Internet pour analyser le PC pendant l'attente", correct: false, feedback: "Télécharger et installer un logiciel sur un PC potentiellement compromis peut interférer avec l'investigation forensique. De plus, le PC est isolé du réseau — vous ne devriez pas le reconnecter. Attendez l'équipe sécurité." },
            { text: "Vérifier si des fichiers ont été copiés vers la clé USB en regardant les fichiers récents Windows", correct: false, feedback: "Vérifier les 'fichiers récents' sur le PC potentiellement compromis peut fausser les données forensiques en modifiant des horodatages. Une copie par un BadUSB se ferait via des commandes système, pas visibles dans les 'fichiers récents'. Laissez l'investigation au RSSI." }
          ],
          hint: "Sur votre téléphone, notez : heure du branchement, durée approximative, ce que vous avez vu (noms des dossiers), si une fenêtre AutoPlay est apparue, si vous avez cliqué sur quoi que ce soit. Ces informations guideront l'analyse forensique.",
          callerReply: "J'ai tout noté sur mon téléphone. Le RSSI est arrivé. Il a fait une image mémoire du PC et analysé la clé dans une VM isolée — c'était effectivement un BadUSB qui simule un clavier. Mais comme j'ai isolé le réseau rapidement, aucune commande n'a pu être exfiltrée vers l'extérieur. Merci pour la procédure rapide !"
        }
      ]
    }
  ],

  /* ==========================================
     NIVEAU 2 — HARD
     ========================================== */
  hard: [

    // --- AD/GPO: GPO non appliquée ---
    {
      id: 'ad-gpo-not-applied',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT',
      mood: 'calm',
      issue: 'GPO de sécurité non appliquée — 12 postes du 3e étage',
      terminalContext: {
        hostname: 'PC-ETAGE3-12', username: 'pierre.morel',
        domain: 'CORP.LOCAL', ip: '192.168.1.112',
        gpoBroken: true
      },
      messages: [
        { from: 'caller', text: "Salut, c'est l'admin réseau. Les GPO de sécurité 'Sécurité-Postes-2024' ne s'appliquent plus sur les 12 postes du 3e étage depuis vendredi." },
        { from: 'caller', text: "gpresult montre des erreurs de filtrage. Le RSSI veut que ce soit réglé aujourd'hui — on risque une non-conformité." }
      ],
      steps: [
        {
          question: "Première commande de diagnostic sur un poste affecté ?",
          options: [
            { text: "gpresult /r pour afficher le rapport RSoP (Resultant Set of Policy)", correct: true, feedback: "Correct ! gpresult /r montre quelles GPO sont appliquées, refusées ou filtrées — indispensable pour diagnostiquer." },
            { text: "Supprimer et recréer toutes les GPO", correct: false, feedback: "Trop destructif. Commencez par comprendre le problème." },
            { text: "Reformater les 12 postes", correct: false, feedback: "Disproportionné pour un problème GPO." },
            { text: "Redémarrer le contrôleur de domaine", correct: false, feedback: "Redémarrer le DC est une action à impact fort sans diagnostic préalable." }
          ],
          hint: "gpresult /r affiche un résumé. gpresult /h rapport.html génère un rapport HTML complet pour un diagnostic détaillé.",
          terminalCommand: "gpupdate /force",
          callerReply: "gpresult montre : 'Sécurité-Postes-2024' — Refusé (Filtrage de sécurité : accès refusé)."
        },
        {
          question: "La GPO est filtrée avec 'Accès refusé (Sécurité)'. Que vérifiez-vous ?",
          options: [
            { text: "Que les comptes machines des postes sont dans le groupe de sécurité utilisé pour le filtrage de la GPO", correct: true, feedback: "Exact ! 'Filtrage de sécurité refusé' = les objets (machines ou users) ne sont pas dans le groupe de sécurité ciblé par la GPO." },
            { text: "Les logs du pare-feu", correct: false, feedback: "Le pare-feu n'a rien à voir avec l'application des GPO." },
            { text: "La version de Windows sur les postes", correct: false, feedback: "La version de Windows n'est pas la cause d'un filtrage de sécurité refusé." },
            { text: "La connexion Internet des postes", correct: false, feedback: "Les GPO fonctionnent sur le réseau local, pas via Internet." }
          ],
          hint: "Dans la GPMC : sélectionnez la GPO → Étendue → Filtrage de sécurité. Vérifiez que le groupe contenant les comptes machines des postes du 3e étage est bien là.",
          callerReply: "Les postes du 3e ont été déplacés dans une nouvelle OU la semaine dernière et retirés du groupe 'GRP-POSTES-CORP'."
        },
        {
          question: "Les comptes machines ne sont plus dans le groupe de filtrage. Quelle est la correction ?",
          options: [
            { text: "Ajouter les comptes machines (ou leur groupe d'OU) au groupe de sécurité de filtrage de la GPO", correct: true, feedback: "Parfait ! Réajouter les comptes machines dans le groupe ciblé par le filtrage de sécurité résoudra l'application de la GPO." },
            { text: "Désactiver le filtrage de sécurité sur la GPO", correct: false, feedback: "Désactiver le filtrage appliquerait la GPO à TOUS les postes du domaine — dangereux." },
            { text: "Créer une nouvelle GPO pour le 3e étage seulement", correct: false, feedback: "Créer une GPO dupliquée crée de la complexité. Mieux vaut corriger le filtrage existant." },
            { text: "Lier la GPO directement à l'OU du 3e étage", correct: true, feedback: "Aussi correct ! Lier la GPO à la nouvelle OU est une alternative propre si les postes y sont désormais organisés." }
          ],
          hint: "Deux solutions valides : 1) Réajouter les comptes machines au groupe de filtrage. 2) Lier la GPO à la nouvelle OU (plus propre sur le long terme).",
          terminalCommand: "gpupdate /force",
          callerReply: "Après avoir lié la GPO à la nouvelle OU et forcé gpupdate, les GPO s'appliquent sur tous les postes !"
        },
        {
          question: "GPO résolue. Que documenter dans le ticket ?",
          options: [
            { text: "La cause (déplacement OU sans mise à jour des liaisons GPO), la solution, et proposer un processus pour éviter la récurrence", correct: true, feedback: "Excellent ! Un bon post-mortem inclut : cause racine, solution appliquée, et mesures préventives. Ici : avoir un processus de migration OU qui vérifie les liaisons GPO." },
            { text: "Juste 'GPO corrigée' dans le ticket", correct: false, feedback: "Trop vague. Un bon ticket documente la cause et la solution pour aider les futurs techniciens." },
            { text: "Rien, le problème est résolu", correct: false, feedback: "La documentation est essentielle — c'est la base de la base de connaissances." },
            { text: "Envoyer un email de blâme à l'admin qui a déplacé l'OU", correct: false, feedback: "La blamestorming n'a pas sa place dans un bon workflow IT. Documentez et améliorez les processus." }
          ],
          hint: "Un bon ticket post-résolution : Cause + Solution + Prévention. Informez aussi le RSSI que la conformité est restaurée.",
          callerReply: "Parfait. J'ai informé le RSSI, tous les postes sont conformes. Belle résolution, merci !"
        }
      ]
    },

    // --- WINDOWS: BSOD poste direction ---
    {
      id: 'windows-bsod-critical',
      category: 'Windows',
      level: 2,
      difficulty: 'hard',
      caller: 'Luc Bernard',
      dept: 'Direction',
      mood: 'panicked',
      issue: 'BSOD CRITICAL_PROCESS_DIED en boucle — poste direction',
      terminalContext: {
        hostname: 'PC-DIRECTION-01', username: 'luc.bernard',
        domain: 'CORP.LOCAL', ip: '192.168.1.55',
        sfcErrors: true
      },
      messages: [
        { from: 'caller', text: "BONJOUR ! C'est Luc Bernard de la direction. Mon PC fait un écran bleu et redémarre en BOUCLE depuis ce matin !!" },
        { from: 'caller', text: "CRITICAL_PROCESS_DIED c'est marqué. J'ai une réunion dans 30 MINUTES avec le conseil d'administration. Tous mes fichiers sont sur ce PC !!" }
      ],
      steps: [
        {
          question: "L'utilisateur est en panique. Quelle est votre première réaction ?",
          options: [
            { text: "Rassurer l'utilisateur, prioriser son cas, proposer un PC de prêt pour la réunion en urgence", correct: true, feedback: "Correct ! Face à un utilisateur VIP en panique : calme, empathie, solution immédiate de contournement. La réunion prime sur la réparation technique." },
            { text: "Demander s'il a fait des sauvegardes", correct: false, feedback: "Ce n'est pas le bon moment pour cette question — l'utilisateur est en panique. Répondez à l'urgence d'abord." },
            { text: "Escalader directement au N3 sans rien faire", correct: false, feedback: "Un BSOD CRITICAL_PROCESS_DIED est diagnostiquable en N2. Et l'urgence immédiate (réunion) doit être gérée." },
            { text: "Dire que le PC doit être remplacé", correct: false, feedback: "On ne peut pas conclure ça sans diagnostic. Et surtout pas en premier." }
          ],
          hint: "Gestion des priorités : 1) Contournement immédiat (réunion), 2) Récupérer les fichiers, 3) Diagnostiquer et réparer le PC.",
          callerReply: "OK... il y a un PC de prêt au service IT. Mais mes fichiers et ma présentation PowerPoint ?!"
        },
        {
          question: "PC en BSOD boucle. Comment accéder aux fichiers ?",
          options: [
            { text: "Booter sur une clé USB WinPE (ou environnement de récupération) pour accéder au disque sans démarrer Windows", correct: true, feedback: "Exact ! WinPE ou le mode récupération Windows permet d'accéder au système de fichiers même quand Windows ne démarre pas." },
            { text: "Retirer le disque dur et le mettre dans un autre PC", correct: false, feedback: "Possible mais physiquement complexe. WinPE est plus rapide et moins risqué." },
            { text: "Laisser Windows réparer tout seul", correct: false, feedback: "CRITICAL_PROCESS_DIED en boucle ne se répare pas tout seul." },
            { text: "Reformater sans récupérer les fichiers", correct: false, feedback: "Jamais reformater avant d'avoir récupéré les données !" }
          ],
          hint: "Clé USB WinPE ou appuyer sur F8/Shift+F10 au démarrage pour accéder aux Outils de récupération Windows.",
          callerReply: "D'accord, vous allez faire ça. Le collègue lui amène le PC de prêt pour sa réunion."
        },
        {
          question: "En WinPE, les fichiers sont accessibles. La présentation est récupérée. Que faire ensuite pour réparer Windows ?",
          options: [
            { text: "Lancer sfc /scannow et DISM /Online /Cleanup-Image /RestoreHealth depuis les outils de récupération", correct: true, feedback: "Correct ! sfc répare les fichiers système corrompus. DISM répare l'image Windows elle-même. Souvent suffisant pour CRITICAL_PROCESS_DIED causé par une corruption." },
            { text: "Réinstaller Windows sans conserver les données", correct: false, feedback: "Réinstallation propre = option de dernier recours. Essayez la réparation d'abord." },
            { text: "Mettre à jour les drivers en mode sans échec", correct: false, feedback: "Possible mais CRITICAL_PROCESS_DIED est plus souvent lié à des fichiers système corrompus qu'à des drivers." },
            { text: "Attendre une mise à jour automatique de Windows", correct: false, feedback: "Windows ne démarre pas — il ne peut pas recevoir de mises à jour." }
          ],
          hint: "Ordre recommandé : 1) DISM RestoreHealth, 2) sfc /scannow, 3) Redémarrer et tester. Si toujours BSOD → analyser le minidump (WinDbg).",
          terminalCommand: "sfc /scannow",
          callerReply: "La réunion se passe bien avec le PC de prêt. Vous avancez sur la réparation ?"
        },
        {
          question: "sfc a trouvé et réparé des fichiers corrompus. Windows redémarre normalement. Que faire avant de rendre le PC ?",
          options: [
            { text: "Transférer les fichiers récupérés, vérifier la stabilité, activer les sauvegardes automatiques, documenter", correct: true, feedback: "Parfait ! Avant de rendre le PC : restaurer les données, vérifier la stabilité (10-15 min d'utilisation), s'assurer que les sauvegardes sont actives, documenter l'incident." },
            { text: "Rendre le PC immédiatement après le redémarrage", correct: false, feedback: "Trop tôt — vérifiez d'abord la stabilité et les données." },
            { text: "Désactiver Windows Update pour éviter que ça recommence", correct: false, feedback: "Ne jamais désactiver les mises à jour Windows — les patches de sécurité sont critiques." },
            { text: "Dire à l'utilisateur de faire lui-même ses sauvegardes", correct: false, feedback: "Un système de backup automatique (OneDrive, Veeam, etc.) doit être configuré par l'IT, pas laissé à l'utilisateur." }
          ],
          hint: "Vérifiez que OneDrive ou la sauvegarde Veeam est bien configurée. Un DG sans backup = incident futur garanti.",
          callerReply: "Excellent travail ! Le PC est réparé, mes fichiers sont récupérés, et vous avez configuré OneDrive. Merci de m'avoir sauvé !"
        }
      ]
    },

    // --- SERVER: Service critique arrêté ---
    {
      id: 'server-service-down',
      category: 'Server',
      level: 2,
      difficulty: 'hard',
      caller: 'Alice Moreau',
      dept: 'IT / Helpdesk',
      mood: 'calm',
      issue: 'Service DHCP arrêté — tous les postes du bâtiment B en APIPA',
      terminalContext: {
        hostname: 'SRV-DC01', username: 'admin.it',
        domain: 'CORP.LOCAL', ip: '192.168.1.10',
        services: { DHCPServer: 'STOPPED' }
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Alice du helpdesk. On a une vague d'appels depuis 10 minutes : tous les utilisateurs du bâtiment B n'ont plus internet ni accès au réseau." },
        { from: 'caller', text: "Les postes montrent l'adresse 169.254.x.x et le message 'Pas d'accès à Internet'. Ça concerne environ 40 postes." }
      ],
      steps: [
        {
          question: "40 postes en APIPA simultanément. Quelle est la cause probable ?",
          options: [
            { text: "Le service DHCP Server est arrêté ou le scope DHCP est épuisé", correct: true, feedback: "Exact ! 40 postes en APIPA en même temps = le serveur DHCP ne répond plus. Soit le service est arrêté, soit le pool d'adresses est épuisé, soit le serveur est inaccessible." },
            { text: "Un virus a infecté tous les postes simultanément", correct: false, feedback: "Possible mais peu probable comme cause d'APIPA simultané. DHCP est la cause évidente." },
            { text: "Le câble principal du bâtiment B est coupé", correct: false, feedback: "Si le câble était coupé, les postes ne seraient même pas en APIPA — ils auraient juste 'Réseau non identifié'." },
            { text: "Windows Update a causé un problème", correct: false, feedback: "Windows Update ne causerait pas 40 APIPA simultanément sans redémarrage." }
          ],
          hint: "Sur le serveur DHCP : sc query DHCPServer pour voir l'état du service. Vérifiez aussi l'espace disque du serveur.",
          terminalCommand: "sc query DHCPServer",
          callerReply: "Les appels continuent d'arriver. Qu'est-ce que vous voyez côté serveur ?"
        },
        {
          question: "sc query DHCPServer montre STATUS: STOPPED. Que faire ?",
          options: [
            { text: "sc start DHCPServer et surveiller que le service reste actif", correct: true, feedback: "Correct ! Redémarrez le service DHCP. Mais aussi identifier POURQUOI il s'est arrêté (logs événements) pour éviter la récurrence." },
            { text: "Redémarrer tout le serveur", correct: false, feedback: "Le redémarrage serveur interromprait d'autres services. Redémarrez seulement le service DHCP." },
            { text: "Configurer des IPs statiques sur les 40 postes", correct: false, feedback: "40 IPs statiques = beaucoup de travail et de complexité. Résolvez le service DHCP." },
            { text: "Déplacer le rôle DHCP sur un autre serveur immédiatement", correct: false, feedback: "Migration de rôle = opération planifiée. Redémarrez le service d'abord." }
          ],
          hint: "net start DHCPServer ou sc start DHCPServer. Vérifiez ensuite l'Observateur d'événements (eventvwr) pour trouver la cause de l'arrêt.",
          terminalCommand: "net start DHCPServer",
          callerReply: "Service redémarré. Les postes reprennent une IP normale. Mais pourquoi s'est-il arrêté ?"
        },
        {
          question: "Le service DHCP redémarre. Dans l'Observateur d'événements, vous voyez l'ID 1014 : 'Le disque est plein'. Que faire ?",
          options: [
            { text: "Libérer de l'espace sur le disque système du serveur (logs anciens, sauvegardes) et configurer des alertes d'espace disque", correct: true, feedback: "Correct ! Un serveur avec disque plein arrête les services. Nettoyez l'espace (logs DHCP, fichiers temp) et configurez une alerte à 80% d'occupation pour anticiper." },
            { text: "Augmenter la taille du disque virtuel sans rien nettoyer", correct: false, feedback: "Augmenter sans nettoyer est un palliatif. Il faut aussi identifier ce qui a rempli le disque (logs, dumps...)." },
            { text: "Ignorer l'alerte — le service tourne maintenant", correct: false, feedback: "Ignorer = incident garanti dans quelques heures/jours quand le disque sera de nouveau plein." },
            { text: "Déplacer tous les logs sur un autre serveur sans configurer d'alertes", correct: false, feedback: "Bien de déplacer les logs, mais sans alerte de monitoring, le problème reviendra." }
          ],
          hint: "Vérifiez avec 'dir C:\\' l'espace libre. Nettoyez : logs DHCP (C:\\Windows\\System32\\DHCP\\), dumps, fichiers temp. Ensuite configurez une alerte monitoring.",
          callerReply: "Les logs DHCP et crash dumps avaient rempli le disque. Après nettoyage et config de l'alerte monitoring, tout est stable. Merci !"
        }
      ]
    },

    // --- M365 / AZURE: Licence non attribuée N2 ---
    {
      id: 'm365-azure-license',
      category: 'Azure',
      level: 2,
      difficulty: 'hard',
      caller: 'Responsable RH',
      dept: 'Ressources Humaines',
      mood: 'frustrated',
      issue: 'Nouvelle employée — aucun accès M365, Teams ni Azure AD',
      terminalContext: {
        hostname: 'PC-RH-NOUVEAU', username: 'emma.leroy',
        domain: 'CORP.LOCAL', ip: '192.168.1.156',
        internetOK: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est la responsable RH. Emma Leroy a commencé aujourd'hui mais elle n'a accès à rien. Teams dit 'Vous n'avez pas de licence', elle ne peut pas ouvrir Outlook, et OneDrive ne se lance pas." },
        { from: 'caller', text: "Son compte Windows fonctionne, elle peut se connecter au PC. Mais pour les outils Microsoft 365, zéro accès. C'est bloquant pour son intégration." }
      ],
      steps: [
        {
          question: "Compte Windows OK, mais aucun accès M365. Première chose à vérifier ?",
          options: [
            { text: "Que le compte Emma Leroy existe dans Azure AD et qu'une licence M365 lui est assignée", correct: true, feedback: "Correct ! Un compte AD local ne suffit pas pour M365. Il faut : 1) Compte dans Azure AD (ou synchronisé via AD Connect), 2) Licence M365 attribuée." },
            { text: "Réinstaller Office 365 sur son PC", correct: false, feedback: "Réinstaller Office ne résoudra pas un problème de licence non attribuée." },
            { text: "Réinitialiser son mot de passe", correct: false, feedback: "Son compte Windows fonctionne, donc le mot de passe n'est pas en cause." },
            { text: "Vérifier si l'imprimante fonctionne", correct: false, feedback: "Hors sujet complet." }
          ],
          hint: "Portail admin M365 (admin.microsoft.com) → Utilisateurs actifs → Chercher Emma Leroy → Vérifier licences assignées.",
          callerReply: "Pouvez-vous vérifier dans le portail admin ?"
        },
        {
          question: "Dans le portail M365, Emma Leroy a un compte mais AUCUNE licence attribuée. Que faire ?",
          options: [
            { text: "Attribuer une licence M365 Business Standard (ou E3 selon la politique de l'entreprise)", correct: true, feedback: "Correct ! Sans licence, aucun service M365 ne fonctionne. L'attribution prend 5-15 minutes pour se propager." },
            { text: "Créer un nouveau compte M365 pour elle", correct: false, feedback: "Pas nécessaire — le compte existe, il manque juste la licence." },
            { text: "Partager le compte d'une collègue", correct: false, feedback: "Partager des comptes est une violation des politiques de sécurité et de la conformité RGPD." },
            { text: "Lui donner une licence admin global", correct: false, feedback: "On n'attribue pas d'admin global à une nouvelle employée. Le principe de moindre privilège s'applique." }
          ],
          hint: "admin.microsoft.com → Utilisateurs → Emma Leroy → Licences et applications → Attribuer la licence appropriée.",
          callerReply: "La licence est assignée. Teams s'ouvre mais affiche 'Synchronisation en cours'. C'est normal ?"
        },
        {
          question: "Licence attribuée, Teams synchronise. Combien de temps attendre et que faire pendant ce temps ?",
          options: [
            { text: "5-15 minutes pour la propagation Azure AD. Configurer OneDrive et vérifier que la boîte mail se crée pendant l'attente", correct: true, feedback: "Correct ! La propagation des licences Azure AD prend quelques minutes. Pendant ce temps, vérifiez la création de la boîte Exchange et configurez OneDrive." },
            { text: "Attendre 24h", correct: false, feedback: "24h est beaucoup trop long. La propagation prend 5-30 minutes en général." },
            { text: "Redémarrer le serveur Azure", correct: false, feedback: "On ne peut pas redémarrer Azure. Et ce n'est pas nécessaire." },
            { text: "Escalader au N3 car Azure est complexe", correct: false, feedback: "L'attribution de licence M365 est une tâche N1/N2 standard." }
          ],
          hint: "Pendant la propagation : vérifiez que la boîte Exchange est créée, configurez OneDrive Sync, ajoutez Emma aux groupes Teams appropriés.",
          callerReply: "Après 10 minutes, Teams fonctionne, Outlook reçoit des mails, OneDrive synchronise. Emma peut commencer à travailler !"
        }
      ]
    },

    // --- WINDOWS: Antivirus bloquant logiciel légitime ---
    {
      id: 'security-defender-block',
      category: 'Windows',
      level: 2,
      difficulty: 'hard',
      caller: 'Alice Moreau',
      dept: 'IT',
      mood: 'calm',
      issue: 'Windows Defender bloque une application d\'entreprise légitime',
      terminalContext: {
        hostname: 'PC-IT-01', username: 'alice.moreau',
        domain: 'CORP.LOCAL', ip: '192.168.1.101',
        defenderQuarantine: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Alice du service IT. Depuis la mise à jour des définitions Defender cette nuit, notre application métier GestiPro.exe est automatiquement mise en quarantaine sur plusieurs postes. L'application est légitime — on l'utilise depuis 2 ans." },
        { from: 'caller', text: "Les utilisateurs opérationnels ne peuvent plus la lancer. C'est critique pour la production. Il faut trouver comment autoriser l'application sans compromettre la sécurité." }
      ],
      steps: [
        {
          question: "Defender bloque GestiPro.exe après une mise à jour de définitions. Quelle est votre première action ?",
          options: [
            { text: "Désactiver Windows Defender définitivement sur les postes affectés", correct: false, feedback: "Désactiver l'antivirus est une faille de sécurité majeure. On crée une exclusion ciblée, on ne désactive pas la protection globale." },
            { text: "Accéder à la quarantaine Defender (Sécurité Windows → Protection contre les virus → Historique de protection) et examiner la détection", correct: true, feedback: "Correct ! La quarantaine donne le nom de la menace détectée, le chemin exact du fichier et le type de détection. C'est indispensable pour confirmer qu'il s'agit bien d'un faux positif avant toute action." },
            { text: "Réinstaller GestiPro sur tous les postes", correct: false, feedback: "Si Defender détecte le fichier, une réinstallation mènera au même blocage immédiatement après." },
            { text: "Formater les postes affectés", correct: false, feedback: "Totalement disproportionné. Il s'agit d'un faux positif à corriger, pas d'une infection réelle." }
          ],
          hint: "Sécurité Windows → Protection contre les virus et menaces → Historique de protection → Éléments mis en quarantaine. En PowerShell : Get-MpThreatDetection",
          terminalCommand: "Get-MpThreatDetection | Select-Object ThreatName, ActionSuccess, Resources",
          callerReply: "Dans la quarantaine : détection 'Trojan:Win32/Fuerboos.C!cl' ciblant C:\\Program Files\\GestiPro\\GestiPro.exe. C'est bien un faux positif ?"
        },
        {
          question: "Defender identifie GestiPro.exe comme Trojan:Win32/Fuerboos. Application connue depuis 2 ans. Comment confirmer le faux positif ?",
          options: [
            { text: "Faire confiance à Defender et considérer que l'application est infectée", correct: false, feedback: "Un faux positif après mise à jour des définitions est fréquent. Vérifiez avant de condamner une application utilisée depuis 2 ans sur votre domaine." },
            { text: "Analyser le fichier sur VirusTotal et vérifier la signature numérique de l'exécutable", correct: true, feedback: "Correct ! VirusTotal compare l'analyse de 70+ moteurs antivirus. Si un seul moteur détecte une menace (Defender), c'est très probablement un faux positif. La signature numérique valide l'authenticité de l'éditeur." },
            { text: "Restaurer le fichier depuis la quarantaine immédiatement sans vérification", correct: false, feedback: "Restaurer sans vérification serait irresponsable si c'était un vrai malware. Confirmez d'abord le faux positif." },
            { text: "Signaler uniquement à l'éditeur et attendre leur réponse", correct: false, feedback: "Contacter l'éditeur est une bonne étape, mais en attendant la production est bloquée. Vérifiez VirusTotal en parallèle pour agir vite." }
          ],
          hint: "Clic droit sur GestiPro.exe → Propriétés → Signatures numériques pour vérifier l'éditeur. Upload sur virustotal.com pour le multi-scan des 70+ moteurs.",
          callerReply: "VirusTotal : 1/72 moteurs détecte quelque chose (uniquement Microsoft). La signature est valide, signée par GestiPro SAS. Faux positif confirmé !"
        },
        {
          question: "Faux positif confirmé. Comment autoriser l'application correctement sur l'ensemble du parc ?",
          options: [
            { text: "Créer l'exclusion manuellement dans Defender sur chaque poste affecté", correct: false, feedback: "Possible mais non scalable. Sur un parc de plusieurs dizaines de postes, une GPO est obligatoire pour une gestion centralisée et auditée." },
            { text: "Créer une exclusion Defender via une GPO (GPMC → Computer Configuration → Windows Defender Antivirus → Exclusions → Path Exclusions)", correct: true, feedback: "Excellent ! Une exclusion GPO s'applique automatiquement à tous les postes ciblés, est centralisée dans la GPMC et ne désactive pas la protection globale. C'est la méthode correcte en environnement domaine." },
            { text: "Désactiver Windows Defender sur les postes via GPO", correct: false, feedback: "Désactiver l'antivirus pour autoriser une application = faille de sécurité grave. On crée une exclusion ciblée sur le chemin de l'application uniquement." },
            { text: "Attendre que Microsoft corrige ses définitions", correct: false, feedback: "Attendre = les équipes restent bloquées. On agit maintenant avec une exclusion GPO ET on signale le faux positif à Microsoft pour qu'il corrige ses définitions." }
          ],
          hint: "GPMC → Computer Configuration → Administrative Templates → Windows Components → Microsoft Defender Antivirus → Exclusions → Path Exclusions → Ajouter : C:\\Program Files\\GestiPro\\. En PowerShell : Add-MpPreference -ExclusionPath",
          terminalCommand: "Add-MpPreference -ExclusionPath 'C:\\Program Files\\GestiPro'",
          callerReply: "GPO déployée, gpupdate forcé sur les postes. GestiPro fonctionne partout ! J'ai aussi signalé le faux positif à Microsoft via le portail Security Intelligence. Merci !"
        }
      ]
    },

    // --- WINDOWS: Erreur winlogon.exe au démarrage ---
    {
      id: 'windows-winlogon-error',
      category: 'Windows',
      level: 2,
      difficulty: 'hard',
      caller: 'Sylvie Rousseau',
      dept: 'Direction Générale',
      mood: 'frustrated',
      issue: 'Erreur winlogon.exe au démarrage — impossible d\'accéder à la session Windows',
      terminalContext: {
        hostname: 'PC-DG-01', username: 'sylvie.rousseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.144',
        systemCorrupted: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Sylvie de la direction générale. Mon PC ne démarre plus depuis ce matin. J'ai un écran bleu avec le message 'winlogon.exe — Application Error' et le PC redémarre en boucle. Je ne peux pas accéder à Windows du tout." },
        { from: 'caller', text: "J'ai un conseil de direction à 14h et tous mes documents sont sur ce poste. J'ai besoin que ce soit résolu rapidement. Hier soir tout fonctionnait normalement." }
      ],
      steps: [
        {
          question: "Erreur winlogon.exe en boucle de redémarrage. Avant toute intervention, quelle est la vérification de sécurité prioritaire ?",
          options: [
            { text: "Formater le PC immédiatement pour éliminer tout risque de malware", correct: false, feedback: "Formater sans diagnostic est une perte de données potentielle. winlogon.exe peut être corrompu par une mise à jour ou une défaillance disque — pas nécessairement un malware. Diagnostiquez avant d'agir." },
            { text: "Démarrer en mode sans échec et vérifier dans le Gestionnaire des tâches que winlogon.exe s'exécute depuis C:\\Windows\\System32 — tout autre emplacement indique un malware", correct: true, feedback: "Correct ! winlogon.exe légitime est TOUJOURS dans C:\\Windows\\System32. Un winlogon.exe dans %AppData%, %Temp% ou tout autre dossier est un malware usurpant son nom. C'est la distinction critique avant toute réparation — si c'est un malware, la procédure de remédiation est différente." },
            { text: "Remplacer winlogon.exe manuellement en copiant le fichier depuis un autre PC", correct: false, feedback: "Copier un fichier système sans passer par les outils de réparation Windows peut aggraver la situation — versions incompatibles, droits, intégrité du système. Utilisez les outils prévus à cet effet." },
            { text: "Demander à l'utilisatrice de se connecter avec un autre compte administrateur", correct: false, feedback: "Si winlogon.exe est en erreur, aucun compte ne peut se connecter — le service de session est inaccessible pour tous les utilisateurs." }
          ],
          hint: "Démarrage → F8 (ou maintenir Maj) → Mode sans échec. Si l'accès est impossible, démarrer depuis la clé USB Windows → Réparer l'ordinateur → Invite de commandes. Vérifier : where winlogon.exe ou tasklist /fi \"imagename eq winlogon.exe\"",
          terminalCommand: "tasklist /fi \"imagename eq winlogon.exe\" /v",
          callerReply: "En mode sans échec, le Gestionnaire des tâches montre winlogon.exe dans C:\\Windows\\System32. Ce n'est pas un malware — le fichier est légitime mais probablement corrompu."
        },
        {
          question: "winlogon.exe est légitime mais corrompu. Le PC ne démarre pas normalement. Comment réparer les fichiers système ?",
          options: [
            { text: "Démarrer depuis la clé USB Windows → Réparer l'ordinateur → Invite de commandes → exécuter sfc /scannow puis DISM /Online /Cleanup-Image /RestoreHealth", correct: true, feedback: "Exact ! SFC (System File Checker) analyse et répare les fichiers système corrompus en les remplaçant depuis le cache Windows. Si SFC échoue, DISM répare le cache lui-même depuis Windows Update avant de relancer SFC. C'est la procédure officielle Microsoft pour les corruptions système." },
            { text: "Réinstaller Windows en conservant les fichiers personnels (option 'Conserver mes fichiers')", correct: false, feedback: "La réinstallation est une option valide mais de dernier recours. SFC et DISM peuvent réparer winlogon.exe sans toucher aux données ni aux paramètres — tentez-les d'abord." },
            { text: "Restaurer le PC à ses paramètres d'usine", correct: false, feedback: "La restauration d'usine supprime toutes les données et applications. C'est la dernière extrémité après échec de toutes les autres options de réparation." },
            { text: "Télécharger winlogon.exe depuis internet et le remplacer manuellement", correct: false, feedback: "Télécharger des fichiers système depuis des sources non officielles est extrêmement risqué — vous risquez d'installer un vrai malware. Utilisez toujours les outils Microsoft officiels." }
          ],
          hint: "Depuis l'invite de commandes WinRE : sfc /scannow. Si des corruptions sont trouvées mais non réparées : DISM /Online /Cleanup-Image /RestoreHealth puis relancer sfc /scannow. Consultez C:\\Windows\\Logs\\CBS\\CBS.log pour le détail des réparations.",
          terminalCommand: "sfc /scannow",
          callerReply: "SFC a trouvé et réparé des fichiers corrompus — le log CBS confirme que winlogon.exe était affecté. Après redémarrage, Windows charge normalement. Tous mes documents sont intacts. Merci !"
        },
        {
          question: "winlogon.exe réparé, PC fonctionnel. Quelle analyse post-incident effectuez-vous ?",
          options: [
            { text: "Aucune — le problème est résolu, on clôture le ticket", correct: false, feedback: "Un fichier système corrompu sans cause identifiée peut se reproduire. Il faut comprendre l'origine pour prévenir la récidive." },
            { text: "Consulter l'Observateur d'événements (eventvwr.msc) pour identifier la cause de la corruption — mise à jour Windows, défaillance disque (vérifier avec chkdsk), ou arrêt brutal", correct: true, feedback: "Parfait ! L'Observateur d'événements → Journaux Windows → Système révèle les erreurs critiques précédant le crash. Si des erreurs disque apparaissent (ID 7, 11, 51), planifiez un chkdsk /f /r pour vérifier l'intégrité du disque. Un arrêt électrique brutal peut aussi corrompre des fichiers système en cours d'écriture." },
            { text: "Remplacer le disque dur immédiatement par précaution", correct: false, feedback: "Remplacer le disque sans preuve de défaillance est un coût inutile. Vérifiez d'abord avec chkdsk et l'Observateur d'événements avant de conclure à une défaillance disque." },
            { text: "Désactiver les mises à jour Windows automatiques pour éviter de futures corruptions", correct: false, feedback: "Désactiver les mises à jour expose le système à des failles de sécurité. Si une mise à jour est en cause, la signaler à Microsoft est la bonne démarche — pas désactiver les mises à jour." }
          ],
          hint: "eventvwr.msc → Journaux Windows → Système → filtrer sur 'Critique' et 'Erreur' dans les 24h précédant l'incident. ID 41 = arrêt brutal, ID 11/7 = erreur disque. Planifiez chkdsk /f /r au prochain redémarrage si des erreurs disque sont détectées.",
          terminalCommand: "chkdsk C: /f /r /x",
          callerReply: "L'Observateur d'événements montre un ID 41 — arrêt brutal hier soir, probablement une coupure de courant. Je planifie un chkdsk et recommande un onduleur pour ce poste. Ticket documenté."
        }
      ]
    },

    // --- WINDOWS: BSOD PAGE_FAULT_IN_NONPAGED_AREA ---
    {
      id: 'windows-bsod-pagefault',
      category: 'Windows',
      level: 2,
      difficulty: 'hard',
      caller: 'Marc Dupuis',
      dept: 'R&D',
      mood: 'frustrated',
      issue: 'BSOD PAGE_FAULT_IN_NONPAGED_AREA — crashs répétés plusieurs fois par jour',
      terminalContext: {
        hostname: 'PC-RD-05', username: 'marc.dupuis',
        domain: 'CORP.LOCAL', ip: '192.168.1.134',
        systemCorrupted: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est Marc du R&D. Mon PC plante avec un écran bleu 'PAGE_FAULT_IN_NONPAGED_AREA' depuis hier — environ 3 à 4 fois par jour. Le PC redémarre tout seul à chaque fois." },
        { from: 'caller', text: "J'ai installé une nouvelle barrette de RAM vendredi dernier pour augmenter la mémoire. Le problème a commencé samedi. J'ai des simulations en cours qui durent des heures — chaque crash me fait tout recommencer." }
      ],
      steps: [
        {
          question: "BSOD PAGE_FAULT_IN_NONPAGED_AREA apparu après l'ajout d'une barrette RAM. Quel est votre premier diagnostic ?",
          options: [
            { text: "Réinstaller Windows — le BSOD indique une corruption système grave", correct: false, feedback: "PAGE_FAULT_IN_NONPAGED_AREA signifie que Windows a tenté d'accéder à une adresse mémoire invalide — lié au matériel (RAM défectueuse ou incompatible) plus qu'au système. La corrélation directe avec l'installation de RAM vendredi oriente immédiatement vers un test mémoire." },
            { text: "Retirer la nouvelle barrette RAM et tester avec la configuration d'origine, puis lancer Windows Memory Diagnostic (mdsched.exe) pour valider la RAM", correct: true, feedback: "Correct ! La corrélation temporelle est évidente — BSOD apparu le lendemain de l'ajout RAM. Retirer la nouvelle barrette isole immédiatement la variable. Si les BSOD cessent, la barrette est en cause (défectueuse, incompatible, ou mal insérée). Windows Memory Diagnostic (ou memtest86) confirme les erreurs mémoire." },
            { text: "Mettre à jour tous les pilotes Windows — un pilote incompatible peut causer ce BSOD", correct: false, feedback: "Une mise à jour de pilote est pertinente si le BSOD existait avant, mais ici la corrélation directe avec l'ajout de RAM est trop évidente pour ne pas commencer par là. Commencez par isoler la cause matérielle." },
            { text: "Analyser l'Observateur d'événements avant de toucher au matériel", correct: false, feedback: "L'Observateur d'événements est utile mais secondaire ici. La chronologie (RAM ajoutée vendredi, BSOD depuis samedi) est un diagnostic matériel quasi-certain. Retirez d'abord la barrette pour confirmer." }
          ],
          hint: "Éteindre le PC, retirer la nouvelle barrette, rallumer. Si les BSOD cessent : tester la barrette seule. Pour lancer le test mémoire : Win+R → mdsched.exe → 'Redémarrer maintenant et rechercher les problèmes'. Le test s'exécute avant le démarrage de Windows.",
          terminalCommand: "mdsched.exe",
          callerReply: "J'ai retiré la nouvelle barrette — plus aucun BSOD depuis 2 heures. J'ai aussi lancé mdsched.exe avec la barrette seule : 'Des erreurs matérielles ont été détectées'. La barrette est défectueuse."
        },
        {
          question: "La barrette RAM est confirmée défectueuse. Comment gérer la situation correctement ?",
          options: [
            { text: "Reformater la barrette avec un outil bas niveau pour corriger les secteurs défectueux", correct: false, feedback: "La RAM ne se formate pas — les erreurs mémoire sont des défauts physiques dans les cellules. Une barrette avec erreurs matérielles confirmées doit être remplacée, pas réparée." },
            { text: "Retourner la barrette (garantie fabricant ou fournisseur), analyser les fichiers minidump pour documenter le défaut, et vérifier la compatibilité de la prochaine barrette avec la liste QVL de la carte mère", correct: true, feedback: "Parfait ! Procédure complète : 1) Retour garantie — une barrette avec erreurs matérielles est échangée gratuitement. 2) Les minidumps (C:\\Windows\\Minidump\\) documentent les crashs avec l'adresse mémoire fautive — utile pour le rapport de retour. 3) La QVL (Qualified Vendor List) de la carte mère liste les barrettes testées et compatibles — évite le problème de compatibilité à la prochaine commande." },
            { text: "Acheter une barrette identique en urgence sans vérification de compatibilité", correct: false, feedback: "Même modèle n'implique pas même compatibilité — les révisions de PCB changent. Consultez toujours la QVL de la carte mère avant de commander de la RAM pour garantir la compatibilité." },
            { text: "Conserver la configuration actuelle sans RAM supplémentaire — le PC fonctionnait bien avant", correct: false, feedback: "Si l'utilisateur avait besoin de RAM supplémentaire pour ses simulations, cette conclusion s'impose — mais elle doit être une décision partagée avec l'utilisateur et son responsable, pas une décision unilatérale du technicien." }
          ],
          hint: "Minidumps : C:\\Windows\\Minidump\\ — ouvrir avec WinDbg ou WhoCrashed (gratuit) pour identifier l'adresse mémoire fautive. QVL : cherchez le modèle de carte mère sur le site du fabricant → Memory Support List. Notez les références exactes compatibles pour la commande.",
          callerReply: "Barrette retournée en garantie. Les minidumps confirment bien des erreurs d'adresse mémoire liées à la barrette défectueuse — documentation complète pour le retour fournisseur. Nouvelle barrette commandée sur la QVL. Mes simulations reprennent en attendant avec la config d'origine. Merci !"
        }
      ]
    },

    // --- Réseau: DHCP — pool d'adresses épuisé — Bâtiment C ---
    {
      id: 'network-dhcp-exhausted',
      category: 'Réseau',
      level: 2,
      difficulty: 'hard',
      caller: 'Alice Moreau',
      dept: 'IT / Helpdesk',
      mood: 'alarmed',
      issue: 'DHCP — pool d\'adresses épuisé — Bâtiment C entier en APIPA (169.254.x.x)',
      terminalContext: {
        hostname: 'SRV-DHCP01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.10'
      },
      messages: [
        { from: 'caller', text: "Alerte critique — tout le Bâtiment C est hors réseau depuis 7h30. Environ 80 postes sont en APIPA (169.254.x.x). Les utilisateurs ne peuvent plus accéder aux lecteurs réseau, ni à l'intranet, ni à Internet. La direction est au courant." },
        { from: 'caller', text: "Le Bâtiment A et le Bâtiment B n'ont aucun problème. J'ai vérifié les switchs du Bâtiment C — ils sont tous opérationnels. Je suspecte un problème DHCP. Le scope du Bâtiment C utilise la plage 192.168.3.0/24." }
      ],
      steps: [
        {
          question: "80 postes en APIPA, switchs opérationnels. Comment confirmer l'épuisement du pool DHCP ?",
          options: [
            { text: "Se connecter au serveur DHCP et vérifier l'état du scope 192.168.3.0/24 — nombre d'adresses disponibles et baux actifs", correct: true, feedback: "Correct ! Sur le serveur DHCP (Windows Server : Gestionnaire DHCP → IPv4 → Scope → View Address Leases ; ou CLI : netsh dhcp server show scope), vous verrez immédiatement si le scope est épuisé (0 adresses disponibles). L'APIPA sur tous les postes du bâtiment alors que le réseau physique est opérationnel est la signature d'un pool DHCP épuisé : les clients envoient des requêtes DHCPDISCOVER mais ne reçoivent aucun DHCPOFFER." },
            { text: "Redémarrer le service DHCP sur le serveur — il est peut-être bloqué", correct: false, feedback: "Redémarrer le service DHCP ne résoudrait pas l'épuisement du pool — les mêmes baux expirés seraient rechargés depuis la base de données. Il faut d'abord analyser l'état du scope (adresses disponibles, baux actifs et leur durée) avant d'agir." },
            { text: "Lancer ipconfig /renew sur tous les postes affectés", correct: false, feedback: "Si le pool est épuisé, ipconfig /renew ne donnera aucune adresse — les postes resteront en APIPA. Le problème est côté serveur DHCP, pas côté client. Diagnostiquez le scope avant de toucher aux clients." },
            { text: "Vérifier si un serveur DHCP non autorisé (rogue DHCP) distribue des adresses incorrectes", correct: false, feedback: "Un rogue DHCP distribuerait des adresses (possiblement erronées) plutôt que de ne rien distribuer. L'APIPA indique absence totale de réponse DHCP — symptôme d'un pool épuisé, pas d'un rogue DHCP." }
          ],
          hint: "Sur SRV-DHCP01 : Gestionnaire DHCP → IPv4 → Scope [192.168.3.0] Bâtiment C → View Address Leases (voir les baux actifs et leur expiration) + vérifier 'Available' vs 'In Use' dans les statistiques du scope.",
          terminalCommand: "netsh dhcp server show scope",
          callerReply: "Résultat confirmé : le scope 192.168.3.0/24 affiche 0 adresses disponibles sur 254. Toutes les adresses sont en 'Baux actifs'. Je vois beaucoup de baux dont la date d'expiration est dépassée depuis des jours mais qui ne sont pas libérés. Durée de bail configurée : 8 jours !"
        },
        {
          question: "Scope épuisé : 254 baux actifs dont beaucoup expirés non purgés, bail configuré à 8 jours. Comment résoudre immédiatement et prévenir ?",
          options: [
            { text: "Purger les baux expirés manuellement, réduire la durée de bail à 4-8 heures pour les postes nomades, et étendre la plage d'adresses du scope si la topologie le permet", correct: true, feedback: "Procédure complète : 1) Action immédiate — dans le Gestionnaire DHCP, faire un clic droit sur les baux expirés → Supprimer (ou netsh dhcp server scope delete lease). Cela libère instantanément les adresses pour les postes en APIPA. 2) Réduction du bail — 8 jours est trop long pour un parc de postes nomades. 4-8 heures garantit un recyclage rapide. 3) Prévention long terme — si la plage /24 est insuffisante pour la croissance, étendre à /23 (510 adresses) ou créer un sous-scope dédié pour les appareils mobiles (smartphones, laptops)." },
            { text: "Redémarrer le serveur DHCP — tous les baux seront effacés et le pool sera libéré", correct: false, feedback: "Redémarrer le serveur DHCP effacera les baux en mémoire mais la base de données (dhcp.mdb) sera rechargée au démarrage — les baux expirés resteront. De plus, un redémarrage du service DHCP coupera momentanément le service pour tous les bâtiments." },
            { text: "Assigner des adresses IP statiques aux 80 postes du Bâtiment C pour contourner le DHCP", correct: false, feedback: "Configurer 80 postes en IP statique est une opération longue (risque de conflits) et crée une dette technique importante à gérer. La correction du scope DHCP prend 10 minutes et résout le problème de façon propre." },
            { text: "Créer un nouveau scope DHCP sur une plage différente et y migrer le Bâtiment C", correct: false, feedback: "Créer un nouveau scope nécessite une reconfiguration des équipements réseau (VLAN, relais DHCP) et prend beaucoup de temps. La priorité est de libérer les adresses disponibles dans le scope existant — purge des baux expirés + réduction du bail." }
          ],
          hint: "Gestionnaire DHCP → Scope → Active Leases → trier par 'Lease Expiration' → sélectionner les baux expirés → Supprimer. Pour changer la durée du bail : clic droit sur le scope → Properties → Lease duration. Tester ensuite avec un poste affecté : ipconfig /renew.",
          terminalCommand: "ipconfig /renew",
          callerReply: "J'ai purgé 47 baux expirés — ça a libéré immédiatement des adresses. Les postes du Bâtiment C reprennent des IPs valides. J'ai réduit la durée de bail à 6 heures. Je vais aussi proposer d'élargir la plage à /23 lors de la prochaine maintenance planifiée."
        }
      ]
    },

    // --- Réseau: Switch du 2e étage en panne — plateau hors réseau ---
    {
      id: 'network-switch-down',
      category: 'Réseau',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'alarmed',
      issue: 'Switch du 2e étage en panne — tout le plateau est hors réseau',
      terminalContext: {
        hostname: 'CORE-SW01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.253'
      },
      messages: [
        { from: 'caller', text: "Alerte — le plateau du 2e étage est entièrement hors réseau depuis 8h15. Environ 35 postes, 3 imprimantes réseau et le système de contrôle d'accès de l'étage ne répondent plus. Le switch d'étage SW-ETAGE2 ne répond plus au ping depuis le switch core." },
        { from: 'caller', text: "Je vais monter physiquement vérifier l'équipement. Le switch d'étage a 4 ans — c'est un HP Aruba 1930. Il n'y a pas eu de travaux électriques annoncés mais on a eu un orage hier soir." }
      ],
      steps: [
        {
          question: "SW-ETAGE2 ne répond plus au ping, tout le plateau est hors réseau. Quelle est la première vérification sur site ?",
          options: [
            { text: "Vérifier physiquement le switch : LEDs de statut, alimentation (câble d'alimentation, onduleur), et port uplink vers le switch core", correct: true, feedback: "Correct ! La vérification physique est le premier réflexe pour un switch qui ne répond plus. Les LEDs du switch renseignent immédiatement : PWR éteinte = problème d'alimentation, toutes les LEDs ports éteintes = switch hors tension ou défaillant, port uplink éteint = perte de liaison avec le core. Un orage la veille augmente le risque de surtension — vérifier l'onduleur." },
            { text: "Redémarrer le switch core depuis la salle serveurs — une panne de spanning tree bloque le trafic", correct: false, feedback: "Redémarrer le switch core affecterait tous les étages, pas seulement le 2e. Si le problème était spanning tree, certains ports seraient en état Blocking mais pas complètement hors tension. La vérification physique du switch d'étage est la priorité." },
            { text: "Vérifier si le serveur DHCP distribue correctement des adresses aux postes du 2e étage", correct: false, feedback: "Si le switch ne répond même pas au ping depuis le core, le problème est en amont du DHCP — la connectivité physique est coupée. Vérifier le DHCP n'est utile que si la couche 2 fonctionne." },
            { text: "Remplacer immédiatement le switch sans diagnostic préalable", correct: false, feedback: "Remplacer sans diagnostic peut s'avérer inutile (si le problème est l'alimentation ou un câble uplink) et prend plus de temps. Le diagnostic physique prend 2 minutes et guide l'action correcte." }
          ],
          hint: "Sur le switch HP Aruba 1930 : LED PWR = alimentation, LED FAULT = erreur matérielle, LEDs des ports = activité. Vérifier l'onduleur (UPS) si le switch est derrière un — la prise peut être coupée. Tester le câble uplink vers le core switch.",
          callerReply: "Je suis devant le switch. Aucune LED n'est allumée — ni l'alimentation, ni les ports. L'onduleur derrière lui affiche une alarme rouge. L'orage a visiblement grillé la batterie de l'onduleur et le switch a perdu l'alimentation. Le switch lui-même a une légère odeur de brûlé."
        },
        {
          question: "Switch et onduleur défaillants (odeur de brûlé). Comment gérer la remise en service et la continuité ?",
          options: [
            { text: "Déployer le switch de remplacement (spare) depuis le stock, transférer la configuration VLAN et trunk, brancher sur une alimentation directe provisoire, et mettre l'onduleur en maintenance", correct: true, feedback: "Procédure correcte : 1) Switch spare — toute infrastructure IT doit avoir des équipements de remplacement en stock (spare). Charger la config sauvegardée (backup de configuration) sur le nouveau switch. 2) Alimentation provisoire — brancher directement sur prise électrique en attendant le remplacement de l'onduleur. 3) Onduleur — commander le remplacement ou la réparation, et vérifier les autres onduleurs de l'infrastructure. 4) Post-incident — analyser pourquoi un orage a pu griller l'équipement (protection parafoudre insuffisante?) et documenter." },
            { text: "Attendre la livraison d'un nouveau switch commandé au fournisseur — délai 48h", correct: false, feedback: "Attendre 48h avec tout un plateau hors réseau est inacceptable en entreprise. Tout environnement IT professionnel doit disposer d'équipements de remplacement (spare) en stock pour les équipements critiques." },
            { text: "Connecter tous les postes du 2e étage en Wi-Fi provisoirement", correct: false, feedback: "35 postes sur le Wi-Fi simultanément dégraderait massivement les performances réseau. Et les équipements filaires (imprimantes réseau, contrôle d'accès) ne peuvent pas passer en Wi-Fi. La solution est de remplacer le switch." },
            { text: "Réinitialiser le switch défaillant en appuyant sur le bouton reset", correct: false, feedback: "Un switch avec une odeur de brûlé a subi un dommage électrique — aucun reset ne pourra le faire fonctionner à nouveau. Tenter de l'alimenter à nouveau pourrait aggraver les dégâts ou créer un risque électrique." }
          ],
          hint: "Config switch HP Aruba 1930 sauvegardée sur le serveur de gestion réseau (TFTP/SCP). Commande pour charger la config : 'copy tftp startup-config <IP-TFTP> <fichier-config>'. Vérifier les sauvegardes régulières des configurations des équipements réseau actifs.",
          callerReply: "J'ai déployé le switch spare avec la config sauvegardée depuis notre serveur TFTP. L'étage est revenu en ligne en 25 minutes. Le nouveau switch est branché directement sur une prise protégée en attendant le remplacement de l'onduleur. Post-incident : on va revoir la protection parafoudre de toute l'armoire réseau."
        }
      ]
    },

    // --- Réseau: Latence élevée vers le datacenter ---
    {
      id: 'network-high-latency-datacenter',
      category: 'Réseau',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'concerned',
      issue: 'Latence élevée détectée vers le datacenter — applications métier très lentes depuis 1 heure',
      terminalContext: {
        hostname: 'CORE-SW01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.253'
      },
      messages: [
        { from: 'caller', text: "Alerte — depuis 1 heure les utilisateurs signalent que toutes les applications métier sont très lentes : ERP, messagerie interne, bases de données. La latence vers le datacenter (DC-PROD à 10.0.1.0/24) est anormalement élevée. En temps normal on est à 2-3ms, là je vois des pics à 180-250ms." },
        { from: 'caller', text: "Le réseau local LAN semble normal — la latence entre les postes et le switch core est bonne. Le problème est clairement entre nous et le datacenter. J'ai besoin de localiser le saut problématique avant d'appeler l'opérateur." }
      ],
      steps: [
        {
          question: "Latence élevée vers le datacenter (180-250ms au lieu de 2-3ms), LAN normal. Quelle commande pour localiser le saut réseau problématique ?",
          options: [
            { text: "tracert 10.0.1.1 — pour mesurer la latence à chaque saut entre le site et le datacenter et identifier où la latence augmente", correct: true, feedback: "Correct ! tracert (traceroute) envoie des paquets avec des TTL croissants et mesure le temps de réponse de chaque saut réseau. En comparant les latences saut par saut, vous identifiez précisément où la dégradation commence : si le saut 1 (routeur de sortie) est à 1ms et le saut 2 (lien WAN opérateur) est à 180ms, le problème est sur le lien WAN. C'est l'outil indispensable pour localiser une dégradation de performance réseau." },
            { text: "ping 10.0.1.1 — pour mesurer la latence globale vers le datacenter", correct: false, feedback: "ping confirme qu'il y a un problème de latence mais ne localise pas où. tracert est nécessaire pour identifier le saut problématique et orienter l'action corrective vers le bon équipement ou le bon opérateur." },
            { text: "ipconfig /all — pour vérifier la configuration réseau du poste d'administration", correct: false, feedback: "ipconfig /all montre la configuration IP locale — cela n'aide pas à localiser une dégradation de latence entre deux sites réseau." },
            { text: "netstat -an — pour lister les connexions actives et détecter une saturation", correct: false, feedback: "netstat liste les connexions locales — utile pour détecter des connexions suspectes, mais pas pour localiser un problème de latence inter-sites. tracert est l'outil approprié." }
          ],
          hint: "tracert 10.0.1.1 dans CMD. Analyser chaque ligne : l'adresse IP du saut, les 3 mesures de latence RTT. Un saut normal < 5ms (LAN), < 20ms (WAN régional). Un saut avec latence > 50ms ou '* * *' (timeout) indique le point problématique.",
          terminalCommand: "tracert 10.0.1.1",
          callerReply: "Résultat tracert : saut 1 (routeur de sortie 192.168.1.254) = 1ms, saut 2 (interface WAN opérateur 203.0.113.1) = 185ms, sauts suivants = 190ms. La dégradation commence clairement au saut 2 — c'est le lien WAN opérateur qui est problématique."
        },
        {
          question: "La latence élevée est localisée sur le lien WAN opérateur (saut 2 : 185ms). Comment gérer la situation ?",
          options: [
            { text: "Contacter immédiatement l'opérateur WAN avec le tracert comme preuve, surveiller l'utilisation du lien WAN sur le routeur, et identifier si un flux inhabituel sature le lien", correct: true, feedback: "Procédure complète : 1) Surveillance — consulter les statistiques du routeur WAN (interface SNMP, dashboard opérateur, ou routeur CLI : show interfaces) pour voir l'utilisation du lien en temps réel. Une saturation du lien WAN explique la latence élevée. 2) Identification du flux — netstat ou un outil de surveillance réseau (ntopng, PRTG) peut révéler une application qui consomme toute la bande passante WAN (backup non planifié, transfert massif, ransomware). 3) Ticket opérateur — avec le tracert horodaté comme preuve, ouvrir un ticket d'incident chez l'opérateur avec le niveau de service contractuel (SLA)." },
            { text: "Redémarrer le routeur de sortie — un bug de firmware cause la latence élevée", correct: false, feedback: "Redémarrer le routeur couperait tout le trafic vers le datacenter pendant plusieurs minutes — impact critique sur les applications métier. De plus, si le problème est chez l'opérateur, redémarrer votre équipement ne changera rien." },
            { text: "Réduire la MTU des paquets sur le routeur pour améliorer la transmission", correct: false, feedback: "Réduire la MTU est une optimisation pour les problèmes de fragmentation, pas pour la latence élevée sur un lien WAN. Si la latence vient d'une congestion ou d'un problème chez l'opérateur, la MTU n'y changera rien." },
            { text: "Basculer tout le trafic sur la connexion internet de secours (backup WAN)", correct: false, feedback: "Si un backup WAN existe, c'est une option de continuité valide — mais seulement après avoir documenté le problème avec le tracert et ouvert un ticket chez l'opérateur. Ne pas signaler l'incident à l'opérateur empêche la résolution du problème principal." }
          ],
          hint: "Sur le routeur (Cisco/Juniper) : 'show interfaces <WAN-interface>' pour voir In/Out rate. Si utilisation > 80% : identifier les flux avec 'show ip cache flow' (NetFlow) ou contacter l'opérateur pour vérifier l'état de leur infrastructure. Ticket opérateur : noter heure de début, tracert, SLA contractuel.",
          callerReply: "J'ai vérifié le routeur — le lien WAN est à 97% d'utilisation en sortie ! Un job de backup nocturne a été déclenché manuellement ce matin par erreur et transfère 2 To vers le datacenter. J'ai stoppé le backup. Latence revenue à 3ms en 2 minutes. On ajoutera une limite de bande passante sur les backups manuels."
        }
      ]
    },

    // --- Réseau: DNS — impossible de résoudre les noms internes ---
    {
      id: 'network-dns-internal-failure',
      category: 'Réseau',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'alarmed',
      issue: 'DNS interne hors service — impossible de résoudre les noms internes (CORP.LOCAL)',
      terminalContext: {
        hostname: 'DC01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.1'
      },
      messages: [
        { from: 'caller', text: "Alerte critique — depuis 15 minutes les utilisateurs ne peuvent plus accéder aux ressources internes par leur nom : \\\\SRV-FILES ne répond plus, dc01.corp.local non résolu, les applications qui utilisent des noms DNS internes sont toutes en erreur. Par contre les accès par IP directe fonctionnent." },
        { from: 'caller', text: "Le service DNS tourne sur DC01 (192.168.1.1). Les postes ont bien DC01 comme serveur DNS primaire. J'ai fait un nslookup depuis un poste client et j'obtiens un timeout. Le serveur DC01 lui-même répond au ping. Quelque chose cloche côté service DNS sur DC01." }
      ],
      steps: [
        {
          question: "DNS interne hors service, nslookup timeout, DC01 pingable. Quelle est la première action sur DC01 ?",
          options: [
            { text: "Vérifier l'état du service DNS sur DC01 avec sc query DNS ou dans services.msc", correct: true, feedback: "Correct ! Les symptômes sont clairs : DC01 est joignable (ping ok) mais ne répond pas aux requêtes DNS (nslookup timeout). La cause la plus probable : le service DNS Windows (DNS Server) est arrêté sur DC01. La commande sc query DNS (ou sc query 'DNS') affiche l'état du service en temps réel. Si l'état est STOPPED, un sc start DNS ou net start DNS rétablit immédiatement le service." },
            { text: "Redémarrer DC01 — seul un redémarrage complet peut rétablir le service DNS", correct: false, feedback: "Redémarrer un contrôleur de domaine est une action à fort impact : interruption de l'authentification LDAP, des GPO, de la réplication AD. Si seul le service DNS est arrêté, le redémarrer en isolation est bien moins risqué et prend 5 secondes au lieu de 5 minutes." },
            { text: "Reconfigurer les serveurs DNS sur tous les postes clients pour pointer vers un DNS externe", correct: false, feedback: "Pointer vers un DNS externe résoudrait les noms internet mais pas les noms internes (corp.local, SRV-FILES, etc.) qui n'existent que dans les zones DNS internes. Ce contournement ne résoudrait pas le problème des applications métier." },
            { text: "Installer un nouveau serveur DNS sur un autre serveur en urgence", correct: false, feedback: "Déployer un nouveau serveur DNS prend bien plus de temps que de redémarrer le service existant. De plus, les zones DNS internes sont stockées dans l'AD — un nouveau serveur nécessiterait une configuration complète." }
          ],
          hint: "Sur DC01 : sc query DNS (CMD) ou services.msc → chercher 'Serveur DNS'. Si état = STOPPED : sc start DNS ou net start DNS. Vérifier aussi les logs Observateur d'événements → Applications et services → DNS → Operational pour voir pourquoi le service s'est arrêté.",
          terminalCommand: "sc query DNS",
          callerReply: "Confirmé : sc query DNS retourne 'STATE : 1 STOPPED'. Le service DNS est bien arrêté. J'ai tapé net start DNS — le service démarre. Je teste immédiatement avec nslookup depuis un poste client."
        },
        {
          question: "Service DNS redémarré, nslookup fonctionne à nouveau. Comment valider la restauration complète et prévenir une récidive ?",
          options: [
            { text: "Tester la résolution des noms critiques (dc01.corp.local, SRV-FILES, intranet), vérifier les logs Observateur d'événements pour identifier la cause de l'arrêt, et s'assurer que DC02 est configuré comme DNS secondaire", correct: true, feedback: "Validation complète : 1) Tests fonctionnels — nslookup dc01.corp.local, nslookup SRV-FILES, nslookup intranet.corp.local depuis plusieurs postes. 2) Cause racine — Observateur d'événements → DNS → Operational : chercher l'événement qui précède l'arrêt (erreur de zone, crash mémoire, arrêt manuel accidentel). 3) Résilience — vérifier que DC02 est bien configuré comme serveur DNS secondaire avec les zones répliquées. Si DC01 tombe, DC02 doit prendre le relais automatiquement. 4) Monitoring — configurer une alerte sur l'état du service DNS (PRTG, Zabbix, Windows Admin Center)." },
            { text: "Documenter l'incident et considérer que le problème est résolu", correct: false, feedback: "Documenter est nécessaire mais insuffisant. Identifier la cause de l'arrêt est essentiel pour éviter la récidive. Et vérifier la résilience DNS (DC02 comme secondaire) est une action préventive critique — si cela se reproduit pendant une indisponibilité de DC01, tout le réseau sera hors service à nouveau." },
            { text: "Changer le service DNS en démarrage automatique pour éviter qu'il s'arrête", correct: false, feedback: "Le service DNS est normalement déjà en démarrage automatique. S'il s'est arrêté, c'est probablement dû à une erreur (crash, conflit) — corriger seulement le type de démarrage sans identifier la cause laisse le problème sous-jacent non traité." },
            { text: "Migrer toutes les zones DNS vers un serveur DNS externe pour plus de fiabilité", correct: false, feedback: "Les zones DNS internes (corp.local) intégrées à l'Active Directory ne doivent pas être migrées vers un DNS externe — elles contiennent des enregistrements sensibles (DC, serveurs, SRV records AD) et doivent rester dans l'infrastructure interne." }
          ],
          hint: "Validation DNS depuis un poste : nslookup dc01.corp.local 192.168.1.1 (forcer DC01 comme serveur). Vérifier DC02 : nslookup dc01.corp.local 192.168.1.2. Observateur d'événements sur DC01 : Windows Logs → System → filtrer source 'DNS-Server-Service' pour voir les erreurs précédant l'arrêt.",
          callerReply: "Tests DNS validés — tous les noms internes se résolvent correctement. Dans les logs, j'ai trouvé une erreur 'DNS zone data file corrupted' — un script de maintenance a écrit dans le mauvais répertoire. DC02 est bien secondaire et aurait dû prendre le relais mais il n'était pas configuré comme DNS de secours sur les postes clients. On corrige ça maintenant."
        }
      ]
    },

    // --- AD/GPO: OU incorrecte — mauvaise GPO appliquée sur un poste ---
    {
      id: 'ad-wrong-ou-gpo',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'concerned',
      issue: 'OU incorrecte sur un poste — mauvaise GPO appliquée (restrictions logicielles intempestives)',
      terminalContext: {
        hostname: 'PC-TEST-01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.120',
        gpoBroken: true
      },
      messages: [
        { from: 'caller', text: "Bonjour, c'est l'admin réseau. Un poste du service IT (PC-TEST-01) a des restrictions logicielles qui ne devraient pas être là : impossible d'ouvrir PowerShell, les outils d'administration sont bloqués. Ce poste vient d'être réintégré au domaine après une réinstallation." },
        { from: 'caller', text: "Les autres postes IT n'ont aucun problème. Après une réintégration au domaine, il est possible que le poste ait atterri dans la mauvaise OU. Si c'est le cas, la GPO restrictive du département Commercial s'appliquerait à ce poste IT." }
      ],
      steps: [
        {
          question: "Poste avec GPO incorrecte après réintégration au domaine. Comment vérifier les GPO réellement appliquées et l'OU du poste ?",
          options: [
            { text: "gpresult /r sur le poste — affiche les GPO appliquées, l'OU du compte ordinateur et les groupes de sécurité", correct: true, feedback: "Correct ! gpresult /r (Resultant Set of Policy) est l'outil de référence pour diagnostiquer les problèmes GPO. Il affiche : l'OU dans laquelle se trouve le compte ordinateur, la liste des GPO appliquées (avec leur lien OU), et les GPO filtrées. En une commande, vous savez exactement quelle GPO est appliquée et pourquoi — indispensable avant de modifier quoi que ce soit dans l'AD." },
            { text: "Réinstaller Windows — la réintégration au domaine a corrompu les paramètres GPO", correct: false, feedback: "La réinstallation est une mesure radicale non justifiée. Une mauvaise OU se corrige en déplaçant le compte ordinateur dans l'AD — opération qui prend 30 secondes, sans perte de données ni interruption prolongée." },
            { text: "Désactiver toutes les GPO du domaine pour restaurer le fonctionnement normal", correct: false, feedback: "Désactiver toutes les GPO du domaine supprimerait toutes les politiques de sécurité pour l'ensemble des utilisateurs et postes — impact catastrophique sur l'infrastructure. Le problème est limité à un seul poste mal placé dans une OU." },
            { text: "Créer une nouvelle GPO spécifique pour PC-TEST-01 avec les paramètres IT corrects", correct: false, feedback: "Créer des GPO par poste individuel est une mauvaise pratique d'administration AD — c'est ingérable à l'échelle. La solution correcte est de placer le poste dans la bonne OU pour que les GPO existantes s'appliquent correctement." }
          ],
          hint: "gpresult /r dans CMD (en tant qu'admin). Chercher la section 'ORDINATEUR' → 'Objet stratégie de groupe appliqués' pour voir les GPO actives, et 'Nom du site' / 'Domaine' pour l'OU. Pour un rapport HTML détaillé : gpresult /h C:\\rapport-gpo.html",
          terminalCommand: "gpresult /r",
          callerReply: "gpresult /r confirme : 'Unité organisationnelle : CN=PC-TEST-01,OU=Commercial,DC=CORP,DC=LOCAL'. Le poste est dans OU=Commercial au lieu de OU=IT. La GPO 'Commercial-Restrictions-Logicielles' s'applique alors qu'elle ne devrait pas."
        },
        {
          question: "PC-TEST-01 est dans OU=Commercial. Comment le déplacer dans OU=IT et appliquer les bonnes GPO ?",
          options: [
            { text: "Dans Active Directory Utilisateurs et Ordinateurs, déplacer PC-TEST-01 vers OU=IT, puis exécuter gpupdate /force sur le poste pour appliquer immédiatement les nouvelles GPO", correct: true, feedback: "Procédure correcte : 1) Déplacement OU — ADUC (dsa.msc) → localiser PC-TEST-01 dans OU=Commercial → clic droit → Déplacer → sélectionner OU=Informatique (ou OU=IT). 2) Application immédiate — gpupdate /force sur PC-TEST-01 force le téléchargement et l'application des nouvelles GPO sans attendre le cycle de refresh automatique (90 min). 3) Vérification — relancer gpresult /r pour confirmer que les bonnes GPO sont maintenant appliquées. 4) Documentation — noter la cause (réintégration au domaine place le compte dans le CN=Computers par défaut ou dans une OU par défaut incorrecte)." },
            { text: "Modifier la GPO 'Commercial-Restrictions-Logicielles' pour exclure PC-TEST-01 via un filtre de sécurité", correct: false, feedback: "Créer des exceptions par poste dans les GPO existantes complexifie la gestion et crée une dette technique. La bonne approche est de placer le poste dans la bonne OU — c'est le modèle d'administration AD conçu pour cela." },
            { text: "Reconfigurer manuellement tous les paramètres bloqués par la GPO Commercial sur PC-TEST-01", correct: false, feedback: "Reconfigurer manuellement crée un état incohérent — les paramètres seront écrasés par la GPO Commercial au prochain cycle de refresh (90 min). Déplacer le poste dans la bonne OU est la seule solution pérenne." },
            { text: "Quitter le domaine, réinitialiser le compte ordinateur dans l'AD, puis rejoindre le domaine", correct: false, feedback: "Quitter et rejoindre le domaine ne garantit pas que le poste atterrira dans la bonne OU — il reviendra probablement dans la même OU ou dans CN=Computers. Il faut déplacer le compte ordinateur dans l'OU correcte dans l'AD." }
          ],
          hint: "ADUC (dsa.msc) sur DC01 → chercher PC-TEST-01 (Ctrl+F) → clic droit → Déplacer → développer l'arborescence → OU=Informatique (ou OU=IT selon votre arbre AD) → OK. Puis sur PC-TEST-01 : gpupdate /force. Vérifier : gpresult /r → doit afficher OU=IT.",
          terminalCommand: "gpupdate /force",
          callerReply: "J'ai déplacé PC-TEST-01 dans OU=IT et lancé gpupdate /force. Nouveau gpresult /r confirme : 'OU=IT,DC=CORP,DC=LOCAL' et la GPO appliquée est maintenant 'IT-Workstation-Standard'. PowerShell et les outils d'administration fonctionnent à nouveau. Je vais documenter qu'après une réintégration au domaine, il faut toujours vérifier l'OU du nouveau compte ordinateur."
        }
      ]
    },

    // --- AD/GPO: Compte de service expiré — application indisponible ---
    {
      id: 'ad-service-account-expired',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'hard',
      caller: 'Olivier Martin',
      dept: 'IT / Helpdesk',
      mood: 'alarmed',
      issue: 'Compte de service AD expiré — application métier indisponible depuis ce matin',
      terminalContext: {
        hostname: 'SRV-APP01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.200'
      },
      messages: [
        { from: 'caller', text: "Alerte — l'application de gestion des stocks est inaccessible depuis 7h ce matin. Le service Windows de l'application démarre (état 'En cours d'exécution') mais l'application renvoie une erreur d'authentification. Le serveur SRV-APP01 est up et répond normalement." },
        { from: 'caller', text: "Aucune intervention n'a eu lieu sur ce serveur ce week-end. La dernière fois que ça a marché c'est hier soir 23h. Ce type d'erreur d'authentification sur un service Windows me fait penser à un problème de compte de service AD." }
      ],
      steps: [
        {
          question: "Service Windows démarré mais application en erreur d'authentification. Comment identifier le compte de service problématique ?",
          options: [
            { text: "Vérifier l'Observateur d'événements Windows sur SRV-APP01 — filtrer les événements ID 4625 (échec d'ouverture de session) pour identifier le compte en échec", correct: true, feedback: "Correct ! L'événement ID 4625 'Échec d'ouverture de session' dans les logs de sécurité Windows liste le nom du compte, la raison de l'échec (mot de passe expiré, compte désactivé, compte verrouillé) et l'heure. Sur un serveur applicatif, les services s'authentifient au démarrage avec leur compte de service AD — un mot de passe expiré produit exactement ces symptômes : service démarré (en mémoire) mais authentification refusée lors des accès aux ressources AD." },
            { text: "Redémarrer le service Windows de l'application — il est peut-être dans un état intermédiaire", correct: false, feedback: "Si le compte de service a son mot de passe expiré, redémarrer le service ne changera rien — il tentera de s'authentifier avec les mêmes credentials expirés et échouera de la même façon. Identifiez d'abord le compte en cause via les logs d'événements." },
            { text: "Réinstaller l'application — une mise à jour corrompue bloque l'authentification", correct: false, feedback: "Une réinstallation sans diagnostic peut prendre des heures et ne résoudra pas un problème de compte AD. L'Observateur d'événements donne la cause exacte en 2 minutes." },
            { text: "Vérifier si le serveur Active Directory DC01 est accessible depuis SRV-APP01", correct: false, feedback: "Si DC01 était inaccessible, tous les services et applications du domaine seraient en erreur simultanément. Comme c'est isolé à cette application, la cause est spécifique à son compte de service, pas à la connectivité AD globale." }
          ],
          hint: "Observateur d'événements → Journaux Windows → Sécurité → Filtrer le journal → ID d'événement : 4625. Chercher les événements de ce matin autour de 7h. Le champ 'Nom du compte' indique le compte de service en échec, le champ 'Raison' donne la cause précise.",
          callerReply: "ID 4625 trouvé à 7h02 : Nom du compte : 'svc-stockapp', Raison : 'Le mot de passe du compte a expiré'. C'est bien le compte de service de l'application de stocks. Son mot de passe a expiré cette nuit selon la politique de 90 jours."
        },
        {
          question: "Compte svc-stockapp — mot de passe expiré. Comment résoudre et prévenir ce type d'incident récurrent ?",
          options: [
            { text: "Réinitialiser le mot de passe de svc-stockapp dans AD, mettre à jour le mot de passe dans la configuration du service Windows sur SRV-APP01, et activer l'option 'Le mot de passe n'expire jamais' sur ce compte de service", correct: true, feedback: "Procédure complète : 1) Réinitialisation — ADUC → svc-stockapp → Réinitialiser le mot de passe (noter le nouveau mot de passe). 2) Mise à jour du service — SRV-APP01 → services.msc → service de l'application → Propriétés → Connexion → mettre le nouveau mot de passe. 3) Prévention — ADUC → svc-stockapp → Propriétés → Compte → cocher 'Le mot de passe n'expire jamais'. Les comptes de service ne doivent pas avoir de mot de passe expirant — ils ne peuvent pas le changer eux-mêmes. En entreprise, utiliser des Managed Service Accounts (MSA) ou Group Managed Service Accounts (gMSA) élimine ce problème : le mot de passe est géré automatiquement par l'AD." },
            { text: "Supprimer le compte svc-stockapp et créer un nouveau compte de service", correct: false, feedback: "Supprimer le compte efface toutes ses permissions dans l'AD et sur les ressources (dossiers, bases de données, etc.) — il faudrait les reconfigurer entièrement. Réinitialiser le mot de passe du compte existant préserve toutes les permissions." },
            { text: "Désactiver la politique d'expiration des mots de passe pour tous les utilisateurs du domaine", correct: false, feedback: "Désactiver l'expiration pour tous les utilisateurs est une faille de sécurité majeure non justifiée. Seuls les comptes de service doivent avoir l'option 'Le mot de passe n'expire jamais' — activée individuellement, pas en supprimant la politique globale." },
            { text: "Configurer l'application pour utiliser le compte SYSTEM local à la place du compte de service AD", correct: false, feedback: "Le compte SYSTEM local n'a pas accès aux ressources réseau et Active Directory — bases de données, partages réseau, etc. Une application multi-tiers doit utiliser un compte de service AD dédié. Utiliser SYSTEM créerait de nouveaux problèmes d'accès." }
          ],
          hint: "ADUC → svc-stockapp → clic droit → Réinitialiser le mot de passe → noter le nouveau mot de passe. Sur SRV-APP01 : services.msc → service de l'app → Propriétés → onglet 'Connexion' → saisir le nouveau mot de passe → OK → redémarrer le service. Vérifier l'Observateur d'événements : plus d'ID 4625.",
          callerReply: "Mot de passe réinitialisé dans AD, mis à jour dans le service Windows. L'application de gestion des stocks est revenue en ligne. J'ai aussi activé 'Le mot de passe n'expire jamais' sur svc-stockapp. Et je vais auditer tous les comptes de service du domaine pour éviter que ça se reproduise sur d'autres applications."
        }
      ]
    },

    // --- AD/GPO: Synchronisation Azure AD Connect non fonctionnelle ---
    {
      id: 'ad-azure-connect-sync-failed',
      category: 'AD/GPO',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT / Helpdesk',
      mood: 'alarmed',
      issue: 'Azure AD Connect — synchronisation AD vers Azure AD bloquée depuis plusieurs heures',
      terminalContext: {
        hostname: 'SRV-AADCONNECT', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.20'
      },
      messages: [
        { from: 'caller', text: "Alerte — Azure AD Connect ne synchronise plus depuis ce matin. Les nouveaux comptes créés dans l'AD local n'apparaissent pas dans Azure AD / Microsoft 365. Le responsable RH signale que 3 nouvelles recrues ne peuvent pas se connecter à leurs outils M365." },
        { from: 'caller', text: "Le serveur SRV-AADCONNECT est up. La sync devrait tourner toutes les 30 minutes mais dans le portail Azure j'ai une alerte 'Dernière synchronisation : il y a plus de 24 heures'. Il faut rétablir la sync rapidement." }
      ],
      steps: [
        {
          question: "Azure AD Connect ne synchronise plus depuis 24h. Comment diagnostiquer précisément l'erreur de synchronisation ?",
          options: [
            { text: "Ouvrir Synchronization Service Manager (miisclient.exe) sur SRV-AADCONNECT et examiner les erreurs dans les Operations et les Connectors", correct: true, feedback: "Correct ! Synchronization Service Manager (miisclient.exe) est l'outil de diagnostic natif d'Azure AD Connect. Il affiche : l'état de chaque connecteur (AD DS local et Azure AD), les erreurs précises des dernières opérations, et les objets en erreur. Les erreurs courantes visibles ici : 'stopped-server-down' (compte AD DS verrouillé/expiré), 'stopped-extension-dll-exception' (problème de configuration), ou 'stopped-connectivity' (problème réseau/firewall vers Azure AD)." },
            { text: "Désinstaller et réinstaller Azure AD Connect — une mise à jour a corrompu la synchronisation", correct: false, feedback: "La réinstallation d'Azure AD Connect est une opération lourde qui efface la configuration de synchronisation. Sans diagnostic préalable, vous risquez de résoudre un simple problème de compte avec une opération d'une heure. Synchronization Service Manager donne la cause précise en 30 secondes." },
            { text: "Supprimer tous les utilisateurs dans Azure AD et forcer une synchronisation complète depuis l'AD local", correct: false, feedback: "Supprimer des utilisateurs Azure AD désactiverait immédiatement leurs licences M365, effacerait leurs paramètres et pourrait entraîner une perte de données Exchange Online. C'est une action catastrophique à ne jamais effectuer sans instructions explicites de Microsoft." },
            { text: "Vérifier si le pare-feu bloque les connexions HTTPS sortantes vers Azure AD", correct: false, feedback: "Un problème de firewall est possible mais moins fréquent qu'un problème de compte de synchronisation. Commencez par Synchronization Service Manager qui donne l'erreur précise — si elle indique 'stopped-connectivity', alors vérifiez le réseau." }
          ],
          hint: "Sur SRV-AADCONNECT : miisclient.exe (dans le menu démarrer ou C:\\Program Files\\Microsoft Azure AD Sync\\UIShell\\). Onglet 'Operations' → voir les dernières exécutions. Onglet 'Connectors' → vérifier l'état du connecteur 'corp.local' (AD DS). Un état rouge indique l'erreur.",
          callerReply: "Synchronization Service Manager ouvert. Le connecteur 'corp.local (AD DS)' affiche l'état 'stopped-server-down'. En détail de l'erreur : 'The account used to connect to the Active Directory Domain Services forest is either incorrect or does not have permissions to perform the operation. Le compte MSOL_xxxxxx est verrouillé'."
        },
        {
          question: "Compte de synchronisation AD DS (MSOL_xxxxxx) verrouillé. Comment rétablir la synchronisation correctement ?",
          options: [
            { text: "Déverrouiller le compte MSOL dans AD, configurer 'Le mot de passe n'expire jamais' et 'Le compte ne peut pas être verrouillé', puis forcer une synchronisation avec Start-ADSyncSyncCycle -PolicyType Delta", correct: true, feedback: "Procédure complète : 1) Déverrouillage — ADUC → compte MSOL_xxxxxx → décocher 'Le compte est verrouillé'. 2) Protection — ce compte ne doit jamais expirer ni se verrouiller : ADUC → Propriétés → cocher 'Le mot de passe n'expire jamais' + configurer la fine-grained password policy pour exclure ce compte du verrouillage automatique. 3) Sync forcée — PowerShell sur SRV-AADCONNECT : Start-ADSyncSyncCycle -PolicyType Delta (sync des changements récents) ou -PolicyType Initial (sync complète si nécessaire). 4) Vérification — portail Azure AD → Azure AD Connect → Last sync doit afficher l'heure actuelle." },
            { text: "Créer un nouveau compte de synchronisation et reconfigurer Azure AD Connect", correct: false, feedback: "Recréer un compte de sync nécessite de reconfigurer Azure AD Connect avec les nouvelles credentials, ce qui peut prendre 30-60 minutes et risque d'introduire des erreurs. Déverrouiller le compte existant est beaucoup plus rapide et sûr." },
            { text: "Redémarrer le serveur SRV-AADCONNECT — le redémarrage déverrouillera le compte automatiquement", correct: false, feedback: "Redémarrer le serveur ne déverrouille pas les comptes AD — le verrouillage de compte est géré par le contrôleur de domaine, pas par le serveur local. Après redémarrage, Azure AD Connect tentera à nouveau de se connecter avec le compte toujours verrouillé et échouera." },
            { text: "Désactiver temporairement Azure AD Connect et créer les comptes M365 manuellement", correct: false, feedback: "Créer des comptes manuellement dans Azure AD désynchronise l'AD local et Azure AD — les deux annuaires auront des états différents, ce qui crée des conflits à la prochaine synchronisation. La résolution du blocage (déverrouillage du compte) est la seule approche correcte." }
          ],
          hint: "ADUC → chercher MSOL_xxxxxx (le préfixe MSOL suivi d'un identifiant alphanumérique) → décocher 'Le compte est verrouillé'. PowerShell sur SRV-AADCONNECT (en admin) : Import-Module ADSync ; Start-ADSyncSyncCycle -PolicyType Delta. Vérifier dans le portail Azure : Azure Active Directory → Azure AD Connect → Dernière synchronisation.",
          callerReply: "Compte MSOL déverrouillé et Start-ADSyncSyncCycle lancé. 3 minutes plus tard, le portail Azure affiche 'Dernière synchronisation : il y a 1 minute'. Les 3 nouveaux comptes RH apparaissent maintenant dans Azure AD. Je vais configurer une alerte sur le verrouillage du compte MSOL pour prévenir la prochaine fois."
        }
      ]
    },

    // --- SÉCURITÉ: Ransomware — containment et réponse à incident ---
    {
      id: 'security-ransomware-containment',
      category: 'Sécurité',
      level: 2,
      difficulty: 'hard',
      caller: 'Admin Réseau',
      dept: 'IT',
      mood: 'panicked',
      issue: 'Alerte ransomware — postes chiffrés, propagation en cours sur le réseau',
      terminalContext: {
        hostname: 'PC-IT-ADMIN-01', username: 'admin.reseau',
        domain: 'CORP.LOCAL', ip: '192.168.1.5',
        serverShareOK: false
      },
      messages: [
        { from: 'caller', text: "ALERTE ! J'ai une dizaine de PC dans l'open space qui affichent des écrans rouges avec une demande de rançon en bitcoins. Le serveur de fichiers SRV-FILES est aussi touché — tous les fichiers partagés ont une extension bizarre (.locked). L'attaque est en cours, ça se propage de PC en PC." },
        { from: 'caller', text: "J'ai déjà coupé physiquement 3 PC de la prise réseau. Le serveur de fichiers est toujours allumé et connecté. J'ai l'impression que ça vient d'un e-mail avec une pièce jointe Word que plusieurs personnes ont ouvert ce matin. Qu'est-ce que je fais ?" }
      ],
      steps: [
        {
          question: "Ransomware actif, propagation en cours. Quelle est la priorité absolue dans la première minute ?",
          options: [
            { text: "Identifier et supprimer le malware avec l'antivirus avant de couper le réseau", correct: false, feedback: "Tenter de supprimer le malware pendant qu'il est actif est inefficace — l'antivirus peut être désactivé par le ransomware, et pendant la tentative de nettoyage le chiffrement et la propagation continuent. L'isolation réseau d'abord, le nettoyage ensuite." },
            { text: "Isoler tous les systèmes touchés du réseau immédiatement — débrancher les câbles Ethernet, désactiver les switches des zones affectées, couper le Wi-Fi d'entreprise", correct: true, feedback: "Correct ! La priorité numéro 1 est de stopper la propagation. Un ransomware se propage via des partages SMB, des vulnérabilités non corrigées, ou des credentials volés. Chaque seconde compte — chaque PC encore connecté peut chiffrer ses fichiers et propager le malware. Couper le réseau physiquement (câbles, ports switch) est plus fiable que d'arrêter les services un par un." },
            { text: "Payer la rançon rapidement pour récupérer les fichiers avant que plus de dégâts ne soient causés", correct: false, feedback: "Ne jamais payer la rançon — rien ne garantit que la clé de déchiffrement sera fournie, et le paiement finance les groupes criminels. Même après déchiffrement, le malware reste souvent présent. La récupération via les sauvegardes est la seule approche fiable et recommandée par l'ANSSI et le CERT-FR." },
            { text: "Éteindre immédiatement SRV-FILES pour stopper le chiffrement des fichiers partagés", correct: false, feedback: "Éteindre le serveur interrompt le chiffrement actif sur ce serveur, mais ne fait rien pour les PC qui continuent à se propager sur le réseau. De plus, un arrêt brutal peut corrompre le système de fichiers et compliquer la récupération. L'isolation réseau couvre à la fois le serveur et les postes." }
          ],
          hint: "Actions physiques immédiates : débrancher tous les câbles RJ45 des PC affichant l'écran de rançon, puis des PC voisins potentiellement infectés. Si vous avez accès aux switches managés : désactiver les ports des zones affectées via l'interface d'administration.",
          terminalCommand: "net use",
          callerReply: "J'ai déconnecté physiquement tous les PC de l'open space et le serveur de fichiers du réseau. Le switch du 2e étage est aussi coupé. La propagation semble stoppée. Que faire maintenant ?"
        },
        {
          question: "Réseau isolé, propagation stoppée. Quelle est l'étape suivante ?",
          options: [
            { text: "Notifier immédiatement la Direction et le RSSI, contacter l'ANSSI/CERT-FR pour signaler l'incident, et préserver les preuves sans modifier les systèmes touchés", correct: true, feedback: "Escalade obligatoire : un ransomware est un incident majeur. 1) Direction — décision de déclarer une crise, activer le Plan de Continuité d'Activité (PCA). 2) RSSI — prise en charge de la réponse à incident. 3) ANSSI / CERT-FR (cert.ssi.gouv.fr) — signalement obligatoire pour les entreprises soumises à NIS2, assistance technique disponible. 4) Préservation des preuves — ne pas éteindre les machines touchées (mémoire = preuves), ne pas tenter de réinstaller, photographier les écrans de rançon." },
            { text: "Commencer immédiatement la réinstallation de Windows sur tous les PC touchés", correct: false, feedback: "La réinstallation avant investigation détruit les preuves forensiques pour identifier le patient zéro, comprendre le vecteur d'attaque, et déterminer si des données ont été exfiltrées. Attendez l'accord du RSSI et que les preuves aient été préservées avant toute restauration." },
            { text: "Rétablir le réseau et tester si le ransomware est toujours actif", correct: false, feedback: "Rétablir la connexion réseau de machines potentiellement encore infectées relancerait immédiatement la propagation. Le réseau ne doit être rétabli qu'après nettoyage complet de chaque machine par des équipes spécialisées." },
            { text: "Identifier le patient zéro en cherchant l'e-mail avec la pièce jointe Word dans tous les Outlook", correct: false, feedback: "Identifier le patient zéro est important mais pas la priorité immédiate. La notification de la Direction et le signalement réglementaire ont des délais légaux (72h pour le RGPD si des données personnelles sont impliquées). L'investigation forensique vient après la notification." }
          ],
          hint: "Numéros à contacter : RSSI sur portable, Direction (DG ou DSI). CERT-FR : cert.ssi.gouv.fr — formulaire de signalement en ligne. Si des données personnelles ont été exfiltrées : notification CNIL obligatoire sous 72h.",
          callerReply: "RSSI et Direction alertés. La cellule de crise est activée. L'ANSSI a été contactée. Maintenant on a besoin de savoir comment récupérer nos données — on a des sauvegardes sur une NAS externe déconnectée. Comment procéder ?"
        },
        {
          question: "Cellule de crise activée. Comment évaluer l'étendue des dommages avant la récupération ?",
          options: [
            { text: "Restaurer immédiatement depuis la dernière sauvegarde disponible sur tous les systèmes touchés", correct: false, feedback: "Restaurer avant évaluation peut restaurer vers une sauvegarde déjà compromise (si l'infection était latente), ou restaurer sur des systèmes non nettoyés où le malware pourrait rechiffrer les fichiers restaurés. Évaluez d'abord, puis restaurez selon un plan structuré." },
            { text: "Inventorier les systèmes touchés, vérifier l'intégrité et l'accessibilité des sauvegardes sur la NAS externe, et identifier la date du dernier backup sain avant l'infection", correct: true, feedback: "Avant de restaurer : 1) Inventaire des dégâts — quels PC, quels serveurs, quels partages réseau sont chiffrés. L'étendue détermine le temps de récupération. 2) Vérifier les sauvegardes — sont-elles accessibles ? Non chiffrées ? Attention : les ransomwares ciblent en priorité les sauvegardes montées en lecteur réseau. 3) Identifier la date exacte de l'infection via les logs antivirus ou les horodatages des fichiers chiffrés — pour restaurer une sauvegarde antérieure à l'infection." },
            { text: "Utiliser un outil de déchiffrement en ligne pour récupérer les fichiers sans utiliser les sauvegardes", correct: false, feedback: "Il existe parfois des outils de déchiffrement pour des ransomwares connus (nomoreransom.org), mais cela dépend de la variante. Ne perdez pas de temps sur un outil qui peut ne pas exister — si vous avez des sauvegardes intègres, la restauration est la voie la plus fiable." },
            { text: "Rétablir d'abord les services critiques en mode dégradé (connexions locales, sans réseau)", correct: false, feedback: "Faire fonctionner des systèmes potentiellement infectés en mode dégradé est risqué — le malware peut toujours être actif. La séquence correcte : sauvegardes intègres vérifiées → machines nettoyées ou reconstruites → services rétablis." }
          ],
          hint: "Sur un PC propre (non connecté au réseau compromis) : vérifier la NAS externe. Consulter nomoreransom.org avec l'extension des fichiers chiffrés (.locked) pour identifier la variante et l'existence d'un déchiffreur.",
          terminalCommand: "net use",
          callerReply: "La NAS externe est intègre et non chiffrée ! Dernier backup datant d'hier 22h. L'infection a commencé ce matin vers 8h — les sauvegardes sont saines. L'ANSSI a identifié la variante : LockBit 3.0 déclenché via une macro Word."
        },
        {
          question: "Sauvegardes vérifiées et saines. Quelles mesures mettre en place AVANT de restaurer les systèmes ?",
          options: [
            { text: "Restaurer les données depuis la NAS puis attendre de voir si la situation revient à la normale", correct: false, feedback: "Restaurer sans corriger la vulnérabilité (macros Word activées) et sans changer les credentials compromis expose immédiatement les systèmes restaurés à une re-infection. Les ransomwares modernes exfiltrent les données avant de chiffrer — l'attaquant a peut-être encore accès via des credentials volés." },
            { text: "Installer un meilleur antivirus sur tous les PC avant de restaurer", correct: false, feedback: "Un antivirus plus récent est une bonne mesure de protection future, mais ne suffit pas. La cause de l'infection (macros Office activées) et les potentiels credentials volés doivent être traités structurellement en priorité." },
            { text: "Bloquer les macros Office par GPO pour tous les utilisateurs, patcher les vulnérabilités SMB, changer tous les mots de passe de comptes à privilèges, puis reconstruire les PC depuis des images propres", correct: true, feedback: "Restaurer sans corriger la cause racine = re-infection quasi certaine en quelques heures. Mesures obligatoires avant restauration : 1) Macros Office désactivées par GPO — la cause directe de l'infection. 2) Patch SMB — appliquer les correctifs de sécurité Windows Update. 3) Rotation des credentials — mots de passe de tous les comptes admin (AD, serveurs) car le ransomware peut avoir volé des credentials en mémoire. 4) Images propres — reconstruire depuis des images système vérifiées, pas depuis des machines infectées 'nettoyées'." },
            { text: "Informer les utilisateurs qu'ils ne doivent plus ouvrir les pièces jointes e-mail", correct: false, feedback: "La sensibilisation est nécessaire mais insuffisante comme seule mesure. Les utilisateurs font des erreurs — c'est pour ça que les contrôles techniques existent (GPO macros, filtrage des pièces jointes à la passerelle e-mail). Un incident ransomware nécessite des corrections techniques structurelles." }
          ],
          hint: "GPO macros : gpedit.msc → Configuration ordinateur → Modèles d'administration → Microsoft Office (si ADMX installés) → Sécurité → Bloquer les macros VBA. Rotation des mots de passe admin : ADUC → sélection des comptes admin → Réinitialiser le mot de passe.",
          callerReply: "GPO macros déployée, patch SMB appliqué, tous les mots de passe admin changés. La reconstruction des PC démarre depuis des images propres validées. La NAS est remontée sur un VLAN isolé pour la restauration. En 36 heures, 90% des systèmes sont de nouveau opérationnels. Un rapport post-mortem est en cours pour améliorer notre résilience."
        }
      ]
    }
  ]
};

// ---- HELPERS ----
function getAllScenarios() {
  return [...SCENARIOS.easy, ...SCENARIOS.medium, ...SCENARIOS.hard];
}

function getScenariosByCategory(cat) {
  return getAllScenarios().filter(s => s.category === cat);
}

function getRandomScenario(difficulty) {
  const pool = SCENARIOS[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getScenarioById(id) {
  return getAllScenarios().find(s => s.id === id);
}
