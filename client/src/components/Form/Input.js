import React from 'react';

const Input = (props) => {
  const {
    label,
    name,
    type,
    onChange,
    placeholder,
    value,
    isRequired,
    minLength,
    extraClass,
  } = props;
  return (
    <div className={`form__group${extraClass ? ' ' + extraClass : ''}`}>
      <label className="form__label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        className="form__input"
        type={type}
        placeholder={placeholder}
        required={isRequired}
        minLength={minLength}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
