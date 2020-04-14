import React, {Component} from "react";
import styles from "./Editor.module.scss";
import Map from "./map/Map";
import {v4} from "uuid";
import MarkersDescription from "./markersDescription/MarkersDescription";

class Editor extends Component {
    state = {
        points: []
    };

    onAddMarker = (coordinates) => {
        this.setState(ps => {
            return {
                points: ps.points.concat({id: v4(), coordinates})
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

    render() {
        const {points} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.panel}>
                    <MarkersDescription points={points}
                                        onDelete={this.onDeleteMarker}
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
