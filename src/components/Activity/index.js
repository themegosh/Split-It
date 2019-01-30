import React, { Component } from "react";
import "./index.scss";
import BillsList from "../BillsList/BillsList";
import PeopleList from "../PeopleList/PeopleList";

class Activity extends Component {
    state = {
        bills: [
            {
                name: "Hotel",
                cost: 300.51,
                payer: 1,
                paidFor: [0, 1, 2],
                splitCost: 0
            },
            {
                name: "Car Rental",
                cost: 100.45,
                payer: 2,
                paidFor: [0, 2],
                splitCost: 0
            }
        ],
        people: [{ name: "Bob" }, { name: "Joe" }, { name: "Mike" }],
        totalCostsPaid: 0,
        totalCostsOwed: 0,
        editBillOpen: false
    };
    componentDidMount() {
        this.setState(
            this.processActivity(this.state.bills, this.state.people)
        );
    }

    isBillOwedBy(people, bill, name) {
        for (var i = 0; i < bill.paidFor.length; i++) {
            if (name === people[bill.paidFor[i]].name) {
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

        this.setState(this.processActivity(bills, this.state.people));
    };

    handleBillDeleted = index => {
        console.log("handleBillDeleted", index);
        //shallow copy
        let bills = [...this.state.bills];

        bills.splice(index, 1);

        this.setState(this.processActivity(bills, this.state.people));
    };

    handlePersonUpdated = (index, aPerson) => {
        console.log("handlePersonUpdated", aPerson, index);
        //shallow copy
        let people = [...this.state.people];

        if (index === -1) {
            //adding
            people.push(aPerson);
        } else {
            //updating
            people[index] = aPerson;
        }

        this.setState(this.processActivity(this.state.bills, people));
    };

    handlePersonDeleted = index => {
        console.log("handlePersonDeleted", index);
        //shallow copy
        let people = [...this.state.people];

        people.splice(index, 1);

        this.setState(this.processActivity(this.state.bills, people));
    };

    processActivity(bills, people) {
        console.log("processActivity", bills, people);

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

        console.log(people, bills);

        return {
            totalCostsOwed,
            totalCostsPaid,
            bills: bills,
            people: people
        };
    }

    render() {
        const { bills, totalCostsPaid, totalCostsOwed, people } = this.state;

        return (
            <div className="activities">
                <div className="activities-summary">
                    <div>totalCostsPaid {totalCostsPaid}</div>
                    <div>totalCostsOwed {totalCostsOwed}</div>
                </div>
                <div className="middle-wrapper">
                    <BillsList
                        bills={bills}
                        people={people}
                        handleBillUpdated={this.handleBillUpdated}
                        handleBillDeleted={this.handleBillDeleted}
                        handlePersonDeleted={this.handlePersonDeleted}
                    />
                    <PeopleList
                        people={people}
                        handlePersonUpdated={this.handlePersonUpdated}
                    />
                </div>
            </div>
        );
    }
}

export default Activity;
