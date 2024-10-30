import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Calendarpage from './pages/Calendarpage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Calendarpage" element={<Calendarpage />} />
    </Routes>
  );
}

export default App;
