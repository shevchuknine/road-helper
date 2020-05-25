import React, {Component} from "react";
import styles from "./PackageDescription.module.scss";

class PackageDescription extends Component {
    render() {
        const {pack: {name}} = this.props;
        return (
            <div className={styles.wrapper}>
                {name}
            </div>
        );
    }
}

export default PackageDescription;
