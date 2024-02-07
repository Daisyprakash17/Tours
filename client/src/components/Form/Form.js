import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import Alert from '../Alert/Alert';

const Form = (props) => {
  const { title, userInfo } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { setIsLoggedIn, setIsLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  // User storage
  const usrStorage = (name, photo) => {
    const userObject = {
      name,
      photo,
    };
    localStorage.setItem('user', JSON.stringify(userObject));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Login
    if (title === 'login') {
      api
        .post('users/login', { email, password })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setMessage('You are successfully logged in!');
            setStatus('success');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);

            setEmail('');
            setPassword('');

            setTimeout(() => {
              setMessage('');
              setIsLoggedIn(true);
              navigate('/');
            }, 600);
          }
        })
        .catch((err) => {
          console.error(err.response.data);
          setMessage(
            err.response.data.error ||
              'Ops! Something went wrong, please try again.'
          );
          setStatus('error');
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // Signup
    if (title === 'signup') {
      api
        .post('users/signup', {
          name,
          email,
          password,
          confirmPassword,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 201) {
            setStatus('success');
            setMessage('User successfully signed in!');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
              setMessage('');
              setIsLoggedIn(true);
              navigate('/');
            }, 600);
          }
        })
        .catch((err) => {
          console.error(err.response);
          setMessage(
            err.response.data.message ||
              'Ops! Something went wrong, please try again.'
          );
          setStatus('error');
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // User update name, email, photo
    if (title === 'account-settings') {
      api
        .patch('users/updateMe', { name, email, photo })
        .then((res) => {
          // console.log(res);

          if (res.status === 200) {
            setStatus('success');
            setMessage('User successfully updated!');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);

            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 0);

            setTimeout(() => {
              setMessage('');
            }, 1000);
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus('error');
          if (err.response.data.message.includes('dup key: { email')) {
            setMessage('This email is already in use!');
          } else if (err.response.data.message.includes('dup key: { name')) {
            setStatus('error');
            setMessage('User name already taken!');
          } else {
            setStatus('error');
            setMessage(
              err.response.data.message ||
                'Ops! Something went wrong, please try again.'
            );
          }

          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <Alert status={status} text={message} />}

      {/* ---- START LOGIN FORM ---- */}
      {title === 'login' && (
        <>
          <h2 className="heading-secondary ma-bt-lg">Log in</h2>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green">Login</button>
          </div>
        </>
      )}
      {/* ---- END LOGIN FORM ---- */}

      {/* ---- START SIGNUP FORM ---- */}
      {title === 'signup' && (
        <>
          <h2 className="heading-secondary ma-bt-lg">Sign up</h2>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="form__input"
              type="name"
              placeholder="Your Name"
              required
              minLength="6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength="8"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green">Signup</button>
          </div>
        </>
      )}
      {/* ---- END SIGNUP FORM ---- */}

      {/* ---- START ACCOUNT SETTINGS FORM ---- */}
      {title === 'account-settings' && (
        <>
          <h2 className="heading-secondary ma-bt-lg">Account settings</h2>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="form__input"
              type="name"
              placeholder="Your Name"
              required
              minLength="6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group form__photo-upload ma-bt-lg">
            <img
              className="form__user-photo"
              src={`/img/users/${userInfo.photo}`}
              alt={userInfo.name}
            />
            <Link to="#" className="btn-text">
              Choose new photo
            </Link>
          </div>
          <div className="form__group">
            <button className="btn btn--green">Save settings</button>
          </div>
        </>
      )}
      {/* ---- END ACCOUNT SETTINGS FORM ---- */}
    </form>
  );
};

export default Form;
