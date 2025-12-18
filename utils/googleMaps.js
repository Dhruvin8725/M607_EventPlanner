const fetch = require('node-fetch');

async function getCoordinates(locationName) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key is missing.');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    locationName
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat.toFixed(6),
        lng: location.lng.toFixed(6),
      };
    } else if (data.status === 'REQUEST_DENIED') {
      console.error('Geocoding Error: REQUEST_DENIED. Check your API key.');
      throw new Error('Geocoding Error: REQUEST_DENIED. The provided API key is invalid.');
    } else if (data.status === 'ZERO_RESULTS') {
       console.error('Geocoding Error: ZERO_RESULTS. No coordinates found.');
       throw new Error('Geocoding Error: ZERO_RESULTS. No coordinates found for that location.');
    } else {
      console.error('Geocoding Error:', data.status);
      throw new Error(`Geocoding Error: ${data.status}`);
    }
  } catch (err) {
    console.error('Error fetching coordinates:', err);
    throw new Error('Error connecting to Google Maps API.');
  }
}

module.exports = {
  getCoordinates,
};