import { useState, useEffect } from "react";

const MENU = {
  menus: [
    { id: "A", name: "Menu A", desc: "2 nems légumes + salade d'algue ou omelette nature ou piquante + nouille ou riz", descZh: "2个蔬菜春卷 + 海藻沙拉或煎蛋 + 面或饭", price: 6.80 },
    { id: "B", name: "Menu B", desc: "2 nems poulet ou salade d'algue + poulet croustillant ou porc caramel ou porc laqué + nouille ou riz", descZh: "2个鸡肉春卷或海藻沙拉 + 脆皮鸡/焦糖猪肉/叉烧 + 面或饭", price: 8.50 },
    { id: "C", name: "Menu C", desc: "Poulet croustillant + porc caramel ou 2 papillotes de crevette ou porc laqué + nouille ou riz", descZh: "脆皮鸡 + 焦糖猪肉/2个虾卷/叉烧 + 面或饭", price: 9.50 },
    { id: "D", name: "Menu D", desc: "Poulet croustillant ou porc caramel ou porc laqué + nouille ou riz", descZh: "脆皮鸡或焦糖猪肉或叉烧 + 面或饭", price: 7.20 },
    { id: "F", name: "Menu F", desc: "3 nems poulet ou 3 raviolis ou 2 papillotes de crevette + nouille ou riz", descZh: "3个鸡肉春卷或3个饺子或2个虾卷 + 面或饭", price: 5.50 },
  ],
  plats: [
    { id: "bobun-b", name: "Bò Bún Boeuf", desc: "Salade à base de vermicelles de riz, carottes, pousse de soja, concombre, cacahuète, menthe et nems", descZh: "牛肉米粉沙拉", price: 8.50, emoji: "🥩" },
    { id: "bobun-p", name: "Bò Bún Poulet", desc: "Salade de vermicelles au poulet", descZh: "鸡肉米粉沙拉", price: 8.50, emoji: "🍗" },
    { id: "bobun-v", name: "Bò Bún Végétarien", desc: "Salade de vermicelles végétarienne", descZh: "素米粉沙拉", price: 8.50, emoji: "🥬" },
    { id: "loclac", name: "Loc Lac", desc: "Riz tomate, bœuf mariné sauté à la poêle, jus de citron salé et au poivre avec un peu de crudité", descZh: "越式铁板牛肉饭", price: 10.00, emoji: "🔥" },
    { id: "citron", name: "Poulet Citronnelle", desc: "Riz blanc, radis mariné, sauce nems et poulet citronnelle", descZh: "香茅鸡配白饭", price: 8.00, emoji: "🍋" },
    { id: "soupe", name: "Soupe de Raviolis", desc: "Soupe de nouilles et de raviolis crevettes", descZh: "虾饺汤面", price: 8.50, emoji: "🥟" },
  ],
  sandwiches: [
    { id: "sw-v", name: "Sandwich Vietnamien Viande", desc: "Poulet ou porc ou boeuf", descZh: "越南三明治（肉）", price: 5.50 },
    { id: "sw-vg", name: "Sandwich Vietnamien Végétarien", desc: "Sandwich végétarien", descZh: "越南素三明治", price: 5.50 },
    { id: "sw-v-bt", name: "Sandwich Viande + Bubble Tea", desc: "Sandwich viande avec bubble tea", descZh: "肉三明治 + 奶茶", price: 9.00 },
    { id: "sw-vg-bt", name: "Sandwich Végétarien + Bubble Tea", desc: "Sandwich végétarien avec bubble tea", descZh: "素三明治 + 奶茶", price: 9.00 },
  ],
  bubbleTea: [
    { id: "bt-lait", name: "Bubble Tea Thé au Lait", desc: "Coco, Mangue, Fraise, Taro", descZh: "奶茶系列：椰子/芒果/草莓/芋头", price: 5.00 },
    { id: "bt-fruit", name: "Bubble Tea Thé aux Fruits", desc: "Citron, Mangue, Kiwi, Fruit de la passion, Litchi", descZh: "果茶系列：柠檬/芒果/猕猴桃/百香果/荔枝", price: 5.00 },
  ],
  carte: [
    { id: "pap", name: "4 Papillotes Crevette", descZh: "4个虾卷", price: 5.50 },
    { id: "temp", name: "4 Tempora Crevette", descZh: "4个炸虾天妇罗", price: 5.50 },
    { id: "nems", name: "2 Nems Poulet ou Légume", descZh: "2个春卷（鸡肉或蔬菜）", price: 1.80 },
    { id: "rav", name: "2 Raviolis", descZh: "2个饺子", price: 1.80 },
    { id: "sal", name: "Salade Surimi et Crevette", descZh: "蟹柳虾沙拉", price: 4.50 },
  ],
  boissons: [
    { id: "gaz", name: "Boisson Gazeuse", descZh: "碳酸饮料", price: 1.50 },
    { id: "jus", name: "Jus de Fruit", descZh: "果汁", price: 2.00 },
    { id: "biere", name: "Bière 33cl", descZh: "啤酒 33cl", price: 3.00 },
  ],
  desserts: [
    { id: "coco", name: "1 Boule de Coco", descZh: "椰子球", price: 1.50 },
    { id: "fond", name: "Fondant au Chocolat", descZh: "巧克力熔岩蛋糕", price: 3.00 },
    { id: "mochi", name: "2 Mochi Glacé", descZh: "2个冰麻薯", price: 3.00 },
  ],
};

