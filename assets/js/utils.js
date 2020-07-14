function formatTime (time) {
  return time.replace('T', ' ').replace('+08:00', '');
}

function formatAddr (addr) {
  addr = addr.replace(' District', '');
  return addr;
}
export { formatTime, formatAddr };