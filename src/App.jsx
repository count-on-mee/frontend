import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DestinationListPage from './pages/DestinationListPage';
import SpotPage from './pages/SpotPage';
import MapLayout from './layouts/MapLayout';
import COM from './pages/COM';
import Itinerary from './layouts/Itinerary';
import Details from './layouts/Details';
import MyScrapListPage from './pages/MyScrapListPage';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/destination" element={<DestinationListPage />} />
        <Route path="/myscraplist" element={<MyScrapListPage />} />
        <Route path="/com" element={<COM />}>
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="details" element={<Details />} />
        </Route>
        <Route path="/map" element={<MapLayout />}>
          <Route path="spot" element={<SpotPage />} />
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
