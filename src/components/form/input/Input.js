import React, {Component} from "react";
import cx from "classnames";
import styles from "./Input.module.scss";

class InputComponent extends Component {
    constructor(props) {
        super(props);

        this.ref = props.innerRef || React.createRef();
    }

    onChange = e => this.props.onChange(e.target.value);
    onEnterHandler = (event) => {
        const {code} = event, {onEnter} = this.props;

        if (code === "Enter") {
            onEnter && onEnter();
        }
    };

    componentDidMount() {
        let element = this.ref.current;
        element.focus();
        element.addEventListener("keydown", this.onEnterHandler);
    }

    componentWillUnmount() {
        let element = this.ref.current;
        element.removeEventListener("keydown", this.onEnterHandler);
    }

    render() {
        const {value, placeholder, innerRef, type = "text"} = this.props;
        return (
            <input className={cx(styles.wrapper, "form-control")}
                   ref={this.ref}
                   placeholder={placeholder}
                   type={type}
                   value={value} onChange={this.onChange}/>
        );
    }
}

const Input = React.forwardRef((props, ref) => {
    return <InputComponent {...props} innerRef={ref}/>
})

export default Input;
