import React, { Component } from "react";
import "./Person.scss";

class Person extends Component {
    render() {
        let person = this.props.person || {
            name: "",
            totalCostsPaid: 0,
            totalCostsOwed: 0,
            difference: 0
        };

        return (
            <div className="person" onClick={() => this.props.handleClickOpen(this.props.index, person)}>
                <div className="header">
                    <h3 className="name">{person.name}</h3>
                </div>
                <div className="">totalCostsPaid {person.totalCostsPaid}</div>
                <div className="">totalCostsOwed {person.totalCostsOwed}</div>
                <div className="">difference {person.difference}</div>
            </div>
        );
    }
}

export default Person;
