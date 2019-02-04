import React, { Component } from "react";
import Currency from "react-currency-formatter";

import "./Bill.scss";

class Bill extends Component {
    render() {
        const { bill, people } = this.props;

        return (
            <div className="bill-wrapper">
                <div
                    className="bill"
                    onClick={() =>
                        this.props.handleClickOpen(this.props.index, bill)
                    }>
                    <div className="header">
                        <h3 className="name">{bill.name}</h3>
                        <div className="cost-wrapper">
                            <div className="cost">
                                {" "}
                                <Currency quantity={bill.cost} />
                            </div>
                            <div className="split-cost">
                                (<Currency quantity={bill.splitCost} /> each)
                            </div>
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
