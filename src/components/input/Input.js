import React, {Component} from "react";

class InputComponent extends Component {
    onChange = e => this.props.onChange(e.target.value);

    render() {
        const {value, innerRef} = this.props;
        return (
            <input className={"form-control"}
                   ref={innerRef}
                   value={value} onChange={this.onChange}/>
        );
    }
}

const Input = React.forwardRef((props, ref) => {
    return <InputComponent {...props} innerRef={ref}/>
})

export default Input;