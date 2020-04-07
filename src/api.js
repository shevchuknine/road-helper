const turf = window.turf;

export const fetchRoute = (accessToken, coordinates) => {
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.map(coordinate => {
        return `${coordinate.lng},${coordinate.lat}`;
    }).join(";")}?overview=simplified&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${accessToken}`;

    return fetch(url).then(res => res.json()).then(data => {
        if (data.trips) {
            return turf.featureCollection([turf.feature(data.trips[0].geometry)]);
        }

        return [];
    })
};

export const fetchForwardGeocoding = (accessToken, lng, lat) => {
    return fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`).then(res => res.json()).then(console.log);
};
