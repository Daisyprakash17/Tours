import React from 'react';

const Alert = (props) => {
  const { status, message, confirmHandler, deniesHandler } = props;
  return (
    <div className={`alert alert--${status}`}>
      <p>{message}</p>
      {status === 'confirmation' && (
        <div className="alert__btns ma-top-md">
          <button onClick={confirmHandler} className="btn btn--green">
            Yes
          </button>
          <button onClick={deniesHandler} className="btn btn--white">
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Alert;
