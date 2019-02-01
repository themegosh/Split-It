import React, { Component } from "react";
import "./index.scss";
import BillsList from "../BillsList/BillsList";
import PeopleList from "../PeopleList/PeopleList";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

class Activity extends Component {
    state = {
        bills: [
            // {
            //     name: "Hotel",
            //     cost: 300.51,
            //     payer: 1,
            //     paidFor: [0, 1, 2],
            //     splitCost: 0
            // },
            // {
            //     name: "Car Rental",
            //     cost: 100.45,
            //     payer: 2,
            //     paidFor: [0, 2],
            //     splitCost: 0
            // }
        ],
        people: [
            // { name: "Bob" }, { name: "Joe" }, { name: "Mike" }
        ],
        totalCostsPaid: 0,
        totalCostsOwed: 0,
        editBillOpen: false
    };

    componentWillUnmount() {
        this.props.firebase.activity().off();
    }

    componentDidMount() {
        const activityId = this.props.match.params.id;
        const userId = this.props.authUser.uid;
        console.log("activityId", activityId);
        // this.setState(
        //     this.processActivity(this.state.bills, this.state.people)
        // );

        console.log("authUser", userId);

        this.setState({ loading: true });

        this.props.firebase
            .activity(userId, activityId)
            .on("value", snapshot => {
                const activity = snapshot.val();

                console.log("activity", activity);

                const bills = activity.bills || [];
                const people = activity.people || [];

                this.setState({
                    bills,
                    people,
                    loading: false
                });
            });
    }

    isBillOwedBy(people, bill, name) {
        for (var i = 0; i < bill.paidFor.length; i++) {
            if (name === people[bill.paidFor[i]].name) {
                return true;
            }
        }
        return false;
    }

    processActivity(bills, people) {
        let totalCostsPaid = 0;
        let totalCostsOwed = 0;

        //find bill cost per person
        bills.forEach(bill => {
            bill.splitCost = bill.cost / bill.paidFor.length;
            totalCostsPaid += bill.cost;
            totalCostsOwed += bill.cost;
        });

        //find person's paid and owed totals
        people.forEach(person => {
            person.totalCostsPaid = 0;
            person.totalCostsOwed = 0;
            person.difference = 0;

            bills.forEach(bill => {
                if (people[bill.payer].name === person.name) {
                    person.totalCostsPaid += bill.cost;
                }
                if (this.isBillOwedBy(people, bill, person.name)) {
                    person.totalCostsOwed += bill.splitCost;
                }
            });
        });

        //person's difference
        people.forEach(person => {
            person.difference = person.totalCostsPaid - person.totalCostsOwed;
        });

        console.log("end of processActivity", bills, people);

        return {
            totalCostsOwed,
            totalCostsPaid,
            bills: bills,
            people: people
        };
    }

    render() {
        const { bills, totalCostsPaid, totalCostsOwed, people } = this.state;
        const activityId = this.props.match.params.id;

        return (
            <div className="activities">
                <div className="activities-summary">
                    <div>totalCostsPaid {totalCostsPaid}</div>
                    <div>totalCostsOwed {totalCostsOwed}</div>
                </div>
                <div className="middle-wrapper">
                    <PeopleList people={people} activityId={activityId} />
                    <BillsList
                        bills={bills}
                        people={people}
                        handlePersonDeleted={this.handlePersonDeleted}
                        activityId={activityId}
                    />
                </div>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(Activity));
