const API_KEY = "at_kaYMs8Q52qdnYUoi3KuwFLI2GvW8J";
const ipForm = document.querySelector(".ip-form");
const ipInput = document.querySelector("#locateInput");
const ipButton = document.querySelector("#locateBtn");

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
ipForm.addEventListener("submit", displayLocation);

async function displayLocation(e) {
  e.preventDefault();
  console.log(isIpOrDomain(ipInput.value));

  ipInput.value = "";
  //   const {
  //     location: { region, timezone },
  //     isp,
  //     ip,
  //   } = await getLocation();

  //   const geoData = [ip, region, timezone, isp];
  //   createSpan(geoData);
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

function isIpOrDomain(str) {
  let format;
  switch (true) {
    case isValidIPv4(str):
      format = `&ipAddress=${str}`;
      break;
    case isValidDomainName(str):
      format = `&domain=${str}`;
      break;
    default:
      format = "";
  }
  return format;
}

function isValidIPv4(addr) {
  const ipv4Regex =
    /^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/;
  return ipv4Regex.test(addr);
}

function isValidDomainName(name) {
  const domainRegex = /^([a-zA-Z0-9.-]+\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(name);
}

// fetches location data
async function getLocation(query = "") {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}` + query
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
