import React, { useEffect, useState } from 'react';
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

const TourDetails = () => {
  const [tour, setTour] = useState({});
  const [loading, setLoading] = useState(true);
  let params = useParams();
  let id = params.id;

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
  }, [id, tour.name]);

  return (
    <>
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
                          crossorigin="anonymous"
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
                <div key={image} className="picture-box">
                  <img
                    className={`picture-box__img picture-box__img--${
                      index + 1
                    }`}
                    src={`http://localhost:8000/public/img/tours/${image}`}
                    alt={`${tour.name}-${index + 1}`}
                    crossorigin="anonymous"
                  />
                </div>
              );
            })}
          </section>

          <section className="details-reviews">
            <h2 className="heading-primary">All Reviews</h2>
            <div className="reviews">
              {tour.reviews.length < 1 ? (
                <h3 className="no-reviews">There are no reviews yet!</h3>
              ) : (
                tour.reviews.map((review, index) => {
                  return (
                    <div key={index} className="reviews__card">
                      <div className="reviews__avatar">
                        <img
                          src={`http://localhost:8000/public/img/users/${review.user.photo}`}
                          alt={review.user.name}
                          className="reviews__avatar-img"
                          crossorigin="anonymous"
                        />
                        <h6 className="reviews__user">{review.user.name}</h6>
                      </div>
                      <p className="reviews__text">{review.review}</p>
                      <div className="reviews__rating">
                        {starCalc(review.rating)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Button color="white" value="New review" />
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
                <Button color="green" value="Book now!" />
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TourDetails;
