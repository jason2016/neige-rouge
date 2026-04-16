# Neige Rouge 红雪餐厅 — Step 6: 预订流程增加付款选项

> 发送给 Neige Rouge Workspace 的 Claude Code 执行
> 日期：2026-04-16
> 前置条件：v2.2.0（收据+发票PDF已完成）
> 目标：预订时客人可选择付定金或普通预订，提升到店率

---

## 一、背景与目标

### 痛点
- **No-show问题**：客人预订不来，导致空位浪费，损失收入
- **收入前置**：餐厅希望现金流更稳定
- **筛选真客户**：愿意付定金的客人才是真想来的

### 设计原则
- **给客人选择权**：不强制付款，客人可选"付定金"或"普通预订"
- **门槛低**：只收€10/人，不劝退客人
- **Win-Win**：客人到店抵扣不亏，老板减少no-show

---

## 二、两种预订模式

### 选项A：付定金预订（⭐推荐）
- 定金 = €10 × 人数
- 2人→€20 / 4人→€40 / 6人→€60
- 到店点单时自动抵扣餐费
- 24小时前可免费取消（全额退款）
- 24小时内取消不退款（no-show费）
- 使用Stancer测试模式支付（成功卡：4000 0000 0000 0077）

### 选项B：普通预订
- 不付款，直接确认
- 无取消限制
- 老板自己判断no-show风险

---

## 三、UI设计

### 预订流程最后一步（人数/日期/时间/个人信息已填完后）

```
┌─────────────────────────────────────┐
│  Comment souhaitez-vous réserver ?  │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  ⭐ RECOMMANDÉ                │    │
│  │                              │    │
│  │  💳 Payer maintenant         │    │
│  │                              │    │
│  │  Acompte de garantie         │    │
│  │  10 € × 4 pers = 40 €       │    │
│  │                              │    │
│  │  ✓ Place garantie            │    │
│  │  ✓ Déductible à l'addition   │    │
│  │  ✓ Annulation gratuite 24h   │    │
│  │                              │    │
│  │  [ Payer 40 € et réserver ]  │    │
│  └─────────────────────────────┘    │
│                                      │
│            — ou —                    │
│                                      │
│  ┌─────────────────────────────┐    │
│  │  📝 Réserver sans paiement   │    │
│  │                              │    │
│  │  Réservation standard        │    │
│  │  sans acompte                │    │
│  │                              │    │
│  │  [ Confirmer la réservation ]│    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### 样式要点
- "付定金"卡片更显眼（金色边框/更大阴影/⭐推荐标签）
- "普通预订"卡片相对简朴（淡灰边框）
- 默认focus在"付定金"卡片（轻推客人选这个）
- 定金金额随人数实时更新

---

## 四、后端修改

### 4.1 数据库（stand9 SQLite - neige-rouge.db）

在bookings表加字段（或新建if not exists）：

```sql
ALTER TABLE bookings ADD COLUMN payment_required BOOLEAN DEFAULT 0;
ALTER TABLE bookings ADD COLUMN deposit_amount REAL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN deposit_per_person REAL DEFAULT 10;
ALTER TABLE bookings ADD COLUMN payment_id TEXT;          -- Stancer payment ID
ALTER TABLE bookings ADD COLUMN payment_status TEXT;      -- unpaid/paid/refunded/used
ALTER TABLE bookings ADD COLUMN paid_at DATETIME;
ALTER TABLE bookings ADD COLUMN refunded_at DATETIME;
ALTER TABLE bookings ADD COLUMN used_at DATETIME;         -- 定金被使用时间
ALTER TABLE bookings ADD COLUMN deposit_used_in_order_id INTEGER; -- 关联订单
```

### 4.2 新增API

**POST /api/neige-rouge/bookings**（扩展现有接口）
```json
Body: {
  "date": "2026-04-20",
  "time": "19:00",
  "guests": 4,
  "name": "Jason",
  "phone": "0612345678",
  "email": "jason@example.com",
  "payment_required": true,    // 是否选择付定金
  "deposit_per_person": 10     // 定金单价（默认10）
}

Response:
{
  "booking_id": 123,
  "booking_code": "NR-B2026-042",
  "payment_required": true,
  "deposit_amount": 40.00,
  "payment_url": "https://api.stancer.com/..."  // 如果付定金，返回支付链接
}
```

**POST /api/neige-rouge/bookings/:id/use-deposit**（到店抵扣）
```json
Body: { "order_id": 456 }

Response:
{
  "booking_id": 123,
  "order_id": 456,
  "deposit_amount": 40.00,
  "order_total_before": 85.00,
  "order_total_after": 45.00,
  "status": "used"
}
```

**POST /api/neige-rouge/bookings/:id/refund**（取消退款）
```json
Body: { "reason": "customer_request" }

