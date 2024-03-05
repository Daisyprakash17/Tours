import { Link } from 'react-router-dom';

const Button = (props) => {
  const { color, value, type, to, onClick } = props;

  if (type === 'link') {
    return (
      <Link className={`btn-text btn-text--${color}`} to={to} onClick={onClick}>
        {value}
      </Link>
    );
  }

  return (
    <button className={`btn btn--${color}`} onClick={onClick}>
      {value}
    </button>
  );
};

export default Button;
