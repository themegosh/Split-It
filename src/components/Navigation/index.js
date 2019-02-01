import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LocalAtm from "@material-ui/icons/LocalAtm";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { withFirebase } from "../Firebase";

const styles = {
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    fabButton: {
        position: "absolute",
        zIndex: 1,
        bottom: -30,
        left: 0,
        right: 0,
        margin: "0 auto"
    }
};

class Navigation extends React.Component {
    btnHome = () => {
        this.props.history.push(ROUTES.HOME);
    };

    btnSignOut = () => {
        this.props.firebase.doSignOut();
    };

    render() {
        const { classes, authUser } = this.props;

        let menuButtons;

        if (authUser && authUser.uid) {
            menuButtons = (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.btnSignOut}>
                    Sign Out
                </Button>
            );
        } else {
            // menuButtons = (
            //     <IconButton color="inherit">
            //         <MailIcon />
            //     </IconButton>
            // );
        }

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            onClick={this.btnHome}
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.grow}>
                            Split-It
                        </Typography>
                        <Tooltip title="View Activities">
                            <Fab
                                onClick={this.btnHome}
                                color="secondary"
                                className={classes.fabButton}>
                                <LocalAtm />
                            </Fab>
                        </Tooltip>
                        {menuButtons}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withFirebase(
    withRouter(withAuthentication(withStyles(styles)(Navigation)))
);
