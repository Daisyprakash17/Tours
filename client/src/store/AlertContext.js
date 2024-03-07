import { createContext, useState } from 'react';
import Alert from '../components/Alert/Alert';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  return (
    <AlertContext.Provider
      value={{
        setMessage,
        setStatus,
      }}
    >
      {message && <Alert message={message} status={status} />}
      {children}
    </AlertContext.Provider>
  );
};
