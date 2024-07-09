var map = L.map('map').setView([51.574349, -1.310892], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
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



