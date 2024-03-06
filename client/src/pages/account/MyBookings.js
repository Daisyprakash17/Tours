import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import TourCard from '../../components/Card/TourCard';
import SpLoading from '../../components/Spinner/SpLoading';

const MyBookings = () => {
  const [loading, setLoading] = useState(true);
  const [bookedTours, setBookedTours] = useState({});

  useEffect(() => {
    document.title = 'Natours | My Bookings';

    if (loading) {
      api
        .get('users/my-bookings')
        .then((res) => {
          // console.log(res);
          setBookedTours(res.data.data.bookedTours);
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.error(err);
        });
    }
  }, [loading]);

  return (
    <div className="main-container card-container--bookings form">
      <h2 className="heading-secondary">My bookings</h2>
      {loading ? (
        <div>
          <SpLoading />
        </div>
      ) : bookedTours.length > 0 ? (
        <TourCard tours={bookedTours} />
      ) : (
        <div>
          <h3 className="no-results">There are no bookings yet!</h3>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
