import React, {Component, Fragment} from "react";
import styles from "./markersDescription.module.scss";
import IconFilledMarker from "../../../icons/IconFilledMarker";
import IconCross from "../../../icons/IconCross";
import Input from "../../../form/input/Input";

class MarkersDescription extends Component {
    state = MarkersDescription.getInitialState();

    static getInitialState = () => {
        return {
            editedPoint: null
        };
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {points} = this.props;
        if (points !== prevProps.points && points.length > prevProps.points.length) {
            const {id, name} = points.find(point => prevProps.points.find(prevPoint => prevPoint.id === point.id) === undefined);
            this.setState({editedPoint: {id, name}});
        }
    }

    onChange = (name) => {
        this.setState(ps => ({
            editedPoint: {...ps.editedPoint, name}
        }));
    };

    onEnter = (id) => () => {
        const {onPointNameChange} = this.props, {editedPoint} = this.state;

        this.setState(MarkersDescription.getInitialState(), () => {
            onPointNameChange(id, editedPoint.name);
        })
    };

    render() {
        const {points, onDelete} = this.props,
            {editedPoint} = this.state;

        return (
            <div className={styles.wrapper}>
                {
                    points.map((point, index) => {
                        const {id, name} = point;
                        return (
                            <div key={id} className={styles.marker}>
                                <IconFilledMarker/>
                                {
                                    editedPoint && editedPoint.id === id ? (
                                        <Input value={editedPoint.name}
                                               onChange={this.onChange}
                                               onEnter={this.onEnter(id)}/>
                                    ) : (
                                        <Fragment>
                                            <span className={styles.name}>{name}</span>
                                            <div className={styles.cross}
                                                 onClick={() => onDelete(id)}
                                            ><IconCross/></div>
                                        </Fragment>
                                    )
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default MarkersDescription;
