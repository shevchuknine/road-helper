import React, {Component} from "react";
import styles from "./markersDescription.module.scss";
import IconFilledMarker from "../../icons/IconFilledMarker";
import IconCross from "../../icons/IconCross";

class MarkersDescription extends Component {
    render() {
        const {points, onDelete} = this.props;
        return (
            <div className={styles.wrapper}>
                {
                    Object.entries(points).map(([id, item], index) => {
                        return (
                            <div className={styles.marker}>
                                <IconFilledMarker/>
                                <span className={styles.name}>{index}</span>
                                <div className={styles.cross}
                                     onClick={() => onDelete(id)}
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
