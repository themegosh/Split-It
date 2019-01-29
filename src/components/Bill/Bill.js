import React, { Component } from "react";
import "./Bill.scss";

class Bill extends Component {
    render() {
        let bill = this.props.bill;
        let people = this.props.people;

        return (
            <div className="bill-wrapper">
                <div className="bill" onClick={() => this.props.handleClickOpen(this.props.index, bill)}>
                    <div className="header">
                        <h3 className="name">{bill.name}</h3>
                        <div className="cost-wrapper">
                            <div className="cost"> ${bill.cost}</div>
                            <div className="split-cost"> (${bill.splitCost} each)</div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="payer">{people[bill.payer].name} </div>
                        paid for
                        <div className="paid-for-wrapper">
                            {bill.paidFor.map((person, key) => {
                                return (
                                    <div className="name" key={key}>
                                        {people[person].name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Bill;
