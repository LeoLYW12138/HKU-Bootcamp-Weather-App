import { getObData, getWarnSum, getloc, getdistrict } from "./api.js";
import { formatAddr } from "./utils.js";
import generateHeader from "./header.js";

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
    console.error(err);
    document.getElementById('header').innerHTML = "Unable to retrieve weather data. Check the internet connection or try again later.";
    return; //finish and stop the program
  }

  try {
    var warnSum = await getWarnSum();
  } catch (err) {
    console.error(err);
    var warnSum = null;
  }

  generateHeader(addr, Odata, warnSum);

  //show the temperature data of different locations
  //get the HTML <div> block to show those locations' temperatures
  let view = document.getElementById("show");
  for (let loc of Odata.temperature.data) { //iterate thru all temp data
    let elm = document.createElement('div');
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

}
// https://i.cs.hku.hk/~atctam/WeatherApp/
main();