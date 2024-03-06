import { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../store/AlertContext';
import api from '../utils/axiosConfig';
import Form from '../components/Form/Form';
import Input from '../components/Form/Input';
import Submit from '../components/Form/Submit';
import SpLoading from '../components/Spinner/SpLoading';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(false);
  const { setMessage, setStatus } = useContext(AlertContext);

  useEffect(() => {
    document.title = 'Natours | Forgot password';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);

    api
      .post('users/forgotPassword', { email })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          setMessage('Link to reset password successfully sent to email');
          setStatus('success');
          setDisabled(false);

          setTimeout(() => {
            setMessage('');
          }, 1500);
        }
      })
      .catch((err) => {
        console.error(err);
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
          setMessage('');
        }, 1500);
      });
  };

  return (
    <div className="main-container">
      <Form title="Forgot password" onSubmit={handleSubmit}>
        <Input
          extraClass="ma-bt-md"
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          isRequired="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {disabled ? <SpLoading /> : <Submit submitText="Password reset" />}
      </Form>
    </div>
  );
};

export default ForgotPassword;
