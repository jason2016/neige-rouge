// Bandeau « nouvelle version » (2026-10-12) — seulement la ou le rechargement automatique est
// volontairement suspendu (Gestion : des saisies peuvent etre en cours sans avoir le focus).
// Ailleurs la page se recharge seule des qu'elle est libre (voir miseAJour.js).
import { useEffect, useState } from "react";
import { nouvelleVersion, raisonDAttente, surChangement } from "./miseAJour";

export default function BandeauMiseAJour() {
  const [, forcer] = useState(0);
  useEffect(() => {
    const off = surChangement(() => forcer(n => n + 1));
    const t = setInterval(() => forcer(n => n + 1), 5000);
    return () => { off(); clearInterval(t); };
  }, []);
  if (!nouvelleVersion() || raisonDAttente() !== "gestion") return null;
  return (
    <div data-nr="maj-dispo" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 9999, background: "#1d4ed8", color: "white", padding: "10px 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 600 }}>
      Nouvelle version disponible · 有新版本
      <button onClick={() => window.location.reload()} style={{ background: "white", color: "#1d4ed8", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, cursor: "pointer" }}>
        Rafraîchir · 刷新
      </button>
    </div>
  );
}
