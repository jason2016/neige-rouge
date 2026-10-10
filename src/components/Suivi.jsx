// Suivi de commande et avis « commande prête » (2026-10-10).
//
// SuiviPage   #suivi?t=<jeton>     page du client : numéro, montant, état ; alerte quand c'est prêt
// ComptoirPage #comptoir?t=<jeton> poste du comptoir après une commande saisie pour un client : numéro + QR
// EcranPrets  #ready               écran d'appel : numéros prêts, rien d'autre
//
// Le jeton est aléatoire (128 bits, généré par le serveur). L'id et le numéro de commande se
// devinent : ils n'ouvrent aucune page ici.
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { estPosteComptoir } from "./posteComptoir";

const API = import.meta.env.VITE_API_BASE || "https://mcp.clawshow.ai";
const NS = import.meta.env.VITE_NAMESPACE || "neige-rouge";
// 10 s : assez court pour que l'alerte suive le « Prêt » de la cuisine de près, assez long pour
// qu'une salle pleine de téléphones ne pèse rien (6 requêtes/min/client, réponse de ~150 octets).
// Le retour au premier plan (visibilitychange) déclenche en plus une lecture immédiate.
const INTERVALLE_SUIVI_MS = 10000;
const INTERVALLE_ECRAN_MS = 5000;


const params = () => new URLSearchParams(window.location.hash.slice(window.location.hash.indexOf("?") + 1));
const langueInitiale = () => { try { return sessionStorage.getItem("nr_pending_lang") || "fr"; } catch { return "fr"; } };

const CSS = `
@keyframes nrPret { 0%, 49.9% { background: #16a34a; color: #fff; } 50%, 100% { background: #fff; color: #16a34a; } }
.nr-pret-flash { animation: nrPret 1s steps(1, end) infinite; }
.nr-pret-fixe { background: #16a34a; color: #fff; }
@media (prefers-reduced-motion: reduce) {
  .nr-pret-flash { animation: none; background: #16a34a; color: #fff; }
}
`;
// 1 cycle par seconde = 2 changements de couleur par seconde : sous la limite de 3 éclairs/s.

// ── Son : un contexte audio débloqué au premier geste ; sinon, silence sans erreur ──────────
let _audio = null;
function debloquerSon() {
  try {
    if (!_audio) _audio = new (window.AudioContext || window.webkitAudioContext)();
    if (_audio.state === "suspended") _audio.resume().catch(() => {});
  } catch { /* pas d'audio : silence */ }
}
function bip(n = 3) {
  try {
    if (!_audio) _audio = new (window.AudioContext || window.webkitAudioContext)();
    if (_audio.state !== "running") { _audio.resume().catch(() => {}); if (_audio.state !== "running") return false; }
    const t0 = _audio.currentTime;
    for (let i = 0; i < n; i++) {
      const o = _audio.createOscillator(), g = _audio.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(_audio.destination);
      g.gain.setValueAtTime(0.0001, t0 + i * 0.35);
      g.gain.exponentialRampToValueAtTime(0.4, t0 + i * 0.35 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.35 + 0.25);
      o.start(t0 + i * 0.35); o.stop(t0 + i * 0.35 + 0.26);
    }
    return true;
  } catch { return false; }
}
function vibrer() {
  try { if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]); } catch { /* non supporté */ }
}

// ── Écran allumé ────────────────────────────────────────────────────────────────────────────
function useVerrouEcran(actif) {
  const verrou = useRef(null);
  const [tenu, setTenu] = useState(false);
  useEffect(() => {
    let annule = false;
    const demander = async () => {
      try {
        if (!actif || !("wakeLock" in navigator) || document.visibilityState !== "visible") return;
        const v = await navigator.wakeLock.request("screen");
        if (annule) { v.release().catch(() => {}); return; }
        verrou.current = v; setTenu(true);
        v.addEventListener("release", () => setTenu(false));
      } catch { setTenu(false); }
    };
    // Le navigateur relâche le verrou quand la page passe en arrière-plan : on le redemande au retour.
    const surVisibilite = () => {
      if (document.visibilityState === "visible" && (!verrou.current || verrou.current.released)) demander();
    };
    if (actif) { demander(); document.addEventListener("visibilitychange", surVisibilite); }
    else if (verrou.current) { verrou.current.release().catch(() => {}); verrou.current = null; }
    return () => {
      annule = true;
      document.removeEventListener("visibilitychange", surVisibilite);
      if (verrou.current) { verrou.current.release().catch(() => {}); verrou.current = null; }
    };
  }, [actif]);
  return tenu;
}

