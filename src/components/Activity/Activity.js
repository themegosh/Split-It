import React, { Component } from "react";
import BillsList from "../Bills/BillsList";
import PeopleList from "../People/PeopleList";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import Dinero from "dinero.js";
import cloneDeep from "lodash/cloneDeep";
import { withStyles, Typography, Card, CardContent } from "@material-ui/core";
import Loader from "../Loader/Loader";

import "./Activity.scss";
import BalanceBreakdown from "../BalanceBreakdown/BalanceBreakdown";

const styles = {};

const toPrice = (amount, factor = Math.pow(10, 2)) => {
    return Dinero({ amount: Math.round(amount * factor) });
};

const processActivity = (bills, people) => {
    let totalCostsPaid = toPrice(0);
    let totalCostsOwed = toPrice(0);

    //find bill cost per person
    Object.keys(bills).forEach(billId => {
        const bill = bills[billId];
        bill.cost = toPrice(bill.cost);
        bill.splitCost = bill.cost.divide(bill.paidFor.length);
        totalCostsPaid = totalCostsPaid.add(bill.cost);
        totalCostsOwed = totalCostsOwed.add(bill.cost);
    });

    //find person's paid and owed totals
    Object.keys(people).forEach(personId => {
        const person = people[personId];

        person.totalCostsPaid = toPrice(0);
        person.totalCostsOwed = toPrice(0);
        person.difference = toPrice(0);

        Object.keys(bills).forEach(billId => {
            const bill = bills[billId];
            if (bill.payer === personId) {
                person.totalCostsPaid = person.totalCostsPaid.add(bill.cost);
            }
            if (isBillOwedBy(people, bill, personId)) {
                person.totalCostsOwed = person.totalCostsOwed.add(
                    bill.splitCost
                );
            }
        });
    });

    //person's difference
    Object.keys(people).forEach(uid => {
        const person = people[uid];
        person.difference = person.totalCostsPaid.subtract(
            person.totalCostsOwed
        );
    });

    //split it
    let splits = [];
    const tmpPeople = cloneDeep(people);

    Object.keys(tmpPeople).forEach(personId => {
        const person = tmpPeople[personId];
        //person.difference = toPrice(person.difference);
        // console.log(
        //     "SPLIT",
        //     person.name,
        //     person.difference.toFormat("$0,0.00")
        // );

        //in the red
        if (person.difference.lessThan(toPrice(0))) {
            //console.log(ower.name, "OWES", ower.difference);
            //find someone to reimburse
            Object.keys(tmpPeople).forEach(reimburseeId => {
                const reimbursee = tmpPeople[reimburseeId];

                if (
                    person.difference.lessThan(toPrice(0)) &&
                    reimbursee.difference.greaterThan(toPrice(0))
                ) {
                    // console.log(
                    //     person.name,
                    //     "OWES",
                    //     person.difference.toFormat("$0,0.00")
                    // );

                    // console.log(
                    //     "found",
                    //     reimbursee.name,
                    //     "is owed",
                    //     reimbursee.difference.toFormat("$0,0.00")
                    // );

                    let amount;
                    if (
                        reimbursee.difference.lessThan(
                            person.difference.multiply(-1)
                        )
                    ) {
                        amount = reimbursee.difference;
                        reimbursee.difference = toPrice(0);

                        // console.log(
                        //     reimbursee.name,
                        //     "is paid off after being given",
                        //     amount.toFormat("$0,0.00"),
                        //     "by",
                        //     person.name
                        // );

                        person.difference = person.difference.add(amount);
                    } else {
                        amount = person.difference.multiply(-1);
                        reimbursee.difference = reimbursee.difference.subtract(
                            amount
                        );

                        // console.log(
                        //     reimbursee.name,
                        //     "was given",
                        //     amount.toFormat("$0,0.00"),
                        //     "by",
                        //     person.name,
                        //     "and still needs",
                        //     reimbursee.difference.toFormat("$0,0.00")
                        // );

                        person.difference = toPrice(0);
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
};

const isBillOwedBy = (people, bill, personId) => {
    for (var i = 0; i < bill.paidFor.length; i++) {
        if (personId === bill.paidFor[i]) {
            return true;
        }
    }
    return false;
};

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

                const processedActivity = processActivity(bills, people);

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

        const { authUser, classes } = this.props;

        const activityId = this.props.match.params.id;

        let splitsTotal = toPrice(0);
        splits.forEach(split => {
            splitsTotal = splitsTotal.add(split.amount);
        });

        return (
            <div className="container-fluid activity">
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        <section>
                            <Card>
                                <CardContent>
                                    <Typography variant="h2" gutterBottom>
                                        {name}
                                    </Typography>
                                </CardContent>
                                <CardContent>
                                    <Typography component="p">
                                        Total Costs Paid:
                                        {totalCostsPaid.toFormat("$0,0.00")}
                                    </Typography>
                                    <Typography component="p">
                                        total Costs Owed:{" "}
                                        {totalCostsOwed.toFormat("$0,0.00")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </section>
                        <section>
                            <div className="row">
                                <div className="col-md-4">
                                    <PeopleList
                                        people={people}
                                        activityId={activityId}
                                        authUser={authUser}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <BillsList
                                        bills={bills}
                                        people={people}
                                        activityId={activityId}
                                        authUser={authUser}
                                    />
                                </div>
                            </div>
                        </section>
                        <section>
                            <BalanceBreakdown splits={splits} />
                        </section>
                    </div>
                )}
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withStyles(styles)(
    withRouter(withAuthorization(condition)(withFirebase(Activity)))
);
