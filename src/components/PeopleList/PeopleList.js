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

    handleClickOpen = (index, person) => {
        this.setState({
            open: true,
            selectedPerson: person,
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
            selectedPerson: {
                name: "",
                totalCostsPaid: 0,
                totalCostsOwed: 0,
                difference: 0
            },
            selectedIndex: -1
        });
    };

    render() {
        const { people } = this.props;
        const { open, selectedIndex, selectedPerson } = this.state;

        let editDialog;
        if (open) {
            editDialog = (
                <EditPersonDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    handleDelete={this.handleDelete}
                    person={selectedPerson}
                    index={selectedIndex}
                    allPeople={people}
                />
            );
        }

        return (
            <div className="people">
                <h2>People</h2>
                {people.map((person, key) => {
                    return (
                        <Person
                            person={person}
                            key={key}
                            index={key}
                            handlePersonUpdated={this.handlePersonUpdated}
                            handleClickOpen={this.handleClickOpen}
                        />
                    );
                })}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.btnNewPersonClicked}>
                    New Bill
                </Button>
                {editDialog}
            </div>
        );
    }
}

export default PeopleList;
