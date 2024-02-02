import React from 'react'

const Alert = (props) => {
    const {status, text} = props;
  return (
    <div className={`alert alert--${status}`}>
        <p>{text}</p>
    </div>
  )
}

export default Alert