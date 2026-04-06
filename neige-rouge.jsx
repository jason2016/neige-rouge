import { useState, useEffect } from "react";

const MENU = {
  menus: [
    { id: "A", name: "Menu A", desc: "2 Nems légumes + Salade d'algues ou omelette nature/piquant + Nouilles ou riz", descZh: "2个蔬菜春卷 + 海藻沙拉或煎蛋 + 面或饭", price: 7.50 },
    { id: "B", name: "Menu B", desc: "2 Nems poulet ou salade d'algues + poulet croustillant ou porc caramel ou porc laqué + Nouilles ou riz", descZh: "2个鸡肉春卷或海藻沙拉 + 脆皮鸡/焦糖猪肉/叉烧 + 面或饭", price: 10.00 },
    { id: "C", name: "Menu C", desc: "Poulet croustillant + Porc caramel ou porc laqué ou 2 papillotes de crevettes + Nouilles ou riz", descZh: "脆皮鸡 + 焦糖猪肉/叉烧/2个虾卷 + 面或饭", price: 11.00 },
    { id: "D", name: "Menu D", desc: "Poulet croustillant ou porc caramel ou porc laqué + Nouilles ou riz", descZh: "脆皮鸡或焦糖猪肉或叉烧 + 面或饭", price: 8.00 },
    { id: "F", name: "Menu F", desc: "3 Nems poulet ou 3 raviolis ou 2 papillotes de crevettes + Nouilles ou riz", descZh: "3个鸡肉春卷或3个饺子或2个虾卷 + 面或饭", price: 6.00 },
  ],
  plats: [
    { id: "loclac", name: "Loc Lac", desc: "Œuf +1€", descZh: "越式铁板牛肉饭（加蛋+1€）", price: 12.00, emoji: "🔥" },
    { id: "curry", name: "Curry Cheese Poulet Croustillant", descZh: "咖喱芝士脆皮鸡", price: 12.00, emoji: "🍛" },
    { id: "soupe", name: "Soupe de Raviolis", descZh: "虾饺汤面", price: 10.00, emoji: "🥟" },
    { id: "citron", name: "Poulet Citronnelle", descZh: "香茅鸡", price: 9.00, emoji: "🍋" },
  ],
  banhMi: [
    { id: "bm-poulet", name: "Banh Mi Poulet", descZh: "鸡肉越南法棍", price: 6.00 },
    { id: "bm-boeuf", name: "Banh Mi Boeuf", descZh: "牛肉越南法棍", price: 6.00 },
    { id: "bm-veg", name: "Banh Mi Végétarien", descZh: "素越南法棍", price: 6.00 },
    { id: "bm-special", name: "Banh Mi Poulet Croustillant ou Porc Caramel", descZh: "脆皮鸡/焦糖猪肉越南法棍", price: 6.40 },
    { id: "bm-bt", name: "Banh Mi + Bubble Tea", descZh: "越南法棍 + 奶茶", price: 10.00 },
  ],
  boBun: [
    { id: "bobun-b", name: "Bò Bún Boeuf", descZh: "牛肉米粉沙拉", price: 10.50, emoji: "🥩" },
    { id: "bobun-p", name: "Bò Bún Poulet", descZh: "鸡肉米粉沙拉", price: 10.50, emoji: "🍗" },
    { id: "bobun-v", name: "Bò Bún Végétarien", descZh: "素米粉沙拉", price: 10.50, emoji: "🥬" },
  ],
  carte: [
    { id: "pap", name: "4 Papillotes de Crevettes", descZh: "4个虾卷", price: 6.50 },
    { id: "temp", name: "4 Tempura Crevette", descZh: "4个炸虾天妇罗", price: 6.50 },
    { id: "nems", name: "2 Nems Poulet ou Légumes", descZh: "2个春卷（鸡肉或蔬菜）", price: 2.50 },
    { id: "rav", name: "2 Raviolis Poulet", descZh: "2个鸡肉饺子", price: 2.50 },
  ],
  desserts: [
    { id: "coco", name: "Boule de Coco", descZh: "椰子球", price: 1.50 },
    { id: "fond", name: "Fondant au Chocolat", descZh: "巧克力熔岩蛋糕", price: 3.00 },
    { id: "mochi", name: "2 Mochis Glacé", descZh: "2个冰麻薯", price: 4.00 },
  ],
  boissons: [
    { id: "coca", name: "Coca Cola 33cl", descZh: "可口可乐 33cl", price: 1.70 },
    { id: "orangina", name: "Orangina 33cl", descZh: "橙味汽水 33cl", price: 1.70 },
    { id: "oasis", name: "Oasis 33cl", descZh: "绿洲果汁 33cl", price: 1.70 },
    { id: "perrier", name: "Perrier 33cl", descZh: "巴黎水 33cl", price: 1.70 },
    { id: "icetea", name: "Ice Tea 33cl", descZh: "冰红茶 33cl", price: 1.70 },
    { id: "mangue", name: "Jus de Mangue 25cl", descZh: "芒果汁 25cl", price: 2.00 },
    { id: "coco-jus", name: "Jus de Coco 25cl", descZh: "椰子汁 25cl", price: 2.00 },
    { id: "litchi", name: "Jus de Litchi 25cl", descZh: "荔枝汁 25cl", price: 2.00 },
    { id: "monomoko", name: "Mono Moko 32cl", descZh: "Mono Moko 32cl", price: 2.00 },
    { id: "biere", name: "Bière 33cl", descZh: "啤酒 33cl", price: 3.00 },
  ],
};

