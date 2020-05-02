import React, {Component, Fragment} from "react";
import ConfirmationPopup from "../confirmationPopup/ConfirmationPopup";
import formStyles from "../../form/Form.module.scss";
import Input from "../../form/input/Input";
import {putMarker} from "../../../api/dataApi";

class PointEditPopup extends Component {
    constructor(props) {
        super();

        const {packId, data} = props;
        this.state = {
            packId,
            data
        };
    }

    onChangeName = (name) => this.setState(ps => ({data: {...ps.data, name}}));

    onConfirm = () => {
        const {data} = this.state;
        const {packId, onConfirm} = this.props;

        putMarker(packId, data).then(onConfirm);
    };

    render() {
        const {onClose} = this.props;
        const {data: {name, address}} = this.state;
        return (
            <ConfirmationPopup onConfirm={this.onConfirm}
                               onClose={onClose}>
                <Fragment>
                    <div className={formStyles.field}>
                        <Input placeholder={"name"} value={name} onChange={this.onChangeName}/>
                    </div>
                    <div className={formStyles.field}>
                        <Input placeholder={"address"} value={address} disabled/>
                    </div>
                </Fragment>
            </ConfirmationPopup>
        );
    }
}

export default PointEditPopup;
