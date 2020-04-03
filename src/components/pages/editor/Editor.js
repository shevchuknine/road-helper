import React, {Component} from "react";
import styles from "./Editor.module.scss";
import Map from "../map/Map";
import Input from "../../input/Input";

class Editor extends Component {
    inputRef = React.createRef();

    state = {
        points: [],
        inputVisible: false,
        input: ""
    };

    onChange = input => this.setState({input});

    onAddMarker = (point) => {
        // this.setState(ps => ({points: ps.points.concat(point)}));
        this.setState({inputVisible: true}, () => this.inputRef.current.focus());
    };

    render() {
        const {input, inputVisible} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.panel}>
                    {
                        inputVisible && <Input ref={this.inputRef} value={input} onChange={this.onChange}/>
                    }
                </div>
                <div className={styles.map}>
                    <Map onAddMarker={this.onAddMarker}/>
                </div>
            </div>
        );
    }
}

export default Editor;