import React, {Component} from 'react';
import {Router, Switch, Route, Redirect} from "react-router-dom";
import SignUpPage from "../pages/signUpPage/SignUpPage";
import LogInPage from "../pages/logInPage/LogInPage";
import Editor from "../pages/mainPage/editor/Editor";
import Header from "../header/Header";
import Body from "../body/Body";
import AuthRoute from "../pages/common/authRoute/AuthRoute";
import Main from "../pages/mainPage/MainPage";
import history from "../../helpers/history";

class App extends Component {
    render() {
        return (
            <Router history={history}>
                <Header/>
                <Body>
                    <Switch>
                        <Route path={"/signup"} component={SignUpPage}/>
                        <Route path={"/login"} component={LogInPage}/>
                        <AuthRoute path={"/main"} component={Main}/>
                        <Redirect from={"/"} to={"/main/packages"}/>
                    </Switch>
                </Body>
            </Router>
        );
    }
}

export default App;
