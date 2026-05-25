# 雪红餐厅 PWA SumUp 集成 - Demo Mock 优先

> **接收方**: VS Code Claude Code (jason2016/neige-rouge 项目)  
> **生成**: Claude.ai (Co-Founder/CTO)  
> **日期**: 2026-04-25  
> **优先级**: 🔴 P0 — Demo 给雪红老板看  
> **预计工时**: 3-4 天

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎯 任务概述

修改雪红餐厅 PWA, **支付流程升级为 3 选项**:

1. 在线支付 (SumUp Hosted Checkout)
2. 到柜台支付 (SumUp Solo TPE 自动弹金额)
3. 取餐时付款 (Plan B, 老板手动收款)

**两阶段**:

- **Phase 1 (现在)**: Demo Mock 模式 — 不接真 SumUp, UI 完整, 流程可演示
- **Phase 2 (老板同意后)**: 接真实 SumUp 设备

**只做 Phase 1**.

完成后, Jason 可以在浏览器里走完整流程演示给雪红老板看, 老板确认后再做 Phase 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚠️ 严格约束 (必读)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### ❌ 不许做

1. ❌ **不要破坏现有功能** — Stancer 集成保留, 现有路由不影响
2. ❌ **不要修改菜单 / 预订 / 后台** — 只动支付流程
3. ❌ **不要接真 SumUp API** — Phase 2 才做
4. ❌ **不要打包过大** — GitHub Pages 部署体积有限
5. ❌ **不要硬编码 API URL** — 用环境变量

### ✅ 必须做

1. ✅ Demo Mock 模式开关: `VITE_DEMO_MODE=true`
2. ✅ Mock 模式下 3 种支付都可走通 (含等待页 + 成功页)
3. ✅ UI 完整: 支付选择 + 等待 + 成功 + 后厨大屏
4. ✅ 中法双语 (默认法语)
5. ✅ 移动端优先, PWA 可安装
6. ✅ Stancer 作为 fallback 保留
7. ✅ 错误处理完善

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 项目背景

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 仓库: `github.com/jason2016/neige-rouge`
- 部署: `https://jason2016.github.io/neige-rouge/`
- 当前版本: v2.2.0 (PWA 已上线)
- 技术: React + Vite + GitHub Pages

### 现有功能 (保留)

