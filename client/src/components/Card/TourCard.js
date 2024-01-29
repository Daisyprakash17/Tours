import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { GrLocation } from 'react-icons/gr';
import { IoCalendarClearOutline, IoFlagOutline } from 'react-icons/io5';
import { BiUser } from 'react-icons/bi';

const TourCard = () => {
  const [allTours, setAllTours] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Natours | All Tours';

    axios
      .get('http://127.0.0.1:8000/api/v1/tours')
      .then((res) => {
        // console.log(res);
        setAllTours(res.data.data.data);
      })
      .then(() => setLoading(false))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getClosestData = (data) => {
    const currentDate = new Date();
    return data.reduce(function (a, b) {
      let dateA = new Date(a);
      let dateB = new Date(b);

      // Convert ISO 8601 time date into plain English
      let dateStrA = dateA.toLocaleString('en-us', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      });

      let dateStrB = dateB.toLocaleString('en-us', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      });

      // Get the closest date to now
      const adiff = dateStrA - currentDate;
      return adiff > 0 && adiff < dateStrB - currentDate ? dateStrA : dateStrB;
    });
  };

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="card-container">
          {allTours.map((tour, index) => (
            <div key={index} className="card">
              <div className="card__header">
                <div className="card__picture">
                  <div className="card__picture-overlay">&nbsp;</div>
                  <img
                    src={`img/${tour.imageCover}`}
                    alt="Tour cover"
                    className="card__picture-img"
                  />
                </div>

                <h3 className="card__heading heading-tertirary">
                  <span>{tour.name}</span>
                </h3>
              </div>

              <div className="card__details">
                <h4 className="card__sub-heading">
                  {tour.difficulty} {tour.duration}-day tour
                </h4>
                <p className="card__summary">{tour.summary}.</p>
                <div className="card__data">
                  <GrLocation className="card__icon" />
                  <span>{tour.startLocation.description}</span>
                </div>
                <div className="card__data">
                  <IoCalendarClearOutline className="card__icon" />
                  <span>{getClosestData(tour.startDates)}</span>
                </div>
                <div className="card__data">
                  <IoFlagOutline className="card__icon" />
                  <span>{tour.locations.length} stops</span>
                </div>
                <div className="card__data">
                  <BiUser className="card__icon" />
                  <span>{tour.maxGroupSize} people</span>
                </div>
              </div>

              <div className="card__footer">
                <p>
                  <span className="card__footer-value">${tour.price} </span>
                  <span className="card__footer-text">per person</span>
                </p>
                <p className="card__ratings">
                  <span className="card__footer-value">
                    {tour.ratingsAverage}
                  </span>
                  <span className="card__footer-text">
                    {' '}
                    rating ({tour.ratingsQuantity})
                  </span>
                </p>
                <Link to="#" className="btn btn--green btn--small">
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TourCard;
