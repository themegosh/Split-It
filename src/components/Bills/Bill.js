import React, { Component } from "react";
import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core";

import "./Bill.scss";
import PersonIcon from "../People/PersonIcon";

const styles = {
    chkItems: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    chkLabel: {
        flexGrow: 1,
        flexBasis: "20%"
    },
    lblFullWidth: {
        width: "100%"
    },
    paidForWrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        flexWrap: "wrap"
    },
    paidFor: {
        margin: "0 5px 20px"
    },
    icon: {}
};

class Bill extends Component {
    render() {
        const { bill, people, classes } = this.props;

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
                            <div className="split-cost">
                                {people[bill.payer].name} paid
                            </div>
                            <div className="cost">
                                {bill.cost.toFormat("$0,0.00")}
                            </div>
                            <div>
                                {" "}
                                ({bill.splitCost.toFormat("$0,0.00")} each)
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className={classes.paidForWrapper}>
                            {bill.paidFor.map((person, key) => {
                                return (
                                    <Chip
                                        key={key}
                                        avatar={
                                            <PersonIcon
                                                name={people[person].name}
                                            />
                                        }
                                        label={people[person].name}
                                        className={classes.paidFor}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Bill);
