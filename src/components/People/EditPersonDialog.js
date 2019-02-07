import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import { withFirebase } from "../Firebase";

class EditPersonDialog extends Component {
    state = {
        person: this.props.person
    };

    handleSave = () => {
        const { person } = this.state;
        const { activityId, personId, firebase } = this.props;
        const userId = this.props.authUser.uid;

        console.log("handleSave", personId);

        if (personId) {
            firebase
                .people(userId, activityId)
                .child(personId)
                .set(person, error => {
                    if (error) {
                        this.setState({ error });
                    } else {
                        console.log("updated person!");
                        this.props.handleClose();
                    }
                });
        } else {
            firebase.people(userId, activityId).push(person, error => {
                if (error) {
                    this.setState({ error });
                } else {
                    console.log("pushed person!");
                    this.props.handleClose();
                }
            });
        }
    };

    onNameChanged = event => {
        let person = Object.assign({}, this.state.person);
        person.name = event.target.value;
        this.setState({ person });
    };

    onKeyPress = e => {
        if (e.key === "Enter") {
            this.handleSave();
        }
    };

    btnDelete = () => {
        const { activityId, personId, firebase, authUser } = this.props;

        firebase
            .people(authUser.uid, activityId)
            .child(personId)
            .remove();
        this.props.handleClose();
    };

    render() {
        const { person } = this.state;
        const { open } = this.props;
        const error = !person.name;

        return (
            <Dialog
                open={open}
                onClose={this.props.handleClose}
                aria-labelledby="form-dialog-title"
                onKeyPress={this.onKeyPress}>
                <DialogTitle id="form-dialog-title">Edit Person</DialogTitle>
                <DialogContent>
                    <FormControl required fullWidth>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="person.name"
                            label="Person Name"
                            type="text"
                            fullWidth
                            value={person.name}
                            onChange={this.onNameChanged}
                            error={!person.name}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.btnDelete} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={this.props.handleClose} color="default">
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

export default withFirebase(EditPersonDialog);
