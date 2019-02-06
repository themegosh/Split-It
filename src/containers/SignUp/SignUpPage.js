import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../components/Firebase";
import * as ROUTES from "../../constants/routes";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";

const SignUpPage = () => (
    <Paper className="small-paper-form" elevation={1}>
        <h1>Sign Up</h1>
        {/* <SignInGoogle /> */}
        <SignUpForm />
    </Paper>
);

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne } = this.state;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase.user(authUser.user.uid).set({
                    username,
                    email
                });
            })
            .then(authUser => {
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
        const { username, email, passwordOne, passwordTwo, error } = this.state;
        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            email === "" ||
            username === "";
        return (
            <form onSubmit={this.onSubmit}>
                <FormControl required fullWidth>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="username"
                        name="username"
                        label="Name"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={this.onChange}
                    />
                </FormControl>
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
                        margin="dense"
                        id="passwordOne"
                        name="passwordOne"
                        label="Password"
                        type="password"
                        fullWidth
                        value={passwordOne}
                        onChange={this.onChange}
                    />
                </FormControl>
                <FormControl required fullWidth>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="passwordTwo"
                        name="passwordTwo"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        value={passwordTwo}
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
                    Sign Up
                </Button>
                <Link to={ROUTES.SIGN_IN}>
                    Already have an account? Sign in
                </Link>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
