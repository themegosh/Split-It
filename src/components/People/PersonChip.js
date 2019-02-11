import React from "react";
import { Chip } from "@material-ui/core";
import PersonIcon from "./PersonIcon";

const avatarStyle = {
    height: "30px",
    width: "30px"
};

const PersonChip = props => {
    const { name } = props;

    return (
        <Chip
            avatar={<PersonIcon name={name} style={avatarStyle} />}
            label={name}
            className={name}
        />
    );
};

export default PersonChip;
