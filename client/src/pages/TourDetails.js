import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getClosestData } from '../helper/functions';
import { FaRegClock, FaRegStar } from 'react-icons/fa6';
import { CgGym } from 'react-icons/cg';
import Calendar from '../components/Icons/Calendar';
import Location from '../components/Icons/Location';
import User from '../components/Icons/User';

const TourDetails = () => {
  const [tour, setTour] = useState({});
  const [loading, setLoading] = useState(true);
  let params = useParams();
  let id = params.id;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/v1/tours/${id}`)
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
                src={`/img/tours/${tour.imageCover}`}
                alt={tour.name}
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

          <div className="details-description">
            <div className="overview-box">
              <div>
                <div className="overview-box__group">
                  <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
                  <div className="overview-box__detail">
                    <Calendar className="overview-box__icon" />
                    <span className="overview-box__label">Next date:</span>
                    <span className="overview-box__text">
                      {getClosestData(tour.startDates)}
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
                    <FaRegStar className="overview-box__icon" />
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
                          src={`/img/users/${guide.photo}`}
                          alt="Guide"
                          className="overview-box__img"
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
          </div>
        </div>
      )}
    </>
  );
};

export default TourDetails;
