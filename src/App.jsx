import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DestinationListPage from './pages/DestinationListPage';
import SpotPage from './pages/SpotPage';
import CurationPage from './pages/CurationPage';
import MapLayout from './layouts/MapLayout';
import COMLayout from './layouts/ComLayout';
import Itinerary from './components/Itinerary';
import Details from './components/Details';
import MyScrapListPage from './pages/MyScrapListPage';
import MyTripListPage from './pages/MyTripListPage';
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/com" element={<COMLayout />}>
          <Route path="my-trip-list" element={<MyTripListPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="destination-list" element={<DestinationListPage />} />
          <Route path="my-scrap-list" element={<MyScrapListPage />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="details" element={<Details />} />
        </Route>
        <Route path="/map" element={<MapLayout />}>
          <Route path="spot" element={<SpotPage />} />
          <Route path="curation" element={<CurationPage />} />
        </Route>
      </Routes>
    </RecoilRoot>
  );
}

export default App;
