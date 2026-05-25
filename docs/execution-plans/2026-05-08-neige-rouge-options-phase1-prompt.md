# 雪红选项功能实施 Phase 1: Menu F 春卷 + Soupe de Raviolis 辣度

**日期**: 2026-05-08 周五晚
**优先级**: 🟡 中 (今晚 ship 最好, 陈老板周末看效果)
**Repo**: `github.com/jason2016/neige-rouge`
**本地路径**: `C:\Users\luqia\OneDrive\Development\Customers\neige-rouge`
**预期工时**: 60-90 分钟

---

## 任务背景

陈老板今天 (2026-05-08) 现场反馈, Jason 跟陈老板确认后决定:

- **选项必选, 价格相同**
- **后厨大屏必须显示客户选的选项** (厨师不需要询问客户)
- **这次只做 2 个菜的选项, 其他菜以后再说**

### ⚠️ 重要发现 (从 Jason 截图分析)

现有客户 PWA 已经有"Personnaliser →"选项系统 + 分步选择器:
- Menu F 已用 1/2 PLAT PRINCIPAL 单选模式 (Nems poulet / Raviolis / Papillotes)
- **不需要重做选项框架, 只需补全数据 + 复用 UI**

文字修改 (commit 701527b) 已完成:
- Menu F desc: "3 Nems Poulet ou 3 Nems Légumes ou 3 raviolis..."
- Soupe de Raviolis name: "Soupe de Raviolis (piquant ou non piquant)"

**但 UI 上还没有真正让客户做选择, 现在做**.

---

## 修改清单 (只做这 3 项)

### 修改 1: Menu F 第 1 步 (PLAT PRINCIPAL) 加 Légumes 选项

**类别**: Bento (套餐类)

**现状**: 客户点 Menu F 后, 第 1 步 PLAT PRINCIPAL · 1/2 显示 3 个选项 (单选必选):
- 3 Nems poulet
- 3 Raviolis
- 2 Papillotes de crevettes

**改为 4 个选项** (单选必选, 价格相同):
- 3 Nems Poulet           (注意: Poulet 改成大写 P)
- 3 Nems Légumes          ⬅ 新增 (Légumes 复数加 s)
- 3 Raviolis
- 2 Papillotes de crevettes

**中文对照同步**:
- 3 个鸡肉春卷
- 3 个蔬菜春卷             ⬅ 新增
- 3 个饺子
- 2 个虾饺

⚠️ **Menu F 不需要加 piquant 选项. piquant 跟 Menu F 无关**.

### 修改 2: Soupe de Raviolis (Plats 类) 加辣度选项

**类别**: Plats (单点菜类, 跟 Loc Lac / Curry Cheese 同列表)

**现状**:
- 菜名后已显示 "(piquant ou non piquant)" 文字 ✅ (今天上一轮已修)
- 但客户点 [+] 加购时直接进购物车, 没弹选项让客户选
- 后厨完全不知道客户要辣还是不辣

**改为**:
- 客户点 [+] → 弹出选项弹窗 (复用 Menu F 的 Personnaliser 分步选择器 UI, 不要新写)
- Step 1 标题: "NIVEAU DE PIQUANT" (法) / "辣度" (中)
- 单选必选 (不选不能加购):
  * Piquant       (辣)
  * Non piquant   (不辣)
- 选完点确认 → 加入购物车
- 价格不变 (10€)
- 购物车 line item 显示: "Soupe de Raviolis · Piquant" 或 "Soupe de Raviolis · Non piquant"

**UI 风格必须复用 Menu F 已有的步骤式选择器** (1/1 NIVEAU DE PIQUANT 标题 + 选项列表 + 单选高亮), 跟现有 Personnaliser 视觉一致.

⚠️ **不要给其他 Plats (Loc Lac / Curry Cheese Poulet Croustillant / Poulet Citronnelle) 加 piquant 选项. 这次只动 Soupe de Raviolis**.

### 修改 3: 后厨大屏订单卡显示客户选项 ⭐ 核心价值

陈老板原话: "完成后厨房不需要和客户沟通, 就知道客户的所有选择可能项".

**现状后厨大屏卡片** (kitchen.html):

```
┌──────────────────────┐
│ C001  11.00€         │
│ Menu F ×1            │
│ Porc caramel · Riz   │
│ [Encaisser]          │
└──────────────────────┘
```

**改为显示客户的选项**:

```
┌──────────────────────────────┐
│ C001  11.00€                 │
│ Menu F ×1                    │
│ ⭐ 3 Nems Légumes             │  ← 客户选项 (高亮显示)
│ Porc caramel · Riz           │
│ [Encaisser]                  │
└──────────────────────────────┘
```

如果客户多个菜都有选项, 比如 Menu F + Soupe de Raviolis:

```
┌──────────────────────────────┐
│ C002  21.00€                 │
│ Menu F ×1                    │
│ ⭐ 3 Nems Légumes             │
│ Porc caramel · Riz           │
│ ─────────────────            │
│ Soupe de Raviolis ×1         │
│ ⭐ Piquant                    │
│ [Encaisser]                  │
└──────────────────────────────┘
```

