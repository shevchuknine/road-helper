import React, {Component} from "react";
import cx from "classnames";
import styles from "./Button.module.scss";

export const buttonType = {
    primary: "btn-primary",
    light: "btn-light"
};

class Button extends Component {
    static defaultProps = {
        onClick: () => {},
        type: buttonType.primary
    };

    onClick = e => {
        const {disabled, onClick} = this.props;
        if (!disabled) {
            onClick();
        }
    };

    render() {
        const {text, type, className, disabled} = this.props;
        return (
            <div className={cx(styles.wrapper, className, "btn", type, disabled ? "disabled" : undefined)} onClick={this.onClick}>
                {text}
            </div>
        );
    }
}

export default Button;
