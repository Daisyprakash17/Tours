import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
      <header className="header">
        <nav className="nav nav--tours xs-hidden">
          <Link to="/" className="nav__el">
            All tours
          </Link>
        </nav>
        <div className="header__logo">
          <img src="img/logo-white.png" alt="Natours logo" />
        </div>
        <nav className="nav nav--user xs-hidden">
          <button className="nav__el">Log in</button>
          <button className="nav__el nav__el--cta">Sign up</button>
        </nav>

        <div className="navigation">
            <input type="checkbox" className="navigation__checkbox" id="navi-toggle"></input>
            <label htmlFor="navi-toggle" className="navigation__button">
                <span className="navigation__icon"></span>
            </label>
            <nav className="navigation__nav">
                <ul className="navigation__list">
                    <li className="navigation__item"><Link to="/" className="navigation__link">All tours</Link></li>
                    <li className="navigation__item"><Link to="/log-in" className="navigation__link">Log in</Link></li>
                    <li className="navigation__item"><Link to="/sign-up" className="navigation__link">Sign up</Link></li>
                </ul>
            </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
