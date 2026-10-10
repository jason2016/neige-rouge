import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KitchenPanel, BandeauRecette } from '../App.jsx';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BandeauRecette />
    <KitchenPanel />
  </StrictMode>
);
