import React, {Component} from "react";
import Input from "../../../form/input/Input";
import Button from "../../../form/button/Button";
import styles from "./PackageDescription.module.scss";

class PackageDescription extends Component {
    render() {
        const {pack: {name}} = this.props;
        return (
            <div className={styles.wrapper}>
                <Input value={name || ""}/>
                <Button className={styles.save}
                        text={"Save"}/>
            </div>
        );
    }
}

export default PackageDescription;
