import { useEffect } from 'react';
import Form from '../components/Form/Form';

const Login = () => {
  useEffect(() => {
    document.title = 'Natours | Login';
  }, []);

  return (
    <div className="main-container">
      <Form content="login" title="Log in" />
    </div>
  );
};

export default Login;
