import React, {Component} from "react";
import {Redirect, Route} from "react-router";
import {checkCookie, Cookie} from "../../../../helpers/cookie";

/*
* Когда сессия экспайрится, любой переход на Route, обернутый в AuthRoute приведет к
* редиректу на страничку авторизации
* */
class AuthRoute extends Component {
    render() {
        const isAuthorized = checkCookie(Cookie.authorization);

        if (!isAuthorized) {
            return <Redirect to={"/login"}/>;
        }

        return (
            <Route {...this.props}/>
        );
    };
}

export default AuthRoute;
