import React, { Component } from "react";
import "./BillsList.scss";
import EditBillDialog from "./EditBillDialog";
import Bill from "./Bill";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

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
        const userId = this.props.authUser.uid;
        const { activityId } = this.props;

        this.setState({ loading: true });

        this.props.firebase.bills(userId, activityId).on("value", snapshot => {
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
            payer: ""
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
        const { bills, people, activityId } = this.props;
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
                />
            );
        }

        return (
            <div className="bills">
                <h2>Bills</h2>
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(BillsList));
