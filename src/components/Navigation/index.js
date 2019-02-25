import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { Avatar, IconButton } from "@material-ui/core";

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
        margin: "0 auto",
        fontSize: "2.7em",
        width: "75px",
        height: "75px",
        backgroundColor: "transparent"
    },
    fabIcon: {
        //fontSize: "32px"
    },
    appBar: {
        backgroundColor: "transparent",
        marginBottom: "60px"
    }
};

class Navigation extends React.Component {
    btnHome = () => {
        this.props.history.push(ROUTES.HOME);
    };

    btnSignOut = () => {
        this.props.firebase.doSignOut();
    };

    btnAccountClick = () => {
        this.props.history.push(ROUTES.ACCOUNT);
    };

    render() {
        const { classes, authUser } = this.props;

        let menuButtons;

        if (authUser && authUser.uid) {
            menuButtons = (
                <div>
                    <Tooltip title="Account Settings">
                        <IconButton
                            className={classes.menuButton}
                            onClick={this.btnAccountClick}>
                            <Avatar src={authUser.photoURL} />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.menuButton}
                        onClick={this.btnSignOut}>
                        Sign Out
                    </Button>
                </div>
            );
        } else {
            // menuButtons = (
            //     <IconButton color="inherit">
            //         <MailIcon />
            //     </IconButton>
            // );
        }

        return (
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography
                        onClick={this.btnHome}
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.grow}>
                        Split It
                    </Typography>
                    <Tooltip title="View Activities">
                        <Fab
                            onClick={this.btnHome}
                            color="secondary"
                            className={classes.fabButton}>
                            <span
                                role="img"
                                className={classes.fabIcon}
                                aria-label="Activities">
                                💰
                            </span>
                        </Fab>
                    </Tooltip>
                    {menuButtons}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withFirebase(withRouter(withStyles(styles)(Navigation)));
