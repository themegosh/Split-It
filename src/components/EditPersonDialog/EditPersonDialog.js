import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";

class EditPersonDialog extends Component {
    state = {
        person: this.props.person
    };

    handleCancel = () => {
        this.props.onClose(null);
    };

    handleSave = () => {
        this.props.onClose(this.state.person);
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
            this.props.onClose(this.state.person);
        }
    };

    render() {
        const { person } = this.state;
        const { index, open } = this.props;
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

export default EditPersonDialog;
