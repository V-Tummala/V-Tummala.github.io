// Creating map canvas
var map = L.map('map').setView([51.574349, -1.310892], 17);
var markers = {};

// Adding map to the screen
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Adding images under and over the diamond lightsource synchrotron
const lowerBoundary = [51.57168183170403, -1.3173294067382815];
const upperBoundary = [51.57701619673675, -1.304454803466797];
const imageBounds = [lowerBoundary, upperBoundary];

var imageUrl = 'BaseUnder.png';
L.imageOverlay(imageUrl, imageBounds, {zindex:1}).addTo(map);


var imageUrl = 'BaseOver.png';
L.imageOverlay(imageUrl, imageBounds, {zindex:2}).addTo(map);

// Creating a marker for diamond using its logo
var diamondIcon = L.icon({
    iconUrl: 'diamond-icon.png',
    iconSize: [150, 50],
    iconAnchor: [75,50],
    popupAnchor: [0, -50],
});

var marker = L.marker([51.574349, -1.310892], {icon:diamondIcon}).addTo(map);
marker.bindPopup("<b>Diamond Lightsource</b><br>Syncrotron")

// Fetching beamline data from json file 
fetch("beamlines_data.json").then((result) => result.json()).then((groups) => {
    var overlays = {};

    // Looping through beamline groups, creating a new layer for each group and ensuring that each group has a unique marker
    for (var group of groups) {
        let lg = L.layerGroup();
        var marker_icon = L.icon({
            iconUrl: group.marker,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41]
        });

        //Looping through each beamline in a group, adding the icon and popup with description and url
        for (var beamline of group.beamlines) {
            var marker = L.marker(beamline.position, {icon: marker_icon}).addTo(lg);
            markers[beamline.name] = marker;
            marker.bindPopup(`<h1><b>${beamline.name}</b></h1>
                <p>${beamline.description}<p>
                <a href="${beamline.url}">${beamline.url}</a>`);
        }
        overlays[group.name] = lg;
        lg.addTo(map);
    };

    // Control for toggling layers
    L.control.layers(null, overlays).addTo(map);
})

// Adding user's location to the map with a marker
// Creating an approximate location circle around the user's marker
var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [50, 50],
    iconAnchor: [25,50],
    popupAnchor: [0, -50],
});

var marker = L.marker([0,0], {icon:myIcon}).addTo(map);
var circle = L.circle([0,0], {radius: 0}).addTo(map);

marker.bindPopup("<b>This is your location</b>")
map.locate({watch:true});

var userLocation = []

map.on("locationfound", function(e) {
    marker.setLatLng(e.latlng);
    circle.setLatLng(e.latlng);
    circle.setRadius(e.accuracy);
    userLocation = [e.latlng["lat"], e.latlng["lng"]];

});

var tl = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ""
}).addTo(map);

map.on('mousemove', function(ev) {
   if (tl != null) {
    map.removeLayer(tl);
   }
   var latitude = ev.latlng.lat
   var roundedLat = parseFloat(latitude).toFixed(4);

   var longitude = ev.latlng.lng
   var roundedLong = parseFloat(longitude).toFixed(4);

    tl = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: `${roundedLat}, ${roundedLong}`
    }).addTo(map);
});

// Creating a diamond lightsource attribution at the bottom right corner of the screen
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.diamond.ac.uk/Home.html;jsessionid=EF1762AB33F66BB12E1D5432DDAB0976">Diamond Lightsource</a>'
}).addTo(map);

// Creating a html button using leaflet's controls
var closestButton = L.control({position: "topright"});
closestButton.onAdd = function() {
    var buttonContainer = L.DomUtil.create("div");
    buttonContainer.innerHTML = "<button id='nearest_marker'>Find nearest beamline</button>";
    buttonContainer.firstChild.addEventListener("click", getNearestMarker());
};

closestButton.addTo(map);

function getNearestMarker() {
    var nearest = "";
    for (const [name, marker] of Object.entries(markers)) {
        var markerLocation = marker.getLatLng();
        var distance = markerLocation.distanceTo(userLocation);

        comparisonValue = Number.MAX_SAFE_INTEGER;       
        if (distance < comparisonValue) {
            comparisonValue = distance;
            nearest = name;
        };
    };

    var nearestMarker = markers[nearest];

    var originalPopup = nearestMarker.getPopup().getContent();
    nearestMarker.setPopupContent("<b>This is the closest beamline<b>");
    nearestMarker.openPopup();
    setTimeout(() => {
        nearestMarker.closePopup();
        nearestMarker.setPopupContent(originalPopup);
    }, 5000);

}
