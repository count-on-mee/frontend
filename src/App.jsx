import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DestinationListPage from './pages/DestinationListPage';
import SpotPage from './pages/SpotPage';
import CurationPage from './pages/CurationPage';
import MapLayout from './layouts/MapLayout';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/destination" element={<DestinationListPage />} />
        <Route path="/map" element={<MapLayout />}>
          <Route path="spot" element={<SpotPage />} />
          <Route path="curation" element={<CurationPage />} />
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
