import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import IconFilledMarker from "../../../icons/IconFilledMarker.svg";
import IconRouteMarker from "../../../icons/IconRouteMarker.svg";
import IconCarrot from "../../../icons/IconCarrot.svg";
import apple from "../../../icons/apple.svg";
import {ACCESS_TOKEN, fetchForwardGeocoding, fetchRoute} from "../../../../api/mapApi";

const turf = window.turf;
const mapContainerId = "map_container";
export const mapItems = {
    poiMarker: {source: "OBI_poi-marker_source", layer: "OBI_poi-marker_layer"},
    routeMarker: {source: "OBI_route-marker_source", layer: "OBI_route-marker_layer"},
    route: {source: "OBI_route_source", layer: "OBI_route_layer"},
    restaurant: {layer: "OBI_restaurant_layer"},
    cafe: {layer: "OBI_cafe_layer"},
};

class Map extends Component {
    _MAP;

    addSource = (sourceId) => {
        // only when map loaded
        this._MAP.addSource(sourceId, {
            type: "geojson",
            data: turf.featureCollection([])
        });
    };

    loadImage = (name, url) => {
        // only when map loaded
        let image = new Image(40, 40);
        image.onload = () => this._MAP.addImage(name, image);
        image.src = url;

        return name;
    };

    addLayer = (id, imageName, additionalData = {}) => {
        this._MAP.addLayer({
            id,
            type: "symbol",
            layout: {
                "icon-image": imageName,
                "icon-allow-overlap": true,
                "icon-offset": [0, -20]
            },
            ...additionalData
        });
    };

    componentDidMount() {
        mapboxgl.accessToken = ACCESS_TOKEN;

        this._MAP = new mapboxgl.Map({
            container: mapContainerId, // container id
            style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
            center: [30.52, 50.45], // starting position [lon, lat]
            zoom: 11 // starting zoom
        });

        // todo: remove
        window.map = this._MAP;

        this._MAP.on("load", () => {
            // наши poi точки (красные)
            this.addSource(mapItems.poiMarker.source);
            this.addLayer(mapItems.poiMarker.layer, this.loadImage("poiMarker", IconFilledMarker), {source: mapItems.poiMarker.source});

            // сиине маркеры (маршрута)
            this.addSource(mapItems.routeMarker.source);
            this.addLayer(mapItems.routeMarker.layer, this.loadImage("routeMarker", IconRouteMarker), {source: mapItems.routeMarker.source});

            // рестораны
            this.addLayer(mapItems.restaurant.layer, this.loadImage("restaurantMarker", IconCarrot), {
                source: "composite",
                "source-layer": "poi_label",
                filter: ["==", "type", "Restaurant"]
            });
            this._MAP.setLayoutProperty(mapItems.restaurant.layer, "visibility", "none");

            // кафе
            this.addLayer(mapItems.cafe.layer, this.loadImage("cafeMarker", apple), {
                source: "composite",
                "source-layer": "poi_label",
                filter: ["==", "type", "Cafe"],
                visibility: "none"
            });
            this._MAP.setLayoutProperty(mapItems.cafe.layer, "visibility", "none");

            // route
            this.addSource(mapItems.route.source);
            this._MAP.addLayer({
                id: mapItems.route.layer,
                type: 'line',
                source: mapItems.route.source,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3887be',
                    'line-width': [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        12, 3,
                        22, 12
                    ]
                }
            }, 'waterway-label');
            // end route

            this._MAP.on("click", e => {
                const {lngLat: {lng: lon, lat}} = e;
                this.props.onAddMarker(lon, lat);
            });
        });
    }

    buildSourceData = (points) => {
        return {
            type: "FeatureCollection",
            features: points.map(point => {
                const {loc: {lon, lat}} = point;
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    }
                };
            })
        };
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {points, routePoints, navi, poi} = this.props;
        if (prevProps.points !== points || prevProps.routePoints !== routePoints || prevProps.navi !== navi) {
            const tryToSetData = () => {
                if (this._MAP.loaded()) {
                    this._MAP.getSource(mapItems.poiMarker.source).setData(this.buildSourceData(points));
                    this._MAP.getSource(mapItems.routeMarker.source).setData(this.buildSourceData(routePoints));
                    this._MAP.getSource(mapItems.route.source).setData(turf.featureCollection([turf.feature({coordinates: navi, type: "LineString"})]));
                } else {
                    setTimeout(tryToSetData, 1000);
                }
            };

            tryToSetData();
        }

        if (prevProps.poi !== poi) {
            prevProps.poi.forEach(i => this._MAP.setLayoutProperty(i, "visibility", "none"));
            poi.forEach(i => this._MAP.setLayoutProperty(i, "visibility", "visible"));
        }
    }

    render() {
        return <div className={styles.wrapper} id={mapContainerId}></div>;
    }
}

export default Map;
