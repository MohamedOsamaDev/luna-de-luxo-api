export const timeToMillis = (timeString = "1m") => {
  const timeUnits = {
    s: 1000, // seconds
    m: 1000 * 60, // minutes
    h: 1000 * 60 * 60, // hours
    d: 1000 * 60 * 60 * 24, // days
    w: 1000 * 60 * 60 * 24 * 7, // weeks
    mo: 1000 * 60 * 60 * 24 * 30, // months (approximation)
    y: 1000 * 60 * 60 * 24 * 365, // years (approximation)
  };

  // Use a regular expression to find and extract units
  const matches = timeString.match(/(\d+)([a-z]+)/g);

  if (!matches) return 0; // Return 0 if no matches are found

  return matches.reduce((totalMillis, match) => {
    const [_, value, unit] = match.match(/(\d+)([a-z]+)/);
    if (!timeUnits[unit]) return totalMillis;
    return totalMillis + (parseInt(value, 10) * timeUnits[unit]);
  }, 0);
};
export const timeToSeconds = (timeString = "1s") => {

  const timeUnits = {
    s: 1, // seconds
    m: 60, // minutes
    h: 3600, // hours
    d: 86400, // days
    w: 604800, // weeks
    mo: 2592000, // months (approximation)
    y: 31536000, // years (approximation)
  };

  // Regex to extract all time units and their values
  const regex = /(\d+)([a-z]+)/g;

  // Find all matches in the timeString
  const matches = timeString?.toString()?.match(regex);

  // Return 0 if no matches are found
  if (!matches) return 0;

  // Accumulate total seconds from all matches
  return matches.reduce((totalSeconds, match) => {
    // Extract value and unit from each match
    const [_, value, unit] = match.match(/(\d+)([a-z]+)/);
    const unitSeconds = timeUnits[unit];

    // If unit is invalid, ignore it
    if (unitSeconds === undefined) return totalSeconds;

    // Accumulate the total seconds
    return totalSeconds + (parseInt(value, 10) * unitSeconds);
  }, 0);
};