Response:
{
  "booking_id": 123,
  "refund_amount": 40.00,
  "stancer_refund_id": "ref_xxx",
  "status": "refunded"
}
```

**GET /api/neige-rouge/bookings/:code**（通过预订码查询）
- 返回预订信息 + 定金状态（到店收银台用）

### 4.3 Stancer集成

- 使用现有的`generate_payment` Tool
- 支付成功后Stancer webhook回调
- 更新bookings表：`payment_status='paid'`, `paid_at=NOW()`
- 退款使用Stancer Refund API
- MVP阶段用**测试模式**（test key），不需要老板注册正式账号
- 成功测试卡：`4000 0000 0000 0077`

---

## 五、前端实现

### 5.1 BookingPage.jsx 修改

在现有的预订表单后加一步"选择支付方式"：

```jsx
// 新增state
const [paymentRequired, setPaymentRequired] = useState(true); // 默认推荐付定金
const depositAmount = paymentRequired ? guests * 10 : 0;

// UI：两个卡片选项
<div className="payment-choice">
  <Card 
    selected={paymentRequired}
    onClick={() => setPaymentRequired(true)}
    className="card-recommended"
  >
    <Badge>⭐ RECOMMANDÉ</Badge>
    <h3>💳 Payer maintenant</h3>
    <div className="amount">{guests} × 10 € = {depositAmount} €</div>
    <ul>
      <li>✓ Place garantie</li>
      <li>✓ Déductible à l'addition</li>
      <li>✓ Annulation gratuite 24h avant</li>
    </ul>
  </Card>
  
  <div className="separator">— ou —</div>
  
  <Card 
    selected={!paymentRequired}
    onClick={() => setPaymentRequired(false)}
    className="card-standard"
  >
    <h3>📝 Réserver sans paiement</h3>
    <p>Réservation standard sans acompte</p>
  </Card>
</div>

<button onClick={handleSubmit} className="btn-primary">
  {paymentRequired 
    ? `Payer ${depositAmount} € et réserver` 
    : 'Confirmer la réservation'}
