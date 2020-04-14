import React, {Component} from "react";

class InputComponent extends Component {
    onChange = e => this.props.onChange(e.target.value);

    render() {
        const {value, placeholder, innerRef, type = "text"} = this.props;
        return (
            <input className={"form-control"}
                   ref={innerRef}
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
