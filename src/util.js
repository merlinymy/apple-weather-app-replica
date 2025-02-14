export const getTimeFromTimezone = function (tzString) {
  // https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
  return new Intl.DateTimeFormat("en-US", {
    tzString,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

export const getCurrentDate = function (tzString) {
  return new Intl.DateTimeFormat("en-CA", {
    tzString,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};
