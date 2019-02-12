import React, { Component } from "react";
import { withStyles, Paper } from "@material-ui/core";

import "./Bill.scss";
import PersonIcon from "../People/PersonIcon";
import PersonChip from "../People/PersonChip";

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
            <Paper className="bill-wrapper">
                <div
                    className="bill"
                    onClick={() =>
                        this.props.handleClickOpen(this.props.index, bill)
                    }>
                    <div className="header">
                        <h3 className="name">{bill.name}</h3>
                    </div>
                    <div className="cost-wrapper">
                        <div className="split-cost">
                            <PersonChip name={people[bill.payer].name} />
                        </div>
                        <div>paid</div>
                        <div className="cost">
                            {bill.cost.toFormat("$0,0.00")}
                        </div>
                        <div>({bill.splitCost.toFormat("$0,0.00")} each)</div>
                    </div>
                    <hr />
                    <div className="footer">
                        <div className={classes.paidForWrapper}>
                            {bill.paidFor.map((person, key) => {
                                return (
                                    <PersonIcon
                                        name={people[person].name}
                                        key={key}
                                        className={classes.paidFor}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Bill);
