import React, {Component} from 'react';
import {Router, Switch, Route, Redirect} from "react-router-dom";
import SignUp from "../pages/signUp/SignUp";
import LogIn from "../pages/logIn/LogIn";
import Editor from "../pages/editorPage/Editor";
import Header from "../header/Header";
import Body from "../body/Body";
import {Page} from "../pages/pages.constants";
import AuthRoute from "../pages/authRoute/AuthRoute";
import Main from "../pages/main/Main";
import history from "../../helpers/history";

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Header/>
                <Body>
                    <Switch>
                        <Route path={Page.signUp} component={SignUp}/>
                        <Route path={Page.logIn} component={LogIn}/>
                        <AuthRoute path={Page.main} component={Main}/>
                        <Redirect from={Page.root} to={Page.main_packages}/>
                    </Switch>
                </Body>
            </Router>
        );
    }
}

export default App;
