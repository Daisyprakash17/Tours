import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../store/AuthContext';
import { AlertContext } from '../../store/AlertContext';
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { RiHome2Line } from 'react-icons/ri';
import api from '../../utils/axiosConfig';
import User from '../Icons/User';
import SpLoading from '../Spinner/SpLoading';

const Header = () => {
  const [user, setUser] = useState(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const { isLoggedIn, setIsLoggedIn, isLoading } = useContext(AuthContext);
  const { setMessage, setStatus } = useContext(AlertContext);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      const loggedInUser = localStorage.getItem('user');
      setUser(JSON.parse(loggedInUser));
    }
  }, [isLoading, isLoggedIn]);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current.contains(e.target)) setSubMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  const logOut = () => {
    api
      .get('users/logout')
      .then((res) => {
        // console.log(res);
        if (res.data.status === 'success') {
          setIsLoggedIn(false);
          setSubMenuOpen(false);
          localStorage.clear();
          setMessage('successfully logged out');
          setStatus('success');
          setChecked(false);
          navigate('/');

          setTimeout(() => {
            setMessage('');
          }, 600);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');

        if (err.response.status === 429) {
          setMessage(err.response.data);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          return;
        }

        setMessage('Ops, something went wrong. Try logging out again!');

        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  const toggleMenu = () => {
    setSubMenuOpen((prevOpen) => !prevOpen);
  };

  const toggleMobileMenu = () => {
    setChecked((prevChecked) => !prevChecked);
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
        <nav ref={menuRef} className="nav nav--user xs-hidden">
          {isLoading ? (
            <SpLoading />
          ) : isLoggedIn && user ? (
            <div className="nav__el" onClick={toggleMenu}>
              <img
                className="nav__user-img"
                src={`http://localhost:8000/public/img/users/${user.photo}`}
                alt={`User ${user.name}`}
                crossOrigin="anonymous"
              />
              <span>{user.name.split(' ')[0]}</span>
            </div>
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

          <ul
            className={`sub-nav sub-nav--${
              subMenuOpen ? 'active' : 'inactive'
            }`}
          >
            <li className="sub-nav__item ma-bt-md">
              <User className="sub-nav__icon" />
              <Link className="nav__el" to="/me" onClick={toggleMenu}>
                Profile
              </Link>
            </li>
            <li className="sub-nav__item ma-bt-md">
              <BiLogOut className="sub-nav__icon" />
              <Link className="nav__el" onClick={logOut} to="/">
                Log out
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile navigation */}
        <div className="navigation">
          <input
            type="checkbox"
            className="navigation__checkbox"
            id="navi-toggle"
            checked={checked}
          ></input>
          <label htmlFor="navi-toggle" className="navigation__button">
            <span
              className="navigation__icon"
              onClick={toggleMobileMenu}
            ></span>
          </label>
          <nav className="navigation__nav">
            <ul className="navigation__list">
              <li className="navigation__item">
                <RiHome2Line className="navigation__item-icon" />
                <Link
                  to="/"
                  className="navigation__link"
                  onClick={toggleMobileMenu}
                >
                  All tours
                </Link>
              </li>
              {isLoggedIn && user ? (
                <>
                  <li className="navigation__item">
                    <User className="navigation__item-icon" />
                    <Link
                      to="/me"
                      className="navigation__link"
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="navigation__item">
                    <BiLogOut className="navigation__item-icon" />
                    <Link to="#" className="navigation__link" onClick={logOut}>
                      Log out
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="navigation__item">
                    <BiLogIn className="navigation__item-icon" />
                    <Link
                      to="/log-in"
                      className="navigation__link"
                      onClick={toggleMobileMenu}
                    >
                      Log in
                    </Link>
                  </li>
                  <li className="navigation__item">
                    <BiLogIn className="navigation__item-icon" />
                    <Link
                      to="/sign-up"
                      className="navigation__link"
                      onClick={toggleMobileMenu}
                    >
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
