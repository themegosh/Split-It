import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../components/Navigation";
import SignUpPage from "./SignUp/SignUpPage";
import SignInPage from "./SignIn/SignInPage";
import PasswordForgetPage from "./ForgotPassword/ForgotPasswordPage";
import AccountPage from "./Account/AccountPage";
import ActivityPage from "../components/Activity/Activity";
import ActivityListPage from "../components/Activity/ActivityList";

import * as ROUTES from "../constants/routes";
import { withAuthentication } from "../components/Session";

import "./App.scss";

const App = props => (
    <Router>
        <div>
            <Navigation authUser={props.authUser} />

            <Route exact path={ROUTES.HOME} component={ActivityListPage} />
            <Route
                exact
                path={`${ROUTES.ACTIVITY}/:id`}
                component={ActivityPage}
            />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForgetPage}
            />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        </div>
    </Router>
);

export default withAuthentication(App);
