import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { userStorage } from '../helper/functions';
import api from '../utils/axiosConfig';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Submit from '../components/Form/Submit';
import Alert from '../components/Alert/Alert';
import SpLoading from '../components/Spinner/SpLoading';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const params = useParams();
  const token = params.token;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Reset password';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);

    api
      .patch(`users/resetPassword/${token}`, { password, confirmPassword })
      .then((res) => {
        // console.log(res);
        setDisabled(false);

        if (res.status === 200) {
          setMessage('Password successfully reset');
          setStatus('success');
          setPassword('');
          setConfirmPassword('');
          userStorage(res.data.data.user.name, res.data.data.user.photo);

          setTimeout(() => {
            setMessage('');
            setIsLoggedIn(true);
            navigate('/');
          }, 600);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          err.response.data.message ||
            'Ops! Something went wrong, please try again.'
        );
        setStatus('error');
        setDisabled(false);

        setTimeout(() => {
          setMessage('');
        }, 1500);
      });
  };

  return (
    <div className="main-container">
      {message && <Alert status={status} message={message} />}
      <Form title="Reset password" onSubmit={handleSubmit}>
        <Input
          name="newPassword"
          label="New password"
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
        {disabled ? <SpLoading /> : <Submit submitText="Password Reset" />}
      </Form>
    </div>
  );
};

export default ResetPassword;
