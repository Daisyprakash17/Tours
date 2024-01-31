import React from 'react';
import { FaRegStar } from 'react-icons/fa6';

const Star = (props) => {
  const { className } = props;
  return <FaRegStar className={className} />;
};

export default Star;
