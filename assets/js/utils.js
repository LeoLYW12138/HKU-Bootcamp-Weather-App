function formatTime (time) {
  return time.replace('T', ' ').replace('+08:00', '');
}

function formatAddr (addr) {
  addr = addr.replace(' District', '');
  return addr;
}

function formatDate (date) {
  let options = { month: "long", "day": "numeric" }
  let d = new Date(date.substr(0, 4), date.substr(4, 2), date.substr(6, 2));

  return d.toLocaleDateString("en-GB", options);
}
export { formatTime, formatAddr, formatDate };