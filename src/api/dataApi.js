import Api from "./api";

export const getPackages = () => {
    return Api.client.get("http://localhost:5000/api/v1/pack").then(
        (response) => {
            const {res} = response;
            if (res) {
                return res;
            }
        },
        (response) => {
            const {dsc} = response;
            return Promise.reject(dsc);
        });
};

export const getPackage = (id) => {
    return Api.client.get(`http://localhost:5000/api/v1/pack/${id}`).then(
        (response) => {
            const {res} = response;
            if (res) {
                return res;
            }
        }
    )
};

export const putPackage = (id, data) => {
    const {name} = data;
    return Api.client.put(`http://localhost:5000/api/v1/pack/${id}`, {
        name
    });
};

export const getMarkers = (id) => {
    return Api.client.get(`http://localhost:5000/api/v1/pack/${id}/mark`).then(response => {
        const {res} = response;
        if (res) {
            return res.map(point => {
                const {id, name, type, loc: {lon, lat}} = point;
                return {
                    id, name, type, coordinates: {lon, lat}
                };
            });
        }
    })
};

export const putMarker = (packId, data) => {
    const {id, name, coordinates: {lon, lat}} = data;
    return Api.client.put(`http://localhost:5000/api/v1/pack/${packId}/mark/${id}`, {
        name,
        type: "default",
        loc: {
            lon,
            lat
        }
    })
};