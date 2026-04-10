# Neige Rouge 红雪餐厅 — PWA优化

> 发送给 Neige Rouge Workspace 的 Claude Code 执行
> 日期：2026-04-10
> 目标：让网站在手机上的体验接近原生APP（全屏、有图标、有启动画面、不会滑出去）
> 项目路径：Development/Customers/neige-rouge
> 网址：https://jason2016.github.io/neige-rouge/

---

## 任务：添加PWA支持

### 1. 创建 public/manifest.json

```json
{
  "name": "Neige Rouge 红雪餐厅",
  "short_name": "红雪",
  "description": "Cuisine Vietnamienne & Chinoise - Réservation en ligne",
  "start_url": "/neige-rouge/#/menu",
  "scope": "/neige-rouge/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#1a0a0a",
  "theme_color": "#1a0a0a",
  "categories": ["food", "restaurant"],
  "lang": "fr",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 2. 生成APP图标

在 `public/icons/` 目录下创建图标：
- 背景：#1a0a0a（暗红色调）
- 前景：用红雪餐厅的Logo或生成一个「雪」字+红色雪花图标
- 尺寸：192x192 和 512x512

如果项目中已有Logo图片就用现有的，裁剪为正方形，暗色背景居中放置。如果没有，用SVG生成一个红色雪花+「红雪」文字图标。

### 3. 创建 public/sw.js（Service Worker）

```javascript
const CACHE_NAME = 'neige-rouge-v1';
const ASSETS_TO_CACHE = [
  '/neige-rouge/',
  '/neige-rouge/index.html'
];

// 安装：缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 请求拦截：网络优先，失败时用缓存
self.addEventListener('fetch', event => {
  // API请求不缓存
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

### 4. 更新 index.html

在 `<head>` 中添加：

```html
<!-- PWA Meta Tags -->
<meta name="theme-color" content="#1a0a0a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="红雪">
<meta name="mobile-web-app-capable" content="yes">

<!-- Manifest -->
<link rel="manifest" href="/neige-rouge/manifest.json">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="/neige-rouge/icons/icon-192.png">

<!-- Prevent zoom on input focus (iOS) -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

在main.jsx或index.html中注册Service Worker：

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/neige-rouge/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}
```

### 5. 添加"安装提示"组件

创建 `src/components/InstallPrompt.jsx`（如果没有的话）：

```jsx
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('pwa-dismissed')) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    
    // iOS Safari不触发beforeinstallprompt，手动显示
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    if (isIOS && !isStandalone) {
      setShowPrompt(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showPrompt) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1a0a0a', borderTop: '1px solid #c13b3b',
      padding: '16px', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '14px' }}>
          ❄️ Ajouter à l'écran d'accueil
        </div>
        <div style={{ color: '#a09882', fontSize: '12px', marginTop: '4px' }}>
          {isIOS
            ? "Appuyez sur ⎙ Partager puis \"Sur l'écran d'accueil\""
            : "Accédez rapidement au menu et réservations"
          }
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {!isIOS && (
          <button onClick={handleInstall} style={{
            background: '#c13b3b', color: '#fff', border: 'none',
            padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer'
          }}>
            Installer
          </button>
        )}
        <button onClick={handleDismiss} style={{
          background: 'transparent', color: '#a09882', border: '1px solid #333',
          padding: '8px 12px', borderRadius: '6px', cursor: 'pointer'
        }}>
          ✕
        </button>
      </div>
    </div>
  );
}
```

在App.jsx中引入：
```jsx
import InstallPrompt from './components/InstallPrompt';
// 在路由最外层添加
<InstallPrompt />
```

### 6. 防止页面滑出去的CSS优化

在全局CSS中添加：

```css
/* 防止iOS橡皮筋效果和误触滑出 */
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

#root {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 防止长按弹出系统菜单 */
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

/* 输入框允许选择文字 */
input, textarea {
  -webkit-user-select: auto;
  user-select: auto;
}

/* 安全区域适配（iPhone刘海屏） */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 7. 部署

```bash
npm run deploy
```

### 8. 测试清单

**Android（Chrome）：**
- [ ] 打开网站 → 底部出现"安装"提示
- [ ] 点安装 → 桌面出现"红雪"图标
- [ ] 点图标 → 全屏打开，没有浏览器地址栏
- [ ] 浏览菜单、预定 → 不会滑出到浏览器

**iOS（Safari）：**
- [ ] 打开网站 → 底部出现"添加到主屏幕"提示
- [ ] 分享 → 添加到主屏幕 → 桌面出现红雪图标
- [ ] 点图标 → 全屏打开，状态栏融入暗红色主题
- [ ] 左右滑动不会退出

做完deploy后告诉我，打tag v1.2.0（或当前版本+1）。

---

*Powered by ClawShow — 让每个网站都像原生APP*
