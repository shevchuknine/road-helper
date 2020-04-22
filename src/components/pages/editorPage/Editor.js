import React, {Component} from "react";
import styles from "./Editor.module.scss";
import Map from "./map/Map";
import {v4} from "uuid";
import MarkersDescription from "./markersDescription/MarkersDescription";
import {fetchForwardGeocoding} from "../../../api/mapApi";
import Input from "../../form/input/Input";
import PackageDescription from "./packageDescription/PackageDescription";
import {getMarkers, getPackage, putMarker} from "../../../api/dataApi";


class Editor extends Component {
    state = {
        pack: {},
        points: []
    };

    onAddMarker = (coordinates, name) => {
        const {match: {params: {id: packId}}} = this.props;
        const newPoint = {id: v4(), coordinates, name};

        this.setState(ps => ({points: ps.points.concat(newPoint)}));
        putMarker(packId, newPoint);
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

    componentDidMount() {
        const {match: {params: {id}}} = this.props;

        Promise.all([
            getPackage(id),
            getMarkers(id)
        ]).then(([pack, points]) => {
            this.setState({pack, points});
        });
    }

    render() {
        const {points, pack} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.panel}>
                    <PackageDescription pack={pack}/>
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
