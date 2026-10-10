// Un appareil « poste comptoir » saisit des commandes pour les clients : elles sont comptées
// order_source = "staff" et l'écran affiche ensuite un QR de suivi pour le client.
// Réglage local à l'appareil (bouton dans Gestion), pas un droit : il ne change que le comptage
// et l'écran affiché après la commande.
// Cle propre a l'espace : la recette et la production partagent l'origine jason2016.github.io,
// donc le meme localStorage ; un reglage fait sur la page de test ne doit pas toucher la production.
const NS = import.meta.env.VITE_NAMESPACE || "neige-rouge";
export const CLE_POSTE_COMPTOIR = NS === "neige-rouge" ? "nr_poste_comptoir" : `nr_poste_comptoir:${NS}`;
export const estPosteComptoir = () => {
  try { return localStorage.getItem(CLE_POSTE_COMPTOIR) === "1"; } catch { return false; }
};
export const activerPosteComptoir = () => {
  try { localStorage.setItem(CLE_POSTE_COMPTOIR, "1"); return true; } catch { return false; }
};
// « #order?comptoir=1 » : un appareil du personnel demande le mode comptoir (aucune nouvelle route).
export const demandeModeComptoir = () =>
  new URLSearchParams(window.location.hash.split("?")[1] || "").get("comptoir") === "1";
