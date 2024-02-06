import { useEffect } from 'react';
import Form from '../components/Form/Form';

const Login = () => {
  useEffect(() => {
    document.title = 'Natours | Login';
  }, []);

  return (
    <div className="spacer">
      <Form title="login" />
    </div>
  );
};

export default Login;
