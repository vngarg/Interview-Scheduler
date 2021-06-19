export const getTime = (time) => {
  var hour = time.substring(11, 13);
  var minutes = time.substring(14, 16);

  return `${hour}:${minutes}`;
};
