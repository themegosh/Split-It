import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

class EditPersonDialog extends Component {
    state = {
        person: this.props.person
    };

    handleSave = () => {
        const { person } = this.state;
        const { activityId, selectedUid, firebase } = this.props;
        const userId = this.props.authUser.uid;

        console.log("handleSave", selectedUid);

        if (selectedUid) {
            firebase
                .people(userId, activityId)
                .child(selectedUid)
                .set(person)
                .then(thing => {
                    console.log("updated person!", thing.key);
                })
                .catch(error => {
                    this.setState({ error });
                });
        } else {
            firebase
                .people(userId, activityId)
                .push(person)
                .then(thing => {
                    console.log("pushed person!", thing.key);
                })
                .catch(error => {
                    this.setState({ error });
                });
        }

        this.props.handleClose();
    };

    handleDelete = () => {
        this.props.handleDelete(this.state.person);
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

    render() {
        const { person } = this.state;
        const { open } = this.props;
        const error = !person.name;

        return (
            <Dialog
                open={open}
                onClose={this.handleCancel}
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(EditPersonDialog));
