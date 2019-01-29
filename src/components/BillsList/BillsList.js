import React, { Component } from "react";
import "./BillsList.scss";
import EditBillDialog from "../EditBillDialog/EditBillDialog";
import Bill from "../Bill/Bill";
import Button from "@material-ui/core/Button";

class BillsList extends Component {
    state = {
        open: false,
        selectedIndex: null
    };

    handleClickOpen = (index, bill) => {
        this.setState({
            open: true,
            selectedBill: bill,
            selectedIndex: index
        });
    };

    handleClose = aBill => {
        if (aBill) {
            this.props.handleBillUpdated(this.state.selectedIndex, aBill);
        }
        this.setState({ open: false });
    };

    handleDelete = index => {
        console.log("handleDelete", index);
        this.props.handleBillDeleted(index);
        this.setState({ open: false });
    };

    btnNewBillClicked = () => {
        this.setState({
            open: true,
            selectedBill: {
                name: "",
                cost: 0,
                payer: "",
                paidFor: [],
                splitCost: 0
            },
            selectedIndex: -1
        });
    };

    render() {
        let bills = this.props.bills;
        let people = this.props.people || [];

        let editDialog;
        if (this.state.open) {
            editDialog = (
                <EditBillDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    handleDelete={this.handleDelete}
                    bill={this.state.selectedBill}
                    index={this.state.selectedIndex}
                    allPeople={people}
                />
            );
        }

        return (
            <div className="bills">
                <h2>Bills</h2>
                {bills.map((bill, key) => {
                    return (
                        <Bill
                            bill={bill}
                            key={key}
                            index={key}
                            people={people}
                            handleBillUpdated={this.handleBillUpdated}
                            handleClickOpen={this.handleClickOpen}
                        />
                    );
                })}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.btnNewBillClicked}>
                    New Bill
                </Button>
                {editDialog}
            </div>
        );
    }
}

export default BillsList;
