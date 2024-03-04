import { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import { Link } from 'react-router-dom';

const ManageTours = () => {
  const [tours, setTours] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [tourId, setTourId] = useState(null);
  const [tourName, setTourName] = useState(null);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('confirmation');

  const popupHandler = (id, name) => {
    setTourId(id);
    setTourName(name);
    setShowPopUp(true);
  };

  const deleteTour = (id) => {
    api
      .delete(`tours/${id}`)
      .then((res) => {
        // console.log(res);
        if (res.status === 204) {
          setMessage(`${tourName} successfully deleted`);
          setStatus('success');
          setLoading(true);

          setTimeout(() => {
            setMessage(null);
            setStatus('confirmation');
            setShowPopUp(false);
            setLoading(false);
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Ops! Something went wrong, please try again.');
        setStatus('error');

        setTimeout(() => {
          setMessage(null);
          setStatus('confirmation');
          setShowPopUp(false);
        }, 1500);
      });
  };

  const closePopup = () => {
    setShowPopUp(false);
  };

  useEffect(() => {
    if (loading) {
      api
        .get('tours')
        .then((res) => {
          // console.log(res);
          setTours(res.data.data.data);
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.log(err);
        });
    }
    document.title = 'Natours | Manage tours';
  }, [loading]);

  return (
    <div className="content">
      <h2 className="heading-secondary ma-bt-md">Manage Tours</h2>
      {loading ? (
        <h3 className="no-results">Loading...</h3>
      ) : (
        <div>
          {tours.map((tour, index) => (
            <Link
              to={`/tour/${tour.id}`}
              className="card-secondary content__card"
              key={index}
            >
              <div className="card-secondary__avatar">
                <img
                  src={`https://natours-app-r8rd.onrender.com/public/img/tours/${tour.imageCover}`}
                  alt={tour.name}
                  className="card-secondary__avatar-img card-secondary__avatar-img--tour"
                  crossOrigin="anonymous"
                />
                <h6 className="card-secondary__title">{tour.name}</h6>
              </div>
              <p className="card-secondary__text ma-bt-md">{tour.summary}</p>
              <div>
                <Button
                  type="link"
                  color="green"
                  to={`/edit-tour/${tour.id}`}
                  value="Edit"
                />{' '}
                or{' '}
                <Button
                  type="link"
                  onClick={() => popupHandler(tour.id, tour.name)}
                  color="red"
                  to="#"
                  value="Delete"
                />
              </div>
            </Link>
          ))}
          {showPopUp && (
            <Alert
              status={status}
              message={
                message ?? `Are you sure you want to delete ${tourName}?`
              }
              confirmHandler={() => deleteTour(tourId)}
              deniesHandler={closePopup}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ManageTours;
