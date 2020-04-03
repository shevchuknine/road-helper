import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";

import EmptyMarker from "../../icons/EmptyMarker";
import FilledMarker from "../../icons/FilledMarker";


const mapContainerId = "map_container";

class Map extends Component {
    componentDidMount() {
        mapboxgl.accessToken = "pk.eyJ1Ijoic2hldmNodWtuaW5lIiwiYSI6ImNrOGhvNHdsbTAyMnYzZ3FkN2tvdnBieWcifQ.5y8TQSzYpAzUA9z_D835XA";

        const MAP = new mapboxgl.Map({
            container: mapContainerId, // container id
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [30.52, 50.45], // starting position [lng, lat]
            zoom: 11 // starting zoom
        });

        MAP.on("load", () => {
            MAP.on("click", e => {
                const {lngLat: {lng, lat}} = e;
                const newPoint = new mapboxgl.Marker(this.buildEmptyMarker()).setLngLat([lng, lat]).addTo(MAP);
                console.log(newPoint);
                // this.props.onAddMarker(newPoint);
            });
        });


    }

    buildMarker = (component) => {
        const wrapper = document.createElement("div");
        wrapper.classList = styles.marker;
        ReactDOM.render(React.createElement(component), wrapper);

        return {
            element: wrapper,
            offset: [0, -18]
        };
    };

    buildEmptyMarker = () => this.buildMarker(EmptyMarker);
    buildFilledMarker = () => this.buildMarker(FilledMarker);

    render() {
        return (
            <div className={styles.wrapper} id={mapContainerId}></div>
        );
    }
}

export default Map;