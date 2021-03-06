import React, {Component} from "react";
import styles from "./PoiPanel.module.scss";
import {mapItems} from "../map/Map";

/*
* пока технический компонент для обновления видимых слоев poi.
* не понятно, нужна ли будет эта функциональность в ближайшее время
* */
class PoiPanel extends Component {
    onClick = id => _ => {
        const {updatePoi} = this.props;

        updatePoi(id);
    };

    render() {
        return (
            <div className={styles.wrapper}>
                <div onClick={this.onClick(mapItems.restaurant.layer)}>Restaurant</div>
                <div onClick={this.onClick(mapItems.cafe.layer)}>Cafe</div>
            </div>
        );
    }
}

export default PoiPanel;