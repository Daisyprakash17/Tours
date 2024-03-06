import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStorage } from '../helper/functions';
import { AuthContext } from '../store/AuthContext';
import { AlertContext } from '../store/AlertContext';
import api from '../utils/axiosConfig';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Submit from '../components/Form/Submit';
import SpLoading from '../components/Spinner/SpLoading';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const { setMessage, setStatus } = useContext(AlertContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Signup';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);

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
          userStorage(res.data.data.user.name, res.data.data.user.photo);

          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');

          setIsLoggedIn(true);
          navigate('/');

          setTimeout(() => {
            setMessage(null);
          }, 1000);
        }
      })
      .then(() => setDisabled(false))
      .catch((err) => {
        console.error(err.response);
        setStatus('error');
        setDisabled(false);

        if (err.response.status === 429) {
          setMessage(err.response.data);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          return;
        }

        setMessage(
          err.response.data.message ||
            'Ops! Something went wrong, please try again.'
        );

        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
  };

  return (
    <div className="main-container">
      <Form title="Sign up" onSubmit={handleSubmit}>
        <Input
          name="name"
          label="Name"
          type="text"
          placeholder="Your Name"
          isRequired="true"
          minLength="6"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <Input
          extraClass="ma-bt-md"
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          isRequired="true"
          minLength="8"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {disabled ? <SpLoading /> : <Submit submitText="Signup" />}
      </Form>
    </div>
  );
};

export default Signup;
