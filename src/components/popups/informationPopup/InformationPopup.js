import React, {Component} from "react";
import Popup from "../popup/Popup";
import Button from "../../form/button/Button";

class InformationPopup extends Component {
    render() {
        const {children, onClose, ...other} = this.props;
        return (
            <Popup buttons={<Button text={"Ok"} onClick={onClose}/>}
                   {...other}
                   onClose={onClose}
            >
                {children}
            </Popup>
        );
    }
}

export default InformationPopup;
