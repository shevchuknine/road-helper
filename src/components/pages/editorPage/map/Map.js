import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import IconEmptyMarker from "../../../icons/IconEmptyMarker";
import IconFilledMarker from "../../../icons/IconFilledMarker.svg";
import {fetchForwardGeocoding, fetchRoute} from "../../../../api/mapApi";

const turf = window.turf;

const mapContainerId = "map_container";
const markersSourceId = "obi_markers";
const markersLayerId = "obi_markers_layer";
const accessToken = "pk.eyJ1Ijoic2hldmNodWtuaW5lIiwiYSI6ImNrOGhvNHdsbTAyMnYzZ3FkN2tvdnBieWcifQ.5y8TQSzYpAzUA9z_D835XA";

class Map extends Component {
    _MAP;

    componentDidMount() {
        mapboxgl.accessToken = accessToken;

        this._MAP = new mapboxgl.Map({
            container: mapContainerId, // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [30.52, 50.45], // starting position [lon, lat]
            zoom: 11 // starting zoom
        });

        this._MAP.on("load", () => {
            this._MAP.addSource(markersSourceId, {
                type: "geojson",
                //todo: console.log(turf.featureCollection([]))
                data: turf.featureCollection([])
            });

            let image = new Image(40, 40);
            image.onload = () => this._MAP.addImage("marker", image);
            image.src = IconFilledMarker;

            this._MAP.addLayer({
                id: markersLayerId,
                type: "symbol",
                source: markersSourceId,
                layout: {
                    "icon-image": "marker",
                    "icon-allow-overlap": true,
                    "icon-offset": [0, -20]
                }
            });

            this._MAP.on("click", e => {
                const {lngLat: {lng: lon, lat}} = e;
                fetchForwardGeocoding(accessToken, lon, lat).then(defaultName => {
                    this.props.onAddMarker({lon, lat}, defaultName || "default name");
                })
            });
        });
    }

    buildSourceData = (points) => {
        return {
            type: "FeatureCollection",
            features: points.map(point => {
                const {coordinates: {lon, lat}} = point;
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
        const {points} = this.props;
        if (prevProps.points !== points) {
            const tryToSetData = () => {
                if (this._MAP.loaded()) {
                    this._MAP.getSource(markersSourceId).setData(this.buildSourceData(points));
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
