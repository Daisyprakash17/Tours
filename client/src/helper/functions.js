import Star from '../components/Icons/Star';

// Convert ISO 8601 time date into plain English
export const humanReadableDate = (date) => {
  return date.toLocaleString('en-us', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });
};

// Get the closest date to the current one
export const getClosestDate = (date) => {
  const currentDate = new Date();
  return date.reduce(function (a, b) {
    let dateA = new Date(a);
    let dateB = new Date(b);

    // Convert ISO 8601 time date into plain English
    let dateStrA = humanReadableDate(dateA);
    let dateStrB = humanReadableDate(dateB);

    // Get the closest date to now
    const adiff = dateStrA - currentDate;
    return adiff > 0 && adiff < dateStrB - currentDate ? dateStrA : dateStrB;
  });
};

// Displays the current review average with stars (1 to 5)
export const starCalc = (rating) => {
  let stars = [1, 2, 3, 4, 5];
  let classes = [];
  stars.forEach((star) => {
    rating >= star ? classes.push('active') : classes.push('inactive');
  });
  return classes.map((el) => (
    <Star className={`reviews__star reviews__star--${el}`} />
  ));
};

// Set username and photo to localstorage
export const userStorage = (name, photo) => {
  const userObject = {
    name,
    photo,
  };
  localStorage.setItem('user', JSON.stringify(userObject));
};
