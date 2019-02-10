import React, { Component } from "react";
import "./BillsList.scss";
import EditBillDialog from "./EditBillDialog";
import Bill from "./Bill";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../Firebase";
import { Typography } from "@material-ui/core";

class BillsList extends Component {
    state = {
        open: false,
        bills: [],
        selectedBill: {},
        selectedBillId: null
    };

    componentWillUnmount() {
        this.props.firebase.bills().off();
    }

    componentDidMount() {
        const { activityId, firebase, authUser } = this.props;

        this.setState({ loading: true });

        firebase.bills(authUser.uid, activityId).on("value", snapshot => {
            const bills = snapshot.val();

            this.setState({
                bills,
                loading: false
            });
        });
    }

    handleClickOpen = billId => {
        console.log("handleOpen", billId, this.state.bills);

        const bill = (billId && this.state.bills[billId]) || {
            name: "",
            paidFor: [],
            payer: "",
            cost: 0
        };

        this.setState({
            open: true,
            selectedBill: bill,
            selectedBillId: billId
        });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleDelete = index => {
        console.log("handleDelete", index);
        this.props.handleBillDeleted(index);
        this.setState({ open: false });
    };

    render() {
        const { bills, people, activityId, authUser } = this.props;
        const { selectedBill, selectedBillId, open } = this.state;
        const disablebtnAdd = !Object.keys(people).length;

        let editDialog;
        if (this.state.open) {
            editDialog = (
                <EditBillDialog
                    open={open}
                    onClose={this.handleClose}
                    bill={selectedBill}
                    billId={selectedBillId}
                    people={people}
                    activityId={activityId}
                    authUser={authUser}
                />
            );
        }

        return (
            <div className="bills">
                <Typography variant="h4" gutterBottom>
                    Bills
                </Typography>
                {Object.keys(bills).map(uid => {
                    const bill = bills[uid];
                    return (
                        <Bill
                            key={uid}
                            bill={bill}
                            billId={uid}
                            handleClickOpen={() => this.handleClickOpen(uid)}
                            people={people}
                        />
                    );
                })}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.handleClickOpen()}
                    disabled={disablebtnAdd}>
                    New Bill
                </Button>
                {editDialog}
            </div>
        );
    }
}

export default withFirebase(BillsList);
