import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.navigator.standalone) return;
    if (localStorage.getItem('pwa-dismissed')) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) setShowPrompt(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
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
      background: '#1a0a0a', borderTop: '1px solid #8B0000',
      padding: '14px 16px', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#f5f0e8', fontWeight: 700, fontSize: 14 }}>
          ❄️ Ajouter à l'écran d'accueil
        </div>
        <div style={{ color: '#a09882', fontSize: 12, marginTop: 3 }}>
          {isIOS
            ? "Appuyez sur ⎙ Partager → \"Sur l'écran d'accueil\""
            : 'Accédez rapidement au menu et aux réservations'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {!isIOS && (
          <button onClick={handleInstall} style={{
            background: '#8B0000', color: '#fff', border: 'none',
            padding: '8px 16px', borderRadius: 8, fontWeight: 700,
            fontSize: 13, cursor: 'pointer',
          }}>
            Installer
          </button>
        )}
        <button onClick={handleDismiss} style={{
          background: 'transparent', color: '#a09882',
          border: '1px solid #444', padding: '8px 10px',
          borderRadius: 8, cursor: 'pointer', fontSize: 13,
        }}>✕</button>
      </div>
    </div>
  );
}
