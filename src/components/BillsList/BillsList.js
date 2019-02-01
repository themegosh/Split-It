import React, { Component } from "react";
import "./BillsList.scss";
import EditBillDialog from "../EditBillDialog/";
import Bill from "../Bill/Bill";
import Button from "@material-ui/core/Button";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

class BillsList extends Component {
    state = {
        open: false,
        selectedIndex: null
    };

    componentWillUnmount() {
        this.props.firebase.bills().off();
    }

    componentDidMount() {
        console.log("authUser", this.props.authUser.uid);

        this.setState({ loading: true });

        this.props.firebase
            .bills(this.props.authUser.uid)
            .on("value", snapshot => {
                const bills = snapshot.val();

                this.setState({
                    bills,
                    loading: false
                });
            });
    }

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
        const { bills, people } = this.props;
        const { selectedActivityUid } = this.state;
        const userId = this.props.authUser.uid;

        let editDialog;
        if (this.state.open) {
            editDialog = (
                <EditBillDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    handleDelete={this.handleDelete}
                    bill={this.state.selectedBill}
                    index={this.state.selectedIndex}
                    selectedActivityUid={selectedActivityUid}
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
                            userId={userId}
                            selectedActivityUid={selectedActivityUid}
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

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(BillsList));
