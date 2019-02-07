import React, { Component } from "react";
import PersonIcon from "./PersonIcon";

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
            <div
                className="person"
                onClick={() =>
                    this.props.handleClickOpen(this.props.index, person)
                }>
                <div className="inner">
                    <PersonIcon name={person.name} />
                    <div className="header">
                        <h3 className="name">{person.name}</h3>
                        <div className="spend-wrapper">
                            Paid {person.totalCostsPaid.toFormat("$0,0.00")}
                        </div>
                        <div className="spend-wrapper">
                            Owed {person.totalCostsOwed.toFormat("$0,0.00")}
                        </div>
                        <div className="spend-wrapper">
                            Balance {person.difference.toFormat("$0,0.00")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Person;
