export const getDate = (date) => {
  var year = date.substring(0, 4);
  var day = date.substring(8, 10);
  var month = date.substring(5, 7);

  if (month === "01") month = "January";
  else if (month === "02") month = "February";
  else if (month === "03") month = "March";
  else if (month === "04") month = "April";
  else if (month === "05") month = "May";
  else if (month === "06") month = "June";
  else if (month === "07") month = "July";
  else if (month === "08") month = "August";
  else if (month === "09") month = "September";
  else if (month === "10") month = "October";
  else if (month === "11") month = "November";
  else if (month === "12") month = "December";

  return `${day} ${month} ${year}`;
};
