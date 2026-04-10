# 任务：#order 增加到店付款选项（现金/刷卡）+ 系统手工收款确认

## GitHub 仓库：jason2016/neige-rouge
## 后端：stand9（51.77.201.82）/opt/clawshow-mcp-server/

---

## 一、#order 点餐页面增加付款方式选择

客户选完菜后，在提交订单前增加付款方式选择：

### 付款方式选项（3个）

1. **Payer en ligne 在线付款** — Apple Pay / Google Pay / CB
   → 现有流程不变，跳转 Stancer 支付页面

2. **Payer par carte au comptoir 到店刷卡**
   → 提交订单 → 显示订单号 → 提示"请到柜台刷卡付款"
   → 订单进入系统，payment_status = "pending_counter"
   → 后厨大屏显示，标记为"待收款 💳"

3. **Payer en espèces 现金付款**
   → 提交订单 → 显示订单号 → 提示"请到柜台现金付款"
   → 订单进入系统，payment_status = "pending_cash"
   → 后厨大屏显示，标记为"待收款 💶"

### UI 设计

在购物车确认页面，总价下方增加付款方式选择：

```
┌─────────────────────────────────┐
│  Total: 18,50€                  │
│                                 │
│  Mode de paiement 付款方式：      │
│                                 │
│  ○ Payer en ligne 在线付款       │
│    Apple Pay / Google Pay / CB  │
│                                 │
│  ○ Carte au comptoir 到店刷卡    │
│                                 │
│  ○ Espèces 现金                 │
│                                 │
│  [ Confirmer la commande ]      │
└─────────────────────────────────┘
```

默认选中"Payer en ligne"。

---

## 二、后端数据库修改

### dine_orders 表新增字段

- `payment_method` TEXT — 值为 "online" / "card_counter" / "cash"

### 订单状态组合

| 付款方式 | 创建时 payment_status | 付款后 payment_status |
|---------|---------------------|---------------------|
| 在线付款 | unpaid → Stancer 流程 → paid | paid |
| 到店刷卡 | pending_counter | paid（管理员确认后） |
| 现金    | pending_cash | paid（管理员确认后） |

---

## 三、后端 API 修改

### POST /api/order/create 修改

增加 `payment_method` 参数（"online" / "card_counter" / "cash"）：

- 如果 payment_method = "online" → 现有流程，返回后前端跳 Stancer
- 如果 payment_method = "card_counter" 或 "cash" → 直接创建订单，返回 order_number，不走 Stancer

### 新增 POST /api/order/{id}/confirm-payment

管理员在后台确认收款：

参数：
- `amount_received`（实际收到金额，可能和订单金额一致）
- `payment_method`（"card_counter" 或 "cash"）

操作：
- 更新 payment_status = "paid"
- 记录 amount_received 和确认时间

---

## 四、#kitchen 后厨大屏修改

后厨大屏需要显示所有订单（不只是 paid），但区分付款状态：

| payment_status | 显示 | 说明 |
|---------------|------|------|
| paid | 正常显示（绿色边框）| 在线已付款 |
| pending_counter | 显示 + "💳 待刷卡" 标签（橙色边框）| 等客户到柜台刷卡 |
| pending_cash | 显示 + "💶 待现金" 标签（橙色边框）| 等客户到柜台付现金 |
| unpaid | 不显示 | 在线付款未完成 |

后厨看到所有有效订单，不管付款方式，都开始做。标签提醒前台需要收款。

---

## 五、#admin 管理后台增加收款确认功能

### Commandes tab 修改

每个 pending_counter / pending_cash 状态的订单，增加"确认收款"按钮：

```
┌──────────────────────────────────────────┐
│ C007  Menu A ×1  7,50€   💳 待刷卡      │
│ Salade d'algues, Riz cantonais          │
│                                          │
│ 实际收款金额: [  7,50  ] €              │
│ [ ✅ 确认收款 ]                          │
└──────────────────────────────────────────┘
```

点击"确认收款"：
- 调用 POST /api/order/{id}/confirm-payment
- 订单状态变为 paid
- 按钮变为"✅ 已收款"（灰色，不可点击）
- 同时可以打印小票和发票（复用现有的 Ticket 和 Facture 功能）

### 发票编号规则

所有付款方式统一编号，不区分：
- F2026-0407-C007（在线付款）
- F2026-0407-C008（刷卡）
- F2026-0407-C009（现金）

发票上的付款方式显示：
- online → "Carte bancaire (en ligne)"
- card_counter → "Carte bancaire (sur place)"
- cash → "Espèces"

---

## 六、前端订单确认页面

### 在线付款（现有流程不变）
→ 跳转 Stancer → 付款成功 → #payment-success → 显示订单号

### 到店刷卡/现金（新增确认页）
→ 提交订单成功后显示：

```
┌─────────────────────────────────┐
│         ✅ Commande envoyée !    │
│                                 │
│        VOTRE NUMÉRO             │
│           C008                  │
│                                 │
│   💳 Veuillez payer au comptoir │
│   请到柜台刷卡付款               │
│                                 │
│   [ Nouvelle commande ]         │
└─────────────────────────────────┘
```

现金版显示：
```
│   💶 Veuillez payer en espèces  │
│      au comptoir                │
│   请到柜台现金付款               │
```

---

## 七、部署

1. push 到 GitHub
2. npm run deploy 部署前端
3. SSH 到 stand9 部署后端 + 重启服务
4. 测试：
   - #order 选"到店刷卡" → 提交 → 看到订单号 + 提示到柜台付款
   - #kitchen 看到订单 + "💳 待刷卡"标签
   - #admin Commandes → 点"确认收款" → 状态变为 paid
   - 打印小票和发票，付款方式显示正确

---

## 八、不要做

- 不改 #menu 预订功能
- 不改 Stancer 在线支付流程
- 不改 SMTP 邮件配置
- 不改现有已付款订单的数据
- 保持红色主题（#8B0000）