// ── Lecture de l'état, avec reprise immédiate au retour au premier plan ─────────────────────
function useSuivi(jeton) {
  const [suivi, setSuivi] = useState(null);
  const [erreur, setErreur] = useState(jeton ? "" : "suivi_introuvable");
  useEffect(() => {
    if (!jeton) return;
    let fini = false, minuterie = null;
    const lire = async () => {
      try {
        const r = await fetch(`${API}/api/suivi/${encodeURIComponent(jeton)}`, { cache: "no-store" });
        const d = await r.json();
        // Jeton refusé : on efface ce qui était affiché. Sinon, un jeton changé dans l'URL (même page,
        // seul le hash bouge) laisserait à l'écran le numéro de la commande précédente.
        if (!r.ok) { setSuivi(null); setErreur(d.error || `HTTP ${r.status}`); return; }
        setErreur(""); setSuivi(d);
        if (d.etat === "retire") { fini = true; clearInterval(minuterie); }
      } catch { setErreur("reseau"); }
    };
    lire();
    minuterie = setInterval(() => { if (!fini) lire(); }, INTERVALLE_SUIVI_MS);
    const surVisibilite = () => { if (document.visibilityState === "visible" && !fini) lire(); };
    document.addEventListener("visibilitychange", surVisibilite);
    return () => { clearInterval(minuterie); document.removeEventListener("visibilitychange", surVisibilite); };
  }, [jeton]);
  return [suivi, erreur];
}

const T = {
  fr: {
    numero: "Votre numéro", presentez: "Présentez ce numéro à la caisse", montant: "Montant",
    payer: "Paiement au comptoir", enCours: "En préparation…", pret: "VOTRE COMMANDE EST PRÊTE !",
    toucher: "Touchez l'écran pour arrêter l'alerte", retire: "Commande terminée — bon appétit !",
    ecran: "Écran maintenu allumé jusqu'à ce que votre commande soit prête",
    prevenir: "🔔 Me prévenir quand c'est prêt", pushOk: "🔔 Vous serez prévenu sur ce téléphone",
    pushRefuse: "Notifications refusées — la page vous préviendra si elle reste ouverte",
    pushIndispo: "Notifications indisponibles sur ce navigateur", mailTitre: "📧 Recevoir un e-mail quand c'est prêt",
    mailNote: "Utilisée uniquement pour ce message, effacée sous 24 heures.", mailBouton: "OK",
    mailOk: "📧 Un e-mail vous sera envoyé quand ce sera prêt", mailErreur: "Adresse invalide",
    introuvable: "Commande introuvable", reseau: "Connexion perdue — nouvel essai automatique",
    suivez: "Suivez votre commande", scannez: "Scannez avec votre téléphone pour être prévenu",
    nouvelle: "Nouvelle commande", lang: "中文",
  },
  zh: {
    numero: "您的取餐号", presentez: "请到柜台出示此号码", montant: "金额",
    payer: "请到柜台付款", enCours: "制作中…", pret: "您的餐已准备好!",
    toucher: "点一下屏幕停止提醒", retire: "订单已完成 — 祝您用餐愉快!",
    ecran: "屏幕将保持常亮,直到您的餐准备好",
    prevenir: "🔔 餐好了提醒我", pushOk: "🔔 餐好后将在本机提醒您",
    pushRefuse: "通知已被拒绝 — 页面保持打开时仍会提醒",
    pushIndispo: "此浏览器不支持通知", mailTitre: "📧 餐好了发邮件给我",
    mailNote: "仅用于本次通知,24 小时内删除。", mailBouton: "确定",
    mailOk: "📧 餐好后将发邮件给您", mailErreur: "邮箱格式不正确",
    introuvable: "找不到该订单", reseau: "网络中断 — 将自动重试",
    suivez: "扫码跟踪订单", scannez: "用您的手机扫码,餐好时会收到提醒",
    nouvelle: "新订单", lang: "Français",
  },
};

