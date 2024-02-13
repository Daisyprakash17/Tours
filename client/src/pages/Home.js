import React, { useEffect } from 'react';
import TourCard from '../components/Card/TourCard';

const Home = () => {
  
  useEffect(() => {
    document.title = 'Natours | All Tours';
  }, []);

  return (
    <div className="main-container">
      <TourCard />
    </div>
  );
};

export default Home;
