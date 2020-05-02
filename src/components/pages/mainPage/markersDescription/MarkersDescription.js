import React, {Component, createRef, Fragment} from "react";
import styles from "./MarkersDescription.module.scss";
import IconFilledMarker from "../../../icons/IconFilledMarker";
import IconCross from "../../../icons/IconCross";
import Input from "../../../form/input/Input";
import IconEdit from "../../../icons/IconEdit";
import cx from "classnames";
import IconRouteMarker from "../../../icons/IconRouteMarker";

class MarkersDescription extends Component {
    static defaultProps = {
        points: []
    };

    scrollBar = createRef();

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {points} = this.props;
        if (points !== prevProps.points) {
            const wrapper = this.scrollBar.current;
            wrapper.scrollTop = wrapper.scrollHeight;
        }
    }

    buildIcon = () => {
        const {type} = this.props;

        if (type === "poi") {
            return <IconFilledMarker/>;
        }

        if (type === "route") {
            return <IconRouteMarker/>;
        }
    };

    render() {
        const {points, onEdit, onDelete, type, activeStorage, makeActive} = this.props;

        return (
            <div className={cx(styles.wrapper, activeStorage === type && "active")} ref={this.scrollBar} onClick={makeActive}>
                {
                    points.map((point, index) => {
                        const {id, name, address} = point;
                        return (
                            <div key={id} className={styles.marker}>
                                {this.buildIcon()}
                                <div className={styles.data}>
                                    <span className={styles.name}>{name}</span>
                                    <span className={styles.address}>{address}</span>
                                </div>
                                {onEdit && <div className={styles.button} onClick={() => onEdit(point)}><IconEdit/></div>}
                                <div className={styles.button} onClick={() => onDelete(point)}><IconCross/></div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default MarkersDescription;
