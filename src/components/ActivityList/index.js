import React, { Component } from "react";
import "./index.scss";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import EditActivityDialog from "../EditActivityDialog/";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class ActivityList extends Component {
    state = {
        open: false,
        selectedActivity: {},
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
                const activities = snapshot.val();

                this.setState({
                    activities,
                    loading: false
                });
            });
    }
    handleActivitySaved = anActivity => {
        // if (anActivity) {
        //     console.log("handleActivitySaved", anActivity);
        //     //shallow copy
        //     let activities = [...this.state.activities];

        //     if (index === -1) {
        //         //adding
        //         activities.push(anActivity);
        //     } else {
        //         //updating
        //         activities[index] = anActivity;
        //     }
        // }
        this.setState({ open: false });
    };

    btnEditActivity = uid => {
        console.log("btnEditActivity", uid);

        const activity = this.state.activities[uid] || {
            name: ""
        };

        this.setState({
            open: true,
            selectedActivity: activity
        });
    };
    btnOpenActivity = uid => {};
    handleBillDeleted = index => {
        console.log("handleBillDeleted", index);
        //shallow copy
        let bills = [...this.state.bills];

        bills.splice(index, 1);
    };
    render() {
        const {
            activities,
            open,
            selectedActivity,
            selectedIndex
        } = this.state;
        const userId = this.props.authUser.uid;

        let editDialog;
        if (open) {
            editDialog = (
                <EditActivityDialog
                    open={open}
                    handleActivitySaved={this.handleActivitySaved}
                    handleDelete={this.handleDelete}
                    activity={selectedActivity}
                    index={selectedIndex}
                    userId={userId}
                />
            );
        }

        return (
            <div className="activities">
                <h1>Activites!</h1>
                {Object.keys(activities).map(uid => {
                    const activity = activities[uid];
                    return (
                        <div key={uid}>
                            <Card>
                                <CardActionArea>
                                    <CardContent>
                                        <Link to={`${ROUTES.ACTIVITY}/${uid}`}>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="h2">
                                                {activity.name}
                                            </Typography>
                                        </Link>
                                    </CardContent>
                                </CardActionArea>
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
