import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import { starCalc } from '../../helper/functions';
import Button from '../../components/Button/Button';
import Form from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import Star from '../../components/Icons/Star';
import Submit from '../../components/Form/Submit';
import Alert from '../../components/Alert/Alert';
import Popup from '../../components/Popup/Popup';
import SpLoading from '../../components/Spinner/SpLoading';

const MyReviews = () => {
  const [reviews, setReviews] = useState({});
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewId, setReviewId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = 'Natours | My Reviews';

    if (loading) {
      api
        .get('users/my-reviews')
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setReviews(res.data.data.myReviews);
          }
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

          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    }
  }, [loading]);

  const openReviewsPopup = (reviewID, currentReview, currentRating) => {
    setShowForm(true);
    setReviewId(reviewID);
    setReview(currentReview);
    setRating(currentRating);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);

    api
      .patch(`reviews/${reviewId}`, { review, rating })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setMessage('Review successfully updated');
          setStatus('success');
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
      .then(() => {
        setDisabled(false);
      })
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

        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  const deleteReviewPopupHandler = (reviewID) => {
    setReviewId(reviewID);
    setMessage('Are you sure you want to delete this review?');
    setStatus('confirmation');
  };

  const deleteReview = (reviewID) => {
    api
      .delete(`reviews/${reviewID}`)
      .then((res) => {
        // console.log(res);
        if (res.status === 204) {
          setMessage('Review successfully deleted');
          setStatus('success');
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
        setMessage('Ops! Something went wrong, please try again.');
        setStatus('error');

        setTimeout(() => {
          setMessage(null);
        }, 1500);
      });
  };

  const closeDeleteReviewPopup = () => {
    setMessage(null);
  };

  return (
    <div className="content">
      {message && (
        <Alert
          message={message}
          status={status}
          confirmHandler={() => deleteReview(reviewId)}
          deniesHandler={closeDeleteReviewPopup}
        />
      )}
      <h2 className="heading-secondary ma-bt-md">My Reviews</h2>
      {loading ? (
        <SpLoading />
      ) : (
        <div>
          {reviews.length <= 0 ? (
            <h3 className="no-results">There are no reviews yet!</h3>
          ) : (
            reviews.map((review, index) => (
              <Link
                to={`/tour/${review.tour.id}`}
                key={index}
                className="card-secondary content__card"
              >
                <div className="card-secondary__avatar">
                  <img
                    src={`https://natours-app-r8rd.onrender.com/public/img/tours/${review.tour.imageCover}`}
                    alt={review.tour.name}
                    className="card-secondary__avatar-img card-secondary__avatar-img--tour"
                    crossOrigin="anonymous"
                  />
                  <h6 className="card-secondary__title">{review.tour.name}</h6>
                </div>
                <p className="card-secondary__text">{review.review}</p>
                <div className="card-secondary__rating ma-bt-md">
                  {starCalc(review.rating)}
                </div>
                <div>
                  <Button
                    type="link"
                    color="green"
                    value="Edit"
                    onClick={() =>
                      openReviewsPopup(review.id, review.review, review.rating)
                    }
                  />{' '}
                  or{' '}
                  <Button
                    type="link"
                    onClick={() => deleteReviewPopupHandler(review.id)}
                    color="red"
                    to="#"
                    value="Delete"
                  />
                </div>
              </Link>
            ))
          )}
        </div>
      )}
      {showForm && (
        <Popup onClose={() => setShowForm(false)}>
          <Form title="Edit review" onSubmit={handleSubmit}>
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
            {disabled ? <SpLoading /> : <Submit submitText="Update review" />}
          </Form>
        </Popup>
      )}
    </div>
  );
};

export default MyReviews;
