import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClosestDate, starCalc } from '../helper/functions';
import { FaRegClock } from 'react-icons/fa6';
import { CgGym } from 'react-icons/cg';
import Calendar from '../components/Icons/Calendar';
import Location from '../components/Icons/Location';
import User from '../components/Icons/User';
import Star from '../components/Icons/Star';
import api from '../utils/axiosConfig';
import Button from '../components/Button/Button';
import { AuthContext } from '../store/AuthContext';
import Alert from '../components/Alert/Alert';
import Submit from '../components/Form/Submit';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';

const TourDetails = () => {
  const [tour, setTour] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  let params = useParams();
  let id = params.id;

  // Show the review form if the user is logged in
  const reviewFormHandler = () => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      setStatus('error');
      setMessage('Please login to perform this action');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 1500);

      return;
    }

    setShowForm(true);
  };

  // Create a new review
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    api
      .post(`tours/${id}/reviews`, { review, rating })
      .then((res) => {
        // console.log(res);

        if (res.status === 201) {
          setMessage('Tour successfully reviewed');
          setStatus('success');
          setShowAlert(true);
          setReview('');
          setRating(null);
          setShowForm(false);

          setTimeout(() => {
            setShowAlert(false);
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setShowAlert(true);

        if (err.response.status === 403) {
          setMessage(
            err.response.message ||
              'You do not have permission to perform this action'
          );

          setTimeout(() => {
            setShowAlert(false);
          }, 1500);

          return;
        }

        if (err.response.data.message.code === 11000) {
          setMessage(
            'please make sure you have not already reviewed this tour!'
          );

          setTimeout(() => {
            setShowAlert(false);
          }, 1500);

          return;
        }

        if (err.response.data.message.message) {
          if (err.response.data.message.message.includes('failed: rating')) {
            setMessage('Please make sure to select at least one star');

            setTimeout(() => {
              setShowAlert(false);
            }, 1500);

            return;
          }

          setMessage(err.response.data.message.message);
        } else {
          setMessage('Ops! Something went wrong, please try again.');
        }

        setTimeout(() => {
          setShowAlert(false);
        }, 2500);
      });
  };

  // Tour booking
  const bookTourHandler = () => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      setStatus('error');
      setMessage('Please login to perform this action');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 1500);

      return;
    }

    setProcessing(true);

    api
      .get(`bookings/checkout-session/${id}`)
      .then((res) => {
        setProcessing(false);
        // console.log(res);
        window.location.href = res.data.session.url;
      })
      .catch((err) => {
        console.error(err);
        setShowAlert(true);
        setMessage(err || 'Ops! Something went wrong, please try again.');
        setStatus('error');

        setTimeout(() => {
          setShowAlert(false);
        }, 1500);
      });
  };

  useEffect(() => {
    api
      .get(`tours/${id}`)
      .then((res) => {
        // console.log(res);
        setTour(res.data.data.data);
      })
      .then(() => setLoading(false))
      .catch((err) => {
        console.log(err);
      });

    document.title = `Natours | ${tour.name}`;
  }, [id, tour.name, tour.ratingsAverage, review]);

  return (
    <>
      {showAlert && <Alert status={status} message={message} />}
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="details">
          <div className="details-header">
            <div className="header__hero">
              <div className="header__hero-overlay">&nbsp;</div>
              <img
                className="header__hero-img"
                src={`http://localhost:8000/public/img/tours/${tour.imageCover}`}
                alt={tour.name}
                crossOrigin="anonymous"
              />
            </div>
            <div className="heading-box">
              <h1 className="heading-primary">
                <span>{tour.name}</span>
              </h1>
              <div className="heading-box__group">
                <div className="heading-box__detail">
                  <FaRegClock className="heading-box__icon" />
                  <span className="heading-box__text">
                    {tour.duration} days
                  </span>
                </div>
                <div className="heading-box__detail">
                  <Location className="heading-box__icon" />
                  <span className="heading-box__text">
                    {tour.startLocation.description}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section className="details-description">
            <div className="overview-box">
              <div>
                <div className="overview-box__group">
                  <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
                  <div className="overview-box__detail">
                    <Calendar className="overview-box__icon" />
                    <span className="overview-box__label">Next date:</span>
                    <span className="overview-box__text">
                      {getClosestDate(tour.startDates)}
                    </span>
                  </div>
                  <div className="overview-box__detail">
                    <CgGym className="overview-box__icon" />
                    <span className="overview-box__label">Difficulty:</span>
                    <span className="overview-box__text">
                      {tour.difficulty}
                    </span>
                  </div>
                  <div className="overview-box__detail">
                    <User className="overview-box__icon" />
                    <span className="overview-box__label">Participants:</span>
                    <span className="overview-box__text">
                      {tour.maxGroupSize} people
                    </span>
                  </div>
                  <div className="overview-box__detail">
                    <Star className="overview-box__icon" />
                    <span className="overview-box__label">Rating:</span>
                    <span className="overview-box__text">
                      {tour.ratingsAverage} / 5
                    </span>
                  </div>
                </div>

                <div className="overview-box__group">
                  <h2 className="heading-secondary ma-bt-lg">
                    Your tour guides
                  </h2>
                  {tour.guides.map((guide, index) => {
                    return (
                      <div key={index} className="overview-box__detail">
                        <img
                          src={`http://localhost:8000/public/img/users/${guide.photo}`}
                          alt="Guide"
                          className="overview-box__img"
                          crossOrigin="anonymous"
                        />
                        <span className="overview-box__label">
                          {index === 0 ? 'Lead ' : 'Tour '}guide:
                        </span>
                        <span className="overview-box__text">{guide.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="description-box">
              <h2 className="heading-secondary ma-bt-lg">About {tour.name}</h2>
              <p className="description__text">{tour.description}</p>
            </div>
          </section>

          <section className="details-pictures">
            {tour.images.map((image, index) => {
              return (
                <div key={index} className="picture-box">
                  <img
                    className={`picture-box__img picture-box__img--${
                      index + 1
                    }`}
                    src={`http://localhost:8000/public/img/tours/${image}`}
                    alt={`${tour.name}-${index + 1}`}
                    crossOrigin="anonymous"
                  />
                </div>
              );
            })}
          </section>

          <section className="details-reviews">
            <h2 className="heading-primary">All Reviews</h2>
            <div className="reviews">
              {tour.reviews.length < 1 ? (
                <h3 className="no-results">There are no reviews yet!</h3>
              ) : (
                tour.reviews.map((review, index) => {
                  return (
                    <div key={index} className="reviews__card card-secondary">
                      <div className="card-secondary__avatar">
                        <img
                          src={`http://localhost:8000/public/img/users/${review.user.photo}`}
                          alt={review.user.name}
                          className="card-secondary__avatar-img"
                          crossOrigin="anonymous"
                        />
                        <h6 className="card-secondary__title">{review.user.name}</h6>
                      </div>
                      <p className="card-secondary__text">{review.review}</p>
                      <div className="card-secondary__rating">
                        {starCalc(review.rating)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {showForm && (
              <Form title="Review tour" onSubmit={handleReviewSubmit}>
                <Input
                  type="textarea"
                  name="review"
                  label="Review message"
                  isRequired="true"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <div className="form__group ma-bt-md">
                  <p className="form__label" htmlFor="rating">
                    Review rating
                  </p>
                  {[...Array(5)].map((star, index) => {
                    const currentRating = index + 1;
                    return (
                      <label key={index}>
                        <input
                          id="rating"
                          className="hidden"
                          type="radio"
                          name="rating"
                          value={currentRating}
                          onClick={() => setRating(currentRating)}
                        />
                        <Star
                          className={`reviews__star reviews__star--cta reviews__star--${
                            currentRating <= rating ? 'active' : 'inactive'
                          }`}
                        />
                      </label>
                    );
                  })}
                </div>
                <Submit submitText="Review tour" />
              </Form>
            )}
            {!showForm && (
              <Button
                color="white"
                value="New review"
                onClick={reviewFormHandler}
              />
            )}
          </section>

          <section className="details-cta">
            <div className="cta">
              <div className="cta__img">
                <img src="/img/logo-white.png" alt="Natours logo" />
              </div>

              <div className="cta__content">
                <h2 className="heading-secondary">What are you waiting for?</h2>
                <p className="cta__text">
                  {tour.duration} days. 1 adventure. Infinite memories. Make it
                  yours today!
                </p>
              </div>
              <div>
                <Button
                  color="green"
                  value={processing ? 'Processing...' : 'Book now!'}
                  onClick={bookTourHandler}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TourDetails;
