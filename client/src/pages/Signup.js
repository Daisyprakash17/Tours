import React, { useContext, useEffect, useState } from 'react';
import Alert from '../components/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import api from '../utils/axiosConfig';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Signup';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

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
  };

  return (
    <div className="spacer">
      {message && <Alert status={status} text={message} />}
      <form className="form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Signup;
