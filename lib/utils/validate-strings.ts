function validateIdString(string: unknown): {} {
  if (typeof string !== 'string' || string.length < 20) {
    return `Identification string must be at least 20 characters long`;
  }
}

function validateColor(color: unknown) {
  if (typeof color !== 'string' || color.length < 6) {
    return `Color code must be a combination of at least 6 characters`;
  }
}

function getDate() {
  const newDate = new Date();
  var dd = String(newDate.getDate()).padStart(2, 'O');
  var mm = String(newDate.getMonth() + 1).padStart(2, 'O');
  var yyyy = newDate.getFullYear();
  var sec = String(newDate.getTime());
  var timestamp = `${dd}.${mm}.${yyyy}:${sec}`;
  return timestamp;
}
export { getDate, validateIdString, validateColor };
