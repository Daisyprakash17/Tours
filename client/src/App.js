import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
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
        <Footer />
      </Router>
    </>
  );
};

export default AppWrapper;
