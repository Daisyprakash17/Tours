import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../store/AlertContext';
import api from '../utils/axiosConfig';
import TourCard from '../components/Card/TourCard';
import SpLoading from '../components/Spinner/SpLoading';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [allTours, setAllTours] = useState({});
  const { setMessage, setStatus } = useContext(AlertContext);
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
          setStatus('error');

          if (err.response.status === 429) {
            setMessage(err.response.data);
            setTimeout(() => {
              setMessage(null);
            }, 3000);
            return;
          }

          setMessage(
            err.response.data.message ||
              'Ops! Something went wrong, please try again.'
          );
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
  }, [loading]);

  return (
    <div className="main-container">
      {loading ? <SpLoading centered /> : <TourCard tours={allTours} />}
    </div>
  );
};

export default Home;
