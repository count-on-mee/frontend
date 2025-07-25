import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import PlanLayout from './layouts/PlanLayout';
import TripLayout from './layouts/TripLayout';
import SupportLayout from './layouts/supportLayout';
import Calendar from './components/plan/Calendar';
import Destination from './components/plan/Destination';
import Header from './components/Header';
import SpotPage from './pages/SpotPage';
import CurationPage from './pages/CurationPage';
import LoginPage from './pages/LoginPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import useInitializeUser from './hooks/useInitializeUser';
import MyScrapListPage from './pages/MyScrapListPage';
import LoginNoticePage from './pages/LoginNoticePage';
import TripDetails from './pages/trip/tripDetails';
import TripItinerary from './pages/trip/tripItinerary';
import MyPage from './pages/MyPage';
import FaqPage from './pages/support/faqPage';
import InquiryPage from './pages/support/inquiryPage';
import NoticePage from './pages/support/noticePage';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <InitializeUserWrapper />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<SpotPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth-callback" element={<OAuthCallbackPage />} />
              <Route path="/me" element={<MyPage />} />
              <Route path="/spot" element={<SpotPage />} />
              <Route path="/curation" element={<CurationPage />} />
              <Route path="/login-notice" element={<LoginNoticePage />} />
              <Route path="/com" element={<PlanLayout />}>
                <Route path="calendar" element={<Calendar />} />
                <Route path="destination" element={<Destination />} />
                <Route path="my-scrap-list" element={<MyScrapListPage />} />
              </Route>
              <Route path="/trip/:tripId" element={<TripLayout />}>
                <Route index element={<Navigate to="itinerary" replace />} />
                <Route path="itinerary" element={<TripItinerary />} />
                <Route path="details" element={<TripDetails />} />
              </Route>
              <Route path="/support" element={<SupportLayout />}>
                <Route index element={<Navigate to="faq" replace />} />
                <Route path="faq" element={<FaqPage />} />
                <Route path="notice" element={<NoticePage />} />
                <Route path="inquiry" element={<InquiryPage />} />
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
