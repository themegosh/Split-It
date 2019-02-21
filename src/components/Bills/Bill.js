import React, { Component } from "react";
import {
    withStyles,
    Card,
    CardActionArea,
    CardContent,
    Typography
} from "@material-ui/core";

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
            <Card
                className="bill"
                onClick={() =>
                    this.props.handleClickOpen(this.props.index, bill)
                }>
                <CardActionArea>
                    <CardContent>
                        <Typography variant="h5">{bill.name}</Typography>
                    </CardContent>
                </CardActionArea>
                <CardContent>
                    <Typography component="p">
                        {people[bill.payer].name} paid
                    </Typography>
                    <Typography component="p">
                        {bill.cost.toFormat("$0,0.00")}
                    </Typography>
                    <Typography component="p">
                        ({bill.splitCost.toFormat("$0,0.00")} each)
                    </Typography>
                </CardContent>
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
            </Card>
        );
    }
}

export default withStyles(styles)(Bill);
