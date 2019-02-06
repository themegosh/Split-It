import React from "react";

import { AuthUserContext, withAuthorization } from "../../components/Session";
import PasswordChangeForm from "../ChangePassword/ChangePasswordPage";

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Account: {authUser.email}</h1>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);
