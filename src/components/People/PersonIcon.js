import React from "react";
import Avatar from "@material-ui/core/Avatar";

function hashCode(str) {
    // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i) {
    var c = (i & 0x00ffffff).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}
function getColorByBgColor(bgColor) {
    if (!bgColor) {
        return "";
    }
    return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
        ? "#000"
        : "#fff";
}

const PersonIcon = props => {
    let initals;
    const { name } = props;
    if (name && name.length > 1) {
        initals = name[0];
        if (name.length > 1) {
            initals += name[1];
        }
    }

    //console.log(hashCode(props.name));

    const bgColor = "#" + intToRGB(hashCode(props.name));

    const iconStyles = {
        backgroundColor: bgColor,
        color: getColorByBgColor(bgColor)
    };

    return (
        <Avatar className="person-icon" style={iconStyles}>
            {initals}
        </Avatar>
    );
};

export default PersonIcon;
