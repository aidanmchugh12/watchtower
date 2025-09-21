var map = L.map('map', {
    center: [40.4406, -79.9959], // Pittsburgh coords
    zoom: 13,                    // starting zoom
    minZoom: 13,               // lock zoom OUT at 13
});


//icons

var StationaryIcon = L.Icon.extend({
    options: {
        iconSize: [40, 40], // size of the icon
        iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -20] // point from which the popup should open relative to the iconAnchor
    }
});

var policeIcon = new StationaryIcon({ iconUrl: './icons/policeicon.png' });
var hospitalIcon = new StationaryIcon({ iconUrl: './icons/hospitalicon.png' });
var firehouseIcon = new StationaryIcon({ iconUrl: './icons/firehouseicon.png' });

//decision popup
const openBtn = document.getElementById('open-button');
const modal_container = document.querySelector('.modal-container');
const rejectBtn = document.querySelector('.reject-button');
const acceptBtn = document.querySelector('.accept-button');

if (openBtn && modal_container) {
    openBtn.addEventListener('click', () => {
        modal_container.classList.add('show');
    });
}

if (rejectBtn && modal_container) {
    // close on "No"
    rejectBtn.addEventListener('click', () => {
        modal_container.classList.remove('show');
    });
}

if (acceptBtn && modal_container) {
    // close on "Yes"
    acceptBtn.addEventListener('click', () => {
        modal_container.classList.remove('show');
    });
}





var police = L.marker([40.4406, -79.9959], { icon: policeIcon }).addTo(map);
var fire = L.marker([40.4606, -79.97], { icon: firehouseIcon }).addTo(map);
var hospital = L.marker([40.42, -80.03], { icon: hospitalIcon }).addTo(map);

//out of view: 40.40–40.48 lat and -80.05–-79.95 long
var circle = L.circle([40.43, -80.04], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

police.bindPopup("I'm a police station!");
circle.bindPopup("I am a fire");

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

//Set map bounds
map.setMaxBounds(map.getBounds()); //call after map is ready
map.options.maxBoundsViscosity = 1.0;

//Time slider controls 
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const timeRange = document.querySelector('#time-slider input[type=range]');

if (pauseButton && timeRange) {
    pauseButton.addEventListener('click', () => {
        timeRange.disabled = true;
        pauseButton.classList.add('disabled');
        resumeButton.classList.remove('disabled');
    });
}

if (resumeButton && timeRange) {
    resumeButton.addEventListener('click', () => {
        timeRange.disabled = false;
        resumeButton.classList.add('disabled');
        pauseButton.classList.remove('disabled');
    });
}