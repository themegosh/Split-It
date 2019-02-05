import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../components/Navigation";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignIn/SignInPage";
import PasswordForgetPage from "./PasswordForgetPage";
import AccountPage from "./AccountPage";
import ActivityPage from "../components/Activity/Activity";
import ActivityListPage from "../components/Activity/ActivityList";

import * as ROUTES from "../constants/routes";
import { withAuthentication } from "../components/Session";

import "./App.scss";

const App = () => (
    <Router>
        <div>
            <Navigation />

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
