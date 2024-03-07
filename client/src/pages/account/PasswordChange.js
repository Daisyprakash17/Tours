import { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../../store/AlertContext';
import api from '../../utils/axiosConfig';
import Form from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import Submit from '../../components/Form/Submit';
import SpLoading from '../../components/Spinner/SpLoading';

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { setMessage, setStatus } = useContext(AlertContext);

  useEffect(() => {
    document.title = 'Natours | Change password';
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisabled(true);

    api
      .patch('users/updatePassword', {
        currentPassword,
        password,
        confirmPassword,
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setStatus('success');
          setMessage('Password successfully updated!');

          setCurrentPassword('');
          setPassword('');
          setConfirmPassword('');

          setDisabled(false);

          setTimeout(() => {
            setMessage('');
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');

        if (err.response.status === 429) {
          setMessage(err.response.data);
          setTimeout(() => {
            setMessage(null);
            setDisabled(false);
          }, 3000);
          return;
        }

        setMessage(
          err.response.data.message ||
            'Ops! Something went wrong, please try again.'
        );
        setDisabled(false);

        setTimeout(() => {
          setMessage('');
        }, 3000);
      });
  };

  return (
    <Form title="Change password" onSubmit={handleSubmit}>
      <Input
        name="currentPassword"
        label="Current password"
        type="password"
        placeholder="••••••••"
        isRequired="true"
        minLength="8"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
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
      {disabled ? <SpLoading /> : <Submit submitText="Save Password" />}
    </Form>
  );
};

export default PasswordChange;
