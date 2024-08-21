import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStorage } from '../helper/functions';
import { AuthContext } from '../store/AuthContext';
import { AlertContext } from '../store/AlertContext';
import api from '../utils/axiosConfig';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Button from '../components/Button/Button';
import Submit from '../components/Form/Submit';
import SpLoading from '../components/Spinner/SpLoading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setMessage, setStatus } = useContext(AlertContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Login';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);

    api
      .post('users/login', { email, password })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setMessage('You are successfully logged in!');
          setStatus('success');
          userStorage(res.data.data.user.name, res.data.data.user.photo,res.data.token);

          setEmail('');
          setPassword('');
          setIsLoggedIn(true);
          navigate('/');

          setTimeout(() => {
            setMessage(null);
          }, 1000);
        }
      })
      .then(() => setDisabled(false))
      .catch((err) => {
        console.error(err.response.data);
        setStatus('error');

        if (err.response.status === 429) {
          setMessage(err.response.data);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          return;
        }

        setMessage(
          err.response.data.error ||
            'Ops! Something went wrong, please try again.'
        );

        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  return (
    <div className="main-container">
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
        {disabled ? <SpLoading /> : <Submit submitText="Login" />}
      </Form>
    </div>
  );
};

export default Login;
