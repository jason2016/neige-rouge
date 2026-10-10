import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { BandeauRecette } from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BandeauRecette />
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Chemin relatif a la base de construction : la recette (/neige-rouge/recette/) a SON service worker.
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}
