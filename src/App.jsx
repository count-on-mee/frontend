import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
//import InitializeUserWrapper from './components/InitializeUserWrapper';
import PlanLayout from './layouts/PlanLayout';
import Calendar from './components/plan/Calendar';

function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        {/* <InitializeUserWrapper /> */}
        <div className="flex flex-col min-h-screen">
          {/* <Header /> */}
          <main className="flex-grow flex">
            <Routes>
              <Route path="/com" element={<PlanLayout />}>
                <Route path="calendar" element={<Calendar />} />
              </Route>
            </Routes>
          </main>
        </div>
      </RecoilRoot>
    </React.StrictMode>
  );
}

export default App;
