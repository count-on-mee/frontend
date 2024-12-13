import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { NavermapsProvider } from 'react-naver-maps';
import App from './App.jsx';
import './index.css';
import { RecoilRoot } from 'recoil';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <RecoilRoot>
    <NavermapsProvider ncpClientId="eguhhsxcco">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NavermapsProvider>
  </RecoilRoot>,
  //</StrictMode>,
);
