import { useContext, useEffect, useState } from 'react';
import Form from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import Alert from '../../components/Alert/Alert';
import Submit from '../../components/Form/Submit';
import api from '../../utils/axiosConfig';
import { AuthContext } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Natours | Delete account';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Are you sure you want to delete your account?');
    setStatus('confirmation');
  };

  const deleteAccount = (e) => {
    e.preventDefault();
    setMessage(null);
    setDisabled(true);

    api
      .post('users/deleteMe', { password })
      .then((res) => {
        // console.log(res);

        if (res.status === 204) {
          setDisabled(false);
          setMessage('Account successfully deleted!');
          setStatus('success');

          // Remove user from storage and redirect to home page
          setTimeout(() => {
            setMessage(null);
            setIsLoggedIn(false);
            localStorage.clear();
            navigate('/');
          }, 550);
        }
      })
      .catch((err) => {
        console.error(err);
        setDisabled(false);
        setMessage(
          err.response.data.message ||
            'Ops! Something went wrong, please try again.'
        );
        setStatus('error');

        setTimeout(() => {
          setMessage(null);
          setStatus(null);
        }, 1500);
      });
  };

  const closePopup = (e) => {
    e.preventDefault();
    setPassword('');
    setMessage('Account deletion failed.');
    setStatus('error');

    setTimeout(() => {
      setMessage(null);
      setStatus(null);
    }, 1000);
  };

  return (
    <Form title="Delete accout" onSubmit={handleSubmit}>
      {message && (
        <Alert
          status={status}
          message={message}
          confirmHandler={deleteAccount}
          deniesHandler={closePopup}
        />
      )}
      <Input
        extraClass="ma-bt-md"
        name="currentPassword"
        label="Your password"
        type="password"
        placeholder="••••••••"
        isRequired="true"
        minLength="8"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Submit submitText={disabled ? 'Deleting...' : 'Delete'} />
      <div className="note ma-top-md">
        <strong>Note:</strong>{' '}
        <span>
          once you perform this action you will not be able to go back.
        </span>
      </div>
    </Form>
  );
};

export default DeleteAccount;
