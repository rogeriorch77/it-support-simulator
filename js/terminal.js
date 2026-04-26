/* ============================================
   IT SUPPORT SIMULATOR — Terminal Engine
   Simulates a Windows CMD environment with
   context-aware responses per scenario.
   ============================================ */

const Terminal = (() => {

  // ---- CONTEXT ----
  // Injected per scenario to make commands context-aware
  let ctx = {
    hostname: 'PC-MARKETING-01',
    username: 'marie.dupont',
    domain: 'CORP.LOCAL',
    ip: '192.168.1.45',
    gateway: '192.168.1.1',
    dns1: '192.168.1.10',
    dns2: '8.8.8.8',
    subnet: '255.255.255.0',
    mac: 'A4-C3-F0-12-34-56',
    internetOK: true,
    vpnOK: false,
    dnsOK: true,
    domainJoined: true,
    printerIP: '192.168.1.200',
    printerOK: false,
    adUserLocked: false,
    adPasswordExpired: true,
    gpoBroken: false,
    serverShareOK: false,
    pingFails: [],     // hostnames that fail ping
    services: {}      // service name -> status
  };

  let history = [];
  let histIndex = -1;
  let outputEl = null;
  let inputEl = null;
  let promptEl = null;
  let currentDir = 'C:\\Users\\marie.dupont';

  // ---- SET CONTEXT ----
  function setContext(newCtx) {
    ctx = Object.assign({}, ctx, newCtx);
    currentDir = `C:\\Users\\${ctx.username}`;
    if (promptEl) promptEl.textContent = `${ctx.hostname}>`;
  }

  // ---- INIT ----
  function init(outputSelector, inputSelector, promptSelector) {
    outputEl = document.querySelector(outputSelector);
    inputEl  = document.querySelector(inputSelector);
    promptEl = document.querySelector(promptSelector);

    if (!outputEl || !inputEl) return;

    if (promptEl) promptEl.textContent = `${ctx.hostname}>`;

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = inputEl.value.trim();
        if (cmd) {
          history.unshift(cmd);
          histIndex = -1;
          printPrompt(cmd);
          execute(cmd);
        }
        inputEl.value = '';
      }
      if (e.key === 'ArrowUp') {
        histIndex = Math.min(histIndex + 1, history.length - 1);
        inputEl.value = history[histIndex] || '';
        e.preventDefault();
      }
      if (e.key === 'ArrowDown') {
        histIndex = Math.max(histIndex - 1, -1);
        inputEl.value = histIndex === -1 ? '' : history[histIndex];
        e.preventDefault();
      }
    });

    // Focus on click anywhere in terminal
    outputEl.parentElement.addEventListener('click', () => inputEl.focus());

    printLine('Microsoft Windows [Version 10.0.19045.4046]', '');
    printLine('(c) Microsoft Corporation. All rights reserved.', '');
    printLine('', '');
    printPromptEmpty();
  }

  // ---- OUTPUT HELPERS ----
  function printLine(text, cls = '') {
    if (!outputEl) return;
    const line = document.createElement('div');
    line.className = 'term-line ' + cls;
    line.innerHTML = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printPrompt(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line term-cmd';
    line.innerHTML = `<span class="term-prompt">${ctx.hostname}&gt;</span> ${escHtml(cmd)}`;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printPromptEmpty() {
    // Just scroll
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function blank() { printLine(''); }

  // ---- EXECUTE ----
  function execute(raw) {
    const parts = raw.trim().split(/\s+/);
    const cmd   = parts[0].toLowerCase();
    const args  = parts.slice(1);

    switch (cmd) {
      case 'help':       cmdHelp(); break;
      case 'cls':
      case 'clear':      cmdCls(); break;
      case 'ipconfig':   cmdIpconfig(args); break;
      case 'ping':       cmdPing(args); break;
      case 'tracert':    cmdTracert(args); break;
      case 'nslookup':   cmdNslookup(args); break;
      case 'gpupdate':   cmdGpupdate(args); break;
      case 'net':        cmdNet(parts.slice(1)); break;
      case 'hostname':   cmdHostname(); break;
      case 'whoami':     cmdWhoami(); break;
      case 'sc':         cmdSc(args); break;
      case 'tasklist':   cmdTasklist(); break;
      case 'taskkill':   cmdTaskkill(args); break;
      case 'netstat':    cmdNetstat(args); break;
      case 'arp':        cmdArp(args); break;
      case 'systeminfo': cmdSysteminfo(); break;
      case 'sfc':        cmdSfc(args); break;
      case 'dism':       cmdDism(args); break;
      case 'chkdsk':     cmdChkdsk(args); break;
      case 'dir':        cmdDir(); break;
      case 'cd':         cmdCd(args); break;
      case 'echo':       printLine(args.join(' ')); blank(); break;
      case 'ver':        printLine('Microsoft Windows [Version 10.0.19045.4046]'); blank(); break;
      case 'date':       printLine('Le date du système est : ' + new Date().toLocaleDateString('fr-FR')); blank(); break;
      case 'time':       printLine('Heure actuelle : ' + new Date().toLocaleTimeString('fr-FR')); blank(); break;
      case 'path':       printLine(escHtml('PATH=C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem')); blank(); break;
      case 'set':        cmdSet(); break;
      case 'netsh':      cmdNetsh(args); break;
      case 'nltest':     cmdNltest(args); break;
      case 'dsquery':    cmdDsquery(args); break;
      case 'whoami':     cmdWhoami(); break;
      case 'regedit':    printLine('<span class="term-warn">⚠ regedit — Éditeur de registre ouvert (simulation).</span>'); blank(); break;
      case 'msconfig':   printLine('<span class="term-warn">⚠ msconfig — Configuration système ouverte (simulation).</span>'); blank(); break;
      case 'mstsc':      printLine('<span class="term-info">🖥 mstsc — Bureau à distance lancé (simulation).</span>'); blank(); break;
      case 'eventvwr':   printLine('<span class="term-info">📋 Observateur d\'événements ouvert (simulation).</span>'); blank(); break;
      case 'devmgmt.msc': printLine('<span class="term-info">⚙ Gestionnaire de périphériques ouvert (simulation).</span>'); blank(); break;
      case 'compmgmt.msc': printLine('<span class="term-info">🖥 Gestion de l\'ordinateur ouverte (simulation).</span>'); blank(); break;
      case 'services.msc': cmdServicesMsc(); break;
      case 'lusrmgr.msc': printLine('<span class="term-info">👤 Gestion des utilisateurs locaux ouverte (simulation).</span>'); blank(); break;
      case 'gpedit.msc': printLine('<span class="term-info">📋 Éditeur de stratégie de groupe ouvert (simulation).</span>'); blank(); break;
      case 'dsa.msc':    printLine('<span class="term-info">👥 Active Directory — Utilisateurs et Ordinateurs ouvert (simulation).</span>'); blank(); break;
      case 'dnsmgmt.msc': printLine('<span class="term-info">🌐 Gestionnaire DNS ouvert (simulation).</span>'); blank(); break;
      case 'dhcpmgmt.msc': printLine('<span class="term-info">🌐 Gestionnaire DHCP ouvert (simulation).</span>'); blank(); break;
      default:
        printLine(`<span class="term-error">'${escHtml(parts[0])}' n'est pas reconnu en tant que commande interne ou externe,</span>`);
        printLine('<span class="term-error">un programme exécutable ou un fichier de commandes.</span>');
        blank();
    }
  }

  // ---- COMMANDS ----

  function cmdHelp() {
    printLine('<span class="term-header">Commandes disponibles :</span>');
    blank();
    const cmds = [
      ['ipconfig [/all|/release|/renew]', 'Affiche / libère / renouvelle le bail IP'],
      ['ping &lt;hôte&gt; [-n N] [-t]', 'Teste la connectivité (-n : nb paquets, -t : continu)'],
      ['tracert &lt;hôte&gt;',         'Trace la route vers un hôte'],
      ['nslookup &lt;domaine&gt;',     'Résolution DNS'],
      ['gpupdate [/force]',            'Met à jour les stratégies de groupe'],
      ['net user &lt;user&gt; [/domain]', 'Infos compte utilisateur'],
      ['net use',                      'Affiche les lecteurs réseau'],
      ['net accounts',                 'Politique de comptes'],
      ['sc query &lt;service&gt;',     'Statut d\'un service'],
      ['tasklist',                     'Liste des processus'],
      ['taskkill /im &lt;proc&gt; [/f]', 'Arrête un processus par nom'],
      ['taskkill /pid &lt;PID&gt; [/f]', 'Arrête un processus par PID'],
      ['netstat [-an] [-b]',           'Connexions réseau actives (-b : processus)'],
      ['arp -a',                       'Table ARP'],
      ['systeminfo',                   'Infos système'],
      ['sfc /scannow',                 'Vérifie les fichiers système'],
      ['dism',                         'Outil de maintenance image'],
      ['hostname',                     'Nom de l\'ordinateur'],
      ['whoami',                       'Utilisateur connecté'],
      ['nltest /dclist:&lt;domaine&gt;', 'Liste les contrôleurs de domaine'],
      ['dsquery user',                 'Recherche utilisateurs AD'],
      ['netsh wlan show profiles',     'Profils Wi-Fi'],
      ['cls',                          'Efface l\'écran'],
    ];
    cmds.forEach(([c, d]) => {
      printLine(`  <span class="term-cmd-name">${c.padEnd(40, '.')}</span> <span class="term-desc">${d}</span>`);
    });
    blank();
  }

  function cmdCls() {
    if (outputEl) outputEl.innerHTML = '';
    printLine('Microsoft Windows [Version 10.0.19045.4046]', '');
    blank();
  }

  function cmdIpconfig(args) {
    const all     = args.includes('/all');
    const release = args.includes('/release');
    const renew   = args.includes('/renew');

    if (release) {
      if (ctx.ip === 'APIPA' || ctx.ip === '0.0.0.0') {
        printLine(`Carte réseau Ethernet : aucune IP à libérer.`, 'term-warn');
      } else {
        printLine(`Carte réseau Ethernet :`);
        blank();
        printLine(`   Adresse IPv4. . . . . . . . . . : <span class="term-val">0.0.0.0</span>`);
        printLine(`   Masque de sous-réseau . . . . . : <span class="term-val">0.0.0.0</span>`);
        printLine(`   Passerelle par défaut . . . . . :`);
        blank();
        printLine(`Bail libéré avec succès.`, 'term-ok');
      }
      blank(); return;
    }

    if (renew) {
      printLine(`Renouvellement du bail DHCP en cours...`);
      if (ctx.ip === 'APIPA' || ctx.ip === '0.0.0.0') {
        blank();
        printLine(`<span class="term-error">Impossible de contacter le serveur DHCP.</span>`);
        printLine(`<span class="term-error">L'adresse APIPA 169.254.45.12 est conservée.</span>`);
        printLine(`<span class="term-warn">Vérifiez le câble réseau ou le service DHCP.</span>`);
      } else {
        blank();
        printLine(`Carte réseau Ethernet :`);
        blank();
        printLine(`   Adresse IPv4. . . . . . . . . . : <span class="term-ok">${ctx.ip}</span>`);
        printLine(`   Masque de sous-réseau . . . . . : <span class="term-val">${ctx.subnet}</span>`);
        printLine(`   Passerelle par défaut . . . . . : <span class="term-val">${ctx.gateway}</span>`);
        printLine(`   Serveur DHCP . . . . . . . . . . : <span class="term-val">${ctx.gateway}</span>`);
        blank();
        printLine(`Bail renouvelé avec succès.`, 'term-ok');
      }
      blank(); return;
    }

    if (all) {
      printLine(`Configuration IP de Windows`);
      blank();
      printLine(`   Nom de l'hôte . . . . . : <span class="term-val">${ctx.hostname}</span>`);
      printLine(`   Suffixe DNS principal  . : <span class="term-val">${ctx.domain}</span>`);
      printLine(`   Type de nœud . . . . . . : <span class="term-val">Hybride</span>`);
      printLine(`   Routage IP activé  . . . : <span class="term-val">Non</span>`);
      printLine(`   Proxy WINS activé  . . . : <span class="term-val">Non</span>`);
      printLine(`   Liste de recherche du suffixe DNS: <span class="term-val">${ctx.domain}</span>`);
      blank();
      printLine(`Carte réseau Ethernet :`, 'term-header');
      blank();
      printLine(`   Suffixe DNS propre à la connexion. . : <span class="term-val">${ctx.domain}</span>`);
      printLine(`   Description. . . . . . . . . . . . . : <span class="term-val">Intel(R) Ethernet Connection I219-V</span>`);
      printLine(`   Adresse physique . . . . . . . . . . : <span class="term-val">${ctx.mac}</span>`);
      printLine(`   DHCP activé. . . . . . . . . . . . . : <span class="term-val">Oui</span>`);
      printLine(`   Configuration automatique activée . . : <span class="term-val">Oui</span>`);
      printLine(`   Adresse IPv6 de lien local . . . . . : <span class="term-val">fe80::a4c3:f012:3456:789a%5</span>`);
      if (ctx.ip === 'APIPA' || ctx.ip === '0.0.0.0') {
        printLine(`   Adresse IPv4 . . . . . . . . . . . . : <span class="term-error">169.254.45.12 (APIPA - Adresse auto-attribuée)</span>`);
        printLine(`   Masque de sous-réseau . . . . . . . . : <span class="term-val">255.255.0.0</span>`);
        printLine(`   Passerelle par défaut . . . . . . . . :`);
        printLine(`   Serveur DHCP . . . . . . . . . . . . : <span class="term-error">INACCESSIBLE</span>`);
        printLine(`   Serveurs DNS . . . . . . . . . . . . : <span class="term-error">INACCESSIBLE</span>`);
      } else {
        printLine(`   Adresse IPv4 . . . . . . . . . . . . : <span class="term-val">${ctx.ip}</span>`);
        printLine(`   Masque de sous-réseau . . . . . . . . : <span class="term-val">${ctx.subnet}</span>`);
        printLine(`   Passerelle par défaut . . . . . . . . : <span class="term-val">${ctx.gateway}</span>`);
        printLine(`   Serveur DHCP . . . . . . . . . . . . : <span class="term-val">${ctx.gateway}</span>`);
        printLine(`   Serveurs DNS . . . . . . . . . . . . : <span class="term-val">${ctx.dns1}</span>`);
        printLine(`                                           <span class="term-val">${ctx.dns2}</span>`);
        printLine(`   Bail obtenu. . . . . . . . . . . . . : <span class="term-val">${new Date().toLocaleDateString('fr-FR')}</span>`);
        printLine(`   Bail expirant. . . . . . . . . . . . : <span class="term-val">${new Date(Date.now()+86400000*7).toLocaleDateString('fr-FR')}</span>`);
      }
    } else {
      printLine(`Configuration IP de Windows`);
      blank();
      printLine(`Carte réseau Ethernet :`);
      blank();
      if (ctx.ip === '0.0.0.0' || ctx.ip === 'APIPA') {
        printLine(`   Adresse IPv4. . . . . . . . . . : <span class="term-error">169.254.45.12 (APIPA)</span>`);
        printLine(`   ⚠ Adresse APIPA — Problème DHCP détecté`, 'term-warn');
        printLine(`   Masque de sous-réseau . . . . . : <span class="term-val">255.255.0.0</span>`);
        printLine(`   Passerelle par défaut . . . . . :`);
      } else {
        printLine(`   Adresse IPv4. . . . . . . . . . : <span class="term-val">${ctx.ip}</span>`);
        printLine(`   Masque de sous-réseau . . . . . : <span class="term-val">${ctx.subnet}</span>`);
        printLine(`   Passerelle par défaut . . . . . : <span class="term-val">${ctx.gateway}</span>`);
      }
    }
    blank();
  }

  function cmdPing(args) {
    if (!args.length) {
      printLine('<span class="term-error">Utilisation : ping &lt;nom_hôte&gt; [-n count] [-t]</span>');
      blank(); return;
    }

    const nIdx  = args.indexOf('-n');
    const tFlag = args.includes('-t');
    const nVal  = nIdx >= 0 ? args[nIdx + 1] : null;
    const count = (nVal && !isNaN(nVal))
      ? Math.min(parseInt(nVal, 10), 20)
      : (tFlag ? 8 : 4);
    // host = premier argument qui n'est pas un flag ni la valeur de -n
    const skipSet = new Set(['-n', '-t', nVal].filter(Boolean));
    const host = args.find(a => !skipSet.has(a) && !a.startsWith('-')) || args[0];

    const fails = ctx.pingFails || [];
    const shouldFail = fails.some(f => host.toLowerCase().includes(f.toLowerCase())) ||
                       (host.includes('8.8') && !ctx.internetOK) ||
                       (host.includes('google') && !ctx.internetOK) ||
                       (host.includes('microsoft') && !ctx.internetOK);

    printLine(`Envoi d'une requête 'Ping' sur ${escHtml(host)}${tFlag ? ' [continu]' : ''} :`);
    blank();

    if (shouldFail) {
      for (let i = 0; i < count; i++) {
        printLine(`Délai d'attente de la demande dépassé.`, 'term-error');
      }
      if (tFlag) printLine(`<span class="term-warn">Ctrl+C pour arrêter (simulation — ${count} paquets affichés)</span>`);
      blank();
      printLine(`<span class="term-error">Statistiques Ping pour ${escHtml(host)}:</span>`);
      printLine(`    Paquets : envoyés = ${count}, reçus = 0, perdus = ${count} <span class="term-error">(100% de pertes)</span>`);
    } else {
      const msList = Array.from({length: count}, () => 1 + Math.floor(Math.random() * 12));
      msList.forEach(ms => {
        printLine(`Réponse de ${escHtml(host)} : octets=32 durée=${ms}ms TTL=128`, 'term-ok');
      });
      if (tFlag) printLine(`<span class="term-warn">Ctrl+C pour arrêter (simulation — ${count} paquets affichés)</span>`);
      blank();
      const minMs = Math.min(...msList), maxMs = Math.max(...msList);
      const avgMs = Math.round(msList.reduce((a,b) => a+b, 0) / msList.length);
      printLine(`Statistiques Ping pour ${escHtml(host)}:`);
      printLine(`    Paquets : envoyés = ${count}, reçus = ${count}, perdus = 0 <span class="term-ok">(0% de pertes)</span>`);
      printLine(`Durée approximative des boucles en millisecondes :`);
      printLine(`    Minimum = ${minMs}ms, Maximum = ${maxMs}ms, Moyenne = ${avgMs}ms`);
    }
    blank();
  }

  function cmdTracert(args) {
    if (!args.length) { printLine('<span class="term-error">Utilisation : tracert &lt;hôte&gt;</span>'); blank(); return; }
    const host = args[0];
    const fail = (ctx.pingFails || []).some(f => host.toLowerCase().includes(f.toLowerCase()));
    printLine(`Détermination de l'itinéraire vers ${escHtml(host)}`);
    printLine(`avec un maximum de 30 sauts :`);
    blank();

    const hops = [
      { ip: ctx.gateway, name: 'gateway.local', ms: [1,1,1] },
      { ip: '10.0.0.1', name: 'core-sw-01.corp.local', ms: [2,2,2] },
      { ip: '10.0.1.1', name: 'fw-edge-01.corp.local', ms: [3,3,3] },
      { ip: '195.99.66.1', name: 'isp-pe-router.telecom.fr', ms: [8,8,9] },
    ];

    if (fail) {
      hops.forEach((h, i) => {
        printLine(`  ${i+1}    ${h.ms[0]} ms   ${h.ms[1]} ms   ${h.ms[2]} ms   ${h.ip} [${h.name}]`);
      });
      for (let i = hops.length + 1; i <= 8; i++) {
        printLine(`  ${i}    *        *        *     Délai d'attente de la demande dépassé.`, 'term-error');
      }
      printLine(`<span class="term-error">Itinéraire déterminé.</span>`);
    } else {
      hops.forEach((h, i) => {
        printLine(`  ${i+1}    ${h.ms[0]} ms   ${h.ms[1]} ms   ${h.ms[2]} ms   ${h.ip} [${h.name}]`);
      });
      const finalMs = 12 + Math.floor(Math.random() * 5);
      printLine(`  5    ${finalMs} ms   ${finalMs} ms   ${finalMs} ms   ${escHtml(host)}`, 'term-ok');
      printLine(`Itinéraire déterminé.`, 'term-ok');
    }
    blank();
  }

  function cmdNslookup(args) {
    if (!args.length) {
      printLine(`Serveur par défaut : ns1.${ctx.domain}`);
      printLine(`Adresse : ${ctx.dns1}`);
      blank();
      printLine('> ' + '_');
      return;
    }
    const host = args[0];
    printLine(`Serveur :  ns1.${ctx.domain}`);
    printLine(`Adresse :  ${ctx.dns1}`);
    blank();

    if (!ctx.dnsOK && !host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      printLine(`<span class="term-error">*** ns1.${ctx.domain} ne trouve pas ${escHtml(host)} : Non-existent domain</span>`);
    } else {
      const ip = host.includes('google') ? '142.250.74.110' :
                 host.includes(ctx.domain.split('.')[0]) ? ctx.ip :
                 '192.168.' + Math.floor(Math.random()*2+1) + '.' + Math.floor(Math.random()*200+10);
      printLine(`Nom :    ${escHtml(host)}`);
      printLine(`Adresse: <span class="term-val">${ip}</span>`);
    }
    blank();
  }

  function cmdGpupdate(args) {
    const force = args.includes('/force');
    printLine(`Mise à jour de la stratégie...`);
    blank();
    if (ctx.gpoBroken) {
      printLine(`<span class="term-error">Echec de la mise à jour de la stratégie d'ordinateur au bout de ${90 + Math.floor(Math.random()*30)} secondes.</span>`);
      printLine(`<span class="term-error">Les erreurs suivantes ont été rencontrées lors du traitement des stratégies de groupe :</span>`);
      blank();
      printLine(`<span class="term-error">Le traitement de la stratégie de groupe a échoué. Windows n'a pas pu traiter</span>`);
      printLine(`<span class="term-error">vos stratégies de groupe de l'ordinateur, car il n'a pas pu contacter un</span>`);
      printLine(`<span class="term-error">contrôleur de domaine. (LDAP : id=87)</span>`);
    } else {
      printLine(`La stratégie de l'ordinateur a été mise à jour.`, 'term-ok');
      printLine(`La stratégie de l'utilisateur a été mise à jour.`, 'term-ok');
      if (force) {
        blank();
        printLine(`La mise à jour forcée a été appliquée avec succès.`, 'term-ok');
      }
    }
    blank();
  }

  function cmdNet(args) {
    const sub = (args[0] || '').toLowerCase();
    const sub2 = (args[1] || '').toLowerCase();

    if (sub === 'user') {
      const username = args[1] || ctx.username;
      const domain = args.includes('/domain');
      printLine(`Informations sur l'utilisateur ${escHtml(username)}`);
      blank();
      if (ctx.adUserLocked) {
        printLine(`Nom d'utilisateur                ${escHtml(username)}`);
        printLine(`Nom complet                      ${escHtml(username.replace('.', ' ').split(' ').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '))}`);
        printLine(`Commentaire`);
        printLine(`Actif                            <span class="term-error">Non</span>`);
        printLine(`Compte expiré                    <span class="term-val">Jamais</span>`);
        printLine(`<span class="term-error">Le compte est verrouillé          Oui</span>`);
        printLine(`Mot de passe expiré              ${ctx.adPasswordExpired ? '<span class="term-error">Oui</span>' : '<span class="term-ok">Non</span>'}`);
        printLine(`L'utilisateur peut changer le MDP Oui`);
        printLine(`Stations de travail autorisées   Tout`);
        printLine(`Dernière ouverture de session    Jamais`);
        printLine(`Membre de                        ${ctx.domain}\\Utilisateurs`);
      } else if (ctx.adPasswordExpired) {
        printLine(`Nom d'utilisateur                <span class="term-val">${escHtml(username)}</span>`);
        printLine(`Nom complet                      <span class="term-val">${escHtml(username.replace('.', ' ').split(' ').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '))}`);
        printLine(`Actif                            <span class="term-ok">Oui</span>`);
        printLine(`Compte expiré                    <span class="term-val">Jamais</span>`);
        printLine(`Compte verrouillé                <span class="term-ok">Non</span>`);
        printLine(`<span class="term-error">Mot de passe expiré              Oui</span>`);
        printLine(`Date d'expiration du MDP         <span class="term-error">${new Date(Date.now()-86400000*2).toLocaleDateString('fr-FR')} (il y a 2 jours)</span>`);
        printLine(`L'utilisateur peut changer le MDP Oui`);
        printLine(`Dernière ouverture de session    <span class="term-val">${new Date(Date.now()-86400000*3).toLocaleDateString('fr-FR')}</span>`);
        printLine(`Membre de                        <span class="term-val">${ctx.domain}\\Utilisateurs</span>`);
      } else {
        printLine(`Nom d'utilisateur                <span class="term-val">${escHtml(username)}</span>`);
        printLine(`Actif                            <span class="term-ok">Oui</span>`);
        printLine(`Compte expiré                    <span class="term-val">Jamais</span>`);
        printLine(`Compte verrouillé                <span class="term-ok">Non</span>`);
        printLine(`Mot de passe expiré              <span class="term-ok">Non</span>`);
        printLine(`Date d'expiration du MDP         <span class="term-val">${new Date(Date.now()+86400000*30).toLocaleDateString('fr-FR')}</span>`);
        printLine(`Membre de                        <span class="term-val">${ctx.domain}\\Utilisateurs</span>`);
      }
    }
    else if (sub === 'use') {
      printLine(`Statut       Local    Distant                    Réseau`);
      printLine(`-------------------------------------------------------------------------------`);
      if (ctx.serverShareOK) {
        printLine(`OK           Z:       \\\\SRV-FILES\\${ctx.domain.split('.')[0]}    Microsoft Windows Network`, 'term-ok');
        printLine(`OK           Y:       \\\\SRV-FILES\\Commun          Microsoft Windows Network`, 'term-ok');
      } else {
        printLine(`<span class="term-error">Déconnecté   Z:       \\\\SRV-FILES\\${ctx.domain.split('.')[0]}    Microsoft Windows Network</span>`);
        printLine(`OK           Y:       \\\\SRV-FILES\\Commun          Microsoft Windows Network`, 'term-ok');
      }
      printLine(`La commande s'est terminée correctement.`);
    }
    else if (sub === 'accounts') {
      printLine(`Durée maximum du mot de passe (jours) :         <span class="term-val">90</span>`);
      printLine(`Durée minimum du mot de passe (jours) :         <span class="term-val">1</span>`);
      printLine(`Longueur minimale du mot de passe :             <span class="term-val">8</span>`);
      printLine(`Seuil de verrouillage du compte :               <span class="term-val">5</span>`);
      printLine(`Durée de verrouillage du compte (minutes) :     <span class="term-val">30</span>`);
    }
    else if (sub === 'start' && args[1]) {
      const svc = args[1];
      if (ctx.services) ctx.services[svc] = 'RUNNING';
      printLine(`Le service ${escHtml(svc)} a démarré avec succès.`, 'term-ok');
    }
    else if (sub === 'stop' && args[1]) {
      const svc = args[1];
      if (ctx.services) ctx.services[svc] = 'STOPPED';
      printLine(`Le service ${escHtml(svc)} s'est arrêté avec succès.`, 'term-ok');
    }
    else if (sub === 'view') {
      printLine(`Ressources disponibles sur \\\\${ctx.domain.split('.')[0]}:`);
      blank();
      printLine(`Nom partage            Type  Commentaire`);
      printLine(`-------------------------------------------------------------------------------`);
      printLine(`Commun                 Disk  Partage commun`);
      printLine(`${ctx.domain.split('.')[0].toUpperCase()}                   Disk  Dossiers du service`);
      printLine(`IT                     Disk  Ressources IT`);
    }
    else {
      printLine(`<span class="term-error">Syntaxe incorrecte. Essayez : net user | net use | net accounts | net start | net stop | net view</span>`);
    }
    blank();
  }

  function cmdHostname() {
    printLine(`<span class="term-val">${ctx.hostname}</span>`);
    blank();
  }

  function cmdWhoami() {
    printLine(`<span class="term-val">${ctx.domain.split('.')[0].toLowerCase()}\\${ctx.username}</span>`);
    blank();
  }

  function cmdSc(args) {
    const sub = (args[0] || 'query').toLowerCase();
    const svc = args[1] || 'spooler';
    const svcLower = svc.toLowerCase();

    if (sub === 'query') {
      // Windows Update context-aware
      const wuServices = ['wuauserv', 'bits', 'cryptsvc', 'msiserver'];
      let state;
      if (ctx.windowsUpdateFails && wuServices.includes(svcLower)) {
        state = svcLower === 'wuauserv' ? 'STOPPED' :
                svcLower === 'bits'     ? 'STOPPED' : 'RUNNING';
      } else {
        state = (ctx.services && ctx.services[svc]) ||
                (ctx.services && ctx.services[svcLower]) ||
                (svcLower === 'spooler' ? (ctx.printerOK ? 'RUNNING' : 'STOPPED') : 'RUNNING');
      }
      const stateNum   = state === 'RUNNING' ? 4 : 1;
      const stateColor = state === 'RUNNING' ? 'term-ok' : 'term-error';
      printLine(`SERVICE_NAME: ${escHtml(svc)}`);
      printLine(`        TYPE               : 110  WIN32_OWN_PROCESS`);
      printLine(`        STATE              : ${stateNum}  <span class="${stateColor}">${state}</span>`);
      printLine(`        WIN32_EXIT_CODE    : 0  (0x0)`);
      printLine(`        SERVICE_EXIT_CODE  : 0  (0x0)`);
      printLine(`        CHECKPOINT         : 0x0`);
      printLine(`        WAIT_HINT          : 0x0`);
      if (ctx.windowsUpdateFails && svcLower === 'wuauserv') {
        blank();
        printLine(`<span class="term-warn">⚠ Le service Windows Update est arrêté — les mises à jour ne peuvent pas s'installer.</span>`);
        printLine(`<span class="term-desc">  → Essayez : sc start wuauserv  ou  net start wuauserv</span>`);
      }
    } else if (sub === 'start') {
      if (!ctx.services) ctx.services = {};
      ctx.services[svc] = 'RUNNING';
      if (ctx.windowsUpdateFails && svcLower === 'wuauserv') {
        printLine(`[SC] StartService RÉUSSI`, 'term-ok');
        blank();
        printLine(`<span class="term-ok">Service wuauserv démarré. Relancez Windows Update.</span>`);
      } else {
        printLine(`[SC] StartService RÉUSSI`, 'term-ok');
      }
    } else if (sub === 'stop') {
      if (!ctx.services) ctx.services = {};
      ctx.services[svc] = 'STOPPED';
      printLine(`[SC] ControlService RÉUSSI`, 'term-ok');
    }
    blank();
  }

  function cmdTasklist() {
    printLine(`Nom de l'image          PID Session        Mém. utilisation`);
    printLine(`========================= ======== ================ ===========`);
    const procs = [
      ['System Idle Process', '0',    '0 Ko',        false],
      ['System',              '4',    '148 Ko',      false],
      ['svchost.exe',         '1024', '25 400 Ko',   false],
      ['explorer.exe',        '2840', '68 240 Ko',   false],
      ['chrome.exe',          '3412', '215 880 Ko',  false],
      ['outlook.exe',         '4108', '185 440 Ko',  false],
      ['Teams.exe',           '5220', '312 100 Ko',  false],
      ['OneDrive.exe',        '6112', '45 320 Ko',   false],
      ['cmd.exe',             '7340', '4 220 Ko',    false],
    ];
    if (!ctx.printerOK) {
      procs.splice(4, 0, ['spoolsv.exe (STOPPED)', '0', '0 Ko', false]);
    }
    if (ctx.cpuHigh) {
      procs.splice(3, 0, ['MsMpEng.exe', '3108', '1 842 300 Ko', true]);
      procs.splice(4, 0, ['SearchIndexer.exe', '4820', '987 440 Ko', true]);
    }
    procs.forEach(([name, pid, mem, warn]) => {
      const line = `${name.padEnd(26)} ${pid.padEnd(9)} Console          ${mem}`;
      printLine(warn ? `<span class="term-warn">${line}  ⚠ CPU élevé</span>` : line);
    });
    if (ctx.cpuHigh) {
      blank();
      printLine(`<span class="term-warn">⚠ MsMpEng.exe (Windows Defender) consomme une ressource CPU/mémoire anormalement élevée.</span>`);
      printLine(`<span class="term-desc">  → Vérifiez si une analyse complète est en cours ou si une exclusion est nécessaire.</span>`);
    }
    blank();
  }

  function cmdTaskkill(args) {
    const im  = args.indexOf('/im');
    const pid = args.indexOf('/pid');
    const f   = args.includes('/f');
    if (im >= 0 && args[im+1]) {
      const proc = args[im+1];
      printLine(`<span class="term-ok">SUCCÈS : le processus "${escHtml(proc)}" (PID ${2000 + Math.floor(Math.random()*5000)}) a été arrêté.</span>`);
    } else if (pid >= 0 && args[pid+1] && !isNaN(args[pid+1])) {
      const pidNum = args[pid+1];
      if (!f) {
        printLine(`<span class="term-warn">AVERTISSEMENT : Le processus ${pidNum} n'a pas pu être arrêté proprement.</span>`);
        printLine(`Utilisez /f pour forcer l'arrêt.`);
      } else {
        printLine(`<span class="term-ok">SUCCÈS : le processus PID ${pidNum} a été arrêté.</span>`);
      }
    } else {
      printLine('<span class="term-error">Utilisation : taskkill /im &lt;processus.exe&gt; [/f]</span>');
      printLine('<span class="term-error">             taskkill /pid &lt;PID&gt; [/f]</span>');
    }
    blank();
  }

  function cmdNetstat(args) {
    const showAll  = args.includes('-a') || args.includes('-an') || args.includes('-ano');
    const showProc = args.includes('-b');

    printLine(`Connexions actives`);
    blank();
    printLine(`  Proto  Adresse locale          Adresse distante        État`);

    const baseRows = [
      [`TCP`, `0.0.0.0:135`,          `0.0.0.0:0`,             `LISTENING`,   `svchost.exe`],
      [`TCP`, `0.0.0.0:445`,          `0.0.0.0:0`,             `LISTENING`,   `System`],
      [`TCP`, `0.0.0.0:3389`,         `0.0.0.0:0`,             `LISTENING`,   `svchost.exe`],
      [`TCP`, `${ctx.ip}:49152`,   `${ctx.gateway}:80`,    `ESTABLISHED`, `chrome.exe`],
      [`TCP`, `${ctx.ip}:49153`,   `40.97.78.34:443`,      `ESTABLISHED`, `outlook.exe`],
      [`TCP`, `${ctx.ip}:49154`,   `52.113.194.132:443`,   `ESTABLISHED`, `Teams.exe`],
    ];

    if (ctx.vpnOK) {
      baseRows.push([`TCP`, `${ctx.ip}:49155`, `10.10.0.1:1194`, `ESTABLISHED`, `vpnclient.exe`]);
    }

    baseRows.forEach(([proto, local, remote, state, proc]) => {
      const stateClass = state === 'ESTABLISHED' ? 'term-ok' : '';
      const line = `  ${proto.padEnd(7)}${local.padEnd(24)}${remote.padEnd(24)}<span class="${stateClass}">${state}</span>`;
      printLine(line);
      if (showProc) printLine(`  [${escHtml(proc)}]`, 'term-desc');
    });

    if (!showAll) {
      blank();
      printLine(`<span class="term-desc">Utilisez -a pour voir tous les ports, -b pour afficher les processus.</span>`);
    }
    blank();
  }

  function cmdArp(args) {
    printLine(`Interface : ${ctx.ip} --- 0x5`);
    printLine(`  Adresse Internet      Adresse physique      Type`);
    printLine(`  ${ctx.gateway}          c8-d3-a3-44-21-f0     dynamique`);
    printLine(`  192.168.1.10          00-1a-2b-3c-4d-5e     dynamique`);
    if (ctx.printerIP) printLine(`  ${ctx.printerIP}        00-27-00-ab-cd-ef     dynamique`);
    printLine(`  192.168.1.255         ff-ff-ff-ff-ff-ff     statique`);
    blank();
  }

  function cmdSysteminfo() {
    const isServer = ctx.isServer || ctx.hostname.startsWith('SRV-');
    const osName   = isServer ? 'Windows Server 2019 Standard' : 'Microsoft Windows 11 Pro';
    const osBuild  = isServer ? '10.0.17763 N/A Build 17763'   : '10.0.22631 N/A Build 22631';
    const model    = isServer ? 'PowerEdge R440'                : 'OptiPlex 7090';
    const maker    = isServer ? 'Dell Inc. (Server)'            : 'Dell Inc.';
    const ram      = isServer ? '32 768 Mo'                     : '16 384 Mo';
    const ramFree  = ctx.cpuHigh ? '<span class="term-warn">1 240 Mo</span>' : (isServer ? '18 440 Mo' : '8 240 Mo');
    const diskFree = ctx.diskFull
      ? '<span class="term-error">1 204 Mo (critique — disque à 98%)</span>'
      : (isServer ? '48 320 Mo' : '120 544 Mo');

    printLine(`Nom de l'hôte :                    <span class="term-val">${ctx.hostname}</span>`);
    printLine(`Nom du système d'exploitation :    <span class="term-val">${osName}</span>`);
    printLine(`Version du système d'exploitation : <span class="term-val">${osBuild}</span>`);
    printLine(`Fabricant du système :             <span class="term-val">${maker}</span>`);
    printLine(`Modèle du système :                <span class="term-val">${model}</span>`);
    printLine(`Processeur(s) :                    <span class="term-val">1 processeur(s) installé(s).</span>`);
    printLine(`                                   <span class="term-val">[01]: Intel ${isServer ? 'Xeon Silver 4210 ~2.2 GHz' : 'Core i7-10700 ~2.9 GHz'}</span>`);
    printLine(`Mémoire physique totale :          <span class="term-val">${ram}</span>`);
    printLine(`Mémoire physique disponible :      ${ramFree}`);
    printLine(`Domaine :                          <span class="term-val">${ctx.domain}</span>`);
    printLine(`Serveur d'ouverture de session :   <span class="term-val">\\\\DC01</span>`);
    printLine(`Espace disque disponible (C:) :    ${diskFree}`);
    printLine(`Correctif(s) :                     <span class="term-val">${isServer ? '12' : '5'} correctif(s) installé(s).</span>`);
    blank();
  }

  function cmdSfc(args) {
    if (!args.includes('/scannow')) {
      printLine('<span class="term-error">Utilisation : sfc /scannow</span>');
      blank(); return;
    }
    printLine(`Début de l'analyse du système. Ce processus prendra quelques instants.`);
    printLine(`Démarrage de l'analyse de la vérification du système.`);
    printLine(`...`);

    if (ctx.sfcErrors) {
      printLine(`<span class="term-error">La Protection des ressources Windows a trouvé des fichiers corrompus et les a réparés.</span>`);
      printLine(`Détails dans CBS.Log : windir\\Logs\\CBS\\CBS.log`);
    } else {
      printLine(`<span class="term-ok">La Protection des ressources Windows n'a pas trouvé de violations d'intégrité.</span>`);
    }
    blank();
  }

  function cmdDism(args) {
    if (args.some(a => a.toLowerCase().includes('restorehealth'))) {
      printLine(`Outil de gestion et de maintenance des images de déploiement`);
      printLine(`Version : 10.0.22631.2861`);
      blank();
      printLine(`Restauration de l'image...`);
      printLine(`[==========================100.0%==========================]`);
      printLine(`<span class="term-ok">L'opération de restauration a réussi.</span>`);
      printLine(`L'opération a réussi.`);
    } else {
      printLine(`Utilisation : dism /Online /Cleanup-Image /RestoreHealth`);
    }
    blank();
  }

  function cmdChkdsk(args) {
    printLine(`Le type du système de fichiers est NTFS.`);
    printLine(`Le volume est propre.`);
    blank();
    printLine(`<span class="term-val">Windows a vérifié le système de fichiers et n'a trouvé aucun problème.</span>`);
    printLine(`  102 425 600 Ko d'espace disque total.`);
    printLine(`   42 200 100 Ko dans 28 482 fichiers.`);
    printLine(`      120 200 Ko dans 4 500 index.`);
    printLine(`   60 105 300 Ko disponibles sur le disque.`);
    blank();
  }

  function cmdDir() {
    const isServer = ctx.isServer || ctx.hostname.startsWith('SRV-');
    const freeBytes = ctx.diskFull ? '1 258 291 200' : (isServer ? '50 685 468 672' : '120 544 382 976');
    const freeLabel = ctx.diskFull
      ? `<span class="term-error">${freeBytes} octets libres  ⚠ DISQUE CRITIQUE</span>`
      : `${freeBytes} octets libres`;

    printLine(` Répertoire de ${escHtml(currentDir)}`);
    blank();
    printLine(`07/04/2026  09:15    <span class="term-val">&lt;REP&gt;</span>          .`);
    printLine(`07/04/2026  09:15    <span class="term-val">&lt;REP&gt;</span>          ..`);
    if (isServer) {
      printLine(`15/03/2026  08:00    <span class="term-val">&lt;REP&gt;</span>          Logs`);
      printLine(`15/03/2026  08:00    <span class="term-val">&lt;REP&gt;</span>          Backup`);
      printLine(`07/04/2026  02:00   14 680 064 000  backup_full_20260407.vhd`);
      printLine(`06/04/2026  02:00   14 680 064 000  backup_full_20260406.vhd`);
      printLine(`05/04/2026  02:00   14 680 064 000  backup_full_20260405.vhd`);
      blank();
      printLine(`               3 fichiers    44 040 192 000 octets`);
    } else {
      printLine(`15/03/2026  14:22    <span class="term-val">&lt;REP&gt;</span>          Desktop`);
      printLine(`15/03/2026  14:22    <span class="term-val">&lt;REP&gt;</span>          Documents`);
      printLine(`15/03/2026  14:22    <span class="term-val">&lt;REP&gt;</span>          Downloads`);
      printLine(`15/03/2026  14:22    <span class="term-val">&lt;REP&gt;</span>          AppData`);
      printLine(`07/04/2026  08:30        2 048 456  rapport_q1.xlsx`);
      printLine(`06/04/2026  16:44          512 000  presentation_client.pptx`);
      blank();
      printLine(`               2 fichiers         2 560 456 octets`);
    }
    printLine(`               6 Rép(s)  ${freeLabel}`);
    blank();
  }

  function cmdCd(args) {
    if (!args.length || args[0] === '..') {
      const parts = currentDir.split('\\');
      if (parts.length > 1) parts.pop();
      currentDir = parts.join('\\');
    } else if (args[0].includes(':')) {
      currentDir = args[0];
    } else {
      currentDir = currentDir + '\\' + args[0];
    }
    if (promptEl) promptEl.textContent = `${ctx.hostname}>`;
  }

  function cmdSet() {
    printLine(`COMPUTERNAME=${ctx.hostname}`);
    printLine(`USERDOMAIN=${ctx.domain.split('.')[0].toUpperCase()}`);
    printLine(`USERNAME=${ctx.username}`);
    printLine(`USERPROFILE=C:\\Users\\${ctx.username}`);
    printLine(`APPDATA=C:\\Users\\${ctx.username}\\AppData\\Roaming`);
    printLine(`LOCALAPPDATA=C:\\Users\\${ctx.username}\\AppData\\Local`);
    printLine(`LOGONSERVER=\\\\DC01`);
    printLine(`SystemRoot=C:\\Windows`);
    printLine(`TEMP=C:\\Users\\${ctx.username}\\AppData\\Local\\Temp`);
    blank();
  }

  function cmdNetsh(args) {
    if (args.includes('wlan') && args.includes('profiles')) {
      printLine(`Profils sur l'interface Wi-Fi :`);
      blank();
      printLine(`Profils de toutes les interfaces d'utilisateur`);
      printLine(`    Profil d'utilisateur : CORP-WIFI`);
      printLine(`    Profil d'utilisateur : Guests`);
      printLine(`    Profil d'utilisateur : HomeNetwork`);
    } else if (args.includes('int') && args.includes('ip') && args.includes('reset')) {
      printLine(`Réinitialisation de TCP/IP...`, 'term-ok');
      printLine(`Réinitialisation réussie.`, 'term-ok');
      printLine(`Redémarrez l'ordinateur pour terminer.`);
    } else if (args.includes('winsock') && args.includes('reset')) {
      printLine(`Réinitialisation du catalogue Winsock réussie.`, 'term-ok');
      printLine(`Redémarrez l'ordinateur.`);
    } else if (args.includes('interface') && args.includes('show') && args.includes('interface')) {
      printLine(`Nom de l'interface        État admin  État         Type`);
      printLine(`----------------------------------------------------------`);
      printLine(`Ethernet                  Activé      <span class="term-ok">Connecté</span>       Dédié`);
      if (ctx.vpnOK === false) {
        printLine(`VPN CORP                  Activé      <span class="term-error">Déconnecté</span>    VPN`);
      } else if (ctx.vpnOK) {
        printLine(`VPN CORP                  Activé      <span class="term-ok">Connecté</span>       VPN`);
      }
    } else if (args.includes('diag') || (args.includes('int') && args.includes('show'))) {
      if (!ctx.dnsOK) {
        printLine(`<span class="term-error">Diagnostic réseau : échec de la résolution DNS.</span>`);
        printLine(`<span class="term-warn">Serveur DNS ${ctx.dns1} ne répond pas.</span>`);
        printLine(`Vérifiez : ipconfig /release puis /renew, ou contacter l'administrateur DNS.`);
      } else {
        printLine(`Diagnostic réseau : aucun problème détecté.`, 'term-ok');
      }
    } else {
      printLine(`Utilisation: netsh wlan show profiles | netsh int ip reset | netsh winsock reset`);
      printLine(`             netsh interface show interface`);
    }
    blank();
  }

  function cmdNltest(args) {
    const dc = args.find(a => a.startsWith('/dclist:'));
    if (dc) {
      const dom = dc.split(':')[1] || ctx.domain;
      printLine(`Obtention de la liste des contrôleurs de domaine pour ${escHtml(dom)}.`);
      blank();
      printLine(`    \\\\DC01.<span class="term-val">${escHtml(dom)}</span> [DS] Site : Headquarters`);
      printLine(`    \\\\DC02.<span class="term-val">${escHtml(dom)}</span> [DS] Site : DR-Site`);
      blank();
      printLine(`La commande s'est terminée correctement.`, 'term-ok');
    } else {
      printLine(`Utilisation : nltest /dclist:&lt;domaine&gt;`);
    }
    blank();
  }

  function cmdDsquery(args) {
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'user') {
      const filter = args.find(a => a.startsWith('-name')) || '';
      const name = filter.split(':')[1] || '*';
      printLine(`"CN=${ctx.username},OU=Utilisateurs,DC=${ctx.domain.split('.').join(',DC=')}"`);
      if (ctx.adUserLocked) {
        printLine(`<span class="term-error">[COMPTE VERROUILLÉ]</span>`);
      }
    } else if (sub === 'computer') {
      printLine(`"CN=${ctx.hostname},OU=Postes,DC=${ctx.domain.split('.').join(',DC=')}"`);
    } else if (sub === 'ou') {
      printLine(`"OU=Utilisateurs,DC=${ctx.domain.split('.').join(',DC=')}"`);
      printLine(`"OU=Postes,DC=${ctx.domain.split('.').join(',DC=')}"`);
      printLine(`"OU=Serveurs,DC=${ctx.domain.split('.').join(',DC=')}"`);
    } else {
      printLine(`Utilisation : dsquery user | computer | ou`);
    }
    blank();
  }

  function cmdServicesMsc() {
    const rows = [
      ['DNS Client', 'Automatique', 'En cours d\'exécution'],
      ['Spouleur d\'impression', 'Automatique', ctx.printerOK ? 'En cours d\'exécution' : '<span class="term-error">Arrêté</span>'],
      ['Windows Update', 'Manuel', 'En cours d\'exécution'],
      ['Pare-feu Windows', 'Automatique', 'En cours d\'exécution'],
      ['Remote Desktop', 'Manuel', 'Arrêté'],
      ['DHCP Client', 'Automatique', 'En cours d\'exécution'],
    ];
    printLine(`Nom du service                    Démarrage         État`);
    printLine(`------------------------------------------------------------------`);
    rows.forEach(([n, d, s]) => printLine(`${n.padEnd(34)} ${d.padEnd(18)} ${s}`));
    blank();
  }

  // ---- PUBLIC API ----
  return { init, setContext, execute, printLine, blank };

})();
