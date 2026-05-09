import { useState, useEffect } from 'react';

const DISMISS_KEY = 'pwa-dismissed-at';
const DISMISS_MS = 24 * 3600 * 1000;

function isDismissed() {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  return Date.now() - parseInt(ts, 10) < DISMISS_MS;
}

function saveDismiss() {
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/MicroMessenger/i.test(ua)) return 'wechat';
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [platform, setPlatform] = useState('desktop');

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.navigator.standalone) return;
    if (isDismissed()) return;

    const plat = detectPlatform();
    setPlatform(plat);
    setShowPrompt(true);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDismiss = (e) => {
    e.stopPropagation();
    setShowPrompt(false);
    saveDismiss();
  };

  const handleBarClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        saveDismiss();
      }
      setDeferredPrompt(null);
      return;
    }
    setShowModal(true);
  };

  if (!showPrompt) return null;

  return (
    <>
      <style>{`
        @keyframes pwa-glow {
          0%, 100% { border-top-color: #8B0000; box-shadow: 0 -2px 8px rgba(139,0,0,0.3); }
          50%       { border-top-color: #e53e3e; box-shadow: 0 -4px 16px rgba(229,62,62,0.5); }
        }
      `}</style>

      <div
        onClick={handleBarClick}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#1a0a0a', borderTop: '2px solid #8B0000',
          padding: '14px 16px', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, cursor: 'pointer',
          animation: 'pwa-glow 2.4s ease-in-out infinite',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ color: '#f5f0e8', fontWeight: 700, fontSize: 15 }}>
            📲 添加到桌面 · Ajouter à l'écran
          </div>
          <div style={{ color: '#c0a070', fontSize: 12, marginTop: 3 }}>
            点此了解如何安装 · Cliquez pour installer
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="关闭"
          style={{
            background: 'transparent', color: '#a09882',
            border: '1px solid #444', padding: '8px 11px',
            borderRadius: 8, cursor: 'pointer', fontSize: 15, flexShrink: 0,
          }}
        >✕</button>
      </div>

      {showModal && (
        <InstallModal platform={platform} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

/* ─── Modal shell ─────────────────────────────────────────────────── */

function InstallModal({ platform, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a0a0a', borderRadius: '20px 20px 0 0',
          border: '2px solid #8B0000', borderBottom: 'none',
          padding: '28px 22px 40px',
          width: '100%', maxWidth: 480,
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {platform === 'wechat'  && <WeChatGuide  onClose={onClose} />}
        {platform === 'ios'     && <IOSGuide     onClose={onClose} />}
        {(platform === 'android' || platform === 'desktop') && (
          <AndroidDesktopGuide onClose={onClose} />
        )}
      </div>
    </div>
  );
}

/* ─── Shared sub-components ───────────────────────────────────────── */

function ModalTitle({ emoji, zh, sub, fr }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 26 }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
      <div style={{ color: '#f5f0e8', fontSize: 23, fontWeight: 900, lineHeight: 1.3 }}>{zh}</div>
      {sub && (
        <div style={{ color: '#8B0000', fontSize: 16, fontWeight: 700, marginTop: 5 }}>{sub}</div>
      )}
      <div style={{ color: '#a09882', fontSize: 13, marginTop: 5 }}>{fr}</div>
    </div>
  );
}

function Step({ num, zh, fr }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 16,
      background: '#2a0f0f', borderRadius: 14, padding: '16px 18px',
      marginBottom: 14,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: '50%',
        background: '#8B0000', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 900, flexShrink: 0,
      }}>{num}</div>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#f5f0e8', fontWeight: 700, fontSize: 19, lineHeight: 1.35 }}>{zh}</div>
        <div style={{ color: '#a09882', fontSize: 14, marginTop: 5, lineHeight: 1.4 }}>{fr}</div>
      </div>
    </div>
  );
}

function OkButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{
        width: '100%', padding: '17px',
        background: '#8B0000', color: '#fff',
        border: 'none', borderRadius: 12,
        fontSize: 20, fontWeight: 700, cursor: 'pointer',
        marginTop: 6,
      }}
    >
      我知道了 · D'accord
    </button>
  );
}

/* ─── iOS guide ───────────────────────────────────────────────────── */

function IOSGuide({ onClose }) {
  return (
    <div>
      <ModalTitle
        emoji="📲"
        zh="添加到桌面"
        sub="一次设置，永久使用"
        fr="Ajouter à l'écran · Une fois pour toutes"
      />

      <Step
        num="1"
        zh="点击底部 📤 分享按钮"
        fr='Cliquez sur le bouton 📤 "Partager" en bas'
      />

      <div style={{ textAlign: 'center', fontSize: 20, color: '#8B0000', marginBottom: 14, letterSpacing: 4 }}>
        ↓ &nbsp; 底部 / En bas &nbsp; ↓
      </div>

      <Step
        num="2"
        zh='选择"添加到主屏幕" 🏠'
        fr={`"Sur l'écran d'accueil"`}
      />

      <Step
        num="3"
        zh='点击右上角"添加" ✅'
        fr='Cliquez sur "Ajouter" en haut à droite'
      />

      <OkButton onClose={onClose} />
    </div>
  );
}

/* ─── Android / Desktop guide ─────────────────────────────────────── */

function AndroidDesktopGuide({ onClose }) {
  return (
    <div>
      <ModalTitle
        emoji="📲"
        zh="添加到桌面"
        sub="一次设置，永久使用"
        fr="Ajouter à l'écran d'accueil"
      />

      <Step
        num="1"
        zh="点浏览器右上角菜单 ⋮"
        fr="Appuyez sur le menu ⋮ en haut à droite"
      />

      <Step
        num="2"
        zh='选择"添加到主屏幕" 🏠'
        fr={`"Ajouter à l'écran d'accueil"`}
      />

      <Step
        num="3"
        zh='点击"添加"确认 ✅'
        fr='Confirmez en cliquant "Ajouter"'
      />

      <OkButton onClose={onClose} />
    </div>
  );
}

/* ─── WeChat guide ────────────────────────────────────────────────── */

function WeChatGuide({ onClose }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>⚠️</div>
      <div style={{ color: '#f5f0e8', fontSize: 22, fontWeight: 900, lineHeight: 1.4 }}>
        请用浏览器打开
      </div>
      <div style={{ color: '#a09882', fontSize: 14, marginTop: 6 }}>
        Veuillez ouvrir dans un navigateur
      </div>

      <div style={{ background: '#2a0f0f', borderRadius: 14, padding: '20px 18px', marginTop: 24, textAlign: 'left' }}>
        <div style={{ color: '#f5f0e8', fontSize: 19, fontWeight: 700, marginBottom: 8 }}>
          📱 iPhone 用户:
        </div>
        <div style={{ color: '#c0a070', fontSize: 16, lineHeight: 1.6 }}>
          右上角 ··· → <strong style={{ color: '#f5f0e8' }}>在 Safari 中打开</strong>
        </div>

        <div style={{ color: '#f5f0e8', fontSize: 19, fontWeight: 700, marginTop: 18, marginBottom: 8 }}>
          🤖 Android 用户:
        </div>
        <div style={{ color: '#c0a070', fontSize: 16, lineHeight: 1.6 }}>
          右上角 ··· → <strong style={{ color: '#f5f0e8' }}>在 Chrome 中打开</strong>
        </div>
      </div>

      <div style={{ color: '#a09882', fontSize: 12, marginTop: 14 }}>
        iPhone: ouvrez dans Safari · Android: ouvrez dans Chrome
      </div>

      <OkButton onClose={onClose} />
    </div>
  );
}
