import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import PlanLayout from './layouts/PlanLayout';
import TripLayout from './layouts/TripLayout';
import Calendar from './components/plan/Calendar';
import Destination from './components/plan/Destination';
import Header from './components/Header';
import SpotPage from './pages/SpotPage';
import TripDetails from './pages/trip/tripDetails';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex">
            <Routes>
              <Route path="/spot" element={<SpotPage />} />
              <Route path="/com" element={<PlanLayout />}>
                <Route path="calendar" element={<Calendar />} />
                <Route path="destination" element={<Destination />} />
              </Route>
              <Route path="/com/:tripId" element={<TripLayout />}>
                <Route path="details" element={<TripDetails />} />
              </Route>
            </Routes>
          </main>
        </div>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
