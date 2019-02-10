import React, { Component } from "react";

import { withFirebase } from "../Firebase";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { withAuthorization } from "../Session";
import Typography from "@material-ui/core/Typography";

import EditActivityDialog from "./EditActivityDialog";

import * as ROUTES from "../../constants/routes";
import { withRouter } from "react-router-dom";

import "./ActivityList.scss";
import Loader from "../Loader/Loader";

class ActivityList extends Component {
    state = {
        open: false,
        selectedActivity: {},
        selectedActivityUid: null,
        activities: [],
        loading: true
    };

    componentWillUnmount() {
        this.props.firebase.activities().off();
    }

    componentDidMount() {
        if (!this.props.authUser) {
            return;
        }

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

    btnDeleteActivity = activityId => {
        this.props.firebase
            .activities(this.props.authUser.uid)
            .child(activityId)
            .remove();
    };

    btnGoToActivity = activityId => {
        this.props.history.push(`${ROUTES.ACTIVITY}/${activityId}`);
    };

    render() {
        const {
            activities,
            open,
            selectedActivity,
            selectedActivityUid,
            loading
        } = this.state;
        const userId = this.props.authUser && this.props.authUser.uid;

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
        let loader;
        let activityList;
        if (loading) {
            loader = <Loader />;
        } else {
            activityList = (
                <div style={{ width: "100%" }}>
                    {Object.keys(activities).map(uid => {
                        const activity = activities[uid];
                        return (
                            <Card className="activity-item" key={uid}>
                                <div onClick={() => this.btnGoToActivity(uid)}>
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
                                </div>
                                <CardActions>
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
                        );
                    })}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.btnEditActivity(null)}
                        style={{ width: "100%" }}>
                        New Activity
                    </Button>
                    {editDialog}
                </div>
            );
        }

        return (
            <div className="activity-list">
                <Typography variant="h2" gutterBottom>
                    Activites
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Collections of bills to split with people
                </Typography>
                {loader}
                {activityList}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withRouter(
    withAuthorization(condition)(withFirebase(ActivityList))
);