**显示规则**:
- 客户选了选项 → 显示在该菜品名下方
- 用 emoji ⭐ (或类似视觉标记) + 颜色 (黄色/橙色) 让厨师一眼看到
- 字号跟菜品详情一致 (老花眼能读, 至少 text-lg)
- 多个菜有选项 → 各自分组显示, 不混淆
- 没选项的菜 → 跟现在一样, 不显示空选项行

**管理后台 (admin.html) 同样显示**:
- Commandes tab 订单详情含选项
- Réservations tab 如有预订订单也含选项

---

## 数据结构建议

如果现有 menu data 已有 personnaliser / options / steps 字段:
- 直接复用结构, 在 Menu F 选项数组加 Légumes
- Soupe de Raviolis 加 options 配置

如果没有统一的 options 结构, 给 menu item 加 options 字段:

```json
{
  "name": "Soupe de Raviolis",
  "name_zh": "抄手汤",
  "category": "Plats",
  "price": 10.00,
  "options": [
    {
      "step": 1,
      "label_fr": "Niveau de piquant",
      "label_zh": "辣度",
      "required": true,
      "type": "single",
      "choices": [
        {"value": "piquant", "label_fr": "Piquant", "label_zh": "辣"},
        {"value": "non_piquant", "label_fr": "Non piquant", "label_zh": "不辣"}
      ]
    }
  ]
}
```

订单存储 (line_item) 含 selected_options:

```json
{
  "menu_item_name": "Soupe de Raviolis",
  "menu_item_name_zh": "抄手汤",
  "qty": 1,
  "price": 10.00,
  "selected_options": [
    {
      "label_fr": "Piquant",
      "label_zh": "辣"
    }
  ]
}
```

后厨大屏 + 管理后台从 `selected_options` 读取并渲染.

---

## 法语严格拼写规则 ⚠️

### ✅ 正确

- `3 Nems Poulet`          (Poulet 大写, 单数)
- `3 Nems Légumes`         (Légumes 复数加 s)
- `Piquant`                (作为 label, P 大写, 末尾有 t)
- `Non piquant`            (中间空格, p 小写)
- `Soupe de Raviolis`      (R 大写)

### ❌ 错误 (绝不要)

- `Nems Légume`            (缺 s)
- `piquan`                 (缺 t)
- `nonpiquant`             (没空格)
- `Nems poulet`            (poulet 应大写)

---

## ❌ 不要做的事

- 不给 Menu F 加 piquant 选项 (Menu F 跟辣度无关)
- 不给其他 Plats (Loc Lac / Curry Cheese / Poulet Citronnelle) 加 piquant
- 不动其他 Menu (A/B/C/D/E)
- 不动 Banh Mi / Bubble Tea (除非已有选项要保留)
- 不动 PWA 架构 (manifest / SW / 多入口)
- 不改菜单价格
- 不重新发明选项 UI (复用现有 Personnaliser 模式, 跟 Menu F 步骤式选择器视觉完全一致)
- 不改主题色 / 图标 / 名字

---

## ✅ 一定做的事

- Menu F 加 Légumes 选项 (4 选 1 单选必选)
- Soupe de Raviolis 加 Piquant/Non piquant 弹窗 (2 选 1 单选必选)
- 客户不选不能加购 (required validation)
- 后厨大屏卡片显示客户选项 (高亮 + 醒目, 老花眼可读)
- 管理后台订单详情显示选项
- 中法对照同步
- 法语拼写严格按上面规则

---

## 实施前确认 (重要) ⚠️

**在开始改代码前, 先回报 Jason 确认你的实施计划**:

```
1. Menu F: 加 "3 Nems Légumes" 作为第 4 个选项 (Y/N)
2. Menu F: 不加 piquant 选项 (Y/N)
3. Soupe de Raviolis: 加 Piquant/Non piquant 弹窗选项 (Y/N)
4. 其他 Plats (Loc Lac/Curry Cheese/Poulet Citronnelle): 不加任何选项 (Y/N)
5. 后厨大屏卡片: 显示客户选的选项 (高亮) (Y/N)
6. 管理后台订单详情: 显示选项 (Y/N)
7. 复用现有 Personnaliser UI, 不重新写组件 (Y/N)
```

**Jason 回 "Go" 才开工**.

---

## 测试

### 本地测试

1. `npm run dev`

2. **客户 PWA 测试**:

   **测 Menu F**:
   - [ ] 找 Bento → Menu F
   - [ ] 点 [+] → 弹出第 1 步 PLAT PRINCIPAL · 1/4 (现在 4 选项)
   - [ ] 看到 "3 Nems Poulet" / "3 Nems Légumes" / "3 Raviolis" / "2 Papillotes" 4 个选项
   - [ ] 不选试图下一步 → 应该被阻止 (required)
   - [ ] 选 "3 Nems Légumes" → 进第 2 步 (主菜+主食)
   - [ ] 完成所有步骤 → 加入购物车
   - [ ] 购物车显示 "Menu F" + 选项标签 (3 Nems Légumes + 主菜 + 主食)

   **测 Soupe de Raviolis**:
   - [ ] 找 Plats → Soupe de Raviolis
   - [ ] 菜名显示 "(piquant ou non piquant)" ✅ (已存在)
   - [ ] 点 [+] → 弹出辣度选择 (Piquant / Non piquant)
   - [ ] 不选试图加购 → 应该被阻止
   - [ ] 选 "Piquant" → 加入购物车
   - [ ] 购物车显示 "Soupe de Raviolis · Piquant"

   **测其他 Plats (确认没误改)**:
   - [ ] Loc Lac 点 [+] → 直接加购 (没弹窗) ✅
   - [ ] Curry Cheese 点 [+] → 直接加购 ✅
   - [ ] Poulet Citronnelle 点 [+] → 直接加购 ✅