const t = {
  fr: {
    title: "Neige Rouge",
    subtitle: "Cuisine Vietnamienne Authentique",
    tagline: "红雪 · Depuis 2015",
    nav: { menu: "Carte", order: "Commander", contact: "Contact" },
    sections: { menus: "Menu Bento", plats: "Plats", banhMi: "Banh Mi", boBun: "Bò Bún", carte: "À la Carte", desserts: "Desserts", boissons: "Boissons" },
    order: {
      title: "Votre commande",
      empty: "Votre panier est vide",
      name: "Nom",
      phone: "Téléphone",
      date: "Date de retrait",
      time: "Heure",
      notes: "Remarques",
      submit: "Passer commande",
      total: "Total",
      success: "Commande envoyée !",
      successMsg: "Vous recevrez une confirmation par SMS.",
      back: "Nouvelle commande",
      pickup: "À emporter / Sur place",
      surPlace: "Sur place",
      emporter: "À emporter",
    },
    info: {
      hours: "Lun-Sam · 11h30–15h00",
      phone: "01 72 60 46 89",
      address: "Paris",
    },
    switchLang: "中文",
    add: "Ajouter",
    added: "✓",
  },
  zh: {
    title: "红雪",
    subtitle: "正宗越南料理",
    tagline: "Neige Rouge · 始于2015",
    nav: { menu: "菜单", order: "下单", contact: "联系" },
    sections: { menus: "便当套餐", plats: "主菜", banhMi: "越南法棍", boBun: "米粉沙拉", carte: "单点", desserts: "甜点", boissons: "饮品" },
    order: {
      title: "您的订单",
      empty: "购物车为空",
      name: "姓名",
      phone: "电话",
      date: "取餐日期",
      time: "时间",
      notes: "备注",
      submit: "提交订单",
      total: "合计",
      success: "下单成功！",
      successMsg: "您将收到确认短信。",
      back: "再次下单",
      pickup: "堂食 / 外带",
      surPlace: "堂食",
      emporter: "外带",
    },
    info: {
      hours: "周一至周六 · 11:30–15:00",
      phone: "01 72 60 46 89",
      address: "巴黎",
    },
    switchLang: "Français",
    add: "添加",
    added: "✓",
  },
};

