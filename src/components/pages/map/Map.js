import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import IconEmptyMarker from "../../icons/IconEmptyMarker";
import IconFilledMarker from "../../icons/IconFilledMarker";

const turf = window.turf;

const mapContainerId = "map_container";

class Map extends Component {
    state = {
        markers: {}
    };

    _MAP;

    componentDidMount() {
        mapboxgl.accessToken = "pk.eyJ1Ijoic2hldmNodWtuaW5lIiwiYSI6ImNrOGhvNHdsbTAyMnYzZ3FkN2tvdnBieWcifQ.5y8TQSzYpAzUA9z_D835XA";

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
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.points !== this.props.points) {
            const {markers} = this.state;

            const markerIdsToDelete = Object.keys(markers).filter(id => !this.props.points[id]);
            const pointIdsToAdd = Object.keys(this.props.points).filter(id => !markers[id]);

            const nextMarkers = {...markers};

            markerIdsToDelete.forEach(id => {
                this.removeMarkerFromMap(id);
                delete nextMarkers[id];
            });

            pointIdsToAdd.forEach(id => {
                nextMarkers[id] = this.addMarkerToMap(this.props.points[id]);
            });

            this.setState(ps => {
                return {
                    markers: nextMarkers
                };
            }, () => {
                fetch(this.buildRouteRequest()).then(res => res.json()).then(data => {
                    if (data.trips) {
                        console.log("Asd")
                        const route = turf.featureCollection([turf.feature(data.trips[0].geometry)]);
                        this._MAP.getSource('route').setData(route);
                    }
                })
            });
        }
    }

    buildRouteRequest = () => {
        const {markers} = this.state;
        return `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${Object.values(markers).map(marker => {
            const coords = marker.getLngLat();
            return `${coords.lng},${coords.lat}`;
        }).join(";")}?overview=simplified&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`;
    };

    removeMarkerFromMap = (id) => {
        const {markers} = this.state;
        markers[id].remove();
    };

    addMarkerToMap = (description) => {
        const {lng, lat} = description;
        return new mapboxgl.Marker(this.buildFilledMarker()).setLngLat([lng, lat]).addTo(this._MAP);
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
