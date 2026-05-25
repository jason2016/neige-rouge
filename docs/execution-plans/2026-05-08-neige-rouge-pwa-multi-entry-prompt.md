# 雪红 PWA 多入口拆分: 新增后厨 PWA + 管理 PWA

**日期**: 2026-05-08 周五 (周末执行)
**优先级**: 🟡 中 (本周内完成, 5/12 周一上线)
**Repo**: `github.com/jason2016/neige-rouge`
**本地路径**: `C:\Users\luqia\OneDrive\Development\Customers\neige-rouge`
**预期工时**: 5-6 小时 (周末分散完成)

---

## 任务背景

### 现状
- 雪红已有 1 个 PWA = 客户点餐 app (已上线, 陈老板手机已装)
- URL: `jason2016.github.io/neige-rouge/` → 桌面图标 "雪红" 全屏打开
- 现状客户 PWA **不动**, 完全保留

### 目标
新增 2 个独立 PWA, 复用同一个 codebase, 不破坏现有客户 PWA:

| PWA | URL | 用户 | 设备 |
|---|---|---|---|
| ✅ 雪红 (客户) | `/neige-rouge/` | 客户/熟客 | 手机 (已有, 不动) |
| ⬅ 雪红后厨 | `/neige-rouge/kitchen.html` | 厨房/服务员 | iPad 横屏常驻 |
| ⬅ 雪红管理 | `/neige-rouge/admin.html` | 老板 | 手机 |

### 用户场景

**雪红后厨 PWA**:
- iPad 装在桌面图标 "雪红后厨" (蓝色 / 厨师帽)
- 点开全屏显示订单流水 (现 `#kitchen` 内容)
- 整天常驻不关
- 密码 `kitchen2025` (现状不变)

**雪红管理 PWA**:
- 老板 iPhone 装在桌面图标 "雪红管理" (黄黑 / 餐厅 logo 变体)
- 点开全屏显示管理后台 (现 `#admin` 内容, 含 Réservations + Commandes 两个 tab)
- 老板每天多次打开看预订/订单/收银
- 密码 `neige2025` (现状不变)

---

## 技术方案: vite 多入口

### 文件结构变更

```
neige-rouge/
├── public/
│   ├── icons/                       ✅ 现有客户 icons (不动)
│   ├── icons-kitchen/                ⬅ 新加
│   │   ├── icon-72.png
│   │   ├── icon-96.png
│   │   ├── icon-128.png
│   │   ├── icon-144.png
│   │   ├── icon-152.png
│   │   ├── icon-192.png
│   │   ├── icon-384.png
│   │   ├── icon-512.png
│   │   └── icon-maskable-512.png
│   ├── icons-admin/                  ⬅ 新加 (同样 9 个尺寸)
│   ├── manifest.json                 ✅ 现有客户 (不动)
│   ├── manifest-kitchen.json         ⬅ 新加
│   └── manifest-admin.json           ⬅ 新加
├── src/
│   ├── entries/                      ⬅ 新建文件夹
│   │   ├── kitchen.tsx               ⬅ 新加 (后厨入口)
│   │   └── admin.tsx                 ⬅ 新加 (管理入口)
│   ├── main.tsx                      ✅ 现有客户入口 (不动)
│   ├── App.tsx                       ✅ 现有 (按需调整路由)
│   └── ...
├── index.html                        ✅ 现有客户 HTML (不动)
├── kitchen.html                      ⬅ 新加
├── admin.html                        ⬅ 新加
├── vite.config.ts                    修改 (多入口 + PWA 配置)
└── package.json                      修改 (build 脚本)
```

---

## 详细实施步骤

### Step 1: 准备图标 (30 min)

#### 雪红后厨图标设计原则
- 主色: **深蓝 #1E40AF** (区别客户 PWA 的红黄主题)
- 元素: 厨师帽 emoji 风格 / 简化锅铲图标
- 文字: 可选加 "后厨" 或 "Cuisine"
- 风格: 扁平, 圆角矩形

#### 雪红管理图标设计原则
- 主色: **黑底 + 金色** (高级感, 老板视角)
- 元素: 雪红 logo 变体 + 齿轮小图标 (右下角)
- 文字: 可选加 "管理" 或 "Admin"
- 风格: 跟客户 PWA 同源但有别

