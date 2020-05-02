import React, {Component} from "react";
import styles from "./PackageDescription.module.scss";
import IconEdit from "../../../icons/IconEdit";

class PackageDescription extends Component {
    render() {
        const {pack: {name}, onEdit} = this.props;
        return (
            <div className={styles.wrapper}>
                {name}
                <div className={styles.edit} onClick={onEdit}><IconEdit/></div>
            </div>
        );
    }
}

export default PackageDescription;
