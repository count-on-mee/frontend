import { Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import DestinationListPage from './pages/DestinationListPage';
import SpotPage from './pages/SpotPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/spot" element={<SpotPage />} />
      <Route path="/destination" element={<DestinationListPage />} />
      <Route path="/map" element={<MapPage />} />
    </Routes>
  );
}

export default App;
