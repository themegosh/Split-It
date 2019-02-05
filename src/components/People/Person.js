import React, { Component } from "react";
import Currency from "react-currency-formatter";
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
                            Paid{" "}
                            <Currency
                                className="spend-value"
                                quantity={person.totalCostsPaid}
                            />
                        </div>
                        <div className="spend-wrapper">
                            Owed{" "}
                            <Currency
                                className="spend-value"
                                quantity={person.totalCostsOwed}
                            />
                        </div>
                        <div className="spend-wrapper">
                            Balance{" "}
                            <Currency
                                className="spend-value"
                                quantity={person.difference}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Person;
