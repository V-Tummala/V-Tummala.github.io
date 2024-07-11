var map = L.map('map').setView([51.574349, -1.310892], 17);
var markers = {};

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const lowerBoundary = [51.57168183170403, -1.3173294067382815];
const upperBoundary = [51.57701619673675, -1.304454803466797];
const imageBounds = [lowerBoundary, upperBoundary];

var imageUrl = 'BaseUnder.png';
L.imageOverlay(imageUrl, imageBounds, {zindex:1}).addTo(map);


var imageUrl = 'BaseOver.png';
L.imageOverlay(imageUrl, imageBounds, {zindex:2}).addTo(map);

var diamondIcon = L.icon({
    iconUrl: 'diamond-icon.png',
    iconSize: [150, 50],
    iconAnchor: [75,50],
    popupAnchor: [0, -50],
});

var marker = L.marker([51.574349, -1.310892], {icon:diamondIcon}).addTo(map);
marker.bindPopup("<b>Diamond Lightsource</b><br>Syncrotron")

fetch("beamlines_data.json").then((result) => result.json()).then((groups) => {
    var overlays = {};

    for (var group of groups) {
        let lg = L.layerGroup();
        var marker_icon = L.icon({
            iconUrl: group.marker,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41]
        });

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

    L.control.layers(null, overlays).addTo(map);
})

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

map.on("locationfound", function(e) {
    marker.setLatLng(e.latlng);
    circle.setLatLng(e.latlng);
    circle.setRadius(e.accuracy);
    
});


// map.on('click', function(ev) {
//     alert(ev.latlng); 
// });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.diamond.ac.uk/Home.html;jsessionid=EF1762AB33F66BB12E1D5432DDAB0976">Diamond Lightsource</a>'
}).addTo(map);

function getNearestMarker() {
    var nearest = [[,10000000]];
    map.on("locationfound", function(e) {
        var userPos = e.latlng;
        // console.log(userPos);
        var userLat = userPos["lat"];
        // console.log(userLat);
        var userLong = userPos["lng"];
        // console.log(userLong);
        fetch("beamlines_data.json").then((result) => result.json()).then((groups) => {
            for (var group of groups) {
                for (var beamline of group.beamlines) {
                    var beamlinePos = beamline.position;
                    // console.log(beamlinePos);
                    var beamlineLat = beamlinePos[0];
                    // console.log(beamlineLat);
                    var beamlineLong = beamlinePos[1];
                    // console.log(beamlineLong);
                    
                    var latDiff = userLat - beamlineLat;
                    // console.log(latDiff);
                    var longDiff = userLong - beamlineLong;
                    // console.log(longDiff);
                    var distance = Math.sqrt(Math.pow(latDiff, 2) + Math.pow(longDiff, 2));
                    // console.log(distance);
                    
                    if (distance < nearest[0][1]) {
                        nearest[0] = [beamline, distance];
                    };
                };
            };
        })
        var nearestMarker = markers[nearest[0][0].name];
        console.log(nearest[0][0].name);
        var originalPopup = nearestMarker.getPopup().getContent();
        nearestMarker.setPopupContent("<b>This is the closest beamline<b>");
        nearestMarker.openPopup();
        setTimeout(() => {
            nearestMarker.closePopup();
            nearestMarker.setPopupContent(originalPopup);
        }, 5000);

    });


}

getNearestMarker();
