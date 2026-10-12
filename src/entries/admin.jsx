import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminPanel, BandeauRecette } from '../App.jsx';
import '../index.css';
import BandeauMiseAJour from '../components/BandeauMiseAJour';
import { demarrerMiseAJour } from '../components/miseAJour';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BandeauRecette />
    <AdminPanel />
    <BandeauMiseAJour />
  </StrictMode>
);

// Recharge la page quand un nouveau deploiement est en ligne (voir miseAJour.js).
demarrerMiseAJour();
