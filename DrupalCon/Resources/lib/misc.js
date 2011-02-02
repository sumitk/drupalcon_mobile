/*
 * Cleans up the timestamp and makes it in the format of 1:30PM
 */
function cleanTime(time) {
  var shortTime = time.substr(11,5);
  var mins = shortTime.substr(2,5);
  var hour = parseFloat(shortTime.slice(0,2));
  var ampm = 'AM';
  if (hour > 12) {
    hour -= 12;
    ampm = 'PM';
  }
  return hour + "" + mins + "" + ampm;
}

function dpm(vars) {
  Ti.API.info(vars);
}