- 菜单浏览
- 扫码点餐 (堂食)
- Stancer 在线支付 (单一选项)
- 预订系统
- 后厨大屏 (#kitchen)
- 管理后台 (#admin)
- 收据 PDF / 发票 PDF
- PWA 可安装

### 后端 API

- ClawShow MCP Server: `https://mcp.clawshow.ai`
- API 由后端 Claude Code 同步开发

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 1 — 配置环境变量

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### `.env.development`

```
VITE_API_BASE=https://mcp.clawshow.ai
VITE_NAMESPACE=neige-rouge
VITE_DEMO_MODE=true
```

### `.env.production`

```
VITE_API_BASE=https://mcp.clawshow.ai
VITE_NAMESPACE=neige-rouge
VITE_DEMO_MODE=true
```

(Phase 2 切真实, 改 false)

### `src/config/api.ts`

```typescript
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://mcp.clawshow.ai';
export const NAMESPACE = import.meta.env.VITE_NAMESPACE || 'neige-rouge';
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 2 — 支付方式选择组件

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/components/PaymentMethodSelector.tsx`:

```tsx
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface PaymentMethod {
  id: 'in_person_solo' | 'online' | 'at_pickup';
  title_key: string;
  subtitle_key: string;
  icon: string;
  recommended?: boolean;
}

const methods: PaymentMethod[] = [
  {
    id: 'in_person_solo',
    title_key: 'payment.in_person',
    subtitle_key: 'payment.in_person_desc',
    icon: '💳',
    recommended: true
  },
  {
    id: 'online',
    title_key: 'payment.online',
    subtitle_key: 'payment.online_desc',
    icon: '📱'
  },
  {
    id: 'at_pickup',
    title_key: 'payment.at_pickup',
    subtitle_key: 'payment.at_pickup_desc',
    icon: '💵'
  }
];

interface Props {
  amount: number;
  onSelect: (method: PaymentMethod['id']) => void;
}

export default function PaymentMethodSelector({ amount, onSelect }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  
  return (
    <div className="payment-selector p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">{t('payment.select')}</h2>
      <div className="amount text-3xl font-bold text-blue-600 mb-6">
        €{amount.toFixed(2)}
      </div>
      
      <div className="space-y-3">
        {methods.map(method => (
          <button
            key={method.id}
            className={`
              w-full p-4 rounded-lg border-2 transition
              ${selected === method.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-400'}
              ${method.recommended ? 'ring-2 ring-yellow-400' : ''}
            `}
            onClick={() => {
              setSelected(method.id);
              onSelect(method.id);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{method.icon}</div>
              <div className="text-left flex-1">
                <div className="font-semibold flex items-center gap-2">
                  {t(method.title_key)}
                  {method.recommended && (
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
                      ⭐ {t('payment.recommended')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {t(method.subtitle_key)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 3 — i18n 翻译

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/i18n/translations.ts`:

```typescript
export const translations = {
  fr: {
    'payment.select': 'Choisissez votre mode de paiement',
    'payment.in_person': 'Payer au comptoir',
    'payment.in_person_desc': 'SumUp affichera automatiquement le montant',
    'payment.online': 'Paiement en ligne',
    'payment.online_desc': 'Apple Pay / Google Pay / Carte',
    'payment.at_pickup': 'Payer à la livraison',
    'payment.at_pickup_desc': 'Espèces ou carte au comptoir',
    'payment.recommended': 'Recommandé',
    'payment.waiting_title': 'Veuillez payer au comptoir',
    'payment.waiting_subtitle': 'SumUp TPE a affiché le montant',
    'payment.success_title': 'Paiement réussi !',
    'payment.failed_title': 'Échec du paiement',
    'payment.retry': 'Réessayer',
    'payment.change_method': 'Changer de méthode',
    'order.processing': 'Commande en cours...',
    'order.pickup_number': 'Numéro de retrait',
    'order.show_at_counter': 'Présentez ce numéro au comptoir',
    'mock.demo_button': '🎬 Demo: Simuler paiement réussi',
  },
  zh: {
    'payment.select': '请选择支付方式',
    'payment.in_person': '到柜台支付',
    'payment.in_person_desc': 'SumUp 自动弹出金额',
    'payment.online': '在线支付',
    'payment.online_desc': 'Apple Pay / Google Pay / 信用卡',
    'payment.at_pickup': '取餐时付款',
    'payment.at_pickup_desc': '现金或刷卡',
    'payment.recommended': '推荐',
    'payment.waiting_title': '请到柜台贴卡',
    'payment.waiting_subtitle': 'SumUp TPE 已弹出金额',
    'payment.success_title': '支付成功！',
    'payment.failed_title': '支付失败',
    'payment.retry': '重试',
    'payment.change_method': '换支付方式',
    'order.processing': '处理订单中...',
    'order.pickup_number': '取餐号',
    'order.show_at_counter': '请到柜台出示此号',
    'mock.demo_button': '🎬 Demo: 模拟支付成功',
  }
};
```

`src/hooks/useTranslation.ts`:

```typescript
import { useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

export function useTranslation() {
  const [lang, setLang] = useState<'fr' | 'zh'>(() => {
    return (localStorage.getItem('lang') as 'fr' | 'zh') || 'fr';
  });
  
  const t = (key: string): string => {
    return translations[lang][key as keyof typeof translations.fr] || key;
  };
  
  const switchLang = (newLang: 'fr' | 'zh') => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };
  
  return { t, lang, switchLang };
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 4 — 支付路径处理

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/services/payment.ts`:

```typescript
import { API_BASE, NAMESPACE, DEMO_MODE } from '../config/api';

export type PaymentMode = 'online' | 'in_person_solo' | 'at_pickup';

export interface CreatePaymentResult {
  hosted_checkout_url?: string;
  status: string;
  is_mock?: boolean;
}

export async function createPayment(
  orderId: string,
  amount: number,
  mode: PaymentMode,
  items: any[]
): Promise<CreatePaymentResult> {
  
  // 取餐付不需要调支付商
  if (mode === 'at_pickup') {
    await updateOrder(orderId, {
      payment_mode: 'cash',
      status: 'unpaid_order_started'
    });
    return { status: 'awaiting_cash' };
  }
  
  const response = await fetch(`${API_BASE}/api/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      namespace: NAMESPACE,
      order_id: orderId,
      amount,
      currency: 'EUR',
      payment_mode: mode,
      items
    })
  });
  
  if (!response.ok) {
    throw new Error('Payment creation failed');
  }
  
  return await response.json();
}

