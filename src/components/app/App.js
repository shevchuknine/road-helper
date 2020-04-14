import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom";
import SignUp from "../pages/signUp/SignUp";
import LogIn from "../pages/logIn/LogIn";
import Editor from "../pages/editorPage/Editor";
import Header from "../header/Header";
import Body from "../body/Body";
import {Page} from "../pages/pages.constants";
import AuthRoute from "../pages/authRoute/AuthRoute";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header/>
                <Body>
                    <Switch>
                        <Route path={Page.signUp} component={SignUp}/>
                        <Route path={Page.logIn} component={LogIn}/>
                        <AuthRoute path={Page.app} component={Editor}/>
                        <Redirect from={Page.root} to={Page.app}/>
                    </Switch>
                </Body>
            </BrowserRouter>
        );
    }
}

export default App;
