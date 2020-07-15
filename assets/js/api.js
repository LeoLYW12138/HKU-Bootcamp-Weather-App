const WEATHERAPIURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en";
const WEATHERWARNINGURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en";
const WEATHERFORECASTURL = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en";

// Get the weather data from Obervatory
async function getObData () {
  return fetch(WEATHERAPIURL, { mode: 'cors' })
    .then(response => response.json());
}

// Get weather warning summary from Obervatory
async function getWarnSum () {
  return fetch(WEATHERWARNINGURL, { mode: 'cors' })
    .then(response => response.json());
}

async function getWFore () {
  return fetch(WEATHERFORECASTURL, { mode: 'cors' })
    .then(response => response.json());
}

// Get the geolocation - latitude and longitude
function getloc () {
  return new Promise((resolve, reject) => {
    function success (position) {
      let data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      resolve(data);
    }
    function error () {
      reject("Unable to retrieve your loction");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  });
}

// Get the current district position
function getdistrict (pos) {
  return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.lat}&longitude=${pos.lng}&localityLanguage=en`,
    { mode: 'cors' })
    .then(response => response.json());
}

// Export all the functions declared
export { getObData, getWarnSum, getWFore, getloc, getdistrict };