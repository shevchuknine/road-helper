import React, {Component} from "react";
import ReactDOM from 'react-dom';
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.scss";
import "mapbox-gl/dist/mapbox-gl.css";


/*
* для загрузки в карту используются svg-иконки в .svg формате
* для использования в остальном приложении svg-иконки в формате компонент
* */
import IconFilledMarker from "../../../icons/IconFilledMarker.svg";
import IconRouteMarker from "../../../icons/IconRouteMarker.svg";
import IconCarrot from "../../../icons/IconCarrot.svg";
import apple from "../../../icons/apple.svg";
import {ACCESS_TOKEN, fetchForwardGeocoding, fetchRoute, getDatasets, getTilesets} from "../../../../api/mapApi";

const turf = window.turf;
const mapContainerId = "map_container";
/*
* объект, который содержит всю полезную инфу по слоям/сурсам.
* используется и при объявлении сурсов/слоев и при переключении видимых/невидимых слоев poi
* */
export const mapItems = {
    poiMarker: {source: "OBI_poi-marker_source", layer: "OBI_poi-marker_layer"},
    routeMarker: {source: "OBI_route-marker_source", layer: "OBI_route-marker_layer"},
    route: {source: "OBI_route_source", layer: "OBI_route_layer"},
    restaurant: {layer: "OBI_restaurant_layer", zoom: 13},
    cafe: {layer: "OBI_cafe_layer", zoom: 15},
};

class Map extends Component {
    _MAP;

    addSource = (sourceId) => {
        // only when map loaded
        this._MAP.addSource(sourceId, {
            type: "geojson",
            data: turf.featureCollection([])
        });
    };

    loadImage = (name, url) => {
        // only when map loaded
        let image = new Image(40, 40);
        image.onload = () => this._MAP.addImage(name, image);
        image.src = url;

        return name;
    };

    addLayer = (id, imageName, additionalData = {}) => {
        // only when map loaded
        this._MAP.addLayer({
            id,
            type: "symbol",
            layout: {
                "icon-image": imageName,
                "icon-allow-overlap": true
            },
            ...additionalData
        });
    };

    componentDidMount() {
        mapboxgl.accessToken = ACCESS_TOKEN;

        this._MAP = new mapboxgl.Map({
            container: mapContainerId,
            style: 'mapbox://styles/shevchuknine/ckaze1ma00knr1iqp66zme6sq', // stylesheet location
            center: [30.52, 50.45],
            zoom: 11,
            secure: true
        });

        this._MAP.on("load", () => {
            /*
            * создание и добавление нужных сурсов и слоев при загрузке карты.
            * первоначальный mapbox интерфейс показался неудобным, потому была сделана "обертка".
            * но на деле, обертка не сильно упростила весь этот процесс.
            * вероятно, стоит подумать как это упростить :)
            *
            * сохраненные точки, точки маршрута и сам маршрут имеют отдельные сурсы, собственные.
            *
            * активные poi используют либо существующий сурс mapbox (который ограничен зумом), либо кастомный,
            * который добавлен через mapbox studio (дополнительная дока, раздел "решение проблемы с кастомными точками на карте")
            * */

            // наши poi точки (красные)
            this.addSource(mapItems.poiMarker.source);
            this.addLayer(mapItems.poiMarker.layer, this.loadImage("poiMarker", IconFilledMarker), {source: mapItems.poiMarker.source});

            // сиине маркеры (маршрута)
            const imageName = "routeMarker";
            this.addSource(mapItems.routeMarker.source);
            this.addLayer(mapItems.routeMarker.layer, this.loadImage(imageName, IconRouteMarker), {
                source: mapItems.routeMarker.source,
                layout: {
                    "icon-image": imageName,
                    "icon-allow-overlap": true,
                    "text-optional": true,
                    "text-field": ["get", "title"],
                    "text-font": ["Open Sans Bold"],
                    "text-size": 18
                },
            });

            // рестораны
            this.addLayer(mapItems.restaurant.layer, this.loadImage("restaurantMarker", IconCarrot), {
                source: "composite",
                "source-layer": "restaurants_kiev"
            });
            this._MAP.setLayoutProperty(mapItems.restaurant.layer, "visibility", "none");

            // кафе
            this.addLayer(mapItems.cafe.layer, this.loadImage("cafeMarker", apple), {
                source: "composite",
                "source-layer": "poi_label",
                filter: ["==", "type", "Cafe"]
            });
            this._MAP.setLayoutProperty(mapItems.cafe.layer, "visibility", "none");

            // route
            this.addSource(mapItems.route.source);
            this._MAP.addLayer({
                id: mapItems.route.layer,
                type: 'line',
                source: mapItems.route.source,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#0D44F5',
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

    /*
    * создание featureCollection на основании данных.
    * вероятно, подобную функциональность может предоставить turf.featureCollection.
    * */
    buildSourceData = (points) => {
        return {
            type: "FeatureCollection",
            features: points.slice(0).reverse().map((point, index, array) => {
                const {loc: {lon, lat}} = point;
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    },
                    properties: {
                        title: array.length - index
                    }
                };
            })
        };
    };

    /*
    * показывает/прячет слои с poi (по тем id, что устанавливаются в Editor-е)
    * */
    togglePoiMarkers = (prevPoi, currentPoi) => {
        const itemsToHide = prevPoi.filter(id => !currentPoi.includes(id));
        const itemsToShow = currentPoi.filter(id => !prevPoi.includes(id));

        itemsToHide.forEach(i => this._MAP.setLayoutProperty(i, "visibility", "none"));
        itemsToShow.forEach(i => this._MAP.setLayoutProperty(i, "visibility", "visible"));

        /*
        * poi, которые предоставляются самим mapbox, доступны на определенных уровнях зума.
        * метод ниже приближает к нужному зуму, чтобы было видно все активные слои.
        * в теории, эта функциональность будет не нужна, если использовать свои собственные точки,
        * согласно доп. доке (заголовок "решение проблемы с кастомными точками на карте")
        * */
        const lowestVisibleZoom = Math.min(Object.values(mapItems).reduce((res, {layer, zoom}) => {
            return itemsToShow.includes(layer) ? [...res, zoom] : res;
        }, []));
        const currentZoom = this._MAP.getZoom();

        if (currentZoom < lowestVisibleZoom) {
            this._MAP.zoomTo(lowestVisibleZoom, {duration: (lowestVisibleZoom - currentZoom) * 650});
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {points, routePoints, navi, poi} = this.props;
        /*
        * обновление точек по факту добавления/удаления.
        * функциональность привязана к загрузке карты, потому сделано с дополнительными попытками установить значения
        * в случае, если карта еще не загружена.
        * в идеале, должно быть решено через map.onload дял начальных данных.
        * в целях экономии времени сделано так :)
        * */
        if (prevProps.points !== points || prevProps.routePoints !== routePoints || prevProps.navi !== navi) {
            const tryToSetData = () => {
                if (this._MAP.loaded()) {
                    this._MAP.getSource(mapItems.poiMarker.source).setData(this.buildSourceData(points));
                    this._MAP.getSource(mapItems.routeMarker.source).setData(this.buildSourceData(routePoints));
                    this._MAP.getSource(mapItems.route.source).setData(turf.featureCollection([turf.feature({coordinates: navi, type: "LineString"})]));
                } else {
                    setTimeout(tryToSetData, 1000);
                }
            };

            tryToSetData();
        }

        if (prevProps.poi !== poi) {
            this.togglePoiMarkers(prevProps.poi, poi);
        }
    }

    render() {
        return <div className={styles.wrapper} id={mapContainerId}></div>;
    }
}

export default Map;
