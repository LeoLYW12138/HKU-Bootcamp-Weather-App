import { formatTime } from "./utils.js";
export default function (addr, Odata, warnSum) {

  //Get the HTML div block for writing the data
  let output = document.getElementById('header');

  // Remove the loading text
  output.innerHTML = "";

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

  // Display today's warning message
  let warning = document.createElement('div');
  warning.id = "warning";
  let dropdownArrow = "<img id='dropdown-arrow' src='arrow_drop_down.svg'>";
  warning.innerHTML = `Today's Warning${dropdownArrow}`;
  output.append(warning);
  let warningContent = document.createElement('div');
  warningContent.id = "warning-content";
  warning.append(warningContent);

  let signals = {
    "WHOT": "vhot",
    "WCOLD": "cold",
    "WFIRE": ["firer", "firey"],
    "WFROST": "frost",
    "WL": "landslip",
    "WFNTSA": "ntfl",
    "WRAIN": ["raina", "rainr", "rainb"],
    "WMSGNL": "sms",
    "WTCSGNL": ["tc1", "tc3", "tc8ne", "tc8nw", "tc8se", "tc8sw", "tc9", "tc10"],
    "WTMW": "tsunami-warn",
    "WTS": "ts"
  };
  if (warnSum) {
    for (let i in warnSum) {
      let signalIcon = document.createElement('img');
      signalIcon.setAttribute('class', 'signal-icon');
      let signal = signals[warnSum[i].code];
      signalIcon.src = `https://www.hko.gov.hk/textonly/img/warn/${signal}.gif`;
      warningContent.append(signalIcon);
    }
  }

  let warningMessages = Odata.warningMessage || null;
  if (warningMessages) {
    for (let warn of warningMessages) {
      let warningMsg = document.createElement('div');
      warningMsg.setAttribute('class', 'warning-message');
      warningMsg.innerHTML = warn;
      warningContent.append(warningMsg);
    }
  } else {
    let warningMsg = document.createElement('div');
    warningMsg.setAttribute('class', 'warning-message');
    warningMsg.innerHTML = "Currently there is no warning signal in force.";
    warningContent.append(warningMsg);
  }

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

  // Get the winfo-container
  let winfoContainer = document.createElement('div');
  winfoContainer.id = 'winfo-container';
  output.append(winfoContainer);

  //display the temperature info
  let tempBlk = document.createElement('span');
  tempBlk.setAttribute('class', 'winfo');
  let tempIcon = "<img src='thermometer-48.png'>";
  let tempData = Odata.temperature.data[1].value;
  tempBlk.innerHTML = tempIcon + `<span id='temp'>${tempData}</span><small>°C</small>`;
  winfoContainer.append(tempBlk);

  //display the humidity info
  let humBlk = document.createElement('span');
  humBlk.setAttribute('class', 'winfo');
  let humIcon = "<img src='drop-48.png'>";
  let humData = Odata.humidity.data[0].value;
  humBlk.innerHTML = humIcon + `<span id='humidity'>${humData}</span><small>%</small>`;
  winfoContainer.append(humBlk);

  //display the rainfall info
  if (addr) { //district info is available
    let rainBlk = document.createElement('span');
    rainBlk.setAttribute('class', 'winfo');
    let rainIcon = "<img src='rain-48.png'>";
    rainBlk.innerHTML = rainIcon + "<span id='rain'>0</span><small>mm</small>";
    winfoContainer.append(rainBlk);
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
  let uvIndex = Odata.uvindex || null;
  if (uvIndex) {
    let uvBlk = document.createElement('span');
    uvBlk.setAttribute('class', 'winfo');
    let uvIcon = "<img src='uv-index.svg'>";
    uvIndex = uvIndex.data[0].value;
    uvBlk.innerHTML = uvIcon + `<span id='uv'>${uvIndex}</span>`;
    winfoContainer.append(uvBlk);
  }

  // Display the last update time
  let lastUpdateTimeBlk = document.createElement('p');
  lastUpdateTimeBlk.id = "lastUpdateTime";
  let lastUpdateTime = Odata.updateTime;
  lastUpdateTimeBlk.innerHTML = `Last Update Time: ${formatTime(lastUpdateTime)}`;
  output.append(lastUpdateTimeBlk);
}