import { Route, Routes } from 'react-router-dom';
import Main from './pages/MainPage';
import Login from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;
