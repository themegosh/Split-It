import React from "react";

import { AuthUserContext, withAuthorization } from "../../components/Session";
import PasswordChangeForm from "../ChangePassword/ChangePasswordPage";
import { Paper, Avatar, withStyles, Typography } from "@material-ui/core";

const styles = {
    avatar: {
        margin: "0 auto 20px",
        width: 80,
        height: 80
    },
    center: {
        textAlign: "center"
    },
    faded: {
        color: "#757575",
        textAlign: "center",
        marginBottom: "50px"
    }
};

const AccountPage = props => (
    <AuthUserContext.Consumer>
        {authUser => (
            <Paper className="small-paper-form" elevation={1}>
                <Typography
                    variant="h2"
                    gutterBottom
                    className={props.classes.center}>
                    Account
                </Typography>
                <Avatar
                    src={authUser.photoURL}
                    className={props.classes.avatar}
                />
                <Typography
                    variant="h6"
                    gutterBottom
                    className={props.classes.faded}>
                    {authUser.email}
                </Typography>
                <PasswordChangeForm />
            </Paper>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withStyles(styles)(withAuthorization(condition)(AccountPage));
