import React, {Component} from "react";
import styles from "../../form/Form.module.scss";
import Input from "../../form/input/Input";
import Button from "../../form/button/Button";
import {signUp} from "../../../api/authApi";
import {Page} from "../pages.constants";

class SignUp extends Component {
    state = {
        error: null,
        email: "",
        password: ""
    };

    onChange = (field, value) => this.setState({[field]: value, error: null});
    onEmailChange = value => this.onChange("email", value);
    onPasswordChange = value => this.onChange("password", value);

    confirm = () => {
        const {email, password} = this.state;
        signUp(email, password).then(() => {
            const {history} = this.props;

            history.replace(Page.logIn);
        }).catch((error) => this.setState({error}));
    };

    render() {
        const {error, email, password} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.form}>
                    <p>Sign up</p>
                    {
                        error && <div className={styles.error}>{error}</div>
                    }
                    <div className={styles.field}>
                        <Input placeholder={"email"} value={email} onChange={this.onEmailChange}/>
                    </div>
                    <div className={styles.field}>
                        <Input placeholder={"password"} type="password" value={password} onChange={this.onPasswordChange}/>
                    </div>
                    <div className={styles.buttons}>
                        <Button text={"Sign up"} onClick={this.confirm} disabled={error}/>
                    </div>
                </div>
            </div>
        );
    }
};

export default SignUp;
