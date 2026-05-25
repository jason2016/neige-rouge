# Prompt: 红雪餐厅 PWA v2.3.0 - 自助点餐系统升级

> **Target**: VSCode Claude Code (Sonnet)  
> **Workspace**: neige-rouge PWA  
> **Namespace**: `neige-rouge`  
> **Source**: 2026-04-18 红雪老板演示收集的 9 个产品需求  
> **Created by**: Jason + Claude.ai (2026-04-18 evening)  
> **To be sent**: Monday 2026-04-21 morning (after Jason review)

---

## 📋 背景

2026-04-18 中午 12:00 Jason 给红雪老板演示 PWA v2.2.0。
老板明确表达"越简单越好，1人运营"的核心诉求。
演示结束时老板承诺申请 Stancer 账号，并要求 Jason 现场部署。

本次更新目标: 把 v2.2.0 升级为**真正可独立运营**的自助点餐系统。

**真实部署 Timeline**: Stancer 账户激活约 1-2 周，期间完成开发。

---

## ⚠️ 重要：先读战略文档

执行任何代码前，请先读取：

1. `CLAUDE.md` - 工作区入口上下文
2. `documents/decisions/STRATEGY_DECISIONS.md` - 战略决策
3. `documents/skills/restaurant-template-skill.md` - 餐厅模板经验
4. `documents/customers/neige-rouge.md` - 红雪客户档案

**关键战略约束**:
- 决策 #3: 不新增引擎（用现有 6 引擎）
- 决策 #4: 通用引擎原则（本次新功能必须可复用到其他餐厅）
- 决策 #27 (待加入): ClawShow = Stancer 增强层

**所有新功能必须能复用到龙城 + 未来餐厅客户。不做红雪专属代码。**

---

## 🎯 9 个核心需求（按优先级）

### 🔥 P0 必做 (MVP 核心)

#### 需求 #1: 每日库存管理 + 售罄自动提醒

**老板原话**: "每天设置备餐数量，如果备餐数量用完，自动提醒客户换餐，这个功能非常好"

**需求**:
- 每道菜可设定"每日备餐上限"
- 下单时实时扣减库存
- 库存为 0 时: 菜品变灰 + 不可点击 + 弹出"已售完，推荐试试 [其他菜]"
- 老板晨间简单界面: 一键设置今日数量，"一键恢复昨天数量"按钮
- 运营中老板可随时调整数量

**关键决策（待 Jason 确认）**:
```
Q: 是否显示剩余数量给客户？
A: 选项 C - 只显示"已售完"，不显示具体数字
   理由: 最简洁，避免老板被问"还剩几份"
```

**数据模型**:
```sql
-- menu_items 表增加字段
ALTER TABLE menu_items ADD COLUMN daily_stock_limit INTEGER DEFAULT NULL;
ALTER TABLE menu_items ADD COLUMN current_stock INTEGER DEFAULT NULL;
ALTER TABLE menu_items ADD COLUMN stock_reset_at TIMESTAMP DEFAULT NULL;
-- NULL = 不限量（例如饮料）

-- 每日库存快照表（便于老板回顾）
CREATE TABLE daily_stock_snapshots (
  id INTEGER PRIMARY KEY,
  namespace TEXT,
  menu_item_id INTEGER,
  date DATE,
  stock_limit INTEGER,
  sold_count INTEGER,
  created_at TIMESTAMP
);
```

**前端组件**:
- `MenuItemCard.jsx`: 售罄状态 UI
- `SoldOutModal.jsx`: 售罄推荐弹窗
- `OwnerStockManagement.jsx`: 老板设置界面（简单到老板能看懂）

**后端 API**:
- `POST /api/v1/inventory/set-daily-limit` - 设定每日上限
- `POST /api/v1/inventory/restore-yesterday` - 一键恢复昨天
- `POST /api/v1/inventory/adjust` - 运营中调整
- 现有 `manage_inventory` Tool 已有基础能力，扩展即可

---

#### 需求 #3: 隐藏预定功能（聚焦自助点餐）

**老板原话**: "先隐藏预定功能，先把到店客户自己点餐的功能跑通运营起来之后，再增加预定"

**执行**:
- 代码保留 `manage_bookings` 相关功能
- PWA 导航栏去掉"预定"tab
- 首页去掉"预定"CTA
- 只保留"菜单 / 下单 / 我的订单"

**实现方式**:
```javascript
// config/features.js
export const FEATURES = {
  'neige-rouge': {
    menu: true,
    orders: true,
    bookings: false,  // 隐藏预定
    // ...
  },
  'dragons-elysees': {
    menu: true,
    orders: true,
    bookings: true,  // 龙城保留预定
    // ...
  }
};
```

→ 功能开关应用到 Navigation, HomePage, Footer 所有位置

