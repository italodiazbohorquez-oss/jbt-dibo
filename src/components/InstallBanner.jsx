import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function InstallBanner({ theme: T }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('pwa-dismissed') === '1');

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem('pwa-dismissed', '1');
    setDismissed(true);
    setShowInstall(false);
  }

  if (needRefresh) {
    return (
      <div style={{
        position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
        background: T.ink, color: '#fff', borderRadius: 14, padding: '12px 18px',
        display: 'flex', alignItems: 'center', gap: 12, zIndex: 9999,
        boxShadow: '0 4px 24px rgba(0,0,0,.3)', maxWidth: 'calc(100vw - 32px)',
        fontFamily: T.body, fontSize: 13,
      }}>
        <span>Nueva versión disponible</span>
        <button onClick={() => updateServiceWorker(true)}
          style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: T.body }}>
          Actualizar
        </button>
      </div>
    );
  }

  if (!showInstall) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      background: '#fff', borderRadius: 16, padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 12, zIndex: 9999,
      boxShadow: '0 4px 24px rgba(0,0,0,.15)', maxWidth: 'calc(100vw - 32px)', width: 360,
      border: `1px solid ${T.line}`, fontFamily: T.body,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
        🧱
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Instalar JBT DIBO</div>
        <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>Acceso rápido desde tu pantalla de inicio</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={handleDismiss}
          style={{ background: 'none', border: 'none', color: T.ink3, fontSize: 18, cursor: 'pointer', padding: '4px 6px', lineHeight: 1 }}>
          ✕
        </button>
        <button onClick={handleInstall}
          style={{ background: T.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: T.body, whiteSpace: 'nowrap' }}>
          Instalar
        </button>
      </div>
    </div>
  );
}
