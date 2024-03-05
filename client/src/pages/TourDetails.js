import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClosestDate, starCalc } from '../helper/functions';
import { AuthContext } from '../store/AuthContext';
import api from '../utils/axiosConfig';
import { FaRegClock } from 'react-icons/fa6';
import { CgGym } from 'react-icons/cg';
import Calendar from '../components/Icons/Calendar';
import Location from '../components/Icons/Location';
import User from '../components/Icons/User';
import Star from '../components/Icons/Star';
import Button from '../components/Button/Button';
import Alert from '../components/Alert/Alert';
import Submit from '../components/Form/Submit';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Popup from '../components/Popup/Popup';
import CtaCard from '../components/Card/CtaCard';
import SpLoading from '../components/Spinner/SpLoading';

const TourDetails = () => {
  const [tour, setTour] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [userCanReview, setUserCanReview] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);
  let params = useParams();
  let id = params.id;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Show the review form if the user is logged in
  const reviewFormHandler = () => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      setStatus('error');
      setMessage('Please login to perform this action');

      setTimeout(() => {
        setMessage(null);
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
          setReview('');
          setRating(null);
          setShowForm(false);
          setLoading(true);

          setTimeout(() => {
            setLoading(false);
          }, 0);

          setTimeout(() => {
            setMessage(null);
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');

        if (err.response.status === 403) {
          setMessage(
            err.response.message ||
              'You do not have permission to perform this action'
          );

          setTimeout(() => {
            setMessage(null);
          }, 1500);

          return;
        }

        if (err.response.data.message.code === 11000) {
          setMessage(
            'please make sure you have not already reviewed this tour!'
          );

          setTimeout(() => {
            setMessage(null);
          }, 1500);

          return;
        }

        if (err.response.data.message.message) {
          if (err.response.data.message.message.includes('failed: rating')) {
            setMessage('Please make sure to select at least one star');

            setTimeout(() => {
              setMessage(null);
            }, 1500);

            return;
          }

          setMessage(err.response.data.message.message);
        } else {
          setMessage('Ops! Something went wrong, please try again.');
        }

        setTimeout(() => {
          setMessage(null);
        }, 2500);
      });
  };

  // Tour booking
  const bookTourHandler = () => {
    // Check if the user is logged in
    if (!isLoggedIn) {
      setStatus('error');
      setMessage('Please login to perform this action');

      setTimeout(() => {
        setMessage(null);
      }, 1500);

      return;
    }

    setProcessing(true);

    api
      .get(`bookings/checkout-session/${id}`)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          window.location.href = res.data.session.url;
        }
      })
      .then(() => setProcessing(false))
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage(
          err.response.data.message ||
            'Ops! Something went wrong, please try again.'
        );

        setTimeout(() => {
          setMessage(null);
          setProcessing(false);
        }, 1500);
      });
  };

  const navigateHandler = () => {
    navigate('/');
    window.scrollTo(0, 0);
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
        console.error(err);
      });

    document.title = `Natours | ${tour.name}`;

    // Check if the user has already reviewed the tour
    if (!loading && user) {
      tour.reviews.map((review) => {
        if (review.user.name !== user.name) {
          return setUserCanReview(true);
        } else {
          return setUserCanReview(false);
        }
      });
    }
  }, [id, tour.name, tour.ratingsAverage, review, loading]);

  return (
    <>
      {message && <Alert status={status} message={message} />}
      {showForm && (
        <Popup onClose={() => setShowForm(false)}>
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
        </Popup>
      )}
      {loading ? (
        <SpLoading centered />
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
                          src={`http://localhost:8000/public/img/users/${
                            review.user ? review.user.photo : 'default.jpg'
                          }`}
                          alt={review.user ? review.user.name : 'Deleted user'}
                          className="card-secondary__avatar-img"
                          crossOrigin="anonymous"
                        />
                        <h6 className="card-secondary__title">
                          {review.user
                            ? review.user.name.split(' ')[0]
                            : 'Deleted user'}
                        </h6>
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
            {/* Hide the button from users who have already reviewed the tour */}
            {userCanReview && (
              <Button
                color="white"
                value="New review"
                onClick={reviewFormHandler}
              />
            )}
          </section>

          {tour.bookings.length < tour.maxGroupSize ? (
            <CtaCard
              headline="What are you waiting for?"
              text={`${tour.duration} days. 1 adventure. Infinite memories. Make
                      it yours today!`}
              cta={
                processing ? (
                  <SpLoading />
                ) : (
                  <Button
                    color="green"
                    value="Book now!"
                    onClick={bookTourHandler}
                  />
                )
              }
            />
          ) : (
            <CtaCard
              headline="Uh-Oh! This tour has sold out!"
              text="Come back in a few days to check for other available
                      dates."
              cta={
                <Button
                  color="green"
                  value="All tours"
                  onClick={navigateHandler}
                />
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default TourDetails;
