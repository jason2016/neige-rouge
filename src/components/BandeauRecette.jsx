// Bandeau permanent de la page de test (/neige-rouge/recette/, espace neige-rouge-recette).
// Rendu seulement quand le build a VITE_RECETTE=1 : la production ne le contient jamais.
// pointer-events: none -> il ne bloque aucun bouton situe dessous.
export default function BandeauRecette() {
  if (import.meta.env.VITE_RECETTE !== "1") return null;
  return (
    <div data-nr="bandeau-recette" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100000, pointerEvents: "none",
      background: "repeating-linear-gradient(45deg, #facc15 0 14px, #000 14px 28px)",
      padding: 3,
    }}>
      <div style={{ background: "#facc15", color: "#000", textAlign: "center", fontWeight: 900, fontSize: 14, letterSpacing: 1, padding: "3px 0", fontFamily: "Inter, sans-serif" }}>
        TEST — commandes fictives · 测试 — 虚构订单
      </div>
    </div>
  );
}