---

#### 需求 #5: 菜品定制选项（辣度等）

**老板原话**: "Banh Mi 做的最多，需要增加辣或不辣的选择"

**需求**:
- 菜品可配置必选选项（辣度、口味等）
- 必选未选不能加入购物车
- 购物车显示选项
- 订单详情显示选项给老板

**数据模型**:
```sql
-- menu_items 表增加 options 字段
ALTER TABLE menu_items ADD COLUMN options JSON DEFAULT NULL;

-- options 格式示例 (Banh Mi):
{
  "options": [
    {
      "name_fr": "Piquant",
      "name_zh": "辣度",
      "type": "single_select",
      "required": true,
      "choices": [
        {"value": "no_spicy", "label_fr": "Non piquant", "label_zh": "不辣"},
        {"value": "mild", "label_fr": "Peu piquant", "label_zh": "微辣"},
        {"value": "medium", "label_fr": "Piquant", "label_zh": "正常辣"},
        {"value": "extra", "label_fr": "Très piquant", "label_zh": "加辣"}
      ]
    }
  ]
}
```

**前端组件**:
- `MenuItemOptionsModal.jsx`: 选项选择弹窗
- `CartItem.jsx`: 显示已选选项
- `OrderDetail.jsx`: 老板端显示客户选项

**扩展性**:
此选项系统必须支持 type = `single_select` 和未来的 `multi_select`，为需求 #6 饮料冰度做准备。

---

#### 需求 #6: 饮料菜单重做 + 冰度选项

**老板要求**:
```
DELETE:
  ❌ Mono Moko 系列所有饮料

ADD 奶茶类 (Thé au lait):
  - Coco (椰子奶茶)
  - Mangue (芒果奶茶)
  - Fraise (草莓奶茶)
  - Taro (芋头奶茶)

ADD 水果茶类 (Thé aux fruits):
  - Citron (柠檬茶)
  - Mangue (芒果茶)
  - Fraise (草莓茶)
  - Fruit de la passion (百香果茶)
  - Litchi (荔枝茶)

每种饮料必选选项:
  - 冰度: 加冰 (Avec glaçons) / 不加冰 (Sans glaçons)
```

**实现**:
1. 数据库 SQL 脚本删除 Mono Moko 系列
2. 插入 9 个新饮料菜品
3. 每个饮料配置冰度必选选项（复用需求 #5 的选项系统）
4. 添加饮料子分类 (milk_tea / fruit_tea)

**待问老板（Jason 后续确认）**:
- 每种饮料的具体价格
- 是否需要珍珠/椰果等加料选项
- 是否需要糖度选择

**SQL 脚本模板**:
```sql
-- 在 documents/prompts/ 中提供完整 SQL
-- Claude Code 按模板实现
```

---

#### 需求 #7: 后厨大屏支付确认流程

**老板原话**: "客户点餐后如果选择转账或现金，不在手机付款，点餐会显示在大屏左边，显示没有付款，但可以直接点击 terminer，需要增加一个控制按钮：确认已付款，只有客户付款后点击确认，terminer 才能激活"

**核心问题**: 防止未收款订单被误标记为完成。

**订单状态机**:
```
Online Payment (Stancer):
  created → (auto webhook) paid → completable → completed

Cash / Bank Transfer:
  created → pending_payment → 
    (owner clicks "确认已付款") → 
    paid → completable → completed
```

**数据模型**:
```sql
ALTER TABLE orders ADD COLUMN payment_method TEXT 
  CHECK(payment_method IN ('online_stancer', 'cash', 'bank_transfer', 'card_offline'));
ALTER TABLE orders ADD COLUMN payment_status TEXT 
  CHECK(payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP DEFAULT NULL;
ALTER TABLE orders ADD COLUMN paid_confirmed_by TEXT DEFAULT NULL;
```

**大屏订单卡片 UI**:

未付款状态:
```
┌─────────────────────────────┐
│ 订单 #1234   🔴 未付款       │
│ 2x Banh Mi 辣                │
│ 1x Coco 奶茶 加冰             │
│ 付款方式: 💵 现金             │
│ 总计: €15.50                │
│                              │
│ [✅ 确认已付款] ← 突出显示    │
│ [Terminer] ← 灰色禁用         │
└─────────────────────────────┘
```

已付款状态:
```
┌─────────────────────────────┐
│ 订单 #1234   🟢 已付款       │
│ [✓] Terminer ← 可点击         │
└─────────────────────────────┘
```

**后端校验（必须）**:
```python
@app.post("/orders/{id}/complete")
def complete_order(id):
    order = get_order(id)
    if order.payment_status != 'paid':
        raise HTTPException(400, "Order must be paid before completion")
    # ... 完成订单
```

