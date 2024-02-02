import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TourDetails from './pages/TourDetails';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/log-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/tour/:id" element={<TourDetails />} />
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
