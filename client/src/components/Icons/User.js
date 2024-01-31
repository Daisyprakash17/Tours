import React from 'react';
import { BiUser } from 'react-icons/bi';

const User = (props) => {
  const { className } = props;
  return <BiUser className={className} />;
};

export default User;
