import React, {Component, Fragment} from "react";
import ConfirmationPopup from "../confirmationPopup/ConfirmationPopup";
import formStyles from "../../form/Form.module.scss";
import Input from "../../form/input/Input";
import {putMarker, putPackage} from "../../../api/dataApi";

class PackEditPopup extends Component {
    constructor(props) {
        super();

        const {data} = props;
        this.state = {
            data
        };
    }

    onChangeName = (name) => this.setState(ps => ({data: {...ps.data, name}}));

    onConfirm = () => {
        const {data} = this.state;
        const {id} = data;
        const {onConfirm} = this.props;

        putPackage(id, data).then(onConfirm);
    };

    render() {
        const {onClose} = this.props;
        const {data: {name}} = this.state;
        return (
            <ConfirmationPopup onConfirm={this.onConfirm}
                               onClose={onClose}>
                <Fragment>
                    <div className={formStyles.field}>
                        <Input placeholder={"name"} value={name} onChange={this.onChangeName}/>
                    </div>
                </Fragment>
            </ConfirmationPopup>
        );
    }
}

export default PackEditPopup;
