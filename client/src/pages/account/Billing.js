import { useEffect, useMemo, useState } from 'react';
import api from '../../utils/axiosConfig';
import { humanReadableDate } from '../../helper/functions';
import { Link } from 'react-router-dom';
import SpLoading from '../../components/Spinner/SpLoading';

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [billings, setBillings] = useState({});
  const [filteredDate, setFilteredDate] = useState('');

  useEffect(() => {
    document.title = 'Natours | My billing';

    if (loading) {
      api
        .get('users/my-billings')
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            if (res.data.results <= 0) {
              return setBillings(null);
            }
            setBillings(res.data.data.billings);
          }
        })
        .then(() => setLoading(false))
        .catch((err) => {
          console.error(err);
        });
    }
  }, [loading]);

  const getBookingsDate = useMemo(() => {
    if (!loading && billings) {
      // Creates an array with all the booking dates
      const allDate = [];
      const formatDate = () => {
        billings.date.map((date) => {
          const dateOfBooking = humanReadableDate(new Date(date));
          // If two tours were booked on the same day,
          // the date is pushed only once in the array to avoid duplicates
          if (allDate.indexOf(dateOfBooking) === -1) {
            allDate.push(dateOfBooking);
          }
          return dateOfBooking;
        });
      };
      formatDate();
      return allDate;
    }
  }, [billings, loading]);

  return (
    <div className="main-container form">
      <h2 className="heading-secondary ma-bt-lg">My Billing</h2>
      {loading ? (
        <SpLoading centered />
      ) : !billings ? (
        <h1 className="no-results">There are no billings yet!</h1>
      ) : (
        <>
          <div className="ma-bt-md">
            <select onChange={(e) => setFilteredDate(e.target.value)}>
              <option value="">All</option>
              {/* Creates the rest of the options with all the booking dates */}
              {[...Array(getBookingsDate.length)].map((date, index) => {
                return (
                  <option value={getBookingsDate[index]} key={index}>
                    {getBookingsDate[index]}
                  </option>
                );
              })}
            </select>
          </div>
          {/* Shows only the results for the selected date */}
          {filteredDate
            ? billings.date
                .map((date, index) => {
                  return [
                    humanReadableDate(new Date(date)),
                    <div key={index} className="card-secondary content__card">
                      <div className="card-secondary__avatar">
                        <img
                          src={`https://natours-app-r8rd.onrender.com/public/img/tours/${billings.tour[index].imageCover}`}
                          alt={billings.tour[index].name}
                          className="card-secondary__avatar-img card-secondary__avatar-img--tour"
                          crossOrigin="anonymous"
                        />
                        <h6 className="card-secondary__title">
                          {billings.tour[index].name}
                        </h6>
                      </div>
                      <h3 className="ma-bt-lg">${billings.price[index]}</h3>
                      <Link
                        className="btn btn--small btn--green"
                        to={`/tour/${billings.tour[index].id}`}
                      >
                        Tour details
                      </Link>
                    </div>,
                  ];
                })
                .filter((date) => {
                  return date.includes(filteredDate);
                })
            : billings.date.map((date, index) => {
                // Shows all results
                return [
                  humanReadableDate(new Date(date)),
                  <div key={index} className="card-secondary content__card">
                    <div className="card-secondary__avatar">
                      <img
                        src={`https://natours-app-r8rd.onrender.com/public/img/tours/${billings.tour[index].imageCover}`}
                        alt={billings.tour[index].name}
                        className="card-secondary__avatar-img card-secondary__avatar-img--tour"
                        crossOrigin="anonymous"
                      />
                      <h6 className="card-secondary__title">
                        {billings.tour[index].name}
                      </h6>
                    </div>
                    <h3 className="ma-bt-lg">${billings.price[index]}</h3>
                    <Link
                      className="btn btn--small btn--green"
                      to={`/tour/${billings.tour[index].id}`}
                    >
                      Tour details
                    </Link>
                  </div>,
                ];
              })}
        </>
      )}
    </div>
  );
};

export default Billing;
