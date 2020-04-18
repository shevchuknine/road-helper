import Api from "./api";

const turf = window.turf;

export const fetchRoute = (accessToken, coordinates) => {
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.map(coordinate => {
        return `${coordinate.lng},${coordinate.lat}`;
    }).join(";")}?overview=simplified&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${accessToken}`;

    return Api.client.get(url).then(response => {
        const {trips} = response;
        if (trips) {
            return turf.featureCollection([turf.feature(trips[0].geometry)]);
        }

        return [];
    });
};

export const fetchForwardGeocoding = (accessToken, lng, lat) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;
    return Api.client.get(url).then(response => {
        const {features} = response;
        const [point] = features;

        if (point.place_type.includes("poi")) {
            return point.properties.address || point.place_name;
        }

        return point.place_name;
    });
};
