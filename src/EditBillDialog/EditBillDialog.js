import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

class EditBillDialog extends Component {
    state = {
        bill: this.props.bill
    };

    handleCancel = () => {
        this.props.onClose(null);
    };

    handleSave = () => {
        this.props.onClose(this.state.bill);
    };

    handleDelete = () => {
        this.props.onDelete(this.state.bill);
    };

    onPayerChange = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.payer = event.target.value;
        this.setState({ bill });
    };

    onNameChanged = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.name = event.target.value;
        this.setState({ bill });
    };

    onCostChanged = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.cost = parseFloat(event.target.value);
        this.setState({ bill });
    };

    onKeyPress = e => {
        if (e.key === "Enter") {
            this.props.onClose(this.state.bill);
        }
    };

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.handleCancel}
                aria-labelledby="form-dialog-title"
                onKeyPress={this.onKeyPress}>
                <DialogTitle id="form-dialog-title">Edit Bill</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="bill.name"
                        label="Bill Name"
                        type="text"
                        fullWidth
                        value={this.state.bill.name}
                        onChange={this.onNameChanged}
                    />
                    <TextField
                        margin="dense"
                        id="bill.cost"
                        label="Cost"
                        type="number"
                        fullWidth
                        value={this.state.bill.cost}
                        onChange={this.onCostChanged}
                    />
                    <FormControl fullWidth>
                        <InputLabel htmlFor="bill.payer">Who paid?</InputLabel>
                        <Select
                            value={this.state.bill.payer}
                            onChange={this.onPayerChange}
                            inputProps={{ name: "bill.payer", id: "bill.payer" }}>
                            {this.props.allPeople.map(person => (
                                <MenuItem key={person.name} value={person.name}>
                                    {person.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    {this.props.index !== -1 ? (
                        <Button onClick={this.handleDelete} color="secondary">
                            Delete
                        </Button>
                    ) : null}

                    <Button onClick={this.handleCancel} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default EditBillDialog;
