import { TripProvider, useTrip } from './components/Trip';
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

function App() {
  return (
    <TripProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/destination" element={<DestinationListPage />} />
        <Route path="/myscraplist" element={<MyScrapListPage />} />
        <Route path="/map" element={<MapLayout />}>
          <Route path="spot" element={<SpotPage />} />
        </Route>
        <Route path="/COM" element={<COM />}>
          <Route path="Itinerary" element={<Itinerary />} />
          <Route path="Details" element={<Details />} />
        </Route>
      </Routes>
    </TripProvider>
  );
}

export default App;
