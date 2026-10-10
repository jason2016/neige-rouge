// Un appareil « poste comptoir » saisit des commandes pour les clients : elles sont comptées
// order_source = "staff" et l'écran affiche ensuite un QR de suivi pour le client.
// Réglage local à l'appareil (bouton dans Gestion), pas un droit : il ne change que le comptage
// et l'écran affiché après la commande.
export const estPosteComptoir = () => {
  try { return localStorage.getItem("nr_poste_comptoir") === "1"; } catch { return false; }
};
