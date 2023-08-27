mapboxgl.accessToken = mapToken
        const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12', 
        center: station.geometry.coordinates,
        zoom: 9,
});

new mapboxgl.Marker()
    .setLngLat(station.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${station.name}</h3><p>${station.location}</p>`
        )
    )
    .addTo(map)