import React from "react";
import Dinero from "dinero.js";

const Currency = props => {
    const { money } = props;

    let color;
    if (money.lessThan(Dinero({ amount: 0 }))) {
        color = "red";
    } else if (money.greaterThan(Dinero({ amount: 0 }))) {
        color = "green";
    }

    const style = {
        color: color
    };

    return <span style={style}>{money.toFormat("$0,0.00")}</span>;
};

export default Currency;
