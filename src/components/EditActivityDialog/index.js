import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import { withFirebase } from "../Firebase";

class EditActivityDialog extends Component {
    state = {
        activity: this.props.activity
    };

    handleCancel = () => {
        this.props.handleActivitySaved(null);
    };

    handleSave = () => {
        const { activity } = this.state;
        console.log("handleSave", activity);

        if (activity.uid) {
            this.props.firebase
                .activities(this.props.userId)
                .child(activity.uid)
                .set(activity)
                .then(thing => {
                    console.log("updated activity!", thing.key);
                })
                .catch(error => {
                    this.setState({ error });
                });
        } else {
            this.props.firebase
                .activities(this.props.userId)
                .push(activity)
                .then(thing => {
                    console.log("pushed activity!", thing.key);
                })
                .catch(error => {
                    this.setState({ error });
                });
        }

        this.props.handleActivitySaved(this.state.activity);
    };

    handleDelete = () => {
        this.props.handleDelete(this.state.activity);
    };

    onNameChanged = event => {
        let activity = Object.assign({}, this.state.activity);
        activity.name = event.target.value;
        this.setState({ activity });
    };

    onKeyPress = e => {
        if (e.key === "Enter" && this.state.activity.name) {
            this.handleSave();
        }
    };

    render() {
        const { activity } = this.state;
        const { index, open } = this.props;
        const error = !activity.name;

        return (
            <Dialog
                open={open}
                onClose={this.handleCancel}
                aria-labelledby="form-dialog-title"
                onKeyPress={this.onKeyPress}>
                <DialogTitle id="form-dialog-title">Edit Activity</DialogTitle>
                <DialogContent>
                    <FormControl required fullWidth>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="activity.name"
                            label="Activity Name"
                            type="text"
                            fullWidth
                            value={activity.name}
                            onChange={this.onNameChanged}
                            error={!activity.name}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    {index !== -1 ? (
                        <Button onClick={this.handleDelete} color="secondary">
                            Delete
                        </Button>
                    ) : null}

                    <Button onClick={this.handleCancel} color="default">
                        Cancel
                    </Button>
                    <Button
                        onClick={this.handleSave}
                        disabled={error}
                        color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withFirebase(EditActivityDialog);
