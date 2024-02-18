import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axiosConfig';
import Alert from '../Alert/Alert';
import Input from './Input';
import Submit from './Submit';
import Button from '../Button/Button';

const Form = (props) => {
  const { content, title, userInfo } = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [imgData, setImgData] = useState(null);
  const { setIsLoggedIn, setIsLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  // User storage
  const usrStorage = (name, photo) => {
    const userObject = {
      name,
      photo,
    };
    localStorage.setItem('user', JSON.stringify(userObject));
  };

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Login
    if (content === 'login') {
      api
        .post('users/login', { email, password })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setMessage('You are successfully logged in!');
            setStatus('success');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);

            setEmail('');
            setPassword('');

            setTimeout(() => {
              setMessage('');
              setIsLoggedIn(true);
              navigate('/');
            }, 600);
          }
        })
        .catch((err) => {
          console.error(err.response.data);
          setMessage(
            err.response.data.error ||
              'Ops! Something went wrong, please try again.'
          );
          setStatus('error');
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // Signup
    if (content === 'signup') {
      api
        .post('users/signup', {
          name,
          email,
          password,
          confirmPassword,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 201) {
            setStatus('success');
            setMessage('User successfully signed in!');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setTimeout(() => {
              setMessage('');
              setIsLoggedIn(true);
              navigate('/');
            }, 600);
          }
        })
        .catch((err) => {
          console.error(err.response);
          setMessage(
            err.response.data.message ||
              'Ops! Something went wrong, please try again.'
          );
          setStatus('error');
          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // User update name, email, photo
    if (content === 'account-settings') {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('name', name);
      formData.append('email', email);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      };

      api
        .patch('users/updateMe', formData, config)
        .then((res) => {
          // console.log(res);

          if (res.data.status === 'error') {
            setStatus('error');
            setMessage(
              res.data.message || 'Ops! Something went wrong, please try again.'
            );

            setTimeout(() => {
              setMessage('');
            }, 1500);

            return;
          }

          if (res.status === 200) {
            setStatus('success');
            setMessage('User successfully updated!');
            usrStorage(res.data.data.user.name, res.data.data.user.photo);
            setPhoto('');
            setImgData(
              `http://localhost:8000/public/img/users/${res.data.data.user.photo}`
            );

            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 100);

            setTimeout(() => {
              setMessage('');
            }, 1000);
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus('error');
          if (err.response.data.message.includes('dup key: { email')) {
            setMessage('This email is already in use!');
          } else if (err.response.data.message.includes('dup key: { name')) {
            setStatus('error');
            setMessage('User name already taken!');
          } else {
            setStatus('error');
            setMessage(
              err.response.data.message ||
                'Ops! Something went wrong, please try again.'
            );
          }

          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // Update password
    if (content === 'password-change') {
      setDisabled(true);
      api
        .patch('users/updatePassword', {
          currentPassword,
          password,
          confirmPassword,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setStatus('success');
            setMessage('Password successfully updated!');

            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');

            setDisabled(false);

            setTimeout(() => {
              setMessage('');
            }, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus('error');
          setMessage(
            err.response.data.message ||
              'Ops! Something went wrong, please try again.'
          );

          setTimeout(() => {
            setMessage('');
          }, 3000);
        });
    }

    // Forgot password
    if (content === 'forgotPassword') {
      setDisabled(true);
      api
        .post('users/forgotPassword', { email })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            setMessage('Link to reset password successfully sent to email');
            setStatus('success');
            setDisabled(false);

            setTimeout(() => {
              setMessage('');
            }, 1500);
          }
        })
        .catch((err) => {
          console.error(err);
          setMessage(
            err.response.data.message ||
              'Ops! Something went wrong, please try again.'
          );
          setStatus('error');

          setTimeout(() => {
            setMessage('');
          }, 1500);
        });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {message && <Alert status={status} message={message} />}
      <h2 className="heading-secondary ma-bt-lg">{title}</h2>

      {/* ---- START LOGIN FORM ---- */}
      {content === 'login' && (
        <>
          <Input
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="form__group ma-bt-md">
            <Button
              type="link"
              color="green"
              to="/forgot-password"
              value="Forgot password?"
            />
          </div>
          <Submit submitText="Login" />
        </>
      )}
      {/* ---- END LOGIN FORM ---- */}

      {/* ---- START SIGNUP FORM ---- */}
      {content === 'signup' && (
        <>
          <Input
            name="name"
            label="Name"
            type="text"
            placeholder="Your Name"
            isRequired="true"
            minLength="6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            extraClass="ma-bt-md"
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Submit submitText="Signup" />
        </>
      )}
      {/* ---- END SIGNUP FORM ---- */}

      {/* ---- START FORGOT PASSWORD FORM ---- */}
      {content === 'forgotPassword' && (
        <>
          <Input
            extraClass="ma-bt-md"
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Submit submitText={disabled ? 'Email sending...' : 'Password reset'} />
        </>
      )}
      {/* ---- END FORGOT PASSWORD FORM ---- */}

      {/* ---- START ACCOUNT SETTINGS FORM ---- */}
      {content === 'account-settings' && (
        <>
          <Input
            name="name"
            label="Name"
            type="text"
            placeholder="Your Name"
            isRequired="true"
            minLength="6"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            extraClass="ma-bt-md"
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            isRequired="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="form__group form__photo-upload ma-bt-lg">
            <img
              className="form__user-photo"
              src={
                imgData
                  ? imgData
                  : `http://localhost:8000/public/img/users/${userInfo.photo}`
              }
              alt={userInfo.name}
              crossorigin="anonymous"
            />
            <input
              className="hidden"
              type="file"
              accept="image/*"
              id="photo"
              name="photo"
              onChange={onChangePicture}
            />
            <span className="form__selected-file">{photo && photo.name}</span>
            <label htmlFor="photo" className="form__label--upload">
              Choose new photo
            </label>
          </div>
          <Submit submitText="Save settings" />
        </>
      )}
      {/* ---- END ACCOUNT SETTINGS FORM ---- */}

      {/* ---- START PASSWORD CHANGE FORM ---- */}
      {content === 'password-change' && (
        <>
          <Input
            name="currentPassword"
            label="Current password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            name="newPassword"
            label="New password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            extraClass="ma-bt-md"
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            isRequired="true"
            minLength="8"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Submit submitText={disabled ? 'Updating...' : 'Save Password'} />
        </>
      )}
      {/* ---- END PASSWORD CHANGE FORM ---- */}
    </form>
  );
};

export default Form;
