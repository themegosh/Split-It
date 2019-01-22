import React, { Component } from "react";
import "./PeopleList.scss";
import Person from "../Person/Person";
import Button from "@material-ui/core/Button";
import EditPersonDialog from "../EditPersonDialog/EditPersonDialog";

class PeopleList extends Component {
    state = {
        open: false,
        selectedIndex: null
    };

    handleClickOpen = (index, bill) => {
        this.setState({
            open: true,
            selectedPerson: bill,
            selectedIndex: index
        });
    };

    handleClose = aPerson => {
        if (aPerson) {
            this.props.handlePersonUpdated(this.state.selectedIndex, aPerson);
        }
        this.setState({ open: false });
    };

    handleDelete = index => {
        console.log("handleDelete", index);
        this.props.handlePersonDeleted(index);
        this.setState({ open: false });
    };

    btnNewPersonClicked = () => {
        this.setState({
            open: true,
            selectedPerson: { name: "", totalCostsPaid: 0, totalCostsOwed: 0, difference: 0 },
            selectedIndex: -1
        });
    };

    render() {
        let people = this.props.people;

        let editDialog;
        if (this.state.open) {
            editDialog = (
                <EditPersonDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    handleDelete={this.handleDelete}
                    person={this.state.selectedPerson}
                    index={this.state.selectedIndex}
                    allPeople={people}
                />
            );
        }

        return (
            <div className="people">
                <h2>People</h2>
                {people.map((person, key) => {
                    return <Person person={person} key={key} />;
                })}
                <Button variant="contained" color="primary" onClick={this.btnNewPersonClicked}>
                    New Bill
                </Button>
                {editDialog}
            </div>
        );
    }
}

export default PeopleList;
