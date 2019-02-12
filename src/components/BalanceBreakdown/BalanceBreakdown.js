import React from "react";
import { Typography, Paper } from "@material-ui/core";
import PersonChip from "../People/PersonChip";
import { ArrowForward } from "@material-ui/icons";
import "./BalanceBreakdown.scss";

const BalanceBreakdown = props => {
    const { splits } = props;

    return (
        <div className="balanace-breakdown">
            <Typography variant="h4" gutterBottom>
                Split It!
            </Typography>
            <Typography variant="h5" gutterBottom>
                Who do I send money to?
            </Typography>
            <Paper className="paper">
                {splits.map((action, key) => {
                    return (
                        <div key={key} className="split">
                            <PersonChip
                                name={action.from.name}
                                className="person-chip"
                            />
                            <ArrowForward className="split-direction" />
                            <span className="amount">
                                {action.amount.toFormat("$0,0.00")}
                            </span>
                            <ArrowForward className="split-direction" />
                            <PersonChip
                                name={action.to.name}
                                className="person-chip"
                            />
                        </div>
                    );
                })}
            </Paper>
        </div>
    );
};

export default BalanceBreakdown;