const t = {
  fr: {
    title: "Neige Rouge",
    subtitle: "Cuisine Vietnamienne Authentique",
    tagline: "红雪 · Depuis 2015",
    nav: { menu: "Carte", order: "Commander", contact: "Contact" },
    sections: { menus: "Menus", plats: "Plats", sandwiches: "Sandwiches", bubbleTea: "Bubble Tea", carte: "À la Carte", boissons: "Boissons", desserts: "Desserts" },
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
    sections: { menus: "套餐", plats: "主菜", sandwiches: "三明治", bubbleTea: "奶茶", carte: "单点", boissons: "饮品", desserts: "甜点" },
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

const API = "https://mcp.clawshow.ai";
const NS = "neige-rouge";

const adminT = {
  fr: {
    login: "Accès gestion", password: "Mot de passe", enter: "Entrer", wrong: "Mot de passe incorrect",
    title: "Gestion des commandes", date: "Date", today: "Aujourd'hui", tomorrow: "Demain",
    thisWeek: "Semaine", thisMonth: "Mois", from: "Du", to: "Au",
    total: "Total", bookings: "commandes", surPlace: "Sur place", emporter: "À emporter",
    items: "Détail produits", arrived: "Arrivé", noShow: "Absent", cancel: "Annuler",
    confirmed: "Confirmé", completed: "Arrivé", cancelled: "Annulé", no_show: "Absent",
    noBookings: "Aucune commande pour cette date", refresh: "Actualiser", logout: "Déconnexion",
    switchLang: "中文",
  },
  zh: {
    login: "管理登录", password: "密码", enter: "进入", wrong: "密码错误",
    title: "订单管理", date: "日期", today: "今天", tomorrow: "明天",
    thisWeek: "本周", thisMonth: "本月", from: "从", to: "至",
    total: "合计", bookings: "订单", surPlace: "堂食", emporter: "外带",
    items: "菜品明细", arrived: "已到", noShow: "未到", cancel: "取消",
    confirmed: "已确认", completed: "已到店", cancelled: "已取消", no_show: "未到",
    noBookings: "该日期无订单", refresh: "刷新", logout: "退出",
    switchLang: "Français",
  },
};

const statusColors = { confirmed: "#16a34a", completed: "#2563eb", cancelled: "#9ca3af", no_show: "#dc2626" };

function getDatesInRange(from, to) {
  const dates = []; const d = new Date(from);
  while (d <= new Date(to)) { dates.push(d.toISOString().split("T")[0]); d.setDate(d.getDate() + 1); }
  return dates;
}

function AdminPanel() {
  const [lang, setLang] = useState("fr");
  const [authed, setAuthed] = useState(() => localStorage.getItem("nr_admin") === "1");
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const A = adminT[lang];

  const fetchRange = async (from, to) => {
    setLoading(true);
    try {
      const dates = getDatesInRange(from, to);
      const results = await Promise.all(dates.map(d => fetch(`${API}/api/bookings?namespace=${NS}&date=${d}`).then(r => r.json())));
      setBookings(results.flatMap(r => r.bookings || []));
    } catch { setBookings([]); }
    setLoading(false);
  };

  const setRange = (from, to) => { setDateFrom(from); setDateTo(to); };

  useEffect(() => { if (authed) fetchRange(dateFrom, dateTo); }, [authed, dateFrom, dateTo]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/booking/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namespace: NS, status }),
    });
    fetchRange(dateFrom, dateTo);
  };

  const handleLogin = () => {
    if (pwd === "neige2025") { localStorage.setItem("nr_admin", "1"); setAuthed(true); setPwdErr(false); }
    else setPwdErr(true);
  };

  const tmr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().split("T")[0]; })();
  const weekEnd = (() => { const d = new Date(weekStart); d.setDate(d.getDate() + 6); return d.toISOString().split("T")[0]; })();
  const monthStart = today.slice(0, 8) + "01";
  const monthEnd = (() => { const d = new Date(today.slice(0, 4), parseInt(today.slice(5, 7)), 0); return d.toISOString().split("T")[0]; })();
  const isActive = (f, t) => dateFrom === f && dateTo === t;
  const isMultiDay = dateFrom !== dateTo;

  const fmt = (d) => d.slice(8, 10) + "/" + d.slice(5, 7);
  const monthNames = { fr: ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"], zh: ["","1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"] };
  const monthLabel = monthNames[lang]?.[parseInt(today.slice(5, 7))] || today.slice(5, 7);

  const pendingBookings = bookings.filter(b => b.status === "confirmed").sort((a, b) => (a.booking_date + a.booking_time).localeCompare(b.booking_date + b.booking_time));
  const doneBookings = bookings.filter(b => b.status !== "confirmed").sort((a, b) => (b.booking_date + b.booking_time).localeCompare(a.booking_date + a.booking_time));

  const surPlace = bookings.filter(b => b.type === "surPlace" && b.status !== "cancelled");
  const emporter = bookings.filter(b => b.type === "emporter" && b.status !== "cancelled");
  const totalAmt = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + (b.total || 0), 0);

  // Items summary
  const itemsMap = {};
  bookings.filter(b => b.status !== "cancelled").forEach(b => {
    (b.items || []).forEach(i => { itemsMap[i.name] = (itemsMap[i.name] || 0) + (i.qty || 1); });
  });
  const itemsSorted = Object.entries(itemsMap).sort((a, b) => b[1] - a[1]);

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ background: "white", borderRadius: 16, padding: 32, width: 320, border: "1px solid #eee", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h2 style={{ color: "#8B0000", fontSize: 20, marginBottom: 20 }}>{A.login}</h2>
          <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setPwdErr(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder={A.password}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: pwdErr ? "2px solid #dc2626" : "1px solid #ddd", fontSize: 16, boxSizing: "border-box", marginBottom: 12, outline: "none" }} />
          {pwdErr && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>{A.wrong}</div>}
          <button onClick={handleLogin} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "#8B0000", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>{A.enter}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Admin header */}
      <div style={{ background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", fontSize: 18, fontWeight: 700, margin: 0 }}>🔧 {A.title}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{A.switchLang}</button>
          <button onClick={() => { localStorage.removeItem("nr_admin"); setAuthed(false); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{A.logout}</button>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px" }}>

        {/* Date selector — quick buttons */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {[
            { label: `${A.today} (${fmt(today)})`, f: today, t: today },
            { label: `${A.tomorrow} (${fmt(tmr)})`, f: tmr, t: tmr },
            { label: `${A.thisWeek} (${fmt(weekStart)}-${fmt(weekEnd)})`, f: weekStart, t: weekEnd },
            { label: `${A.thisMonth} (${monthLabel})`, f: monthStart, t: monthEnd },
          ].map((btn, i) => (
            <button key={i} onClick={() => setRange(btn.f, btn.t)} style={{ flex: 1, padding: 10, borderRadius: 10, border: isActive(btn.f, btn.t) ? "2px solid #8B0000" : "1px solid #ddd", background: isActive(btn.f, btn.t) ? "rgba(139,0,0,0.05)" : "white", color: isActive(btn.f, btn.t) ? "#8B0000" : "#666", fontWeight: 600, fontSize: 12, cursor: "pointer", minWidth: 60 }}>{btn.label}</button>
          ))}
        </div>
        {/* Custom range */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#999" }}>{A.from}</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none" }} />
          <span style={{ fontSize: 12, color: "#999" }}>{A.to}</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ddd", fontSize: 13, outline: "none" }} />
          <button onClick={() => fetchRange(dateFrom, dateTo)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: 14 }}>🔄</button>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { label: A.bookings, value: bookings.filter(b => b.status !== "cancelled").length, color: "#8B0000" },
            { label: A.surPlace, value: surPlace.length, color: "#16a34a" },
            { label: A.emporter, value: emporter.length, color: "#ea580c" },
            { label: A.total, value: `${totalAmt.toFixed(0)}€`, color: "#8B0000" },
          ].map((c, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid #eee" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.value}</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Items summary */}
        {itemsSorted.length > 0 && (
          <div style={{ background: "white", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #eee" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#8B0000", marginBottom: 8 }}>{A.items}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {itemsSorted.map(([name, qty]) => (
                <span key={name} style={{ background: "#faf8f5", border: "1px solid #eee", borderRadius: 8, padding: "4px 10px", fontSize: 13 }}>
                  {name} <strong style={{ color: "#8B0000" }}>×{qty}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Booking cards — two sections */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#999" }}>⏳</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#ccc" }}>{A.noBookings}</div>
        ) : (<>
          {/* Pending section */}
          {pendingBookings.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#16a34a", marginBottom: 10 }}>
                ● {lang === "fr" ? "En attente" : "待接待"} ({pendingBookings.length})
              </div>
              {pendingBookings.map(b => (
                <div key={b.id} style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 10, border: "2px solid #16a34a", position: "relative" }}>
                  <div style={{ position: "absolute", top: -1, right: 16, background: "#16a34a", color: "white", borderRadius: "0 0 8px 8px", padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                    {b.type === "surPlace" ? "🍽" : "📦"} {A[b.type] || b.type}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 700, color: "#8B0000" }}>#{b.booking_code || "?"}</span>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{b.customer_name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
                    📞 {b.customer_phone} · 🕐 {isMultiDay ? `${fmt(b.booking_date)} ${b.booking_time}` : b.booking_time}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    {(b.items || []).map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{item.name} <span style={{ color: "#999", fontWeight: 400, fontSize: 14 }}>×{item.qty}</span></span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "#8B0000" }}>{(item.price * (item.qty || 1)).toFixed(2)}€</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6, paddingTop: 8, borderTop: "2px solid #8B0000" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, fontWeight: 700, color: "#8B0000" }}>{(b.total || 0).toFixed(2)}€</span>
                    </div>
                  </div>
                  {b.notes && <div style={{ fontSize: 12, color: "#999", marginBottom: 8, fontStyle: "italic" }}>📝 {b.notes}</div>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateStatus(b.id, "completed")} style={{ flex: 2, padding: 14, borderRadius: 12, border: "none", background: "#16a34a", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✓ {A.arrived}</button>
                    <button onClick={() => updateStatus(b.id, "no_show")} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "#dc2626", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>✗ {A.noShow}</button>
                    <button onClick={() => updateStatus(b.id, "cancelled")} style={{ padding: 14, borderRadius: 12, border: "1px solid #ddd", background: "white", color: "#999", fontSize: 14, cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed/other section */}
          {doneBookings.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#999", marginBottom: 10 }}>
                ● {lang === "fr" ? "Traité" : "已处理"} ({doneBookings.length})
              </div>
              {doneBookings.map(b => (
                <div key={b.id} style={{ background: "#fafafa", borderRadius: 12, padding: 12, marginBottom: 6, border: "1px solid #eee", opacity: 0.7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: "#999" }}>#{b.booking_code || "?"}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{b.customer_name}</span>
                      <span style={{ fontSize: 12, color: "#999" }}>{isMultiDay ? `${fmt(b.booking_date)} ${b.booking_time}` : b.booking_time}</span>
                    </div>
                    <span style={{ background: statusColors[b.status] || "#999", color: "white", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                      {A[b.status] || b.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    {(b.items || []).map((item, i) => <span key={i} style={{ marginRight: 6 }}>{item.name}×{item.qty}</span>)}
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{(b.total || 0).toFixed(2)}€</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>)}
      </div>
    </div>
  );
}


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
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#admin");
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  if (isAdmin) return <AdminPanel />;

  const [lang, setLang] = useState("fr");
  const [cart, setCart] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "12:00", notes: "", type: "surPlace" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const T = t[lang];
  const allItems = [...MENU.menus, ...MENU.plats, ...MENU.sandwiches, ...MENU.bubbleTea, ...MENU.carte, ...MENU.boissons, ...MENU.desserts];
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

  const handleSubmit = async () => {
    if (!form.name || !form.phone || cartItems.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespace: NS,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: "",
          booking_date: form.date,
          booking_time: form.time,
          type: form.type,
          items: cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
          total: total,
          notes: form.notes || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingCode(data.booking_code || "");
        setSubmitted(true);
        setShowForm(false);
      } else {
        setSubmitError(data.error || "Erreur lors de la commande");
      }
    } catch (err) {
      setSubmitError(lang === "fr" ? "Erreur de connexion. Réessayez." : "网络错误，请重试。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#8B0000", marginBottom: 8 }}>{T.order.success}</h2>
          {bookingCode && (
            <div style={{ margin: "16px 0", padding: "16px 24px", background: "white", borderRadius: 14, border: "2px solid #8B0000", display: "inline-block" }}>
              <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                {lang === "fr" ? "Votre numéro" : "您的号码"}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 48, fontWeight: 700, color: "#8B0000" }}>#{bookingCode}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                {lang === "fr" ? "Présentez ce numéro à votre arrivée" : "到店时出示此号码"}
              </div>
            </div>
          )}
          <p style={{ color: "#888", fontSize: 15, marginTop: 12 }}>{T.order.successMsg}</p>
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

      {/* Menu — single page, no tabs */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 120px" }}>
        <Section title={T.sections.menus}>
          {MENU.menus.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.plats}>
          {MENU.plats.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.sandwiches}>
          {MENU.sandwiches.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.bubbleTea}>
          {MENU.bubbleTea.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.carte}>
          {MENU.carte.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.boissons}>
          {MENU.boissons.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
        <Section title={T.sections.desserts}>
          {MENU.desserts.map(item => <ItemRow key={item.id} item={item} lang={lang} qty={cart[item.id] || 0} onAdd={add} onRemove={remove} />)}
        </Section>
      </div>

      {/* Order form slide-up panel */}
      {showForm && cartCount > 0 && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.4)",
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#faf8f5", borderRadius: "20px 20px 0 0",
            padding: "24px 16px 32px", maxHeight: "85vh", overflowY: "auto",
          }}>
            <div style={{ width: 40, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 16px" }} />

            {/* Cart summary */}
            <div style={{ background: "white", borderRadius: 14, padding: "4px 16px", marginBottom: 16, border: "1px solid #eee" }}>
              {cartItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < cartItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: "#999", marginLeft: 6, fontSize: 13 }}>×{item.qty}</span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 600, fontSize: 14 }}>{(item.price * item.qty).toFixed(2)}€</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 8px", borderTop: "2px solid #8B0000" }}>
                <span style={{ fontWeight: 700 }}>{T.order.total}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

              {[{ key: "name", type: "text" }, { key: "phone", type: "tel" }].map(({ key, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 4, display: "block" }}>{T.order[key]} *</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white", fontSize: 16, outline: "none", boxSizing: "border-box",
                  }} />
                </div>
              ))}

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 4, display: "block" }}>{T.order.date}</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white", fontSize: 15, outline: "none", boxSizing: "border-box",
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 4, display: "block" }}>{T.order.time}</label>
                  <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{
                    width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white", fontSize: 15, outline: "none", boxSizing: "border-box",
                  }}>
                    {["11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30"].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 4, display: "block" }}>{T.order.notes}</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #ddd", background: "white", fontSize: 15, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box",
                }} />
              </div>

              {submitError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#991b1b", fontSize: 14 }}>{submitError}</div>
              )}

              <button onClick={handleSubmit} disabled={!form.name || !form.phone || submitting} style={{
                padding: "16px", borderRadius: 12, border: "none",
                background: form.name && form.phone && !submitting ? "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)" : "#ddd",
                color: form.name && form.phone && !submitting ? "white" : "#999",
                fontSize: 16, fontWeight: 700, cursor: form.name && form.phone && !submitting ? "pointer" : "default",
                opacity: submitting ? 0.7 : 1,
              }}>
                {submitting ? (lang === "fr" ? "Envoi en cours..." : "提交中...") : `${T.order.submit} · ${total.toFixed(2)}€`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating cart bar — always visible when items in cart */}
      {cartCount > 0 && !showForm && (
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
            <button onClick={() => setShowForm(true)} style={{
              background: "#8B0000", color: "white", border: "none",
              padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              {T.nav.order} →
            </button>
          </div>
        </div>
      )}

      {/* Footer with discrete admin link */}
      <div style={{ textAlign: "center", padding: "20px", fontSize: 11, color: "#ccc" }}>
        Powered by ClawShow · neigerouge.fr
        <span style={{ margin: "0 6px" }}>·</span>
        <a href="#admin" style={{ color: "#ddd", textDecoration: "none" }}>Gestion</a>
      </div>
    </div>
  );
}
