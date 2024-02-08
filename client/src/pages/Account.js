import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../store/AuthContext';
import { Link } from 'react-router-dom';
import Form from '../components/Form/Form';
import { IoSettingsOutline, IoMapOutline, IoKeyOutline } from 'react-icons/io5';
import { PiSuitcase, PiUsers } from 'react-icons/pi';
import { SlCreditCard } from 'react-icons/sl';
import Star from '../components/Icons/Star';
import api from '../utils/axiosConfig';

const Account = () => {
  const { isLoggedIn, setIsLoading } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [userNavActive, setUserNavActive] = useState(0);
  const [adminNavActive, setAdminNavActive] = useState(null);
  const [content, setContent] = useState('account-settings');

  useEffect(() => {
    if (!isLoggedIn) {
      document.title = 'Natours | Error';
      setIsLoading(false);
    } else {
      api
        .get('/users/me')
        .then((res) => setUser(res.data.data.data))
        .catch((err) => console.error(err));

      document.title = 'Natours | Account';
    }
  }, [isLoggedIn, setIsLoading]);

  const userNavList = [
    {
      value: 'Settings',
      icon: <IoSettingsOutline />,
      content: 'account-settings',
    },
    {
      value: 'Password',
      icon: <IoKeyOutline />,
      content: 'password-change',
    },
    {
      value: 'My bookings',
      icon: <PiSuitcase />,
    },
    {
      value: 'My reviews',
      icon: <Star />,
    },
    {
      value: 'Billing',
      icon: <SlCreditCard />,
    },
  ];

  const adminNavList = [
    {
      value: 'Manage tours',
      icon: <IoMapOutline />,
    },
    {
      value: 'Manage users',
      icon: <PiUsers />,
    },
    {
      value: 'Manage reviews',
      icon: <Star />,
    },
    {
      value: 'Manage bookings',
      icon: <PiSuitcase />,
    },
  ];

  return (
    <div className="spacer">
      {isLoggedIn ? (
        <div className="user-view">
          <nav className="user-view__menu">
            <ul className="side-nav ma-top-md">
              {userNavList.map((item, index) => (
                <li
                  key={index}
                  onClick={() => setUserNavActive(index)}
                  className={
                    userNavActive === index ? 'side-nav--active' : undefined
                  }
                >
                  <Link onClick={() => setContent(item.content)} to="#">
                    {item.icon}
                    {item.value}
                  </Link>
                </li>
              ))}
            </ul>

            {user.role === 'admin' && (
              <div className="ma-top-huge">
                <h5 className="side-nav__heading">Admin</h5>
                <ul className="side-nav">
                  {adminNavList.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => setAdminNavActive(index)}
                      className={adminNavActive === index && 'side-nav--active'}
                    >
                      <Link onClick={() => setContent(item.content)} to="#">
                        {item.icon}
                        {item.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
          <div className="user-view__content">
            {content ? (
              <Form title={content} userInfo={user} />
            ) : (
              <div className="spacer" style={{textAlign:'center'}}>
                <h2 className="heading-secondary ma-bt-lg">ToDo</h2>
                <p style={{fontSize:'2rem'}}><strong>This content does not exist yet!</strong></p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="error">
          <h2 className="heading-secondary heading-secondary--error">
            Halt! Protected route!
          </h2>
          <p className="error__msg">Please login to get access to this page.</p>
        </div>
      )}
    </div>
  );
};

export default Account;
