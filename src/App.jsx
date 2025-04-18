import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import PlanLayout from './layouts/PlanLayout';
import Calendar from './components/plan/Calendar';
import Destination from './components/plan/Destination';
import Header from './components/Header';
import SpotPage from './pages/SpotPage';
import CurationPage from './pages/CurationPage';
import LoginPage from './pages/LoginPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import useInitializeUser from './hooks/useInitializeUser';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <InitializeUserWrapper />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth-callback" element={<OAuthCallbackPage />} />
              <Route path="/spot" element={<SpotPage />} />
              <Route path="/curation" element={<CurationPage />} />
              <Route path="/com" element={<PlanLayout />}>
                <Route path="calendar" element={<Calendar />} />
                <Route path="destination" element={<Destination />} />
              </Route>
            </Routes>
          </main>
        </div>
      </RecoilRoot>
    </React.StrictMode>
  );
}

function InitializeUserWrapper() {
  useInitializeUser();
  return null;
}

export default App;
