import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp/SignUpPage";
import { ForgotPasswordLink } from "../ForgotPassword/ForgotPasswordPage";
import GoogleSignIn from "./GoogleSignIn";
import { withFirebase } from "../../components/Firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";

import * as ROUTES from "../../constants/routes";

import "./SignInPage.scss";

const SignInPage = () => (
    <Paper className="small-paper-form" elevation={1}>
        <h1>Sign In</h1>
        <GoogleSignIn />
        <SignInForm />
        <ForgotPasswordLink />
        <SignUpLink />
    </Paper>
);

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === "" || email === "";

        return (
            <form onSubmit={this.onSubmit} className="sign-in-form">
                <FormControl required fullWidth>
                    <TextField
                        required
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="text"
                        fullWidth
                        value={email}
                        onChange={this.onChange}
                    />
                </FormControl>
                <FormControl required fullWidth>
                    <TextField
                        required
                        name="password"
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={this.onChange}
                    />
                </FormControl>
                <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    onClick={this.props.onClose}
                    disabled={isInvalid}
                    className="btn-sign-in"
                    fullWidth={true}
                    color="primary">
                    Sign In
                </Button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
