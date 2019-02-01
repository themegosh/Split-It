import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";

import EditActivityDialog from "./EditActivityDialog";

import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

import "./ActivityList.scss";

class ActivityList extends Component {
    state = {
        open: false,
        selectedActivity: {},
        selectedActivityUid: null,
        activities: []
    };

    componentWillUnmount() {
        this.props.firebase.activities().off();
    }

    componentDidMount() {
        console.log("authUser", this.props.authUser.uid);

        this.setState({ loading: true });

        this.props.firebase
            .activities(this.props.authUser.uid)
            .on("value", snapshot => {
                const activities = snapshot.val() || [];

                console.log(
                    "onActivites changed",
                    this.props.authUser.uid,
                    activities
                );

                this.setState({
                    activities,
                    loading: false
                });
            });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    btnEditActivity = uid => {
        console.log("btnEditActivity", uid);

        const activity = this.state.activities[uid] || {
            name: ""
        };

        this.setState({
            open: true,
            selectedActivity: activity,
            selectedActivityUid: uid
        });
    };

    btnDeleteActivity = uid => {
        this.props.firebase
            .activities(this.props.authUser.uid)
            .child(uid)
            .remove();
    };

    render() {
        const {
            activities,
            open,
            selectedActivity,
            selectedActivityUid
        } = this.state;
        const userId = this.props.authUser.uid;

        let editDialog;
        if (open) {
            editDialog = (
                <EditActivityDialog
                    open={open}
                    handleClose={this.handleClose}
                    handleDelete={this.handleDelete}
                    activity={selectedActivity}
                    userId={userId}
                    selectedActivityUid={selectedActivityUid}
                />
            );
        }

        return (
            <div className="activity-list">
                <h1>Activites</h1>
                <h3>Collections of bills to split with people</h3>
                {Object.keys(activities).map(uid => {
                    const activity = activities[uid];
                    return (
                        <div key={uid}>
                            <Card>
                                <Link to={`${ROUTES.ACTIVITY}/${uid}`}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2">
                                                {activity.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            this.btnOpenActivity(uid)
                                        }>
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            this.btnEditActivity(uid)
                                        }>
                                        Rename
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            this.btnDeleteActivity(uid)
                                        }
                                        color="secondary"
                                        size="small">
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </div>
                    );
                })}
                <hr />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.btnEditActivity(null)}>
                    New Activity
                </Button>
                {editDialog}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(ActivityList));
