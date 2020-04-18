import React, {Component} from "react";
import styles from "./Editor.module.scss";
import Map from "./map/Map";
import {v4} from "uuid";
import MarkersDescription from "./markersDescription/MarkersDescription";
import {fetchForwardGeocoding} from "../../../api/mapApi";

class Editor extends Component {
    state = {
        points: []
    };

    onAddMarker = (coordinates, name) => {
        const newPointId = v4();
        this.setState(ps => {
            return {
                points: ps.points.concat({id: newPointId, coordinates, name})
            };
        });
    };

    onDeleteMarker = (id) => {
        this.setState(ps => {
            return {
                points: ps.points.filter(point => point.id !== id)
            };
        });
    };

    onPointPropertyChange = (propName, id, value) => {
        this.setState(ps => ({
            points: ps.points.map(point => point.id === id ? {...point, [propName]: value} : point)
        }))
    };

    onPointNameChange = (id, value) => this.onPointPropertyChange("name", id, value);

    render() {
        const {points} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.panel}>
                    <MarkersDescription points={points}
                                        onDelete={this.onDeleteMarker}
                                        onPointNameChange={this.onPointNameChange}
                    />
                </div>
                <div className={styles.map}>
                    <Map points={points}
                         onAddMarker={this.onAddMarker}/>
                </div>
            </div>
        );
    }
}

export default Editor;
