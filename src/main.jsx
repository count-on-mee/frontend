import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
);
