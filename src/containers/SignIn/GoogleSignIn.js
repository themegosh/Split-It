import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "../../components/Firebase";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class GoogleSignInBase extends Component {
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

const GoogleSignIn = compose(
    withRouter,
    withFirebase
)(GoogleSignInBase);

export default GoogleSignIn;
