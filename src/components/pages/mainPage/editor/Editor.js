import React, {Component, Fragment} from "react";
import styles from "./Editor.module.scss";
import Map from "../map/Map";
import MarkersDescription from "../markersDescription/MarkersDescription";
import {fetchForwardGeocoding, fetchRoute} from "../../../../api/mapApi";
import Input from "../../../form/input/Input";
import PackageDescription from "../packageDescription/PackageDescription";
import {deleteMarker, getMarkers, getPackage, getRoutes, putMarker, putRoute} from "../../../../api/dataApi";
import generateShortId from "../../../../helpers/shortId";
import InformationPopup from "../../../popups/informationPopup/InformationPopup";
import ConfirmationPopup from "../../../popups/confirmationPopup/ConfirmationPopup";
import PointEditPopup from "../../../popups/pointEditPopup/PointEditPopup";
import PackEditPopup from "../../../popups/packEditPopup/PackEditPopup";
import RouteDescription from "../routeDescription/RouteDescription";
import PoiPanel from "../poiPanel/PoiPanel";

const sameCoordsPointCheck = (points, lon, lat) => {
    return points.find(point => {
        const {loc: {lon: existedLon, lat: existedLat}} = point;
        return existedLon === lon && existedLat === lat;
    });
};

class Editor extends Component {
    state = {
        poi: [], // левая колонка, хранятся активные типы POI, которые оторажаются на карте
        activeStorage: "route", //todo: будет выпилено как только разберемся где редактировать poi
        pack: {},
        points: [],
        route: {},
        pointsAmountPopup: {
            isOpen: false
        },
        pointEditPopup: {
            isOpen: false,
            data: {}
        },
        packEditPopup: {
            isOpen: false,
            data: {}
        }
    };

    onAddMarker = (lon, lat) => {
        const {pack: {id: packId}, points, route: {points: routePoints = []}, activeStorage} = this.state;
        const sameCoordsPointExist = sameCoordsPointCheck([...points, ...routePoints], lon, lat);

        if (sameCoordsPointExist) {
            return;
        }

        if (activeStorage === "poi") {
            if (points.length === 10) {
                this.openPointsAmountPopup();
            } else {
                fetchForwardGeocoding(lon, lat).then(address => {
                    const newPoint = {id: generateShortId(), loc: {lon, lat}, name: `My point`, address: address || "default address"};

                    this.setState(ps => ({points: ps.points.concat(newPoint)}));
                    putMarker(packId, newPoint);
                });
            }
        } else {
            if (routePoints.length === 10) {
                this.openPointsAmountPopup();
            } else {
                fetchForwardGeocoding(lon, lat).then(address => {
                    const newPoint = {id: generateShortId(), loc: {lon, lat}, name: `My route point`, address: address || "default address"};

                    this.setState(ps => {
                        return {
                            route: {
                                ...ps.route,
                                points: [...ps.route.points, newPoint]
                            }
                        };
                    }, this.updateNavi);
                });
            }
        }
    };

    updateNavi = () => {
        const {route: {points = []}} = this.state;

        fetchRoute(points.map(point => point.loc)).then(navi => {
            this.setState(ps => ({
                route: {
                    ...ps.route,
                    navi
                }
            }), () => {
                const {route: {id, points, navi}, pack: {id: packId}} = this.state;
                putRoute(packId, id, navi, points);
            });
        });
    };

    onDeleteMarker = (point) => {
        const {id} = point;
        const {pack: {id: packId}} = this.state;

        this.setState(ps => ({points: ps.points.filter(point => point.id !== id)}));
        deleteMarker(packId, id);
    };

    onDeleteRouteMarker = (point) => {
        const {id} = point;
        const {pack: {id: packId}} = this.state;

        this.setState(ps => ({
            route: {
                ...ps.route,
                points: ps.route.points.filter(p => p.id !== id)
            }
        }), this.updateNavi);
    };

    refreshData = () => {
        const {match: {params: {id}}} = this.props;

        return Promise.all([
            getPackage(id),
            getMarkers(id),
            getRoutes(id)
        ]).then(([pack, points, route]) => {
            this.setState({pack, points, route});
        });
    };

    componentDidMount() {
        this.refreshData();
    }

    openPointsAmountPopup = () => this.setState(ps => ({pointsAmountPopup: {...ps.pointsAmountPopup, isOpen: true}}));
    closePointsAmountPopup = () => this.setState(ps => ({pointsAmountPopup: {...ps.pointsAmountPopup, isOpen: false}}));
    renderPointsAmountPopup = () => {
        const {pointsAmountPopup: {isOpen}} = this.state;
        return isOpen && (
            <InformationPopup onClose={this.closePointsAmountPopup}>
                <Fragment>
                    <div>You already have 10 points on your map.</div>
                    <div>Buy a license to be able to add an unlimited number of points.</div>
                </Fragment>
            </InformationPopup>
        );
    };

    openPointEditPopup = (data) => this.setState(ps => ({pointEditPopup: {...ps.pointEditPopup, isOpen: true, data}}));
    closePointEditPopup = () => this.setState(ps => ({pointEditPopup: {...ps.pointEditPopup, isOpen: false, data: {}}}));
    renderPointEditPopup = () => {
        const {pointEditPopup: {isOpen, data}, pack: {id}} = this.state;

        const onConfirm = () => {
            this.refreshData().then(() => {
                this.closePointEditPopup();
            });
        };

        return isOpen && (
            <PointEditPopup data={data}
                            packId={id}
                            onConfirm={onConfirm}
                            onClose={this.closePointEditPopup}
            />
        );
    };

    openPackEditPopup = () => this.setState(ps => ({packEditPopup: {...ps.packEditPopup, isOpen: true, data: ps.pack}}));
    closePackEditPopup = () => this.setState(ps => ({packEditPopup: {...ps.packEditPopup, isOpen: false, data: {}}}));
    renderPackEditPopup = () => {
        const {packEditPopup: {isOpen, data}} = this.state;

        const onConfirm = () => {
            this.refreshData().then(() => {
                this.closePackEditPopup();
            });
        };

        return isOpen && (
            <PackEditPopup data={data}
                           onConfirm={onConfirm}
                           onClose={this.closePackEditPopup}
            />
        );
    };

    updatePoi = id => {
        this.setState(ps => {
            const prevPoi = ps.poi;
            return {
                poi: prevPoi.includes(id) ? prevPoi.filter(i => i !== id) : [...prevPoi, id]
            };
        })
    };

    render() {
        const {points, pack, poi, route: {points: routePoints = [], navi = []}} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.poiPanel}>
                    <PoiPanel updatePoi={this.updatePoi}/>
                </div>
                <div className={styles.map}>
                    <Map points={points}
                         navi={navi}
                         routePoints={routePoints}
                         poi={poi}
                         onAddMarker={this.onAddMarker}/>
                </div>
                <div className={styles.panel}>
                    <PackageDescription pack={pack}
                                        onEdit={this.openPackEditPopup}
                    />
                    <div className={styles.descriptions}>
                        {/*<MarkersDescription points={points}*/}
                                            {/*onDelete={this.onDeleteMarker}*/}
                                            {/*onEdit={this.openPointEditPopup}*/}
                        {/*/>*/}
                        <MarkersDescription points={routePoints}
                                            onDelete={this.onDeleteRouteMarker}
                        />
                    </div>
                </div>
                {this.renderPointsAmountPopup()}
                {this.renderPointEditPopup()}
                {this.renderPackEditPopup()}
            </div>
        );
    }
}

export default Editor;
