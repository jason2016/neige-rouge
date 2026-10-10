import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminPanel, BandeauRecette } from '../App.jsx';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BandeauRecette />
    <AdminPanel />
  </StrictMode>
);
