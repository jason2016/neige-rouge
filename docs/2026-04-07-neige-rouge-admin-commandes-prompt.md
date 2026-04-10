# 任务：#admin 后台增加订单查看 + 小票/发票生成

## GitHub 仓库：jason2016/neige-rouge
## 后端：stand9（51.77.201.82）/opt/clawshow-mcp-server/

---

## 一、#admin 增加 Commandes Tab

在 #admin 管理后台（密码 neige2025）增加 tab 切换：

1. **"Réservations 预订"**（现有，默认）
2. **"Commandes 订单"**（新增）

### Commandes Tab 内容：

#### 汇总卡片（顶部）
- 今日订单数
- 今日总金额
- 待制作 / 已完成 数量

#### 订单列表
- 每行显示：订单号、菜品摘要、金额、支付状态、订单状态、下单时间
- 套餐显示选择详情（如：Menu A - Salade d'algues, Riz cantonais）
- 按日期筛选（默认今天）
- 支付状态标签：paid=绿色、unpaid=红色
- 订单状态标签：pending=黄色、ready=蓝色、picked=灰色

#### 数据来源
- 现有接口 GET /api/order/queue 可能只返回 pending/ready 状态
- 需要新增后端端点：

```
GET /api/order/history?namespace=neige-rouge&date=2026-04-07
```

返回指定日期的所有状态订单（包括 picked），支持参数：
- `namespace`（必填）
- `date`（可选，格式 YYYY-MM-DD，默认今天）
- `status`（可选，筛选特定状态）

---

## 二、小票生成（Ticket de caisse）

每个订单卡片增加 **"Ticket 小票"** 按钮，点击后弹出可打印的小票。

### 小票内容格式：

```
================================
       NEIGE ROUGE 红雪
  Cuisine Vietnamienne Authentique
  75 Rue Buffon, 75005 Paris
  Tél: 01 72 60 48 89
  SIRET: 82207280700016
================================
  Date: 07/04/2026  20:08
  Commande: C006
  Type: Sur place
--------------------------------
  Menu A ×1              7,50€
    Salade d'algues
    Riz cantonais
  Bò Bún boeuf ×2      21,00€
--------------------------------
  TOTAL                 28,50€
  Paiement: Carte (Stancer)
================================
     Merci de votre visite !
================================
```

### 实现方式：
- 点击"Ticket"按钮 → 弹出新窗口或弹窗，显示格式化的小票
- 提供"Imprimer 打印"按钮 → 调用 `window.print()`
- CSS `@media print` 样式：隐藏其他元素，只打印小票内容
- 小票宽度 80mm（热敏打印机标准）或 A4 自动适配

---

## 三、发票生成（Facture simplifiée）

每个订单卡片增加 **"Facture 发票"** 按钮，点击后弹出可打印的简易发票。

### 发票内容格式（符合法国法律要求）：

```
         FACTURE SIMPLIFIÉE
         N° F2026-0407-C006

NEIGE ROUGE
75 Rue Buffon, 75005 Paris
SIRET: 82207280700016
Tél: 01 72 60 48 89

Date: 07/04/2026

Désignation          Qté    Prix
---------------------------------
Menu A                1    7,50€
  Salade d'algues
  Riz cantonais
Bò Bún boeuf          2   21,00€
---------------------------------
Total HT                  25,91€
TVA 10%                    2,59€
Total TTC                 28,50€

Mode de paiement: Carte bancaire

Merci pour votre confiance.
```

### 实现方式：
- 和小票一样，弹出新窗口 + `window.print()`
- 发票编号格式：`F{年份}-{月日}-{订单号}`，如 F2026-0407-C006
- TVA 计算规则：
  - 堂食（sur_place）：TVA 10%，TTC = HT × 1.10
  - 外卖（emporter）：TVA 5.5%，TTC = HT × 1.055
- HT = TTC / (1 + TVA率)

---

## 四、餐厅信息配置

把餐厅信息提取为常量，前端共用，避免硬编码：

```javascript
const RESTAURANT_INFO = {
  name: "NEIGE ROUGE 红雪",
  subtitle: "Cuisine Vietnamienne Authentique",
  address: "75 Rue Buffon, 75005 Paris",
  phone: "01 72 60 48 89",
  siret: "82207280700016",
  tva_dine_in: 0.10,    // 堂食 TVA 10%
  tva_takeaway: 0.055   // 外卖 TVA 5.5%
};
```

---

## 五、部署

1. push 到 GitHub
2. `npm run deploy` 部署前端到 GitHub Pages
3. SSH 到 stand9 部署后端更新（新增 /api/order/history 端点）并重启：
   ```
   ssh root@51.77.201.82 "systemctl restart clawshow-mcp"
   ```
4. 验证：
   - 打开 #admin → 切换到 Commandes tab → 看到今天的订单
   - 点"Ticket" → 弹出小票 → 打印正常
   - 点"Facture" → 弹出发票 → TVA 计算正确

---

## 六、不要做

- 不改 #order 点餐流程
- 不改 #kitchen 后厨大屏
- 不改 #menu 预订功能
- 不改 Stancer 支付逻辑
- 不改 SMTP 邮件配置
- 保持红色主题（#8B0000）
