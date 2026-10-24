/* ==========================================================
   JY CENTER — CONFIGURATION DU PORTAIL (à modifier ici)
   Aucun redémarrage nécessaire : enregistrer le fichier sur
   le MikroTik (Files) suffit. Recharger la page pour voir.
   ========================================================== */
var JY = {
  nom: "JY CENTER",

  // Conversation WhatsApp (boutons Payer et abonnement)
  whatsapp: "https://wa.me/message/W5EKFRGZB6ZBF1",

  // Numéro affiché en bas de page (lien d'appel direct)
  telephone: "0749415409",

  // Nombre d'images publicitaires : img/pub1.jpg ... img/pubN.jpg (max 12)
  // Une image absente est simplement ignorée.
  nbPubs: 6,

  // Vitesse du défilement des annonces (pixels par seconde)
  vitessePubs: 45,

  // Comment le code Wi-Fi est transmis au routeur :
  //   "same"  -> nom d'utilisateur = code ET mot de passe = code
  //   "empty" -> nom d'utilisateur = code, mot de passe vide
  // (dépend de la façon dont votre plateforme crée les codes)
  modeCode: "same",

  // Forfaits : temps | tarif | validité
  // secondes : durée du forfait (sert à reconnaître le forfait actif)
  // prefixe  : (optionnel) début du code si votre plateforme met un
  //            préfixe par forfait, ex. "3H" ; laisser "" sinon
  forfaits: [
    { temps: "3 heures", tarif: "100 F CFA",   validite: "3 heures",  secondes: 10800,   prefixe: "" },
    { temps: "1 jour",   tarif: "200 F CFA",   validite: "24 heures", secondes: 86400,   prefixe: "" },
    { temps: "2 jours",  tarif: "300 F CFA",   validite: "2 jours",   secondes: 172800,  prefixe: "" },
    { temps: "7 jours",  tarif: "800 F CFA",   validite: "7 jours",   secondes: 604800,  prefixe: "" },
    { temps: "1 mois",   tarif: "3 000 F CFA", validite: "30 jours",  secondes: 2592000, prefixe: "" }
  ],

  // Message WhatsApp pour un abonnement personnel
  messageAbonnement: "Bonjour, je souhaiterais demander un abonnement personnel (compte avec nom d'utilisateur et mot de passe) sur le Wi-Fi JY CENTER."
};
