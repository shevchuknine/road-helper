import React, {Component} from "react";
import styles from "./markersDescription.module.scss";
import IconFilledMarker from "../../../icons/IconFilledMarker";
import IconCross from "../../../icons/IconCross";

class MarkersDescription extends Component {
    render() {
        const {points, onDelete} = this.props;
        return (
            <div className={styles.wrapper}>
                {
                    points.map((point, index) => {
                        return (
                            <div key={point.id} className={styles.marker}>
                                <IconFilledMarker/>
                                <span className={styles.name}>{index}</span>
                                <div className={styles.cross}
                                     onClick={() => onDelete(point.id)}
                                ><IconCross/></div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default MarkersDescription;
