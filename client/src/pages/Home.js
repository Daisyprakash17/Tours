import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import TourCard from '../components/Card/TourCard';
import Alert from '../components/Alert/Alert';
import SpLoading from '../components/Spinner/SpLoading';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allTours, setAllTours] = useState({});
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | All Tours';

    // Get all tours
    if (loading) {
      api
        .get('tours')
        .then((res) => {
          // console.log(res);
          setAllTours(res.data.data.data);
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.error(err);
        });
    }

    // If the URL contains the parameter paymentIntent=succeeded
    const queryParams = new URLSearchParams(window.location.search);
    const paymentIntent = queryParams.get('paymentIntent');

    if (paymentIntent === 'succeeded') {
      // Then shows the message of successful payment
      setMessage('Payment succeeded, thanks for your booking.');
      setStatus('success');
      // Remove the paymentIntent=succeeded parameter from the url
      navigate('/');

      setTimeout(() => {
        setMessage(null);
      }, 1500);
    }
  }, [loading, navigate]);

  return (
    <div className="main-container">
      {message && <Alert message={message} status={status} />}
      {loading ? <SpLoading centered /> : <TourCard tours={allTours} />}
    </div>
  );
};

export default Home;
