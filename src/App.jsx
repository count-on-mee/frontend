import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h2>안녕!</h2>
    </Router>
  );
}

export default App;