#### 实施
- 用 PWA Builder (https://pwabuilder.com) 或 Figma 生成 9 个尺寸 PNG
- 或临时用 emoji + 纯色背景, Claude Code 用 sharp / canvas 生成
- **临时方案** (周末快速): 直接用 emoji 渲染 PNG
  - 后厨: 🧑‍🍳 + 蓝色背景
  - 管理: 👔 + 黑金背景
- 生产方案 (5/12 之前): 找设计师做正式 logo

### Step 2: 创建 manifest 文件 (15 min)

#### `public/manifest-kitchen.json`

```json
{
  "name": "雪红后厨 Neige Cuisine",
  "short_name": "雪红后厨",
  "description": "雪红餐厅后厨大屏",
  "start_url": "/neige-rouge/kitchen.html",
  "scope": "/neige-rouge/kitchen.html",
  "display": "standalone",
  "orientation": "landscape",
  "background_color": "#1F2937",
  "theme_color": "#1E40AF",
  "icons": [
    {
      "src": "/neige-rouge/icons-kitchen/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/neige-rouge/icons-kitchen/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/neige-rouge/icons-kitchen/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

#### `public/manifest-admin.json`

```json
{
  "name": "雪红管理 Neige Admin",
  "short_name": "雪红管理",
  "description": "雪红餐厅管理后台",
  "start_url": "/neige-rouge/admin.html",
  "scope": "/neige-rouge/admin.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#000000",
  "theme_color": "#FACC15",
  "icons": [
    {
      "src": "/neige-rouge/icons-admin/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/neige-rouge/icons-admin/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/neige-rouge/icons-admin/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### Step 3: 创建 HTML 入口 (15 min)

#### `kitchen.html` (项目根目录)

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
    <meta name="theme-color" content="#1E40AF" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="雪红后厨" />
    <link rel="manifest" href="/neige-rouge/manifest-kitchen.json" />
    <link rel="apple-touch-icon" href="/neige-rouge/icons-kitchen/icon-192.png" />
    <link rel="icon" type="image/png" href="/neige-rouge/icons-kitchen/icon-192.png" />
    <title>雪红后厨 · Cuisine</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/entries/kitchen.tsx"></script>
  </body>
</html>
```

#### `admin.html` (项目根目录)

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
    <meta name="theme-color" content="#FACC15" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="雪红管理" />
    <link rel="manifest" href="/neige-rouge/manifest-admin.json" />
    <link rel="apple-touch-icon" href="/neige-rouge/icons-admin/icon-192.png" />
    <link rel="icon" type="image/png" href="/neige-rouge/icons-admin/icon-192.png" />
    <title>雪红管理 · Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/entries/admin.tsx"></script>
  </body>
</html>
```

### Step 4: 创建入口 tsx (1.5 h)

#### `src/entries/kitchen.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import KitchenPage from '../pages/KitchenPage'; // 或现有的厨房组件路径
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KitchenPage />
  </React.StrictMode>
);
```

**重要**: 直接渲染 KitchenPage, **不用 React Router**, 因为这个 PWA 只显示厨房一个页面。

如果 KitchenPage 内部依赖 router context, 包一层 BrowserRouter 但只有一个 route。

#### `src/entries/admin.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPage from '../pages/AdminPage'; // 或现有的管理组件路径
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/neige-rouge">
      <Routes>
        {/* 直接挂 admin 页面, 内部有 Réservations / Commandes 两个 tab */}
        <Route path="/admin.html" element={<AdminPage />} />
        <Route path="*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

**注意**:
- 现有 KitchenPage / AdminPage 组件如果嵌在 App.tsx 路由里 (`#kitchen` / `#admin`), 需要**抽出来**作为独立可渲染组件
- 共享组件 (订单卡 / API client / 通用按钮) 继续用现有路径
- 现有客户 main.tsx + App.tsx **不动**

### Step 5: vite 配置多入口 (30 min)

#### 修改 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  base: '/neige-rouge/',
  plugins: [
    react(),
    // 客户 PWA (现有, 不动)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: '雪红 Neige Rouge',
        short_name: '雪红',
        // ... 现有配置不动
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        navigateFallback: null, // 重要: 不让 SW 拦截 kitchen.html / admin.html
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        kitchen: resolve(__dirname, 'kitchen.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
```

**关键点**:
- `rollupOptions.input` 三个入口
- vite-plugin-pwa 默认只处理 `index.html`, 客户 PWA 不变
- `navigateFallback: null` 防止 SW 把 kitchen.html / admin.html 路由错误重定向到 index.html
- kitchen.html / admin.html **不通过 vite-plugin-pwa 注入 SW** (它们的 manifest 在 HTML head 里手动写)

### Step 6: 调整客户 PWA 的 SW scope (15 min)

确认现有客户 manifest.json 的 `scope` 字段:

```json
{
  "scope": "/neige-rouge/",
  "start_url": "/neige-rouge/"
}
```

确认 SW 注册时 scope 是 `/neige-rouge/`, **不能是 `/neige-rouge/index.html`** (后者会拦截 kitchen.html / admin.html)。

但因为 kitchen.html 和 admin.html 也在 `/neige-rouge/` 路径下, 默认会被客户 SW 接管。

**解决方法**:
- 在 kitchen.html 和 admin.html 的 head 加:

```html
<script>
  // 阻止客户 SW 接管这两个入口
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => {
        if (reg.scope.includes('/neige-rouge/') && !reg.scope.endsWith('kitchen.html') && !reg.scope.endsWith('admin.html')) {
          // 不取消注册 (会破坏客户 PWA), 但 kitchen/admin 不走 SW
        }
      });
    });
  }
</script>
```

**简化方案** (推荐): 不给 kitchen / admin 注册 SW, 它们没离线需求 (后厨/管理都是常驻+在线场景), 反而避免 SW 缓存导致的更新延迟问题。

### Step 7: 测试 (1 h)

#### 本地测试

```bash
npm run build
npm run preview
```

测试矩阵:

| URL | 期望行为 | 验证 |
|---|---|---|
| `/neige-rouge/` | 客户 PWA, 显示 #menu | ✅ 现状不变 |
| `/neige-rouge/?table=5` | 客户 PWA, 显示 #order | ✅ 现状不变 |
| `/neige-rouge/kitchen.html` | 后厨页面, 蓝色 theme | ⬅ 新 |
| `/neige-rouge/admin.html` | 管理页面, 黄黑 theme | ⬅ 新 |

PWA 安装测试:

1. iPhone Safari 打开 `/neige-rouge/kitchen.html`
2. 分享 → "添加到主屏幕"
3. 桌面出现 "雪红后厨" 图标 (蓝色)
4. 点击 → 全屏打开 (无地址栏)
5. 标题显示 "雪红后厨"
6. 同样测 admin.html

回归测试 (确认客户 PWA 没坏):

1. iPhone 上**已装的**雪红 PWA 图标
2. 点开 → 仍然全屏 → 显示 #menu
3. 不能跳到 kitchen / admin (scope 隔离)

#### 关键验证点

- [ ] 客户 PWA 图标 + 名字 + theme 都没变
- [ ] 后厨 PWA 装到桌面图标显示 "雪红后厨" + 蓝色
- [ ] 管理 PWA 装到桌面图标显示 "雪红管理" + 黄黑
- [ ] 三个 PWA 装到同一台 iPhone 上, **三个独立图标共存**
- [ ] 点后厨图标只进后厨, 不会跳客户
- [ ] 点管理图标只进管理, 不会跳客户
- [ ] 客户 PWA 无回归 (现有功能完全正常)

### Step 8: 部署 (30 min)

```bash
# 本地 build 零错误
npm run build

# 检查 dist/ 输出
ls dist/
# 应该有: index.html, kitchen.html, admin.html, manifest*.json, icons-*/

# Preview 验证
npm run preview

# 浏览器手动验证 3 个 URL

# git diff 确认改动范围
git diff

# Commit
git add -A
git commit -m "feat: add kitchen + admin PWA with separate manifests

- public/manifest-kitchen.json + manifest-admin.json
- public/icons-kitchen/ + icons-admin/ (9 sizes each)
- kitchen.html + admin.html as new entry points
- src/entries/kitchen.tsx + admin.tsx
- vite.config.ts: multi-entry rollup config
- Customer PWA unchanged (regression-free)
"

# Push
git push origin main

# Deploy to gh-pages
npm run deploy

# 验证 gh-pages 分支
git log gh-pages --oneline -3
```

部署后线上验证:
- https://jason2016.github.io/neige-rouge/ → 客户 (不变)
- https://jason2016.github.io/neige-rouge/kitchen.html → 后厨 PWA
- https://jason2016.github.io/neige-rouge/admin.html → 管理 PWA

---

## 完成标准 (Definition of Done)

- [ ] 3 个 PWA 都能在 iPhone Safari 安装到桌面
- [ ] 3 个独立图标 + 独立名字 + 独立 theme 色
- [ ] 后厨 PWA 全屏显示, 标题 "雪红后厨"
- [ ] 管理 PWA 全屏显示, 标题 "雪红管理"
- [ ] 客户 PWA 完全无回归 (Jason 现场用陈老板手机验证)
- [ ] iPad 横屏装后厨 PWA, 默认 landscape orientation
- [ ] gh-pages 部署成功, 3 个 URL 都可访问
- [ ] 部署 commit hash 报告给 Jason

---

## 风险点 + 注意事项

### 风险 1: 客户 PWA 被破坏
**预防**:
- 不动 `index.html` / `main.tsx` / 现有 `manifest.json`
- vite-plugin-pwa 配置只处理客户入口
- kitchen / admin 不注册 SW
- 部署前必须本地 preview 验证客户 PWA 无回归

### 风险 2: SW scope 冲突
**症状**: 装了客户 PWA 后, 访问 kitchen.html 自动跳到 index.html
**解决**:
- kitchen.html / admin.html 不注册 SW
- 客户 SW 的 scope 限定 `/neige-rouge/` 但 navigateFallback 设为 null

### 风险 3: 路由 basename 错乱
**症状**: kitchen.html 内的链接跳到错误路径
**解决**:
- 如果用 BrowserRouter, basename 设为 `/neige-rouge`
- 或用 HashRouter 避免 basename 问题
- KitchenPage / AdminPage 内部导航尽量用相对路径

### 风险 4: 图标缓存
**症状**: 桌面装好的图标不更新
**解决**:
- manifest 和图标文件名不带 hash (固定路径)
- 用户重新装一次 (从桌面删除 + 重新添加)

---

## 时间线建议

```
周六 (5/9): 
  上午: Step 1 (图标) + Step 2 (manifest)
  下午: Step 3 (HTML) + Step 4 (entries)

周日 (5/10):
  上午: Step 5 (vite 配置) + Step 6 (SW scope)
  下午: Step 7 (测试) + Step 8 (部署)
  
周日晚: 报告 Jason

周一 (5/12):
  Jason 现场: 
    - iPad 装后厨 PWA
    - 陈老板手机装管理 PWA
    - 服务员手机装管理 PWA (按需)
```

如果周末时间紧 (Jason ClawShow P2 优先), 可推到下周一一天做完, 周二上线。

---

## 报告格式 (完成后回报 Jason)

```
✅ 雪红 PWA 多入口拆分完成

新增 2 个 PWA:
- 雪红后厨: https://jason2016.github.io/neige-rouge/kitchen.html
- 雪红管理: https://jason2016.github.io/neige-rouge/admin.html

客户 PWA 无回归:
- https://jason2016.github.io/neige-rouge/ (不变)

部署:
- gh-pages commit: <hash>
- 部署时间: <timestamp>
- build 零警告

验证截图 (附):
- iPhone 13 装 3 个 PWA 桌面截图
- 后厨 PWA 全屏运行截图
- 管理 PWA 全屏运行截图
- 客户 PWA 全屏运行截图 (回归验证)

下一步:
- Jason 5/12 现场给陈老板装 iPad 后厨 PWA
- Jason 5/12 现场给陈老板手机装管理 PWA
```

---

## 注意事项

### 不要做的事 ❌

1. **不要新建独立 repo** — 一个 repo 多入口足够
2. **不要拆 npm 包** — 共享组件直接 import 即可
3. **不要改客户 PWA 的任何代码** — 包括图标 / manifest / 主题色
4. **不要让 kitchen / admin 走客户 SW 的缓存** — 否则更新延迟问题
5. **不要急着加新功能** — 这次只做"PWA 化"3 个入口, 不改业务逻辑

### 一定做的事 ✅

1. **客户 PWA 必须完全无回归** — 这是底线, 部署前在 Jason 测试机上确认
2. **3 个 manifest 必须 scope 隔离** — 各自的 start_url 和 scope
3. **3 个图标必须视觉区分明显** — 老板和服务员一眼能认出
4. **iPad landscape orientation** — 后厨 PWA manifest 必须设 `"orientation": "landscape"`
5. **本地 preview 验证 + 线上访问验证** — 9 步部署协议严格执行

---

## 联系

有问题立刻反馈 Jason, 不要硬撑。

**END OF PROMPT**
