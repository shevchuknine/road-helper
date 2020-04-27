import React, {Component} from "react";
import Modal from "react-modal";
import styles from "./Popup.module.scss";

const style = {
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: "0"
    }
};

Modal.setAppElement(document.querySelector("#root"));

class Popup extends Component {
    render() {
        const {isOpen, onClose, header, children, buttons} = this.props;
        return (
            <Modal style={style}
                   onRequestClose={onClose}
                   isOpen={isOpen}
            >
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        {children}
                    </div>
                    <div className={styles.buttons}>
                        {buttons}
                    </div>
                </div>
            </Modal>
        );
    }
}

export default Popup;
