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
import { withFirebase } from "../Firebase";
import { withStyles } from "@material-ui/core";

const styles = {
    chkItems: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    chkLabel: {
        flexGrow: 1,
        flexBasis: "20%"
    },
    lblFullWidth: {
        width: "100%"
    },
    lblWithButtonWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
    }
};

class EditBillDialog extends Component {
    constructor(props) {
        super();

        let chkPeople = Object.keys(props.people).map(uid => {
            return {
                name: props.people[uid].name,
                uid: uid,
                checked: props.bill.paidFor.includes(uid)
            };
        });

        this.state = {
            bill: props.bill,
            chkPeople
        };
    }

    btnSaveClick = () => {
        const { bill } = this.state;
        const { billId, firebase, activityId } = this.props;
        const userId = this.props.authUser.uid;

        console.log("handleSave", userId, activityId);

        if (billId) {
            firebase
                .bills(userId, activityId)
                .child(billId)
                .set(bill, error => {
                    if (error) {
                        this.setState({ error });
                    } else {
                        console.log("updated bill!");
                        this.props.onClose();
                    }
                });
        } else {
            firebase.bills(userId, activityId).push(bill, error => {
                if (error) {
                    this.setState({ error });
                } else {
                    console.log("pushed bill!");
                    this.props.onClose();
                }
            });
        }
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
            this.btnSaveClick();
        }
    };

    onPaidForCheckedChange = key => event => {
        let chkPeople = [...this.state.chkPeople];

        chkPeople[key].checked = event.target.checked;

        let bill = Object.assign({}, this.state.bill);

        bill.paidFor = chkPeople
            .filter(x => x.checked)
            .map(person => {
                return person.uid;
            });

        this.setState({ chkPeople, bill });
    };

    btnCheckAll = () => {
        const chkPeople = this.state.chkPeople.map(person => {
            person.checked = true;
            return person;
        });

        let bill = Object.assign({}, this.state.bill);

        bill.paidFor = chkPeople
            .filter(x => x.checked)
            .map(person => {
                return person.uid;
            });

        this.setState({ chkPeople, bill });
    };

    btnDelete = () => {
        const { billId, firebase, activityId, authUser } = this.props;

        firebase
            .bills(authUser.uid, activityId)
            .child(billId)
            .remove();

        this.props.onClose();
    };

    render() {
        const { bill, chkPeople } = this.state;
        const { people, open, classes } = this.props;
        const error =
            !bill.name || !bill.cost || !bill.payer || bill.paidFor.length < 1;

        return (
            <Dialog
                open={open}
                onClose={this.props.onClose}
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
                            {Object.keys(people).map(uid => (
                                <MenuItem key={uid} value={uid}>
                                    {people[uid].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        required
                        error={bill.paidFor.length < 1}
                        component="fieldset"
                        className={classes.lblFullWidth}
                        margin="dense">
                        <div className={classes.lblWithButtonWrapper}>
                            <FormLabel component="legend">Paid for</FormLabel>

                            <Button
                                color="primary"
                                size="small"
                                variant="outlined"
                                onClick={this.btnCheckAll}>
                                Select All
                            </Button>
                        </div>
                        <FormGroup className={classes.chkItems}>
                            {chkPeople.map((person, key) => {
                                return (
                                    <FormControlLabel
                                        className={classes.chkLabel}
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
                    <Button onClick={this.btnDelete} color="secondary">
                        Delete
                    </Button>
                    <Button onClick={this.props.onClose} color="default">
                        Cancel
                    </Button>
                    <Button
                        onClick={this.btnSaveClick}
                        disabled={error}
                        color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(withFirebase(EditBillDialog));
