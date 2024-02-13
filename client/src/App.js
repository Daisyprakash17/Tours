import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import TourDetails from './pages/TourDetails';
import Account from './pages/Account';
import { AuthProvider } from './store/AuthContext';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/log-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/me" element={<Account />} />
      <Route path="/tour/:id" element={<TourDetails />} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Header />
          <App />
          <Footer />
        </AuthProvider>
      </Router>
    </>
  );
};

export default AppWrapper;
