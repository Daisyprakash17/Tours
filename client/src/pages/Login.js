import React, { useContext, useEffect, useState } from 'react';
import Alert from '../components/Alert/Alert';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import api from '../utils/axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Login';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    api
      .post('users/login', { email, password })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setMessage('You are successfully logged in!');
          setStatus('success');

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
  };

  return (
    <div className="spacer">
      {message && <Alert status={status} text={message} />}
      <form className="form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Login;