export async function checkOrderStatus(orderId: string): Promise<string> {
  const response = await fetch(
    `${API_BASE}/api/order/${orderId}/status?namespace=${NAMESPACE}`
  );
  const data = await response.json();
  return data.status;
}

export async function updateOrder(orderId: string, updates: any): Promise<void> {
  await fetch(`${API_BASE}/api/order/${orderId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ namespace: NAMESPACE, ...updates })
  });
}

/**
 * Demo Mock: 手动触发支付成功 (拍 Demo 视频用)
 */
export async function mockTriggerSuccess(orderId: string): Promise<void> {
  if (!DEMO_MODE) {
    console.warn('Mock trigger only available in demo mode');
    return;
  }
  
  await fetch(
    `${API_BASE}/api/dev/mock-payment-success/${NAMESPACE}/${orderId}`,
    { method: 'POST' }
  );
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 5 — 等待支付页面 (Demo 关键)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/pages/WaitingForPayment.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkOrderStatus, mockTriggerSuccess } from '../services/payment';
import { DEMO_MODE } from '../config/api';
import { useTranslation } from '../hooks/useTranslation';

export default function WaitingForPayment() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [status, setStatus] = useState<'waiting' | 'paid' | 'failed'>('waiting');
  const [amount] = useState(() => {
    return parseFloat(localStorage.getItem(`order_${orderId}_amount`) || '0');
  });
  
  useEffect(() => {
    if (!orderId) return;
    
    const interval = setInterval(async () => {
      try {
        const newStatus = await checkOrderStatus(orderId);
        
        if (newStatus === 'paid') {
          setStatus('paid');
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/order/${orderId}/success`);
          }, 2000);
        } else if (newStatus === 'failed') {
          setStatus('failed');
          clearInterval(interval);
        }
      } catch (e) {
        console.error('Status check failed', e);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [orderId, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        
        {status === 'waiting' && (
          <>
            <div className="text-6xl mb-4">💳</div>
            <h1 className="text-2xl font-bold mb-4">
              {t('payment.waiting_title')}
            </h1>
            <div className="text-4xl font-bold text-blue-600 mb-4">
              €{amount.toFixed(2)}
            </div>
            <p className="text-gray-600 mb-2">
              {t('payment.waiting_subtitle')}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('order.show_at_counter')}: <strong>#{orderId}</strong>
            </p>
            
            <div className="animate-pulse text-gray-400">
              ⏳ Waiting...
            </div>
            
            {/* Demo Mock 按钮 - 视频拍摄用 */}
            {DEMO_MODE && (
              <button
                onClick={() => mockTriggerSuccess(orderId!)}
                className="mt-8 w-full py-3 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
              >
                {t('mock.demo_button')}
              </button>
            )}
          </>
        )}
        
        {status === 'paid' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-600 mb-4">
              {t('payment.success_title')}
            </h1>
            <p className="text-gray-600">{t('order.processing')}</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {t('payment.failed_title')}
            </h1>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/payment/${orderId}`)}
                className="w-full py-2 bg-blue-600 text-white rounded"
              >
                {t('payment.retry')}
              </button>
              <button
                onClick={() => navigate(`/payment/${orderId}`)}
                className="w-full py-2 border border-gray-300 rounded"
              >
                {t('payment.change_method')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 6 — 后厨大屏适配

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/pages/Kitchen.tsx` 修改:

### 6.1 显示支付方式标签

```tsx
function getPaymentBadge(mode: string, status: string) {
  if (status === 'paid') {
    return <span className="badge bg-green-500 text-white px-2 py-1 rounded">🟢 已付款</span>;
  }
  if (mode === 'cash' || status === 'unpaid_order_started') {
    return <span className="badge bg-yellow-500 text-white px-2 py-1 rounded">💵 现金待收</span>;
  }
  if (mode === 'in_person_solo') {
    return <span className="badge bg-blue-500 text-white px-2 py-1 rounded">⏳ 等 SumUp 确认</span>;
  }
  return <span className="badge bg-gray-500 text-white px-2 py-1 rounded">❓ 未付款</span>;
}
```

### 6.2 "确认收款" 按钮 (Plan B)

```tsx
{order.status === 'unpaid_order_started' && (
  <button
    className="bg-green-600 text-white px-4 py-2 rounded"
    onClick={() => confirmCashPayment(order.id)}
  >
    ✅ 确认收款 (现金/LCL)
  </button>
)}

{order.payment_status === 'paid' && order.kitchen_status !== 'cooking' && (
  <button
    className="bg-orange-600 text-white px-4 py-2 rounded"
    onClick={() => startCooking(order.id)}
  >
    🍳 开始制作
  </button>
)}
```

### 6.3 实时刷新

```tsx
useEffect(() => {
  const fetchOrders = async () => {
    const response = await fetch(
      `${API_BASE}/api/kitchen/orders?namespace=${NAMESPACE}`
    );
    const orders = await response.json();
    setOrders(orders);
  };
  
  fetchOrders();
  const interval = setInterval(fetchOrders, 5000);
  return () => clearInterval(interval);
}, []);
```

### 6.4 新订单响铃

```tsx
const newOrderSound = new Audio('/notification.mp3');
const [previousOrderCount, setPreviousOrderCount] = useState(0);

useEffect(() => {
  if (orders.length > previousOrderCount && previousOrderCount > 0) {
    newOrderSound.play().catch(e => console.log('Audio play failed', e));
  }
  setPreviousOrderCount(orders.length);
}, [orders.length]);
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 7 — 订单成功页

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/pages/OrderSuccess.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE, NAMESPACE } from '../config/api';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    fetch(`${API_BASE}/api/order/${orderId}?namespace=${NAMESPACE}`)
      .then(r => r.json())
      .then(setOrder);
  }, [orderId]);
  
  if (!order) return <div className="p-4">Loading...</div>;
  
  const isPaid = order.payment_status === 'paid';
  const isCash = order.payment_mode === 'cash';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-8">
        
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">✅</div>
          <h1 className="text-2xl font-bold">
            {isPaid ? t('payment.success_title') : t('order.processing')}
          </h1>
        </div>
        
        <div className="space-y-3 border-y py-4 mb-4">
          <Row label="Commande" value={`#${order.id}`} />
          <Row 
            label={t('order.pickup_number')} 
            value={order.pickup_number} 
            highlight 
          />
          {order.table_number && (
            <Row label="Table" value={order.table_number} />
          )}
          <Row label="Total" value={`€${order.total.toFixed(2)}`} />
        </div>
        
        <div className="text-center mb-6">
          {isPaid && (
            <p className="text-green-600">🟢 Payé — Veuillez attendre votre commande</p>
          )}
          {isCash && (
            <p className="text-yellow-600">💵 À payer au comptoir lors du retrait</p>
          )}
        </div>
        
        {isPaid && (
          <button
            onClick={() => downloadReceipt(orderId!)}
            className="w-full py-2 border border-blue-600 text-blue-600 rounded"
          >
            📄 Télécharger reçu PDF
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={highlight ? 'text-2xl font-bold text-blue-600' : 'font-medium'}>
        {value}
      </span>
    </div>
  );
}

async function downloadReceipt(orderId: string) {
  window.open(`${API_BASE}/api/order/${orderId}/receipt?namespace=${NAMESPACE}`, '_blank');
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 8 — 路由配置

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`src/App.tsx`:

```tsx
<HashRouter>
  <Routes>
    <Route path="/" element={<Menu />} />
    <Route path="/order" element={<OrderPage />} />
    <Route path="/payment/:orderId" element={<PaymentPage />} />
    <Route path="/payment/waiting/:orderId" element={<WaitingForPayment />} />
    <Route path="/order/:orderId/success" element={<OrderSuccess />} />
    
    {/* 现有路由保留 */}
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/kitchen" element={<Kitchen />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/display" element={<DisplayScreen />} />
  </Routes>
</HashRouter>
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 Task 9 — Demo 完整流程测试

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 测试清单 (Demo 视频拍摄前必须全过)

```
[ ] 客人扫桌面 QR → 看到菜单
[ ] 加 Bò Bún + 可乐到购物车
[ ] 点 "Commander" 提交订单
[ ] 显示 "支付方式选择页"
[ ] 3 个选项清晰可见 (推荐 = 柜台支付)
[ ] 点 "Payer au comptoir" 
[ ] 跳转 "等待支付页", 显示 €__.__
[ ] (Demo Mode 下) 点 "🎬 模拟支付成功" 按钮
[ ] 自动跳转 "支付成功页", 显示取餐号
[ ] 后厨大屏自动响铃 + 显示新订单
[ ] 后厨大屏显示 🟢 已付款标签
[ ] 点 "🍳 开始制作"
[ ] 5 秒后点 "🔔 叫号"

替代流程: 在线支付
[ ] 选 "Paiement en ligne"
[ ] 跳转 mock-checkout 页 (后端给的 URL)
[ ] 3 秒后自动 "成功" → 跳回 PWA 成功页

替代流程: 取餐付
[ ] 选 "Payer à la livraison"
[ ] 直接跳成功页
[ ] 后厨大屏显示 💵 现金待收 + "确认收款" 按钮
[ ] 老板点 "确认收款"
[ ] 后厨大屏更新为 🟢 已付款
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ✅ 验收标准

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### UI/UX

- [ ] 提交订单后显示支付方式选择
- [ ] 3 个选项清晰, 中法双语
- [ ] "推荐" 标签突出 (柜台支付)
- [ ] 移动端适配
- [ ] PWA 可安装

### 功能

- [ ] 选 "在线" → 调 API 收 mock URL → 跳转
- [ ] 选 "柜台" → 等待页 + 轮询 + Mock 按钮
- [ ] 选 "取餐付" → 直接成功页
- [ ] 后厨大屏 3 种状态显示正确
- [ ] 后厨 "确认收款" 按钮工作

### 集成

- [ ] 调 ClawShow API 正常
- [ ] 错误处理 (网络/API 失败)
- [ ] Loading 状态展示

### 国际化

- [ ] 中法双语完整
- [ ] 默认法语
- [ ] 可切换语言

### Mock 模式

- [ ] `VITE_DEMO_MODE=true` 时显示 Demo 按钮
- [ ] `VITE_DEMO_MODE=false` 时不显示
- [ ] Mock 流程 100% 离线可演示

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📋 PR 规范

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 标题: `[Neige-Rouge] feat: SumUp Phase 1 Mock + 3-option payment`
- 多个 commit (按 Task 拆分)
- 描述包含:
  - 截图 (3 个支付选项页 + 等待页 + 后厨大屏)
  - 测试步骤 (上面的测试清单)
  - 已知限制: 真实 SumUp 集成在 Phase 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🎬 Demo 视频拍摄准备

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

完成后, Jason 用以下流程拍 Demo:

1. **客人手机视角** (60 秒):
   - 扫 QR → 菜单 → 加菜 → 提交
   - **重点**: 3 选项页 + "推荐 ⭐" 标签
   - 点 "Payer au comptoir"
   - 等待页显示金额
   - 点 "🎬 Demo 按钮" (拍摄时遮住, 让观众以为是 SumUp 弹的)
   - 跳转成功页

2. **后厨视角** (30 秒):
   - 大屏自动响铃
   - 新订单弹出 (🟢 已付款)
   - "开始制作" → "叫号"

3. **老板视角** (30 秒):
   - 后厨大屏 "确认收款" 流程 (Plan B 演示)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 📚 协作

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- 后端 API 由另一个 Claude Code 同步开发 (`clawshow-mcp-server` 项目)
- 后端 PR: `[Neige-Rouge] feat: SumUp Phase 1 Mock integration`
- 联调时 Jason 协调

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚠️ 最后提醒

1. **不要**接真实 SumUp API (Phase 2 才做)
2. **不要**修改菜单 / 预订 / 后台代码
3. **不要**破坏 Stancer (保留作 fallback)
4. **不要**打包过大 — GitHub Pages 部署
5. 完成后通知 Jason

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Prompt 生成: Claude.ai (Co-Founder/CTO)*  
*接收: VS Code Claude Code (jason2016/neige-rouge)*  
*日期: 2026-04-25*
