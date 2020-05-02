import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import IconFilledMarker from "../../../icons/IconFilledMarker.svg";
import IconRouteMarker from "../../../icons/IconRouteMarker.svg";
import {ACCESS_TOKEN, fetchForwardGeocoding, fetchRoute} from "../../../../api/mapApi";

const turf = window.turf;
const mapContainerId = "map_container";
const markersSourceId = "obi_markers";
const markersLayerId = "obi_markers_layer";
const markersRouteSourceId = "obi_markers_route";
const markersRouteLayerId = "obi_markers_route_layer";
const routeSourceId = "obi_route";
const routeLayerId = "obi_route_layer";

class Map extends Component {
    _MAP;

    componentDidMount() {
        mapboxgl.accessToken = ACCESS_TOKEN;

        this._MAP = new mapboxgl.Map({
            container: mapContainerId, // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [30.52, 50.45], // starting position [lon, lat]
            zoom: 11 // starting zoom
        });

        this._MAP.on("load", () => {
            const buildSource = (name, url, layerId, sourceId) => {
                this._MAP.addSource(sourceId, {
                    type: "geojson",
                    data: turf.featureCollection([])
                });

                let image = new Image(40, 40);
                image.onload = () => this._MAP.addImage(name, image);
                image.src = url;

                this._MAP.addLayer({
                    id: layerId,
                    type: "symbol",
                    source: sourceId,
                    layout: {
                        "icon-image": name,
                        "icon-allow-overlap": true,
                        "icon-offset": [0, -20]
                    }
                });
            };

            buildSource("marker", IconFilledMarker, markersLayerId, markersSourceId);
            buildSource("marker-route", IconRouteMarker, markersRouteLayerId, markersRouteSourceId);

            // route
            this._MAP.addSource(routeSourceId, {
                type: 'geojson',
                data: turf.featureCollection([])
            });

            this._MAP.addLayer({
                id: routeLayerId,
                type: 'line',
                source: routeSourceId,
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
        const {points, routePoints, navi} = this.props;
        if (prevProps.points !== points || prevProps.routePoints !== routePoints || prevProps.navi !== navi) {
            const tryToSetData = () => {
                if (this._MAP.loaded()) {
                    this._MAP.getSource(markersSourceId).setData(this.buildSourceData(points));
                    this._MAP.getSource(markersRouteSourceId).setData(this.buildSourceData(routePoints));
                    this._MAP.getSource(routeSourceId).setData(turf.featureCollection([turf.feature({coordinates: navi, type: "LineString"})]));
                } else {
                    setTimeout(tryToSetData, 1000);
                }
            };

            tryToSetData();
        }
    }

    render() {
        return <div className={styles.wrapper} id={mapContainerId}></div>;
    }
}

export default Map;
