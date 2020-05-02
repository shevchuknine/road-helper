import React, {Component, Fragment} from "react";
import Popup from "../popup/Popup";
import Button, {buttonType} from "../../form/button/Button";

class ConfirmationPopup extends Component {
    render() {
        const {children, onConfirm, onClose, ...other} = this.props;
        return (
            <Popup buttons={
                <Fragment>
                    <Button text={"Ok"} onClick={onConfirm}/>
                    <Button type={buttonType.light} text={"Cancel"} onClick={onClose}/>
                </Fragment>
            }
                   {...other}
                   onClose={onClose}
            >
                {children}
            </Popup>
        );
    }
}

export default ConfirmationPopup;
