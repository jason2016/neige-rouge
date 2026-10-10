// Session du personnel (cuisine, mode comptoir, poste de travail) — 2026-10-10.
// Le mot de passe est vérifié par le SERVEUR (POST /api/staff/login) ; le navigateur ne garde qu'un
// jeton signé, valable quelques heures, propre à l'espace (production / recette ne se mélangent pas).
// Aucun mot de passe dans ce fichier ni dans le bundle.
const API = import.meta.env.VITE_API_BASE || "https://mcp.clawshow.ai";
const NS = import.meta.env.VITE_NAMESPACE || "neige-rouge";
const CLE = NS === "neige-rouge" ? "nr_jeton_personnel" : `nr_jeton_personnel:${NS}`;

// Émis quand le serveur refuse le jeton (401) : chaque écran affiche alors sa demande de reconnexion.
export const EVT_SESSION_EXPIREE = "nr-session-personnel-expiree";

export function lireSession() {
  try {
    const s = JSON.parse(localStorage.getItem(CLE) || "null");
    if (s && s.token && s.expires_at * 1000 > Date.now()) return s;
  } catch { /* stockage indisponible */ }
  return null;
}
export const sessionValide = () => !!lireSession();

export function deconnecterPersonnel() {
  try { localStorage.removeItem(CLE); } catch { /* rien à faire */ }
}

// Retourne { ok: true } ou { ok: false, erreur: "invalid_password" | "too_many_attempts" | "reseau" | … }
export async function connecterPersonnel(motDePasse) {
  try {
    const r = await fetch(`${API}/api/staff/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namespace: NS, password: motDePasse }),
    });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.token) {
      localStorage.setItem(CLE, JSON.stringify({ token: d.token, expires_at: d.expires_at }));
      return { ok: true };
    }
    return { ok: false, erreur: d.error || `HTTP ${r.status}` };
  } catch {
    return { ok: false, erreur: "reseau" };
  }
}

export const entetesPersonnel = () => {
  const s = lireSession();
  return s ? { Authorization: `Bearer ${s.token}` } : {};
};

// fetch avec le jeton ; sur 401, la session locale est effacée et l'événement est émis (jamais silencieux).
export async function fetchPersonnel(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { ...(opts.headers || {}), ...entetesPersonnel() } });
  if (r.status === 401) {
    deconnecterPersonnel();
    window.dispatchEvent(new Event(EVT_SESSION_EXPIREE));
  }
  return r;
}

export const messageErreurConnexion = (erreur, lang = "fr") => ({
  invalid_password: lang === "zh" ? "密码错误" : "Mot de passe incorrect",
  too_many_attempts: lang === "zh" ? "尝试次数过多,请 5 分钟后再试" : "Trop d'essais — réessayez dans 5 minutes",
  reseau: lang === "zh" ? "网络错误" : "Erreur de connexion",
}[erreur] || (lang === "zh" ? `登录失败(${erreur})` : `Connexion refusée (${erreur})`));
