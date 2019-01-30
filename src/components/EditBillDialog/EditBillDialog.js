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
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

class EditBillDialog extends Component {
    constructor(props) {
        super();

        let chkPeople = props.allPeople.map((person, key) => {
            return {
                name: person.name,
                checked: props.bill.paidFor.includes(key)
            };
        });

        this.state = {
            bill: props.bill,
            chkPeople
        };
    }
    handleCancel = () => {
        this.props.onClose(null);
    };

    handleSave = () => {
        this.props.onClose(this.state.bill);
    };

    handleDelete = () => {
        this.props.handleDelete(this.state.bill);
    };

    onPayerChange = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.payer = event.target.value;
        console.log("onPayerChange", bill.payer);
        this.setState({ bill });
    };

    onNameChanged = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.name = event.target.value;
        this.setState({ bill });
    };

    onCostChanged = event => {
        let bill = Object.assign({}, this.state.bill);
        bill.cost = event.target.value ? parseFloat(event.target.value) : "";
        this.setState({ bill });
    };

    onKeyPress = e => {
        if (e.key === "Enter") {
            this.props.onClose(this.state.bill);
        }
    };

    onPaidForCheckedChange = key => event => {
        let chkPeople = [...this.state.chkPeople];

        chkPeople[key].checked = event.target.checked;

        let bill = Object.assign({}, this.state.bill);

        bill.paidFor = chkPeople
            .filter(x => x.checked)
            .map((person, key) => {
                return key;
            });

        this.setState({ chkPeople, bill });
    };

    render() {
        const { bill, chkPeople } = this.state;
        const { allPeople, open, index } = this.props;
        const error =
            !bill.name || !bill.cost || !bill.payer || bill.paidFor.length < 1;

        return (
            <Dialog
                open={open}
                onClose={this.handleCancel}
                aria-labelledby="form-dialog-title"
                onKeyPress={this.onKeyPress}>
                <DialogTitle id="form-dialog-title">Edit Bill</DialogTitle>
                <DialogContent>
                    <FormControl required fullWidth>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="bill.name"
                            label="Bill Name"
                            type="text"
                            fullWidth
                            value={bill.name}
                            onChange={this.onNameChanged}
                            error={!bill.name}
                        />
                    </FormControl>
                    <FormControl required fullWidth>
                        <TextField
                            required
                            margin="dense"
                            id="bill.cost"
                            label="Cost"
                            type="number"
                            fullWidth
                            value={bill.cost}
                            onChange={this.onCostChanged}
                            error={!bill.cost}
                        />
                    </FormControl>
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="bill.payer">Who paid?</InputLabel>
                        <Select
                            value={bill.payer}
                            onChange={this.onPayerChange}
                            inputProps={{
                                name: "bill.payer",
                                id: "bill.payer"
                            }}
                            error={!bill.payer}>
                            {allPeople.map((person, key) => (
                                <MenuItem key={key} value={key}>
                                    {person.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        required
                        error={bill.paidFor.length < 1}
                        component="fieldset"
                        margin="dense">
                        <FormLabel component="legend">Paid for</FormLabel>
                        <FormGroup>
                            {chkPeople.map((person, key) => {
                                return (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={person.checked}
                                                onChange={this.onPaidForCheckedChange(
                                                    key
                                                )}
                                                value={person.name}
                                            />
                                        }
                                        label={person.name}
                                        key={key}
                                    />
                                );
                            })}
                        </FormGroup>
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

export default EditBillDialog;
