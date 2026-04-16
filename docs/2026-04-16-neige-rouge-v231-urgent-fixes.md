# Neige Rouge v2.3.1 — 三个紧急Bug修复（周六演示前）

> 日期：2026-04-16
> 优先级：紧急 — 周六现场演示
> 前置：v2.3.0已部署，预订定金功能框架已有

---

## Bug 1：付定金模式没有跳转Stancer

### 现象
选"💳 Payer maintenant"付定金（如4人×€10=€40）时，没有跳转到Stancer支付页。但选付全款（购物车有菜品）时可以正常跳转。

### 排查
1. 检查后端 `server.py` 的 `POST /api/neige-rouge/bookings`：
   - 当 `payment_required=true` 且购物车为空时，`amount` 是否正确计算为 `guests × deposit_per_person`
   - 是否调用了 `generate_payment` 并传入正确的 `amount`
   - `generate_payment` 返回的 `payment_url` 是否正确返回给前端
2. 检查前端 `BookingPage.jsx`：
   - 收到后端返回的 `payment_url` 后是否执行了 `window.location.href = payment_url`
   - console里是否有JS错误

### 修复要求
- 付定金时：`amount = guests × deposit_per_person`（如 4×10=40）
- 付全款时：`amount = 购物车总额`
- 两种模式都必须调用 `generate_payment` 并返回 `payment_url`
- 前端收到 `payment_url` 后必须跳转

### 验证
- 选4人 → 选"Payer maintenant" → 显示€40 → 跳转Stancer → 用卡号 `4000 0000 0000 0077` → 支付成功 → 返回确认页

---

## Bug 2：预订订单显示在后厨大屏

### 需求
预订付款成功且包含菜品的订单，在客人到店后应出现在后厨大屏，但需要和堂食订单区分。

### 实现
后厨大屏 `KitchenDisplay.jsx` 修改：

1. 预订订单用蓝色🔵标签 "Réservation" 标记，堂食订单保持原样
2. 预订订单只在管理后台点"Arrivé"（客人到店）后，才进入大屏的制作队列
3. 预订订单卡片显示：预订码 + 到店时间 + 人数 + 菜品列表
4. 纯定金预订（没有菜品）不显示在大屏

大屏显示效果：
```
┌────────────────────┬────────────────────┐
│ 🔥 En préparation    │ ✅ Prêt              │
│                     │                     │
│ #042 堂食            │ #041               │
│ Boeuf épicé ×1     │                     │
│ [✓ Terminé]        │                     │
│                     │                     │
│ 🔵 R-003 Réservation│                     │
│ 19:00 · 4 pers     │                     │
│ Canard laqué ×2    │                     │
│ [✓ Terminé]        │                     │
└────────────────────┴────────────────────┘
```

---

## Bug 3：预订到店后生成收款订单 + 收据发票

### 问题
管理后台点"arrivé"后没有对应的 `dine_order` 记录，所以无法生成收据和发票。

### 完整流程设计

```
客人预订（付定金€40）
  ↓
客人到店 → 管理后台点 "Arrivé"
  ↓
系统自动创建 dine_order（关联 booking_id）
  ↓
如果预订包含菜品 → 自动写入 order items
客人现场可以继续加菜
  ↓
结账：
  订单总额 €85
  定金抵扣 -€40
  实付     €45 → Stancer支付
  ↓
支付成功 → 订单完成 → 收据和发票可用
```

### 后端修改

#### 3.1 数据库
```sql
-- dine_orders 表加字段（如果没有）
ALTER TABLE dine_orders ADD COLUMN booking_id INTEGER;
ALTER TABLE dine_orders ADD COLUMN deposit_applied REAL DEFAULT 0;
ALTER TABLE dine_orders ADD COLUMN order_source TEXT DEFAULT 'dine_in';
-- order_source: 'dine_in' | 'reservation'
```

#### 3.2 新增API：客人到店

