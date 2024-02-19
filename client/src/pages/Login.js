import { useContext, useEffect, useState } from 'react';
import { userStorage } from '../helper/functions';
import api from '../utils/axiosConfig';
import { AuthContext } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert/Alert';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Button from '../components/Button/Button';
import Submit from '../components/Form/Submit';

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
          userStorage(res.data.data.user.name, res.data.data.user.photo);

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
  };

  return (
    <div className="main-container">
      {message && <Alert status={status} message={message} />}
      <Form title="Log in" onSubmit={handleSubmit}>
        <Input
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          isRequired="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          isRequired="true"
          minLength="8"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="form__group ma-bt-md">
          <Button
            type="link"
            color="green"
            to="/forgot-password"
            value="Forgot password?"
          />
        </div>
        <Submit submitText="Login" />
      </Form>
    </div>
  );
};

export default Login;
