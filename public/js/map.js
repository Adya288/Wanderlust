
 
if (
    !Array.isArray(listing.geometry.coordinates) ||
    listing.geometry.coordinates.length !== 2 ||
    !listing.geometry.coordinates.every(Number.isFinite)
) {
    console.error("Invalid coordinates:");
} else {
    // Initialize Mapbox here

               mapboxgl.accessToken = maptoken;
               const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 9,
        center: listing.geometry.coordinates,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();
    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

   
    const marker = new mapboxgl.Marker({"color": "#FF0000"})
       .setLngLat(listing.geometry.coordinates)
       .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${listing.location}</h3><p>Exact location will be provided after booking!</p>`))
        .addTo(map);
       }
