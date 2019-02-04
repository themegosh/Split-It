import React, { Component } from "react";
import "./PeopleList.scss";
import Person from "./Person";
import Button from "@material-ui/core/Button";
import EditPersonDialog from "./EditPersonDialog";
import { withFirebase } from "../Firebase";

class PeopleList extends Component {
    state = {
        open: false,
        people: [],
        selectedId: null,
        selectedPerson: {}
    };

    componentWillUnmount() {
        this.props.firebase.people().off();
    }

    componentDidMount() {
        console.log("PeopleList componentDidMount");
        const userId = this.props.authUser.uid;
        const { activityId } = this.props;

        this.setState({ loading: true });

        this.props.firebase.people(userId, activityId).on("value", snapshot => {
            const people = snapshot.val();

            this.setState({
                people,
                loading: false
            });
        });
    }

    handleClickOpen = uid => {
        const person = (uid && this.state.people[uid]) || {
            name: ""
        };

        this.setState({
            open: true,
            selectedPerson: person,
            selectedId: uid
        });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    // handleDelete = index => {
    //     console.log("handleDelete", index);
    //     this.props.handlePersonDeleted(index);
    //     this.setState({ open: false });
    // };

    render() {
        const { people, activityId } = this.props;
        const { open, selectedId, selectedPerson } = this.state;

        let editDialog;
        if (open) {
            editDialog = (
                <EditPersonDialog
                    open={this.state.open}
                    handleClose={this.handleClose}
                    person={selectedPerson}
                    personId={selectedId}
                    allPeople={people}
                    activityId={activityId}
                />
            );
        }

        return (
            <div className="people">
                <h2>People</h2>
                <div className="people-list">
                    {Object.keys(people).map(uid => {
                        const person = people[uid];
                        return (
                            <Person
                                person={person}
                                key={uid}
                                handleClickOpen={() =>
                                    this.handleClickOpen(uid)
                                }
                                personId={uid}
                            />
                        );
                    })}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleClickOpen(null)}>
                        Add Person
                    </Button>
                    {editDialog}
                </div>
            </div>
        );
    }
}

export default withFirebase(PeopleList);
