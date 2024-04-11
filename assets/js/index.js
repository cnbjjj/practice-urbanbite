'use strict';
import { query, event } from './utils.js';
const message = query('.message');
const mapConfig = {
    accessToken: 'pk.eyJ1IjoiY2FtYmpqIiwiYSI6ImNsdXN5dDgyczBteHAyanA0a2thd3hxZHEifQ.BjLGCobl62MQZTu6b3ve2A',
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-97.14174, 49.8951],
    zoom: 9,
    interactive: false
};
const popupHTML = `<h3>Hi, JJ</h3><p>Meal in Motion: Heading Home!</p>`;
let pos, layers = [];
const map = new mapboxgl.Map(mapConfig);
const getLocation = (position) => {
    pos = [position.coords.longitude, position.coords.latitude];
    const marker = new mapboxgl.Marker({ color: "#ff5c4d", draggable: true }).setLngLat(pos).addTo(map);
    const popup = new mapboxgl.Popup({ offset: 50, closeOnClick: false, closeButton: false })
        .setHTML(popupHTML).setLngLat(pos).setMaxWidth(400).addTo(map);
    map.flyTo({ center: pos, zoom: 12, essential: true });
    map.setStyle('mapbox://styles/mapbox/streets-v12');
    log();
    return addLayer([marker, popup]);
};
const addLayer = (add) => layers = [...layers, ...add];
const clear = () => {
    layers.forEach(layer => layer.remove());
    layers = [];
};
const log = (msg = '') => {
    message.innerHTML = `${msg}`;
    message.style.opacity = 1 - Number(msg === '');
};
event(query('.track'), 'click', () => {
    if ('geolocation' in navigator) {
        log('Just a moment while we pinpoint the location.');
        clear();
        navigator.geolocation.getCurrentPosition(getLocation, () => log('Unable to retrieve location'), { enableHighAccuracy: true });
    } else {
        log('Geolocation is not supported by your browser');
    }
});