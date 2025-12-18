// This function will be called by the Google Maps script
// It must be in the global scope, so we attach it to 'window'
window.initMap = () => {
  // Get coordinates and zoom level from the map div
  // We will set these using EJS from the backend later
  const mapElement = document.getElementById('map');
  const lat = parseFloat(mapElement.dataset.lat) || 40.7128; // Default: NYC
  const lng = parseFloat(mapElement.dataset.lng) || -74.0060; // Default: NYC
  const zoom = parseInt(mapElement.dataset.zoom) || 12;

  const eventLocation = { lat: lat, lng: lng };

  // Create the map instance
  const map = new google.maps.Map(mapElement, {
    zoom: zoom,
    center: eventLocation,
    disableDefaultUI: true,
    zoomControl: true,
  });

  // Create a marker
  new google.maps.Marker({
    position: eventLocation,
    map: map,
    title: "Event Location",
  });
}
