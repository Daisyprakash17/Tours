import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TourCard from '../components/Card/TourCard';
import Alert from '../components/Alert/Alert';

const Home = () => {
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | All Tours';

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
  }, [navigate]);

  return (
    <div className="main-container">
      {message && <Alert message={message} status={status} />}
      <TourCard />
    </div>
  );
};

export default Home;