```
POST /api/neige-rouge/bookings/:id/arrive

逻辑：
1. 查找booking记录，验证状态
2. 标记 booking.status = 'arrived'
3. 创建 dine_order：
   - order_source = 'reservation'
   - booking_id = 关联预订ID
   - deposit_applied = booking.deposit_amount（如40）
   - 如果booking有菜品items → 写入order items
   - 分配取餐号（pickup_number）
4. 返回：
   { 
     "booking_id": 123, 
     "order_id": 456, 
     "pickup_number": "042",
     "deposit_applied": 40.00,
     "items": [...] 
   }
```

#### 3.3 修改结账逻辑

```
POST /api/neige-rouge/orders/:id/checkout

逻辑：
1. 计算订单总额（order_total）
2. 查找关联的deposit_applied
3. 实付金额 = order_total - deposit_applied
4. 如果实付 > 0：
   - 调用 generate_payment(amount=实付金额)
   - 返回 payment_url
5. 如果实付 <= 0：
   - 直接标记 paid
   - 定金完全覆盖
6. 返回：
   {
     "order_total": 85.00,
     "deposit_applied": 40.00,
     "amount_due": 45.00,
     "payment_url": "https://..." 或 null
   }
```

#### 3.4 修改收据生成

收据PDF上显示定金抵扣明细：
```
Sous-total HT           77,27 €
TVA 10% (repas)          7,73 €
─────────────────────────────
Total TTC               85,00 €

Acompte déduit          -40,00 €
═════════════════════════════════
Montant payé            45,00 €
```

发票同样显示定金抵扣行。

### 前端修改

#### 3.5 管理后台 — 预订列表按钮

每条预订根据状态显示不同按钮：

```
状态: confirmed + 已付定金
  [✓ Arrivé]  [↩️ Rembourser]  [✗ No-show]

状态: arrived
  [📋 Voir la commande]  [🖨️ Ticket]

状态: completed
  [📄 Reçu]  [🏢 Facture]
```

点 "✓ Arrivé"：
- 调用 POST /bookings/:id/arrive
- 成功后显示 Toast "Commande #042 créée"
- 该订单自动出现在 Commandes tab
- 如果有菜品，后厨大屏自动显示（蓝色标签）

#### 3.6 Commandes tab 中预订转化的订单

- 带蓝色🔵 "Réservation" 标签
- 显示 "Acompte: 40,00 €" 
- 结账按钮显示实付金额："Encaisser 45,00 € (acompte 40 € déduit)"

---

## 测试清单（周六演示前必须全部通过）

### 流程A：纯定金预订（不点菜）
- [ ] 选4人 → 选"Payer maintenant" → €40 → 跳转Stancer
- [ ] 测试卡 4000 0000 0000 0077 → 支付成功
- [ ] 确认页显示 "🟢 Payé 40 €"
- [ ] 管理后台看到 🟢 Payé 40€
- [ ] 点 "Arrivé" → 创建空订单
- [ ] 客人现场点菜 → 加到订单
- [ ] 结账 → 总额€85 - 定金€40 = 实付€45
- [ ] 收据显示定金抵扣明细

### 流程B：预订+点菜+付定金
- [ ] 选4人 + 选菜品 → 选"Payer maintenant" → €40
- [ ] Stancer支付成功
- [ ] 点 "Arrivé" → 订单自动带菜品
- [ ] 后厨大屏出现蓝色🔵预订订单
- [ ] 可以加菜
- [ ] 结账扣定金

### 流程C：普通预订（不付款）
- [ ] 选"Réserver sans paiement" → 直接确认
- [ ] 管理后台显示 ⚪ Standard
- [ ] 点 "Arrivé" → 创建订单
- [ ] 正常点菜结账（无定金扣除）

### 流程D：堂食直接点餐（原有功能不能broken）
- [ ] 扫码 → 点菜 → 付款 → 后厨大屏 → 取餐号 → 收据
- [ ] 确认原有堂食流程完全正常

做完 deploy，打 tag v2.3.1。

---

*周六演示成功 = 红雪正式签约*
