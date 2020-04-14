import React, {Component} from "react";
import {withRouter} from "react-router";
import styles from "./Header.module.scss";
import Button, {buttonType} from "../form/button/Button";
import {Page} from "../pages/pages.constants";
import {checkCookie, Cookie} from "../../helpers/cookie";
import {signOut} from "../../api/authApi";

class Header extends Component {
    goToSignUp = () => {
        this.props.history.push(Page.signUp);
        this.forceUpdate();
    };

    goToLogIn = () => {
        this.props.history.push(Page.logIn);
        this.forceUpdate();
    };

    goToSignOut = () => signOut().then(this.goToLogIn);

    render() {
        const {location: {pathname}} = this.props;
        return (
            <header className={styles.wrapper}>
                <div>One billion idea </div>
                {
                    checkCookie(Cookie.authorization) ? (
                        <div className={styles.buttons}>
                            <Button text={"Sign Out"} type={buttonType.light} onClick={this.goToSignOut}/>
                        </div>
                    ) : (
                        <div className={styles.buttons}>
                            {pathname !== Page.signUp && <Button text={"Sign Up"} type={buttonType.light} onClick={this.goToSignUp}/>}
                            {pathname !== Page.logIn && <Button text={"Log In"} type={buttonType.light} onClick={this.goToLogIn}/>}
                        </div>
                    )
                }
            </header>
        );
    }
}

export default withRouter(Header);
