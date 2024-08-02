var map = L.map('map').setView([27.5291, 84.3542], 11);
L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Leaflet &copy; OpenStreetMap contributors',
  maxZoom: 18
}).addTo(map);

var startLocations = [
  { name: 'Chitwan', coords: [27.5291, 84.3542] }, 
  { name: 'Kathmandu', coords: [27.7007, 85.300140] }
  //{ name: 'Pokhara', coords: [28.2096, 83.9856] }
];

var destinationLocations = [
  //{ name: 'Tilicho', coords: [28.4104, 83.4816] },
  { name: 'Annapurna Basecamp', coords: [28.5300, 83.8780] }
  //{ name: 'Dudh Pokhari', coords: [28.2600, 84.6200] }
];

var startCoords = null;
var endCoords = null;
var control;

function addRoutingControl(start, end) {
  var startCoords = startLocations.find(loc => loc.name === start).coords;
  var endCoords = destinationLocations.find(loc => loc.name === end).coords;
  if (!startCoords || !endCoords) {
    alert('Invalid locations selected.');
    return;
  }

  if (control) {
    map.removeControl(control);
  }

  control = L.Routing.control({
    waypoints: [
      L.latLng(startCoords[0], startCoords[1]),
      L.latLng(endCoords[0], endCoords[1])
    ],
    createMarker: function (i, wp, nWps) {
      return L.marker(wp.latLng).bindPopup(i === 0 ? "Starting Point" : i === nWps - 1 ? "Destination" : "Intermediate Point");
    }
  }).on('routesfound', function (e) {
    var route = e.routes[0];
    displayRouteInfo(route, start, end, startCoords, endCoords);
  }).addTo(map);
}

function displayRouteInfo(route, startName, endName, startCoords, endCoords) {
  var routeInfo = document.getElementById('route-info');
  var midPoint = [
    (startCoords[0] + endCoords[0]) / 5,
    (startCoords[1] + endCoords[1]) / 5,
    ((startCoords[0] + endCoords[0]) / 5) * 2,
    ((startCoords[1] + endCoords[1]) / 5) * 2,
    ((startCoords[0] + endCoords[0]) / 5) * 3,
    ((startCoords[1] + endCoords[1]) / 5) * 3,
    ((startCoords[0] + endCoords[0]) / 5) * 4,
    ((startCoords[1] + endCoords[1]) / 5) * 4

  ];
  var firstmidPointName = '(Lat: ' + midPoint[0].toFixed(2) + ', Lng: ' + midPoint[1].toFixed(2) + ')';
  var secondmidPointName = '(Lat: ' + midPoint[2].toFixed(2) + ', Lng: ' + midPoint[3].toFixed(2) + ')';
  var thirdmidPointName = '(Lat: ' + midPoint[4].toFixed(2) + ', Lng: ' + midPoint[5].toFixed(2) + ')';
  var fourthmidPointName = '(Lat: ' + midPoint[6].toFixed(2) + ', Lng: ' + midPoint[7].toFixed(2) + ')';
  var infoHtml = `<div class="card"><h3>Route Information</h3><ul>`;
  
  var distanceWalk = route.summary.totalDistance / 1000;
  var durationWalk = distanceWalk / 4;

  if(midPoint[0].toFixed(2) == 11.21) {
    var firstlocPokhara = 'Pokhara'; 
    //infoHtml += `<li>First Location: Pokhara</li>`;
    var pokhara =  L.marker([28.2096, 83.9856]).addTo(map); 
    pokhara.bindPopup('<div"><img src="image/hotelpokhara.png" width="100px" height="100px"><p> pokhara </p></div>');
  }

  if(midPoint[2].toFixed(2) == 22.42){
    var secondlocGandruk = 'Gandruk'; 
    var Gandruk = L.marker([28.376211,83.809394]).addTo(map); 
    Gandruk.bindPopup('<div"><img src="image/gandruk.png" width="100px" height="100px"><p> Ghandruk </p></div>');
  }

  if(midPoint[4].toFixed(2) == 33.64){
    var thirdlochomorong = 'Chhomorong'; 
    var Chhomorong = L.marker([28.423917,83.817792]).addTo(map); 
    Chhomorong.bindPopup('<div"><img src="image/gandruk.png" width="100px" height="100px"><p> chhomorong </p></div>');
  }

  if(midPoint[6].toFixed(2) == 44.85){
    var fourthderuali = 'Deurali'; 
    var deurali = L.marker([28.497919,83.898065]).addTo(map); 
    deurali.bindPopup('<div"><img src="image/gandruk.png" width="100px" height="100px"><p> deruali </p></div>'); 
  }

  infoHtml += `
  <div class="card-timeline">
              <div class="card-item">
                <div class="card-item-title">${startName}</div>
                <button class="btn"><i class="fa-solid fa-bus"></i></button>
            </div>
               <div class="card-item">
                <div class="card-item-title">${firstlocPokhara}</div>
                <button class="btn"><i class="fa-solid fa-bus"></i></button>
              
              </div>
            <div class="card-item">
                <div class="card-item-title">${secondlocGandruk}</div>
                  
                    <button class="btn"><i class="fa-solid fa-bus"></i></button>
            </div>
            <div class="card-item">
                <div class="card-item-title">${thirdlochomorong}</div>
                     <i class="fa-solid fa-person-hiking"></i>
               
            </div>
            <div class="card-item">
                <div class="card-item-title">${fourthderuali}</div>
                  <i class="fa-solid fa-person-hiking"></i>
            </div>
            <div class="card-item">
                <div class="card-item-title">${endName}</div>
                   <i class="fa-solid fa-person-hiking"></i>
            </div>
        </div>
        `

  routeInfo.innerHTML = infoHtml;
}



function setAutocomplete(inputId, options, callback) {
  var input = document.getElementById(inputId);
  var currentFocus;

  input.addEventListener("input", function () {
    var value = this.value.toLowerCase();
    if (!value) return false;

    currentFocus = -1;
    closeAllLists();
    var list = document.createElement("div");
    list.setAttribute("id", inputId + "autocomplete-list");
    list.setAttribute("class", "autocomplete-items");
    input.parentNode.appendChild(list);

    options.forEach(function (option) {
      if (option.name.toLowerCase().includes(value)) {
        var item = document.createElement("div");
        item.innerHTML = "<strong>" + option.name.substr(0, value.length) + "</strong>";
        item.innerHTML += option.name.substr(value.length);
        item.innerHTML += "<input type='hidden' value='" + option.name + "'>";
        item.addEventListener("click", function (e) {
          input.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
          callback(input.value);
        });
        list.appendChild(item);
      }
    });
  });

  function closeAllLists(elmnt) {
    var items = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < items.length; i++) {
      if (elmnt != items[i] && elmnt != input) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

var startOptions = startLocations;
var destinationOptions = destinationLocations;

setAutocomplete("from", startOptions, function (value) {
  startCoords = startLocations.find(loc => loc.name === value).coords;
});

setAutocomplete("to", destinationOptions, function (value) {
  endCoords = destinationLocations.find(loc => loc.name === value).coords;
});

document.getElementById('find-route').addEventListener('click', function () {
  if (startCoords && endCoords) {
    addRoutingControl(startLocations.find(loc => loc.coords === startCoords).name, destinationLocations.find(loc => loc.coords === endCoords).name);
  } else {
    alert('select valid starting and destination locations.');
  }
});


