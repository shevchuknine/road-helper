import React, {Component, createRef, Fragment} from "react";
import styles from "./MarkersDescription.module.scss";
import cx from "classnames";
import IconBurger from "../../../icons/IconBurger";

/*
* компонент для отрисовки точек маршрута (он же использовался и для отрисовки сохраненных точек)
* в теории, дальше, это должны быть разные компоненты.
* */
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

    buildLastEmptyMarker = () => {
        const {points} = this.props;
        return (
            <div className={cx(styles.marker, styles.last)}>
                <div className={styles.track}>
                    <div className={styles.icon}/>
                </div>
                <div className={styles.data}>
                    <span className={styles.name}>
                        {points.length > 0 ? "Add next point" : "Add first point"}
                    </span>
                </div>
            </div>
        );
    };

    render() {
        const {points, onEdit, onDelete} = this.props;

        return (
            <div className={styles.markers} ref={this.scrollBar}>
                {
                    points.map(point => {
                        const {id, name, address} = point;
                        return (
                            <div key={id} className={styles.marker}>
                                <div className={styles.track}>
                                    <div className={styles.icon}/>
                                </div>
                                <div className={styles.data}>
                                    <span className={styles.name}>{name}</span>
                                    <span className={styles.address}>{address}</span>
                                </div>
                                {/*{onEdit && <div className={styles.button} onClick={() => onEdit(point)}><IconEdit/></div>}*/}
                                <div className={styles.button} onClick={() => onDelete(point)}><IconBurger/></div>
                            </div>
                        );
                    })
                }
                {this.buildLastEmptyMarker()}
            </div>
        );
    }
}

export default MarkersDescription;
