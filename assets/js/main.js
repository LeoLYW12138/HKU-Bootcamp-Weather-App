import { getObData, getWarnSum, getWFore, getloc, getdistrict } from "./api.js";
import { formatAddr, formatDate } from "./utils.js";
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

  try {
    var WFore = await getWFore();
  } catch (err) {
    console.error(err);
    var WFore = null;
  }

  generateHeader(addr, Odata, warnSum);

  var Selected = "Temperature";
  //get the HTML <div> block to show those locations' temperatures
  let view = document.getElementById("show");

  let fore = document.createElement("div");
  fore.id = "fore";
  let temp = document.createElement("div");
  temp.id = "Multemp";
  view.append(fore);
  view.append(temp);
  let pageId = {
    "Temperature": "Multemp",
    "Forecast": "fore"
  }

  // Add selector buttons
  let selector = document.getElementById("selector");
  let options = Object.keys(pageId);
  for (let option of options) {
    let optionBtn = document.createElement("div");
    optionBtn.setAttribute("class", "option");
    optionBtn.innerHTML = option;
    if (option == Selected) {
      optionBtn.classList.add("selected");
      let el = document.getElementById(pageId[option]);
      el.classList.add("active");
    }
    selector.append(optionBtn);
  }

  // Add event handler for selecting options
  let optionBtns = selector.querySelectorAll(".option");
  for (let optionBtn of optionBtns) {
    optionBtn.addEventListener("click", (event) => {
      if (event.innerHTML != Selected) {
        let current = document.querySelector(".selected");
        current.classList.remove("selected");
        optionBtn.classList.add("selected");
        Selected = optionBtn.innerHTML;
        current = document.querySelector(".active");
        current.classList.remove("active");
        let el = document.getElementById(pageId[Selected]);
        el.classList.add("active");
      }
    })
  }

  // Show the 9 days weather forecast
  for (let day of WFore.weatherForecast) {
    let forecast = document.createElement("div");
    forecast.setAttribute("class", "forecast");
    let fDate = `<p class="fdate">${formatDate(day.forecastDate)}</p>`;
    let fWeek = `<p class="fweek">${day.week}</p>`;
    let fTemp = `<p class="ftemp">${day.forecastMintemp.value}°C | ${day.forecastMaxtemp.value}°C</p>`;
    let fHumid = `<p class="fhumid">${day.forecastMinrh.value} - ${day.forecastMaxrh.value}%</p>`;
    let fIcon = `<img class="fIcon" src="http://www.hko.gov.hk/images/HKOWxIconOutline/pic${day.ForecastIcon}.png">`;
    forecast.innerHTML = fIcon + fDate + fWeek + fTemp + fHumid;
    fore.append(forecast);
  }

  //show the temperature data of different locations
  for (let loc of Odata.temperature.data) { //iterate thru all temp data
    let elm = document.createElement('div');
    elm.setAttribute('class', 'block');
    //add the cancel icon, location, and temperature
    elm.innerHTML = `<img class='btn' src='cancel-24.ico'><p>${loc.place}</p> <p>${loc.value}°C</p>`;
    temp.append(elm); //add the block to Webpage
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