3. **提交订单 → 切 kitchen.html 后厨大屏**:
   - [ ] 看到刚才的订单卡
   - [ ] Menu F 下方显示 "⭐ 3 Nems Légumes" (高亮)
   - [ ] Soupe de Raviolis 下方显示 "⭐ Piquant" (高亮)
   - [ ] 字号大 (老花眼可读), 1 米外清晰
   - [ ] 没选项的菜 (Loc Lac 等) 不显示空选项行

4. **切 admin.html 管理后台**:
   - [ ] Commandes tab → 看到这单
   - [ ] 点订单详情 → 显示选项
   - [ ] 跟后厨大屏一致

---

## 部署 (严格按协议)

```bash
# 1. 本地 build 零警告
npm run build

# 2. 本地 preview 验证 3 个 PWA 入口
npm run preview
# 浏览器: http://localhost:4173/neige-rouge/                (客户)
# 浏览器: http://localhost:4173/neige-rouge/kitchen.html    (后厨)
# 浏览器: http://localhost:4173/neige-rouge/admin.html      (管理)

# 3. git diff 确认改动范围
git diff

# 4. Commit
git add -A
git commit -m "feat(menu): add required options for Menu F (Nems Légumes) + Soupe de Raviolis (Piquant/Non piquant)

Per Chen Laoban (owner) decisions on 2026-05-08:
- Options are required (single-select), price unchanged
- Customer must select before adding to cart
- Kitchen display shows selected options so chef knows what to prepare
- Admin order detail also shows options

Implementation:
- Menu F step 1 (PLAT PRINCIPAL): add '3 Nems Légumes' as 4th choice
- Soupe de Raviolis (Plats): add Piquant/Non piquant required step (reuse Personnaliser UI)
- Kitchen order card: show selected_options under each menu item with visual highlight
- Admin order detail: show selected_options
- Order data model: line_item.selected_options[]

Reuses existing Menu F Personnaliser step-selector UI for consistency.

Other menu items (Menu A/B/C/D/E, other Plats, Banh Mi, etc.) unchanged this round.
Phase 2 to be discussed after owner tests these in production this weekend.
"

# 5. Push
git push origin main

# 6. Deploy
npm run deploy

# 7. 验证 gh-pages
git log gh-pages --oneline -3
```

---

## 部署后报告格式

```
✅ 雪红选项功能 Phase 1 完成

改动文件:
- src/data/menu.json (或对应路径) — Menu F + Soupe de Raviolis 选项配置
- src/components/Personnaliser/* — 如有微调
- src/components/Cart/* — 显示选项标签
- src/components/Kitchen/* — 大屏卡片显示选项 (高亮)
- src/components/Admin/* — 订单详情显示选项

部署:
- gh-pages commit: <hash>
- 部署时间: <timestamp>
- build: 零警告

验证截图 (附):
- 客户 PWA: Menu F 4 选项页面
- 客户 PWA: Soupe de Raviolis 辣度选项弹窗
- 客户 PWA: 购物车含选项标签
- 后厨大屏: 订单卡含选项 (高亮)
- 管理后台: 订单详情含选项

测试通过:
[ ] Menu F 加 Légumes 选项
[ ] Soupe de Raviolis 弹辣度选项
[ ] 不选不能加购 (validation)
[ ] 后厨大屏显示选项
[ ] 管理后台显示选项
[ ] 其他菜未误改
```

---

## 时间预算

预期 60-90 分钟 (含选项数据 + UI 微调 + 后厨显示 + 测试 + 部署).

如果发现现有 Personnaliser 架构跟描述不同 (比如选项数据结构差异大), **立刻反馈 Jason 让他确认方案, 不要硬写**.

---

## 优先级

🟡 中. 不紧急, 但今晚周五 ship 最好 (陈老板周末看效果, 周一现场反馈调整).

如果遇到需要 1+ 小时决策的复杂改动, 先反馈 Jason, 不要硬撑.

---

## 部署后用户操作

陈老板/客户的 PWA 自动更新 (network-first SW), 关闭重开即可看到新版.

如果陈老板手机看不到新版 (小米 PWA 缓存问题已知):
- 关闭 PWA → 重新打开
- 或下拉刷新
- 终极: 卸载 PWA + 清 Chrome 数据 + 重装

---

## 联系

- 实施前先回报 Jason 7 个 Y/N 确认
- 执行中遇到任何模糊点立刻反馈, 不要假设

---

**END OF PROMPT**
