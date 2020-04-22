import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import {Page} from "../pages.constants";
import Packages from "../packages/Packages";
import Editor from "../editorPage/Editor";

class Main extends Component {
    render() {
        return (
            <Switch>
                <Route path={Page.main_packages} component={Packages}/>
                <Route exact path={`${Page.main_editor}/:id`} component={Editor}/>
            </Switch>
        );
    }
}

export default Main;
