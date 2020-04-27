import React, {Component, Fragment} from "react";
import styles from "./Editor.module.scss";
import Map from "../map/Map";
import MarkersDescription from "../markersDescription/MarkersDescription";
import {fetchForwardGeocoding} from "../../../../api/mapApi";
import Input from "../../../form/input/Input";
import PackageDescription from "../packageDescription/PackageDescription";
import {deleteMarker, getMarkers, getPackage, putMarker} from "../../../../api/dataApi";
import generateShortId from "../../../../helpers/shortId";
import InformationPopup from "../../../popups/informationPopup/InformationPopup";


class Editor extends Component {
    state = {
        pack: {},
        points: [],
        pointsAmountPopupIsOpen: false
    };

    onAddMarker = (coordinates, address) => {
        const {pack: {id: packId}, points} = this.state;
        const sameCoordsPointExist = points.find(point => {
            const {coordinates: {lon, lat}} = point;
            return coordinates.lon === lon && coordinates.lat === lat;
        });

        if (sameCoordsPointExist) {
            return;
        }

        if (points.length === 10) {
            this.openPointsAmountPopup();
        } else {
            const newPoint = {id: generateShortId(), coordinates, name: `My point`, address};

            this.setState(ps => ({points: ps.points.concat(newPoint)}));
            putMarker(packId, newPoint);
        }
    };

    onDeleteMarker = (id) => {
        const {pack: {id: packId}} = this.state;

        this.setState(ps => ({points: ps.points.filter(point => point.id !== id)}));
        deleteMarker(packId, id);
    };

    componentDidMount() {
        const {match: {params: {id}}} = this.props;

        Promise.all([
            getPackage(id),
            getMarkers(id)
        ]).then(([pack, points]) => {
            this.setState({pack, points});
        });
    }

    openPointsAmountPopup = () => this.setState({pointsAmountPopupIsOpen: true})
    closePointsAmountPopup = () => this.setState({pointsAmountPopupIsOpen: false})

    render() {
        const {points, pack, pointsAmountPopupIsOpen} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.panel}>
                    <PackageDescription pack={pack}/>
                    <MarkersDescription points={points}
                                        onDelete={this.onDeleteMarker}
                    />
                </div>
                <div className={styles.map}>
                    <Map points={points}
                         onAddMarker={this.onAddMarker}/>
                </div>
                {
                    pointsAmountPopupIsOpen && (
                        <InformationPopup isOpen={pointsAmountPopupIsOpen}
                                          onClose={this.closePointsAmountPopup}
                        >
                            <Fragment>
                                <div>You already have 10 points on your map.</div>
                                <div>Buy a license to be able to add an unlimited number of points.</div>
                            </Fragment>
                        </InformationPopup>
                    )
                }
            </div>
        );
    }
}

export default Editor;
