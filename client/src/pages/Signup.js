import { useEffect } from 'react';
import Form from '../components/Form/Form';

const Signup = () => {
  useEffect(() => {
    document.title = 'Natours | Signup';
  }, []);

  return (
    <div className="main-container">
      <Form content="signup" />
    </div>
  );
};

export default Signup;
