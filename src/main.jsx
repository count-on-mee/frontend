import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { NavermapsProvider } from 'react-naver-maps';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
        <NavermapsProvider ncpClientId="p3r303x1fj">
          <RecoilNexus />
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </NavermapsProvider>
    </RecoilRoot>
  </StrictMode>,
);