**审计日志**:
每次"确认已付款"操作记录: 操作人, 时间, 订单号, 金额。

---

#### 需求 #8: 双屏部署架构

**老板场景**:
- 设备 A: 老板手边（收银台）- 显示大屏 + 确认付款 + terminer
- 设备 B: 工作台（厨房）- 显示订单详情给厨师备餐

**技术需求**:
1. PWA 支持多个设备同时登录同一 namespace
2. 实时订单同步（解决老板反映的"几十秒延迟"问题）
3. 设备角色区分（kitchen_display vs work_station）

**实时推送优化**:
```
当前: 可能是 HTTP polling，延迟高
优化方案 (选 A 或 B):
  A. 短轮询: 3-5 秒拉一次 (快速上线，易实现)
  B. WebSocket: 真实时 (< 1s) 但开发成本高

推荐: 先 A，稳定后升级 B
```

**设备角色设计**:
```javascript
// URL 参数区分角色
/kitchen         → 后厨大屏模式（A 设备）
/work-station    → 工作台模式（B 设备，显示订单详情）
/orders          → 订单列表（通用）
```

**硬件推荐文档**:
- 创建: `documents/customers/neige-rouge-hardware-setup.md`
- 内容: 2 × iPad + 充电线 + 支架 + WiFi 优化建议
- Jason 可直接分享给老板

---

#### 需求 #9: Stancer Terminal 集成（Phase 1 手动 + Phase 2 自动）

**老板原话**: "Stancer 有刷卡终端，每月 150 次交易就没有租金，比银行终端好。如果没有 webhook，PWA 能否也对终端记账？"

**Phase 1 (MVP, 手动确认)**:
- PWA 下单选择"桌面刷卡"
- 生成待付款订单
- 客户在 Stancer Terminal 刷卡
- 老板在大屏点击"确认已付款"（复用需求 #7）
- 订单状态更新

**Phase 2 (调研后自动化)**:
```
Claude Code 调研任务（单独 Prompt，本 sprint 不做）:

任务名: Stancer Terminal Capability Research
  - Stancer Terminal 有 Webhook 吗?
  - Stancer Terminal 有 Transaction Query API 吗?
  - 如果都没有，有 CSV 导出 API 吗?
  - 是否可通过时间+金额匹配自动对账?

输出: documents/reference/2026-04-XX-stancer-terminal-research.md
```

**PWA 支付选项 UI**:
```
┌──────────────────────────────────────┐
│  请选择付款方式                        │
│                                      │
│  📱 Apple Pay  (Stancer)             │
│  📱 Google Pay (Stancer)             │
│  💳 输入卡号   (Stancer)             │
│  💳 桌面刷卡   (Stancer Terminal)     │
│     → 提示: 请在桌面刷卡机支付         │
│  💵 现金                              │
│     → 提示: 请到前台支付               │
└──────────────────────────────────────┘
```

---

### 🟡 P1 重要（本 sprint 做）

#### 需求 #2: Stancer 统一对账 + 日报

**功能**: 每日晚上生成对账报告（所有支付方式汇总）。

**报告示例**:
```
2026-04-18 红雪营业日报
─────────────────────
订单总数: 45
订单总额: €687.50

按支付方式:
  Apple Pay:       €180.00 (12 笔)
  Google Pay:      €140.00 (9 笔)
  桌面刷卡:        €282.50 (20 笔)
  现金:            €85.00 (4 笔)

状态:
  ✅ 已对账
```

**实现**:
- 使用现有 `generate_report` Tool
- 老板在 Dashboard 点"一键生成日报"
- 发送到老板邮箱 / 生成 PDF

---

### 🟢 P2 延后（本 sprint 不做）

#### 需求 #4: 按需 PDF 发票
- 客户下单后可选"索要发票"
- 生成 PDF 发到邮箱
- 不默认生成

**延后原因**: 老板说学生/老师多数不需要发票。Phase 2 做。

---

## 🏗️ 技术实现指南

### 文件结构
```
repos/neige-rouge-pwa/src/
├── components/
│   ├── menu/
│   │   ├── MenuItemCard.jsx         # 新增售罄状态
│   │   ├── MenuItemOptionsModal.jsx # 新增选项选择
│   │   └── SoldOutModal.jsx         # 新增售罄推荐
│   ├── cart/
│   │   └── CartItem.jsx              # 修改: 显示选项
│   ├── checkout/
│   │   └── PaymentMethodSelector.jsx # 新增: 支付方式选择
│   ├── kitchen-display/
│   │   ├── OrderCard.jsx             # 修改: 付款确认按钮
│   │   └── OrderStatusBadge.jsx      # 新增: 红/绿状态
│   └── owner/
│       └── StockManagement.jsx       # 新增: 库存管理页
├── config/
│   └── features.js                   # 新增: 功能开关
└── pages/
    ├── kitchen.jsx                    # 大屏页面
    └── work-station.jsx               # 工作台页面
```