const base = { minHeight: "100vh", fontFamily: "'Inter', -apple-system, sans-serif" };
const carte = { background: "white", borderRadius: 16, padding: "18px 16px", marginBottom: 16, border: "1px solid #eee" };

function urlB64ToUint8Array(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

function BoutonPush({ jeton, L }) {
  const supporte = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  const [etat, setEtat] = useState(supporte ? "inconnu" : "indispo"); // inconnu | dispo | actif | refuse | indispo
  const cle = useRef(null);
  useEffect(() => {
    if (!supporte) return;
    fetch(`${API}/api/suivi-push/cle`).then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.public_key) { cle.current = d.public_key; setEtat(Notification.permission === "denied" ? "refuse" : "dispo"); } else setEtat("indispo"); })
      .catch(() => setEtat("indispo"));
  }, [supporte]);
  const activer = async () => {
    try {
      const perm = await Notification.requestPermission();   // seulement sur ce clic
      if (perm !== "granted") { setEtat("refuse"); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8Array(cle.current) });
      // Le service worker reçoit un push vide et vient demander le numéro : il lui faut l'adresse de l'API.
      try { await (await caches.open("nr-config")).put("/neige-rouge/__api", new Response(API)); } catch { /* sans cache : avis générique */ }
      const r = await fetch(`${API}/api/suivi/${encodeURIComponent(jeton)}/push`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      setEtat(r.ok ? "actif" : "indispo");
    } catch { setEtat("indispo"); }
  };
  if (etat === "inconnu") return null;
  if (etat === "dispo") return (
    <button onClick={activer} data-nr="push" style={{ width: "100%", padding: 16, borderRadius: 12, border: "2px solid #8B0000", background: "white", color: "#8B0000", fontSize: 17, fontWeight: 700, cursor: "pointer", marginBottom: 12 }}>
      {L.prevenir}
    </button>
  );
  return <div data-nr="push-etat" style={{ fontSize: 13, color: etat === "actif" ? "#16a34a" : "#999", textAlign: "center", marginBottom: 12 }}>
    {etat === "actif" ? L.pushOk : etat === "refuse" ? L.pushRefuse : L.pushIndispo}
  </div>;
}

