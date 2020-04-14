import React, {Component} from "react";
import styles from "./Body.module.scss";

class Body extends Component {
    render() {
        return (
            <div className={styles.wrapper}>
                {this.props.children}
            </div>
        );
    }
}

export default Body;
