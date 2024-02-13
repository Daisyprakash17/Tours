import React, { useEffect } from 'react';
import Form from '../components/Form/Form';

const ForgotPassword = () => {
  useEffect(() => {
    document.title = 'Natours | Forgot password';
  }, []);

  return (
    <div className="spacer">
      <Form content="forgotPassword" />
    </div>
  );
};

export default ForgotPassword;
