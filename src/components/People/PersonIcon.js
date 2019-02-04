import React from "react";
import Avatar from "@material-ui/core/Avatar";

const PersonIcon = props => {
    let initals;
    const { name } = props;
    if (name && name.length > 1) {
        initals = name[0];
        if (name.length > 1) {
            initals += name[1];
        }
    }
    return <Avatar className="person-icon">{initals}</Avatar>;
};

export default PersonIcon;