function FormulaireEmail({ jeton, L }) {
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState("");
  const envoyer = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/api/suivi/${encodeURIComponent(jeton)}/email`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      setEtat(r.ok ? "ok" : "erreur");
    } catch { setEtat("erreur"); }
  };
  if (etat === "ok") return <div data-nr="mail-etat" style={{ fontSize: 13, color: "#16a34a", textAlign: "center", marginBottom: 12 }}>{L.mailOk}</div>;
  return (
    <form onSubmit={envoyer} style={{ ...carte, padding: "14px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{L.mailTitre}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="email" inputMode="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} data-nr="mail"
          placeholder="vous@exemple.fr" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, minWidth: 0 }} />
        <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, border: "none", background: "#8B0000", color: "white", fontWeight: 700 }}>{L.mailBouton}</button>
      </div>
      <div style={{ fontSize: 11.5, color: "#888", marginTop: 6 }}>{L.mailNote}</div>
      {etat === "erreur" && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{L.mailErreur}</div>}
    </form>
  );
}

export function SuiviPage() {
  const jeton = params().get("t") || "";
  const [lang, setLang] = useState(langueInitiale);
  const L = T[lang];
  const [suivi, erreur] = useSuivi(jeton);
  const [acquitte, setAcquitte] = useState(false);   // le client a touché l'écran
  const dejaSonne = useRef(false);
  const etat = suivi?.etat;
  // L'écran cuisine passe une commande « ready » à « picked » au bout de 5 minutes (KitchenPanel,
  // comportement existant), que le client soit venu ou non. Une fois vue « prête » sur cette page,
  // l'alerte reste donc jusqu'au toucher du client, même si l'état est passé à « retire » entre-temps.
  const [aEtePrete, setAEtePrete] = useState(false);
  if (etat === "pret" && !aEtePrete) setAEtePrete(true);   // ajustement pendant le rendu (motif React documenté)
  const alerte = (etat === "pret" || (etat === "retire" && aEtePrete)) && !acquitte;
  const ecranTenu = useVerrouEcran(etat === "en_preparation" || alerte);

  useEffect(() => {
    if (etat === "pret" && !dejaSonne.current) { dejaSonne.current = true; vibrer(); bip(3); }
  }, [etat]);

  const arreter = () => { debloquerSon(); setAcquitte(true); };

  if (alerte) {
    return (
      <div onPointerDown={arreter} data-nr="alerte" className="nr-pret-flash"
        style={{ ...base, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, cursor: "pointer", userSelect: "none" }}>
        <style>{CSS}</style>
        <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.2 }}>{L.pret}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 88, fontWeight: 800, margin: "18px 0" }}>{suivi.order_number}</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{L.presentez}</div>
        <div style={{ fontSize: 13, marginTop: 28, opacity: 0.85 }}>{L.toucher}</div>
      </div>
    );
  }

  return (
    <div onPointerDown={debloquerSon} style={{ ...base, background: "#faf8f5" }}>
      <style>{CSS}</style>
      <div style={{ background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)", padding: "14px 20px", textAlign: "center", position: "relative" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>Neige Rouge</h1>
        <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{L.lang}</button>
      </div>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "24px 16px 60px" }}>
        {!suivi && erreur && <div data-nr="erreur" style={{ ...carte, textAlign: "center", color: "#991b1b" }}>{erreur === "reseau" ? L.reseau : L.introuvable}</div>}
        {suivi && (
          <>
            <div data-nr="numero" style={{ ...carte, textAlign: "center", border: "3px solid #8B0000" }}>
              <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 2 }}>{L.numero}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 72, fontWeight: 800, color: "#8B0000", lineHeight: 1.1 }}>{suivi.order_number}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{L.presentez}</div>
              <div data-nr="montant" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 700, color: "#8B0000", marginTop: 12 }}>
                {Number(suivi.total_amount || 0).toFixed(2)} €
              </div>
              {suivi.payment_status === "pending_counter" && <div style={{ fontSize: 14, color: "#92400e", marginTop: 4 }}>💳 {L.payer}</div>}
            </div>
            <div data-nr="etat" className={etat === "pret" ? "nr-pret-fixe" : ""}
              style={{ ...carte, textAlign: "center", fontSize: 20, fontWeight: 800, color: etat === "pret" ? "white" : etat === "retire" ? "#666" : "#d97706" }}>
              {etat === "pret" ? L.pret : etat === "retire" ? L.retire : L.enCours}
            </div>
            {etat === "en_preparation" && <>
              <BoutonPush jeton={jeton} L={L} />
              <FormulaireEmail jeton={jeton} L={L} />
              {ecranTenu && <div data-nr="ecran" style={{ fontSize: 12, color: "#888", textAlign: "center" }}>🔆 {L.ecran}</div>}
            </>}
            {erreur === "reseau" && <div style={{ fontSize: 12, color: "#991b1b", textAlign: "center", marginTop: 8 }}>{L.reseau}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export function ComptoirPage() {
  const jeton = params().get("t") || "";
  const [lang, setLang] = useState(langueInitiale);
  const L = T[lang];
  const [suivi, erreur] = useSuivi(jeton);
  const [qr, setQr] = useState("");
  const url = `${window.location.origin}${window.location.pathname}#suivi?t=${encodeURIComponent(jeton)}`;
  useEffect(() => {
    if (!jeton) return;
    QRCode.toDataURL(url, { width: 320, margin: 1, errorCorrectionLevel: "M" }).then(setQr).catch(() => setQr(""));
  }, [url, jeton]);
  return (
    <div style={{ ...base, background: "#faf8f5" }}>
      <div style={{ background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)", padding: "14px 20px", textAlign: "center", position: "relative" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>Neige Rouge · Comptoir</h1>
        <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{L.lang}</button>
      </div>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "20px 16px 40px", textAlign: "center" }}>
        {!suivi && erreur && <div data-nr="erreur" style={{ ...carte, color: "#991b1b" }}>{L.introuvable}</div>}
        {suivi && <>
          <div style={{ fontSize: 13, color: "#999", textTransform: "uppercase", letterSpacing: 2 }}>{L.numero}</div>
          <div data-nr="numero" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 96, fontWeight: 800, color: "#8B0000", lineHeight: 1.05 }}>{suivi.order_number}</div>
          <div data-nr="montant" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 700, color: "#8B0000", marginBottom: 16 }}>{Number(suivi.total_amount || 0).toFixed(2)} €</div>
          <div style={{ ...carte }}>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📱 {L.suivez}</div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 10 }}>{L.scannez}</div>
            {qr && <img data-nr="qr" data-url={url} src={qr} alt={L.suivez} style={{ width: 280, height: 280, imageRendering: "pixelated" }} />}
          </div>
        </>}
        <a href="#order" style={{ display: "block", padding: 16, borderRadius: 12, background: "#8B0000", color: "white", fontSize: 17, fontWeight: 700, textDecoration: "none" }}>
          + {L.nouvelle}
        </a>
      </div>
    </div>
  );
}

