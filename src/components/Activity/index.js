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
        this.setState({ loading: true });

        this.props.firebase
            .activity(this.props.authUser.uid, this.props.match.params.id)
            .on("value", snapshot => {
                const activity = snapshot.val();

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

        console.log("process", bills);

        //find bill cost per person
        Object.keys(bills).forEach(billId => {
            console.log("foreach", billId);
            const bill = bills[billId];
            console.log("bill.paidFor", bill.paidFor);
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

        console.log("end of processActivity", bills, people);

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
            loading
        } = this.state;
        const activityId = this.props.match.params.id;

        console.log("activityId", activityId);

        return (
            <div className="activities">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <div className="activities-summary">
                            <div>totalCostsPaid {totalCostsPaid}</div>
                            <div>totalCostsOwed {totalCostsOwed}</div>
                        </div>
                        <div className="middle-wrapper">
                            <PeopleList
                                people={people}
                                activityId={activityId}
                            />
                            <BillsList
                                bills={bills}
                                people={people}
                                activityId={activityId}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(withFirebase(Activity));