### 通用化约束（重要）

**每个新组件必须接受 namespace 参数**，不硬编码"neige-rouge"。

例如:
```javascript
// ❌ 错误
const OPTIONS = neige_rouge_specific_options;

// ✅ 正确
const OPTIONS = await fetch(`/api/v1/menu/options?namespace=${namespace}`);
```

**数据库 migration 必须 namespace 隔离**，每个客户独立。

---

## 📋 开发顺序（按优先级）

### Week 1 (4/21 - 4/25)
1. 功能开关系统（#3 隐藏预定）- 0.5 天
2. 菜品选项系统（#5 辣度）- 1.5 天
3. 饮料菜单重做（#6）- 1 天
4. 数据库 migration 测试 - 0.5 天

### Week 2 (4/28 - 5/2)
5. 每日库存管理（#1）- 2 天
6. 后厨大屏支付流程（#7）- 2 天
7. 老板库存管理界面（简单版）- 1 天

### Week 3 (5/5 - 5/9)
8. 双屏部署架构（#8）- 1.5 天
9. Stancer Terminal Phase 1 集成（#9 手动）- 1.5 天
10. 日报对账（#2）- 1 天
11. 测试 + Bug 修复 - 1 天

### Deployment Day (TBD, 老板确认后)
12. Jason 上门部署 - 半天

---

## 🧪 测试要求

### 每个功能必须测试
- 边界情况（库存为 0, 选项未选, 并发下单）
- 错误处理（网络中断后如何恢复）
- 权限（只有老板能设置库存, 确认付款等）

### 测试数据
- 使用 `neige-rouge-test` namespace 做开发测试
- 不要污染 `neige-rouge` 生产数据

### 集成测试
- 完整流程: 下单 → 选选项 → 付款 → 大屏显示 → 确认付款 → terminer
- 售罄流程: 库存耗尽 → 推荐替代 → 客户换菜
- 双屏流程: A 设备确认, B 设备同步

---

## 📤 交付物

### 代码
- [ ] PR 合并到 neige-rouge-pwa main 分支
- [ ] Git tag: `v2.3.0`
- [ ] 部署到生产: `neige-rouge.clawshow.ai`

### 文档
- [ ] 更新 `documents/customers/neige-rouge.md`
- [ ] 更新 `documents/skills/restaurant-template-skill.md`
- [ ] 新增 `documents/customers/neige-rouge-hardware-setup.md`
- [ ] Release notes: `CHANGELOG.md`

### 对 Stancer Terminal 调研
- [ ] 单独发 Prompt（本 sprint 不做）
- [ ] 输出: `documents/reference/stancer-terminal-research.md`

### 更新 STRATEGY_DECISIONS.md
Claude.ai 层面需要添加决策 #27 (ClawShow = Stancer 增强层)，本 Prompt 不涉及。

---

## ⚠️ 禁止事项

1. ❌ 不新增 MCP 引擎（决策 #3）
2. ❌ 不为红雪写专属 API（决策 #4, 必须通用）
3. ❌ 不硬编码 namespace = "neige-rouge"
4. ❌ 不破坏龙城现有功能（龙城保留预定等功能）
5. ❌ 不在 neige-rouge 生产 namespace 做测试

---

## 📞 联系方式

遇到战略级问题停下来问 Jason:
- STRATEGY_DECISIONS.md 冲突 → 立刻询问
- 数据库 migration 不确定 → 立刻询问
- API 设计方向不确定 → 立刻询问

战术细节可自主决定:
- UI 细节
- 变量命名
- 代码组织

---

## 🎯 成功标准

本 sprint 完成后:
- ✅ 9 个需求中 7 个实现（P0 + P1）
- ✅ v2.3.0 部署到生产
- ✅ 所有新代码可复用到龙城/未来餐厅
- ✅ 老板上门部署时 PWA 已就绪
- ✅ 不需要 Stancer Terminal 硬件即可演示完整流程（手动确认付款模式）

---

## 📅 重要 Timeline

```
2026-04-21 (周一): Jason review + 发 Prompt
2026-04-21 ~ 05-09: Claude Code 开发 (3 周)
等老板 Stancer 激活 (1-2 周)
老板预约客人少时间 → Jason 上门部署
```

---

**END OF PROMPT**

**Note to Claude.ai (Jason review 时)**:
- 检查 9 个需求是否都覆盖
- 检查优先级是否符合 "越简单越好" 原则
- 检查是否遗漏关键战略约束
- Jason 可直接把此 Prompt 发给 VSCode Claude Code
