import React, { Component } from "react";
import "./Activity.scss";
import BillsList from "../Bills/BillsList";
import PeopleList from "../People/PeopleList";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

class Activity extends Component {
    state = {
        name: "",
        bills: [],
        people: [],
        totalCostsPaid: 0,
        totalCostsOwed: 0,
        editBillOpen: false
    };

    componentWillUnmount() {
        this.props.firebase.activity().off();
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase
            .activity(this.props.authUser.uid, this.props.match.params.id)
            .on("value", snapshot => {
                const activity = snapshot.val();

                if (!activity) {
                    this.props.history.push(ROUTES.HOME);
                    return;
                }

                console.log(
                    "onActivity changes",
                    this.props.authUser.uid,
                    this.props.match.params.id,
                    activity
                );

                const bills = activity.bills || [];
                const people = activity.people || [];

                const processedActivity = this.processActivity(bills, people);

                this.setState({
                    name: activity.name,
                    bills: processedActivity.bills,
                    people: processedActivity.people,
                    totalCostsPaid: processedActivity.totalCostsPaid,
                    totalCostsOwed: processedActivity.totalCostsOwed,
                    loading: false
                });
            });
    }

    isBillOwedBy(people, bill, personId) {
        for (var i = 0; i < bill.paidFor.length; i++) {
            if (personId === bill.paidFor[i]) {
                return true;
            }
        }
        return false;
    }

    processActivity(bills, people) {
        let totalCostsPaid = 0;
        let totalCostsOwed = 0;

        //find bill cost per person
        Object.keys(bills).forEach(billId => {
            const bill = bills[billId];
            bill.splitCost = bill.cost / bill.paidFor.length;
            totalCostsPaid += bill.cost;
            totalCostsOwed += bill.cost;
        });

        //find person's paid and owed totals
        Object.keys(people).forEach(personId => {
            const person = people[personId];

            person.totalCostsPaid = 0;
            person.totalCostsOwed = 0;
            person.difference = 0;

            Object.keys(bills).forEach(billId => {
                const bill = bills[billId];
                if (people[bill.payer].name === person.name) {
                    person.totalCostsPaid += bill.cost;
                }
                if (this.isBillOwedBy(people, bill, personId)) {
                    person.totalCostsOwed += bill.splitCost;
                }
            });
        });

        //person's difference
        Object.keys(people).forEach(uid => {
            const person = people[uid];
            person.difference = person.totalCostsPaid - person.totalCostsOwed;
        });

        return {
            totalCostsOwed,
            totalCostsPaid,
            bills: bills,
            people: people
        };
    }

    render() {
        const {
            bills,
            totalCostsPaid,
            totalCostsOwed,
            people,
            loading,
            name
        } = this.state;

        const { authUser } = this.props;

        const activityId = this.props.match.params.id;

        return (
            <div className="activities">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <h2>{name}</h2>
                        <div className="activities-summary">
                            <div>Total Costs Paid: {totalCostsPaid}</div>
                            <div>total Costs Owed: {totalCostsOwed}</div>
                        </div>
                        <div className="middle-wrapper">
                            <PeopleList
                                people={people}
                                activityId={activityId}
                                authUser={authUser}
                            />
                            <BillsList
                                bills={bills}
                                people={people}
                                activityId={activityId}
                                authUser={authUser}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(withFirebase(Activity)));
