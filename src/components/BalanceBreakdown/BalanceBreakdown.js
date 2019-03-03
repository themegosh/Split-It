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
            <Typography variant="h6" gutterBottom>
                Who do I send money to?
            </Typography>
            <Paper className="paper">
                <table className="table table-borderless">
                    <tbody>
                        {splits.map((action, key) => {
                            return (
                                <tr key={key} className="split">
                                    <td>
                                        <PersonChip
                                            name={action.from.name}
                                            className="person-chip"
                                        />
                                    </td>
                                    <td>
                                        <Typography component="p">
                                            <ArrowForward className="split-direction" />
                                        </Typography>
                                    </td>
                                    <td>
                                        <span className="amount">
                                            {action.amount.toFormat("$0,0.00")}
                                        </span>
                                    </td>
                                    <td>
                                        <Typography component="p">
                                            <ArrowForward className="split-direction" />
                                        </Typography>
                                    </td>
                                    <td>
                                        <PersonChip
                                            name={action.to.name}
                                            className="person-chip"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Paper>
        </div>
    );
};

export default BalanceBreakdown;
