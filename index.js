const API_KEY = "at_kaYMs8Q52qdnYUoi3KuwFLI2GvW8J";
const ipForm = document.querySelector(".ip-form");
const ipInput = document.querySelector("#locateInput");
const ipButton = document.querySelector("#locateBtn");

// leaflet

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);

document.addEventListener("DOMContentLoaded", displayLocation);
ipForm.addEventListener("submit", displayLocation);

async function displayLocation(e) {
  e.preventDefault();
  const chars = isIpOrDomain(ipInput.value);
  const type = e.currentTarget.nodeName === "#document" ? "reload" : "search";

  if (type === "search") {
    if (chars === "") {
      alert("Please enter a domain or IP address");
      return;
    }
  }

  const { ip, isp, location } = await getLocation(chars);

  marker.setLatLng([location.lat, location.lng]).update();
  map.setView([location.lat, location.lng], 13);

  const geoData = [ip, location.region, location.timezone, isp];
  createSpan(geoData, type);

  ipInput.value = "";
}

// populate UI with fetced data
function createSpan(geoData, type) {
  if (type === "search") {
    document.querySelectorAll(".result li").forEach((li) => {
      li.lastElementChild.remove();
    });
  }

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
async function getLocation(query) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}` + query
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
