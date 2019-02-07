import React, { Component } from "react";
import "./Activity.scss";
import BillsList from "../Bills/BillsList";
import PeopleList from "../People/PeopleList";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import Currency from "react-currency-formatter";

class Activity extends Component {
    state = {
        name: "",
        bills: [],
        people: [],
        splits: [],
        totalCostsPaid: 0,
        totalCostsOwed: 0,
        editBillOpen: false,
        loading: true
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
                    splits: processedActivity.splits,
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

        //split it
        let splits = [];
        const tmpPeople = JSON.parse(JSON.stringify(people));

        Object.keys(tmpPeople).forEach(personId => {
            const person = tmpPeople[personId];
            console.log("SPLIT", person.name);

            //in the red
            if (person.difference < 0) {
                //console.log(ower.name, "OWES", ower.difference);
                //find someone to reimburse
                Object.keys(tmpPeople).forEach(reimburseeId => {
                    const reimbursee = tmpPeople[reimburseeId];

                    if (person.difference < 0 && reimbursee.difference > 0) {
                        console.log(person.name, "OWES", person.difference);

                        console.log(
                            "found",
                            reimbursee.name,
                            "is owed",
                            reimbursee.difference
                        );

                        let amount = 0;
                        if (reimbursee.difference < -person.difference) {
                            amount = reimbursee.difference;
                            reimbursee.difference = 0;

                            console.log(
                                reimbursee.name,
                                "is paid off after being given",
                                amount,
                                "by",
                                person.name
                            );

                            person.difference += amount;
                        } else {
                            amount = -person.difference;
                            reimbursee.difference -= amount;

                            console.log(
                                reimbursee.name,
                                "was given",
                                amount,
                                "by",
                                person.name,
                                "and still needs",
                                reimbursee.difference
                            );

                            person.difference = 0;
                        }

                        // console.log(
                        //     "ACTION",
                        //     person.name,
                        //     ">",
                        //     amount,
                        //     ">",
                        //     reimbursee.name
                        // );
                        splits.push({
                            from: person,
                            to: reimbursee,
                            amount: amount
                        });
                    }
                });
            }

            //console.log("AFTER DIFF ", person.difference);
        });

        return {
            totalCostsOwed,
            totalCostsPaid,
            bills,
            people,
            splits
        };
    }

    render() {
        const {
            bills,
            totalCostsPaid,
            totalCostsOwed,
            people,
            loading,
            name,
            splits
        } = this.state;

        const { authUser } = this.props;

        const activityId = this.props.match.params.id;

        let splitsTotal = 0;
        splits.forEach(split => {
            splitsTotal += split.amount;
        });

        return (
            <div className="activity">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        <h2>{name}</h2>
                        <div className="activities-summary">
                            <div>
                                Total Costs Paid:{" "}
                                <Currency quantity={totalCostsPaid} />
                            </div>
                            <div>
                                total Costs Owed:{" "}
                                <Currency quantity={totalCostsOwed} />
                            </div>
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
                            <h3>Split! {splitsTotal}</h3>
                            <div>
                                {splits.map((action, key) => {
                                    return (
                                        <h4 key={key}>
                                            {action.from.name} ->
                                            <Currency
                                                quantity={action.amount}
                                            />{" "}
                                            -> {action.to.name}
                                        </h4>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(withFirebase(Activity)));
