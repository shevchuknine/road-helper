import Api from "./api";

const turf = window.turf;

export const ACCESS_TOKEN = "pk.eyJ1Ijoic2hldmNodWtuaW5lIiwiYSI6ImNrOGhvNHdsbTAyMnYzZ3FkN2tvdnBieWcifQ.5y8TQSzYpAzUA9z_D835XA";

export const fetchRoute = (coordinates) => {
    const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.map(coordinate => {
        return `${coordinate.lon},${coordinate.lat}`;
    }).join(";")}?overview=simplified&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${ACCESS_TOKEN}`;

    return Api.client.get(url).then(response => {
        const {trips} = response;
        if (trips) {
            return turf.featureCollection([turf.feature(trips[0].geometry)]);
        }

        return [];
    });
};

export const fetchForwardGeocoding = (lon, lat) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${ACCESS_TOKEN}`;
    return Api.client.get(url).then(response => {
        const {features} = response;
        const [inner, outer] = features;

        if (inner.place_type.includes("poi")) {
            return inner.properties.address || outer.place_name;
        }

        return inner.place_name;
    });
};

export const buildStaticImageOfMap = ({lon, lat}) => {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},3,0/140x120?access_token=${ACCESS_TOKEN}`;
};
