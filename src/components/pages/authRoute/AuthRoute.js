import React, {Component} from "react";
import {Redirect, Route} from "react-router";
import {checkCookie, Cookie} from "../../../helpers/cookie";
import {Page} from "../pages.constants";

class AuthRoute extends Component {
    render() {
        const isAuthorized = checkCookie(Cookie.authorization);

        if (!isAuthorized) {
            return <Redirect to={Page.logIn}/>;
        }

        return (
            <Route {...this.props}/>
        );
    };
}

export default AuthRoute;
