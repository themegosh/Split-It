import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
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
                {/* <Avatar /> */}
                <div className="header">
                    <PersonIcon name={person.name} />
                    <h3 className="name">{person.name}</h3>
                </div>
                <div className="spend-wrapper">
                    <Currency
                        className="spend-value"
                        quantity={person.totalCostsPaid}
                    />
                    <div className="spend-name">Paid</div>
                </div>
                <div className="spend-wrapper">
                    <Currency
                        className="spend-value"
                        quantity={person.totalCostsOwed}
                    />
                    <div className="spend-name">Owed</div>
                </div>
                <div className="spend-wrapper">
                    <Currency
                        className="spend-value"
                        quantity={person.difference}
                    />
                    <div className="spend-name">Balance</div>
                </div>
            </div>
        );
    }
}

export default Person;
