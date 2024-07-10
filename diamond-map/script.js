var map = L.map('map').setView([51.574349, -1.310892], 17);

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

var marker = L.marker([51.574349, -1.310892]).addTo(map);
marker.bindPopup("<b>Diamond Lightsource</b><br>Syncrotron")

fetch("beamlines_data.json").then((result) => result.json()).then((groups) => {
    var overlays = {};
    for (var group of groups) {
        let lg = L.layerGroup();

        for (var beamline of group.beamlines) {
            var marker = L.marker(beamline.position).addTo(lg);
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
