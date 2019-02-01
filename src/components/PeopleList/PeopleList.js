import React, { Component } from "react";
import "./PeopleList.scss";
import Person from "../Person/Person";
import Button from "@material-ui/core/Button";
import EditPersonDialog from "../EditPersonDialog/EditPersonDialog";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

class PeopleList extends Component {
    state = {
        open: false,
        people: [],
        selectedPeople: {},
        selectedPeopleUid: null
    };

    componentWillUnmount() {
        this.props.firebase.people().off();
    }

    componentDidMount() {
        const userId = this.props.authUser.uid;
        const { activityId } = this.props;

        this.setState({ loading: true });

        this.props.firebase.people(userId, activityId).on("value", snapshot => {
            const people = snapshot.val();

            console.log("people", people);

            this.setState({
                people,
                loading: false
            });
        });
    }

    handleClickOpen = uid => {
        console.log("handleOpen", this.state);
        const person = (uid && this.state.people[uid]) || {
            name: ""
        };

        this.setState({
            open: true,
            selectedPerson: person,
            selectedUid: uid
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
        const { open, selectedUid, selectedPerson } = this.state;

        let editDialog;
        if (open) {
            editDialog = (
                <EditPersonDialog
                    open={this.state.open}
                    handleClose={this.handleClose}
                    person={selectedPerson}
                    selectedUid={selectedUid}
                    allPeople={people}
                    activityId={activityId}
                />
            );
        }

        return (
            <div className="people">
                <h2>People</h2>
                {Object.keys(people).map(uid => {
                    const person = people[uid];
                    return (
                        <Person
                            person={person}
                            key={uid}
                            handlePersonUpdated={this.handlePersonUpdated}
                            handleClickOpen={() => this.handleClickOpen(uid)}
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
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(PeopleList));
