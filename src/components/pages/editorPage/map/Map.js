import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import IconEmptyMarker from "../../../icons/IconEmptyMarker";
import IconFilledMarker from "../../../icons/IconFilledMarker";
import {fetchForwardGeocoding, fetchRoute} from "../../../../api/mapApi";

const turf = window.turf;

const mapContainerId = "map_container";
const accessToken = "pk.eyJ1Ijoic2hldmNodWtuaW5lIiwiYSI6ImNrOGhvNHdsbTAyMnYzZ3FkN2tvdnBieWcifQ.5y8TQSzYpAzUA9z_D835XA";

class Map extends Component {
    state = {
        markers: []
    };

    _MAP;

    componentDidMount() {
        mapboxgl.accessToken = accessToken;

        this._MAP = new mapboxgl.Map({
            container: mapContainerId, // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [30.52, 50.45], // starting position [lng, lat]
            zoom: 11 // starting zoom
        });

        this._MAP.on("load", () => {
            this._MAP.addSource('route', {
                type: 'geojson',
                data: turf.featureCollection([])
            });

            this._MAP.addLayer({
                id: 'routeline-active',
                type: 'line',
                source: 'route',
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

            this._MAP.on("click", e => {
                const {lngLat: {lng, lat}} = e;
                this.props.onAddMarker({lng, lat});
                fetchForwardGeocoding(accessToken, lng, lat);
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.points !== this.props.points) {
            const {markers} = this.state;
            const {points} = this.props;

            const markersToDelete = markers.filter(marker => !points.find(point => point.id === marker.id));
            const pointsToAdd = points.filter(point => !markers.find(marker => marker.id === point.id));

            let nextMarkers = markers.slice();

            nextMarkers = nextMarkers.filter(marker => {
                const toDelete = markersToDelete.find(m => m.id === marker.id);
                if (toDelete) {
                    this.removeMarkerFromMap(marker);
                }

                return !toDelete;
            });

            pointsToAdd.forEach(point => {
                nextMarkers = nextMarkers.concat(this.addMarkerToMap(point));
            });

            this.setState(ps => {
                return {
                    markers: nextMarkers
                };
            }, () => {
                this.fetchRoute();
            });
        }
    };

    fetchRoute = () => {
        const {markers} = this.state;
        return fetchRoute(accessToken, markers.map(marker => marker.entity.getLngLat())).then(route => {
            this._MAP.getSource('route').setData(route);
        })
    };

    removeMarkerFromMap = (marker) => {
        marker.entity.remove();
    };

    addMarkerToMap = (point) => {
        const {id, coordinates: {lng, lat}} = point;
        return {
            id,
            entity: new mapboxgl.Marker(this.buildFilledMarker()).setLngLat([lng, lat]).addTo(this._MAP)
        };
    };

    buildMarker = (component) => {
        const wrapper = document.createElement("div");
        wrapper.classList = styles.marker;
        ReactDOM.render(React.createElement(component), wrapper);

        return {
            element: wrapper,
            offset: [0, -18]
        };
    };

    buildEmptyMarker = () => this.buildMarker(IconEmptyMarker);
    buildFilledMarker = () => this.buildMarker(IconFilledMarker);

    render() {
        return (
            <div className={styles.wrapper} id={mapContainerId}></div>
        );
    }
}

export default Map;
