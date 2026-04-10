import { useState, useEffect, useRef } from "react";
import InstallPrompt from "./components/InstallPrompt";

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

// Step config for each bento menu — each step is single-select
// opts: array of [fr, zh] pairs
const MENU_OPTIONS = {
  A: {
    fixed: [["2 Nems légumes", "2个蔬菜春卷"]],
    steps: [
      { key: "side", fr: "Accompagnement", zh: "配菜", opts: [
        ["Salade d'algues", "海藻沙拉"],
        ["Omelette nature", "原味煎蛋"],
        ["Omelette piquant", "辣味煎蛋"],
      ]},
      { key: "base", fr: "Base", zh: "主食", opts: [
        ["Nouilles", "面条"],
        ["Riz", "米饭"],
        ["Riz cantonais", "炒饭"],
      ]},
    ],
  },
  B: {
    steps: [
      { key: "side", fr: "Accompagnement", zh: "配菜", opts: [
        ["2 Nems poulet", "2个鸡肉春卷"],
        ["Salade d'algues", "海藻沙拉"],
      ]},
      { key: "main", fr: "Plat principal", zh: "主菜", opts: [
        ["Poulet croustillant", "脆皮鸡"],
        ["Porc caramel", "焦糖猪肉"],
        ["Porc laqué", "叉烧"],
      ]},
      { key: "base", fr: "Base", zh: "主食", opts: [
        ["Nouilles", "面条"],
        ["Riz", "米饭"],
        ["Riz cantonais", "炒饭"],
      ]},
    ],
  },
  C: {
    fixed: [["Poulet croustillant", "脆皮鸡"]],
    steps: [
      { key: "side", fr: "Accompagnement", zh: "配菜", opts: [
        ["Porc caramel", "焦糖猪肉"],
        ["Porc laqué", "叉烧"],
        ["2 Papillotes de crevettes", "2个虾饺"],
      ]},
      { key: "base", fr: "Base", zh: "主食", opts: [
        ["Nouilles", "面条"],
        ["Riz", "米饭"],
        ["Riz cantonais", "炒饭"],
      ]},
    ],
  },
  D: {
    steps: [
      { key: "main", fr: "Plat principal", zh: "主菜", opts: [
        ["Poulet croustillant", "脆皮鸡"],
        ["Porc caramel", "焦糖猪肉"],
        ["Porc laqué", "叉烧"],
      ]},
      { key: "base", fr: "Base", zh: "主食", opts: [
        ["Nouilles", "面条"],
        ["Riz", "米饭"],
        ["Riz cantonais", "炒饭"],
      ]},
    ],
  },
  F: {
    steps: [
      { key: "main", fr: "Plat principal", zh: "主菜", opts: [
        ["3 Nems poulet", "3个鸡肉春卷"],
        ["3 Raviolis", "3个饺子"],
        ["2 Papillotes de crevettes", "2个虾饺"],
      ]},
      { key: "base", fr: "Base", zh: "主食", opts: [
        ["Nouilles", "面条"],
        ["Riz", "米饭"],
        ["Riz cantonais", "炒饭"],
      ]},
    ],
  },
};

