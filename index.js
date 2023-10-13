const API_KEY = "at_kaYMs8Q52qdnYUoi3KuwFLI2GvW8J";

// leaflet

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.marker([51.5, -0.09])
  .addTo(map)
  .bindPopup("A pretty CSS popup.<br> Easily customizable.")
  .openPopup();

// document.addEventListener("DOMContentLoaded", displayLocation);

async function displayLocation() {
  const {
    location: { region, timezone },
    isp,
    ip,
  } = await getLocation();

  const geoData = [ip, region, timezone, isp];
  createSpan(geoData);
}

// populate UI with fetced data
function createSpan(geoData) {
  geoData.forEach((data, index) => {
    const dataSpan = document.createElement("span");
    dataSpan.classList.add("data");
    dataSpan.append(document.createTextNode(data));
    document.querySelectorAll("li")[index].appendChild(dataSpan);
  });
}

// fetches location data
async function getLocation() {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("something went wrong " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