function ItemRow({ item, lang, qty, onAdd, onRemove }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid rgba(139,0,0,0.08)",
    }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>
            {item.emoji ? `${item.emoji} ` : ""}{item.name}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#8B0000", fontSize: 14 }}>
            {item.price.toFixed(2)}€
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: "#888", marginTop: 3, lineHeight: 1.4 }}>
          {lang === "zh" && item.descZh ? item.descZh : item.desc}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {qty > 0 && (
          <>
            <button onClick={() => onRemove(item.id)} style={{
              width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #ccc",
              background: "white", color: "#666", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
            }}>−</button>
            <span style={{ width: 24, textAlign: "center", fontWeight: 700, fontSize: 15, color: "#8B0000" }}>{qty}</span>
          </>
        )}
        <button onClick={() => onAdd(item.id)} style={{
          width: 28, height: 28, borderRadius: "50%",
          border: qty > 0 ? "1.5px solid #8B0000" : "1.5px solid #ccc",
          background: qty > 0 ? "#8B0000" : "white",
          color: qty > 0 ? "white" : "#666",
          fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1,
        }}>+</button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3,
        color: "#8B0000", marginBottom: 12, paddingBottom: 8,
        borderBottom: "2px solid #8B0000",
      }}>{title}</div>
      {children}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("fr");
  const [cart, setCart] = useState({});
  const [view, setView] = useState("menu");
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "12:00", notes: "", type: "surPlace" });
  const [submitted, setSubmitted] = useState(false);

  const T = t[lang];
  const allItems = [...MENU.menus, ...MENU.plats, ...MENU.banhMi, ...MENU.boBun, ...MENU.carte, ...MENU.desserts, ...MENU.boissons];
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...allItems.find(i => i.id === id), qty })).filter(i => i.name);
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const add = (id) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id) => setCart(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }));

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (!form.date) setForm(f => ({ ...f, date: defaultDate }));
  }, []);

  const handleSubmit = () => {
    if (form.name && form.phone && cartItems.length > 0) {
      setSubmitted(true);
      setView("menu");
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#8B0000", marginBottom: 12 }}>{T.order.success}</h2>
          <p style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>{T.order.successMsg}</p>
          <div style={{ background: "white", borderRadius: 12, padding: 20, margin: "24px 0", textAlign: "left", border: "1px solid #eee" }}>
            <div style={{ fontSize: 14, marginBottom: 6 }}><strong>{form.name}</strong> · {form.phone}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>{form.date} · {form.time} · {T.order[form.type === "surPlace" ? "surPlace" : "emporter"]}</div>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 14 }}>
                <span>{item.name} ×{item.qty}</span>
                <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace" }}>{(item.price * item.qty).toFixed(2)}€</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee", fontWeight: 700 }}>
              <span>{T.order.total}</span>
              <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{total.toFixed(2)}€</span>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setCart({}); setForm({ name: "", phone: "", date: defaultDate, time: "12:00", notes: "", type: "surPlace" }); }}
            style={{ padding: "12px 28px", borderRadius: 10, border: "1px solid #ddd", background: "white", color: "#666", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {T.order.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
        padding: "32px 20px 28px", textAlign: "center", position: "relative",
      }}>
        <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.15)", border: "none", color: "rgba(255,255,255,0.9)",
          padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>{T.switchLang}</button>

        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{T.tagline}</div>
        <h1 style={{
          fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "'Playfair Display', serif",
          fontSize: lang === "zh" ? 38 : 42, fontWeight: 900, color: "white", margin: 0, lineHeight: 1.1,
        }}>{T.title}</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 8, fontWeight: 400 }}>{T.subtitle}</p>
        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
          {T.info.hours} · ☎ {T.info.phone}
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(250,248,245,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #eee",
        display: "flex", justifyContent: "center", gap: 0,
      }}>
        {["menu", "order"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "14px 24px", border: "none", background: "transparent",
            fontSize: 13, fontWeight: 600, cursor: "pointer", position: "relative",
            color: view === v ? "#8B0000" : "#999",
            borderBottom: view === v ? "2px solid #8B0000" : "2px solid transparent",
          }}>
            {v === "menu" ? T.nav.menu : T.nav.order}
            {v === "order" && cartCount > 0 && (
              <span style={{
                position: "absolute", top: 8, right: 4,
                background: "#8B0000", color: "white", borderRadius: 10,
                fontSize: 10, fontWeight: 700, padding: "1px 6px", minWidth: 16, textAlign: "center",
              }}>{cartCount}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 100px" }}>

        {/* MENU VIEW */}
        {view === "menu" && (
          <>
            <Section title={T.sections.menus}>
              {MENU.menus.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.plats}>
              {MENU.plats.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.banhMi}>
              {MENU.banhMi.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.boBun}>
              {MENU.boBun.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.carte}>
              {MENU.carte.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.desserts}>
              {MENU.desserts.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
            <Section title={T.sections.boissons}>
              {MENU.boissons.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
            </Section>
          </>
        )}

        {/* ORDER VIEW */}
        {view === "order" && (
          <>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <p>{T.order.empty}</p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div style={{ background: "white", borderRadius: 14, padding: "4px 16px", marginBottom: 20, border: "1px solid #eee" }}>
                  {cartItems.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "14px 0",
                      borderBottom: i < cartItems.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: "#999", marginLeft: 6, fontSize: 13 }}>×{item.qty}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 600 }}>
                          {(item.price * item.qty).toFixed(2)}€
                        </span>
                        <button onClick={() => remove(item.id)} style={{
                          width: 24, height: 24, borderRadius: "50%", border: "1px solid #ddd",
                          background: "white", color: "#999", fontSize: 14, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>×</button>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 12px", borderTop: "2px solid #8B0000" }}>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{T.order.total}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Pickup type */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {["surPlace", "emporter"].map(type => (
                      <button key={type} onClick={() => setForm({ ...form, type })} style={{
                        flex: 1, padding: "12px", borderRadius: 10,
                        border: form.type === type ? "2px solid #8B0000" : "1px solid #ddd",
                        background: form.type === type ? "rgba(139,0,0,0.05)" : "white",
                        color: form.type === type ? "#8B0000" : "#999",
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                      }}>{T.order[type]}</button>
                    ))}
                  </div>

                  {[
                    { key: "name", type: "text" },
                    { key: "phone", type: "tel" },
                  ].map(({ key, type }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 6, display: "block" }}>
                        {T.order[key]} *
                      </label>
                      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{
                        width: "100%", padding: "12px 14px", borderRadius: 10,
                        border: "1px solid #ddd", background: "white", color: "#1a1a1a",
                        fontSize: 16, outline: "none", boxSizing: "border-box",
                      }} />
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 6, display: "block" }}>{T.order.date}</label>
                      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{
                        width: "100%", padding: "12px 14px", borderRadius: 10,
                        border: "1px solid #ddd", background: "white", color: "#1a1a1a",
                        fontSize: 15, outline: "none", boxSizing: "border-box",
                      }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 6, display: "block" }}>{T.order.time}</label>
                      <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{
                        width: "100%", padding: "12px 14px", borderRadius: 10,
                        border: "1px solid #ddd", background: "white", color: "#1a1a1a",
                        fontSize: 15, outline: "none", boxSizing: "border-box",
                      }}>
                        {["11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00"].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 6, display: "block" }}>{T.order.notes}</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10,
                      border: "1px solid #ddd", background: "white", color: "#1a1a1a",
                      fontSize: 15, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }} />
                  </div>

                  <button onClick={handleSubmit} disabled={!form.name || !form.phone} style={{
                    padding: "16px", borderRadius: 12, border: "none",
                    background: form.name && form.phone ? "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)" : "#ddd",
                    color: form.name && form.phone ? "white" : "#999",
                    fontSize: 16, fontWeight: 700, cursor: form.name && form.phone ? "pointer" : "default",
                    letterSpacing: 0.5, marginTop: 4,
                  }}>
                    {T.order.submit} · {total.toFixed(2)}€
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Floating cart bar */}
      {view === "menu" && cartCount > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(250,248,245,0.95)", backdropFilter: "blur(12px)",
          borderTop: "1px solid #eee", padding: "12px 16px", zIndex: 100,
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#999" }}>{cartCount} {lang === "fr" ? "article(s)" : "件"}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</div>
            </div>
            <button onClick={() => setView("order")} style={{
              background: "#8B0000", color: "white", border: "none",
              padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              {T.nav.order} →
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px", fontSize: 11, color: "#ccc" }}>
        Powered by ClawShow · neigerouge.fr
      </div>
    </div>
  );
}
