import React, { useEffect } from 'react';
import Form from '../components/Form/Form';

const ForgotPassword = () => {
  useEffect(() => {
    document.title = 'Natours | Forgot password';
  }, []);

  return (
    <div className="main-container">
      <Form content="forgotPassword" title="Forgot password" />
    </div>
  );
};

export default ForgotPassword;
