import Api from "./api";
import generateShortId from "../helpers/shortId";

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
                return {...res, id};
            }
        }
    )
};

export const putPackage = (id, data) => {
    const {name} = data;
    return Api.client.put(`http://localhost:5000/api/v1/pack/${id}`, {
        name
    }).then(() => {
        return putRoute(id);
    })
};

export const removePackage = (id) => {
    return Api.client.delete(`http://localhost:5000/api/v1/pack/${id}`);
};

export const getMarkers = (id) => {
    return Api.client.get(`http://localhost:5000/api/v1/pack/${id}/mark`).then(response => {
        const {res} = response;
        if (res) {
            return res.map(point => {
                const {id, name, type, loc, address} = point;
                return {
                    id, name, type, loc, address
                };
            });
        }
    })
};

export const putMarker = (packId, data) => {
    const {id, name, loc, address} = data;

    return Api.client.put(`http://localhost:5000/api/v1/pack/${packId}/mark/${id}`, {
        name,
        address,
        type: "default",
        loc
    })
};

export const deleteMarker = (packId, id) => {
    return Api.client.delete(`http://localhost:5000/api/v1/pack/${packId}/mark/${id}`)
};

export const getRoutes = (packId) => {
    return Api.client.get(`http://localhost:5000/api/v1/pack/${packId}/route`).then(response => {
        const {res: [{id}]} = response;

        return getRoute(packId, id).then(route => {
            return {
                ...route,
                id,
                points: route.points.map(point => ({
                    ...point,
                    id: point.id || generateShortId()
                }))
            };
        });
    })
};

export const getRoute = (packId, routeId) => {
    return Api.client.get(`http://localhost:5000/api/v1/pack/${packId}/route/${routeId}`).then(response => response.res);
};

export const putRoute = (packId, id = generateShortId(), navi = [], points = []) => {
    return Api.client.put(`http://localhost:5000/api/v1/pack/${packId}/route/${id}`, {
        name: "default route",
        type: "Car",
        quality: "Raw",
        navi,
        points: points.map(({name, address, loc}, index) => {
            return ({
                order: index,
                name,
                address,
                type: "route_point",
                loc
            });
        })
    })
};
