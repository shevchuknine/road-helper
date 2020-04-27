import React, {Component, createRef, Fragment} from "react";
import styles from "./MarkersDescription.module.scss";
import IconFilledMarker from "../../../icons/IconFilledMarker";
import IconCross from "../../../icons/IconCross";
import Input from "../../../form/input/Input";

class MarkersDescription extends Component {
    scrollBar = createRef();

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {points} = this.props;
        if (points !== prevProps.points) {
            const wrapper = this.scrollBar.current;
            wrapper.scrollTop = wrapper.scrollHeight;
        }
    }

    render() {
        const {points, onDelete} = this.props;

        return (
            <div className={styles.wrapper} ref={this.scrollBar}>
                {
                    points.map((point, index) => {
                        const {id, name, address} = point;
                        return (
                            <div key={id} className={styles.marker}>
                                <IconFilledMarker/>
                                <div className={styles.data}>
                                    <span className={styles.name}>{name}</span>
                                    <span className={styles.address}>{address}</span>
                                </div>
                                <div className={styles.cross} onClick={() => onDelete(id)}
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
