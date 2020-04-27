import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import Packages from "./packages/Packages";
import Editor from "./editor/Editor";

class MainPage extends Component {
    render() {
        const {match: {url}} = this.props;
        return (
            <Switch>
                <Route path={`${url}/packages`} component={Packages}/>
                <Route exact path={`${url}/package/:id`} component={Editor}/>
            </Switch>
        );
    }
}

export default MainPage;
