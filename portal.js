/* JY CENTER — logique de la page de connexion (login.html / error.html) */
(function () {
  var C = window.JY;
  function byId(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function wa(msg) { return C.whatsapp + "?text=" + encodeURIComponent(msg); }

  /* ---- Messages d'erreur MikroTik -> français clair ---- */
  window.jyErreur = function (m) {
    var s = String(m || "").toLowerCase();
    if (!s) return "";
    if (/invalid username or password|invalid username|invalid password|wrong password/.test(s))
      return "Code ou identifiants incorrects. Vérifiez votre saisie. Si votre forfait est terminé, le code n'est plus valide : demandez-en un nouveau.";
    if (/uptime limit|time limit|session time|expired|has reached/.test(s))
      return "Ce code a expiré : le temps du forfait est épuisé. Achetez un nouveau forfait pour vous reconnecter.";
    if (/traffic limit|data limit|bytes/.test(s))
      return "Le volume de données de ce forfait est épuisé. Achetez un nouveau forfait.";
    if (/no more sessions|already logged|simultaneous|shared/.test(s))
      return "Ce code est déjà utilisé sur un autre appareil.";
    if (/not allowed to login from|mac address/.test(s))
      return "Ce code est associé à un autre appareil et ne peut pas être utilisé ici.";
    if (/radius|server.*(not responding|timeout)|timeout/.test(s))
      return "Le serveur d'authentification ne répond pas. Réessayez dans un instant.";
    if (/not logged in/.test(s))
      return "Vous n'êtes pas connecté. Retournez à la page de connexion.";
    if (/disabled|blocked|banned/.test(s))
      return "Ce compte est désactivé. Contactez JY CENTER.";
    return "Connexion impossible (" + m + "). Réessayez ou contactez JY CENTER.";
  };

  /* ---- Pied de page ---- */
  var tel = byId("telLink");
  if (tel) { tel.href = "tel:" + C.telephone; tel.textContent = C.telephone; }

  /* ---- Bandeau de publicités (gauche -> droite, en continu) ---- */
  function initAds() {
    var track = byId("adsTrack"), zone = byId("adsZone");
    if (!track) return;
    var ITEM = 244, n = Math.min(C.nbPubs || 6, 12), urls = [], loaded = {}, pending, i;
    for (i = 1; i <= n; i++) urls.push("/img/pub" + i + ".jpg");
    pending = urls.length;
    function done() {
      if (--pending > 0) return;
      var ok = urls.filter(function (u) { return loaded[u]; });
      if (!ok.length) { zone.style.display = "none"; return; }
      var vw = zone.offsetWidth || window.innerWidth;
      var k = Math.ceil((vw / ITEM + 1) / ok.length), half = [], j;
      for (j = 0; j < k; j++) half = half.concat(ok);
      var html = "";
      half.concat(half).forEach(function (u) { html += '<img class="ad" src="' + u + '" alt="Annonce" draggable="false">'; });
      track.innerHTML = html;
      track.style.animationDuration = Math.round(half.length * ITEM / (C.vitessePubs || 45)) + "s";
      track.className = "track run";
    }
    urls.forEach(function (u) {
      var im = new Image();
      im.onload = function () { loaded[u] = true; done(); };
      im.onerror = done;
      im.src = u;
    });
  }
  initAds();

  /* ---- Tableau des forfaits ---- */
  var body = byId("forfaitsBody");
  if (body) {
    var h = "";
    C.forfaits.forEach(function (f) {
      var m = "Je souhaiterais payer le forfait " + f.temps + " au prix de " + f.tarif + ".";
      h += "<tr><td data-l=\"Temps\"><b>" + esc(f.temps) + "</b></td><td class=\"price\">" + esc(f.tarif) +
           "</td><td>" + esc(f.validite) + "</td><td><a class=\"pay\" target=\"_blank\" rel=\"noopener\" href=\"" +
           esc(wa(m)) + "\">Payer</a></td></tr>";
    });
    body.innerHTML = h;
  }
  var ab = byId("btnAbo");
  if (ab) { ab.href = wa(C.messageAbonnement); }

  /* ---- Onglets + connexion ---- */
  var tabCode = byId("tabCode");
  if (!tabCode) return;
  var tabAcc = byId("tabAcc"), pCode = byId("panelCode"), pAcc = byId("panelAcc"),
      errBox = byId("errBox"), current = "code";

  function showTab(t) {
    current = t;
    var isCode = t === "code";
    tabCode.setAttribute("aria-selected", isCode);
    tabAcc.setAttribute("aria-selected", !isCode);
    pCode.hidden = !isCode;
    pAcc.hidden = isCode;
    clearError();
  }
  function showError(msg) { errBox.textContent = msg; errBox.hidden = false; }
  function clearError() { errBox.hidden = true; errBox.textContent = ""; }
  tabCode.onclick = function () { showTab("code"); };
  tabAcc.onclick = function () { showTab("acc"); };

  function send(user, pass) {
    var f = document.sendin;
    var chapId = window.JY_CHAP_ID || "", chapCh = window.JY_CHAP_CH || "";
    f.username.value = user;
    f.password.value = chapId ? hexMD5(chapId + pass + chapCh) : pass;
    try { localStorage.setItem("jy_tab", current); } catch (e) {}
    f.submit();
  }

  byId("formCode").onsubmit = function () {
    var code = byId("code").value.replace(/^\s+|\s+$/g, "");
    if (!code) { showError("Veuillez saisir votre code Wi-Fi."); byId("code").focus(); return false; }
    send(code, C.modeCode === "empty" ? "" : code);
    return false;
  };
  byId("formAcc").onsubmit = function () {
    var u = byId("user").value.replace(/^\s+|\s+$/g, ""), p = byId("pass").value;
    if (!u) { showError("Veuillez saisir votre nom d'utilisateur."); byId("user").focus(); return false; }
    if (!p) { showError("Veuillez saisir votre mot de passe."); byId("pass").focus(); return false; }
    send(u, p);
    return false;
  };

  /* Erreur renvoyée par le routeur : on revient sur l'onglet utilisé */
  var routerErr = tabCode.getAttribute("data-error") || "";
  var last = "code", prev = tabCode.getAttribute("data-user") || "";
  try { last = localStorage.getItem("jy_tab") || "code"; } catch (e) {}
  if (routerErr) {
    showTab(last === "acc" ? "acc" : "code");
    if (prev) { (current === "acc" ? byId("user") : byId("code")).value = prev; }
    showError(window.jyErreur(routerErr));
  }
})();
