import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Callback from './Callback';

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default Main;