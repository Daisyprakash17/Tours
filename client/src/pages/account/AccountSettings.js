import { useContext, useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import { userStorage } from '../../helper/functions';
import { AuthContext } from '../../store/AuthContext';
import { AlertContext } from '../../store/AlertContext';
import Form from '../../components/Form/Form';
import Input from '../../components/Form/Input';
import Submit from '../../components/Form/Submit';
import SpLoading from '../../components/Spinner/SpLoading';

const AccountSettings = ({ userInfo }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [imgData, setImgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setIsLoading } = useContext(AuthContext);
  const { setMessage, setStatus } = useContext(AlertContext);

  useEffect(() => {
    if (userInfo.name && userInfo.email) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setLoading(false);
    }

    document.title = 'Natours | Account settings';
  }, [userInfo.email, userInfo.name]);

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
          userStorage(res.data.data.user.name, res.data.data.user.photo,res.data.token);
          setPhoto('');
          setImgData(
            `https://natours-app-r8rd.onrender.com/public/img/users/${res.data.data.user.photo}`
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

        if (err.response.status === 429) {
          setMessage(err.response.data);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          return;
        }

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
          setMessage(null);
        }, 3000);
      });
  };

  return (
    <Form title="Account settings" onSubmit={handleSubmit}>
      {loading ? (
        <SpLoading />
      ) : (
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
                  : `https://natours-app-r8rd.onrender.com/public/img/users/${userInfo.photo}`
              }
              alt={userInfo.name}
              crossOrigin="anonymous"
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
    </Form>
  );
};

export default AccountSettings;