export function EcranPrets() {
  const [demarre, setDemarre] = useState(false);
  const [numeros, setNumeros] = useState([]);
  const [neufs, setNeufs] = useState({});      // numero -> instant d'apparition
  const precedent = useRef(null);
  useVerrouEcran(demarre);
  useEffect(() => {
    if (!demarre) return;
    let minuterie;
    const lire = async () => {
      try {
        const r = await fetch(`${API}/api/prets?namespace=${NS}`, { cache: "no-store" });
        if (!r.ok) return;
        const liste = (await r.json()).numeros || [];
        if (precedent.current) {
          const nouveaux = liste.filter(n => !precedent.current.includes(n));
          if (nouveaux.length) {
            const t = Date.now();
            setNeufs(p => ({ ...p, ...Object.fromEntries(nouveaux.map(n => [n, t])) }));
            bip(2);
          }
        }
        precedent.current = liste;
        setNumeros(liste);
      } catch { /* réseau : on garde l'affichage, prochain essai dans 5 s */ }
    };
    lire();
    minuterie = setInterval(lire, INTERVALLE_ECRAN_MS);
    const surVisibilite = () => { if (document.visibilityState === "visible") lire(); };
    document.addEventListener("visibilitychange", surVisibilite);
    const nettoyage = setInterval(() => setNeufs(p => Object.fromEntries(Object.entries(p).filter(([, t]) => Date.now() - t < 6000))), 1000);
    return () => { clearInterval(minuterie); clearInterval(nettoyage); document.removeEventListener("visibilitychange", surVisibilite); };
  }, [demarre]);

  if (!demarre) {
    return (
      <div onClick={() => { debloquerSon(); setDemarre(true); }} data-nr="demarrer"
        style={{ ...base, background: "#1a1a1a", color: "white", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", cursor: "pointer", padding: 24 }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>Écran d'appel · 叫号屏</div>
          <div style={{ fontSize: 18, marginTop: 14, opacity: 0.8 }}>Touchez pour démarrer (son + écran allumé)<br />点击开始(提示音 + 屏幕常亮)</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...base, background: "#111", color: "white", padding: "16px 20px" }}>
      <style>{CSS}</style>
      <div style={{ fontSize: 30, fontWeight: 900, textAlign: "center", marginBottom: 16, color: "#4ade80" }}>PRÊT · 请取餐</div>
      <div data-nr="liste" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {numeros.map(n => (
          <div key={n} data-nr="numero" data-neuf={neufs[n] ? "1" : "0"} className={neufs[n] ? "nr-pret-flash" : "nr-pret-fixe"}
            style={{ borderRadius: 16, padding: "22px 0", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 72, fontWeight: 800 }}>
            {n}
          </div>
        ))}
      </div>
      {numeros.length === 0 && <div style={{ textAlign: "center", fontSize: 22, opacity: 0.4, marginTop: 80 }}>—</div>}
    </div>
  );
}

export function ReglagePosteComptoir() {
  const [actif, setActif] = useState(estPosteComptoir);
  const basculer = () => {
    try {
      if (actif) localStorage.removeItem("nr_poste_comptoir"); else localStorage.setItem("nr_poste_comptoir", "1");
      setActif(!actif);
    } catch { /* stockage indisponible */ }
  };
  return (
    <button onClick={basculer} data-nr="poste-comptoir" title="Les commandes saisies sur cet appareil sont comptées « comptoir » et affichent un QR pour le client"
      style={{ background: actif ? "#16a34a" : "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
      {actif ? "🧾 Poste comptoir : ON" : "🧾 Poste comptoir : OFF"}
    </button>
  );
}
