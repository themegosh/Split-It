import React, { Component } from "react";
import PersonIcon from "./PersonIcon";

import "./Person.scss";
import { Card, withStyles } from "@material-ui/core";
import Currency from "../Currency";

const styles = {
    person: {
        borderTopLeftRadius: "90px",
        borderBottomLeftRadius: "90px",
        width: "100%",
        //maxWidth: "500px",
        height: "100px",
        display: "flex",
        flexDirection: "row",
        color: "#AAAAAA",
        position: "relative",
        marginBottom: "15px",
        flexGrow: 1,
        cursor: "pointer"
    },
    icon: {
        color: "red",
        fontSize: "2em",
        height: "100px",
        width: "100px"
    },
    name: {
        padding: "15px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        fontSize: "1.8em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    spends: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        padding: "15px"
    },
    spendAmount: {
        fontSize: "0.7em",
        textAlign: "right",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    money: {
        marginLeft: "8px",
        color: "#fff",
        fontSize: "1.3em"
    }
};

class Person extends Component {
    render() {
        const { person, classes } = this.props;

        // person = this.props.person || {
        //     name: "",
        //     totalCostsPaid: 0,
        //     totalCostsOwed: 0,
        //     difference: 0
        // };

        return (
            <Card
                className={classes.person} //"person"
                onClick={() =>
                    this.props.handleClickOpen(this.props.index, person)
                }>
                <PersonIcon name={person.name} className={classes.icon} />
                <div className={classes.name}>{person.name}</div>
                <div className={classes.spends}>
                    <div className={classes.spendAmount}>
                        Paid
                        <span className={classes.money}>
                            <Currency money={person.totalCostsPaid} />
                        </span>
                    </div>
                    <div className={classes.spendAmount}>
                        Owed
                        <span className={classes.money}>
                            <Currency money={person.totalCostsOwed} />
                        </span>
                    </div>
                    <div className={classes.spendAmount}>
                        Balance
                        <span className={classes.money}>
                            <Currency money={person.difference} />
                        </span>
                    </div>
                </div>
            </Card>
        );
    }
}

export default withStyles(styles)(Person);
