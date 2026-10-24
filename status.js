/* JY CENTER — page "connecté" : données réelles de la session MikroTik */
(function () {
  var C = window.JY, d = document.getElementById("data");
  function byId(id) { return document.getElementById(id); }

  function secs(t) {            // "1d2h3m4s" ou "02:03:04" -> secondes
    t = String(t || "").replace(/\s/g, "");
    if (!t) return null;
    var m = t.match(/^(?:(\d+)d)?(\d+):(\d+):(\d+)$/);
    if (m) return (+m[1] || 0) * 86400 + (+m[2]) * 3600 + (+m[3]) * 60 + (+m[4]);
    var re = /(\d+)([wdhms])/g, tot = 0, found = false, x;
    var mul = { w: 604800, d: 86400, h: 3600, m: 60, s: 1 };
    while ((x = re.exec(t))) { tot += (+x[1]) * mul[x[2]]; found = true; }
    return found ? tot : null;
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function fmt(s) {
    var j = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), x = s % 60;
    return (j ? j + " j " : "") + (j || h ? pad(h) + " h " : "") + pad(m) + " min " + pad(x) + " s";
  }

  var user = d.getAttribute("data-user");
  var left = secs(d.getAttribute("data-left"));
  var up = secs(d.getAttribute("data-uptime"));
  byId("user").textContent = user || "—";

  /* Forfait actif : préfixe du code, sinon durée totale de la session */
  var label = "Forfait actif";
  var i, f, hit = null;
  for (i = 0; i < C.forfaits.length; i++) {
    f = C.forfaits[i];
    if (f.prefixe && user && user.toUpperCase().indexOf(f.prefixe.toUpperCase()) === 0) { hit = f; break; }
  }
  if (!hit && left !== null && up !== null) {
    var total = left + up;
    for (i = 0; i < C.forfaits.length; i++) {
      if (Math.abs(C.forfaits[i].secondes - total) <= 240) { hit = C.forfaits[i]; break; }
    }
  }
  if (hit) label = hit.temps + " — " + hit.tarif;
  byId("plan").textContent = label;

  /* Temps restant réel (compte à rebours calé sur la valeur du routeur) */
  var out = byId("left"), exp = byId("expire"), box = byId("end");
  if (left === null) {
    out.textContent = "Illimité";
    byId("expireRow").hidden = true;
  } else {
    var end = Date.now() + left * 1000;
    try {
      exp.textContent = new Date(end).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
    } catch (e) { byId("expireRow").hidden = true; }
    (function tick() {
      var r = Math.max(0, Math.round((end - Date.now()) / 1000));
      out.textContent = fmt(r);
      if (r <= 0) { box.hidden = false; return; }
      setTimeout(tick, 1000);
    })();
    setTimeout(function () { location.reload(); }, 300000);   // resynchronisation toutes les 5 min
  }
})();
