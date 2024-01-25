import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <>
      <Router>
        <Header />
        <App />
      </Router>
    </>
  );
};

export default AppWrapper;
