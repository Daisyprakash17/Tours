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
