import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';
import api from '../../utils/axiosConfig';
import Alert from '../Alert/Alert';

const Header = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      const loggedInUser = localStorage.getItem('user');
      setUser(JSON.parse(loggedInUser));
    }
  }, [isLoggedIn]);

  const logOut = () => {
    api
      .get('users/logout')
      .then((res) => {
        // console.log(res);
        if (res.data.status === 'success') {
          setIsLoggedIn(false);
          localStorage.clear();
          setMessage('successfully logged out');
          setStatus('success');

          setTimeout(() => {
            setMessage('');
          }, 600);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage('Ops, something went wrong. Try logging out again!');
        setStatus('error');

        setTimeout(() => {
          setMessage('');
        }, 3000);
      });
  };

  return (
    <>
      <header className="header">
        {message && <Alert status={status} text={message} />}
        {/* Desktop navigation */}
        <nav className="nav nav--tours xs-hidden">
          <Link to="/" className="nav__el">
            All tours
          </Link>
        </nav>
        <div className="header__logo">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <nav className="nav nav--user xs-hidden">
          {isLoggedIn && user ? (
            <Link to="/me" className="nav__el">
              <img
                className="nav__user-img"
                src={`/img/users/${user.photo}`}
                alt={`User ${user.name}`}
              />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <>
              <Link to="/log-in" className="nav__el">
                Log in
              </Link>
              <Link to="sign-up" className="nav__el nav__el--cta">
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile navigation */}
        <div className="navigation">
          <input
            type="checkbox"
            className="navigation__checkbox"
            id="navi-toggle"
          ></input>
          <label htmlFor="navi-toggle" className="navigation__button">
            <span className="navigation__icon"></span>
          </label>
          <nav className="navigation__nav">
            <ul className="navigation__list">
              <li className="navigation__item">
                <Link to="/" className="navigation__link">
                  All tours
                </Link>
              </li>
              {isLoggedIn && user ? (
                <>
                  <li className="navigation__item">
                    <Link to="/me" className="navigation__link">
                      Profile
                    </Link>
                  </li>
                  <li className="navigation__item">
                    <Link to="#" className="navigation__link" onClick={logOut}>
                      Log out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="navigation__item">
                    <Link to="/log-in" className="navigation__link">
                      Log in
                    </Link>
                  </li>
                  <li className="navigation__item">
                    <Link to="/sign-up" className="navigation__link">
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