</button>
```

### 5.2 提交逻辑

```javascript
const handleSubmit = async () => {
  const response = await fetch('/api/neige-rouge/bookings', {
    method: 'POST',
    body: JSON.stringify({
      ...bookingData,
      payment_required: paymentRequired,
      deposit_per_person: 10
    })
  });
  
  const data = await response.json();
  
  if (data.payment_required && data.payment_url) {
    // 跳转Stancer支付页
    window.location.href = data.payment_url;
  } else {
    // 直接跳成功页
    navigate(`/booking-success/${data.booking_code}`);
  }
};
```

### 5.3 BookingSuccess.jsx

```
┌─────────────────────────────────────┐
│  ✅ Réservation confirmée !          │
│                                      │
│  Code de réservation                 │
│  ┌──────────────────┐               │
│  │   NR-B2026-042   │               │
│  └──────────────────┘               │
│                                      │
│  📅 20 avril 2026 · 19:00           │
│  👥 4 personnes                      │
│  💳 Acompte payé: 40,00 €           │  (如果付了定金)
│                                      │
│  💡 Montrez ce code en arrivant     │
│                                      │
│  [📧 Reçu envoyé par email]         │
│                                      │
│  [← Retour à l'accueil]             │
└─────────────────────────────────────┘
```

---

## 六、邮件通知

### 预订确认邮件（付定金的版本）

```
Bonjour Jason,

Votre réservation au restaurant Neige Rouge est confirmée !

📅 Date: 20 avril 2026 à 19h00
👥 Personnes: 4
🎫 Code de réservation: NR-B2026-042

💳 Acompte payé: 40,00 €
→ Ce montant sera déduit de votre addition lors du repas.

📋 Conditions d'annulation:
• Annulation gratuite jusqu'à 24h avant la réservation
• Au-delà, l'acompte est conservé

Nous avons hâte de vous accueillir !

Neige Rouge 红雪餐厅
```

### 普通预订邮件

```
Bonjour Jason,

Votre réservation est confirmée.

📅 Date: 20 avril 2026 à 19h00
👥 Personnes: 4
🎫 Code: NR-B2026-042

À bientôt !

Neige Rouge
```

---

## 七、管理后台

### AdminPanel.jsx — 预订列表

每条预订显示支付状态：

```
┌─────────────────────────────────────┐
│  20/04 19:00 · 4 pers · Jason      │
│  NR-B2026-042                       │
│                                      │
│  [🟢 Payé 40 €]                     │
│                                      │
│  [✓ Utiliser l'acompte]             │
│  [↩️ Rembourser]                     │
└─────────────────────────────────────┘

或者普通预订：

┌─────────────────────────────────────┐
│  21/04 20:00 · 2 pers · Marie      │
│  NR-B2026-043                       │
│                                      │
│  [⚪ Standard (sans acompte)]        │
│                                      │
│  [✗ Annuler]                        │
└─────────────────────────────────────┘
```

### 支付状态颜色

```
🟢 Payé        — 绿色，已支付定金
🔵 Used        — 蓝色，定金已抵扣
🟡 Refunded    — 黄色，已退款
🔴 No-show     — 红色，客人没来（过期自动标记）
⚪ Standard    — 灰色，普通预订（未付款）
```

### 到店抵扣流程

```
客人到店 → 报预订码 NR-B2026-042
收银台搜索预订 → 看到"🟢 Payé 40 €"
客人点单消费€85
点击"✓ Utiliser l'acompte"
→ 系统弹窗：
  "Utiliser l'acompte de 40 € pour la commande #ORD-123 ?
   Total avant: 85 €
   Acompte: -40 €
   Total à payer: 45 €"
→ 确认 → 订单金额变为€45 → 客人支付€45
→ 预订状态：🔵 Used
```

### 取消退款流程

```
24h+前取消：
  点"Rembourser" → 调用Stancer refund → 全额退款
  状态：🟡 Refunded
  
24h内取消：
  点"Annuler" → 不退款，标记取消
  状态：保持🟢 Payé（餐厅获得no-show费）
  
自动No-show：
  次日凌晨cron检查昨天过期预订
  未使用+未取消 → 标记为🔴 No-show
  定金转为no-show收入
```

---

## 八、功能开关

为了让老板可以控制是否启用此功能：

```javascript
// src/config.js
export const FEATURES = {
  booking_deposit: true,  // 开启定金选项
  // ... 其他feature flags
};
```

- `true`：显示两个选项（付定金/普通）
- `false`：只显示普通预订（恢复旧流程）

老板可以通过修改config重新部署来开关此功能。

---

## 九、Demo策略

### 给老板演示的流程

1. **使用Stancer测试模式**（不需要真实支付）
2. 演示客人端：
   - 选4人预订 → 显示€40定金
   - 选"付定金" → 跳Stancer测试页 → 输入4000 0000 0000 0077
   - 支付成功 → 看到预订码+定金€40
   - 收到邮件确认
3. 演示老板端（管理后台）：
   - 看到新预订 🟢 Payé 40 €
   - 模拟客人到店 → 点"Utiliser l'acompte" → 订单扣€40
   - 模拟取消 → 点"Rembourser" → 退款
4. 对比普通预订：
   - 不选付定金 → 直接确认预订
   - 管理后台显示⚪ Standard

**老板试用满意后**，再注册Stancer正式账号切换到生产模式。

---

## 十、执行顺序

### 第一步：后端（stand9）
1. bookings表ALTER加字段
2. 修改 POST /api/neige-rouge/bookings 支持payment_required
3. 新增 POST /bookings/:id/use-deposit
4. 新增 POST /bookings/:id/refund
5. Stancer集成（测试模式）
6. Webhook处理支付成功

### 第二步：前端
1. BookingPage.jsx 加"选择支付方式"步骤
2. 两个卡片UI（推荐卡片+标准卡片）
3. 实时计算定金金额
4. Stancer支付跳转逻辑
5. BookingSuccess.jsx 显示定金信息
6. AdminPanel.jsx 加支付状态+操作按钮
7. 邮件模板区分两种预订

### 第三步：测试
- [ ] 选付定金 → 跳Stancer → 4000 0000 0000 0077 → 成功
- [ ] 看到预订码+定金€40
- [ ] 收到邮件确认
- [ ] 管理后台看到🟢 Payé
- [ ] "Utiliser l'acompte" → 订单金额正确扣减
- [ ] "Rembourser" → Stancer退款成功
- [ ] 选普通预订 → 直接确认无支付
- [ ] 管理后台显示⚪ Standard
- [ ] FEATURES.booking_deposit=false时隐藏付定金选项

### 第四步：部署
- deploy前端到GitHub Pages
- stand9后端重启
- 打tag v2.3.0

---

## 十一、关键决策记录

1. **客人可选**：不强制付款，给客人选择权，降低心理负担
2. **定金€10/人**：行业低门槛，4人才€40，不劝退
3. **到店抵扣**：客人感觉不吃亏，老板锁定客户
4. **24h取消政策**：业内标准，覆盖老板no-show风险
5. **先测试模式Demo**：给老板看效果满意再注册正式Stancer
6. **FEATURES开关**：未来其他餐厅可关闭此功能
7. **定金少于消费不退差额**：MVP简化，餐厅利益优先

---

*Powered by ClawShow — Instant Backend for Small Business*
*让预订不再是口头承诺，而是实际承诺。*
