import Star from "../components/Icons/Star";

export const getClosestDate = (date) => {
  const currentDate = new Date();
  return date.reduce(function (a, b) {
    let dateA = new Date(a);
    let dateB = new Date(b);

    // Convert ISO 8601 time date into plain English
    let dateStrA = dateA.toLocaleString('en-us', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    });

    let dateStrB = dateB.toLocaleString('en-us', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    });

    // Get the closest date to now
    const adiff = dateStrA - currentDate;
    return adiff > 0 && adiff < dateStrB - currentDate ? dateStrA : dateStrB;
  });
};

export const starCalc = (rating) => {
  let stars = [1, 2, 3, 4, 5];
  let classes = [];
  stars.forEach((star) => {
    rating >= star ? classes.push('active') : classes.push('inactive');
  });
  return classes.map((el) => <Star className={`reviews__star reviews__star--${el}`} />);
};
