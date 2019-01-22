import React, { Component } from "react";
import "./Activity.scss";
import BillsList from "../BillsList/BillsList";
import PeopleList from "../PeopleList/PeopleList";

class Activity extends Component {
    state = {
        bills: [
            {
                name: "Hotel",
                cost: 300.51,
                payer: "Dean",
                paidFor: ["Doug", "Dean", "Sean"],
                splitCost: 0
            },
            {
                name: "Car Rental",
                cost: 100.45,
                payer: "Sean",
                paidFor: ["Doug", "Dean", "Sean"],
                splitCost: 0
            }
        ],
        people: [
            { name: "Doug", totalCostsPaid: 0, totalCostsOwed: 0, difference: 0 },
            { name: "Dean", totalCostsPaid: 0, totalCostsOwed: 0, difference: 0 },
            { name: "Sean", totalCostsPaid: 0, totalCostsOwed: 0, difference: 0 }
        ],
        totalCostsPaid: 0,
        totalCostsOwed: 0,
        editBillOpen: false
    };
    componentDidMount() {
        this.setState(this.processActivity(this.state.bills));
    }

    isBillOwedBy(bill, name) {
        for (var i = 0; i < bill.paidFor.length; i++) {
            if (name === bill.paidFor[i]) {
                return true;
            }
        }
        return false;
    }

    handleBillUpdated = (index, aBill) => {
        console.log("handleBillUpdated", aBill, index);
        //shallow copy
        let bills = [...this.state.bills];

        if (index === -1) {
            //adding
            bills.push(aBill);
        } else {
            //updating
            bills[index] = aBill;
        }

        var newState = this.processActivity(bills);
        this.setState(newState);
        console.log("this.state.bills", this.state.bills);
        console.log("this.state.bills newState", newState);
    };

    btnNewBillClicked() {}

    processActivity(bills) {
        let people = this.state.people;
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

            bills.forEach(bill => {
                if (bill.payer === person.name) {
                    person.totalCostsPaid += bill.cost;
                }
                if (this.isBillOwedBy(bill, person.name)) {
                    person.totalCostsOwed += bill.splitCost;
                }
            });
        });

        //person's difference
        people.forEach(person => {
            person.difference = person.totalCostsPaid - person.totalCostsOwed;
        });

        console.log(people, bills);

        return {
            totalCostsOwed,
            totalCostsPaid,
            bills: bills,
            people: this.state.people
        };
    }

    render() {
        const bills = this.state.bills;
        const people = this.state.people;

        return (
            <div className="activities">
                <div className="activities-summary">
                    <div>totalCostsPaid {this.state.totalCostsPaid}</div>
                    <div>totalCostsOwed {this.state.totalCostsOwed}</div>
                </div>
                <div className="middle-wrapper">
                    <BillsList bills={bills} people={people} handleBillUpdated={this.handleBillUpdated} />
                    <PeopleList people={people} />
                </div>
            </div>
        );
    }
}

export default Activity;
