// Mise a jour automatique des pages restees ouvertes (2026-10-12).
//
// Pourquoi : les ecrans du restaurant (cuisine, ecran d'appel, poste comptoir, page de commande)
// restent ouverts des jours entiers. Le 2026-10-12, une page chargee avant le 2026-10-10 a envoye
// trois commandes a une API qui avait change : 401, commandes invisibles en cuisine. Chaque
// deploiement recreerait ce decalage. On compare donc, regulierement, la version du bundle charge
// (import.meta.env.VITE_BUILD_ID) a celle du deploiement (version.json, ecrit par vite.config.js).
//
// Quand elles different, on recharge — mais jamais au milieu de quelque chose :
//   - une requete d'action en cours (operation())           -> attendre qu'elle finisse
//   - un champ de saisie qui a le focus                      -> attendre
//   - un bloqueur pose par la page (panier non vide, ticket ouvert, suivi en attente, Gestion…)
// Les jetons du personnel sont dans localStorage : un rechargement ne demande pas de se reconnecter.
//
// INTERVALLE = 60 s : un deploiement est pris en compte en au plus ~1 min (+ le temps d'attendre
// qu'un ecran soit libre), pour une requete de ~100 octets par minute et par ecran — negligeable,
// et GitHub Pages sert version.json sans passer par notre serveur. Plus court n'apporterait rien :
// la propagation du CDN de GitHub Pages prend elle-meme de l'ordre de la minute.
const BASE = import.meta.env.BASE_URL;
export const VERSION = import.meta.env.VITE_BUILD_ID || "";
export const INTERVALLE_VERSION_MS = 60000;
const INTERVALLE_TENTATIVE_MS = 3000;
const CLE_RECHARGE = "nr_maj_recharge";

const bloqueurs = new Set();
const ecouteurs = new Set();
let operations = 0;
let nouvelle = "";

const prevenir = () => ecouteurs.forEach(f => { try { f(); } catch { /* ignore */ } });

/** Pose un bloqueur ; renvoie la fonction qui le retire. */
export function bloquerMiseAJour(raison) {
  const b = { raison };
  bloqueurs.add(b);
  return () => { bloqueurs.delete(b); };
}

/** Execute une action en interdisant le rechargement tant qu'elle n'a pas fini. */
export async function operation(fn) {
  operations++;
  try { return await fn(); } finally { operations--; }
}

function saisieEnCours() {
  const a = document.activeElement;
  if (!a) return false;
  return a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT" || a.isContentEditable;
}

export function raisonDAttente() {
  if (operations > 0) return "operation";
  if (saisieEnCours()) return "saisie";
  for (const b of bloqueurs) return b.raison;
  return "";
}

export const nouvelleVersion = () => nouvelle;
export function surChangement(f) { ecouteurs.add(f); return () => ecouteurs.delete(f); }

/** Vrai si cette page vient d'etre rechargee par nous (utile pour l'ecran d'appel et le son). */
export function rechargeeAutomatiquement() {
  try { return !!JSON.parse(sessionStorage.getItem(CLE_RECHARGE) || "null"); } catch { return false; }
}

// 🔴 Pas de boucle. Si le CDN sert encore l'ancien index.html alors que version.json est deja
// nouveau, recharger ne change rien : on espace alors les essais (60 s, 120 s, … 10 min) au lieu
// de recharger toutes les 3 s.
function essaiPermis(cible) {
  try {
    const r = JSON.parse(sessionStorage.getItem(CLE_RECHARGE) || "null");
    if (!r || r.vers !== cible || VERSION === cible) return true;
    const attente = Math.min(600000, 60000 * (r.n || 1));
    return Date.now() - (r.a || 0) > attente;
  } catch { return true; }
}

function recharger(cible) {
  try {
    const r = JSON.parse(sessionStorage.getItem(CLE_RECHARGE) || "null");
    const n = r && r.vers === cible ? (r.n || 1) + 1 : 1;
    sessionStorage.setItem(CLE_RECHARGE, JSON.stringify({ de: VERSION, vers: cible, n, a: Date.now() }));
  } catch { /* stockage indisponible : on recharge quand meme */ }
  window.location.reload();
}

let demarre = false;
export function demarrerMiseAJour() {
  if (demarre || !VERSION) return;
  demarre = true;
  // Un onglet en arriere-plan voit ses minuteries ralenties par le navigateur : des que la nouvelle
  // version est connue, on tente tout de suite, sans attendre le tour suivant (mesure du 2026-10-12 :
  // sans cela, un poste en arriere-plan a mis jusqu'a 2 min 27 s).
  let tenter = () => {};
  const lire = async () => {
    try {
      const r = await fetch(`${BASE}version.json?v=${Date.now()}`, { cache: "no-store" });
      if (!r.ok) return;
      const d = await r.json();
      const n = d && d.build && d.build !== VERSION ? d.build : "";
      if (n !== nouvelle) {
        nouvelle = n; prevenir();
        // Le service worker aussi : sinon l'ancien continuerait a servir son cache en secours.
        if (n && navigator.serviceWorker) navigator.serviceWorker.getRegistration()
          .then(reg => reg && reg.update()).catch(() => { /* pas de SW : rien a mettre a jour */ });
      }
      tenter();
    } catch { /* reseau : prochain essai dans 60 s */ }
  };
  tenter = () => {
    if (nouvelle && !raisonDAttente() && essaiPermis(nouvelle)) recharger(nouvelle);
  };
  lire();
  setInterval(lire, INTERVALLE_VERSION_MS);
  setInterval(tenter, INTERVALLE_TENTATIVE_MS);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") lire(); });
  // Pour la recette (et le diagnostic sur un ecran du restaurant) : etat lisible depuis la console.
  window.__nrMiseAJour = () => ({ version: VERSION, nouvelle, attente: raisonDAttente() });
}