// Format options object for display: { side: {fr,zh}, base: {fr,zh} } → "Salade d'algues, Riz"
const optStr = (options, lang) => {
  if (!options) return null;
  return Object.values(options).map(v => (lang === "zh" ? v.zh : v.fr)).join(", ");
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
      email: "Email",
      phone: "Téléphone",
      date: "Date de retrait",
      time: "Heure",
      notes: "Remarques",
      submit: "Passer commande",
      total: "Total",
      success: "Commande envoyée !",
      successMsg: "Vous recevrez une confirmation par email.",
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
      email: "邮箱",
      phone: "电话",
      date: "取餐日期",
      time: "时间",
      notes: "备注",
      submit: "提交订单",
      total: "合计",
      success: "下单成功！",
      successMsg: "您将收到确认邮件。",
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

const RESTAURANT_INFO = {
  name: "NEIGE ROUGE 红雪",
  subtitle: "Cuisine Vietnamienne Authentique",
  address: "75 Rue Buffon, 75005 Paris",
  phone: "01 72 60 48 89",
  siret: "82207280700016",
  tva_dine_in: 0.10,
  tva_takeaway: 0.055,
};

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

// ---------------------------------------------------------------------------
// Ticket & Facture print helpers
// ---------------------------------------------------------------------------

function printWindow(htmlContent) {
  const w = window.open("", "_blank", "width=420,height=600");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Impression</title>
<style>
  body { font-family: 'Courier New', monospace; font-size: 13px; margin: 0; padding: 16px; background: white; color: #000; }
  @media print { body { padding: 0; } .no-print { display: none; } }
  .btn { display: block; width: 100%; padding: 10px; margin-top: 12px; background: #8B0000; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
  pre { white-space: pre-wrap; word-break: break-word; margin: 0; }
</style></head><body>${htmlContent}<button class="btn no-print" onclick="window.print()">🖨 Imprimer</button></body></html>`);
  w.document.close();
}

function openTicket(order) {
  const dt = new Date(order.created_at);
  const dateStr = `${dt.getDate().toString().padStart(2,"0")}/${(dt.getMonth()+1).toString().padStart(2,"0")}/${dt.getFullYear()}`;
  const timeStr = `${dt.getHours().toString().padStart(2,"0")}:${dt.getMinutes().toString().padStart(2,"0")}`;
  const typeStr = order.order_type === "dine_in" ? "Sur place" : "À emporter";
  const pmLabels = { online: "Carte bancaire (en ligne)", card_counter: "Carte bancaire (sur place)", cash: "Espèces" };
  const payStr = order.payment_status === "paid" ? (pmLabels[order.payment_method] || "Carte (Stancer)") : "Non payé";

  let lines = "";
  for (const item of (order.items || [])) {
    const subtotal = ((item.price || 0) * (item.qty || 1)).toFixed(2);
    const namePart = `${item.name} ×${item.qty}`;
    lines += `  ${namePart.padEnd(20)}${subtotal.padStart(8)}€\n`;
    if (item.options) {
      for (const v of Object.values(item.options)) {
        lines += `    ${v}\n`;
      }
    }
  }

  const total = (order.total_amount || 0).toFixed(2);
  const content = `<pre>================================
       ${RESTAURANT_INFO.name}
  ${RESTAURANT_INFO.subtitle}
  ${RESTAURANT_INFO.address}
  Tél: ${RESTAURANT_INFO.phone}
  SIRET: ${RESTAURANT_INFO.siret}
================================
  Date: ${dateStr}  ${timeStr}
  Commande: ${order.order_number}
  Type: ${typeStr}
--------------------------------
${lines}--------------------------------
  ${"TOTAL".padEnd(20)}${total.padStart(8)}€
  Paiement: ${payStr}
================================
     Merci de votre visite !
================================</pre>`;
  printWindow(content);
}

function openFacture(order) {
  const dt = new Date(order.created_at);
  const dateStr = `${dt.getDate().toString().padStart(2,"0")}/${(dt.getMonth()+1).toString().padStart(2,"0")}/${dt.getFullYear()}`;
  const mmdd = `${(dt.getMonth()+1).toString().padStart(2,"0")}${dt.getDate().toString().padStart(2,"0")}`;
  const invoiceNum = `F${dt.getFullYear()}-${mmdd}-${order.order_number}`;
  const tvaRate = order.order_type === "takeaway" ? RESTAURANT_INFO.tva_takeaway : RESTAURANT_INFO.tva_dine_in;
  const tvaLabel = order.order_type === "takeaway" ? "5,5%" : "10%";
  const ttc = order.total_amount || 0;
  const ht = ttc / (1 + tvaRate);
  const tva = ttc - ht;
  const pmLabelsF = { online: "Carte bancaire (en ligne)", card_counter: "Carte bancaire (sur place)", cash: "Espèces" };
  const payStr = order.payment_status === "paid" ? (pmLabelsF[order.payment_method] || "Carte bancaire") : "Non payé";

  let lines = "";
  for (const item of (order.items || [])) {
    const subtotal = ((item.price || 0) * (item.qty || 1)).toFixed(2);
    const namePart = item.name.substring(0, 22);
    lines += `${namePart.padEnd(22)} ${String(item.qty).padStart(3)}  ${subtotal.padStart(8)}€\n`;
    if (item.options) {
      for (const v of Object.values(item.options)) {
        lines += `  ${v}\n`;
      }
    }
  }

  const content = `<pre>         FACTURE SIMPLIFIÉE
         N° ${invoiceNum}

${RESTAURANT_INFO.name}
${RESTAURANT_INFO.address}
SIRET: ${RESTAURANT_INFO.siret}
Tél: ${RESTAURANT_INFO.phone}

Date: ${dateStr}

${"Désignation".padEnd(22)} Qté      Prix
---------------------------------
${lines}---------------------------------
${"Total HT".padEnd(26)} ${ht.toFixed(2).padStart(8)}€
${"TVA " + tvaLabel.padEnd(22)} ${tva.toFixed(2).padStart(8)}€
${"Total TTC".padEnd(26)} ${ttc.toFixed(2).padStart(8)}€

Mode de paiement: ${payStr}

Merci pour votre confiance.</pre>`;
  printWindow(content);
}

// ---------------------------------------------------------------------------
// Admin — Commandes Tab
// ---------------------------------------------------------------------------

function CommandesTab() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmAmounts, setConfirmAmounts] = useState({}); // {order_id: amount_str}
  const [confirming, setConfirming] = useState({}); // {order_id: bool}

  const handleConfirmPayment = async (order) => {
    const amount = parseFloat(confirmAmounts[order.id] ?? order.total_amount);
    setConfirming(p => ({ ...p, [order.id]: true }));
    try {
      const res = await fetch(`${API}/api/order/${order.id}/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namespace: NS, payment_method: order.payment_method || "card_counter", amount_received: amount }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, payment_status: "paid" } : o));
      }
    } catch {}
    setConfirming(p => ({ ...p, [order.id]: false }));
  };

  const fetchOrders = async (d) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/order/history?namespace=${NS}&date=${d}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { setOrders([]); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(date); }, [date]);

  const paid = orders.filter(o => o.payment_status === "paid");
  const totalAmt = paid.reduce((s, o) => s + (o.total_amount || 0), 0);
  const pending = orders.filter(o => o.status === "pending" || o.status === "preparing").length;
  const done = orders.filter(o => o.status === "ready" || o.status === "picked").length;

  const statusStyle = { pending: { bg: "#fef9c3", color: "#854d0e", label: "En attente" }, preparing: { bg: "#dbeafe", color: "#1e40af", label: "En préparation" }, ready: { bg: "#dcfce7", color: "#166534", label: "Prêt" }, picked: { bg: "#f3f4f6", color: "#6b7280", label: "Récupéré" } };
  const payStyle = { paid: { bg: "#dcfce7", color: "#166534", label: "Payé" }, unpaid: { bg: "#fee2e2", color: "#991b1b", label: "Impayé" }, pending_counter: { bg: "#fff7ed", color: "#c2410c", label: "💳 待刷卡" }, pending_cash: { bg: "#f0fdf4", color: "#15803d", label: "💶 待现金" } };

  const fmt = (isoStr) => { const d = new Date(isoStr); return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`; };

  return (
    <div>
      {/* Date picker */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd", fontSize: 14, outline: "none" }} />
        <button onClick={() => setDate(today)} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: date === today ? "rgba(139,0,0,0.06)" : "white", color: date === today ? "#8B0000" : "#666", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Aujourd'hui</button>
        <button onClick={() => fetchOrders(date)} style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", background: "white", cursor: "pointer", fontSize: 14 }}>🔄</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Commandes", value: orders.length, color: "#8B0000" },
          { label: "Total payé", value: `${totalAmt.toFixed(0)}€`, color: "#16a34a" },
          { label: "En attente", value: pending, color: "#d97706" },
          { label: "Terminées", value: done, color: "#6b7280" },
        ].map((c, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid #eee" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.value}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Order list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>⏳</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#ccc" }}>Aucune commande ce jour</div>
      ) : orders.map(order => {
        const ss = statusStyle[order.status] || { bg: "#f3f4f6", color: "#6b7280", label: order.status };
        const ps = payStyle[order.payment_status] || payStyle.unpaid;
        return (
          <div key={order.id} style={{ background: "white", borderRadius: 14, padding: 14, marginBottom: 10, border: "1px solid #eee" }}>
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#8B0000" }}>{order.order_number}</span>
                <span style={{ fontSize: 12, color: "#999" }}>{fmt(order.created_at)}</span>
                <span style={{ fontSize: 11, color: "#999" }}>{order.order_type === "dine_in" ? "Sur place" : "À emporter"}</span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ background: ps.bg, color: ps.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
                  {ps.label || order.payment_status}
                </span>
                <span style={{ background: ss.bg, color: ss.color, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>
                  {ss.label}
                </span>
              </div>
            </div>
            {/* Items */}
            <div style={{ marginBottom: 8 }}>
              {(order.items || []).map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "2px 0" }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: "#999", marginLeft: 4 }}>×{item.qty}</span>
                    {item.options && (
                      <span style={{ color: "#888", fontSize: 12, marginLeft: 4 }}>
                        — {Object.values(item.options).join(", ")}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 600 }}>
                    {((item.price || 0) * (item.qty || 1)).toFixed(2)}€
                  </span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 6, borderTop: "1px solid #f0f0f0", marginTop: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 16, color: "#8B0000" }}>
                  {(order.total_amount || 0).toFixed(2)}€
                </span>
              </div>
            </div>
            {/* Confirm counter payment */}
            {(order.payment_status === "pending_counter" || order.payment_status === "pending_cash") && (
              <div style={{ background: "#fff7ed", borderRadius: 10, padding: "10px 12px", marginBottom: 8, border: "1px solid #fed7aa" }}>
                <div style={{ fontSize: 12, color: "#c2410c", fontWeight: 700, marginBottom: 8 }}>
                  {order.payment_status === "pending_counter" ? "💳 Encaisser par carte" : "💶 Encaisser en espèces"}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#666" }}>Montant reçu :</span>
                  <input type="number" step="0.01" min="0"
                    value={confirmAmounts[order.id] ?? order.total_amount.toFixed(2)}
                    onChange={e => setConfirmAmounts(p => ({ ...p, [order.id]: e.target.value }))}
                    style={{ width: 80, padding: "6px 8px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, fontWeight: 700, color: "#8B0000", outline: "none" }}
                  />
                  <span style={{ fontSize: 13 }}>€</span>
                  <button onClick={() => handleConfirmPayment(order)} disabled={confirming[order.id]}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: confirming[order.id] ? "#ddd" : "#16a34a", color: "white", fontSize: 13, fontWeight: 700, cursor: confirming[order.id] ? "default" : "pointer" }}>
                    {confirming[order.id] ? "..." : "✅ Confirmer"}
                  </button>
                </div>
              </div>
            )}
            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => openTicket(order)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #ddd", background: "white", color: "#444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                🧾 Ticket
              </button>
              <button onClick={() => openFacture(order)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "1px solid #ddd", background: "white", color: "#444", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                📄 Facture
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminPanel() {
  const [lang, setLang] = useState("fr");
  const [tab, setTab] = useState("reservations");
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

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "2px solid #eee", background: "white", position: "sticky", top: 0, zIndex: 10 }}>
        {[
          { key: "reservations", label: "Réservations 预订" },
          { key: "commandes", label: "Commandes 订单" },
        ].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)} style={{
            flex: 1, padding: "13px 8px", border: "none", background: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 13, color: tab === tb.key ? "#8B0000" : "#999",
            borderBottom: tab === tb.key ? "2px solid #8B0000" : "2px solid transparent",
            marginBottom: -2, transition: "color 0.15s",
          }}>{tb.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px" }}>

        {tab === "commandes" && <CommandesTab />}
        {tab === "reservations" && <>

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
        </>}
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

// Bento menu row — opens MenuCustomizer on +, removes last selection on −
function BentoRow({ item, lang, count, onAdd, onRemoveLast }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(139,0,0,0.08)" }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12, cursor: "pointer" }} onClick={onAdd}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{item.name}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: "#8B0000", fontSize: 14 }}>{item.price.toFixed(2)}€</span>
        </div>
        <div style={{ fontSize: 12.5, color: "#888", marginTop: 3, lineHeight: 1.4 }}>
          {lang === "zh" ? item.descZh : item.desc}
        </div>
        <div style={{ fontSize: 12, color: "#8B0000", marginTop: 4, fontWeight: 500 }}>
          {lang === "zh" ? "点击选择配置 →" : "Personnaliser →"}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {count > 0 && (
          <>
            <button onClick={e => { e.stopPropagation(); onRemoveLast(); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #ccc", background: "white", color: "#666", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ width: 24, textAlign: "center", fontWeight: 700, fontSize: 15, color: "#8B0000" }}>{count}</span>
          </>
        )}
        <button onClick={onAdd} style={{ width: 28, height: 28, borderRadius: "50%", border: count > 0 ? "1.5px solid #8B0000" : "1.5px solid #ccc", background: count > 0 ? "#8B0000" : "white", color: count > 0 ? "white" : "#666", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );
}

// Bottom-sheet modal for bento menu customization
function MenuCustomizer({ item, lang, onConfirm, onClose }) {
  const config = MENU_OPTIONS[item.id];
  const steps = config.steps;
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const allDone = steps.every(s => selections[s.key]);

  const pick = (key, opt) => {
    const newSel = { ...selections, [key]: { fr: opt[0], zh: opt[1] } };
    setSelections(newSel);
    if (step < steps.length - 1) setTimeout(() => setStep(s => s + 1), 180);
  };

  const goToStep = (i) => {
    const newSel = {};
    steps.slice(0, i).forEach(s => { if (selections[s.key]) newSel[s.key] = selections[s.key]; });
    setSelections(newSel);
    setStep(i);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderRadius: "20px 20px 0 0", padding: "20px 16px 40px", maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ width: 40, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{item.name}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 700, marginTop: 2 }}>{item.price.toFixed(2)}€</div>
          </div>
          <button onClick={onClose} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", flexShrink: 0 }}>×</button>
        </div>

        {config.fixed && config.fixed.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f9f9f9", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 14, color: "#555" }}>
            <span style={{ color: "#8B0000", fontWeight: 700 }}>✓</span>
            <span>{lang === "zh" ? f[1] : f[0]}</span>
          </div>
        ))}

        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, cursor: i < step ? "pointer" : "default", background: selections[s.key] ? "#8B0000" : i === step ? "rgba(139,0,0,0.35)" : "#e5e5e5", transition: "background 0.2s" }}
              onClick={() => i < step && goToStep(i)} />
          ))}
        </div>

        {steps.map((s, si) => {
          if (si > step) return null;
          const isCurrent = si === step;
          const sel = selections[s.key];
          return (
            <div key={si} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
                {si + 1} / {steps.length} · {lang === "zh" ? s.zh : s.fr}
              </div>
              {!isCurrent && sel ? (
                <button onClick={() => goToStep(si)} style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid #8B0000", background: "rgba(139,0,0,0.06)", color: "#8B0000", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>✓ {lang === "zh" ? sel.zh : sel.fr}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{lang === "zh" ? "修改 ↩" : "modifier ↩"}</span>
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.opts.map(opt => (
                    <button key={opt[0]} onClick={() => pick(s.key, opt)} style={{ padding: "16px 18px", borderRadius: 12, border: "1.5px solid #e5e5e5", background: "white", color: "#333", fontSize: 16, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                      {lang === "zh" ? opt[1] : opt[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {allDone && (
          <button onClick={() => onConfirm(selections)} style={{ width: "100%", padding: 18, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)", color: "white", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>
            {lang === "zh" ? "加入购物车 +" : "Ajouter au panier +"}
          </button>
        )}
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

// ---------------------------------------------------------------------------
// Landing Page
// ---------------------------------------------------------------------------

function LandingPage() {
  const [lang, setLang] = useState("fr");
  const T = t[lang];
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />
      <div style={{
        background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
        padding: "60px 20px 48px", textAlign: "center", position: "relative",
      }}>
        <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.15)", border: "none", color: "rgba(255,255,255,0.9)",
          padding: "5px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>{T.switchLang}</button>
        <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>{T.tagline}</div>
        <h1 style={{
          fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "'Playfair Display', serif",
          fontSize: lang === "zh" ? 48 : 52, fontWeight: 900, color: "white", margin: 0, lineHeight: 1.1,
        }}>{T.title}</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 10, fontWeight: 400 }}>{T.subtitle}</p>
        <div style={{ marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          {T.info.hours} · ☎ {T.info.phone}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px", gap: 20, maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <a href="#order" style={{
          display: "block", width: "100%", padding: "28px 20px", borderRadius: 16,
          background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
          color: "white", textAlign: "center", textDecoration: "none",
          fontSize: 20, fontWeight: 700, boxSizing: "border-box",
        }}>
          {lang === "fr" ? "Commander sur place" : "到店点餐"}
          <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.8, marginTop: 6 }}>
            {lang === "fr" ? "Scannez, commandez, dégustez" : "扫码点餐，即刻享用"}
          </div>
        </a>
        <a href="#menu" style={{
          display: "block", width: "100%", padding: "28px 20px", borderRadius: 16,
          background: "white", border: "2px solid #8B0000",
          color: "#8B0000", textAlign: "center", textDecoration: "none",
          fontSize: 20, fontWeight: 700, boxSizing: "border-box",
        }}>
          {lang === "fr" ? "Réserver à l'avance" : "提前预订"}
          <div style={{ fontSize: 13, fontWeight: 400, color: "#888", marginTop: 6 }}>
            {lang === "fr" ? "Commandez pour demain" : "预订明天的餐食"}
          </div>
        </a>
      </div>
      <div style={{ textAlign: "center", padding: "20px", fontSize: 11, color: "#ccc" }}>
        7 rue des Ursulines, 75005 Paris
        <span style={{ margin: "0 6px" }}>·</span>
        <a href="#admin" style={{ color: "#ddd", textDecoration: "none" }}>Gestion</a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Order Page (dine-in, simplified — no name/phone/email)
// ---------------------------------------------------------------------------

function OrderPage() {
  const [lang, setLang] = useState("fr");
  const [cart, setCart] = useState({});               // non-bento: { [id]: qty }
  const [menuSelections, setMenuSelections] = useState([]); // bento: [{uid, menuId, options}]
  const [customizerItem, setCustomizerItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderType, setOrderType] = useState("dine_in");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [submitted, setSubmitted] = useState(false);
  const [submittedMethod, setSubmittedMethod] = useState("online");
  const [orderNumber, setOrderNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const T = t[lang];
  const flatItems = [...MENU.plats, ...MENU.banhMi, ...MENU.boBun, ...MENU.carte, ...MENU.desserts, ...MENU.boissons];

  // Non-bento cart handlers
  const add = (id) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id) => setCart(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }));

  // Bento cart handlers
  const bentoCount = (menuId) => menuSelections.filter(s => s.menuId === menuId).length;
  const openCustomizer = (item) => setCustomizerItem(item);
  const removeBento = (menuId) => {
    setMenuSelections(prev => {
      const idx = prev.map(s => s.menuId).lastIndexOf(menuId);
      if (idx < 0) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };
  const confirmBento = (selections) => {
    setMenuSelections(prev => [...prev, {
      uid: `${customizerItem.id}-${Date.now()}`,
      menuId: customizerItem.id,
      options: selections,
    }]);
    setCustomizerItem(null);
  };

  // Combined cart
  const nonBentoCartItems = Object.entries(cart).filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...flatItems.find(i => i.id === id), qty, options: null }))
    .filter(i => i.name);
  const bentoCartItems = menuSelections.map(sel => ({
    ...MENU.menus.find(m => m.id === sel.menuId),
    qty: 1, options: sel.options, uid: sel.uid,
  }));
  const allCartItems = [...bentoCartItems, ...nonBentoCartItems];
  const total = allCartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = allCartItems.reduce((s, i) => s + i.qty, 0);

  const handleSubmit = async () => {
    if (allCartItems.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      // Step 1: create the order
      const orderRes = await fetch(`${API}/api/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namespace: NS,
          items: allCartItems.map(i => ({
            id: i.id, name: i.name, qty: i.qty, price: i.price,
            options: i.options
              ? Object.fromEntries(Object.entries(i.options).map(([k, v]) => [k, v.fr]))
              : null,
          })),
          order_type: orderType,
          total_amount: total,
          payment_method: paymentMethod,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) {
        setSubmitError(orderData.error || "Erreur création commande");
        return;
      }

      if (paymentMethod === "online") {
        // Step 2a: Stancer online payment
        const amountCents = Math.round(total * 100);
        const payRes = await fetch(`${API}/api/payment/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namespace: NS,
            order_id: orderData.order_id,
            amount: amountCents,
            description: `Neige Rouge #${orderData.order_number}`,
          }),
        });
        const payData = await payRes.json();
        if (!payData.success) {
          setSubmitError(payData.error || "Erreur paiement");
          return;
        }
        window.location.href = payData.payment_url;
      } else {
        // Step 2b: counter payment — show success immediately
        setSubmittedMethod(paymentMethod);
        setOrderNumber(orderData.order_number);
        setSubmitted(true);
        setShowConfirm(false);
      }
    } catch {
      setSubmitError(lang === "fr" ? "Erreur de connexion" : "网络错误");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#8B0000", marginBottom: 8 }}>
            {lang === "fr" ? "Commande envoyée !" : "下单成功！"}
          </h2>
          <div style={{ margin: "20px 0", padding: "20px 32px", background: "white", borderRadius: 16, border: "3px solid #8B0000", display: "inline-block" }}>
            <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              {lang === "fr" ? "Votre numéro" : "您的取餐号"}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 56, fontWeight: 700, color: "#8B0000" }}>{orderNumber}</div>
            {submittedMethod === "card_counter" && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#fff7ed", borderRadius: 10, border: "1px solid #fdba74" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>💳</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#c2410c" }}>{lang === "fr" ? "Veuillez payer au comptoir" : "请到柜台刷卡付款"}</div>
              </div>
            )}
            {submittedMethod === "cash" && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #86efac" }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>💶</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#15803d" }}>{lang === "fr" ? "Veuillez payer en espèces au comptoir" : "请到柜台现金付款"}</div>
              </div>
            )}
            {submittedMethod === "online" && (
              <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                {lang === "fr" ? "Veuillez patienter, nous préparons votre commande" : "请稍候，我们正在准备您的餐食"}
              </div>
            )}
          </div>
          <div style={{ background: "white", borderRadius: 12, padding: 16, margin: "24px auto", textAlign: "left", border: "1px solid #eee", maxWidth: 340 }}>
            {allCartItems.map((item, i) => (
              <div key={item.uid || i} style={{ padding: "6px 0", fontSize: 14, borderBottom: i < allCartItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{item.name} ×{item.qty}</span>
                  <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace" }}>{(item.price * item.qty).toFixed(2)}€</span>
                </div>
                {item.options && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{optStr(item.options, lang)}</div>}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #eee", fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{total.toFixed(2)}€</span>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setCart({}); setMenuSelections([]); setOrderNumber(""); }}
            style={{ padding: "12px 28px", borderRadius: 10, border: "1px solid #ddd", background: "white", color: "#666", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {lang === "fr" ? "Nouvelle commande" : "再来一单"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet" />
      {/* Compact header */}
      <div style={{
        background: "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
        padding: "16px 20px", textAlign: "center", position: "relative",
      }}>
        <a href="#" style={{ position: "absolute", top: 16, left: 16, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>←</a>
        <button onClick={() => setLang(lang === "fr" ? "zh" : "fr")} style={{
          position: "absolute", top: 14, right: 16,
          background: "rgba(255,255,255,0.15)", border: "none", color: "rgba(255,255,255,0.9)",
          padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>{T.switchLang}</button>
        <h1 style={{
          fontFamily: lang === "zh" ? "'Noto Serif SC', serif" : "'Playfair Display', serif",
          fontSize: 22, fontWeight: 900, color: "white", margin: 0,
        }}>{lang === "fr" ? "Commander" : "点餐"}</h1>
      </div>

      {/* Menu */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "16px 16px 140px" }}>
        <Section title={T.sections.menus}>
          {MENU.menus.map(item => (
            <BentoRow key={item.id} item={item} lang={lang}
              count={bentoCount(item.id)}
              onAdd={() => openCustomizer(item)}
              onRemoveLast={() => removeBento(item.id)}
            />
          ))}
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
      </div>

      {/* Customizer modal */}
      {customizerItem && (
        <MenuCustomizer item={customizerItem} lang={lang} onConfirm={confirmBento} onClose={() => setCustomizerItem(null)} />
      )}

      {/* Confirm modal */}
      {showConfirm && cartCount > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#faf8f5", borderRadius: "20px 20px 0 0",
            padding: "24px 16px 32px", maxHeight: "70vh", overflowY: "auto",
          }}>
            <div style={{ width: 40, height: 4, background: "#ddd", borderRadius: 2, margin: "0 auto 16px" }} />
            <div style={{ background: "white", borderRadius: 14, padding: "4px 16px", marginBottom: 16, border: "1px solid #eee" }}>
              {allCartItems.map((item, i) => (
                <div key={item.uid || i} style={{ padding: "10px 0", borderBottom: i < allCartItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: "#999", marginLeft: 6 }}>×{item.qty}</span>
                      {item.options && <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{optStr(item.options, lang)}</div>}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 600, flexShrink: 0 }}>{(item.price * item.qty).toFixed(2)}€</span>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 8px", borderTop: "2px solid #8B0000" }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[{ key: "dine_in", fr: "Sur place", zh: "堂食" }, { key: "takeaway", fr: "À emporter", zh: "外带" }].map(opt => (
                <button key={opt.key} onClick={() => setOrderType(opt.key)} style={{
                  flex: 1, padding: 14, borderRadius: 10,
                  border: orderType === opt.key ? "2px solid #8B0000" : "1px solid #ddd",
                  background: orderType === opt.key ? "rgba(139,0,0,0.05)" : "white",
                  color: orderType === opt.key ? "#8B0000" : "#999",
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                }}>{lang === "zh" ? opt.zh : opt.fr}</button>
              ))}
            </div>
            {/* Payment method selector */}
            <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              {lang === "fr" ? "Mode de paiement 付款方式" : "付款方式"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                { key: "online", icon: "💳", fr: "Payer en ligne", sub: "Apple Pay / Google Pay / CB", zh: "在线付款", subZh: "Apple Pay / Google Pay / 刷卡" },
                { key: "card_counter", icon: "💳", fr: "Carte au comptoir", sub: "Payer à la caisse par carte", zh: "到店刷卡", subZh: "到柜台刷卡付款" },
                { key: "cash", icon: "💶", fr: "Espèces", sub: "Payer à la caisse en espèces", zh: "现金", subZh: "到柜台现金付款" },
              ].map(opt => (
                <button key={opt.key} onClick={() => setPaymentMethod(opt.key)} style={{
                  padding: "12px 14px", borderRadius: 10, textAlign: "left",
                  border: paymentMethod === opt.key ? "2px solid #8B0000" : "1px solid #ddd",
                  background: paymentMethod === opt.key ? "rgba(139,0,0,0.04)" : "white",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: paymentMethod === opt.key ? "#8B0000" : "#333" }}>
                        {lang === "zh" ? opt.zh : opt.fr}
                      </div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 1 }}>
                        {lang === "zh" ? opt.subZh : opt.sub}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {submitError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#991b1b", fontSize: 14, marginBottom: 12 }}>{submitError}</div>
            )}
            <button onClick={handleSubmit} disabled={submitting} style={{
              width: "100%", padding: 18, borderRadius: 12, border: "none",
              background: submitting ? "#ddd" : "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)",
              color: submitting ? "#999" : "white",
              fontSize: 18, fontWeight: 700, cursor: submitting ? "default" : "pointer",
            }}>
              {submitting ? (lang === "fr" ? "Envoi..." : "提交中...") : (lang === "fr" ? "Confirmer la commande" : "确认下单")}
            </button>
          </div>
        </div>
      )}

      {/* Floating cart bar */}
      {cartCount > 0 && !showConfirm && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "rgba(250,248,245,0.95)", backdropFilter: "blur(12px)",
          borderTop: "1px solid #eee", padding: "12px 16px", zIndex: 100,
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#999" }}>{cartCount} {lang === "fr" ? "article(s)" : "件"}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</div>
            </div>
            <button onClick={() => setShowConfirm(true)} style={{
              background: "#8B0000", color: "white", border: "none",
              padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer",
            }}>
              {lang === "fr" ? "Commander" : "下单"} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kitchen Panel (full-screen, two columns, sound alerts)
// ---------------------------------------------------------------------------

function KitchenPanel() {
  const [authed, setAuthed] = useState(() => localStorage.getItem("nr_kitchen") === "1");
  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState(false);
  const [orders, setOrders] = useState([]);
  const [clock, setClock] = useState("");
  const orderIdsRef = useRef(new Set());
  const readyIdsRef = useRef(new Set());
  const audioCtxRef = useRef(null);

  const playSound = (freq = 880, duration = 0.3) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  const playNewOrderSound = () => { playSound(660, 0.15); setTimeout(() => playSound(880, 0.3), 180); };
  const playReadySound = () => { playSound(523, 0.15); setTimeout(() => playSound(659, 0.15), 180); setTimeout(() => playSound(784, 0.3), 360); };

  // Clock
  useEffect(() => {
    const tick = () => { const n = new Date(); setClock(`${n.getHours().toString().padStart(2,"0")}:${n.getMinutes().toString().padStart(2,"0")}:${n.getSeconds().toString().padStart(2,"0")}`); };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  // Polling
  useEffect(() => {
    if (!authed) return;
    const poll = async () => {
      try {
        const res = await fetch(`${API}/api/order/queue?namespace=${NS}`);
        const data = await res.json();
        const newOrders = data.orders || [];

        // Detect new pending orders
        const pendingIds = new Set(newOrders.filter(o => o.status === "pending").map(o => o.id));
        for (const id of pendingIds) {
          if (!orderIdsRef.current.has(id)) { playNewOrderSound(); break; }
        }
        orderIdsRef.current = pendingIds;

        // Detect newly ready orders
        const readyIds = new Set(newOrders.filter(o => o.status === "ready").map(o => o.id));
        for (const id of readyIds) {
          if (!readyIdsRef.current.has(id)) { playReadySound(); break; }
        }
        readyIdsRef.current = readyIds;

        // Auto-mark ready orders as picked after 5 min
        const now = new Date();
        for (const order of newOrders) {
          if (order.status === "ready" && order.updated_at) {
            if (now - new Date(order.updated_at) > 5 * 60 * 1000) {
              fetch(`${API}/api/order/${order.id}/picked`, {
                method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ namespace: NS }),
              }).catch(() => {});
            }
          }
        }

        setOrders(newOrders.filter(o => o.status !== "picked" && (o.payment_status === "paid" || o.payment_status === "pending_counter" || o.payment_status === "pending_cash")));
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [authed]);

  const markReady = async (id) => {
    await fetch(`${API}/api/order/${id}/complete`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namespace: NS }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "ready", updated_at: new Date().toISOString() } : o));
    playReadySound();
  };

  const markPicked = async (id) => {
    await fetch(`${API}/api/order/${id}/picked`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namespace: NS }),
    });
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleLogin = () => {
    if (pwd === "kitchen2025") { localStorage.setItem("nr_kitchen", "1"); setAuthed(true); setPwdErr(false); }
    else setPwdErr(true);
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
        <div style={{ background: "#2a2a2a", borderRadius: 16, padding: 32, width: 320, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🍳</div>
          <h2 style={{ color: "#8B0000", fontSize: 22, marginBottom: 20 }}>Cuisine · 后厨</h2>
          <input type="password" value={pwd} onChange={e => { setPwd(e.target.value); setPwdErr(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Mot de passe"
            style={{ width: "100%", padding: 14, borderRadius: 10, border: pwdErr ? "2px solid #dc2626" : "1px solid #444", background: "#333", color: "white", fontSize: 16, boxSizing: "border-box", marginBottom: 12, outline: "none" }} />
          {pwdErr && <div style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>Mot de passe incorrect</div>}
          <button onClick={handleLogin} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: "#8B0000", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Entrer</button>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "preparing");
  const readyOrders = orders.filter(o => o.status === "ready");

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", fontFamily: "'Inter', sans-serif", color: "white" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} } .ready-blink{animation:blink 1.5s ease-in-out infinite}`}</style>

      {/* Top bar */}
      <div style={{ background: "#8B0000", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>👨‍🍳 Cuisine · 后厨</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20 }}>{clock}</span>
          <button onClick={() => { localStorage.removeItem("nr_kitchen"); setAuthed(false); }}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Déconnexion</button>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", height: "calc(100vh - 56px)", gap: 2 }}>
        {/* Left: pending */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#ff6b6b", marginBottom: 16 }}>
            En préparation · 待制作 ({pendingOrders.length})
          </div>
          {pendingOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#555", fontSize: 20 }}>Aucune commande · 暂无订单</div>
          )}
          {pendingOrders.map(order => {
            const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
            return (
              <div key={order.id} style={{ background: "#2a2a2a", borderRadius: 16, padding: 20, marginBottom: 16, border: order.payment_status === "paid" ? "2px solid #8B0000" : "2px solid #f97316" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 42, fontWeight: 700, color: "#8B0000" }}>{order.order_number}</span>
                  <span style={{ fontSize: 14, color: "#888" }}>
                    {order.order_type === "dine_in" ? "🍽 Sur place" : "📦 Emporter"}
                    <span style={{ marginLeft: 10 }}>{order.created_at ? new Date(order.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  </span>
                </div>
                {order.payment_status === "pending_counter" && (
                  <div style={{ background: "#431407", color: "#fb923c", borderRadius: 8, padding: "6px 12px", fontSize: 16, fontWeight: 700, marginBottom: 10, display: "inline-block" }}>💳 待刷卡 · En attente de paiement carte</div>
                )}
                {order.payment_status === "pending_cash" && (
                  <div style={{ background: "#14532d", color: "#4ade80", borderRadius: 8, padding: "6px 12px", fontSize: 16, fontWeight: 700, marginBottom: 10, display: "inline-block" }}>💶 待现金 · En attente de paiement espèces</div>
                )}
                <div style={{ marginBottom: 16 }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #333" }}>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {item.name} <span style={{ color: "#8B0000" }}>×{item.qty}</span>
                      </div>
                      {item.options && (
                        <div style={{ fontSize: 16, color: "#aaa", marginTop: 2 }}>
                          {Object.values(item.options).filter(Boolean).join(" · ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => markReady(order.id)} style={{
                  width: "100%", padding: 18, borderRadius: 12, border: "none",
                  background: "#16a34a", color: "white", fontSize: 22, fontWeight: 700, cursor: "pointer",
                }}>✓ Terminé · 完成</button>
              </div>
            );
          })}
        </div>

        {/* Right: ready for pickup */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#111" }}>
          <div style={{ fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#fbbf24", marginBottom: 16 }}>
            Prêt · 请取餐 ({readyOrders.length})
          </div>
          {readyOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "#555", fontSize: 20 }}>—</div>
          )}
          {readyOrders.map(order => (
            <div key={order.id} className="ready-blink" onClick={() => markPicked(order.id)} style={{
              background: "linear-gradient(135deg, #8B0000, #5c0000)", borderRadius: 16, padding: 24, marginBottom: 16,
              textAlign: "center", cursor: "pointer",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 64, fontWeight: 700, color: "white" }}>{order.order_number}</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
                {order.order_type === "dine_in" ? "🍽 Sur place · 堂食" : "📦 À emporter · 外带"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>
                Cliquer quand récupéré · 取餐后点击
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Menu Page (reservation/booking — existing functionality)
// ---------------------------------------------------------------------------

function MenuPage() {
  const [lang, setLang] = useState("fr");
  const [cart, setCart] = useState({});                  // non-bento: { [id]: qty }
  const [menuSelections, setMenuSelections] = useState([]); // bento: [{uid, menuId, options}]
  const [customizerItem, setCustomizerItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "12:00", notes: "", type: "surPlace" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const T = t[lang];
  const flatItems = [...MENU.plats, ...MENU.banhMi, ...MENU.boBun, ...MENU.carte, ...MENU.desserts, ...MENU.boissons];

  // Non-bento handlers
  const add = (id) => setCart(p => ({ ...p, [id]: (p[id] || 0) + 1 }));
  const remove = (id) => setCart(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) - 1) }));

  // Bento handlers
  const bentoCount = (menuId) => menuSelections.filter(s => s.menuId === menuId).length;
  const openCustomizer = (item) => setCustomizerItem(item);
  const removeBento = (menuId) => {
    setMenuSelections(prev => {
      const idx = prev.map(s => s.menuId).lastIndexOf(menuId);
      if (idx < 0) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };
  const confirmBento = (selections) => {
    setMenuSelections(prev => [...prev, {
      uid: `${customizerItem.id}-${Date.now()}`,
      menuId: customizerItem.id,
      options: selections,
    }]);
    setCustomizerItem(null);
  };

  // Combined cart
  const nonBentoCartItems = Object.entries(cart).filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...flatItems.find(i => i.id === id), qty, options: null }))
    .filter(i => i.name);
  const bentoCartItems = menuSelections.map(sel => ({
    ...MENU.menus.find(m => m.id === sel.menuId),
    qty: 1, options: sel.options, uid: sel.uid,
  }));
  const allCartItems = [...bentoCartItems, ...nonBentoCartItems];
  const total = allCartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = allCartItems.reduce((s, i) => s + i.qty, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    if (!form.date) setForm(f => ({ ...f, date: defaultDate }));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || allCartItems.length === 0) return;
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
          customer_email: form.email,
          booking_date: form.date,
          booking_time: form.time,
          type: form.type,
          items: allCartItems.map(i => ({
            id: i.id, name: i.name, qty: i.qty, price: i.price,
            options: i.options
              ? Object.fromEntries(Object.entries(i.options).map(([k, v]) => [k, v.fr]))
              : null,
          })),
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
            {allCartItems.map((item, i) => (
              <div key={item.uid || i} style={{ padding: "4px 0", fontSize: 14, borderBottom: i < allCartItems.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{item.name} ×{item.qty}</span>
                  <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace" }}>{(item.price * item.qty).toFixed(2)}€</span>
                </div>
                {item.options && <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{optStr(item.options, lang)}</div>}
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #eee", fontWeight: 700 }}>
              <span>{T.order.total}</span>
              <span style={{ color: "#8B0000", fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>{total.toFixed(2)}€</span>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setCart({}); setMenuSelections([]); setForm({ name: "", email: "", phone: "", date: defaultDate, time: "12:00", notes: "", type: "surPlace" }); }}
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
        <a href="#" style={{ position: "absolute", top: 16, left: 16, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>←</a>
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

      {/* Customizer modal */}
      {customizerItem && (
        <MenuCustomizer item={customizerItem} lang={lang} onConfirm={confirmBento} onClose={() => setCustomizerItem(null)} />
      )}

      {/* Menu */}
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 120px" }}>
        <Section title={T.sections.menus}>
          {MENU.menus.map(item => (
            <BentoRow key={item.id} item={item} lang={lang}
              count={bentoCount(item.id)}
              onAdd={() => openCustomizer(item)}
              onRemoveLast={() => removeBento(item.id)}
            />
          ))}
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

            <div style={{ background: "white", borderRadius: 14, padding: "4px 16px", marginBottom: 16, border: "1px solid #eee" }}>
              {allCartItems.map((item, i) => (
                <div key={item.uid || i} style={{ padding: "10px 0", borderBottom: i < allCartItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: "#999", marginLeft: 6, fontSize: 13 }}>×{item.qty}</span>
                      {item.options && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{optStr(item.options, lang)}</div>}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8B0000", fontWeight: 600, fontSize: 14, flexShrink: 0 }}>{(item.price * item.qty).toFixed(2)}€</span>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 8px", borderTop: "2px solid #8B0000" }}>
                <span style={{ fontWeight: 700 }}>{T.order.total}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#8B0000" }}>{total.toFixed(2)}€</span>
              </div>
            </div>

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

              {[{ key: "name", type: "text" }, { key: "email", type: "email", placeholder: "votre@email.com" }, { key: "phone", type: "tel" }].map(({ key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#999", fontWeight: 600, marginBottom: 4, display: "block" }}>{T.order[key]} *</label>
                  <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder || ""} style={{
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

              <button onClick={handleSubmit} disabled={!form.name || !form.email || !form.phone || submitting} style={{
                padding: "16px", borderRadius: 12, border: "none",
                background: form.name && form.email && form.phone && !submitting ? "linear-gradient(135deg, #8B0000 0%, #5c0000 100%)" : "#ddd",
                color: form.name && form.email && form.phone && !submitting ? "white" : "#999",
                fontSize: 16, fontWeight: 700, cursor: form.name && form.email && form.phone && !submitting ? "pointer" : "default",
                opacity: submitting ? 0.7 : 1,
              }}>
                {submitting ? (lang === "fr" ? "Envoi en cours..." : "提交中...") : `${T.order.submit} · ${total.toFixed(2)}€`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating cart bar */}
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

      <div style={{ textAlign: "center", padding: "20px", fontSize: 11, color: "#ccc" }}>
        <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>← {lang === "fr" ? "Accueil" : "首页"}</a>
        <span style={{ margin: "0 6px" }}>·</span>
        <a href="#admin" style={{ color: "#ddd", textDecoration: "none" }}>Gestion</a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment Success Page
// ---------------------------------------------------------------------------

function PaymentSuccessPage({ orderId }) {
  const [lang] = useState("fr");
  const [status, setStatus] = useState("verifying"); // verifying | paid | failed
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (!orderId) { setStatus("failed"); return; }
    const verify = async () => {
      try {
        const res = await fetch(`${API}/api/payment/verify?namespace=${NS}&order_id=${orderId}`);
        const data = await res.json();
        if (data.paid) {
          setStatus("paid");
          // Fetch order number from queue
          try {
            const qr = await fetch(`${API}/api/order/queue?namespace=${NS}`);
            const qd = await qr.json();
            const order = (qd.orders || []).find(o => String(o.id) === String(orderId));
            if (order) setOrderNumber(order.order_number);
          } catch {}
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    };
    verify();
  }, [orderId]);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
      <div style={{ textAlign: "center", padding: 40, maxWidth: 400 }}>
        {status === "verifying" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#8B0000" }}>
              {lang === "fr" ? "Vérification du paiement..." : "正在验证支付..."}
            </h2>
          </>
        )}
        {status === "paid" && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#8B0000", marginBottom: 8 }}>
              {lang === "fr" ? "Paiement confirmé !" : "支付成功！"}
            </h2>
            {orderNumber && (
              <div style={{ margin: "20px 0", padding: "20px 32px", background: "white", borderRadius: 16, border: "3px solid #8B0000", display: "inline-block" }}>
                <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
                  {lang === "fr" ? "Votre numéro" : "您的取餐号"}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 56, fontWeight: 700, color: "#8B0000" }}>{orderNumber}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                  {lang === "fr" ? "Nous préparons votre commande" : "我们正在准备您的餐食"}
                </div>
              </div>
            )}
            <a href="#order" style={{ display: "inline-block", marginTop: 20, padding: "12px 28px", borderRadius: 10, border: "1px solid #ddd", background: "white", color: "#666", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              {lang === "fr" ? "Nouvelle commande" : "再来一单"}
            </a>
          </>
        )}
        {status === "failed" && (
          <>
            <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#8B0000", marginBottom: 12 }}>
              {lang === "fr" ? "Paiement non confirmé" : "支付未确认"}
            </h2>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
              {lang === "fr" ? "Votre paiement n'a pas pu être vérifié. Veuillez réessayer ou contacter le personnel." : "支付未能验证，请重试或联系工作人员。"}
            </p>
            <a href="#order" style={{ display: "inline-block", padding: "12px 28px", borderRadius: 10, background: "#8B0000", color: "white", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              {lang === "fr" ? "Retour à la commande" : "返回点餐"}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export default function App() {
  const parseHash = () => {
    const full = window.location.hash.slice(1) || "";
    const [path, qs] = full.split("?");
    return { path, params: new URLSearchParams(qs || "") };
  };
  const [routeInfo, setRouteInfo] = useState(parseHash);
  useEffect(() => {
    const onHash = () => setRouteInfo(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const { path: route, params } = routeInfo;
  // Kitchen and admin don't need install prompt
  if (route === "admin") return <AdminPanel />;
  if (route === "kitchen") return <KitchenPanel />;
  return (
    <>
      {route === "order" && <OrderPage />}
      {route === "menu" && <MenuPage />}
      {route === "payment-success" && <PaymentSuccessPage orderId={params.get("order_id")} />}
      {route !== "order" && route !== "menu" && route !== "payment-success" && <LandingPage />}
      <InstallPrompt />
    </>
  );
}
