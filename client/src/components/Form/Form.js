import React, { useContext, useState } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import Alert from '../Alert/Alert';

const Form = (props) => {
  const { title } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Login submit
    if (title === 'login') {
      api
        .post('users/login', { email, password })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setMessage('You are successfully logged in!');
            setStatus('success');

            const userObject = {
              name: res.data.data.user.name,
              photo: res.data.data.user.photo,
            };
            localStorage.setItem('user', JSON.stringify(userObject));

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
          setMessage(err.response.data.error || 'Ops! Something went wrong!');
          setStatus('error');
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // Signup submit
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

            const userObject = {
              name: res.data.data.user.name,
              photo: res.data.data.user.photo,
            };
            localStorage.setItem('user', JSON.stringify(userObject));

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
          setMessage(err.response.data.message || 'Ops! Something went wrong!');
          setStatus('error');
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
    </form>
  );
};

export default Form;
