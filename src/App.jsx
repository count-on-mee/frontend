import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import PlanLayout from './layouts/PlanLayout';
import Calendar from './components/plan/Calendar';
import Destination from './components/plan/Destination';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow flex">
            <Routes>
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

export default App;
