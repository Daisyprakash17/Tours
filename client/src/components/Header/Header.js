import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';

const Header = () => {
  const [user, setUser] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/v1/users/me', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUser(res.data.data.data);
        }
      });
  }, []);

  const logOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="header">
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
          {isLoggedIn ? (
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
              {isLoggedIn ? (
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
