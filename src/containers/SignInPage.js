import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { SignUpLink } from "./SignUpPage";
import { PasswordForgetLink } from "./PasswordForgetPage";
import { withFirebase } from "../components/Firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";

import * as ROUTES from "../constants/routes";

import "./SignInPage.scss";

const SignInPage = () => (
    <Paper className="small-paper-form" elevation={1}>
        <h1>Sign In</h1>
        <SignInGoogle />
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
    </Paper>
);

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
};

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        const { firebase } = this.props;

        firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                //check if the user is new or old
                return firebase
                    .user(socialAuthUser.user.uid)
                    .once("value")
                    .then(snapshot => {
                        const userObj = snapshot.val();

                        if (!userObj) {
                            return firebase.user(socialAuthUser.user.uid).set({
                                username: socialAuthUser.user.displayName,
                                email: socialAuthUser.user.email,
                                roles: []
                            });
                        } else {
                            return userObj;
                        }
                    });
            })
            .then(() => {
                this.setState({ error: null });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    render() {
        const { error } = this.state;

        return (
            <form onSubmit={this.onSubmit} className="google-sign-in">
                <button class="googleSignIn" type="submit">
                    <img
                        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/G-on-white.svg"
                        alt="Google logo"
                    />
                    <span class="googleSignIn__text">Sign in with Google</span>
                </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

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
                        autoFocus
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
                        autoFocus
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

const SignInGoogle = compose(
    withRouter,
    withFirebase
)(SignInGoogleBase);

export default SignInPage;

export { SignInForm, SignInGoogle };
