import { getObData, getloc, getdistrict } from "./api.js";
import { formatTime, formatAddr } from "./utils.js";

async function main () {
  try {
    // Wait for getting the location
    var pos = await getloc();
  } catch (err) {
    console.error(err);
    var pos = null;
  }

  try {
    var addr = (pos) ? await getdistrict(pos) : null;
  } catch (err) {
    console.error(err);
    var addr = null;
  }

  // Display the district info
  if (addr) {
    let area = document.querySelector("#district");
    area.innerHTML = `Current District: ${formatAddr(addr.locality)}`;
  }

  try {
    var Odata = await getObData(); //wait for weather data
  } catch (err) { //do this when encountering error
    console.log(err);
    document.getElementById('header').innerHTML = "Unable to retrieve weather data. Check the internet connection or try again later.";
    return; //finish and stop the program
  }


  //Get the HTML div block for writing the data
  let output = document.getElementById('header');

  // Remove the loading text
  output.innerHTML = "";

  //display the title
  let title = document.createElement('h1');
  title.id = 'title';
  title.innerHTML = 'Weather in Hong Kong';
  output.append(title);

  //display the weather icon
  let iconidx = Odata.icon[0];
  let icon = document.createElement('img');
  icon.src = `https://rss.weather.gov.hk/img/pic${iconidx}.png`;
  icon.id = 'icon';
  icon.setAttribute('class', 'winfo');
  output.append(icon);

  //display the temperature info
  let tempBlk = document.createElement('span');
  tempBlk.setAttribute('class', 'winfo');
  let tempIcon = "<img src='thermometer-48.png'>";
  let tempData = Odata.temperature.data[1].value;
  tempBlk.innerHTML = tempIcon + `<span id='temp'>${tempData}</span> <small>°C</small>`;
  output.append(tempBlk);

  //display the humidity info
  let humBlk = document.createElement('span');
  humBlk.setAttribute('class', 'winfo');
  let humIcon = "<img src='drop-48.png'>";
  let humData = Odata.humidity.data[0].value;
  humBlk.innerHTML = humIcon + `<span id='humidity'>${humData}</span><small>%</small>`;
  output.append(humBlk);

  //display the rainfall info
  if (addr) { //district info is available
    let rainBlk = document.createElement('span');
    rainBlk.setAttribute('class', 'winfo');
    let rainIcon = "<img src='rain-48.png'>";
    rainBlk.innerHTML = rainIcon + "<span id='rain'>0 </span><small>mm</small>";
    output.append(rainBlk);
    Odata.rainfall.data[0].place = 'central and western district';
    for (let place of Odata.rainfall.data) {
      let district = place.place.toLowerCase();
      if (!district.includes('district'))
        district = district + ' district';
      if (district == addr.locality.toLowerCase()) {
        let rainData = place.max;
        let rain = document.getElementById('rain');
        rain.innerText = rainData;
      }
    }
  }

  // Display the UV index info
  let uvBlk = document.createElement('span');
  uvBlk.setAttribute('class', 'winfo');
  let uvIcon = "<img src='uv-index.svg'>";
  let uvIndex = Odata.uvindex.data[0] || 0;
  uvBlk.innerHTML = uvIcon + `<span id='uv'>${uvIndex.value}</span>`;
  output.append(uvBlk);

  // Display the last update time
  let lastUpdateTimeBlk = document.createElement('p');
  lastUpdateTimeBlk.id = "lastUpdateTime";
  let lastUpdateTime = Odata.updateTime;
  lastUpdateTimeBlk.innerHTML = `Last Update Time: ${formatTime(lastUpdateTime)}`;
  output.append(lastUpdateTimeBlk);

  //show the temperature data of different locations
  //get the HTML <div> block to show those locations' temperatures
  let view = document.getElementById("show");
  for (let loc of Odata.temperature.data) { //iterate thru all temp data
    let elm = document.createElement('div');
    if (addr && (loc == formatAddr(addr.locality))) {
      elm.setAttribute('class', 'currentDistrict');
    }
    elm.setAttribute('class', 'block');
    //add the cancel icon, location, and temperature
    elm.innerHTML = `<img class='btn' src='cancel-24.ico'><p>${loc.place}</p> <p>${loc.value}°C</p>`;
    view.append(elm); //add the block to Webpage
  }

  //add event handler to each cross button
  let btns = document.querySelectorAll('.btn'); //get all cancel icons
  for (let btn of btns) { //iterate thru all cancel icons
    //add an handler to turn off the display of that block
    btn.addEventListener('click', (event) => {
      let parent = event.target.parentNode;
      parent.style.display = 'none';
    });
  }

  // Add a reload button
  let header = document.getElementById('header');
  let reload = document.createElement('img');
  reload.src = "reload-32.png";
  reload.id = "reload";
  header.prepend(reload);
  //add event handler to execute reload
  reload.addEventListener('click', () => {
    document.location.reload();
  });

}
// https://i.cs.hku.hk/~atctam/WeatherApp/
main();